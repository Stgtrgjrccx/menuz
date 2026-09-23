import {
  Restaurant,
  RestaurantTable,
  MenuCategory,
  MenuItem,
  RestaurantAiQuestionnaire,
  CustomerReview,
  ReviewChallenge,
  ChallengeRedemption,
  PosIntegrationConfig,
} from '../types';

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-saffron-house-01',
    slug: 'saffron-house',
    name: 'Saffron House',
    cuisine: 'Contemporary Indian Dining',
    location: 'Bandra West, Mumbai',
    owner_name: 'Vikram Malhotra',
    contact_email: 'vikram@saffronhouse.in',
    contact_phone: '+91 98200 44123',
    status: 'active',
    logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    brand_colors: {
      primary: '#E85D04',
      background: '#FDFBF7',
      text: '#1C1917',
      accent: '#C84B00'
    },
    currency: 'INR',
    tax_rate_percent: 5.00,
    ordering_enabled: true,
    google_place_url: 'https://maps.google.com/?cid=1234567890',
    authentic_photography_statement: 'Every photograph in this digital menu is an authentic culinary capture of dishes prepared fresh in our kitchen, subject only to natural artisanal variations.',
    pos_provider: 'toast'
  },
  {
    id: 'rest-casa-bella-02',
    slug: 'casa-bella',
    name: 'Casa Bella Trattoria',
    cuisine: 'Artisanal Italian & Woodfired Pizza',
    location: 'Indiranagar, Bengaluru',
    owner_name: 'Elena Rossi & Marco V.',
    contact_email: 'ciao@casabella.in',
    contact_phone: '+91 98450 12890',
    status: 'active',
    logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    brand_colors: {
      primary: '#B91C1C',
      background: '#FAFAF9',
      text: '#1C1917',
      accent: '#991B1B'
    },
    currency: 'INR',
    tax_rate_percent: 5.00,
    ordering_enabled: true,
    google_place_url: 'https://maps.google.com/?cid=9876543210',
    authentic_photography_statement: 'Our dishes and slow-fermented pizzas are captured as prepared by our pizzaiolo in our wood-fired oven.',
    pos_provider: 'clover'
  },
  {
    id: 'rest-sakura-03',
    slug: 'sakura-ramen',
    name: 'Sakura Ramen & Izakaya',
    cuisine: 'Authentic Japanese Broths & Robata',
    location: 'Cyber City, Gurugram',
    owner_name: 'Kenji Takahashi',
    contact_email: 'contact@sakuragroup.asia',
    contact_phone: '+91 98110 99321',
    status: 'active',
    logo_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&auto=format&fit=crop',
    brand_colors: {
      primary: '#0F766E',
      background: '#F0FDFA',
      text: '#0F172A',
      accent: '#0D9488'
    },
    currency: 'INR',
    tax_rate_percent: 5.00,
    ordering_enabled: true,
    google_place_url: 'https://maps.google.com/?cid=1122334455',
    authentic_photography_statement: 'Handmade 24-hour broths and ramen bowls photographed directly in our open kitchen.',
    pos_provider: 'square'
  }
];

export const SEED_RESTAURANT = SEED_RESTAURANTS[0];

