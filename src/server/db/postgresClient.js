import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let isInitialized = false;
let sslDisabled = false;

/**
 * Cleanly sanitize connection string for safe log outputs without leaking credentials
 */
export function sanitizeConnectionString(connStr) {
  if (!connStr) return 'none';
  try {
    const parsed = new URL(connStr);
    return `${parsed.protocol}//${parsed.username}:***@${parsed.host}${parsed.pathname}`;
  } catch {
    return 'configured (redacted)';
  }
}

/**
 * Resolve the database connection URL from environment variables
 */
export function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL || null;
}

/**
 * Initialize and return the pg connection pool
 */
export function getPool(forceNoSsl = false) {
  if (pool && !forceNoSsl) return pool;
  if (pool && forceNoSsl) {
    try { pool.end(); } catch (e) {}
    pool = null;
  }

  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    return null;
  }

  const isNeon = connectionString.includes('neon.tech');
  const isRenderInternal = connectionString.includes('dpg-') && !connectionString.includes('.render.com');
  const requiresSsl = !sslDisabled && !forceNoSsl && !isRenderInternal && (
    isNeon ||
    connectionString.includes('sslmode=require') ||
    connectionString.includes('.render.com')
  );

  pool = new Pool({
    connectionString,
    ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
    max: isNeon ? 15 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL/Neon client:', err.message);
  });

  return pool;
}

/**
 * Verify database connectivity and measure latency
 */
export async function testConnection() {
  const p = getPool();
  if (!p) {
    return { connected: false, error: 'DATABASE_URL is not set' };
  }

  const start = Date.now();
  try {
    const client = await p.connect();
    try {
      const res = await client.query('SELECT 1 as ping, current_database() as db_name, version() as version');
      const latencyMs = Date.now() - start;
      return {
        connected: true,
        latencyMs,
        database: res.rows[0].db_name,
        version: res.rows[0].version?.split(' ')[0] || 'PostgreSQL'
      };
    } finally {
      client.release();
    }
  } catch (err) {
    // If SSL handshake failed because server does not support SSL (Render internal network)
    if (!sslDisabled && (err.message.includes('does not support SSL') || err.message.includes('SSL'))) {
      console.log('[PostgreSQL] Server does not require/support SSL. Reconnecting over private network without SSL...');
      sslDisabled = true;
      getPool(true);
      return testConnection();
    }
    return {
      connected: false,
      error: err.message,
      latencyMs: Date.now() - start
    };
  }
}

/**
 * Execute DDL schema to ensure all required tables, constraints, and indexes exist
 */
export async function initPostgresSchema() {
  if (isInitialized) return true;
  const p = getPool();
  if (!p) return false;

  const schemaFile = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaFile)) {
    throw new Error('schema.sql not found at ' + schemaFile);
  }

  const ddl = fs.readFileSync(schemaFile, 'utf8');
  const client = await p.connect();
  try {
    await client.query('BEGIN');
    await client.query(ddl);
    await client.query('COMMIT');
    isInitialized = true;
    console.log('✅ PostgreSQL / Neon schema verified and ready.');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to initialize PostgreSQL schema:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Helper to run query with error interception
 */
export async function query(text, params = []) {
  const p = getPool();
  if (!p) throw new Error('Database pool not available');
  return p.query(text, params);
}

/**
 * Helper to run a series of queries in a transaction
 */
export async function withTransaction(callback) {
  const p = getPool();
  if (!p) throw new Error('Database pool not available');
  const client = await p.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Close pool gracefully on server shutdown
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    isInitialized = false;
  }
}
