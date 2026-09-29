import { MenuItem, MenuCategory } from '../types';

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
 * restaurant's cuisine type. NEVER prepends or jumbles the restaurant's name into the dish title.
 */
export function generateCuisineMenu(
  restaurantId: string,
  restaurantSlug: string,
  cuisine: string,
  _restaurantName?: string
): GeneratedMenuData {
  const lowerCuisine = (cuisine || '').toLowerCase();
  const slug = restaurantSlug || 'venue';

  // 1. PAN-ASIAN / THAI / CHINESE / VIETNAMESE / JAPANESE
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
        full_description: 'Handmade daily using Japanese edamame, crunchy water chestnuts, and cold-pressed sesame oil. Steamed in traditional bamboo baskets.',
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
        full_description: 'Street-style tamarind reduction wok-seared over high flame with fresh lime, chives, tofu, and crushed roasted peanuts.',
        ingredients: ['Rice Noodles', 'Tamarind', 'Peanuts', 'Bean Sprouts', 'Chives', 'Tofu'],
        allergens: ['Peanuts', 'Soy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Large Bowl',
        image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop',
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
        name: 'Thai Green Curry with Fragrant Jasmine Rice',
        price: 520,
        short_description: 'Aromatic coconut broth simmered with fresh Thai basil, lemongrass, kaffir lime, and baby bamboo shoots.',
        full_description: 'Hand-pounded green chili and galangal paste simmered in creamy coconut milk with seasonal exotic greens and jasmine rice.',
        ingredients: ['Coconut Milk', 'Thai Basil', 'Kaffir Lime', 'Galangal', 'Jasmine Rice'],
        allergens: [],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: false,
        sort_order: 4
      },
      {
        id: `item-${slug}-asian-5`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dessert`,
        name: 'Mango Sticky Rice with Warm Coconut Cream',
        price: 280,
        short_description: 'Sweet glutinous rice steamed with pandan leaves, paired with ripe Alphonso mango slices.',
        full_description: 'Traditional Southeast Asian delicacy served warm with salted coconut cream glaze and toasted sesame.',
        ingredients: ['Sticky Rice', 'Alphonso Mango', 'Coconut Milk', 'Pandan', 'Palm Sugar'],
        allergens: ['Sesame'],
        dietary_flags: ['veg', 'dessert'],
        spice_level: 0,
        serving_size: '1 Portion',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 5
      },
      {
        id: `item-${slug}-asian-6`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dessert`,
        name: 'Lemongrass & Kaffir Lime Craft Refresher',
        price: 190,
        short_description: 'Muddled fresh lemongrass, bruised kaffir leaves, and sparkling mountain tonic.',
        full_description: 'Crisp botanical refresher balanced with palm syrup and fresh Meyer lemon juice.',
        ingredients: ['Lemongrass', 'Kaffir Lime', 'Sparkling Water', 'Lime Juice'],
        allergens: [],
        dietary_flags: ['beverage'],
        spice_level: 0,
        serving_size: '350ml',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop',
        is_available: true,
        item_type: 'drink',
        sort_order: 6
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // 2. SOUTH INDIAN / UDIPI / COASTAL
  if (
    lowerCuisine.includes('south indian') ||
    lowerCuisine.includes('udipi') ||
    lowerCuisine.includes('dosa') ||
    lowerCuisine.includes('kerala') ||
    lowerCuisine.includes('chettinad')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-tiffin`, restaurant_id: restaurantId, name: 'Traditional Tiffins & Crispy Dosas', sort_order: 1, is_active: true },
      { id: `cat-${slug}-meals`, restaurant_id: restaurantId, name: 'Heritage Meals & Specialties', sort_order: 2, is_active: true },
      { id: `cat-${slug}-beverages`, restaurant_id: restaurantId, name: 'Filter Coffee & Desserts', sort_order: 3, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-si-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-tiffin`,
        name: 'Ghee Podi Mysore Masala Dosa',
        price: 190,
        short_description: 'Crisp golden crepe roasted in pure A2 ghee, smeared with spicy gun-powder and potato masala.',
        full_description: 'Fermented stone-ground batter roasted to a mahogany crunch with pure ghee, layered with red garlic chutney and spiced potato filling.',
        ingredients: ['Rice Batter', 'Desi Ghee', 'Podi Gunpowder', 'Potatoes', 'Curry Leaves'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '1 Dosa with Sambhar & 3 Chutneys',
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
        name: 'Steamed Thatte Idli with White Butter',
        price: 150,
        short_description: 'Extra fluffy plate-sized steamed rice cakes served with homemade makhan and drumstick sambhar.',
        full_description: 'Airy, melt-in-mouth Karnataka style steamed rice cakes crowned with freshly churned white butter and spiced roasted lentils.',
        ingredients: ['Steamed Rice', 'Urad Dal', 'White Butter', 'Lentils', 'Mustard Seeds'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '2 Large Idlis',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-si-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-tiffin`,
        name: 'Crispy Medu Vada Duo',
        price: 140,
        short_description: 'Golden-fried lentil donuts with a crunchy exterior and airy cloud-like center.',
        full_description: 'Stone-crushed black gram batter seasoned with crushed black pepper, fresh ginger, and curry leaves. Served hot.',
        ingredients: ['Black Gram', 'Black Pepper', 'Fresh Ginger', 'Curry Leaves', 'Coconut'],
        allergens: [],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '2 pieces',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: false,
        is_bestseller: true,
        sort_order: 3
      },
      {
        id: `item-${slug}-si-4`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-meals`,
        name: 'Malabar Flaky Parotta with Veg Kurma',
        price: 280,
        short_description: 'Multi-layered Kerala flatbread paired with rich coconut and poppy seed vegetable gravy.',
        full_description: 'Hand-tossed flaky parotta cooked on cast iron with ghee, paired with aromatic slow-simmered vegetable stew.',
        ingredients: ['Wheat Flour', 'Coconut Milk', 'Poppy Seeds', 'Seasonal Vegetables', 'Cardamom'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: false,
        sort_order: 4
      },
      {
        id: `item-${slug}-si-5`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-beverages`,
        name: 'Kumbakonam Degree Filter Coffee',
        price: 90,
        short_description: 'Freshly decocted chicory-blend coffee frothed with thick buffalo milk in a brass davarah.',
        full_description: 'Authentic South Indian brew prepared from fresh morning roasted plantation beans and frothy milk.',
        ingredients: ['Arabica Coffee', 'Chicory', 'Farm Fresh Milk', 'Jaggery/Sugar'],
        allergens: ['Dairy'],
        dietary_flags: ['beverage'],
        spice_level: 0,
        serving_size: '1 Brass Davarah',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
        is_available: true,
        item_type: 'drink',
        sort_order: 5
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // 3. ITALIAN / PIZZA / PASTA / MEDITERRANEAN
  if (
    lowerCuisine.includes('italian') ||
    lowerCuisine.includes('pizza') ||
    lowerCuisine.includes('pasta') ||
    lowerCuisine.includes('mediterranean')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-anti`, restaurant_id: restaurantId, name: 'Antipasti & Crostini', sort_order: 1, is_active: true },
      { id: `cat-${slug}-pizza`, restaurant_id: restaurantId, name: 'Woodfired Pizza', sort_order: 2, is_active: true },
      { id: `cat-${slug}-pasta`, restaurant_id: restaurantId, name: 'Handmade Pasta & Risotto', sort_order: 3, is_active: true },
      { id: `cat-${slug}-dolci`, restaurant_id: restaurantId, name: 'Dolci & Beverages', sort_order: 4, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-it-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-anti`,
        name: 'Burrata Pugliese con Pomodorini',
        price: 520,
        short_description: 'Creamy artisanal burrata with blistered heirloom tomatoes, cold-pressed olive oil, and basil crisps.',
        full_description: 'Imported fresh burrata filled with sweet stracciatella, surrounded by flame-roasted vine cherry tomatoes and aged balsamic reduction.',
        ingredients: ['Burrata Cheese', 'Heirloom Tomatoes', 'Extra Virgin Olive Oil', 'Basil', 'Balsamic'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Portion',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 1
      },
      {
        id: `item-${slug}-it-2`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-pizza`,
        name: 'Tartufo Nero & Wild Mushroom Pizza',
        price: 640,
        short_description: 'Woodfired sourdough pizza with black truffle emulsion, roasted porcini, and fontina cheese.',
        full_description: 'Fermented for 48 hours and charred at 450°C. Finished with aromatic Umbrian black summer truffles and fresh thyme.',
        ingredients: ['00 Flour', 'Fontina', 'Porcini Mushrooms', 'Black Truffle', 'Fresh Thyme'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '12-inch Pizza',
        image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-it-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-pizza`,
        name: 'Margherita Verace D.O.P.',
        price: 490,
        short_description: 'Classic Neapolitan pizza with crushed San Marzano tomatoes, fresh fior di latte, and sweet basil.',
        full_description: 'Traditional Campania recipe featuring charred bubbly crust, sweet sun-ripened tomato sauce, and golden Ligurian olive oil.',
        ingredients: ['San Marzano Tomatoes', 'Fior di Latte Mozzarella', 'Sweet Basil', 'Olive Oil'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '12-inch Pizza',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: false,
        is_bestseller: true,
        sort_order: 3
      },
      {
        id: `item-${slug}-it-4`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-pasta`,
        name: 'Handcrafted Tagliolini al Tartufo',
        price: 580,
        short_description: 'Fresh egg-yolk ribbon pasta spun in French cultured butter, Parmigiano Reggiano, and shaved truffles.',
        full_description: 'Hand-rolled every morning in our pasta room. Tossed tableside with 24-month aged Parmigiano and Kampot black pepper.',
        ingredients: ['Semolina', 'Farm Egg Yolks', 'Parmigiano Reggiano', 'Cultured Butter', 'Truffle'],
        allergens: ['Dairy', 'Gluten', 'Eggs'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '220g Bowl',
        image_url: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 4
      },
      {
        id: `item-${slug}-it-5`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-dolci`,
        name: 'Classic Venetian Tiramisu',
        price: 340,
        short_description: 'Espresso-soaked savoiardi biscuits layered with whipped mascarpone cream and Dutch cocoa.',
        full_description: 'Authentic 1958 Treviso family recipe with airy ladyfinger biscuits dipped in dark roast espresso.',
        ingredients: ['Mascarpone', 'Savoiardi', 'Espresso', 'Dutch Cocoa', 'Pasteurized Yolks'],
        allergens: ['Dairy', 'Gluten', 'Eggs'],
        dietary_flags: ['veg', 'dessert'],
        spice_level: 0,
        serving_size: '1 Portion',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 5
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // 4. CAFE / BAKERY / EUROPEAN / CONTINENTAL
  if (
    lowerCuisine.includes('bakery') ||
    lowerCuisine.includes('cafe') ||
    lowerCuisine.includes('continental') ||
    lowerCuisine.includes('european') ||
    lowerCuisine.includes('dessert')
  ) {
    const categories: MenuCategory[] = [
      { id: `cat-${slug}-bakes`, restaurant_id: restaurantId, name: 'Artisanal Breads & Small Plates', sort_order: 1, is_active: true },
      { id: `cat-${slug}-mains`, restaurant_id: restaurantId, name: 'Gourmet Bistro Mains', sort_order: 2, is_active: true },
      { id: `cat-${slug}-brews`, restaurant_id: restaurantId, name: 'Specialty Brews & Patisserie', sort_order: 3, is_active: true }
    ];

    const dishes: GeneratedDishInput[] = [
      {
        id: `item-${slug}-cafe-1`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-bakes`,
        name: 'Smashed Avocado & Whipped Feta Sourdough Toast',
        price: 380,
        short_description: 'Naturally fermented rustic sourdough toasted in butter, topped with hass avocado, dukkah, and pickled onions.',
        full_description: 'Creamy Hass avocado muddled with lemon juice and sea salt on 36-hour slow-fermented bread. Crowned with feta and micro-greens.',
        ingredients: ['Artisanal Sourdough', 'Hass Avocado', 'Greek Feta', 'Dukkah Spice', 'Olive Oil'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '2 Large Slices',
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
        name: 'Wild Forest Mushroom & Truffle Crostini',
        price: 360,
        short_description: 'Sauteed cremini and button mushrooms deglazed in white grape jus over garlic rubbed ciabatta.',
        full_description: 'Finished with creamy thyme mascarpone spread, white truffle oil, and shaved aged gouda.',
        ingredients: ['Wild Mushrooms', 'Garlic Ciabatta', 'Mascarpone', 'Truffle Oil', 'Thyme'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '3 Crostinis',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: false,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 2
      },
      {
        id: `item-${slug}-cafe-3`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-mains`,
        name: 'Pan-Seared Potato Gnocchi in Sage Butter',
        price: 480,
        short_description: 'Pillow-soft potato dumplings crisped in nutty brown butter with fresh garden sage and roasted pine nuts.',
        full_description: 'Handmade potato gnocchi tossed with caramelized pumpkin puree, crispy sage leaves, and freshly grated Parmigiano.',
        ingredients: ['Russet Potatoes', 'Brown Butter', 'Fresh Sage', 'Pine Nuts', 'Parmesan'],
        allergens: ['Gluten', 'Dairy', 'Nuts'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: false,
        sort_order: 3
      },
      {
        id: `item-${slug}-cafe-4`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-brews`,
        name: 'Warm Belgian Dark Chocolate Lava Fondant',
        price: 320,
        short_description: '70% Valrhona dark chocolate cake with a molten center, served with Madagascan vanilla bean gelato.',
        full_description: 'Freshly baked to order. Breaking the delicate sponge releases a river of bittersweet molten chocolate.',
        ingredients: ['70% Dark Chocolate', 'Butter', 'Farm Eggs', 'Vanilla Bean Gelato'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        dietary_flags: ['veg', 'dessert'],
        spice_level: 0,
        serving_size: '1 Fondant with Gelato',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
        is_available: true,
        is_signature: true,
        is_chef_recommended: true,
        is_bestseller: true,
        sort_order: 4
      },
      {
        id: `item-${slug}-cafe-5`,
        restaurant_id: restaurantId,
        category_id: `cat-${slug}-brews`,
        name: 'Cold Drip Reserve Coffee with Sweet Cream',
        price: 220,
        short_description: 'Single-estate Chikmagalur beans steeped in ice water for 16 hours, served over clear artisan ice.',
        full_description: 'Smooth, naturally sweet brew with notes of cocoa nibs and roasted hazelnut, topped with a float of fresh cream.',
        ingredients: ['Arabica Cold Brew', 'Clear Ice', 'Dairy Cream'],
        allergens: ['Dairy'],
        dietary_flags: ['beverage'],
        spice_level: 0,
        serving_size: '300ml',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
        is_available: true,
        item_type: 'drink',
        sort_order: 5
      }
    ];

    return finalizeMenu(categories, dishes);
  }

  // 5. DEFAULT: NORTH INDIAN / MUGHLAI / BIRYANI / CONTEMPORARY INDIAN
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
      category_id: `cat-${slug}-starters`,
      name: 'Crispy Dahi Ke Kebab',
      price: 360,
      short_description: 'Velvety hung curd patties spiced with green chilies, fresh coriander, and roasted cumin.',
      full_description: 'Encased in a delicate crisp crust, melting into a creamy spiced yogurt center. Served with mint chutney.',
      ingredients: ['Hung Curd', 'Green Chili', 'Roasted Cumin', 'Cardamom', 'Coriander'],
      allergens: ['Dairy'],
      dietary_flags: ['veg'],
      spice_level: 1,
      serving_size: '4 pieces',
      image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
      is_available: true,
      is_signature: false,
      is_chef_recommended: true,
      is_bestseller: true,
      sort_order: 2
    },
    {
      id: `item-${slug}-ind-3`,
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
      sort_order: 3
    },
    {
      id: `item-${slug}-ind-4`,
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
      sort_order: 4
    },
    {
      id: `item-${slug}-ind-5`,
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
      sort_order: 5
    },
    {
      id: `item-${slug}-ind-6`,
      restaurant_id: restaurantId,
      category_id: `cat-${slug}-breads`,
      name: 'Shahi Kesariya Phirni in Clay Pot',
      price: 190,
      short_description: 'Chilled ground rice pudding cooked in reduced milk, infused with Kashmiri saffron and slivered pistachios.',
      full_description: 'Slowly cooked in thick full-cream milk and set in porous earthen sakoras for a delicate earthy aroma.',
      ingredients: ['Broken Basmati Rice', 'Full Cream Milk', 'Saffron', 'Cardamom', 'Pistachios'],
      allergens: ['Dairy', 'Nuts'],
      dietary_flags: ['veg', 'dessert'],
      spice_level: 0,
      serving_size: '1 Earthen Pot',
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop',
      is_available: true,
      is_signature: false,
      is_chef_recommended: true,
      is_bestseller: false,
      sort_order: 6
    }
  ];

  return finalizeMenu(categories, dishes);
}
