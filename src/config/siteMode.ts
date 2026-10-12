// Detect whether current runtime is dedicated Customer Site, Owner/Partner Site, or Master HQ Site
export type SiteMode = 'customer' | 'owner' | 'hq';

export function getSiteMode(): SiteMode {
  // 1. Explicit environment variable set at build time (e.g. vite build --mode customer / owner / hq)
  const envMode = (import.meta.env.VITE_SITE_MODE || import.meta.env.MODE) as SiteMode;
  if (envMode === 'customer' || envMode === 'owner' || envMode === 'hq') {
    return envMode;
  }

  if (typeof window !== 'undefined') {
    // 2. URL Query parameter explicit overrides (e.g. ?mode=owner, ?mode=hq, ?mode=customer)
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const full = `${path} ${hash} ${search}`;

    if (search.includes('mode=owner') || search.includes('mode=partner') || search.includes('mode=manage')) {
      return 'owner';
    }
    if (search.includes('mode=hq') || search.includes('mode=admin')) {
      return 'hq';
    }
    if (search.includes('mode=customer') || search.includes('mode=diner')) {
      return 'customer';
    }

    // 3. Path & Hash detection (supports both standard pathnames and HashRouter fragments)
    if (
      full.includes('/restaurant') ||
      full.includes('/owner') ||
      full.includes('/partner') ||
      full.includes('/manage') ||
      full.includes('#/manage') ||
      full.includes('/dashboard') ||
      full.includes('#/dashboard')
    ) {
      return 'owner';
    }
    if (full.includes('/hq') || full.includes('#/hq') || full.includes('/admin') || full.includes('#/admin')) {
      return 'hq';
    }
    if (full.includes('/customer') || full.includes('#/customer') || full.includes('/diner') || full.includes('#/diner')) {
      return 'customer';
    }

    // 4. Domain / Hostname auto-detection (e.g. menuz-hq.onrender.com vs menuz-owner.onrender.com vs menuz-customer.onrender.com)
    const host = window.location.hostname.toLowerCase();
    if (host.includes('hq') || host.includes('command')) {
      return 'hq';
    }
    if (host.includes('owner') || host.includes('operator')) {
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

/**
 * Robust cross-site URL resolvers:
 * Resolves absolute URLs between Customer, Owner, and HQ deployments
 * across GitHub Pages, Render, and Local Dev environments.
 */
export function getCustomerSiteUrl(subpath: string = ''): string {
  if (typeof window === 'undefined') return subpath || '/customer/';
  const cleanSubpath = subpath.startsWith('/') ? subpath.slice(1) : subpath;
  const host = window.location.hostname.toLowerCase();

  // 1. GitHub Pages
  if (host.includes('github.io')) {
    if (cleanSubpath.startsWith('?') || cleanSubpath.startsWith('#')) {
      return `https://${window.location.hostname}/menuz/customer/${cleanSubpath}`;
    }
    return `https://${window.location.hostname}/menuz/customer/${cleanSubpath ? cleanSubpath : ''}`;
  }

  // 2. Render deployments
  if (host.includes('onrender.com')) {
    return `https://menuz-customer.onrender.com/${cleanSubpath}`;
  }

  // 3. Localhost / Single server
  const pathname = window.location.pathname;
  let basePath = '/';
  if (pathname.includes('/hq')) {
    basePath = pathname.substring(0, pathname.indexOf('/hq')) + '/';
  } else if (pathname.includes('/owner')) {
    basePath = pathname.substring(0, pathname.indexOf('/owner')) + '/';
  } else if (pathname.includes('/restaurant')) {
    basePath = pathname.substring(0, pathname.indexOf('/restaurant')) + '/';
  } else if (pathname.includes('/customer')) {
    basePath = pathname.substring(0, pathname.indexOf('/customer')) + '/';
  } else {
    basePath = pathname.endsWith('/') ? pathname : pathname + '/';
  }

  if (cleanSubpath.startsWith('?') || cleanSubpath.startsWith('#')) {
    return `${window.location.origin}${basePath}customer/${cleanSubpath}`;
  }
  return `${window.location.origin}${basePath}${cleanSubpath ? cleanSubpath : 'customer/'}`;
}

export function getOwnerSiteUrl(subpath: string = ''): string {
  if (typeof window === 'undefined') return subpath || '/restaurant/';
  const cleanSubpath = subpath.startsWith('/') ? subpath.slice(1) : subpath;
  const host = window.location.hostname.toLowerCase();

  // 1. GitHub Pages
  if (host.includes('github.io')) {
    if (cleanSubpath.startsWith('?') || cleanSubpath.startsWith('#')) {
      return `https://${window.location.hostname}/menuz/restaurant/${cleanSubpath}`;
    }
    return `https://${window.location.hostname}/menuz/restaurant/${cleanSubpath ? cleanSubpath : ''}`;
  }

  // 2. Render deployments
  if (host.includes('onrender.com')) {
    return `https://menuz-owner.onrender.com/${cleanSubpath}`;
  }

  // 3. Localhost / Single server
  const pathname = window.location.pathname;
  let basePath = '/';
  if (pathname.includes('/hq')) {
    basePath = pathname.substring(0, pathname.indexOf('/hq')) + '/';
  } else if (pathname.includes('/owner')) {
    basePath = pathname.substring(0, pathname.indexOf('/owner')) + '/';
  } else if (pathname.includes('/restaurant')) {
    basePath = pathname.substring(0, pathname.indexOf('/restaurant')) + '/';
  } else if (pathname.includes('/customer')) {
    basePath = pathname.substring(0, pathname.indexOf('/customer')) + '/';
  } else {
    basePath = pathname.endsWith('/') ? pathname : pathname + '/';
  }

  if (cleanSubpath.startsWith('?') || cleanSubpath.startsWith('#')) {
    return `${window.location.origin}${basePath}restaurant/${cleanSubpath}`;
  }
  return `${window.location.origin}${basePath}restaurant/${cleanSubpath}`;
}

export function getHqSiteUrl(subpath: string = ''): string {
  if (typeof window === 'undefined') return subpath || '/hq/';
  const cleanSubpath = subpath.startsWith('/') ? subpath.slice(1) : subpath;
  const host = window.location.hostname.toLowerCase();

  // 1. GitHub Pages
  if (host.includes('github.io')) {
    if (cleanSubpath.startsWith('?') || cleanSubpath.startsWith('#')) {
      return `https://${window.location.hostname}/menuz/hq/${cleanSubpath}`;
    }
    return `https://${window.location.hostname}/menuz/hq/${cleanSubpath ? cleanSubpath : ''}`;
  }

  // 2. Render deployments
  if (host.includes('onrender.com')) {
    return `https://menuz-hq.onrender.com/${cleanSubpath}`;
  }

  // 3. Localhost / Single server
  const pathname = window.location.pathname;
  let basePath = '/';
  if (pathname.includes('/hq')) {
    basePath = pathname.substring(0, pathname.indexOf('/hq')) + '/';
  } else if (pathname.includes('/owner')) {
    basePath = pathname.substring(0, pathname.indexOf('/owner')) + '/';
  } else if (pathname.includes('/restaurant')) {
    basePath = pathname.substring(0, pathname.indexOf('/restaurant')) + '/';
  } else if (pathname.includes('/customer')) {
    basePath = pathname.substring(0, pathname.indexOf('/customer')) + '/';
  } else {
    basePath = pathname.endsWith('/') ? pathname : pathname + '/';
  }

  if (cleanSubpath.startsWith('?') || cleanSubpath.startsWith('#')) {
    return `${window.location.origin}${basePath}hq/${cleanSubpath}`;
  }
  return `${window.location.origin}${basePath}hq/${cleanSubpath}`;
}

