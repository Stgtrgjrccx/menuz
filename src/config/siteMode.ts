// Detect whether current runtime is dedicated Customer Site, Owner/Partner Site, or Master HQ Site
export type SiteMode = 'customer' | 'owner' | 'hq';

export function getSiteMode(): SiteMode {
  if (typeof window !== 'undefined') {
    // 1. URL Query parameter overrides (e.g. ?mode=owner, ?mode=hq, ?mode=customer)
    const search = window.location.search.toLowerCase();
    if (search.includes('mode=owner') || search.includes('mode=partner') || search.includes('mode=manage')) {
      return 'owner';
    }
    if (search.includes('mode=hq') || search.includes('mode=admin')) {
      return 'hq';
    }
    if (search.includes('mode=customer') || search.includes('mode=diner')) {
      return 'customer';
    }

    // 2. Hash routing inspection (e.g. #/manage, #/owner, #/kitchen, #/admin, #/hq)
    const hash = window.location.hash.toLowerCase();
    if (
      hash.startsWith('#/manage') ||
      hash.startsWith('#/owner') ||
      hash.startsWith('#/dashboard') ||
      hash.startsWith('#/operations') ||
      hash.startsWith('#/restaurant')
    ) {
      return 'owner';
    }
    if (hash.startsWith('#/admin') || hash.startsWith('#/hq')) {
      return 'hq';
    }

    // 3. Pathname detection (e.g. /owner/, /owner, /hq/, /hq)
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/owner') || path.includes('/partner') || path.includes('/manage')) {
      return 'owner';
    }
    if (path.includes('/hq') || path.includes('/admin')) {
      return 'hq';
    }

    // 4. Domain / Hostname auto-detection (e.g. menuz-hq.onrender.com vs menuz-owner.onrender.com vs menuz-customer.onrender.com)
    const host = window.location.hostname.toLowerCase();
    if (host.includes('hq') || host.includes('admin') || host.includes('command')) {
      return 'hq';
    }
    if (host.includes('owner') || host.includes('partner') || host.includes('manage') || host.includes('operator')) {
      return 'owner';
    }
  }

  // 5. Explicit environment variable set at build time (e.g. vite build --mode owner)
  const envMode = import.meta.env.VITE_SITE_MODE;
  if (envMode === 'owner' || envMode === 'customer' || envMode === 'hq') {
    return envMode;
  }

  // Default to customer site
  return 'customer';
}

export const CURRENT_SITE_MODE: SiteMode = getSiteMode();
export const IS_HQ_SITE = CURRENT_SITE_MODE === 'hq';
export const IS_OWNER_SITE = CURRENT_SITE_MODE === 'owner';
export const IS_CUSTOMER_SITE = CURRENT_SITE_MODE === 'customer';
