// Menuz Realtime Cloud & Cross-Tab Synchronization Manager
import { useRestaurantStore } from '../store/restaurantStore';

class CloudSyncManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private isPublishing = false;
  private isApplyingRemoteUpdate = false;
  private apiUrl: string = 'http://localhost:4000';
  private hasInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiUrl = this.resolveApiUrl();
      try {
        this.broadcastChannel = new BroadcastChannel('menuz_cloud_sync');
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingUpdate(event.data);
        };
      } catch (e) {
        // BroadcastChannel not supported in this environment
      }

      window.addEventListener('storage', (e) => {
        if (e.key?.startsWith('menuz_')) {
          this.syncFromLocalStorage();
        }
      });
    }
  }

  private resolveApiUrl(): string {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) {
        return 'http://localhost:4000';
      }
    }
    return import.meta.env.VITE_SYNC_API_URL || 'https://menuz-api.onrender.com';
  }

  public init() {
    if (this.hasInitialized || typeof window === 'undefined') return;
    this.hasInitialized = true;
    this.apiUrl = this.resolveApiUrl();

    // 1. Initial sync with cloud
    this.fetchCloudState();

    // 2. Connect to SSE stream for live real-time pushing
    this.connectRealtimeStream();

    // 3. Periodic fallback poll every 3.5s to guarantee 100% sync reliability
    setInterval(() => {
      this.fetchCloudState();
    }, 3500);
  }

  private connectRealtimeStream() {
    if (typeof EventSource === 'undefined') return;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      const sseUrl = `${this.apiUrl}/api/events`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SYNC_UPDATE' && data.state) {
            this.handleIncomingUpdate(data.state);
          }
        } catch (e) {
          // ignore heartbeat or parse issue
        }
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Attempt reconnect after 5 seconds
        setTimeout(() => {
          if (!this.eventSource) {
            this.connectRealtimeStream();
          }
        }, 5000);
      };
    } catch (e) {
      // ignore
    }
  }

  public async fetchCloudState() {
    try {
      const res = await fetch(`${this.apiUrl}/api/state`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const state = await res.json();
        if (state && (state.restaurants?.length > 0 || state.menuItems?.length > 0)) {
          this.handleIncomingUpdate(state);
        }
      }
    } catch (e) {
      // Cloud API not yet reachable or offline, continue with local store
    }
  }

  public async publishState(state: any) {
    if (this.isPublishing || this.isApplyingRemoteUpdate) return;
    this.isPublishing = true;

    try {
      const payload = {
        restaurants: state.restaurants || [],
        menuItems: state.menuItems || [],
        tables: state.tables || [],
        categories: state.categories || [],
        challenges: state.challenges || [],
        timestamp: Date.now()
      };

      // 1. Broadcast locally to all open browser tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage(payload);
      }

      // 2. Send to Cloud Sync API asynchronously
      fetch(`${this.apiUrl}/api/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      }).catch(() => {
        // Fallback gracefully if API is offline
      });

    } finally {
      this.isPublishing = false;
    }
  }

  private handleIncomingUpdate(data: any) {
    if (!data) return;

    try {
      this.isApplyingRemoteUpdate = true;
      const store = useRestaurantStore.getState();

      // Merge restaurants if newer
      if (Array.isArray(data.restaurants) && data.restaurants.length > 0) {
        const existingMap = new Map(store.restaurants.map(r => [r.id, r]));
        let changed = false;

        for (const r of data.restaurants) {
          if (!existingMap.has(r.id) || JSON.stringify(existingMap.get(r.id)) !== JSON.stringify(r)) {
            existingMap.set(r.id, r);
            changed = true;
          }
        }

        if (changed) {
          const updatedRestaurants = Array.from(existingMap.values());
          useRestaurantStore.setState({ restaurants: updatedRestaurants });
          try {
            localStorage.setItem('menuz_custom_onboarded_restaurants', JSON.stringify(updatedRestaurants));
            localStorage.setItem('menuz_permanent_restaurant_vault_v1', JSON.stringify(updatedRestaurants));
            localStorage.setItem('menuz_multi_restaurant_store_dedicated_v2', JSON.stringify(updatedRestaurants));
          } catch (e) {}
        }
      }

      // Merge menu items if provided
      if (Array.isArray(data.menuItems) && data.menuItems.length > 0) {
        const existingItemMap = new Map(store.menuItems.map(m => [m.id, m]));
        let changedItems = false;

        for (const item of data.menuItems) {
          if (!existingItemMap.has(item.id) || JSON.stringify(existingItemMap.get(item.id)) !== JSON.stringify(item)) {
            existingItemMap.set(item.id, item);
            changedItems = true;
          }
        }

        if (changedItems) {
          useRestaurantStore.setState({ menuItems: Array.from(existingItemMap.values()) });
        }
      }

      // Merge tables if provided
      if (Array.isArray(data.tables) && data.tables.length > 0) {
        const existingTableMap = new Map(store.tables.map(t => [t.id, t]));
        let changedTables = false;

        for (const t of data.tables) {
          if (!existingTableMap.has(t.id) || JSON.stringify(existingTableMap.get(t.id)) !== JSON.stringify(t)) {
            existingTableMap.set(t.id, t);
            changedTables = true;
          }
        }

        if (changedTables) {
          useRestaurantStore.setState({ tables: Array.from(existingTableMap.values()) });
        }
      }

      // Merge categories if provided
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        const existingCatMap = new Map(store.categories.map(c => [c.id, c]));
        let changedCats = false;

        for (const c of data.categories) {
          if (!existingCatMap.has(c.id) || JSON.stringify(existingCatMap.get(c.id)) !== JSON.stringify(c)) {
            existingCatMap.set(c.id, c);
            changedCats = true;
          }
        }

        if (changedCats) {
          useRestaurantStore.setState({ categories: Array.from(existingCatMap.values()) });
        }
      }

      // Merge challenges if provided
      if (Array.isArray(data.challenges) && data.challenges.length > 0) {
        const existingChalMap = new Map(store.challenges.map(c => [c.id, c]));
        let changedChals = false;

        for (const c of data.challenges) {
          if (!existingChalMap.has(c.id) || JSON.stringify(existingChalMap.get(c.id)) !== JSON.stringify(c)) {
            existingChalMap.set(c.id, c);
            changedChals = true;
          }
        }

        if (changedChals) {
          useRestaurantStore.setState({ challenges: Array.from(existingChalMap.values()) });
        }
      }

    } catch (e) {
      console.warn('Could not merge incoming cloud state:', e);
    } finally {
      setTimeout(() => {
        this.isApplyingRemoteUpdate = false;
      }, 400);
    }
  }

  private syncFromLocalStorage() {
    try {
      useRestaurantStore.persist?.rehydrate();
    } catch (e) {
      // ignore
    }
  }
}

export const cloudSyncManager = new CloudSyncManager();
