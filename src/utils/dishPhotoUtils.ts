import { MenuItem, DishGalleryImage } from '../types';

/**
 * Curated high-definition culinary photo collections for multiple perspective angles.
 * Used when a menu item has only 1 photo, guaranteeing every single dish has 3-4 photos to toggle.
 */
const CUISINE_PHOTO_ANGLES: Record<string, string[]> = {
  pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop'
  ],
  pasta: [
    'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3d5d62810ef?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop'
  ],
  biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop'
  ],
  tandoor: [
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop'
  ],
  curry: [
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop'
  ],
  seafood: [
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'
  ],
  bread: [
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop'
  ],
  dessert: [
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop'
  ],
  beverage: [
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop'
  ],
  salad: [
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop'
  ],
  default: [
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop'
  ]
};

/**
 * Returns an array of at least 3-4 unique photo URLs for any dish.
 */
export function getDishPhotos(dish: MenuItem): string[] {
  if (!dish) return CUISINE_PHOTO_ANGLES.default;
  const list: string[] = [];

  // 1. Check existing gallery_images
  if (Array.isArray(dish.gallery_images) && dish.gallery_images.length > 0) {
    dish.gallery_images.forEach((g: any) => {
      const src = typeof g === 'string' ? g : g?.src;
      if (src && !list.includes(src)) {
        list.push(src);
      }
    });
  }

  // 2. Add dish primary image_url if missing
  if (dish.image_url && !list.includes(dish.image_url)) {
    list.unshift(dish.image_url);
  }

  // 3. If dish has multiple photos already, return them!
  if (list.length >= 3) {
    return list;
  }

  // 4. Guarantee every item has multiple photos (3-4 photos) with authentic angles
  const nameLower = (dish.name || '').toLowerCase();
  const descLower = (dish.short_description || dish.full_description || '').toLowerCase();
  const catLower = (dish.category_id || '').toLowerCase();

  let pool = CUISINE_PHOTO_ANGLES.default;
  if (nameLower.includes('pizza') || descLower.includes('pizza')) {
    pool = CUISINE_PHOTO_ANGLES.pizza;
  } else if (nameLower.includes('pasta') || nameLower.includes('spaghetti') || nameLower.includes('lasagna') || nameLower.includes('tagliolini')) {
    pool = CUISINE_PHOTO_ANGLES.pasta;
  } else if (nameLower.includes('biryani') || nameLower.includes('pulao') || descLower.includes('dum pukht') || nameLower.includes('rice')) {
    pool = CUISINE_PHOTO_ANGLES.biryani;
  } else if (nameLower.includes('tikka') || nameLower.includes('kebab') || nameLower.includes('tandoor') || nameLower.includes('paneer') || nameLower.includes('starter') || nameLower.includes('samosa') || nameLower.includes('tikki')) {
    pool = CUISINE_PHOTO_ANGLES.tandoor;
  } else if (nameLower.includes('curry') || nameLower.includes('dal') || nameLower.includes('makhani') || nameLower.includes('gravy') || nameLower.includes('chicken') || nameLower.includes('nihari') || nameLower.includes('mutton')) {
    pool = CUISINE_PHOTO_ANGLES.curry;
  } else if (nameLower.includes('prawn') || nameLower.includes('fish') || nameLower.includes('crab') || nameLower.includes('jheenga')) {
    pool = CUISINE_PHOTO_ANGLES.seafood;
  } else if (nameLower.includes('naan') || nameLower.includes('roti') || nameLower.includes('paratha') || nameLower.includes('bread') || nameLower.includes('kulcha') || nameLower.includes('sheermal')) {
    pool = CUISINE_PHOTO_ANGLES.bread;
  } else if (nameLower.includes('cake') || nameLower.includes('dessert') || nameLower.includes('tiramisu') || nameLower.includes('pastry') || nameLower.includes('sweet') || nameLower.includes('kulfi') || nameLower.includes('tukda') || nameLower.includes('rabdi') || nameLower.includes('fondue')) {
    pool = CUISINE_PHOTO_ANGLES.dessert;
  } else if (nameLower.includes('lassi') || nameLower.includes('cooler') || nameLower.includes('brew') || nameLower.includes('tea') || nameLower.includes('coffee') || nameLower.includes('kahwa') || catLower.includes('bev')) {
    pool = CUISINE_PHOTO_ANGLES.beverage;
  } else if (nameLower.includes('bhel') || nameLower.includes('salad') || nameLower.includes('burrata') || nameLower.includes('avocado')) {
    pool = CUISINE_PHOTO_ANGLES.salad;
  }

  for (const angle of pool) {
    if (!list.includes(angle)) {
      list.push(angle);
    }
    if (list.length >= 4) break;
  }

  return list;
}

/**
 * Returns structured DishGalleryImage objects for a dish, ensuring multiple angles with labels.
 */
export function getDishGalleryImages(dish: MenuItem): DishGalleryImage[] {
  const urls = getDishPhotos(dish);
  const labels = [
    'Main Presentation',
    'Angle 02 Plating View',
    'Angle 03 Texture & Garnish',
    'Angle 04 Table Setting'
  ];

  return urls.map((src, idx) => ({
    src,
    label: labels[idx] || `Angle 0${idx + 1}`,
    code: `# 0${idx + 1}`
  }));
}
