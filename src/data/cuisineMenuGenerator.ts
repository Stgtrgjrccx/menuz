import { MenuItem, MenuCategory } from '../types';
import { findAuthenticPuneMenu } from './authenticPuneMenus';

export interface GeneratedMenuData {
  categories: MenuCategory[];
  dishes: MenuItem[];
}

export type GeneratedDishInput = Omit<MenuItem, 'pairing_item_ids'> & {
  pairing_item_ids?: string[];
};

function finalizeMenu(categories: MenuCategory[], dishes: GeneratedDishInput[]): GeneratedMenuData {
  return {
    categories,
    dishes: dishes.map((d) => ({
      pairing_item_ids: [],
      ...d
    })) as MenuItem[]
  };
}

/**
 * Generates authentic culinary dishes and categories tailored strictly to the
 * restaurant's identity and cuisine type.
 *
 * 1. FIRST checks for dedicated scanned real-world menus for iconic Pune landmarks
 *    (Vaishali, Cafe Goodluck, Kayani Bakery, Marz-O-Rin, Dorabjee & Sons, Blue Nile,
 *     Sujata Mastani, Chitale Bandhu, Bedekar, Kata Kirr, Wadeshwar, Arthur's Theme,
 *     Le Plaisir, Malaka Spice, Toit, Effingut, Doolally, Camp Burger, Durvankur,
 *     Hotel Shreyas, Sukanta, Kalyan Bhel, We Idliwale, Ginkgo, Paasha, Ukiyo,
 *     German Bakery, Dario's, KMCY, Cafe Goa, etc.).
 *
 * 2. SECONDLY applies deeply authentic regional cuisine generators (Maharashtrian Thali,
 *    Irani/Parsi, Coastal Malvani Seafood, Craft Brewery, South Indian Tiffin,
 *    Sourdough Pizza/Italian, Pan-Asian Dim Sum, Chaat/Street Food, Continental Cafe,
 *    North Indian Mughlai).
 */
