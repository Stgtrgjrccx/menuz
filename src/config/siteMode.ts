// Detect whether current runtime is dedicated Customer Site, Owner/Partner Site, or Master HQ Site
export type SiteMode = 'customer' | 'owner' | 'hq';

export function getSiteMode(): SiteMode {
  // 1. Explicit environment variable set at build time
  const envMode = import.meta.env.VITE_SITE_MODE;
  if (envMode === 'owner' || envMode === 'customer' || envMode === 'hq') {
    return envMode;
  }

  // 2. Domain / Hostname auto-detection (e.g. menuz-hq.onrender.com vs menuz-owner.onrender.com vs menuz-customer.onrender.com)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('hq') || host.includes('admin') || host.includes('command')) {
      return 'hq';
    }
    if (host.includes('owner') || host.includes('partner') || host.includes('manage') || host.includes('operator')) {
      return 'owner';
    }
  }

  // Default to customer site
  return 'customer';
}

export const CURRENT_SITE_MODE: SiteMode = getSiteMode();
export const IS_HQ_SITE = CURRENT_SITE_MODE === 'hq';
export const IS_OWNER_SITE = CURRENT_SITE_MODE === 'owner';
export const IS_CUSTOMER_SITE = CURRENT_SITE_MODE === 'customer';
