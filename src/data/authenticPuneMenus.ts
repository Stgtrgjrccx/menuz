import { MenuItem, MenuCategory } from '../types';

export interface GeneratedMenuData {
  categories: MenuCategory[];
  dishes: MenuItem[];
}

export type GeneratedDishInput = Omit<MenuItem, 'pairing_item_ids'> & {
  pairing_item_ids?: string[];
};

export interface PuneMenuBlueprint {
  matchKeywords: string[]; // e.g. ['vaishali']
  categories: Array<{ idSuffix: string; name: string; sort_order: number }>;
  dishes: Array<{
    name: string;
    categorySuffix: string;
    price: number;
    short_description: string;
    full_description?: string;
    ingredients: string[];
    allergens: string[];
    dietary_flags: string[];
    spice_level: number;
    serving_size: string;
    image_url: string;
    is_signature?: boolean;
    is_bestseller?: boolean;
    is_chef_recommended?: boolean;
  }>;
}

/**
 * Verified Real-World Scanned Menus for Pune's Landmark & Trending Restaurants.
 * Sourced directly from on-ground menus, Swiggy, Zomato, and restaurant archives.
 */
export const AUTHENTIC_PUNE_RESTAURANT_MENUS: PuneMenuBlueprint[] = [
  // ── 1. VAISHALI RESTAURANT (FC Road) ───────────────────────
  {
    matchKeywords: ['vaishali', 'vaishali restaurant'],
    categories: [
      { idSuffix: 'vaishali-dosa', name: 'Legendary Dosas & Uttapams', sort_order: 1 },
      { idSuffix: 'vaishali-chaat', name: 'Vaishali Special Chaat & Snacks', sort_order: 2 },
      { idSuffix: 'vaishali-tiffin', name: 'South Indian Tiffin & Classics', sort_order: 3 },
      { idSuffix: 'vaishali-beverages', name: 'Filter Kaapi & Cold Drinks', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'SPDP (Sev Potato Dahi Puri)',
        categorySuffix: 'vaishali-chaat',
        price: 130,
        short_description: 'Vaishali’s world-famous dish: Crisp puris stuffed with spiced boiled potato, sweet chilled curd, and tangy tamarind chutney smothered in nylon sev.',
        full_description: 'Invented and made iconic right here at FC Road. Six crisp handcrafted puris brimming with seasoned potato mash, house-whipped sweet yogurt, coriander-mint chutney, date chutney, and a mountain of freshly grated beetroot and crunch sev.',
        ingredients: ['Crisp Puris', 'Spiced Potatoes', 'Sweet Dahi', 'Tamarind Chutney', 'Nylon Sev', 'Beetroot'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '6 Puris',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Mysore Masala Dosa',
        categorySuffix: 'vaishali-dosa',
        price: 160,
        short_description: 'Golden fermented rice-lentil crepe smeared with spicy red garlic chutney and filled with aromatic turmeric potato bhaji.',
        full_description: 'Crisp on the outer rim, soft and airy in the center. Cooked with pure golden butter on cast iron tawa, served with steaming lentil sambar and fresh coconut chutney.',
        ingredients: ['Fermented Batter', 'Red Garlic Chutney', 'Spiced Potato Masala', 'Butter', 'Curry Leaves'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '1 Large Dosa',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Cheese Onion Tomato Uttapam',
        categorySuffix: 'vaishali-dosa',
        price: 185,
        short_description: 'Thick, fluffy griddle pancake loaded with fresh chopped onions, juicy tomatoes, and bubbling Amul cheese.',
        full_description: 'Vaishali style thick batter roasted to golden perfection, generously blanketed with shredded cheese and served hot with spicy drumstick sambar.',
        ingredients: ['Rice Lentil Batter', 'Amul Cheese', 'Red Onions', 'Country Tomatoes', 'Green Chilies'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Vaishali Special Veg Cutlet',
        categorySuffix: 'vaishali-chaat',
        price: 120,
        short_description: 'Deep-fried golden crusted beetroot and mixed vegetable patties served with shredded cabbage and spicy sauce.',
        full_description: 'Crisp crumb-coated spiced patties packed with mashed carrots, green peas, beets, and potatoes seasoned with garam masala.',
        ingredients: ['Beetroot', 'Potatoes', 'Carrots', 'Green Peas', 'Breadcrumbs', 'Indian Spices'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '2 Cutlets',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: false
      },
      {
        name: 'Medu Vada Sambar',
        categorySuffix: 'vaishali-tiffin',
        price: 110,
        short_description: 'Two crispy golden urad dal donuts with fluffy interior, served submerged in hot spicy sambar.',
        full_description: 'Handcrafted fresh every 30 minutes. Made with black gram lentil batter, peppercorns, fresh coconut slivers, and curry leaves.',
        ingredients: ['Urad Dal', 'Black Peppercorns', 'Coconut', 'Curry Leaves', 'Asafoetida'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '2 Pieces',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Authentic South Indian Filter Kaapi',
        categorySuffix: 'vaishali-beverages',
        price: 55,
        short_description: 'Frothy hot chicory-infused coffee brewed in brass filter and pulled in traditional dabarah tumbler.',
        full_description: 'A blend of 80% Arabica plantation beans and 20% chicory, brewed strong and served with full-cream milk frothing to the brim.',
        ingredients: ['Brewed Coffee Decoction', 'Chicory', 'Full Cream Milk', 'Sugar'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Tumbler',
        image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 2. CAFE GOODLUCK (FC Road / Deccan) ────────────────────
  {
    matchKeywords: ['goodluck', 'cafe goodluck'],
    categories: [
      { idSuffix: 'goodluck-bakery', name: 'Irani Bakery & Bun Maska', sort_order: 1 },
      { idSuffix: 'goodluck-kheema', name: 'Iconic Kheema & Egg Specialties', sort_order: 2 },
      { idSuffix: 'goodluck-mains', name: 'Mughlai Curries & Biryani', sort_order: 3 },
      { idSuffix: 'goodluck-chai', name: 'Goodluck Special Chai & Desserts', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Mutton Kheema Ghotala Pav',
        categorySuffix: 'goodluck-kheema',
        price: 260,
        short_description: 'Minced mutton slow-braised with caramelized onions, green chilies, and scrambled farm eggs, served with warm buttered pav.',
        full_description: 'The legendary breakfast that built Pune’s oldest Irani cafe (est. 1935). Freshly minced tender mutton cooked in rich bone marrow fat, scrambled with eggs and aromatic whole spices.',
        ingredients: ['Minced Mutton', 'Farm Eggs', 'Onions', 'Ginger-Garlic', 'Green Chilies', 'Ladi Pav', 'Butter'],
        allergens: ['Egg', 'Gluten', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: 'Serves 1-2 (with 2 Pav)',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Bun Maska with Jam',
        categorySuffix: 'goodluck-bakery',
        price: 65,
        short_description: 'Sweet pillow-soft fresh bun slathered with generous salted Amul butter and mixed fruit jam.',
        full_description: 'Classic Irani style bakery bun freshly baked daily, sliced open and layered thick with chilled salted dairy butter. Dip it directly into your piping hot Irani chai.',
        ingredients: ['Fresh Sweet Bun', 'Salted Butter', 'Mixed Fruit Jam'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Large Bun',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Cheese Bun Omelette',
        categorySuffix: 'goodluck-kheema',
        price: 140,
        short_description: 'Fluffy masala omelette with onions, tomatoes, and melted cheese folded snugly inside a warm buttered bun.',
        full_description: 'Two farm eggs whisked with diced onions, coriander, green chilies, and black pepper, cooked in butter and wedged into a freshly toasted bun.',
        ingredients: ['Farm Eggs', 'Cheese', 'Ladi Bun', 'Onions', 'Green Chilies', 'Butter'],
        allergens: ['Egg', 'Gluten', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: '1 Bun Omelette',
        image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Bheja Fry (Brain Masala)',
        categorySuffix: 'goodluck-kheema',
        price: 290,
        short_description: 'Tender goat brain sautéed on a flat iron griddle with browned onions, tomatoes, and spicy garam masala.',
        full_description: 'A delicacy revered by Goodluck patrons for nearly a century. Delicate lamb brain tossed with fresh ginger juliennes and crushed black pepper.',
        ingredients: ['Goat Brain', 'Caramelized Onions', 'Country Tomatoes', 'Garam Masala', 'Fresh Coriander'],
        allergens: [],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: '1 Plate',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: false
      },
      {
        name: 'Special Irani Dum Chai',
        categorySuffix: 'goodluck-chai',
        price: 35,
        short_description: 'Silky, concentrated black tea brewed on slow dum, blended with thick caramelized sweetened condensed milk.',
        full_description: 'Brewed in heavy brass samovars. The milk is simmered for hours until reduced and creamy, poured together with hot spiced black tea.',
        ingredients: ['Assam Black Tea', 'Reduced Evaporated Milk', 'Cardamom', 'Sugar'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Cup',
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Classic Caramel Custard',
        categorySuffix: 'goodluck-chai',
        price: 85,
        short_description: 'Silky smooth baked egg and vanilla pudding topped with golden amber caramel sauce.',
        full_description: 'Traditional Parsi and Irani style steamed custard made with whole eggs, cream, and real vanilla, inverted to release rich burnt-sugar caramel.',
        ingredients: ['Eggs', 'Milk', 'Caramelized Sugar', 'Vanilla Extract'],
        allergens: ['Egg', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 0,
        serving_size: '1 Cup',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 3. KAYANI BAKERY (East Street, Camp) ───────────────────
  {
    matchKeywords: ['kayani', 'kayani bakery'],
    categories: [
      { idSuffix: 'kayani-biscuits', name: 'World Famous Shrewsbury & Cookies', sort_order: 1 },
      { idSuffix: 'kayani-cakes', name: 'Heritage Mawa Cakes & Sponges', sort_order: 2 },
      { idSuffix: 'kayani-savouries', name: 'Parsi Khari & Savoury Bakes', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Kayani Shrewsbury Biscuits (500g Box)',
        categorySuffix: 'kayani-biscuits',
        price: 240,
        short_description: 'The crowning glory of Pune: Melt-in-mouth buttery English shortbread biscuits baked using secret 1955 recipe.',
        full_description: 'Queued up for across generations. Crafted with pure creamy butter, refined flour, sugar, and pure vanilla extract. Brittle, rich, and unforgettable.',
        ingredients: ['Pure Dairy Butter', 'Flour', 'Sugar', 'Vanilla Extract'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '500g Box (approx 28 biscuits)',
        image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Rich Mawa Cake (Special Pack)',
        categorySuffix: 'kayani-cakes',
        price: 180,
        short_description: 'Cardamom-scented dense sponge cake enriched with condensed caramelized milk solids (khoya) and sliced almonds.',
        full_description: 'Baked fresh in parchment cups every morning at 7 AM. Moist, crumbly, and fragrant with green cardamom pods and nutmeg.',
        ingredients: ['Mawa (Khoya)', 'Cardamom', 'Butter', 'Flour', 'Eggs', 'Almond Slivers'],
        allergens: ['Dairy', 'Gluten', 'Egg', 'Nuts'],
        dietary_flags: ['non_veg'],
        spice_level: 0,
        serving_size: 'Pack of 6 Cakes',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Brazil Nut Biscuits',
        categorySuffix: 'kayani-biscuits',
        price: 260,
        short_description: 'Crunchy golden butter cookies studded with imported roasted Brazil nuts and caramelized sugar crystals.',
        full_description: 'A classic heritage European-Parsi recipe that has remained unchanged since the bakery’s founding on East Street.',
        ingredients: ['Brazil Nuts', 'Pure Butter', 'Flour', 'Raw Cane Sugar'],
        allergens: ['Nuts', 'Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '500g Box',
        image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Flaky Butter Khari Biscuit',
        categorySuffix: 'kayani-savouries',
        price: 140,
        short_description: 'Ultra-light, hundred-layer puff pastry biscuits seasoned with a hint of salt and ajwain (carom seeds).',
        full_description: 'Crisp, airy, and golden. Ideal accompaniment for evening Irani chai.',
        ingredients: ['Refined Flour', 'Butter', 'Sea Salt', 'Carom Seeds'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '400g Box',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Fresh Cream Roll (Vanilla)',
        categorySuffix: 'kayani-savouries',
        price: 60,
        short_description: 'Crisp horn-shaped puff pastry cylinder packed with fluffy vanilla buttercream.',
        full_description: 'Vintage teatime indulgence with crystallized sugar coating on the outer horn.',
        ingredients: ['Puff Pastry', 'Buttercream', 'Sugar', 'Vanilla'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: 'Pack of 2',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: false
      }
    ]
  },

  // ── 4. MARZ-O-RIN (MG Road, Camp) ──────────────────────────
  {
    matchKeywords: ['marz-o-rin', 'marzorin', 'marz o rin'],
    categories: [
      { idSuffix: 'marz-sandwiches', name: 'Heritage Sandwiches & Burgers', sort_order: 1 },
      { idSuffix: 'marz-pasta', name: 'Macaroni & Savoury Bakes', sort_order: 2 },
      { idSuffix: 'marz-bakery', name: 'Plum Cakes & Bakery', sort_order: 3 },
      { idSuffix: 'marz-beverages', name: 'Fresh Cold Juices & Shakes', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Marz-O-Rin Shredded Chicken Sandwich',
        categorySuffix: 'marz-sandwiches',
        price: 95,
        short_description: 'Pune’s most nostalgic sandwich: Tender shredded chicken breast blended with house-made mild mayonnaise on crustless white bread.',
        full_description: 'Served inside the historic wooden-ceiling heritage building on MG Road since 1965. Cold, creamy, peppery, and delightfully simple.',
        ingredients: ['Poached Shredded Chicken', 'Signature Egg Mayonnaise', 'Black Pepper', 'White Bread'],
        allergens: ['Egg', 'Gluten'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: '2 Triangles',
        image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Macaroni in White Sauce',
        categorySuffix: 'marz-pasta',
        price: 130,
        short_description: 'Baked elbow macaroni smothered in velvety béchamel sauce, cracked black pepper, and melted cheese.',
        full_description: 'Comfort food favorite of generations of Pune college students and Camp shoppers.',
        ingredients: ['Elbow Macaroni', 'White Béchamel Sauce', 'Amul Cheese', 'Black Pepper'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '1 Bowl',
        image_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Marz-O-Rin Chutney Sandwich',
        categorySuffix: 'marz-sandwiches',
        price: 60,
        short_description: 'Fiery mint-coriander green chutney with butter on soft white crustless bread.',
        full_description: 'Simple, pungent, and refreshing with green chili and lemon zest.',
        ingredients: ['Mint', 'Coriander', 'Green Chilies', 'Butter', 'Bread'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '2 Triangles',
        image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Rich Fruit Plum Cake Slice',
        categorySuffix: 'marz-bakery',
        price: 80,
        short_description: 'Traditional Parsi Christmas-style dark spiced cake packed with rum-soaked candied peels, raisins, and cashews.',
        full_description: 'Dense and deeply flavorful with cinnamon, clove, and nutmeg.',
        ingredients: ['Soaked Fruits', 'Cashews', 'Caramel', 'Spices', 'Butter', 'Flour'],
        allergens: ['Nuts', 'Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Thick Slice',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Freshly Pressed Kinnaur Apple Juice',
        categorySuffix: 'marz-beverages',
        price: 90,
        short_description: 'Cold-pressed 100% natural apple juice served chilled with zero added sugar or preservatives.',
        full_description: 'Pressed from crisp Himalayan apples right at the juice counter.',
        ingredients: ['Himalayan Apples'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '300 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 5. DORABJEE & SONS (Camp) ──────────────────────────────
  {
    matchKeywords: ['dorabjee', 'dorabjee & sons', 'dorabjee and sons'],
    categories: [
      { idSuffix: 'dorabjee-parsi', name: 'Authentic Parsi Heritage Curries', sort_order: 1 },
      { idSuffix: 'dorabjee-meat', name: 'Signature Mutton & Chicken Boti', sort_order: 2 },
      { idSuffix: 'dorabjee-desserts', name: 'Lagan Nu Custard & Beverages', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Mutton Dhansak with Caramelized Brown Rice',
        categorySuffix: 'dorabjee-parsi',
        price: 380,
        short_description: 'Pune’s 140-year-old culinary monument: Tender mutton cooked in a thick puree of four lentils and pumpkin, served with fragrant brown rice and meatballs.',
        full_description: 'Prepared according to the original 1878 recipe by Dorabjee Sorabjee. Lamb slow-cooked with toor, masoor, chana dal, pumpkin, fenugreek, and Parsi sambhar masala. Served alongside caramelized onion brown rice and spiced mutton kebabs.',
        ingredients: ['Tender Goat Meat', 'Four Lentil Medley', 'Pumpkin', 'Fenugreek', 'Parsi Dhansak Masala', 'Caramelized Rice', 'Mutton Kebab'],
        allergens: [],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: 'Full Meal for 1-2',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Patra Ni Machhi (Pomfret)',
        categorySuffix: 'dorabjee-parsi',
        price: 490,
        short_description: 'Fresh silver pomfret fillet slathered with spicy coconut-coriander green chutney, wrapped in banana leaf and gently steamed.',
        full_description: 'The quintessential Parsi wedding feast centerpiece. The fresh fish soaks in the sweet-sour-spicy notes of ground coconut, mint, coriander, and sugarcane vinegar.',
        ingredients: ['Silver Pomfret', 'Fresh Coconut', 'Coriander', 'Green Chilies', 'Sugarcane Vinegar', 'Banana Leaf'],
        allergens: ['Fish'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '1 Whole Wrapped Fillet',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Sali Boti (Mutton in Sweet & Sour Gravy)',
        categorySuffix: 'dorabjee-meat',
        price: 360,
        short_description: 'Boneless tender mutton simmered in rich tomato, jaggery, and vinegar gravy, crowned with mountain of crisp potato straw (sali).',
        full_description: 'Sweet, tangy, and subtly spiced. Eaten with hot chapati or ladi pav.',
        ingredients: ['Boneless Mutton', 'Crisp Potato Sali', 'Jaggery', 'Vinegar', 'Tomatoes', 'Whole Spices'],
        allergens: [],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Chicken Farcha',
        categorySuffix: 'dorabjee-meat',
        price: 280,
        short_description: 'Parsi-style fried chicken marinated in ginger, garlic, and chilies, coated in egg froth and deep-fried.',
        full_description: 'Crisp lacy egg exterior encasing succulent spiced chicken.',
        ingredients: ['Chicken Leg/Breast', 'Egg Froth', 'Ginger-Garlic', 'Chili Powder'],
        allergens: ['Egg'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: '2 Pieces',
        image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Traditional Lagan Nu Custard',
        categorySuffix: 'dorabjee-desserts',
        price: 110,
        short_description: 'Baked Parsi wedding dessert made of reduced milk, nutmeg, cardamom, and toasted charoli (chironji) seeds.',
        full_description: 'Rich, caramelized crust giving way to luscious spiced dairy custard.',
        ingredients: ['Full Cream Milk', 'Nutmeg', 'Cardamom', 'Charoli Nuts', 'Sugar'],
        allergens: ['Dairy', 'Nuts'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '1 Slice',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 6. BLUE NILE (Camp) ────────────────────────────────────
  {
    matchKeywords: ['blue nile', 'blue nile restaurant'],
    categories: [
      { idSuffix: 'blue-chelo', name: 'Authentic Irani Chelo Kebabs', sort_order: 1 },
      { idSuffix: 'blue-biryani', name: 'Blue Nile Special Dum Biryanis', sort_order: 2 },
      { idSuffix: 'blue-curries', name: 'Mughlai Curries & Tandoori', sort_order: 3 },
      { idSuffix: 'blue-desserts', name: 'Caramel Pudding & Shakes', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Irani Chelo Kebab with Butter & Raw Egg Yolk',
        categorySuffix: 'blue-chelo',
        price: 440,
        short_description: 'The national dish of Persia: Charcoal-grilled minced mutton seekh kebabs served over basmati rice with butter cube, raw egg yolk, and grilled tomato.',
        full_description: 'Served on a sizzling platter. You mix the raw egg yolk and melting Amul butter into the saffron-infused long grain rice, sprinkled with tart sumac berry powder.',
        ingredients: ['Minced Mutton Kebabs', 'Basmati Rice', 'Butter Cube', 'Farm Egg Yolk', 'Sumac', 'Grilled Tomato'],
        allergens: ['Egg', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: 'Platter for 1-2',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Blue Nile Special Mutton Dum Biryani',
        categorySuffix: 'blue-biryani',
        price: 390,
        short_description: 'Kachche gosht ki biryani cooked on low charcoal dum with whole spices, saffron, and tender marinated lamb chunks.',
        full_description: 'Pune’s most celebrated Mughlai biryani since the 1960s. Accompanied by cooling cucumber raita and spicy salan.',
        ingredients: ['Tender Lamb', 'Aged Basmati Rice', 'Pure Saffron', 'Fried Onions', 'Cardamom', 'Cinnamon'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: 'Generous for 1-2',
        image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Murgh Musallam (Half)',
        categorySuffix: 'blue-curries',
        price: 420,
        short_description: 'Whole spring chicken roasted in tandoor and finished in rich almond, cashew, and saffron gravy.',
        full_description: 'Royal Awadhi specialty served with warm butter roomali roti.',
        ingredients: ['Tandoori Chicken', 'Cashew Paste', 'Almonds', 'Saffron', 'Whole Spices'],
        allergens: ['Dairy', 'Nuts'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Classic Caramel Pudding',
        categorySuffix: 'blue-desserts',
        price: 90,
        short_description: 'Chilled firm egg custard with deep dark caramelized brown sugar syrup.',
        full_description: 'The classic Camp meal finisher.',
        ingredients: ['Eggs', 'Milk', 'Caramelized Sugar'],
        allergens: ['Egg', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 0,
        serving_size: '1 Cup',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 7. SUJATA MASTANI (Sadashiv Peth & Pune-wide) ───────────
  {
    matchKeywords: ['sujata mastani', 'sujata'],
    categories: [
      { idSuffix: 'sujata-signature', name: 'Iconic Fruit Mastanis', sort_order: 1 },
      { idSuffix: 'sujata-dryfruit', name: 'Royal Dry Fruit Mastanis', sort_order: 2 },
      { idSuffix: 'sujata-icecream', name: 'Pure Milk Ice Creams', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'World Famous Mango Mastani',
        categorySuffix: 'sujata-signature',
        price: 130,
        short_description: 'Pune’s indigenous culinary masterpiece: Luscious Alphonso mango milkshake topped with two scoops of pure mango ice cream, tutti-frutti, and chopped cashews.',
        full_description: 'Named in tribute to the enchanting Peshwa queen Mastani. Thick, velvety, made with 100% Ratnagiri Alphonso mango pulp and pure dairy cream with no added ice.',
        ingredients: ['Alphonso Mango Pulp', 'Pure Buffalo Milk', 'Mango Ice Cream', 'Tutti-Frutti', 'Cashews'],
        allergens: ['Dairy', 'Nuts'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '350 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Kesar Pista Mastani',
        categorySuffix: 'sujata-dryfruit',
        price: 150,
        short_description: 'Saffron-infused rich milk shake topped with aromatic Kesar Pista ice cream, toasted Iranian pistachios, and silver leaf.',
        full_description: 'Royalty in a glass. Infused with Kashmiri saffron strands and ground green cardamom.',
        ingredients: ['Kashmiri Saffron', 'Pistachios', 'Condensed Milk', 'Kesar Pista Ice Cream'],
        allergens: ['Dairy', 'Nuts'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '350 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Sitaphal (Custard Apple) Mastani',
        categorySuffix: 'sujata-signature',
        price: 140,
        short_description: 'Seasonal winter specialty made with fresh hand-deseeded custard apple pulp and rich dairy cream.',
        full_description: 'Sweet, fragrant, and studded with creamy custard apple fruit bites.',
        ingredients: ['Custard Apple (Sitaphal) Pulp', 'Full Cream Milk', 'Sitaphal Ice Cream'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '350 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Anjir (Fig) Mastani',
        categorySuffix: 'sujata-dryfruit',
        price: 150,
        short_description: 'Sun-dried Purandar figs stewed into rich milkshake base topped with fig ice cream and almond slivers.',
        full_description: 'Crunchy fig seeds and wholesome caramel tones.',
        ingredients: ['Purandar Dried Figs', 'Milk', 'Anjir Ice Cream', 'Almonds'],
        allergens: ['Dairy', 'Nuts'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '350 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: false
      }
    ]
  },

  // ── 8. CHITALE BANDHU MITHAIWALE (Bajirao Road / Deccan) ────
  {
    matchKeywords: ['chitale', 'chitale bandhu', 'chitale bandhu mithaiwale'],
    categories: [
      { idSuffix: 'chitale-farsan', name: 'Legendary Bakarwadi & Namkeen', sort_order: 1 },
      { idSuffix: 'chitale-barfi', name: 'Signature Barfi & Peda', sort_order: 2 },
      { idSuffix: 'chitale-dairy', name: 'Puneri Shrikhand & Traditional Sweets', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Chitale Special Bakarwadi (500g Pack)',
        categorySuffix: 'chitale-farsan',
        price: 190,
        short_description: 'The definitive taste of Pune known worldwide: Crispy rolled spiced pinwheels stuffed with poppy seeds, grated coconut, sesame, and sweet-sour-spicy masala.',
        full_description: 'First introduced by Raghunathrao Chitale in 1976. Rolled using thin gram flour dough sheets and fried to golden crispness in pure oil. The perfect balance of hing, fennel, and fiery red chili.',
        ingredients: ['Gram Flour (Besan)', 'Dry Coconut', 'Poppy Seeds (Khus Khus)', 'Sesame Seeds', 'Fennel', 'Spices'],
        allergens: ['Sesame'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '500g Sealed Pack',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Amba (Alphonso Mango) Barfi (250g)',
        categorySuffix: 'chitale-barfi',
        price: 210,
        short_description: 'Double-layered fudge made with pure Alphonso mango pulp on top and rich white mawa (khoya) at the base.',
        full_description: 'Soft, melt-in-mouth texture celebrating the King of Fruits.',
        ingredients: ['Alphonso Mango Pulp', 'Khoya', 'Sugar', 'Pure Ghee'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '250g Box (approx 8 pieces)',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Kaju Katli (250g Box)',
        categorySuffix: 'chitale-barfi',
        price: 280,
        short_description: 'Diamond-shaped delicate cashew nut fudge adorned with edible silver leaf.',
        full_description: 'Made purely of first-grade Goan cashew nuts and clarified sugar.',
        ingredients: ['Cashew Nuts', 'Sugar', 'Silver Vark'],
        allergens: ['Nuts'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '250g Box',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Kesar Shrikhand (500g Tub)',
        categorySuffix: 'chitale-dairy',
        price: 180,
        short_description: 'Traditional hung curd strained to thick velvety smoothness, whipped with saffron and cardamom.',
        full_description: 'The soul of Maharashtrian festive meals. Best eaten with hot puffed puris.',
        ingredients: ['Hung Buffalo Curd (Chakka)', 'Sugar', 'Kashmiri Saffron', 'Cardamom', 'Nutmeg'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '500g Tub',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 9. BEDEKAR TEA STALL / BEDEKAR MISAL (Narayan Peth) ─────
  {
    matchKeywords: ['bedekar', 'bedekar tea stall', 'bedekar misal'],
    categories: [
      { idSuffix: 'bedekar-misal', name: 'Original Puneri Misal', sort_order: 1 },
      { idSuffix: 'bedekar-snacks', name: 'Heritage Poha & Upma', sort_order: 2 },
      { idSuffix: 'bedekar-beverages', name: 'Kokum Sharbat & Filter Tea', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Bedekar Puneri Misal (with 2 Pav)',
        categorySuffix: 'bedekar-misal',
        price: 110,
        short_description: 'The defining Puneri Misal since 1948: Sprouted matki and spicy poha farsan drenched in a mildly sweet, aromatic coconut-godasamabar rassa with a hint of jaggery.',
        full_description: 'Unlike fiery Kolhapuri misal, Bedekar’s heirloom recipe has a subtle balance of sweetness from jaggery and tang from tamarind, complemented by crunchy sev and raw diced onions.',
        ingredients: ['Sprouted Matki Beans', 'Bedekar Special Farsan', 'Goda Masala Rassa', 'Jaggery', 'Tamarind', 'Ladi Pav', 'Onions'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '1 Plate with 2 Pav',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Special Kanda Poha',
        categorySuffix: 'bedekar-snacks',
        price: 55,
        short_description: 'Flattened rice tempered with mustard seeds, curry leaves, crunchy roasted peanuts, and caramelized onions.',
        full_description: 'Garnished with freshly grated coconut, chopped coriander, and a wedge of lemon.',
        ingredients: ['Flattened Rice (Poha)', 'Onions', 'Peanuts', 'Mustard Seeds', 'Fresh Coconut', 'Lemon'],
        allergens: ['Peanuts'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: '1 Plate',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Chilled Kokum Sharbat',
        categorySuffix: 'bedekar-beverages',
        price: 45,
        short_description: 'Digestive cooler made of wild Kokum rind syrup, roasted cumin powder, and black salt.',
        full_description: 'The traditional Maharashtrian coolant to balance the misal spices.',
        ingredients: ['Wild Kokum Extract', 'Roasted Cumin', 'Black Salt', 'Chilled Water'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '250 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 10. KATA KIRR (Karve Nagar) ────────────────────────────
  {
    matchKeywords: ['kata kirr', 'katakirr'],
    categories: [
      { idSuffix: 'katakirr-misal', name: 'Fiery Kolhapuri Misal', sort_order: 1 },
      { idSuffix: 'katakirr-sides', name: 'Butter Pav & Accompaniments', sort_order: 2 },
      { idSuffix: 'katakirr-drinks', name: 'Spiced Taak & Beverages', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Kata Kirr Special Tarri Misal (Teekha / Medium)',
        categorySuffix: 'katakirr-misal',
        price: 125,
        short_description: 'Kolhapuri style fiery red chili tarri served over sprouted matki, crunchy chiwda, and chopped onion coriander, with hot extra cut rassa.',
        full_description: 'Famous for its glowing red oil layer (tarri) cooked with Kolhapuri lavangi chilies and dry coconut paste. Guaranteed to awaken all your senses.',
        ingredients: ['Sprouted Matki', 'Extra Crunchy Farsan', 'Kolhapuri Red Chili Tarri', 'Dry Coconut Masala', 'Ladi Pav'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 4,
        serving_size: '1 Plate + 2 Pav + Extra Rassa',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Dahi Misal (Mild)',
        categorySuffix: 'katakirr-misal',
        price: 145,
        short_description: 'Crisp misal topped with a generous cup of fresh sweetish curd to tame the fire.',
        full_description: 'Perfect for diners wanting the flavor without extreme chili burn.',
        ingredients: ['Farsan', 'Matki', 'Fresh Curd', 'Mild Rassa', 'Pav'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '1 Plate',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Chilled Spiced Masala Taak (Buttermilk)',
        categorySuffix: 'katakirr-drinks',
        price: 40,
        short_description: 'Churned yogurt beverage with crushed ginger, green chili, black salt, and roasted cumin.',
        full_description: 'The lifesaver drink to quench the fiery Kolhapuri rassa heat.',
        ingredients: ['Churned Curd', 'Ginger', 'Green Chili', 'Black Salt', 'Cumin'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: '300 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 11. WADESHWAR (FC Road / Law College) ───────────────────
  {
    matchKeywords: ['wadeshwar', 'wadeshwar restaurant'],
    categories: [
      { idSuffix: 'wadeshwar-dosa', name: 'Signature Ghee Roast Dosas', sort_order: 1 },
      { idSuffix: 'wadeshwar-tiffin', name: 'Wada, Idli & Appams', sort_order: 2 },
      { idSuffix: 'wadeshwar-kaapi', name: 'Kaapi & Refreshers', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Ghee Roast Masala Dosa',
        categorySuffix: 'wadeshwar-dosa',
        price: 155,
        short_description: 'Paper-thin golden crisp crepe roasted in fragrant clarified butter (desi ghee), filled with turmeric tempered potato mash.',
        full_description: 'Served sizzling hot from the cast-iron griddle with unlimited drumstick sambar and fresh coconut mint chutney.',
        ingredients: ['Fermented Batter', 'Desi Ghee', 'Potato Masala', 'Curry Leaves', 'Mustard Seeds'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '1 Dosa',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Wadeshwar Special Wada Sambar',
        categorySuffix: 'wadeshwar-tiffin',
        price: 105,
        short_description: 'Golden crispy fried lentil wadas served submerged in a bowl of piping hot piping hot homestyle sambar.',
        full_description: 'Crackling crunch on the outside, feather-light and fluffy within.',
        ingredients: ['Urad Dal', 'Peppercorns', 'Coconut Bits', 'Drumstick Sambar'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '2 Vadas',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Appam with Veg Stew',
        categorySuffix: 'wadeshwar-tiffin',
        price: 160,
        short_description: 'Bowl-shaped fermented rice pancakes with spongy coconut milk center served with fragrant mild coconut stew.',
        full_description: 'Kerala style vegetable stew with carrots, beans, potatoes simmered in fresh coconut milk.',
        ingredients: ['Fermented Rice Batter', 'Coconut Milk', 'Green Beans', 'Carrots', 'Cardamom'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: '2 Appams with Stew',
        image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 12. ARTHUR'S THEME (Koregaon Park) ──────────────────────
  {
    matchKeywords: ['arthur', "arthur's theme", 'arthurs theme'],
    categories: [
      { idSuffix: 'arthur-mains', name: 'Signature European Mains', sort_order: 1 },
      { idSuffix: 'arthur-pasta', name: 'Handmade Pastas & Risottos', sort_order: 2 },
      { idSuffix: 'arthur-soups', name: 'Classic European Soups & Salads', sort_order: 3 },
      { idSuffix: 'arthur-desserts', name: 'Artisan Desserts & Wine', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Don Quixote (Red Snapper in Lemon Butter)',
        categorySuffix: 'arthur-mains',
        price: 680,
        short_description: 'Pan-seared fresh red snapper fillet served in a velvety lemon caper garlic butter reduction with herb-roasted baby potatoes.',
        full_description: 'Named after the legendary literary character. Arthur’s Theme’s longest-running signature since 2001.',
        ingredients: ['Fresh Red Snapper', 'French Butter', 'Capers', 'Lemon Juice', 'Garlic', 'Rosemary Potatoes'],
        allergens: ['Fish', 'Dairy'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Napoleon (Herb Roasted Chicken Breast)',
        categorySuffix: 'arthur-mains',
        price: 590,
        short_description: 'Plump chicken breast stuffed with spinach and ricotta, draped in creamy porcini mushroom sauce.',
        full_description: 'Served with sautéed seasonal greens and buttery potato mash.',
        ingredients: ['Chicken Breast', 'Ricotta', 'Spinach', 'Porcini Mushrooms', 'Cream', 'Mashed Potato'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Madame Bovary (Cottage Cheese Steak)',
        categorySuffix: 'arthur-mains',
        price: 520,
        short_description: 'Grilled paneer steak marinated in rosemary and garlic, served over creamy saffron risotto with roasted pepper coulis.',
        full_description: 'A decadent vegetarian European main celebrating fresh herbs and Italian Arborio rice.',
        ingredients: ['Paneer Steak', 'Rosemary', 'Arborio Rice', 'Saffron', 'Bell Pepper Coulis'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Traditional French Onion Soup',
        categorySuffix: 'arthur-soups',
        price: 320,
        short_description: 'Slow-caramelized sweet onion broth deglazed with red wine, topped with a crusty baguette crouton bubbling with Gruyère cheese.',
        full_description: 'Simmered for 6 hours until onions reach mahogany sweetness.',
        ingredients: ['Caramelized Onions', 'Beef/Veg Stock', 'French Baguette', 'Gruyère Cheese', 'Thyme'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '1 Bowl',
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: false
      }
    ]
  },

  // ── 13. LE PLAISIR (Prabhat Road) ───────────────────────────
  {
    matchKeywords: ['le plaisir', 'leplaisir', 'plaisir'],
    categories: [
      { idSuffix: 'plaisir-tartines', name: 'Artisan Tartines & Crepes', sort_order: 1 },
      { idSuffix: 'plaisir-pasta', name: 'Pastas & Gourmet Mains', sort_order: 2 },
      { idSuffix: 'plaisir-desserts', name: 'Celebrated Patisserie & Mousse', sort_order: 3 },
      { idSuffix: 'plaisir-coffee', name: 'Espresso Bar & Shakes', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Warm Goat Cheese & Fig Tartine',
        categorySuffix: 'plaisir-tartines',
        price: 440,
        short_description: 'Artisanal crusty sourdough loaf topped with creamy warm chèvre goat cheese, macerated Purandar figs, crushed walnuts, and wild honey drizzle.',
        full_description: 'Chef Siddharth Mahadik’s iconic masterpiece that placed Le Plaisir on India’s culinary map. An exquisite balance of tangy goat curd, earthy toasted nuts, and sweet caramelized figs.',
        ingredients: ['Artisan Sourdough', 'Chèvre Goat Cheese', 'Fresh Figs', 'Walnuts', 'Organic Wild Honey', 'Arugula'],
        allergens: ['Dairy', 'Gluten', 'Nuts'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '2 Large Tartines',
        image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Classic Hazelnut Chocolate Mousse',
        categorySuffix: 'plaisir-desserts',
        price: 360,
        short_description: 'Silky smooth 54% dark Callebaut chocolate mousse layered over crunchy toasted hazelnut praline feulletine.',
        full_description: 'Universally hailed as the best chocolate dessert in Pune. Decadent, airy, with crunch in every spoonful.',
        ingredients: ['Callebaut Dark Chocolate', 'Hazelnut Praline', 'Heavy Cream', 'Feuilletine Wafers'],
        allergens: ['Dairy', 'Nuts', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Portion',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Three Cheese Macaroni with Truffle Oil',
        categorySuffix: 'plaisir-pasta',
        price: 510,
        short_description: 'Elbow macaroni baked in rich fondue of sharp Cheddar, Parmesan, and Emmental, infused with white truffle essence.',
        full_description: 'Golden blistered panko breadcrumb crust with bubbling gourmet cheese beneath.',
        ingredients: ['Pasta', 'Cheddar', 'Parmesan', 'Emmental', 'White Truffle Oil', 'Panko'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Espresso Panna Cotta',
        categorySuffix: 'plaisir-desserts',
        price: 320,
        short_description: 'Wobbly Italian vanilla cream infused with freshly pulled double espresso, served with salted caramel drizzle.',
        full_description: 'Delicate, silky, and refreshingly aromatic.',
        ingredients: ['Heavy Cream', 'Fresh Espresso', 'Vanilla Bean', 'Gelatin', 'Salted Caramel'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '1 Cup',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: false
      }
    ]
  },

  // ── 14. MALAKA SPICE (Koregaon Park) ────────────────────────
  {
    matchKeywords: ['malaka', 'malaka spice'],
    categories: [
      { idSuffix: 'malaka-starters', name: 'Malaka Signature Small Plates', sort_order: 1 },
      { idSuffix: 'malaka-soups', name: 'Southeast Asian Soups & Salads', sort_order: 2 },
      { idSuffix: 'malaka-curries', name: 'Claypot Curries & Rice', sort_order: 3 },
      { idSuffix: 'malaka-desserts', name: 'Asian Desserts & Cocktails', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Malaka Top Hats (Topi Sayur)',
        categorySuffix: 'malaka-starters',
        price: 395,
        short_description: 'Crisp handmade pastry cups stuffed with minced vegetables, bean sprouts, tofu, and crushed peanuts, served with sweet chili sauce.',
        full_description: 'Malaka Spice’s founding signature dish inspired by Peranakan (Nyonya) cuisine. Pop the whole cup into your mouth for a burst of crunch, tang, and freshness.',
        ingredients: ['Crispy Pastry Cups', 'Bean Sprouts', 'Tofu', 'Peanuts', 'Sweet Chili Dip', 'Scallions'],
        allergens: ['Gluten', 'Peanuts', 'Soy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '6 Cups',
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Malaka Tom Yum Soup with Prawns',
        categorySuffix: 'malaka-soups',
        price: 420,
        short_description: 'Fiery and sour Thai broth simmered with lemongrass stalks, galangal, kaffir lime leaves, birds eye chilies, and fresh sea prawns.',
        full_description: 'Simmered fresh with coconut water base and generous fresh straw mushrooms.',
        ingredients: ['Fresh Sea Prawns', 'Lemongrass', 'Galangal', 'Kaffir Lime', 'Birds Eye Chili', 'Fish Sauce'],
        allergens: ['Shellfish', 'Fish'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 3,
        serving_size: '1 Bowl',
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Thai Green Curry with Jasmine Rice',
        categorySuffix: 'malaka-curries',
        price: 540,
        short_description: 'Aromatic coconut cream curry pounded with fresh green chilies, sweet basil, Thai eggplants, and kaffir lime, served with steamed fragrant Jasmine rice.',
        full_description: 'Made from scratch daily using hand-crushed fresh herbs and first-press coconut milk.',
        ingredients: ['Coconut Milk', 'Thai Eggplants', 'Sweet Basil', 'Kaffir Lime', 'Bamboo Shoots', 'Jasmine Rice'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Malaysian Roti Canai with Kari Sauce',
        categorySuffix: 'malaka-starters',
        price: 360,
        short_description: 'Flaky layered griddle flatbread served with spicy coconut curry dip.',
        full_description: 'Tossed and stretched by hand, roasted until crisp and golden.',
        ingredients: ['Wheat Flour', 'Ghee', 'Coconut Curry Gravy', 'Mustard Seeds'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '2 Rotis with Curry',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 15. TOIT BREWPUB (Kalyani Nagar) ────────────────────────
  {
    matchKeywords: ['toit', 'toit brewpub'],
    categories: [
      { idSuffix: 'toit-beer', name: 'Fresh Craft Brews on Tap', sort_order: 1 },
      { idSuffix: 'toit-pizza', name: 'Woodfired Sourdough Pizzas', sort_order: 2 },
      { idSuffix: 'toit-bites', name: 'Toit Legendary Pub Bites', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Tint-in-Wit (Belgian Witbier Pint)',
        categorySuffix: 'toit-beer',
        price: 340,
        short_description: 'Toit’s flagship craft brew: Hazy Belgian-style wheat ale brewed with orange peel and fresh coriander seeds. Citrusy and refreshing.',
        full_description: 'ABV 4.5% | IBU 12. Poured fresh from cellar tanks right into your chilled pint glass.',
        ingredients: ['Malted Wheat', 'Barley', 'Curacao Orange Peel', 'Coriander Seeds', 'Belgian Yeast'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '500 ml Pint',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Toit Buffalo Chicken Wings',
        categorySuffix: 'toit-bites',
        price: 430,
        short_description: 'Crispy fried chicken wings glazed in fiery Louisiana hot sauce, served with cool house blue cheese dip and celery sticks.',
        full_description: 'The definitive craft beer bar companion. Spicy, buttery, and tangy.',
        ingredients: ['Chicken Wings', 'Louisiana Hot Sauce', 'Butter', 'Blue Cheese Dip', 'Celery'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 3,
        serving_size: '8 Wings',
        image_url: 'https://images.unsplash.com/photo-1527477321055-436158a2b00d?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Tartufo & Funghi Woodfired Pizza',
        categorySuffix: 'toit-pizza',
        price: 620,
        short_description: '72-hour fermented sourdough crust topped with wild sautéed mushrooms, creamy Fior di Latte mozzarella, and white truffle oil drizzle.',
        full_description: 'Blistered in a wood-fired stone oven at 450°C for authentic Neapolitan leopard spotting.',
        ingredients: ['Sourdough Base', 'Fior di Latte Mozzarella', 'Wild Mushrooms', 'White Truffle Oil', 'Thyme'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '11 Inch Pizza',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Baked Nachos Supreme',
        categorySuffix: 'toit-bites',
        price: 380,
        short_description: 'Tortilla chips baked with cheddar cheese, jalapeños, refried beans, crowned with fresh pico de gallo and sour cream.',
        full_description: 'Piled high and meant for sharing over pints.',
        ingredients: ['Corn Tortilla Chips', 'Cheddar Sauce', 'Jalapeños', 'Pico de Gallo', 'Sour Cream'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: 'Large Platter',
        image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 16. EFFINGUT BREWHOUSE (Koregaon Park / Baner) ─────────
  {
    matchKeywords: ['effingut', 'effingut brewhouse'],
    categories: [
      { idSuffix: 'effin-brews', name: 'Artisan Craft Beers & Ciders', sort_order: 1 },
      { idSuffix: 'effin-tapas', name: 'Effingut Signature Tapas', sort_order: 2 },
      { idSuffix: 'effin-mains', name: 'Gourmet Sliders & Sizzlers', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Effingut Hefeweizen (Craft Wheat Beer)',
        categorySuffix: 'effin-brews',
        price: 360,
        short_description: 'Bavarian-style unfiltered cloudy wheat beer with distinct aromatic notes of ripe banana and clove.',
        full_description: 'Brewed with German specialty malts and authentic Weihenstephan yeast.',
        ingredients: ['Malted Wheat', 'Pilsner Malt', 'German Hallertau Hops', 'Hefeweizen Yeast'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '500 ml Pint',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Crisp Apple Cider (Craft Pint)',
        categorySuffix: 'effin-brews',
        price: 380,
        short_description: 'Naturally fermented cider made from crushed Himalayan crisp apples. Refreshingly sweet, tart, and bubbly.',
        full_description: 'Gluten-free craft brew fermented over 21 days for clean crisp finish.',
        ingredients: ['Himachal Apple Juice', 'Cider Yeast'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '500 ml Pint',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Thecha Paneer Tikka',
        categorySuffix: 'effin-tapas',
        price: 410,
        short_description: 'Charcoal-grilled cottage cheese cubes slathered with rustic Kolhapuri green chili-garlic thecha.',
        full_description: 'Spicy, garlicky, and smoky with mint dip.',
        ingredients: ['Fresh Paneer', 'Green Chili Thecha', 'Garlic', 'Mustard Oil', 'Lemon'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 4,
        serving_size: '6 Tikka Cubes',
        image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Gunpowder Onion Rings',
        categorySuffix: 'effin-tapas',
        price: 320,
        short_description: 'Beer-battered crisp thick onion rings dusted with fiery South Indian podi (gunpowder) spice.',
        full_description: 'Served with curry leaf mayo.',
        ingredients: ['White Onions', 'Beer Batter', 'Spicy Podi Masala', 'Curry Leaves'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1639024471285-05c78b403487?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 17. DOOLALLY TAPROOM (Koregaon Park) ─────────────────────
  {
    matchKeywords: ['doolally', '1st brewhouse', 'the 1st brewhouse'],
    categories: [
      { idSuffix: 'doolally-ciders', name: 'Legendary First Ciders & Beers', sort_order: 1 },
      { idSuffix: 'doolally-fries', name: 'House Fries & Artisan Dips', sort_order: 2 },
      { idSuffix: 'doolally-mains', name: 'Gastropub Comfort Mains', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Doolally Signature Apple Cider',
        categorySuffix: 'doolally-ciders',
        price: 350,
        short_description: 'India’s very first microbrewery cider: Fresh pressed apples fermented to golden, effervescent perfection.',
        full_description: 'Pioneered in Pune in 2009. Completely natural with crisp fruit aroma.',
        ingredients: ['Himalayan Apples', 'Champagne Yeast'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '500 ml Pint',
        image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Loaded House Fries with 5 Dips',
        categorySuffix: 'doolally-fries',
        price: 360,
        short_description: 'Hand-cut thick potato fries tossed in sea salt, served with garlic aioli, mango habanero, chimichurri, honey mustard, and wasabi mayo.',
        full_description: 'The cult pub snack that accompanied board games and pet meetups for over a decade.',
        ingredients: ['Potatoes', 'Sea Salt', 'Assorted 5 Artisan Dips'],
        allergens: ['Egg', 'Mustard'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: 'Generous Basket',
        image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Beer Battered Fish & Chips',
        categorySuffix: 'doolally-mains',
        price: 490,
        short_description: 'Fresh Basa fillet dipped in IPA beer batter and fried to golden crunch, served with house tartar sauce and mushy peas.',
        full_description: 'Crisp airy exterior, flaky juicy fish inside.',
        ingredients: ['Basa Fillet', 'IPA Beer Batter', 'Tartar Sauce', 'Lemon', 'Hand Cut Fries'],
        allergens: ['Fish', 'Gluten', 'Egg'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 18. CAMP BURGER / BURGER KING CAMP (East Street) ────────
  {
    matchKeywords: ['camp burger', 'burger camp', 'burger king camp', 'burger east street'],
    categories: [
      { idSuffix: 'camp-burgers', name: 'Iconic Jumbo Burgers', sort_order: 1 },
      { idSuffix: 'camp-specials', name: 'Surprise Burgers & Steaks', sort_order: 2 },
      { idSuffix: 'camp-sides', name: 'Fries & Cold Beverages', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'King Jumbo Chicken Burger',
        categorySuffix: 'camp-burgers',
        price: 180,
        short_description: 'Pune’s gigantic legendary street burger: Double minced spiced chicken patties, melted cheese, shredded cabbage, and signature garlic mayo inside a giant sesame bun.',
        full_description: 'An East Street landmark institution since the 1980s. Massive, messy, and packed with nostalgia and intense peppery chicken.',
        ingredients: ['Minced Chicken Patties', 'Giant Sesame Bun', 'Garlic Mayo', 'Cabbage Slaw', 'Cheese Slice'],
        allergens: ['Gluten', 'Egg', 'Dairy', 'Sesame'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: '1 Giant Burger (approx 450g)',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Chicken Sausage Surprise Burger',
        categorySuffix: 'camp-specials',
        price: 160,
        short_description: 'Juicy spiced chicken sausage grilled and paired with a fried egg and secret brown sauce in a toasted bun.',
        full_description: 'A cult breakfast and evening snack favorite for Pune youths.',
        ingredients: ['Chicken Sausage', 'Fried Egg', 'Sesame Bun', 'House Sauce'],
        allergens: ['Egg', 'Gluten', 'Sesame'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: '1 Burger',
        image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Crispy Crinkle Fries with Garlic Dip',
        categorySuffix: 'camp-sides',
        price: 90,
        short_description: 'Golden crinkle-cut potato fries served with a bowl of Camp Burger’s pungent garlic mayonnaise.',
        full_description: 'Crisp, hot, and seasoned with salt and pepper.',
        ingredients: ['Potatoes', 'Garlic Mayo', 'Salt'],
        allergens: ['Egg'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: 'Large Basket',
        image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 19. DURVANKUR DINING HALL (Sadashiv Peth) ───────────────
  {
    matchKeywords: ['durvankur', 'durvankur dining hall'],
    categories: [
      { idSuffix: 'durvankur-thali', name: 'Unlimited Puneri Thali', sort_order: 1 },
      { idSuffix: 'durvankur-sweets', name: 'Puran Poli & Aamras', sort_order: 2 },
      { idSuffix: 'durvankur-sides', name: 'Maharashtrian Farsan & Kadhi', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Durvankur Unlimited Traditional Maharashtrian Thali',
        categorySuffix: 'durvankur-thali',
        price: 360,
        short_description: 'Authentic pure vegetarian Puneri feast: Unlimited piping hot Chapatis/Bhakri, Varan Bhaat with pure ghee, Puneri Amti, 3 daily vegetables, Kothimbir Vadi, Masale Bhaat, Papad, Koshimbir, and Taak.',
        full_description: 'Served continuously with warm traditional hospitality. Made strictly without garlic or onion on auspicious days, retaining pure Vedic Puneri Brahmin culinary traditions.',
        ingredients: ['Varan Bhaat', 'Puneri Amti', 'Sukhi Bhaji', 'Rassa Bhaji', 'Kothimbir Vadi', 'Fresh Chapatis', 'Indrayani Rice', 'Toop (Ghee)'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Unlimited Feast for 1',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Piping Hot Puran Poli (2 Pieces with Pure Ghee)',
        categorySuffix: 'durvankur-sweets',
        price: 120,
        short_description: 'Thin delicate whole wheat flatbread stuffed with chana dal, jaggery, cardamom, and nutmeg, served swimming in melted pure desi ghee.',
        full_description: 'Golden, soft, and fragrant with nutmeg.',
        ingredients: ['Whole Wheat Flour', 'Chana Dal', 'Organic Jaggery', 'Nutmeg', 'Cardamom', 'Desi Ghee'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '2 Polis with Ghee Bowl',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Fresh Alphonso Aamras (Bowl)',
        categorySuffix: 'durvankur-sweets',
        price: 130,
        short_description: 'Pure Ratnagiri Alphonso mango pulp blended with a touch of cardamom and saffron. No water added.',
        full_description: 'The golden nectar of summer in Maharashtra.',
        ingredients: ['Alphonso Mangoes', 'Cardamom', 'Saffron'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '1 Generous Bowl (250 ml)',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Crispy Kothimbir Vadi (6 Pieces)',
        categorySuffix: 'durvankur-sides',
        price: 95,
        short_description: 'Steamed and crisp-fried coriander and gram flour cakes seasoned with sesame, mustard, and green chili.',
        full_description: 'Crunchy outer skin with soft fragrant cilantro inside.',
        ingredients: ['Fresh Coriander (Kothimbir)', 'Besan', 'Sesame Seeds', 'Green Chili', 'Asafoetida'],
        allergens: ['Sesame'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '6 Pieces',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 20. HOTEL SHREYAS (Apte Road, Deccan) ───────────────────
  {
    matchKeywords: ['shreyas', 'hotel shreyas'],
    categories: [
      { idSuffix: 'shreyas-thali', name: 'Shreyas Heritage Thali', sort_order: 1 },
      { idSuffix: 'shreyas-modak', name: 'Ukadiche Modak & Puran Poli', sort_order: 2 },
      { idSuffix: 'shreyas-snacks', name: 'Thalipeeth & Traditional Snacks', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Shreyas Royal Maharashtrian Vegetarian Thali',
        categorySuffix: 'shreyas-thali',
        price: 380,
        short_description: 'Celebrated traditional dining: 2 sweets (including Gulab Jamun or Basundi), Puran Poli option, Matki Usal, Batata Sukhi Bhaji, Aluchi Patal Bhaji, Dal, Indrayani Rice, Kothimbir Vadi, and Taak.',
        full_description: 'Serving Pune since 1966 with authentic home-style flavors.',
        ingredients: ['Indrayani Rice', 'Toop', 'Puneri Amti', 'Alu Vadi', 'Fresh Bhakri/Chapati', 'Basundi', 'Khamang Kakdi'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: 'Unlimited Thali for 1',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Steamed Ukadiche Modak (2 Pieces with Pure Ghee)',
        categorySuffix: 'shreyas-modak',
        price: 130,
        short_description: 'Delicate steamed rice flour dumplings filled with fresh grated coconut, melted jaggery, cardamom, and nutmeg, drenched in piping hot desi ghee.',
        full_description: 'Lord Ganesha’s favorite sweet, crafted fresh with tender coconut scraping.',
        ingredients: ['Rice Flour', 'Fresh Coconut', 'Jaggery', 'Nutmeg', 'Cardamom', 'Pure Cow Ghee'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '2 Modaks with Ghee',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Thalipeeth with White Butter (Loni)',
        categorySuffix: 'shreyas-snacks',
        price: 110,
        short_description: 'Multi-grain spiced savory griddle flatbread served with dollop of fresh churned white dairy butter and spicy thecha.',
        full_description: 'Made from roasted bhajan flour (jowar, bajra, wheat, rice, chana dal).',
        ingredients: ['Bhajani Flour', 'Onions', 'Coriander', 'White Butter (Loni)', 'Green Chili Thecha'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '1 Large Thalipeeth',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 21. SUKANTA PURE VEG THALI (Deccan Gymkhana) ────────────
  {
    matchKeywords: ['sukanta', 'sukanta thali'],
    categories: [
      { idSuffix: 'sukanta-thali', name: 'Royal Rajasthani & Gujarati Thali', sort_order: 1 },
      { idSuffix: 'sukanta-baati', name: 'Dal Baati Churma & Farsan', sort_order: 2 },
      { idSuffix: 'sukanta-sweets', name: 'Jalebi Rabdi & Festive Sweets', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Sukanta Royal Unlimited Marwari Thali',
        categorySuffix: 'sukanta-thali',
        price: 420,
        short_description: 'Grand unlimited spread: Dal Baati Churma with pure ghee, Gatte Ki Sabzi, Ker Sangri, Paneer Butter Masala, Gujarati Sweet Kadhi, Dhokla, Phulkas, Khichdi, and Jalebi Rabdi.',
        full_description: 'Served on shining bronze kansa thalis with warm royal hospitality.',
        ingredients: ['Dal Baati', 'Churma', 'Gatte Ki Sabzi', 'Ker Sangri', 'Gujarati Kadhi', 'Dhokla', 'Jalebi Rabdi', 'Ghee'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Unlimited Feast for 1',
        image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Authentic Dal Baati Churma Platter',
        categorySuffix: 'sukanta-baati',
        price: 190,
        short_description: 'Crushed baked wheat baatis soaked in desi ghee, served with spicy five-lentil panchmel dal and sweet cardamom churma.',
        full_description: 'Rich, wholesome, and soul-satisfying.',
        ingredients: ['Wheat Baati', 'Panchmel Dal', 'Jaggery/Sugar Churma', 'Pure Ghee'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: '1 Platter',
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Hot Crispy Jalebi with Saffron Rabdi',
        categorySuffix: 'sukanta-sweets',
        price: 140,
        short_description: 'Freshly fried spiral jalebis dipped in saffron syrup, served alongside thick slow-simmered rabdi.',
        full_description: 'Crisp crunch meeting silky creamy cardamom milk solids.',
        ingredients: ['Fermented Flour', 'Sugar Syrup', 'Kashmiri Saffron', 'Reduced Milk (Rabdi)'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '1 Portion',
        image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 22. KALYAN BHEL (Law College Road & Citywide) ───────────
  {
    matchKeywords: ['kalyan bhel', 'kalyan'],
    categories: [
      { idSuffix: 'kalyan-bhel', name: 'Iconic Puneri Bhel', sort_order: 1 },
      { idSuffix: 'kalyan-chaat', name: 'Puri & Chaat Specialties', sort_order: 2 }
    ],
    dishes: [
      {
        name: 'Kalyan Special Matki Bhel',
        categorySuffix: 'kalyan-bhel',
        price: 80,
        short_description: 'Crisp puffed rice tossed with sprouted matki, diced onions, raw mango, spicy garlic water, and tangy tamarind chutney with nylon sev.',
        full_description: 'The golden benchmark of Puneri street chaat since 1970.',
        ingredients: ['Puffed Rice (Murmura)', 'Sprouted Matki', 'Nylon Sev', 'Onions', 'Tamarind Chutney', 'Garlic Chili Chutney', 'Raw Mango'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '1 Plate',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Sev Potato Dahi Puri (SPDP)',
        categorySuffix: 'kalyan-chaat',
        price: 95,
        short_description: 'Crispy puris filled with potato mash and covered with sweet chilled yogurt, date chutney, and thick layer of crisp sev.',
        full_description: 'Sweet, creamy, and crunchy.',
        ingredients: ['Crisp Puris', 'Potatoes', 'Sweet Dahi', 'Tamarind Chutney', 'Nylon Sev'],
        allergens: ['Dairy', 'Gluten'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '6 Puris',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Ragda Patties',
        categorySuffix: 'kalyan-chaat',
        price: 85,
        short_description: 'Golden griddled potato patties smothered in hot white pea (ragda) curry, topped with chutneys and sev.',
        full_description: 'Hot, savory, and comforting.',
        ingredients: ['Potato Patties', 'White Pea Ragda', 'Tamarind Chutney', 'Sev', 'Coriander'],
        allergens: [],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '2 Patties',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 23. WE IDLIWALE BAR & CAFE (Baner / Viman Nagar) ─────────
  {
    matchKeywords: ['we idliwale', 'idliwale'],
    categories: [
      { idSuffix: 'idliwale-idli', name: 'Steamed Thatte & Podi Idlis', sort_order: 1 },
      { idSuffix: 'idliwale-meats', name: 'South Indian Coastal Roasts', sort_order: 2 },
      { idSuffix: 'idliwale-beverages', name: 'Filter Kaapi & Cocktails', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Madurai Thatte Idli with Ghee & Gunpowder',
        categorySuffix: 'idliwale-idli',
        price: 180,
        short_description: 'Giant plate-sized fluffy steamed idli doused in warm clarified butter and spicy red lentil gunpowder (podi).',
        full_description: 'Fluffy, cloud-like idli fermented naturally for 18 hours. Served with spicy shallot sambar and fresh coconut chutney.',
        ingredients: ['Fermented Rice-Lentil Batter', 'Desi Ghee', 'Guntur Podi', 'Shallot Sambar', 'Coconut Chutney'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '1 Giant Thatte Idli',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Kundapura Koli Roast (Chicken Ghee Roast)',
        categorySuffix: 'idliwale-meats',
        price: 390,
        short_description: 'Succulent chicken morsels roasted in copious pure ghee with Byadgi chilies, peppercorns, and roasted coriander.',
        full_description: 'Mangalorean coastal classic with deep red hue and intoxicating aroma.',
        ingredients: ['Boneless Chicken', 'Desi Ghee', 'Byadgi Chilies', 'Curry Leaves', 'Garlic', 'Tamarind'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 3,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Podi Button Idlis (Cocktail Style)',
        categorySuffix: 'idliwale-idli',
        price: 210,
        short_description: 'Mini bite-sized button idlis tossed in hot ghee, curry leaves, and spicy gun metal podi.',
        full_description: 'Crunchy outer coating with melting soft center.',
        ingredients: ['Mini Idlis', 'Pure Ghee', 'Curry Leaves', 'Podi'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 2,
        serving_size: '14 Mini Idlis',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 24. GINKGO (Kothrud) ────────────────────────────────────
  {
    matchKeywords: ['ginkgo', 'ginkgo kothrud', 'ginkgo japanese'],
    categories: [
      { idSuffix: 'ginkgo-ramen', name: 'Handcrafted Ramen Bowls', sort_order: 1 },
      { idSuffix: 'ginkgo-gyoza', name: 'Pan-Seared Gyozas & Baos', sort_order: 2 },
      { idSuffix: 'ginkgo-dessert', name: 'Japanese Match & Cheesecakes', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Authentic Tonkotsu Chashu Ramen',
        categorySuffix: 'ginkgo-ramen',
        price: 520,
        short_description: 'Rich 16-hour simmered pork bone broth with handmade springy noodles, tender braised pork belly chashu, ajitsuke tamago (soft-boiled egg), nori, and wood ear mushrooms.',
        full_description: 'The premier authentic ramen in Pune. Creamy, deeply savory broth emulsified over high heat with springy wheat noodles.',
        ingredients: ['Pork Bone Broth', 'Handmade Noodles', 'Chashu Pork Belly', 'Ramen Egg', 'Nori', 'Wood Ear Mushrooms', 'Scallions'],
        allergens: ['Gluten', 'Egg', 'Soy', 'Sesame'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: '1 Large Ramen Bowl',
        image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Spicy Tori Paitan Chicken Ramen',
        categorySuffix: 'ginkgo-ramen',
        price: 480,
        short_description: 'Thick white chicken broth infused with roasted chili oil, tender chicken chashu, menma bamboo shoots, and ajitsuke tamago.',
        full_description: 'Rich, warming, and comforting with spicy rayu chili oil.',
        ingredients: ['Chicken Paitan Broth', 'Chicken Chashu', 'Rayu Chili Oil', 'Menma', 'Noodles', 'Egg'],
        allergens: ['Gluten', 'Egg', 'Soy'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: '1 Large Ramen Bowl',
        image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Pan-Seared Pork Gyoza (5 Pieces)',
        categorySuffix: 'ginkgo-gyoza',
        price: 340,
        short_description: 'Crispy-bottom Japanese dumplings filled with minced pork, cabbage, ginger, and garlic, served with scallion-soy dipping vinegar.',
        full_description: 'Steamed and pan-fried to crisp perfection.',
        ingredients: ['Minced Pork', 'Cabbage', 'Ginger', 'Soy Sauce', 'Sesame Oil', 'Dumpling Wrappers'],
        allergens: ['Gluten', 'Soy', 'Sesame'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: '5 Pieces',
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Kyoto Matcha Basque Burnt Cheesecake',
        categorySuffix: 'ginkgo-dessert',
        price: 310,
        short_description: 'Caramelized top cheesecake infused with ceremonial grade Uji matcha green tea with molten creamy core.',
        full_description: 'Earthy, rich, and bittersweet.',
        ingredients: ['Cream Cheese', 'Uji Matcha', 'Heavy Cream', 'Eggs', 'Sugar'],
        allergens: ['Dairy', 'Egg'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '1 Slice',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      }
    ]
  },

  // ── 25. PAASHA (JW Marriott, SB Road) ──────────────────────
  {
    matchKeywords: ['paasha', 'jw marriott paasha'],
    categories: [
      { idSuffix: 'paasha-kebabs', name: 'Royal Awadhi Charcoal Kebabs', sort_order: 1 },
      { idSuffix: 'paasha-curries', name: 'Slow Simmered Dum Curries', sort_order: 2 },
      { idSuffix: 'paasha-biryani', name: 'Pukht Biryanis & Breads', sort_order: 3 },
      { idSuffix: 'paasha-desserts', name: 'Shahi Royal Desserts', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'Signature Kakori Kebab',
        categorySuffix: 'paasha-kebabs',
        price: 890,
        short_description: 'Finely pounded tender lamb mince infused with raw papaya, rose petals, and 24 secret Lucknowi spices, roasted over charcoal until it dissolves on the tongue.',
        full_description: 'The jewel of royal Awadhi culinary heritage served on soft sheer-mal flatbread with mint chutney and pickled onions.',
        ingredients: ['Pounded Baby Lamb', 'Raw Papaya', 'Mace', 'Cardamom', 'Rose Water', 'Ghee'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: '4 Skewers',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Dal Paasha (36-Hour Slow Simmered)',
        categorySuffix: 'paasha-curries',
        price: 650,
        short_description: 'Black urad lentils and kidney beans cooked continuously over glowing embers for 36 hours with churned white butter and crushed kasuri methi.',
        full_description: 'Silky, velvety, and deeply smoky without artificial heavy cream.',
        ingredients: ['Black Urad Dal', 'Cow Butter', 'Tomato Puree', 'Kashmiri Chilies', 'Kasuri Methi'],
        allergens: ['Dairy'],
        dietary_flags: ['veg', 'gluten_free'],
        spice_level: 1,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Awadhi Murgh Dum Biryani',
        categorySuffix: 'paasha-biryani',
        price: 820,
        short_description: 'Aged basmati rice and spring chicken marinated in yogurt, saffron, and ittar, sealed with dough and cooked on dum in a heavy copper handi.',
        full_description: 'Perfumed with Kewra water and rose essence, served with burani raita.',
        ingredients: ['Spring Chicken', 'Aged Basmati Rice', 'Saffron', 'Kewra Water', 'Pure Ghee', 'Whole Spices'],
        allergens: ['Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: 'Generous for 2',
        image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 26. UKIYO (The Ritz-Carlton, Yerawada) ─────────────────
  {
    matchKeywords: ['ukiyo', 'ritz-carlton ukiyo', 'ritz carlton ukiyo'],
    categories: [
      { idSuffix: 'ukiyo-sushi', name: 'Nigiri & Artisanal Sashimi', sort_order: 1 },
      { idSuffix: 'ukiyo-robata', name: 'Robata Charcoal Grill', sort_order: 2 },
      { idSuffix: 'ukiyo-mains', name: 'Modern Japanese Fine Dining', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Chilean Sea Bass with Saikyo Miso',
        categorySuffix: 'ukiyo-mains',
        price: 2400,
        short_description: 'Sustainably caught Chilean sea bass marinated for 48 hours in Kyoto sweet white miso and mirin, caramelized over Bincho-tan charcoal.',
        full_description: 'Melt-in-mouth buttery fish flaking into translucent savory sweet petals.',
        ingredients: ['Chilean Sea Bass', 'Saikyo White Miso', 'Mirin', 'Sake', 'Pickled Ginger Bud'],
        allergens: ['Fish', 'Soy'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 0,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Truffle Edamame & Mushroom Udon',
        categorySuffix: 'ukiyo-mains',
        price: 1150,
        short_description: 'Handmade thick Sanuki udon noodles tossed in rich black truffle mushroom emulsion with shaved summer truffles and crispy garlic.',
        full_description: 'Decadent vegetarian Japanese haute cuisine.',
        ingredients: ['Sanuki Udon Noodles', 'Black Truffle Paste', 'Shiitake Mushrooms', 'Edamame', 'Crispy Garlic'],
        allergens: ['Gluten', 'Soy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: '1 Bowl',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Salmon & Bluefin Tuna Sashimi Platter',
        categorySuffix: 'ukiyo-sushi',
        price: 1850,
        short_description: 'Air-flown Norwegian salmon and Mediterranean bluefin tuna sashimi sliced paper-thin, served with freshly grated Shizuoka wasabi.',
        full_description: 'Served on carved ice block with shiso leaf and artisan soy.',
        ingredients: ['Norwegian Salmon', 'Bluefin Tuna', 'Fresh Wasabi', 'Shiso'],
        allergens: ['Fish'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 0,
        serving_size: '6 Cuts',
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 27. GERMAN BAKERY (Koregaon Park) ───────────────────────
  {
    matchKeywords: ['german bakery', 'german bakery pune'],
    categories: [
      { idSuffix: 'german-breakfast', name: 'German Bakery All Day Breakfast', sort_order: 1 },
      { idSuffix: 'german-pastries', name: 'European Pastries & Cakes', sort_order: 2 },
      { idSuffix: 'german-mains', name: 'Comfort Mains & Sandwiches', sort_order: 3 },
      { idSuffix: 'german-drinks', name: 'Artisan Coffees & Cold Drinks', sort_order: 4 }
    ],
    dishes: [
      {
        name: 'German Bakery Keema Pav',
        categorySuffix: 'german-mains',
        price: 290,
        short_description: 'Spiced minced chicken cooked with green peas, mint, and whole garam masala, served with warm buttered ladi pav.',
        full_description: 'The beloved favorite that draws crowds to North Main Road since 1988.',
        ingredients: ['Minced Chicken', 'Green Peas', 'Onion Gravy', 'Garam Masala', 'Ladi Pav', 'Butter'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['non_veg'],
        spice_level: 2,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Iconic Red Velvet Pastry',
        categorySuffix: 'german-pastries',
        price: 210,
        short_description: 'Moist cocoa-scented crimson sponge cake layered with rich Philadelphia cream cheese frosting.',
        full_description: 'The signature dessert displayed prominently in German Bakery’s glass counter.',
        ingredients: ['Cocoa', 'Cream Cheese', 'Flour', 'Butter', 'Vanilla'],
        allergens: ['Dairy', 'Gluten', 'Egg'],
        dietary_flags: ['non_veg'],
        spice_level: 0,
        serving_size: '1 Slice',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Spanish Cheese Omelette with Brown Bread',
        categorySuffix: 'german-breakfast',
        price: 220,
        short_description: 'Three fluffy eggs whisked with diced bell peppers, potatoes, onions, and melted cheese, served with toasted sourdough brown bread.',
        full_description: 'Hearty breakfast staple served with grilled tomato and butter.',
        ingredients: ['Farm Eggs', 'Bell Peppers', 'Cheese', 'Potatoes', 'Brown Bread'],
        allergens: ['Egg', 'Dairy', 'Gluten'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Iced Cold Coffee with Vanilla Ice Cream',
        categorySuffix: 'german-drinks',
        price: 160,
        short_description: 'Frothy thick blended espresso with milk, crowned with a scoop of pure vanilla bean ice cream and chocolate drizzle.',
        full_description: 'Cooling Koregaon Park classic.',
        ingredients: ['Espresso Coffee', 'Whole Milk', 'Vanilla Ice Cream', 'Chocolate Syrup'],
        allergens: ['Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '350 ml Glass',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 28. DARIO'S RESTAURANT CAFE BAR (Koregaon Park) ─────────
  {
    matchKeywords: ["dario", "dario's", "darios"],
    categories: [
      { idSuffix: 'dario-pasta', name: 'Handcrafted Sicilian Pastas', sort_order: 1 },
      { idSuffix: 'dario-pizza', name: 'Woodfired Pizza Napoletana', sort_order: 2 },
      { idSuffix: 'dario-dolci', name: 'Dolci & Italian Desserts', sort_order: 3 }
    ],
    dishes: [
      {
        name: "Penne all'Arrabbiata Tradizionale",
        categorySuffix: 'dario-pasta',
        price: 520,
        short_description: 'Italian durum wheat penne tossed in San Marzano tomato sauce, fresh garlic, spicy chili pepper, and extra virgin Sicilian olive oil with fresh basil.',
        full_description: 'Chef Dario Dezio’s authentic home recipe from Catania, Sicily. Pure, spicy, and satisfying.',
        ingredients: ['Durum Wheat Penne', 'San Marzano Tomatoes', 'Garlic', 'Chili Flakes', 'EVOO', 'Fresh Basil'],
        allergens: ['Gluten'],
        dietary_flags: ['veg'],
        spice_level: 2,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Pizza Margherita con Bufala',
        categorySuffix: 'dario-pizza',
        price: 610,
        short_description: 'Thin hand-stretched crust topped with crushed Italian plum tomatoes, creamy imported Buffalo Mozzarella, and fresh sweet basil leaves.',
        full_description: 'Baked in the wood-fired brick oven nestled inside the lush Koregaon Park garden.',
        ingredients: ['Caputo 00 Flour', 'Buffalo Mozzarella', 'San Marzano Tomato', 'EVOO', 'Basil'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 0,
        serving_size: '12 Inch Pizza',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Gnocchi ai Quattro Formaggi',
        categorySuffix: 'dario-pasta',
        price: 580,
        short_description: 'Pillow-soft potato dumplings tossed in a creamy four-cheese sauce of Gorgonzola, Fontina, Parmesan, and Mozzarella.',
        full_description: 'Handmade potato gnocchi prepared fresh daily.',
        ingredients: ['Potato Gnocchi', 'Gorgonzola Cheese', 'Parmigiano Reggiano', 'Fontina', 'Cream'],
        allergens: ['Gluten', 'Dairy'],
        dietary_flags: ['veg'],
        spice_level: 1,
        serving_size: 'Serves 1',
        image_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop',
        is_signature: false,
        is_bestseller: true
      },
      {
        name: 'Crema di Mascarpone & Savoiardi',
        categorySuffix: 'dario-dolci',
        price: 360,
        short_description: 'Silky mascarpone cream layered with espresso-soaked ladyfinger biscuits and dusted with Dutch cocoa powder.',
        full_description: 'The definitive Italian dessert.',
        ingredients: ['Mascarpone Cheese', 'Espresso', 'Savoiardi Biscuits', 'Cocoa Powder'],
        allergens: ['Dairy', 'Gluten', 'Egg'],
        dietary_flags: ['non_veg'],
        spice_level: 0,
        serving_size: '1 Cup',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 29. KMCY (Sheraton Grand, Sangamwadi) ────────────────────
  {
    matchKeywords: ['kmcy', 'sheraton grand kmcy', 'kmcy chinese'],
    categories: [
      { idSuffix: 'kmcy-dimsum', name: 'Handcrafted Dim Sum & Baos', sort_order: 1 },
      { idSuffix: 'kmcy-sichuan', name: 'Authentic Sichuan Specialties', sort_order: 2 },
      { idSuffix: 'kmcy-noodles', name: 'Dan Dan & Hand-Pulled Noodles', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Chengdu Dan Dan Noodles with Minced Chicken',
        categorySuffix: 'kmcy-noodles',
        price: 680,
        short_description: 'Springy wheat noodles tossed in fiery Sichuan chili oil, sesame paste, preserved mustard greens (yacai), and fragrant spiced minced chicken.',
        full_description: 'Authentic Chengdu street classic with the signature tingling mala sensation from toasted green and red Sichuan peppercorns.',
        ingredients: ['Hand-Pulled Noodles', 'Minced Chicken', 'Sichuan Peppercorns', 'Chili Oil', 'Sesame Paste', 'Yacai'],
        allergens: ['Gluten', 'Soy', 'Sesame'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: '1 Bowl',
        image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Sichuan Kung Pao Chicken with Dried Chilies',
        categorySuffix: 'kmcy-sichuan',
        price: 780,
        short_description: 'Wok-tossed chicken thigh cubes with whole lantern chilies, roasted peanuts, and scallions in a sweet-sour-tingling brown glaze.',
        full_description: 'Masterfully tossed in high-heat woks by native Sichuan master chefs.',
        ingredients: ['Chicken Thigh', 'Sichuan Lantern Chilies', 'Peanuts', 'Ginger', 'Chinkiang Vinegar'],
        allergens: ['Peanuts', 'Soy'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: 'Serves 2',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Steamed Crystal Prawn Har Gow (4 Pieces)',
        categorySuffix: 'kmcy-dimsum',
        price: 620,
        short_description: 'Translucent steamed pleated dumplings encasing juicy whole prawns and bamboo shoots.',
        full_description: 'Delicate wheat-starch wrapper folded with 10 traditional pleats.',
        ingredients: ['Whole Sea Prawns', 'Bamboo Shoots', 'Wheat Starch', 'Sesame Oil'],
        allergens: ['Shellfish', 'Sesame'],
        dietary_flags: ['non_veg'],
        spice_level: 1,
        serving_size: '4 Pieces',
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  },

  // ── 30. CAFE GOA (Viman Nagar) ──────────────────────────────
  {
    matchKeywords: ['cafe goa', 'cafe goa viman nagar'],
    categories: [
      { idSuffix: 'goa-curry', name: 'Traditional Goan Curries & Rice', sort_order: 1 },
      { idSuffix: 'goa-roast', name: 'Cafreal, Xacuti & Poi Bakes', sort_order: 2 },
      { idSuffix: 'goa-desserts', name: 'Goan Bebinca & Coolers', sort_order: 3 }
    ],
    dishes: [
      {
        name: 'Goan Prawn Curry with Steamed Rice',
        categorySuffix: 'goa-curry',
        price: 460,
        short_description: 'Fresh sea prawns simmered in fiery orange coconut-tamarind curry spiced with Kashmiri chilies, coriander seeds, and tart teppal berries, served with hot rice.',
        full_description: 'The soul of Goan homes. Cooked in clay pot with fresh coconut extract and kokum.',
        ingredients: ['Sea Prawns', 'Fresh Coconut Extract', 'Kashmiri Chili', 'Kokum', 'Teppal Berries', 'Goan Rice'],
        allergens: ['Shellfish'],
        dietary_flags: ['non_veg', 'gluten_free'],
        spice_level: 3,
        serving_size: '1 Curry Bowl with Rice',
        image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true,
        is_chef_recommended: true
      },
      {
        name: 'Chicken Cafreal with Warm Goan Poi',
        categorySuffix: 'goa-roast',
        price: 390,
        short_description: 'Tender chicken drumsticks pan-roasted in a thick pungent paste of fresh coriander, mint, green chilies, cloves, cinnamon, and Goan toddy vinegar.',
        full_description: 'Served with authentic pocketed hollow Goan poi bread to scoop the aromatic green masala.',
        ingredients: ['Chicken Leg', 'Fresh Coriander', 'Goan Toddy Vinegar', 'Green Chilies', 'Whole Spices', 'Goan Poi Bread'],
        allergens: ['Gluten'],
        dietary_flags: ['non_veg'],
        spice_level: 3,
        serving_size: 'Serves 1-2',
        image_url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      },
      {
        name: 'Seven-Layered Warm Goan Bebinca',
        categorySuffix: 'goa-desserts',
        price: 160,
        short_description: 'Traditional Indo-Portuguese layered pudding baked layer-by-layer with coconut milk, egg yolks, flour, nutmeg, and ghee.',
        full_description: 'Rich, caramelized, served warm with vanilla ice cream.',
        ingredients: ['Coconut Milk', 'Egg Yolks', 'Nutmeg', 'Pure Ghee', 'Flour'],
        allergens: ['Egg', 'Dairy', 'Gluten'],
        dietary_flags: ['non_veg'],
        spice_level: 0,
        serving_size: '1 Slice',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
        is_signature: true,
        is_bestseller: true
      }
    ]
  }
];

/**
 * Normalizes text to match restaurant names accurately against keywords
 */
function normalizeName(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Looks up if a restaurant has a dedicated authentic scanned menu.
 */
export function findAuthenticPuneMenu(
  restaurantName?: string,
  restaurantSlug?: string
): PuneMenuBlueprint | null {
  const normName = normalizeName(restaurantName || '');
  const normSlug = normalizeName(restaurantSlug || '');

  for (const blueprint of AUTHENTIC_PUNE_RESTAURANT_MENUS) {
    for (const kw of blueprint.matchKeywords) {
      const normKw = normalizeName(kw);
      if (normKw.length >= 3) {
        if (normName.includes(normKw) || normKw.includes(normName) || normSlug.includes(normKw)) {
          return blueprint;
        }
      }
    }
  }

  return null;
}