export const SEED_TABLES: RestaurantTable[] = [
  // Saffron House
  { id: 'tbl-01', restaurant_id: 'rest-saffron-house-01', label: 'Table 1', public_token: 'table-token-01-saffron', nfc_tag_id: 'nfc-sh-01', is_active: true },
  { id: 'tbl-02', restaurant_id: 'rest-saffron-house-01', label: 'Table 2', public_token: 'table-token-02-saffron', nfc_tag_id: 'nfc-sh-02', is_active: true },
  { id: 'tbl-03', restaurant_id: 'rest-saffron-house-01', label: 'Table 3', public_token: 'table-token-03-saffron', nfc_tag_id: 'nfc-sh-03', is_active: true },
  { id: 'tbl-04', restaurant_id: 'rest-saffron-house-01', label: 'Table 4', public_token: 'table-token-04-saffron', nfc_tag_id: 'nfc-sh-04', is_active: true },
  
  // Casa Bella
  { id: 'tbl-cb-01', restaurant_id: 'rest-casa-bella-02', label: 'Veranda Table 1', public_token: 'table-token-cb-01', nfc_tag_id: 'nfc-cb-01', is_active: true },
  { id: 'tbl-cb-02', restaurant_id: 'rest-casa-bella-02', label: 'Veranda Table 2', public_token: 'table-token-cb-02', nfc_tag_id: 'nfc-cb-02', is_active: true },

  // Sakura
  { id: 'tbl-sk-01', restaurant_id: 'rest-sakura-03', label: 'Counter Seat 1', public_token: 'table-token-sk-01', nfc_tag_id: 'nfc-sk-01', is_active: true },
  { id: 'tbl-sk-02', restaurant_id: 'rest-sakura-03', label: 'Booth Table 4', public_token: 'table-token-sk-02', nfc_tag_id: 'nfc-sk-02', is_active: true },
];