export function generateCuisineMenu(
  restaurantId: string,
  restaurantSlug: string,
  cuisine: string,
  _restaurantName?: string
): GeneratedMenuData {
  const lowerCuisine = (cuisine || '').toLowerCase();
  const slug = restaurantSlug || 'venue';

  // ── STEP 1: Check Scanned Authentic Pune Landmark Blueprint ──
  const authenticBlueprint = findAuthenticPuneMenu(_restaurantName, restaurantSlug);
  if (authenticBlueprint) {
    const categories: MenuCategory[] = authenticBlueprint.categories.map((c) => ({
      id: `cat-${slug}-${c.idSuffix}`,
      restaurant_id: restaurantId,
      name: c.name,
      sort_order: c.sort_order,
      is_active: true
    }));

    const dishes: GeneratedDishInput[] = authenticBlueprint.dishes.map((d, idx) => ({
      id: `item-${slug}-${idx + 1}`,
      restaurant_id: restaurantId,
      category_id: `cat-${slug}-${d.categorySuffix}`,
      name: d.name,
      price: d.price,
      short_description: d.short_description,
      full_description: d.full_description || d.short_description,
      ingredients: d.ingredients,
      allergens: d.allergens,
      dietary_flags: d.dietary_flags,
      spice_level: d.spice_level,
      serving_size: d.serving_size,
      image_url: d.image_url,
      is_available: true,
      is_signature: d.is_signature ?? (idx === 0),
      is_bestseller: d.is_bestseller ?? true,
      is_chef_recommended: d.is_chef_recommended ?? (idx < 2),
      chef_notes: (d as any).chef_notes,
      chef_story: (d as any).chef_story,
      owner_pitch: (d as any).owner_pitch,
      pairing_drink_name: (d as any).pairing_drink_name,
      pairing_reason: (d as any).pairing_reason,
      temperature_style: (d as any).temperature_style,
      sort_order: idx + 1
    }));

    return finalizeMenu(categories, dishes);
  }

  // ── STEP 2: REGIONAL AUTHENTIC CUISINE GENERATORS ───────────

  // A. MAHARASHTRIAN / THALI / KOLHAPURI / PUNERI / MISAL / MARATHA
  if (
    lowerCuisine.includes('maharashtrian') ||
    lowerCuisine.includes('thali') ||
    lowerCuisine.includes('kolhapuri') ||
    lowerCuisine.includes('puneri') ||
    lowerCuisine.includes('misal') ||
    lowerCuisine.includes('maratha') ||
    lowerCuisine.includes('sukka') ||
    lowerCuisine.includes('rassa')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-thali`, restaurant_id: restaurantId, name: 'Special Feast Thalis', sort_order: 1, is_active: true },
      { id: `cat-${slug}-sukka`, restaurant_id: restaurantId, name: 'Special Mutton & Chicken Sukka', sort_order: 2, is_active: true },
      { id: `cat-${slug}-veg`, restaurant_id: restaurantId, name: 'Pithla Bhakri & Vegetarian Classics', sort_order: 3, is_active: true },
      { id: `cat-${slug}-sweets`, restaurant_id: restaurantId, name: 'Traditional Sweets & Solkadhi', sort_order: 4, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-mh-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-thali`,
        name: 'Special Kolhapuri Mutton Thali (with Tambda & Pandhra Rassa)',
        price: 490,
        short_description: 'Tender goat mutton sukka cooked in black kala masala, unlimited hot Tambda (red) and Pandhra (white) rassa, 2 Jowar/Bajra Bhakris, and Indrayani rice.',
        full_description: 'The crowning glory of Western Maharashtra culinary heritage. The mutton is braised in cold-pressed groundnut oil with roasted dry coconut and stone-ground spices.',
        ingredients: ['Mutton', 'Kala Masala', 'Dry Coconut', 'Bone Broth', 'Jowar Bhakri', 'Indrayani Rice'],
        allergens: [],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 4,
        serving_size: 'Full Thali Meal for 1',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-mh-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-sukka`,
        name: 'Chicken Sukka with Kombdi Vade',
        price: 380,
        short_description: 'Country chicken slow-roasted with caramelized onions, roasted coconut, and Malvani spices, served with 4 fluffy fried multi-grain kombdi vade.',
        full_description: 'Konkan-Maratha specialty featuring fragrant, crispy, deep-fried vade made of rice and split gram flour.',
        ingredients: ['Chicken', 'Dry Coconut Paste', 'Malvani Garam Masala', 'Fluffy Kombdi Vade'],
        allergens: ['Gluten'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-mh-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-veg`,
        name: 'Zunka Bhakri with Hirvi Mirchi Thecha',
        price: 210,
        short_description: 'Gram flour seasoned with mustard, garlic, and turmeric cooked dry on tawa, served with warm jowar bhakri, raw onion, and fiery green chili thecha.',
        full_description: 'The rustic heart of Maharashtra farmers’ cuisine.',
        ingredients: ['Gram Flour (Besan)', 'Garlic', 'Green Chili Thecha', 'Jowar Bhakri', 'Raw Onions'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 3,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      },
      {
        id: `item-${slug}-mh-4`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-sweets`,
        name: 'Chilled Coconut Solkadhi',
        price: 60,
        short_description: 'Traditional pink digestive drink made from freshly pressed coconut milk, wild Amsul (kokum) extract, garlic, and fresh coriander.',
        full_description: 'A cooling palate cleanser that balances fiery rassa spices.',
        ingredients: ['Fresh Coconut Milk', 'Kokum', 'Garlic', 'Green Chili', 'Rock Salt'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: '250 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 4
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // B. IRANI CAFE / PARSI / KHEEMA / BUN MASKA
  if (
    lowerCuisine.includes('irani') ||
    lowerCuisine.includes('parsi') ||
    lowerCuisine.includes('bun maska') ||
    lowerCuisine.includes('kheema')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-breakfast`, restaurant_id: restaurantId, name: 'Irani Bakery & Bun Maska', sort_order: 1, is_active: true },
      { id: `cat-${slug}-kheema`, restaurant_id: restaurantId, name: 'Iconic Kheema & Egg Plates', sort_order: 2, is_active: true },
      { id: `cat-${slug}-chai`, restaurant_id: restaurantId, name: 'Special Dum Chai & Custard', sort_order: 3, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-irani-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-kheema`,
        name: 'Mutton Kheema Pav with Sunny Egg',
        price: 250,
        short_description: 'Slow-simmered spiced minced goat meat braised with caramelized onions, green chilies, topped with a fried egg and served with hot buttered ladi pav.',
        full_description: 'Classic Irani cafe breakfast standard cooked in bone-marrow fat and seasoned with stone-ground garam masala.',
        ingredients: ['Minced Mutton', 'Farm Egg', 'Ladi Pav', 'Onions', 'Ginger-Garlic', 'Butter'],
        allergens: ['Egg', 'Gluten', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-irani-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-breakfast`,
        name: 'Warm Bun Maska with Amul Butter',
        price: 60,
        short_description: 'Pillow-soft bakery bun sliced and stuffed with a thick layer of salted Amul butter.',
        full_description: 'Dip into hot Irani chai for the quintessential morning ritual.',
        ingredients: ['Fresh Bun', 'Salted Butter'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Bun',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-irani-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-chai`,
        name: 'Special Irani Dum Chai',
        price: 35,
        short_description: 'Simmered black tea layered with thick sweetened condensed milk infused with green cardamom.',
        full_description: 'Creamy, rich, and aromatic.',
        ingredients: ['Black Tea', 'Condensed Milk', 'Cardamom', 'Sugar'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Cup',
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // C. SEAFOOD / MALVANI / KONKANI / COASTAL / FISH
  if (
    lowerCuisine.includes('seafood') ||
    lowerCuisine.includes('malvani') ||
    lowerCuisine.includes('konkani') ||
    lowerCuisine.includes('coastal') ||
    lowerCuisine.includes('fish') ||
    lowerCuisine.includes('prawn')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-fry`, restaurant_id: restaurantId, name: 'Crispy Coastal Rava Fish Fry', sort_order: 1, is_active: true },
      { id: `cat-${slug}-curry`, restaurant_id: restaurantId, name: 'Authentic Malvani Curries & Thalis', sort_order: 2, is_active: true },
      { id: `cat-${slug}-sides`, restaurant_id: restaurantId, name: 'Bhakri, Rice & Solkadhi', sort_order: 3, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-sea-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-fry`,
        name: 'Surmai (Kingfish) Rava Fry',
        price: 480,
        short_description: 'Thick fresh kingfish steak marinated in fiery Malvani red chili-kokum paste, crusted in semolina (rava) and crisp-fried in groundnut oil.',
        full_description: 'Golden crunchy crust with flaky, juicy, ocean-fresh fish inside. Garnished with onion rings and lemon.',
        ingredients: ['Fresh Surmai Steak', 'Semolina (Rava)', 'Byadgi Chili Paste', 'Kokum Agal', 'Garlic'],
        allergens: ['Fish', 'Gluten'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: '1 Large Steak',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-sea-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-curry`,
        name: 'Malvani Prawns Curry with Steamed Rice',
        price: 440,
        short_description: 'Succulent sea prawns simmered in freshly ground coconut, triphala, and roasted coriander curry, served with piping hot rice.',
        full_description: 'Homestyle Konkani recipe cooked in clay pot with fresh coconut extract.',
        ingredients: ['Sea Prawns', 'Fresh Coconut Paste', 'Triphala', 'Kokum', 'Steamed Rice'],
        allergens: ['Shellfish'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 2,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-sea-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-sides`,
        name: 'Chilled Coconut Solkadhi',
        price: 65,
        short_description: 'Freshly extracted coconut milk infused with wild kokum, garlic, and fresh green chilies.',
        full_description: 'Essential accompaniment for any coastal seafood meal.',
        ingredients: ['Coconut Milk', 'Kokum', 'Garlic', 'Green Chili', 'Pink Salt'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: '250 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // D. CRAFT BREWERY / GASTROPUB / TAPROOM / PUB / BEER
  if (
    lowerCuisine.includes('brew') ||
    lowerCuisine.includes('beer') ||
    lowerCuisine.includes('pub') ||
    lowerCuisine.includes('taproom') ||
    lowerCuisine.includes('gastropub')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-brews`, restaurant_id: restaurantId, name: 'Handcrafted Beers on Tap', sort_order: 1, is_active: true },
      { id: `cat-${slug}-appetizers`, restaurant_id: restaurantId, name: 'Tapas & Loaded Pub Bites', sort_order: 2, is_active: true },
      { id: `cat-${slug}-pizza`, restaurant_id: restaurantId, name: 'Woodfired Sourdough Pizzas', sort_order: 3, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-brew-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-brews`,
        name: 'Belgian Witbier Pint (Craft Brew)',
        price: 350,
        short_description: 'Crisp, unfiltered hazy wheat beer brewed with imported coriander seeds and sweet orange peel. Light and citrusy.',
        full_description: 'ABV 4.8% | IBU 14. Poured fresh from temperature-controlled cellar tanks.',
        ingredients: ['Malted Wheat', 'Barley', 'Orange Peel', 'Coriander Seeds', 'Belgian Yeast'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '500 ml Pint',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-brew-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-appetizers`,
        name: 'Fiery Buffalo Chicken Wings',
        price: 420,
        short_description: 'Crispy fried wings tossed in rich butter hot sauce, served with blue cheese dip and crisp celery.',
        full_description: 'Classic American brewpub favorite with authentic vinegary cayenne heat.',
        ingredients: ['Chicken Wings', 'Louisiana Hot Sauce', 'Butter', 'Blue Cheese Dip'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 3,
        serving_size: '8 Wings',
        image_url: 'https://images.unsplash.com/photo-1527477321055-436158a2b00d?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-brew-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-pizza`,
        name: 'Woodfired Sourdough Margherita Pizza',
        price: 540,
        short_description: '72-hour slow-fermented crust topped with crushed San Marzano tomatoes, fresh Fior di Latte mozzarella, and sweet basil.',
        full_description: 'Blistered in a wood-fired stone oven at 450°C.',
        ingredients: ['Sourdough Crust', 'San Marzano Tomatoes', 'Fior di Latte Mozzarella', 'EVOO', 'Basil'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '11 Inch Pizza',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // E. CHAAT / STREET FOOD / MITHAI
  if (
    lowerCuisine.includes('chaat') ||
    lowerCuisine.includes('street') ||
    lowerCuisine.includes('bhel') ||
    lowerCuisine.includes('mithai') ||
    lowerCuisine.includes('sweets')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-chaat`, restaurant_id: restaurantId, name: 'Signature Chaat Specialties', sort_order: 1, is_active: true },
      { id: `cat-${slug}-farsan`, restaurant_id: restaurantId, name: 'Crisp Farsan & Savouries', sort_order: 2, is_active: true },
      { id: `cat-${slug}-sweets`, restaurant_id: restaurantId, name: 'Heritage Mithai & Desserts', sort_order: 3, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-chaat-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-chaat`,
        name: 'Sev Potato Dahi Puri (SPDP)',
        price: 110,
        short_description: 'Crisp handcrafted puris filled with spiced potato mash, sweetened dahi, tamarind date chutney, and a mountain of crunchy sev.',
        full_description: 'Pune’s quintessential street food crown jewel.',
        ingredients: ['Crisp Puris', 'Potatoes', 'Sweet Dahi', 'Tamarind Chutney', 'Nylon Sev'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '6 Puris',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-chaat-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-chaat`,
        name: 'Special Puneri Matki Bhel',
        price: 85,
        short_description: 'Fresh puffed rice tossed with boiled sprouted matki, raw mango, diced onions, spicy green chutney, and farsan.',
        full_description: 'Light, crunchy, and tangy snack.',
        ingredients: ['Puffed Rice', 'Sprouted Matki', 'Nylon Sev', 'Onions', 'Tamarind Chutney'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '1 Plate',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: false,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-chaat-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-sweets`,
        name: 'Kesar Mango Mastani',
        price: 130,
        short_description: 'Rich Alphonso mango milkshake topped with two scoops of mango ice cream and chopped pistachios.',
        full_description: 'Pune’s indigenous fruit dessert.',
        ingredients: ['Alphonso Mango Pulp', 'Milk', 'Mango Ice Cream', 'Dry Fruits'],
        allergens: ['Dairy', 'Nuts'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '350 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // F. PAN-ASIAN / THAI / CHINESE / VIETNAMESE / JAPANESE
  if (
    lowerCuisine.includes('asian') ||
    lowerCuisine.includes('thai') ||
    lowerCuisine.includes('chinese') ||
    lowerCuisine.includes('vietnamese') ||
    lowerCuisine.includes('japanese') ||
    lowerCuisine.includes('sushi') ||
    lowerCuisine.includes('dim sum')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-dimsum`, restaurant_id: restaurantId, name: 'Dim Sum & Small Plates', sort_order: 1, is_active: true },
      { id: `cat-${slug}-wok`, restaurant_id: restaurantId, name: 'Wok Specialties & Noodles', sort_order: 2, is_active: true },
      { id: `cat-${slug}-curry`, restaurant_id: restaurantId, name: 'Claypot Curries & Rice', sort_order: 3, is_active: true },
      { id: `cat-${slug}-dessert`, restaurant_id: restaurantId, name: 'Desserts & Beverages', sort_order: 4, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-asian-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dimsum`,
        name: 'Truffle Edamame & Water Chestnut Dim Sum',
        price: 380,
        short_description: 'Translucent steamed crystal dumplings infused with black truffle essence and scallion oil.',
        full_description: 'Handmade daily using Japanese edamame, crunchy water chestnuts, and cold-pressed sesame oil.',
        ingredients: ['Edamame', 'Water Chestnuts', 'Truffle Oil', 'Wheat Starch', 'Scallions'],
        allergens: ['Gluten', 'Soy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '4 pieces',
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-asian-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dimsum`,
        name: 'Crispy Lotus Stem Honey Chilli',
        price: 340,
        short_description: 'Thinly sliced lotus root tossed in wok-caramelized wild honey and toasted sesame seeds.',
        full_description: 'Crisp lotus root medallions glazed with a balance of sweet honey, fiery birds-eye chili, and light soy reduction.',
        ingredients: ['Lotus Root', 'Wild Honey', 'Red Chili', 'Sesame Seeds', 'Garlic'],
        allergens: ['Sesame'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-asian-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-wok`,
        name: 'Classic Bangkok Pad Thai',
        price: 440,
        short_description: 'Flat rice noodles wok-charred with tamarind pulp, crushed roasted peanuts, and crunchy bean sprouts.',
        full_description: 'Wok-charred with traditional palm sugar-tamarind sauce, dried chilies, firm tofu, garlic chives, and fresh lime.',
        ingredients: ['Rice Noodles', 'Tamarind Pulp', 'Crushed Peanuts', 'Bean Sprouts', 'Tofu', 'Lime'],
        allergens: ['Peanuts', 'Soy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      },
      {
        id: `item-${slug}-asian-4`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-curry`,
        name: 'Aromatic Thai Green Curry with Jasmine Rice',
        price: 490,
        short_description: 'Velvety coconut cream curry pounded with fresh green chilies, sweet Thai basil, and bamboo shoots.',
        full_description: 'Simmered with kaffir lime leaves, pea eggplants, and galangal. Served with steaming fragrant Jasmine rice.',
        ingredients: ['Coconut Milk', 'Green Curry Paste', 'Thai Basil', 'Bamboo Shoots', 'Jasmine Rice'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: 'Bowl with Rice (Serves 2)',
        image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: false,
        is_bestseller: true,
        sort_order: 4
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // G. SOUTH INDIAN / UDIPI / DOSA / CHETTINAD / KERALA
  if (
    lowerCuisine.includes('south indian') ||
    lowerCuisine.includes('udipi') ||
    lowerCuisine.includes('dosa') ||
    lowerCuisine.includes('kerala') ||
    lowerCuisine.includes('chettinad')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-dosa`, restaurant_id: restaurantId, name: 'Crisp Dosas & Roast Crepes', sort_order: 1, is_active: true },
      { id: `cat-${slug}-tiffin`, restaurant_id: restaurantId, name: 'Steamed Tiffin & Vada Classics', sort_order: 2, is_active: true },
      { id: `cat-${slug}-meals`, restaurant_id: restaurantId, name: 'Traditional Meals & Rice Bowls', sort_order: 3, is_active: true },
      { id: `cat-${slug}-drinks`, restaurant_id: restaurantId, name: 'Traditional Brews & Desserts', sort_order: 4, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-si-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dosa`,
        name: 'Benne Mysore Masala Dosa',
        price: 160,
        short_description: 'Fermented golden rice crepe roasted in generous white butter, smeared with spicy red chili-garlic chutney.',
        full_description: 'Cooked on seasoned cast-iron griddles until shatteringly crisp, filled with spiced turmeric potato mash.',
        ingredients: ['Fermented Rice-Lentil Batter', 'Mysore Red Chutney', 'Potato Bhaji', 'White Butter'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '1 Large Dosa',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-si-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-tiffin`,
        name: 'Steamed Thatte Idli with Ghee Podi',
        price: 120,
        short_description: 'Plate-sized fluffy steamed rice cakes drenched in fragrant molten clarified butter and fiery spiced lentil gunpowder.',
        full_description: 'Fermented for 16 hours and steamed in traditional flat plates for an ultra-spongy texture.',
        ingredients: ['Parboiled Rice', 'Urad Dal', 'Desi Ghee', 'Gunpowder Podi'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '2 Large Idlis',
        image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: false,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-si-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-drinks`,
        name: 'Filter Kaapi in Brass Dabarah',
        price: 55,
        short_description: 'Strong chicory-infused decoction pulled with frothy whole milk in a traditional brass cup.',
        full_description: 'Pulled vigorously by meter-high streams to generate a rich velvety head of foam.',
        ingredients: ['Plantation Arabica Coffee', 'Chicory', 'Full-Cream Milk', 'Cane Sugar'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Dabarah Set',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // H. ITALIAN / PIZZA / PASTA / MEDITERRANEAN
  if (
    lowerCuisine.includes('italian') ||
    lowerCuisine.includes('pizza') ||
    lowerCuisine.includes('pasta') ||
    lowerCuisine.includes('mediterranean')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-antipasti`, restaurant_id: restaurantId, name: 'Antipasti & Small Plates', sort_order: 1, is_active: true },
      { id: `cat-${slug}-pizza`, restaurant_id: restaurantId, name: 'Woodfired Sourdough Pizza', sort_order: 2, is_active: true },
      { id: `cat-${slug}-pasta`, restaurant_id: restaurantId, name: 'Handmade Pasta & Risotto', sort_order: 3, is_active: true },
      { id: `cat-${slug}-dolci`, restaurant_id: restaurantId, name: 'Dolci & Artisan Coffee', sort_order: 4, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-it-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-pizza`,
        name: 'Margherita Bufalina Pizza',
        price: 590,
        short_description: '72-hour slow fermented dough, San Marzano D.O.P. tomatoes, creamy buffalo mozzarella, and fresh basil leaves.',
        full_description: 'Hand-stretched and baked in a 480°C volcanic stone oven until blistered with leopard-spotted char.',
        ingredients: ['Caputo 00 Flour', 'San Marzano Tomatoes', 'Buffalo Mozzarella', 'Fresh Basil', 'EVOO'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '11-inch Pie (6 slices)',
        image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-it-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-pasta`,
        name: 'Hand-Rolled Truffle & Porcini Tagliatelle',
        price: 640,
        short_description: 'Fresh egg tagliatelle tossed in cultured butter, wild porcini mushrooms, and cracked black pepper.',
        full_description: 'Freshly extruded bronze-die egg pasta finished with Parmigiano-Reggiano and Piedmont black truffle shavings.',
        ingredients: ['Fresh Tagliatelle', 'Porcini Mushrooms', 'Black Truffle Paste', 'Parmigiano-Reggiano', 'Butter'],
        allergens: ['Gluten', 'Dairy', 'Egg'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-it-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dolci`,
        name: 'Classic Venetian Tiramisu Tradizionale',
        price: 360,
        short_description: 'Airy Savoiardi ladyfinger biscuits steeped in Italian dark roast espresso, layered with whipped mascarpone cream and cocoa.',
        full_description: 'Crafted according to the original Treviso recipe.',
        ingredients: ['Savoiardi Biscuits', 'Mascarpone Cheese', 'Espresso Dark Roast', 'Dutch Cocoa Powder'],
        allergens: ['Gluten', 'Dairy', 'Egg'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Portion',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: false,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // I. BAKERY / CAFE / CONTINENTAL / EUROPEAN / DESSERT
  if (
    lowerCuisine.includes('bakery') ||
    lowerCuisine.includes('cafe') ||
    lowerCuisine.includes('continental') ||
    lowerCuisine.includes('european') ||
    lowerCuisine.includes('dessert') ||
    lowerCuisine.includes('coffee')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-bakes`, restaurant_id: restaurantId, name: 'Fresh Bakes & Viennoiserie', sort_order: 1, is_active: true },
      { id: `cat-${slug}-brunch`, restaurant_id: restaurantId, name: 'All-Day Brunch & Tartines', sort_order: 2, is_active: true },
      { id: `cat-${slug}-mains`, restaurant_id: restaurantId, name: 'Gourmet Mains & Bowls', sort_order: 3, is_active: true },
      { id: `cat-${slug}-coffee`, restaurant_id: restaurantId, name: 'Specialty Coffee & Beverages', sort_order: 4, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-cafe-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-brunch`,
        name: 'Avocado Tartine on Sourdough',
        price: 390,
        short_description: 'Toasted country sourdough topped with crushed Hass avocado, crumbled feta cheese, pickled radishes, and toasted seeds.',
        full_description: 'Finished with extra virgin olive oil and cold-pressed citrus vinaigrette.',
        ingredients: ['Sourdough Bread', 'Hass Avocado', 'Greek Feta', 'Toasted Pumpkin Seeds', 'Microgreens'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '2 Tartines',
        image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-cafe-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-bakes`,
        name: 'Flaky Almond Croissant',
        price: 210,
        short_description: 'Butter laminated pastry twice-baked with rich frangipane almond cream and toasted sliced almonds.',
        full_description: 'Baked fresh at 6:00 AM every morning using French butter.',
        ingredients: ['French Butter', 'Flour', 'Almond Frangipane', 'Vanilla Bean', 'Icing Sugar'],
        allergens: ['Gluten', 'Dairy', 'Nuts', 'Egg'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Croissant',
        image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-cafe-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-coffee`,
        name: 'Specialty Flat White (Single Origin)',
        price: 180,
        short_description: 'Double ristretto of estate-grown Arabica beans blended with micro-foamed silky whole milk.',
        full_description: 'Velvety mouthfeel with subtle notes of chocolate and stone fruit.',
        ingredients: ['Specialty Espresso Beans', 'Full Cream Milk'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '220 ml Cup',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 3
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // J. DEFAULT: NORTH INDIAN / MUGHLAI / BIRYANI / TANDOOR
  const categories: MenuCategory[] = [
    { id: `cat-${slug}-starters`, restaurant_id: restaurantId, name: 'Tandoori Starters & Kebabs', sort_order: 1, is_active: true },
    { id: `cat-${slug}-curries`, restaurant_id: restaurantId, name: 'Heritage Curries & Biryani', sort_order: 2, is_active: true },
    { id: `cat-${slug}-breads`, restaurant_id: restaurantId, name: 'Clay Oven Breads & Desserts', sort_order: 3, is_active: true }
  ];

  const dishes: GeneratedDishInput[] = [
    {
      id: `item-${slug}-ind-1`,
      restaurant_id: restaurantId,
      category_id: `cat-${slug}-starters`,
      name: 'Paneer Tikka Angara',
      price: 380,
      short_description: 'Fresh malai paneer cubes marinated in smoked Kashmiri chili, yellow mustard, and hung curd.',
      full_description: 'Skewered with sweet bell peppers and red onions, charred over silver oak embers in our traditional clay oven.',
      ingredients: ['Malai Paneer', 'Mustard Oil', 'Kashmiri Chili', 'Hung Curd', 'Bell Peppers'],
      allergens: ['Dairy', 'Mustard'],
      dietary_flags: ['veg'],
      spice_level: 2,
      serving_size: '5 Skewers',
      image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop',
      is_available: true,
      is_signature: true,
      is_chef_recommended: true,
      is_bestseller: true,
      sort_order: 1
    },
    {
      id: `item-${slug}-ind-2`,
      restaurant_id: restaurantId,
      category_id: `cat-${slug}-curries`,
      name: 'Dal Makhani Bukhara (Slow 36-Hr)',
      price: 420,
      short_description: 'Organic black lentils slow-simmered continuously over charcoal with churned butter and tomato puree.',
      full_description: 'Prepared using traditional whole night simmering techniques, finished with fresh dairy cream and dried fenugreek leaves.',
      ingredients: ['Black Urad Lentils', 'Cultured Butter', 'Fresh Cream', 'Tomato Puree', 'Kasuri Methi'],
      allergens: ['Dairy'],
      dietary_flags: ['veg'],
      spice_level: 1,
      serving_size: 'Serves 2',
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
      is_available: true,
      is_signature: true,
      is_chef_recommended: true,
      is_bestseller: true,
      sort_order: 2
    },
    {
      id: `item-${slug}-ind-3`,
      restaurant_id: restaurantId,
      category_id: `cat-${slug}-curries`,
      name: 'Dum Handi Subz Biryani',
      price: 460,
      short_description: 'Aged long-grain basmati rice layered with garden vegetables, saffron milk, and aromatic Awadhi spices.',
      full_description: 'Sealed with dough and slow-cooked in a clay handi to trap all the floral scents of green cardamom, kewra, and saffron.',
      ingredients: ['Aged Basmati Rice', 'Saffron', 'Garden Vegetables', 'Ghee', 'Crispy Brown Onions'],
      allergens: ['Dairy'],
      dietary_flags: ['veg'],
      spice_level: 2,
      serving_size: 'Large Handi (Serves 2)',
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
      is_available: true,
      is_signature: true,
      is_chef_recommended: false,
      is_bestseller: true,
      sort_order: 3
    },
    {
      id: `item-${slug}-ind-4`,
      restaurant_id: restaurantId,
      category_id: `cat-${slug}-breads`,
      name: 'Truffle Butter Garlic Naan',
      price: 130,
      short_description: 'Tandoor-baked leavened flatbread brushed with black truffle butter and minced roasted garlic.',
      full_description: 'Puffy, blistered bread straight from the glowing clay tandoor, finished with fresh coriander and sea salt.',
      ingredients: ['Refined Flour', 'Garlic', 'Truffle Butter', 'Coriander'],
      allergens: ['Gluten', 'Dairy'],
      dietary_flags: ['veg'],
      spice_level: 0,
      serving_size: '2 Halves',
      image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
      is_available: true,
      is_signature: false,
      is_chef_recommended: true,
      is_bestseller: true,
      sort_order: 4
    }
  ];

  return finalizeMenu(categories, dishes);
}
