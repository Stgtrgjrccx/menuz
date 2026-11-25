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

/**
 * PREVIEW LISTINGS — 15 real Pune restaurants shown on the map so the app does not look
 * empty while few restaurants have signed up. They have NOT signed up with Menuz.
 * Remove this list (and its use in CustomerHomePage) once real partners fill the map.
 *
 * Ratings are copied from the project's own Pune directory, which describes them as
 * approximate aggregates. They are not read live from Google. Locations are approximate
 * (within a few hundred metres), checked to fall in the right neighbourhood.
 */
export interface PreviewRestaurant {
  slug: string;
  name: string;
  cuisine: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
}

export const PREVIEW_RESTAURANTS: PreviewRestaurant[] = [
  { slug: "kayani-bakery", name: "Kayani Bakery", cuisine: "Parsi Bakery, Shrewsbury Biscuits", area: "Camp", lat: 18.5149, lng: 73.8783, rating: 4.7 },
  { slug: "le-plaisir", name: "Le Plaisir", cuisine: "European Bistro, Patisserie", area: "Prabhat Road", lat: 18.5166, lng: 73.838, rating: 4.7 },
  { slug: "toit-pune", name: "Toit Pune", cuisine: "Microbrewery, Woodfired Pizza", area: "Koregaon Park", lat: 18.5367, lng: 73.8937, rating: 4.7 },
  { slug: "vaishali-restaurant", name: "Vaishali Restaurant", cuisine: "South Indian, Filter Coffee", area: "FC Road", lat: 18.5233, lng: 73.8412, rating: 4.6 },
  { slug: "blue-tokai-coffee-roasters-koregaon-park", name: "Blue Tokai Coffee Roasters - Koregaon Park", cuisine: "Specialty Coffee, Flat Whites", area: "Koregaon Park", lat: 18.5388, lng: 73.8918, rating: 4.6 },
  { slug: "paasha-jw-marriott", name: "Paasha - JW Marriott", cuisine: "Rooftop North Indian, Dal Paasha", area: "Senapati Bapat Road", lat: 18.5335, lng: 73.8277, rating: 4.8 },
  { slug: "chitale-bandhu-mithaiwale", name: "Chitale Bandhu Mithaiwale", cuisine: "Maharashtrian Sweets, Bakarwadi", area: "Deccan Gymkhana", lat: 18.5162, lng: 73.8414, rating: 4.6 },
  { slug: "hotel-dehaati", name: "Hotel Dehaati", cuisine: "Authentic Kolhapuri Thali, Pandhara Tambda Rassa", area: "Prabhat Road", lat: 18.5135, lng: 73.8353, rating: 4.7 },
  { slug: "effingut-brewerkz", name: "Effingut Brewerkz", cuisine: "Craft Beer, BBQ", area: "Koregaon Park", lat: 18.5368, lng: 73.8913, rating: 4.6 },
  { slug: "elephant-co-baner", name: "Elephant & Co. Baner", cuisine: "Japanese, Asian", area: "Baner", lat: 18.5594, lng: 73.7838, rating: 4.8 },
  { slug: "dohiti-art-cafe-patisserie", name: "Dohiti Art Cafe & Patisserie", cuisine: "French Patisserie, Artisanal Viennoiserie", area: "Viman Nagar", lat: 18.5679, lng: 73.9143, rating: 4.7 },
  { slug: "cafe-paashh", name: "Cafe Paashh", cuisine: "Organic European, Farm to Table", area: "Kalyani Nagar", lat: 18.5476, lng: 73.903, rating: 4.5 },
  { slug: "malaka-spice", name: "Malaka Spice", cuisine: "Pan-Asian, Thai", area: "Koregaon Park", lat: 18.5385, lng: 73.8918, rating: 4.4 },
  { slug: "ukiyo", name: "Ukiyo", cuisine: "Modern Japanese Fine Dining, Sushi", area: "Yerawada", lat: 18.553, lng: 73.887, rating: 4.8 },
  { slug: "independence-brewing-company", name: "Independence Brewing Company", cuisine: "Craft Beer, BBQ", area: "Baner", lat: 18.5722, lng: 73.7799, rating: 4.6 }
];