export const SEED_CATEGORIES: MenuCategory[] = [
  // Saffron House
  { id: 'cat-app', restaurant_id: 'rest-saffron-house-01', name: 'Appetizers', category_type: 'food', sort_order: 1, is_active: true },
  { id: 'cat-clay', restaurant_id: 'rest-saffron-house-01', name: 'Clay Oven (Tandoor)', category_type: 'food', sort_order: 2, is_active: true },
  { id: 'cat-curry', restaurant_id: 'rest-saffron-house-01', name: 'Heritage Curries', category_type: 'food', sort_order: 3, is_active: true },
  { id: 'cat-bread', restaurant_id: 'rest-saffron-house-01', name: 'Breads & Rice', category_type: 'food', sort_order: 4, is_active: true },
  { id: 'cat-bev', restaurant_id: 'rest-saffron-house-01', name: 'Beverages & Desserts', category_type: 'drink', sort_order: 5, is_active: true },

  // Casa Bella
  { id: 'cat-cb-antipasti', restaurant_id: 'rest-casa-bella-02', name: 'Antipasti', category_type: 'food', sort_order: 1, is_active: true },
  { id: 'cat-cb-pizza', restaurant_id: 'rest-casa-bella-02', name: 'Woodfired Pizza', category_type: 'food', sort_order: 2, is_active: true },
  { id: 'cat-cb-pasta', restaurant_id: 'rest-casa-bella-02', name: 'Fresh Pasta', category_type: 'food', sort_order: 3, is_active: true },
  { id: 'cat-cb-drinks', restaurant_id: 'rest-casa-bella-02', name: 'Vino & Cocktails', category_type: 'drink', sort_order: 4, is_active: true },

  // Sakura
  { id: 'cat-sk-ramen', restaurant_id: 'rest-sakura-03', name: 'Signature Ramen', category_type: 'food', sort_order: 1, is_active: true },
  { id: 'cat-sk-robata', restaurant_id: 'rest-sakura-03', name: 'Robata Skewers', category_type: 'food', sort_order: 2, is_active: true },
  { id: 'cat-sk-drinks', restaurant_id: 'rest-sakura-03', name: 'Sake & Refreshers', category_type: 'drink', sort_order: 3, is_active: true },
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  // Saffron House - Appetizers
  {
    id: 'item-app-1',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-app',
    name: 'Truffle & Edamame Potli Samosa',
    item_type: 'food',
    price: 380.00,
    short_description: 'Crispy handmade pastry parcels infused with winter truffle essence.',
    full_description: 'Delicate hand-crimped pastry purses packed with crushed edamame, young green peas, and scented with black truffle ghee. Served with date-tamarind chutney.',
    ingredients: ['Edamame', 'Green Peas', 'Wheat Flour', 'Truffle Oil', 'Ghee'],
    allergens: ['Gluten', 'Dairy'],
    dietary_flags: ['Vegetarian'],
    spice_level: 1,
    serving_size: '3 pieces',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    is_chef_recommended: true,
    pairing_item_ids: ['item-bev-1'],
    chef_notes: 'Pairs harmoniously with chilled Alphonso Mango Lassi.',
    sort_order: 1
  },
  {
    id: 'item-app-2',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-app',
    name: 'Beetroot & Goat Cheese Tikki',
    item_type: 'food',
    price: 360.00,
    short_description: 'Roasted organic golden beet cutlets centered with Chevre cheese.',
    full_description: 'Spiced roasted beetroot cakes filled with creamy goat cheese, coated in panko, pan-seared with fennel oil and served over smoked tomato relish.',
    ingredients: ['Beetroot', 'Goat Cheese', 'Potatoes', 'Cumin', 'Fennel'],
    allergens: ['Dairy', 'Gluten'],
    dietary_flags: ['Vegetarian'],
    spice_level: 1,
    serving_size: '4 pieces',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: ['item-bev-3'],
    sort_order: 2
  },
  {
    id: 'item-app-3',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-app',
    name: 'Amritsari Soft Shell Crab',
    item_type: 'food',
    price: 550.00,
    short_description: 'Crispy carom seed-battered coastal soft shell crab with radish mooli salad.',
    full_description: 'Wild coastal soft shell crabs dredged in ajwain-spiced gram flour tempura, flash-fried until shatteringly crisp. Accompanied by mint caviar.',
    ingredients: ['Soft Shell Crab', 'Gram Flour (Besan)', 'Ajwain', 'Lemon', 'Mustard Oil'],
    allergens: ['Crustacean'],
    dietary_flags: ['Gluten-Free', 'High-Protein'],
    spice_level: 3,
    serving_size: '2 whole crabs',
    image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: ['item-clay-2'],
    sort_order: 3
  },
  {
    id: 'item-app-4',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-app',
    name: 'Avocado & Pomelo Bhel',
    item_type: 'food',
    price: 340.00,
    short_description: 'Puffed grain salad with Hass avocado, ruby pomelo, tangy mint emulsion.',
    full_description: 'Modern twist on Mumbai street chaat combining organic puffed wild rice, ruby pomelo segments, diced Hass avocado, nylon sev, and passion fruit amchur glaze.',
    ingredients: ['Puffed Rice', 'Avocado', 'Pomelo', 'Sev', 'Raw Mango', 'Mint'],
    allergens: [],
    dietary_flags: ['Vegetarian', 'Vegan', 'Dairy-Free'],
    spice_level: 1,
    serving_size: 'Serves 1-2',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: [],
    sort_order: 4
  },

  // Saffron House - Tandoor
  {
    id: 'item-clay-1',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-clay',
    name: 'Kashmiri Saffron Paneer Tikka',
    item_type: 'food',
    price: 460.00,
    short_description: 'Charred cottage cheese cubes marinated in Pampore saffron and Greek yogurt.',
    full_description: 'Farm-fresh Malai paneer steeped in high-grade Pampore saffron, hung curd, yellow mustard oil, and crushed green cardamom, flame-roasted in the clay tandoor.',
    ingredients: ['Paneer (Cottage Cheese)', 'Kashmiri Saffron', 'Hung Curd', 'Cardamom', 'Bell Peppers'],
    allergens: ['Dairy'],
    dietary_flags: ['Vegetarian', 'Gluten-Free'],
    spice_level: 2,
    serving_size: '5 large skewers',
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    pairing_item_ids: ['item-bread-1', 'item-bev-1'],
    chef_notes: 'Our flagship vegetarian clay oven specialty.',
    sort_order: 1
  },
  {
    id: 'item-clay-2',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-clay',
    name: 'Old Delhi Smoked Murgh Malai Tikka',
    item_type: 'food',
    price: 520.00,
    short_description: 'Tender chicken morsels basted in cream, royal cumin, and roasted garlic.',
    full_description: 'Boneless chicken thighs tenderized overnight in cashew-cream paste, royal shahi jeera, and crushed green peppercorns, char-grilled with a light dhungar wood smoke finish.',
    ingredients: ['Chicken Thighs', 'Cashew Paste', 'Fresh Cream', 'Shahi Jeera', 'Green Pepper'],
    allergens: ['Dairy', 'Tree Nuts'],
    dietary_flags: ['Gluten-Free', 'Halal', 'High-Protein'],
    spice_level: 1,
    serving_size: '6 pieces',
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop',
    is_available: true,
    is_chef_recommended: true,
    pairing_item_ids: ['item-bread-2'],
    sort_order: 2
  },
  {
    id: 'item-clay-3',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-clay',
    name: 'Galouti Kebab Sliders on Saffron Sheermal',
    item_type: 'food',
    price: 590.00,
    short_description: 'Melt-in-the-mouth Awadhi spiced lamb patties nestled in miniature saffron bread.',
    full_description: 'Minced milk-fed lamb infused with 32 botanicals, potli masala, and smoked marrow fat, served on miniature saffron-scented baby sheermals with pickled shallots.',
    ingredients: ['Minced Lamb', 'Saffron', 'Raw Papaya', 'Ghee', 'Rose Water', 'Flour'],
    allergens: ['Gluten', 'Dairy'],
    dietary_flags: ['Halal'],
    spice_level: 2,
    serving_size: '3 sliders',
    image_url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: ['item-bev-3'],
    sort_order: 3
  },

  // Saffron House - Heritage Curries
  {
    id: 'item-curry-1',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-curry',
    name: 'Saffron House Signature Butter Chicken (1950s Recipe)',
    item_type: 'food',
    price: 580.00,
    short_description: 'Slow-simmered vine tomato gravy enriched with churned butter and fenugreek leaves.',
    full_description: 'Hand-pulled tandoori roasted chicken submerged in a velvet sauce made exclusively with San Marzano style vine tomatoes, white unsalted makhan, Kashmiri degi mirch, and hand-rubbed kasuri methi. Never overly sweet.',
    ingredients: ['Chicken', 'Vine Tomatoes', 'Cultured Butter', 'Kasuri Methi', 'Honey', 'Cream'],
    allergens: ['Dairy'],
    dietary_flags: ['Gluten-Free', 'Halal'],
    spice_level: 2,
    serving_size: 'Serves 2',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    pairing_item_ids: ['item-bread-1', 'item-bread-3'],
    chef_notes: 'Prepared using traditional vine reduction without artificial coloring.',
    sort_order: 1
  },
  {
    id: 'item-curry-2',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-curry',
    name: 'Dal Makhani Saffron House (Slow Simmered 24 Hours)',
    item_type: 'food',
    price: 440.00,
    short_description: 'Whole black urad lentils braised overnight on dying charcoal with cultured cream.',
    full_description: 'Signature black lentils and kidney beans simmered continuously for 24 hours with tomato reduction, ginger slivers, and churned mountain butter.',
    ingredients: ['Black Urad Dal', 'Kidney Beans', 'Butter', 'Ginger', 'Tomato Puree', 'Cream'],
    allergens: ['Dairy'],
    dietary_flags: ['Vegetarian', 'Gluten-Free'],
    spice_level: 1,
    serving_size: 'Serves 2',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    pairing_item_ids: ['item-bread-1', 'item-bread-2'],
    sort_order: 2
  },

  // Saffron House - Breads & Rice
  {
    id: 'item-bread-1',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-bread',
    name: 'Truffle & Roasted Garlic Butter Naan',
    item_type: 'food',
    price: 180.00,
    short_description: 'Leavened flatbread brushed with black truffle ghee and golden garlic crisps.',
    full_description: 'Refined flour dough blistered in a 400°C clay tandoor, finished with white truffle oil, cultured butter, and crushed garlic chips.',
    ingredients: ['Wheat Flour', 'Garlic', 'Truffle Ghee', 'Coriander'],
    allergens: ['Gluten', 'Dairy'],
    dietary_flags: ['Vegetarian'],
    spice_level: 0,
    serving_size: '1 large naan',
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: ['item-curry-1', 'item-curry-2'],
    sort_order: 1
  },
  {
    id: 'item-bread-2',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-bread',
    name: 'Peshawari Saffron Dum Biryani (Chicken)',
    item_type: 'food',
    price: 620.00,
    short_description: 'Aged basmati rice sealed under dough with spiced chicken and mint.',
    full_description: '2-year aged Daawat basmati grains steam-cooked with country chicken, barista fried onions, pure saffron milk, and fresh mint. Accompanied by smoked burani garlic raita.',
    ingredients: ['Aged Basmati Rice', 'Chicken', 'Saffron', 'Mint', 'Ghee', 'Fried Onions'],
    allergens: ['Dairy'],
    dietary_flags: ['Gluten-Free', 'Halal'],
    spice_level: 2,
    serving_size: 'Serves 2',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    pairing_item_ids: ['item-bev-1'],
    sort_order: 2
  },

  // Saffron House - Beverages & Desserts
  {
    id: 'item-bev-1',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-bev',
    name: 'Alphonso Mango & Saffron Lassi',
    item_type: 'drink',
    price: 240.00,
    short_description: 'Velvety churned yogurt drink with Ratnagiri mango pulp and pistachio slivers.',
    full_description: 'Creamy organic yogurt blended with single-estate Ratnagiri Alphonso mango puree, green cardamom, and crowned with saffron threads and toasted pistachios.',
    ingredients: ['Yogurt', 'Alphonso Mango', 'Saffron', 'Cardamom', 'Pistachio'],
    allergens: ['Dairy', 'Tree Nuts'],
    dietary_flags: ['Vegetarian', 'Gluten-Free'],
    spice_level: 0,
    sweet_level: 3,
    serving_size: '350 ml',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    pairing_item_ids: ['item-curry-1', 'item-bread-1'],
    sort_order: 1
  },
  {
    id: 'item-bev-2',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-bev',
    name: 'Paan & Rose Petal Kulfi Pop',
    item_type: 'food',
    price: 260.00,
    short_description: 'Creamy frozen rabri on a stick scented with Banarasi betel leaf and gulkand.',
    full_description: 'Slowly condensed whole buffalo milk steeped with fresh betel leaves, rose petal preserve, and fennel crunch.',
    ingredients: ['Condensed Milk', 'Betel Leaf', 'Rose Petals', 'Fennel', 'Almonds'],
    allergens: ['Dairy', 'Tree Nuts'],
    dietary_flags: ['Vegetarian', 'Gluten-Free'],
    spice_level: 0,
    sweet_level: 4,
    serving_size: '1 bar',
    image_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: [],
    sort_order: 2
  },

  // Casa Bella Trattoria Items
  {
    id: 'item-cb-1',
    restaurant_id: 'rest-casa-bella-02',
    category_id: 'cat-cb-pizza',
    name: 'Pizza Margherita Verace D.O.P.',
    item_type: 'food',
    price: 650.00,
    short_description: 'San Marzano tomatoes, fresh Fior di Latte, Ligurian basil, extra virgin olive oil.',
    full_description: '48-hour fermented Neapolitan dough baked at 480°C with charred leopard crust, sweet crushed tomato sauce, and creamy buffalo mozzarella.',
    ingredients: ['Caputo Flour', 'San Marzano Tomatoes', 'Fior di Latte', 'Fresh Basil', 'EVOO'],
    allergens: ['Gluten', 'Dairy'],
    dietary_flags: ['Vegetarian'],
    spice_level: 0,
    serving_size: '12 inch pizza',
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    pairing_item_ids: ['item-cb-3'],
    sort_order: 1
  },
  {
    id: 'item-cb-2',
    restaurant_id: 'rest-casa-bella-02',
    category_id: 'cat-cb-pasta',
    name: 'Handcrafted Truffle Tagliolini',
    item_type: 'food',
    price: 720.00,
    short_description: 'Fresh 30-egg yolk egg pasta spun in aged Parmigiano Reggiano & black truffle butter.',
    full_description: 'Silky house-extruded ribbon pasta coated in 24-month mountain parmesan emulsion and freshly shaved Norcia black winter truffle.',
    ingredients: ['Egg Tagliolini', 'Parmigiano Reggiano', 'Black Truffle', 'Butter'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    dietary_flags: ['Vegetarian'],
    spice_level: 0,
    serving_size: 'Single serving',
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop',
    is_available: true,
    is_chef_recommended: true,
    pairing_item_ids: ['item-cb-3'],
    sort_order: 2
  },
  {
    id: 'item-cb-3',
    restaurant_id: 'rest-casa-bella-02',
    category_id: 'cat-cb-drinks',
    name: 'Aperol Spritz Veneziano',
    item_type: 'drink',
    price: 490.00,
    short_description: 'Prosecco DOC, Aperol, sparkling soda, and fresh Sicilian orange slice.',
    full_description: 'The definitive Italian aperitivo served in a chilled goblet with artisanal ice and a green Cerignola olive.',
    ingredients: ['Prosecco', 'Aperol', 'Soda', 'Orange'],
    allergens: [],
    dietary_flags: ['Gluten-Free', 'Vegan'],
    spice_level: 0,
    sweet_level: 2,
    serving_size: '220 ml',
    image_url: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: ['item-cb-1'],
    sort_order: 3
  },

  // Sakura Ramen Items
  {
    id: 'item-sk-1',
    restaurant_id: 'rest-sakura-03',
    category_id: 'cat-sk-ramen',
    name: 'Kyoto Rich Tonkotsu Ramen',
    item_type: 'food',
    price: 680.00,
    short_description: '24-hour pork bone broth, springy wheat noodles, chashu pork belly, ajitsuke egg.',
    full_description: 'Deep collagen-rich broth boiled for 24 hours, paired with springy thin wheat noodles, slow-braised rolled pork belly, kikurage mushrooms, and nori sheet.',
    ingredients: ['Tonkotsu Broth', 'Ramen Noodles', 'Chashu Pork', 'Nitadago Egg', 'Scallions', 'Nori'],
    allergens: ['Gluten', 'Soy', 'Eggs'],
    dietary_flags: ['High-Protein'],
    spice_level: 1,
    serving_size: 'Large bowl (750 ml)',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop',
    is_available: true,
    is_signature: true,
    pairing_item_ids: ['item-sk-2'],
    sort_order: 1
  },
  {
    id: 'item-sk-2',
    restaurant_id: 'rest-sakura-03',
    category_id: 'cat-sk-drinks',
    name: 'Yuzu Sparkling Highball',
    item_type: 'drink',
    price: 360.00,
    short_description: 'Kochi prefecture fresh yuzu citrus, sparkling water, mint sprig, honey syrup.',
    full_description: 'Refreshing aromatic Japanese citrus cooler served over hand-cut ice block with fresh mint.',
    ingredients: ['Yuzu Juice', 'Sparkling Mineral Water', 'Wild Honey', 'Fresh Mint'],
    allergens: [],
    dietary_flags: ['Vegetarian', 'Gluten-Free'],
    spice_level: 0,
    sweet_level: 2,
    serving_size: '300 ml',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
    is_available: true,
    pairing_item_ids: ['item-sk-1'],
    sort_order: 2
  }
];

export const SEED_QUESTIONNAIRES: Record<string, RestaurantAiQuestionnaire> = {
  'rest-saffron-house-01': {
    restaurant_id: 'rest-saffron-house-01',
    concept: 'Contemporary royal Indian culinary heritage reimagined with modern culinary craftsmanship.',
    cuisine_style: 'Progressive Indian & Awadhi tandoor',
    dining_experience: 'Upscale leisurely dining with sensory aromas and sommelier beverage pairings.',
    price_positioning: 'Premium / Fine Dining (Average ₹1,800 for two)',
    target_customer: 'Epicures, food enthusiasts, corporate dinners, families celebrating special milestones.',
    signature_dishes: [
      'Saffron House Signature Butter Chicken (1950s Recipe)',
      'Kashmiri Saffron Paneer Tikka',
      'Dal Makhani Saffron House (Slow Simmered 24 Hours)',
      'Peshawari Saffron Dum Biryani'
    ],
    chef_recommendations: [
      'Old Delhi Smoked Murgh Malai Tikka with Truffle Garlic Naan',
      'Truffle & Edamame Potli Samosa with Alphonso Mango Lassi'
    ],
    best_sellers: [
      'Signature Butter Chicken',
      'Peshawari Dum Biryani',
      'Alphonso Mango & Saffron Lassi'
    ],
    pairings_overview: 'Rich tomato gravies should always be paired with Truffle Garlic Naan and cooled down with Mango Lassi. Mild kebabs pair with Green Kashmiri Kahwa.',
    custom_rules: 'Never suggest off-menu items. Always confirm allergy requirements before confirming dish adds.'
  },
  'rest-casa-bella-02': {
    restaurant_id: 'rest-casa-bella-02',
    concept: 'Warm rustic Italian trattoria focusing on authentic fermented dough and handmade pasta.',
    cuisine_style: 'Campanian & Tuscan Italian',
    dining_experience: 'Bustling, warm, rustic neighborhood trattoria.',
    price_positioning: 'Casual Fine Dining (Average ₹1,500 for two)',
    target_customer: 'Couples, pizza connoisseurs, wine lovers.',
    signature_dishes: ['Pizza Margherita Verace D.O.P.', 'Handcrafted Truffle Tagliolini'],
    chef_recommendations: ['Truffle Tagliolini with Aperol Spritz'],
    best_sellers: ['Pizza Margherita Verace D.O.P.'],
    pairings_overview: 'Pair woodfired pizzas with effervescent Aperol Spritz.',
    custom_rules: 'Emphasize 48-hour fermented crust digestibility.'
  },
  'rest-sakura-03': {
    restaurant_id: 'rest-sakura-03',
    concept: 'Tokyo alleyway izakaya with authentic collagen broths and robata yakitori.',
    cuisine_style: 'Kyoto Ramen & Tokyo Izakaya',
    dining_experience: 'Fast, intimate counter seating with steaming hot bowls.',
    price_positioning: 'Mid-tier authentic specialty (Average ₹1,200 for two)',
    target_customer: 'Young professionals, Japanese expatriates, solo diners.',
    signature_dishes: ['Kyoto Rich Tonkotsu Ramen'],
    chef_recommendations: ['Tonkotsu Ramen with Yuzu Sparkling Highball'],
    best_sellers: ['Kyoto Rich Tonkotsu Ramen'],
    pairings_overview: 'Rich pork broth pairs ideally with acidic, bright citrus yuzu highball.',
    custom_rules: 'Warn diners that broth is piping hot and rich.'
  }
};

export const SEED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    restaurant_id: 'rest-saffron-house-01',
    customer_name: 'Priya Sharma',
    customer_phone: '+91 98201 12345',
    customer_email: 'priya.sharma@example.com',
    rating: 5,
    selected_keywords: ['Food', 'Service', 'Ambience', 'Experience'],
    review_text: 'The 1950s Butter Chicken and Truffle Garlic Naan were out of this world! Incredible authentic presentation and warm hospitality.',
    whatsapp_opt_in: true,
    google_review_clicked: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'rev-02',
    restaurant_id: 'rest-saffron-house-01',
    customer_name: 'Rahul Deshmukh',
    customer_phone: '+91 98330 67890',
    customer_email: 'rahul.d@example.com',
    rating: 5,
    selected_keywords: ['Food', 'Drinks', 'Staff', 'Cleanliness'],
    review_text: 'Top notch saffron paneer tikka. The digital menu and AI waiter made ordering smooth and fast!',
    whatsapp_opt_in: true,
    google_review_clicked: true,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: 'rev-03',
    restaurant_id: 'rest-saffron-house-01',
    customer_name: 'Ananya Sen',
    customer_phone: '+91 99002 44556',
    customer_email: 'ananya.sen@example.com',
    rating: 4,
    selected_keywords: ['Food', 'Ambience', 'Value'],
    review_text: 'Beautiful interior vibe and delectable 24-hour Dal Makhani. Highly recommend visiting with friends.',
    whatsapp_opt_in: false,
    google_review_clicked: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const SEED_CHALLENGES: ReviewChallenge[] = [
  {
    id: 'chal-sh-01',
    restaurant_id: 'rest-saffron-house-01',
    title: 'Reviewer Lucky Spin Challenge',
    description: 'Leave a verified customer review, unlock the mystery wheel, and spin to win a complimentary culinary treat!',
    reward_type: 'free_drink',
    reward_item_name: 'Complimentary Alphonso Mango Lassi',
    win_probability_percent: 100,
    is_active: true,
    terms: 'Valid on today’s dining bill for Table orders. One redemption per table.',
    redemption_code_prefix: 'SAFFRON-WIN-'
  },
  {
    id: 'chal-cb-01',
    restaurant_id: 'rest-casa-bella-02',
    title: 'Bella Sweet Treat Spin',
    description: 'Review your meal and spin the wheel for a free handcrafted Italian dessert!',
    reward_type: 'free_dessert',
    reward_item_name: 'Complimentary Classic Tiramisu',
    win_probability_percent: 100,
    is_active: true,
    terms: 'Redeemable on minimum bill of ₹800.',
    redemption_code_prefix: 'BELLA-GIFT-'
  }
];

export const SEED_REDEMPTIONS: ChallengeRedemption[] = [
  {
    id: 'red-01',
    restaurant_id: 'rest-saffron-house-01',
    review_id: 'rev-01',
    customer_name: 'Priya Sharma',
    voucher_code: 'SAFFRON-WIN-9418',
    reward_item_name: 'Complimentary Alphonso Mango Lassi',
    status: 'redeemed',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    redeemed_at: new Date(Date.now() - 3600000 * 47).toISOString()
  },
  {
    id: 'red-02',
    restaurant_id: 'rest-saffron-house-01',
    review_id: 'rev-02',
    customer_name: 'Rahul Deshmukh',
    voucher_code: 'SAFFRON-WIN-3129',
    reward_item_name: 'Complimentary Alphonso Mango Lassi',
    status: 'unclaimed',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString()
  }
];

export const SEED_POS_CONFIGS: Record<string, PosIntegrationConfig> = {
  'rest-saffron-house-01': {
    restaurant_id: 'rest-saffron-house-01',
    provider: 'toast',
    connection_status: 'connected',
    last_sync_time: new Date().toISOString(),
    auto_sync_orders: true,
    sync_latency_ms: 142,
    sync_log: [
      { id: 'log-1', timestamp: new Date(Date.now() - 120000).toISOString(), event: 'ORDER_PUSH', details: 'Order #SH-1001 synced to Toast POS terminal 2', status: 'success' },
      { id: 'log-2', timestamp: new Date(Date.now() - 600000).toISOString(), event: 'STOCK_SYNC', details: 'Menu 86-list synchronised bidirectionally', status: 'info' }
    ]
  },
  'rest-casa-bella-02': {
    restaurant_id: 'rest-casa-bella-02',
    provider: 'clover',
    connection_status: 'connected',
    last_sync_time: new Date().toISOString(),
    auto_sync_orders: true,
    sync_latency_ms: 198,
    sync_log: [
      { id: 'log-cb-1', timestamp: new Date(Date.now() - 300000).toISOString(), event: 'ORDER_PUSH', details: 'Order #CB-502 synced to Clover Mini', status: 'success' }
    ]
  },
  'rest-sakura-03': {
    restaurant_id: 'rest-sakura-03',
    provider: 'square',
    connection_status: 'connected',
    last_sync_time: new Date().toISOString(),
    auto_sync_orders: true,
    sync_latency_ms: 110,
    sync_log: [
      { id: 'log-sk-1', timestamp: new Date(Date.now() - 450000).toISOString(), event: 'ORDER_PUSH', details: 'Order #SK-301 synced to Square Register', status: 'success' }
    ]
  }
};
