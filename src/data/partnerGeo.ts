/**
 * Where each signed-up partner is on the map, and its Google rating.
 *
 * Only restaurants that have signed up with Menuz are ever shown to customers, so this
 * file only needs an entry per partner — the wider Pune directory stays backend-only.
 *
 * HONESTY RULE: a `google` rating is shown to diners as "Google", so it must be a real
 * number copied from the restaurant's Google listing. Never enter an estimate. A partner
 * with no `google` entry simply shows no rating until one is added.
 *
 * Coordinates marked `precision: 'area'` are an approximate point inside the neighbourhood,
 * not the front door. Replace with a street-level lookup when the owner supplies an address.
 */
export interface PartnerGeo {
  lat: number;
  lng: number;
  precision: 'area' | 'street' | 'door';
  google?: { rating: number; count: number };
}

export const PARTNER_GEO: Record<string, PartnerGeo> = {
  // Demo partners: placeholder points inside Koregaon Park, and NO Google rating
  // because neither is a real listing.
  'saffron-house': { lat: 18.5362, lng: 73.894, precision: 'area' },
  'casa-bella-trattoria': { lat: 18.5398, lng: 73.8902, precision: 'area' },
  'casa-bella': { lat: 18.5398, lng: 73.8902, precision: 'area' }
};

/** Centre of the map when the app opens: Koregaon Park / central Pune. */
export const PUNE_CENTER: [number, number] = [73.8863, 18.5362];

export function geoFor(slug: string): PartnerGeo | undefined {
  return PARTNER_GEO[slug];
}
