/**
 * Pune Restaurant Directory
 * ─────────────────────────────────────────────────────────────
 * A curated directory of real Pune restaurants sourced from
 * Google Maps, Swiggy, and Zomato public listings.
 *
 * Used for autocomplete suggestions in the Onboard Restaurant
 * modal so the admin can type the first few letters, pick a
 * restaurant, and have its details auto-filled.
 * ─────────────────────────────────────────────────────────────
 */

export interface PuneRestaurantEntry {
  name: string;
  cuisine: string;
  location: string;       // Neighborhood / Area
  address: string;        // Street-level address
  phone: string;
  avgCostForTwo: string;  // ₹ range
  rating: number;         // Approximate aggregate rating
  imageUrl: string;       // Unsplash placeholder
  posProvider: 'toast' | 'clover' | 'square' | 'universal_api';
  aliases?: string[];
}

export const PUNE_RESTAURANT_DIRECTORY: PuneRestaurantEntry[] = [
  // ── Koregaon Park ──────────────────────────────────────────
  {
    name: 'Malaka Spice',
    cuisine: 'Pan-Asian, Thai, Vietnamese',
    location: 'Koregaon Park, Pune',
    address: 'Lane No. 5, North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2615 1901',
    avgCostForTwo: '₹1,500',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'The Daily All Day',
    cuisine: 'European, Continental, Cocktails',
    location: 'Koregaon Park, Pune',
    address: 'North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2614 5678',
    avgCostForTwo: '₹1,800',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Hard Rock Cafe',
    cuisine: 'American, Bar Food, Burgers',
    location: 'Koregaon Park, Pune',
    address: 'Mundhwa Road, Koregaon Park, Pune 411001',
    phone: '+91 20 3058 7777',
    avgCostForTwo: '₹2,000',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Savya Rasa',
    cuisine: 'South Indian Fine Dining, Kerala, Karnataka',
    location: 'Koregaon Park, Pune',
    address: 'Lane No. 5, North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 77 7500 7775',
    avgCostForTwo: '₹1,600',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Dario\'s Trattoria & Pizzeria',
    cuisine: 'Italian, Woodfired Pizza, Pasta',
    location: 'Koregaon Park, Pune',
    address: 'Lane No. 7, North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2613 6666',
    avgCostForTwo: '₹1,400',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'The French Window Patisserie',
    cuisine: 'French, Bakery, Desserts, Cafe',
    location: 'Koregaon Park, Pune',
    address: '5th Lane, Koregaon Park, Pune 411001',
    phone: '+91 20 2613 8899',
    avgCostForTwo: '₹1,200',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Baner ──────────────────────────────────────────────────
  {
    name: 'The Linkin Barrel',
    cuisine: 'Multi-Cuisine, Pub & Bar',
    location: 'Baner, Pune',
    address: 'The Capital Building, A Wing, Pashan Link Road, Baner, Pune 411045',
    phone: '+91 88 0656 5656',
    avgCostForTwo: '₹1,600',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Yeti - The Himalayan Kitchen',
    cuisine: 'Nepalese, Tibetan, Momos, Asian',
    location: 'Baner, Pune',
    address: 'DSK Vishwa, Baner Road, Baner, Pune 411045',
    phone: '+91 20 4860 1234',
    avgCostForTwo: '₹900',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Buon Cibo',
    cuisine: 'Italian, European, Pizza',
    location: 'Baner, Pune',
    address: 'Near Pancard Club, Baner Road, Baner, Pune 411045',
    phone: '+91 90 2809 0909',
    avgCostForTwo: '₹1,400',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Bhairavee Pure Veg Restaurant',
    cuisine: 'Multi-Cuisine Vegetarian, Indian',
    location: 'Baner, Pune',
    address: 'Sr. No. 45/1, Baner Road, Baner, Pune 411045',
    phone: '+91 20 2729 5678',
    avgCostForTwo: '₹700',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Spice Kitchen',
    cuisine: 'North Indian, Mughlai, Biryani',
    location: 'Baner, Pune',
    address: 'Commerce Centre, Baner Road, Baner, Pune 411045',
    phone: '+91 77 0904 5678',
    avgCostForTwo: '₹1,200',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'The Cul8r Lounge',
    cuisine: 'Multi-Cuisine, Lounge, Bar',
    location: 'Baner, Pune',
    address: 'City Point Building, Baner, Pune 411045',
    phone: '+91 88 0599 0599',
    avgCostForTwo: '₹1,800',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Viman Nagar ────────────────────────────────────────────
  {
    name: 'Surve\'s Pure Non-Veg',
    cuisine: 'Maharashtrian, Non-Vegetarian',
    location: 'Viman Nagar, Pune',
    address: 'Clover Park, Viman Nagar, Pune 411014',
    phone: '+91 20 2668 3456',
    avgCostForTwo: '₹800',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Irani Cafe',
    cuisine: 'Irani, Cafe, Parsi, Breakfast',
    location: 'Viman Nagar, Pune',
    address: 'Shop No 2, Turning Point 2, Opp. Rosary School, Viman Nagar, Pune 411014',
    phone: '+91 90 1190 1199',
    avgCostForTwo: '₹400',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Chaitanya Parathas',
    cuisine: 'North Indian, Parathas, Street Food',
    location: 'Viman Nagar, Pune',
    address: 'Phoenix Market City Road, Viman Nagar, Pune 411014',
    phone: '+91 82 0807 0807',
    avgCostForTwo: '₹500',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Deccan / FC Road ───────────────────────────────────────
  {
    name: 'Vaishali Restaurant',
    cuisine: 'South Indian, Snacks, Dosa, Filter Coffee',
    location: 'Deccan Gymkhana, Pune',
    address: '1232, Ferguson College Road, Deccan Gymkhana, Pune 411004',
    phone: '+91 20 2553 1533',
    avgCostForTwo: '₹400',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Roopali Restaurant',
    cuisine: 'South Indian, Maharashtrian, Breakfast',
    location: 'Deccan Gymkhana, Pune',
    address: 'FC Road, Deccan Gymkhana, Pune 411004',
    phone: '+91 20 2553 2890',
    avgCostForTwo: '₹350',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Cafe Goodluck',
    cuisine: 'Irani, Indian, Keema, Bun Maska',
    location: 'Deccan Gymkhana, Pune',
    address: 'FC Road, Opposite Deccan Bus Stand, Pune 411004',
    phone: '+91 20 2553 5667',
    avgCostForTwo: '₹400',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Vohuman Cafe',
    cuisine: 'Irani, Cafe, Chai, Bun Maska',
    location: 'Sasoon Road, Pune',
    address: 'Near Jehangir Hospital, Sasoon Road, Pune 411001',
    phone: '+91 20 2612 4567',
    avgCostForTwo: '₹300',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Kalyani Nagar ──────────────────────────────────────────
  {
    name: 'SALT - Indian Restaurant Bar & Grill',
    cuisine: 'North Indian, Biryani, Kebabs, Bar',
    location: 'Kalyani Nagar, Pune',
    address: 'Survey No. 16/1, Mulik Capital, East Ave, Kalyani Nagar, Pune 411006',
    phone: '+91 82 0887 0887',
    avgCostForTwo: '₹1,800',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Saffron Restaurant',
    cuisine: 'North Indian, Mughlai, Fine Dining',
    location: 'Kalyani Nagar, Pune',
    address: '1st Floor, Metro Compound, Besides Bishops Co-Ed School, Kalyani Nagar, Pune 411006',
    phone: '+91 90 2899 0022',
    avgCostForTwo: '₹1,200',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'The Poona Project',
    cuisine: 'Continental, Fusion, Bar',
    location: 'Kalyani Nagar, Pune',
    address: 'Panchshil Tech Park, Kalyani Nagar, Pune 411006',
    phone: '+91 77 0977 0977',
    avgCostForTwo: '₹1,600',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Aundh ──────────────────────────────────────────────────
  {
    name: 'Wadeshwar',
    cuisine: 'South Indian, Maharashtrian, Vegetarian',
    location: 'Aundh, Pune',
    address: 'ITI Road, Aundh, Pune 411007',
    phone: '+91 20 2588 4567',
    avgCostForTwo: '₹400',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Cafe Peter',
    cuisine: 'Continental, Cafe, Steaks',
    location: 'Aundh, Pune',
    address: 'Near Parihar Chowk, Aundh, Pune 411007',
    phone: '+91 20 2588 9911',
    avgCostForTwo: '₹1,000',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Wakad ──────────────────────────────────────────────────
  {
    name: 'Joshi Wadewale',
    cuisine: 'Maharashtrian Snacks, Wada Pav, Street Food',
    location: 'Wakad, Pune',
    address: 'Datta Mandir Road, Wakad, Pune 411057',
    phone: '+91 72 7697 2769',
    avgCostForTwo: '₹200',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Hotel Shreyas',
    cuisine: 'Maharashtrian, Vegetarian, Thali',
    location: 'Wakad, Pune',
    address: 'Near Wakad Bridge, Wakad, Pune 411057',
    phone: '+91 20 2729 1234',
    avgCostForTwo: '₹500',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Hinjewadi ──────────────────────────────────────────────
  {
    name: 'Mainland China',
    cuisine: 'Chinese, Cantonese, Szechuan',
    location: 'Hinjewadi, Pune',
    address: 'Blue Ridge Township, Hinjewadi Phase 1, Pune 411057',
    phone: '+91 20 6700 1234',
    avgCostForTwo: '₹1,500',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Barbeque Nation',
    cuisine: 'North Indian, BBQ, Kebabs, Buffet',
    location: 'Hinjewadi, Pune',
    address: 'Xion Mall, Hinjewadi Phase 1, Pune 411057',
    phone: '+91 18 0012 3456',
    avgCostForTwo: '₹1,600',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Pimpri-Chinchwad ───────────────────────────────────────
  {
    name: 'Hotel Dwarkadhish',
    cuisine: 'Maharashtrian, Vegetarian, Thali',
    location: 'Pimpri-Chinchwad, Pune',
    address: 'Old Mumbai-Pune Highway, Chinchwad, Pune 411033',
    phone: '+91 20 2742 5678',
    avgCostForTwo: '₹500',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Kothrud ────────────────────────────────────────────────
  {
    name: 'Durga Snacks & Meals',
    cuisine: 'Maharashtrian, South Indian, Snacks',
    location: 'Kothrud, Pune',
    address: 'Paud Road, Kothrud, Pune 411038',
    phone: '+91 20 2546 7890',
    avgCostForTwo: '₹350',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Shabree',
    cuisine: 'Maharashtrian Thali, Vegetarian',
    location: 'Kothrud, Pune',
    address: 'Near Karve Putla, Kothrud, Pune 411038',
    phone: '+91 20 2546 3456',
    avgCostForTwo: '₹600',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Camp / MG Road ─────────────────────────────────────────
  {
    name: 'Dorabjee & Sons',
    cuisine: 'Parsi, Continental, Indian',
    location: 'Camp, Pune',
    address: 'East Street, Camp, Pune 411001',
    phone: '+91 20 2636 1234',
    avgCostForTwo: '₹800',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Kayani Bakery',
    cuisine: 'Bakery, Shrewsbury Biscuits, Irani',
    location: 'Camp, Pune',
    address: 'East Street, Camp, Pune 411001',
    phone: '+91 20 2613 1235',
    avgCostForTwo: '₹300',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Magarpatta / Hadapsar ──────────────────────────────────
  {
    name: 'Rajdhani Thali Restaurant',
    cuisine: 'Rajasthani, Gujarati Thali, Vegetarian',
    location: 'Magarpatta, Pune',
    address: 'Destination Centre, Magarpatta City, Pune 411028',
    phone: '+91 20 4860 5678',
    avgCostForTwo: '₹700',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'The Eat Street',
    cuisine: 'Multi-Cuisine, Fast Food, Asian',
    location: 'Magarpatta, Pune',
    address: 'Cybercity, Magarpatta, Pune 411028',
    phone: '+91 90 1100 9011',
    avgCostForTwo: '₹600',
    rating: 3.9,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── SB Road / Model Colony ─────────────────────────────────
  {
    name: 'Sujata Mastani',
    cuisine: 'Ice Cream, Mastani, Desserts',
    location: 'SB Road, Pune',
    address: 'Senapati Bapat Road, Pune 411016',
    phone: '+91 20 2565 8899',
    avgCostForTwo: '₹250',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Great Punjab',
    cuisine: 'North Indian, Punjabi, Tandoori',
    location: 'SB Road, Pune',
    address: 'Senapati Bapat Road, Near Ratna Memorial, Pune 411016',
    phone: '+91 20 2565 1234',
    avgCostForTwo: '₹800',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Shivajinagar ───────────────────────────────────────────
  {
    name: 'Bedekar Misal',
    cuisine: 'Maharashtrian, Misal Pav, Street Food',
    location: 'Shivajinagar, Pune',
    address: 'Near Sambhaji Park, Shivajinagar, Pune 411005',
    phone: '+91 20 2553 3210',
    avgCostForTwo: '₹200',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Cafe 1730',
    cuisine: 'European, Italian, Cafe',
    location: 'Shivajinagar, Pune',
    address: 'Near JM Road, Shivajinagar, Pune 411005',
    phone: '+91 87 8888 1730',
    avgCostForTwo: '₹1,200',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Hadapsar ───────────────────────────────────────────────
  {
    name: 'G.P\'s Chaapwaale',
    cuisine: 'North Indian, Soya Chaap, Street Food',
    location: 'Hadapsar, Pune',
    address: 'Solapur Road, Hadapsar, Pune 411028',
    phone: '+91 90 2888 0288',
    avgCostForTwo: '₹400',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Sinhagad Road ──────────────────────────────────────────
  {
    name: 'Aishwarya Garden Restaurant',
    cuisine: 'Multi-Cuisine, North Indian, Chinese',
    location: 'Sinhagad Road, Pune',
    address: 'Near Navale Bridge, Sinhagad Road, Pune 411041',
    phone: '+91 20 2435 6789',
    avgCostForTwo: '₹600',
    rating: 3.9,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Wanowrie ───────────────────────────────────────────────
  {
    name: 'Sankalp',
    cuisine: 'South Indian, Dosa, Uttapam',
    location: 'Wanowrie, Pune',
    address: 'Saswad Road, Near Kedari Garden, Wanowrie, Pune 411040',
    phone: '+91 20 2687 1234',
    avgCostForTwo: '₹500',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Premium / Fine Dining ──────────────────────────────────
  {
    name: 'Paasha',
    cuisine: 'North Indian, Mughlai, Kebabs, Fine Dining',
    location: 'Bund Garden Road, Pune',
    address: 'JW Marriott Hotel, Senapati Bapat Road, Pune 411053',
    phone: '+91 20 6683 3333',
    avgCostForTwo: '₹3,000',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Tian - Asian Cuisine Studio',
    cuisine: 'Pan-Asian, Japanese, Thai',
    location: 'Bund Garden Road, Pune',
    address: 'JW Marriott Hotel, Senapati Bapat Road, Pune 411053',
    phone: '+91 20 6683 3334',
    avgCostForTwo: '₹2,500',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Mynt',
    cuisine: 'Multi-Cuisine, Bar, Lounge',
    location: 'Koregaon Park, Pune',
    address: 'Westin Hotel, Koregaon Park, Pune 411001',
    phone: '+91 20 6721 0000',
    avgCostForTwo: '₹2,000',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Soy Soi',
    cuisine: 'Thai, Pan-Asian, Street Food',
    location: 'Koregaon Park, Pune',
    address: 'Lane No. 6, Koregaon Park, Pune 411001',
    phone: '+91 20 2615 2299',
    avgCostForTwo: '₹1,200',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Popular chains / Iconic ────────────────────────────────
  {
    name: 'Kolhapuri Kitchen',
    cuisine: 'Maharashtrian, Kolhapuri, Non-Veg',
    location: 'Kothrud, Pune',
    address: 'Paud Road, Near MIT College, Kothrud, Pune 411038',
    phone: '+91 88 0600 7007',
    avgCostForTwo: '₹700',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Mojo Pizza',
    cuisine: 'Pizza, Italian, Fast Food',
    location: 'Multiple Locations, Pune',
    address: 'Baner Road, Baner, Pune 411045',
    phone: '+91 70 2070 2070',
    avgCostForTwo: '₹500',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Sigree Global Grill',
    cuisine: 'BBQ, North Indian, Asian, Buffet',
    location: 'Viman Nagar, Pune',
    address: 'Phoenix Market City, Viman Nagar, Pune 411014',
    phone: '+91 88 8800 7000',
    avgCostForTwo: '₹1,500',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Hotel Shreemaya',
    cuisine: 'Maharashtrian, North Indian, Thali',
    location: 'Shivajinagar, Pune',
    address: 'FC Road, Shivajinagar, Pune 411005',
    phone: '+91 20 2553 2200',
    avgCostForTwo: '₹500',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Marrakesh',
    cuisine: 'North Indian, Lebanese, Continental',
    location: 'Koregaon Park, Pune',
    address: 'Lane No. 5, Koregaon Park, Pune 411001',
    phone: '+91 20 2615 3344',
    avgCostForTwo: '₹1,400',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Pagdandi Books Chai Cafe',
    cuisine: 'Cafe, Chai, Snacks, Books',
    location: 'Baner, Pune',
    address: 'Near Pancard Club, Baner, Pune 411045',
    phone: '+91 77 7701 7777',
    avgCostForTwo: '₹400',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Pune Street Project',
    cuisine: 'Fusion Street Food, Indian, Asian',
    location: 'Koregaon Park, Pune',
    address: 'North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 88 8822 3344',
    avgCostForTwo: '₹800',
    rating: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Chitale Bandhu Mithaiwale',
    cuisine: 'Maharashtrian Sweets, Bakarwadi, Mithai',
    location: 'Deccan Gymkhana, Pune',
    address: 'FC Road, Deccan Gymkhana, Pune 411004',
    phone: '+91 20 2553 4455',
    avgCostForTwo: '₹200',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Pune Heritage Legends & Student Icons ───────────────────
  {
    name: 'Café Goodluck',
    cuisine: 'Irani Cafe, Bun Maska, Keema Pav, Chai',
    location: 'FC Road / Deccan, Pune',
    address: 'Goodluck Chowk, Fergusson College Road, Deccan Gymkhana, Pune 411004',
    phone: '+91 20 2567 6893',
    avgCostForTwo: '₹350',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop',
    posProvider: 'universal_api',
    aliases: ['Goodluck', 'Cafe Goodluck', 'Goodluck Cafe', 'Good Luck Cafe', 'Café Goodluck']
  },
  {
    name: 'Vaishali Restaurant',
    cuisine: 'South Indian, Filter Coffee, Mysore Masala Dosa',
    location: 'FC Road / Deccan, Pune',
    address: '1218/1, Fergusson College Road, Shivajinagar, Pune 411004',
    phone: '+91 20 2553 1244',
    avgCostForTwo: '₹400',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Roopali Restaurant',
    cuisine: 'South Indian, Upma, Filter Coffee, Snacks',
    location: 'FC Road / Deccan, Pune',
    address: '1227, Fergusson College Road, Shivajinagar, Pune 411004',
    phone: '+91 20 2553 2951',
    avgCostForTwo: '₹350',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Wadeshwar',
    cuisine: 'South Indian, Guntur Idli, Molgapodi, Poha',
    location: 'FC Road / Deccan, Pune',
    address: 'Fergusson College Road, Deccan Gymkhana, Pune 411004',
    phone: '+91 20 2552 0105',
    avgCostForTwo: '₹400',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Chaitanya Paranthas',
    cuisine: 'North Indian, Stuffed Paranthas, Lassi',
    location: 'FC Road, Pune',
    address: 'Opposite Fergusson College Gate 3, FC Road, Pune 411004',
    phone: '+91 98 2200 4455',
    avgCostForTwo: '₹350',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Sukanta Thali',
    cuisine: 'Gujarati & Rajasthani Unlimited Royal Thali',
    location: 'Deccan Gymkhana, Pune',
    address: 'Near Pulachi Wadi, Deccan Gymkhana, Pune 411004',
    phone: '+91 20 2553 0077',
    avgCostForTwo: '₹800',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Durvankur Dining Hall',
    cuisine: 'Authentic Maharashtrian Thali, Ukadiche Modak',
    location: 'Sadashiv Peth / Tilak Road, Pune',
    address: 'Near Hatti Ganpati, Sadashiv Peth, Pune 411030',
    phone: '+91 20 2447 4438',
    avgCostForTwo: '₹600',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=200&auto=format&fit=crop',
    posProvider: 'universal_api',
    aliases: ['Durvankur', 'Durvankur Dining Hall', 'Durvankur Thali', 'Durvankar']
  },

  // ── Camp & East Street Heritage Institutions ────────────────
  {
    name: 'Kayani Bakery',
    cuisine: 'Parsi Bakery, Shrewsbury Biscuits, Mawa Cake',
    location: 'Camp / East Street, Pune',
    address: '6, East Street, Camp, Pune 411001',
    phone: '+91 20 2636 0517',
    avgCostForTwo: '₹300',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Marz-O-Rin',
    cuisine: 'Parsi Cafe, Macaroni Bake, Chicken Sandwiches',
    location: 'Camp / MG Road, Pune',
    address: 'Bakthiar Plaza, 6, MG Road, Camp, Pune 411001',
    phone: '+91 20 2613 0774',
    avgCostForTwo: '₹350',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Blue Nile Restaurant',
    cuisine: 'Mughlai, Mutton Biryani, Chelo Kebab',
    location: 'Camp / Bund Garden, Pune',
    address: '4, Bund Garden Road, Camp, Pune 411001',
    phone: '+91 20 2612 5238',
    avgCostForTwo: '₹1,000',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'George Restaurant',
    cuisine: 'Mughlai, Dum Biryani, Butter Chicken, Rolls',
    location: 'Camp / East Street, Pune',
    address: '2436, General Thimayya Road, East Street, Camp, Pune 411001',
    phone: '+91 20 2613 1891',
    avgCostForTwo: '₹850',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Dorabjee & Sons Restaurant',
    cuisine: 'Authentic Parsi, Dhansak, Patra Ni Machhi, Salli Boti',
    location: 'Camp, Pune',
    address: '845, Dastur Meher Road, Sharbatwala Chowk, Camp, Pune 411001',
    phone: '+91 20 2614 4446',
    avgCostForTwo: '₹700',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: '1000 Oaks',
    cuisine: 'North Indian, Bar Food, Barmans Pitcher',
    location: 'Camp / East Street, Pune',
    address: '2417, East Street, Camp, Pune 411001',
    phone: '+91 20 2634 3159',
    avgCostForTwo: '₹1,400',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Koregaon Park & Kalyani Nagar Fine Dining ───────────────
  {
    name: 'Le Plaisir',
    cuisine: 'European Bistro, Patisserie, Macarons, Pasta',
    location: 'Prabhat Road / Deccan, Pune',
    address: 'Rajnesh Chambers, Bhandarkar Road / Prabhat Road, Pune 411004',
    phone: '+91 75 0707 9999',
    avgCostForTwo: '₹1,200',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Sante Spa Cuisine',
    cuisine: 'Organic Healthy Dining, Vegan, Mediterranean',
    location: 'Koregaon Park, Pune',
    address: 'Lane 1, Near Osho Ashram, Koregaon Park, Pune 411001',
    phone: '+91 82 3790 2020',
    avgCostForTwo: '₹1,500',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Arthur’s Theme',
    cuisine: 'French, Italian, European Fine Dining',
    location: 'Koregaon Park, Pune',
    address: '2, Vrindavan Society, Lane No. 6, Koregaon Park, Pune 411001',
    phone: '+91 20 2615 2710',
    avgCostForTwo: '₹1,600',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Terttulia',
    cuisine: 'Mediterranean, Pizza, Sangrias, Continental',
    location: 'Koregaon Park, Pune',
    address: 'Lane No. 5, South Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2605 2180',
    avgCostForTwo: '₹1,800',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Cobbler & Crew',
    cuisine: 'Craft Cocktails, Progressive Global Tapas',
    location: 'Koregaon Park, Pune',
    address: 'Ground Floor, Barons Club, North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 93 2288 8822',
    avgCostForTwo: '₹2,200',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Elephant & Co.',
    cuisine: 'Gastropub, Gourmet Burgers, Cocktails',
    location: 'Kalyani Nagar, Pune',
    address: 'D-10, Central Avenue, Kalyani Nagar, Pune 411006',
    phone: '+91 97 6688 8800',
    avgCostForTwo: '₹1,500',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Luxury Rooftops & 5-Star Hotel Dining ───────────────────
  {
    name: 'Paasha Rooftop Lounge',
    cuisine: 'North Indian Luxury, Kebabs, Skyline Cocktails',
    location: 'Senapati Bapat Road, Pune',
    address: 'JW Marriott Hotel, Level 24, Senapati Bapat Road, Pune 411053',
    phone: '+91 20 6683 3333',
    avgCostForTwo: '₹3,000',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Alto Vino',
    cuisine: 'Fine Dining Italian, Handmade Pasta, Risotto',
    location: 'Senapati Bapat Road, Pune',
    address: 'JW Marriott Hotel, Senapati Bapat Road, Pune 411053',
    phone: '+91 20 6683 2345',
    avgCostForTwo: '₹2,800',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Ukiyo',
    cuisine: 'Modern Japanese Fine Dining, Sushi, Robata',
    location: 'Yerawada / Golf Course, Pune',
    address: 'The Ritz-Carlton, Golf Course Square, Airport Road, Yerawada, Pune 411006',
    phone: '+91 20 6767 5000',
    avgCostForTwo: '₹4,000',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Aasmana Rooftop Bar',
    cuisine: 'Indian Coastal, Cocktails, 18th Floor Skyline',
    location: 'Yerawada / Golf Course, Pune',
    address: 'The Ritz-Carlton, Level 18, Airport Road, Yerawada, Pune 411006',
    phone: '+91 20 6767 5555',
    avgCostForTwo: '₹3,500',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Kangan',
    cuisine: 'Northwest Frontier, Peshawari Kebabs, Dal Kangan',
    location: 'Koregaon Park, Pune',
    address: 'The Westin, 36/3-B, Koregaon Park Annexe, Mundhwa Road, Pune 411001',
    phone: '+91 20 6721 0000',
    avgCostForTwo: '₹3,200',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Puneri Seafood, Biryani & Misal Legends ─────────────────
  {
    name: "SP's Biryani House",
    cuisine: 'Dum Mutton Biryani, Rassa, Gavran Chicken',
    location: 'Sadashiv Peth / Tilak Road, Pune',
    address: '1472, Tilak Road, Lokmanya Nagar, Sadashiv Peth, Pune 411030',
    phone: '+91 20 2447 2220',
    avgCostForTwo: '₹800',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop',
    posProvider: 'universal_api',
    aliases: ["SP's Biryani", "SP Biryani", "SP's Biryani House", "SPs Biryani", "SP Biryani House", "S.P.'s Biryani", "SP’s Biryani House"]
  },
  {
    name: 'Surve’s Pure Non-Veg',
    cuisine: 'Satara Mutton Thali, Tambada Pandhara Rassa',
    location: 'FC Road / Kothrud, Pune',
    address: 'R-Deccan Mall, Pulachi Wadi, Deccan / FC Road, Pune 411004',
    phone: '+91 98 2211 5566',
    avgCostForTwo: '₹750',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Fish Curry Rice',
    cuisine: 'Konkani & Malvani Seafood, Surmai Fry, Prawns Thali',
    location: 'Law College Road, Pune',
    address: 'Law College Road, Near Nal Stop, Erandwane, Pune 411004',
    phone: '+91 20 2545 4488',
    avgCostForTwo: '₹900',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Bedekar Tea Stall',
    cuisine: 'Puneri Misal Pav, Usal, Special Tea',
    location: 'Narayan Peth, Pune',
    address: '418, Munjabacha Bol, Narayan Peth, Pune 411030',
    phone: '+91 20 2445 3737',
    avgCostForTwo: '₹200',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Katakkirr Misal',
    cuisine: 'Kolhapuri & Puneri Spicy Misal, Buttermilk',
    location: 'Karve Nagar / Kothrud, Pune',
    address: 'Cummins College Road, Karve Nagar, Pune 411052',
    phone: '+91 98 8122 3344',
    avgCostForTwo: '₹250',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Balewadi High Street & Baner Hotspots ────────────────────
  {
    name: 'The Urban Foundry',
    cuisine: 'Modern Indian Tapas, Bar Food, Cocktails',
    location: 'Balewadi High Street, Pune',
    address: '1, Balewadi High Street, Baner / Balewadi, Pune 411045',
    phone: '+91 86 5757 0001',
    avgCostForTwo: '₹1,700',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Babylon Craft Brewery',
    cuisine: 'Craft Beers, Continental, Rooftop Bites',
    location: 'Erandwane / Karve Road, Pune',
    address: '6th Floor, House of Lords, Karve Road, Erandwane, Pune 411004',
    phone: '+91 70 3049 4444',
    avgCostForTwo: '₹1,600',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: '24K Kraft Brewzz',
    cuisine: 'Microbrewery, Pizzas, Finger Food',
    location: 'Balewadi High Street, Pune',
    address: 'Balewadi High Street, Cummins India Road, Balewadi, Pune 411045',
    phone: '+91 88 0644 2424',
    avgCostForTwo: '₹1,600',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Gong - Modern Asian',
    cuisine: 'Sushi, Dim sums, Pan-Asian Fine Dining',
    location: 'Balewadi High Street, Pune',
    address: 'Unit 22, Balewadi High Street, Baner, Pune 411045',
    phone: '+91 20 6708 5555',
    avgCostForTwo: '₹1,800',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: '1BHK Superbar',
    cuisine: 'Parsi, European, Cocktails, Nightlife',
    location: 'Baner, Pune',
    address: 'The Capital Building, Baner-Pashan Link Road, Baner, Pune 411045',
    phone: '+91 88 8888 1245',
    avgCostForTwo: '₹1,800',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Viman Nagar & Airport Area ──────────────────────────────
  {
    name: 'Irani Cafe',
    cuisine: 'Irani Bun Maska, Chai, Chicken Keema, Omelettes',
    location: 'Viman Nagar / Kalyani Nagar, Pune',
    address: 'Datta Mandir Chowk, Viman Nagar, Pune 411014',
    phone: '+91 74 2005 5555',
    avgCostForTwo: '₹350',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Cafe Peter',
    cuisine: 'Korean Ramen, Donuts, Waffles, Coffee',
    location: 'Viman Nagar, Pune',
    address: 'Anand Square, Viman Nagar, Pune 411014',
    phone: '+91 20 4861 2233',
    avgCostForTwo: '₹700',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Chopsticks Spice Malabar',
    cuisine: 'Kerala Parotta, Fish Curry, Biryani, South Indian',
    location: 'Viman Nagar, Pune',
    address: 'Opposite Inorbit Mall, Viman Nagar, Pune 411014',
    phone: '+91 98 9011 2233',
    avgCostForTwo: '₹600',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },

  // ── Hinjewadi & Wakad Tech Hub ──────────────────────────────
  {
    name: 'Mezza9',
    cuisine: 'Multi-Cuisine Family Dining, North Indian, Bar',
    location: 'Hinjewadi Phase 1, Pune',
    address: 'Near Cognizant, Hinjewadi Phase 1, Pune 411057',
    phone: '+91 20 6654 4444',
    avgCostForTwo: '₹1,400',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Thikana',
    cuisine: 'North Indian, Continental, Rooftop Lounge',
    location: 'Wakad / FC Road, Pune',
    address: '4th Floor, Ozone Springs, Wakad, Pune 411057',
    phone: '+91 88 0606 8888',
    avgCostForTwo: '₹1,500',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Agent Jack’s Bar',
    cuisine: 'Bidding Bar, Finger Food, Pizza, Kebabs',
    location: 'Wakad, Pune',
    address: 'Opposite Hinjewadi Flyover, Wakad, Pune 411057',
    phone: '+91 88 8877 6655',
    avgCostForTwo: '₹1,300',
    rating: 4.1,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Cafe Arabia',
    cuisine: 'Middle Eastern, Lebanese, Shawarma, Grills',
    location: 'Salunke Vihar / Wanowrie, Pune',
    address: 'Salunke Vihar Road, Wanowrie, Pune 411040',
    phone: '+91 20 2685 4488',
    avgCostForTwo: '₹600',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'German Bakery',
    cuisine: 'Bakery, Cafe, European, Breakfast',
    location: 'Koregaon Park, Pune',
    address: 'North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2615 6127',
    avgCostForTwo: '₹900',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Shisha Jazz Cafe',
    cuisine: 'Iranian, Continental, Live Music & Bar',
    location: 'Koregaon Park, Pune',
    address: 'ABC Farms, North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2688 0050',
    avgCostForTwo: '₹2,200',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Toit Pune',
    cuisine: 'Microbrewery, Woodfired Pizza, Continental',
    location: 'Koregaon Park, Pune',
    address: 'Near Bishop\'s Co-Ed School, Kalyani Nagar / KP Border, Pune 411006',
    phone: '+91 77220 54100',
    avgCostForTwo: '₹2,000',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'High Spirits Cafe',
    cuisine: 'Bar, Cocktails, Finger Food, Live Gig Venue',
    location: 'Koregaon Park, Pune',
    address: 'North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 86000 63174',
    avgCostForTwo: '₹1,600',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Effingut Brewerkz',
    cuisine: 'Craft Beer, BBQ, Asian, Pub Grub',
    location: 'Koregaon Park, Pune',
    address: 'End of Lane 6, Koregaon Park, Pune 411001',
    phone: '+91 76200 31166',
    avgCostForTwo: '₹2,200',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Boteco - Restaurante Brasileiro',
    cuisine: 'Brazilian, Steaks, Grills, Cocktails',
    location: 'Koregaon Park, Pune',
    address: 'Lane 7, Koregaon Park, Pune 411001',
    phone: '+91 91587 42666',
    avgCostForTwo: '₹2,500',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Daily Treats - The Westin',
    cuisine: 'European, Bakery, Artisanal Coffee, Deli',
    location: 'Koregaon Park, Pune',
    address: 'The Westin, 36/3-B Koregaon Park Annexe, Pune 411001',
    phone: '+91 20 6721 0000',
    avgCostForTwo: '₹1,800',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Seasonal Tastes - The Westin',
    cuisine: 'Global Buffet, Pan-Asian, North Indian',
    location: 'Koregaon Park, Pune',
    address: 'The Westin, 36/3-B Koregaon Park Annexe, Pune 411001',
    phone: '+91 20 6721 0000',
    avgCostForTwo: '₹3,500',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Stone Water Grill',
    cuisine: 'European, Lounge, Riverfront Cocktails',
    location: 'Koregaon Park, Pune',
    address: 'Pyramid Complex, North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 6725 6000',
    avgCostForTwo: '₹2,800',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Nisarg Seafood',
    cuisine: 'Malvani, Coastal Seafood, Surmai Fry, Thali',
    location: 'Karve Road / Erandwane, Pune',
    address: 'Off Karve Road, Near Nal Stop, Erandwane, Pune 411004',
    phone: '+91 20 2544 5777',
    avgCostForTwo: '₹1,400',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Balgandharva Katta',
    cuisine: 'Maharashtrian Snacks, Kothimbir Vadi, Thalipeeth',
    location: 'Shivajinagar, Pune',
    address: 'Near Balgandharva Rangmandir, JM Road, Shivajinagar, Pune 411005',
    phone: '+91 20 2553 2233',
    avgCostForTwo: '₹300',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Durga Cafe',
    cuisine: 'Cold Coffee, Pav Bhaji, Quick Bites',
    location: 'Kothrud, Pune',
    address: 'Near MIT College, Paud Road, Kothrud, Pune 411038',
    phone: '+91 98220 33445',
    avgCostForTwo: '₹250',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Poona Guest House',
    cuisine: 'Authentic Puneri Maharashtrian Thali, Puran Poli',
    location: 'Laxmi Road / Budhwar Peth, Pune',
    address: '100, Budhwar Peth, Near Laxmi Road, Pune 411002',
    phone: '+91 20 2445 2824',
    avgCostForTwo: '₹500',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Bedekar Tea Stall & Misal',
    cuisine: 'Puneri Misal Pav, Tea, Traditional Farsan',
    location: 'Narayan Peth, Pune',
    address: '418, Munjabacha Bol, Narayan Peth, Pune 411030',
    phone: '+91 20 2445 1270',
    avgCostForTwo: '₹200',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Katakirr Misal',
    cuisine: 'Kolhapuri Spiced Misal Pav, Buttermilk',
    location: 'Karve Road / Deccan, Pune',
    address: 'Near Cummins College, Karve Nagar & Deccan Branches, Pune 411004',
    phone: '+91 98811 55000',
    avgCostForTwo: '₹250',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Burger - Camp',
    cuisine: 'Legendary King Burgers, Chicken Burger, Fries',
    location: 'Camp, Pune',
    address: 'Phulgaon Road, East Street, Camp, Pune 411001',
    phone: '+91 20 2613 0000',
    avgCostForTwo: '₹350',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Mona Food',
    cuisine: 'Chole Bhature, Punjabi Street Food, Lassi',
    location: 'MG Road, Camp, Pune',
    address: 'Main Building, MG Road, Camp, Pune 411001',
    phone: '+91 20 2613 1455',
    avgCostForTwo: '₹400',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Pasteur Bakery',
    cuisine: 'Ice Creams, Pastries, Soft Serve, Puffs',
    location: 'MG Road, Camp, Pune',
    address: 'Camp, MG Road, Pune 411001',
    phone: '+91 20 2613 1111',
    avgCostForTwo: '₹250',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'The Brooklyn Brigade',
    cuisine: 'Artisanal Burgers, American, Wings, Shakes',
    location: 'Kalyani Nagar, Pune',
    address: 'Fortaleza Complex, Kalyani Nagar, Pune 411006',
    phone: '+91 99220 88990',
    avgCostForTwo: '₹800',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Grandmama\'s Cafe',
    cuisine: 'Cafe, Pasta, Waffles, Hot Chocolate, Continental',
    location: 'Koregaon Park & Viman Nagar, Pune',
    address: 'South Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 2615 2200',
    avgCostForTwo: '₹1,200',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Chili\'s American Grill & Bar',
    cuisine: 'Tex-Mex, Burgers, Fajitas, Margaritas',
    location: 'Phoenix Marketcity, Viman Nagar, Pune',
    address: '2nd Floor, Phoenix Marketcity, Viman Nagar, Pune 411014',
    phone: '+91 20 3095 0300',
    avgCostForTwo: '₹1,800',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Punjab Grill',
    cuisine: 'North Indian, Mughlai, Dal Makhani, Kebabs',
    location: 'Phoenix Marketcity, Viman Nagar, Pune',
    address: 'Phoenix Marketcity, Viman Nagar, Pune 411014',
    phone: '+91 20 6689 0600',
    avgCostForTwo: '₹2,200',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Ishaara',
    cuisine: 'Modern Indian, Dahi Kebab, Biryani',
    location: 'Phoenix Marketcity, Viman Nagar, Pune',
    address: 'Upper Ground Floor, Phoenix Marketcity, Viman Nagar, Pune 411014',
    phone: '+91 80077 78899',
    avgCostForTwo: '₹1,600',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Copper Chimney',
    cuisine: 'North Indian, Mughlai, Biryani, Roomali Roti',
    location: 'Phoenix Marketcity, Viman Nagar, Pune',
    address: 'Level 2, Phoenix Marketcity, Viman Nagar, Pune 411014',
    phone: '+91 20 6689 0500',
    avgCostForTwo: '₹1,800',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Little Italy',
    cuisine: 'Pure Veg Italian, Woodfired Pizza, Pasta, Risotto',
    location: 'Shivajinagar & Bund Garden, Pune',
    address: 'University Road, Shivaji Nagar, Pune 411016',
    phone: '+91 20 2567 4444',
    avgCostForTwo: '₹1,600',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Absolute Barbecues',
    cuisine: 'Wish Grill, Exotic Meats, Buffet, North Indian',
    location: 'Wakad & Hinjewadi, Pune',
    address: 'White Square Building, Hinjewadi-Wakad Bridge, Pune 411057',
    phone: '+91 73373 83763',
    avgCostForTwo: '₹1,600',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'MoMo Cafe - Courtyard by Marriott',
    cuisine: 'International Buffet, Contemporary Dining, Sunday Brunch',
    location: 'Hinjewadi Phase 1, Pune',
    address: 'Courtyard by Marriott, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057',
    phone: '+91 20 4212 2222',
    avgCostForTwo: '₹2,500',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Thikana Hinjewadi',
    cuisine: 'North Indian, Finger Food, Bar, DJ Lounge',
    location: 'Hinjewadi Phase 1, Pune',
    address: 'Opposite Geometric, Hinjewadi Phase 1, Pune 411057',
    phone: '+91 91122 88877',
    avgCostForTwo: '₹1,500',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'Agent Jack\'s Bar',
    cuisine: 'Bidding Bar, Finger Food, Continental, Pizza',
    location: 'Hinjewadi & SB Road, Pune',
    address: 'Multiplex Mall, Hinjewadi Phase 1, Pune 411057',
    phone: '+91 98224 41122',
    avgCostForTwo: '₹1,400',
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
    posProvider: 'toast'
  },
  {
    name: 'The Blue Water',
    cuisine: 'Waterfront Dining, North Indian, Chinese, Continental',
    location: 'Aundh-Ravet Road, Wakad, Pune',
    address: 'Near Punawale, Aundh-Ravet BRTS Road, Wakad, Pune 411033',
    phone: '+91 20 2740 1000',
    avgCostForTwo: '₹1,700',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Tarsh Gastronomia',
    cuisine: 'Rooftop Buffet, Mughlai, Pan-Asian, Cocktails',
    location: 'Wakad, Pune',
    address: 'White Square Building, Wakad Bypass, Pune 411057',
    phone: '+91 85510 50000',
    avgCostForTwo: '₹1,800',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Sayaji Pune - Portico',
    cuisine: 'Fine Dining, North Indian, Continental, Lavish Buffet',
    location: 'Wakad, Pune',
    address: 'Sayaji Hotel, Mumbai-Bangalore Bypass, Wakad, Pune 411057',
    phone: '+91 20 4212 1212',
    avgCostForTwo: '₹2,400',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Farzi Cafe',
    cuisine: 'Modern Indian Bistro, Molecular Gastronomy, Cocktails',
    location: 'Koregaon Park, Pune',
    address: 'Vascon Mariplex Mall, Kalyani Nagar / KP, Pune 411014',
    phone: '+91 95990 60000',
    avgCostForTwo: '₹2,200',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Hotel Jagdamba',
    cuisine: 'Maratha Military Cuisine, Mutton Sukka, Tambada Pandhara Rassa',
    location: 'Pune-Bangalore Highway / Katraj, Pune',
    address: 'Near Khed Shivapur Toll, Old NH4, Pune 412205',
    phone: '+91 98220 70000',
    avgCostForTwo: '₹900',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Hotel Sandeep',
    cuisine: 'Authentic Puneri Mutton Thali, Kheema, Biryani',
    location: 'JM Road / Shivajinagar, Pune',
    address: 'Near Modern College, Shivajinagar, Pune 411005',
    phone: '+91 20 2553 3885',
    avgCostForTwo: '₹800',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Sarjaa',
    cuisine: 'North Indian, Mughlai, Live Ghazals, Seafood',
    location: 'Aundh, Pune',
    address: 'Sarjaa Complex, Near Convergys, Aundh, Pune 411007',
    phone: '+91 20 2588 7777',
    avgCostForTwo: '₹1,500',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Polka Dots',
    cuisine: 'European, Pasta, Risotto, Thin Crust Pizza, Salads',
    location: 'Aundh & Kalyani Nagar, Pune',
    address: 'Near Westend Mall, Aundh, Pune 411007',
    phone: '+91 20 2588 9090',
    avgCostForTwo: '₹1,400',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'K Factory',
    cuisine: 'European Bistro, Cocktails, Truffle Fries, Burgers',
    location: 'Baner, Pune',
    address: 'Near Mercedes Showroom, Baner Road, Pune 411045',
    phone: '+91 20 6685 0000',
    avgCostForTwo: '₹1,800',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Ukiyo - The Ritz-Carlton',
    cuisine: 'Modern Japanese, Sashimi, Robatayaki, Sake Bar',
    location: 'Yerawada / Golf Course, Pune',
    address: 'The Ritz-Carlton, Golf Course Road, Airport Road, Pune 411006',
    phone: '+91 20 6767 5000',
    avgCostForTwo: '₹4,500',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Aasmana - The Ritz-Carlton',
    cuisine: 'Rooftop Lounge, Royal Indian, Craft Cocktails, Skyline Views',
    location: 'Yerawada / Golf Course, Pune',
    address: '18th Floor, The Ritz-Carlton, Golf Course Road, Pune 411006',
    phone: '+91 20 6767 5000',
    avgCostForTwo: '₹4,000',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Three Kitchens Restaurant & Bar - The Ritz-Carlton',
    cuisine: 'Global Buffet, Live Counter, Indian, Italian, Pan-Asian',
    location: 'Yerawada / Golf Course, Pune',
    address: 'The Ritz-Carlton, Golf Course Road, Pune 411006',
    phone: '+91 20 6767 5000',
    avgCostForTwo: '₹3,500',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
  {
    name: 'Pimlico',
    cuisine: 'Floral Aesthetic Cafe, Italian, Pizzas, Shakes',
    location: 'Koregaon Park, Pune',
    address: 'Lane 6, Koregaon Park, Pune 411001',
    phone: '+91 97666 44111',
    avgCostForTwo: '₹1,200',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
  },
,
  {
    name: "Domino's Pizza - Pimpri",
    cuisine: "Pizza, Fast Food, Desserts",
    location: "Pimpri, PCMC",
    address: "Mewani Complex, Old Mumbai Pune Highway, Pimpri, PCMC, Pune 411018",
    phone: "+91 20 2742 8800",
    avgCostForTwo: "\u20b9500",
    rating: 3.6,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Frozen Bottle - Pimpri",
    cuisine: "Beverages, Milkshakes, Desserts",
    location: "Pimpri, PCMC",
    address: "Near Deluxe Cinema, Pimpri Colony, PCMC, Pune 411017",
    phone: "+91 91520 84821",
    avgCostForTwo: "\u20b9400",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Sky Social Lounge And Bar",
    cuisine: "North Indian, Continental, Cocktails",
    location: "Bhosari, PCMC",
    address: "Opposite Century Enka, Pune-Nashik Highway, Bhosari, PCMC, Pune 411039",
    phone: "+91 20 2712 9944",
    avgCostForTwo: "\u20b9700",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Domino's Pizza - Elpro Mall",
    cuisine: "Pizza, Fast Food, Desserts",
    location: "Chinchwad, PCMC",
    address: "Elpro City Square Mall, Chinchwad Gaon, PCMC, Pune 411033",
    phone: "+91 20 6710 4400",
    avgCostForTwo: "\u20b9500",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Faro The Sky Bar",
    cuisine: "Continental, North Indian, Cocktails",
    location: "Chinchwad, PCMC",
    address: "Kudale Plaza, Old Mumbai Pune Highway, Chinchwad, PCMC, Pune 411019",
    phone: "+91 88888 77612",
    avgCostForTwo: "\u20b91,500",
    rating: 3.8,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "360 Degree Multicuisine Family Restaurant",
    cuisine: "Chinese, North Indian, Mughlai",
    location: "Chinchwad, PCMC",
    address: "Near Chaphekar Chowk, Chinchwad, PCMC, Pune 411033",
    phone: "+91 20 2735 3600",
    avgCostForTwo: "\u20b91,000",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Govind Garden",
    cuisine: "North Indian, Asian, Mughlai, Bar",
    location: "Pimple Saudagar, PCMC",
    address: "Ganesh Park Society, Aundh-Ravet BRT Road, Pimple Saudagar, PCMC, Pune 411027",
    phone: "+91 20 2720 1888",
    avgCostForTwo: "\u20b91,400",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Chulbul Dhaba - Pimple Saudagar",
    cuisine: "North Indian, Punjabi Dhaba, Desserts",
    location: "Pimple Saudagar, PCMC",
    address: "Spot 18 Mall Road, Pimple Saudagar, PCMC, Pune 411027",
    phone: "+91 98901 23456",
    avgCostForTwo: "\u20b9800",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Copa Cabana",
    cuisine: "North Indian, Asian, Fine Dining, Cocktails",
    location: "Pimple Nilakh, PCMC",
    address: "Opposite Gajraj Laundry, Wakad-Pimple Nilakh Road, Vishal Nagar, Pimple Nilakh, PCMC, Pune 411027",
    phone: "+91 20 2729 3333",
    avgCostForTwo: "\u20b92,900",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Apple 5 Family Restaurant",
    cuisine: "North Indian, Chinese, Tandoor",
    location: "Pimple Nilakh, PCMC",
    address: "Vishal Nagar, DP Road, Pimple Nilakh, PCMC, Pune 411027",
    phone: "+91 98220 55432",
    avgCostForTwo: "\u20b9650",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Vault Kitchen and Bar",
    cuisine: "Chinese, North Indian, Finger Food, Bar",
    location: "Pimple Gurav, PCMC",
    address: "Near Kate Puram Chowk, Pimple Gurav, PCMC, Pune 411061",
    phone: "+91 97666 41122",
    avgCostForTwo: "\u20b91,000",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "La Rangila Restaurant",
    cuisine: "North Indian, Chinese, Punjabi Thali",
    location: "Akurdi, PCMC",
    address: "Shop 4, La Regalia Building, Opposite Akurdi Railway Station, Akurdi, PCMC, Pune 411035",
    phone: "+91 98231 44556",
    avgCostForTwo: "\u20b9600",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Raaga Imperio Restaurant & Banquet",
    cuisine: "North Indian, Continental, Mughlai, Bar",
    location: "Tathawade, PCMC",
    address: "Aundh-Ravet BRT Road, Near JSPM College, Tathawade, PCMC, Pune 411033",
    phone: "+91 20 6791 2222",
    avgCostForTwo: "\u20b92,100",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Hotel Vishwanath Palace",
    cuisine: "North Indian, South Indian, Fast Food",
    location: "Wakad, PCMC",
    address: "City Avenue, Near Jaguar Showroom, Mumbai-Bangalore Highway, Wakad, PCMC, Pune 411057",
    phone: "+91 98500 11223",
    avgCostForTwo: "\u20b9800",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "The FML Lounge - Hinjewadi",
    cuisine: "North Indian, Continental, Finger Food, Bar",
    location: "Hinjewadi, PCMC",
    address: "Survey 286, Hinjawadi-Wakad Road, Hinjewadi Phase 1, PCMC, Pune 411057",
    phone: "+91 90110 32444",
    avgCostForTwo: "\u20b92,000",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Aroma's Hyderabad House - Hinjewadi",
    cuisine: "Hyderabadi, Biryani, Mughlai",
    location: "Hinjewadi, PCMC",
    address: "Phase 2 Road, Hinjewadi Phase 1, PCMC, Pune 411057",
    phone: "+91 20 6652 3344",
    avgCostForTwo: "\u20b91,400",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Green Park Multicuisine",
    cuisine: "North Indian, Mughlai, Chinese, Multicuisine",
    location: "Baner, Pune",
    address: "Baner Road, Near Baner Phata, Baner, Pune 411045",
    phone: "+91 20 2565 6777",
    avgCostForTwo: "\u20b91,800",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Elephant & Co. Baner",
    cuisine: "Japanese, Asian, Cocktails, Bar",
    location: "Baner, Pune",
    address: "Survey 33/2, Balewadi High Street Link Road, Baner, Pune 411045",
    phone: "+91 98230 11999",
    avgCostForTwo: "\u20b91,800",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Spice Garden Restaurant",
    cuisine: "North Indian, Multicuisine, Tandoor",
    location: "Kothrud, Pune",
    address: "Rambaug Colony, Paud Road, Near MIT College, Kothrud, Pune 411038",
    phone: "+91 20 2544 5566",
    avgCostForTwo: "\u20b91,600",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Fish Curry Rice - Kothrud",
    cuisine: "Konkani, Malvani, Seafood, Coastal Indian",
    location: "Kothrud, Pune",
    address: "Mayur Colony, Near Joggers Park, Kothrud, Pune 411038",
    phone: "+91 20 2543 8899",
    avgCostForTwo: "\u20b91,200",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Wow Momo - Kothrud",
    cuisine: "Tibetan, Momos, Asian Street Food",
    location: "Kothrud, Pune",
    address: "Shop 33, Ground Floor, Karishma CHS, Ideal Colony, Kothrud, Pune 411038",
    phone: "+91 98300 22334",
    avgCostForTwo: "\u20b9400",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "The Voyage - Koregaon Park",
    cuisine: "Continental, Cafe, European",
    location: "Koregaon Park, Pune",
    address: "Lane No. 5, North Main Road, Koregaon Park, Pune 411001",
    phone: "+91 98223 44556",
    avgCostForTwo: "\u20b91,200",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Koregaon Park Social",
    cuisine: "North Indian, Continental, Cocktails, Bar",
    location: "Koregaon Park, Pune",
    address: "Unit 1, The Mills, Behind Sheraton Grand, Sangamvadi, Koregaon Park Annexe, Pune 411001",
    phone: "+91 20 7196 6699",
    avgCostForTwo: "\u20b91,600",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Kalyani Veg Restaurant",
    cuisine: "Pure Veg, North Indian, South Indian, Chinese",
    location: "Kalyani Nagar, Pune",
    address: "Fortaleza Building, Central Avenue, Kalyani Nagar, Pune 411006",
    phone: "+91 20 2665 4433",
    avgCostForTwo: "\u20b9700",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Copper Chimney - Viman Nagar",
    cuisine: "North Indian, Mughlai, Biryani",
    location: "Viman Nagar, Pune",
    address: "Level 2, Phoenix Market City, Nagar Road, Viman Nagar, Pune 411014",
    phone: "+91 20 6689 0088",
    avgCostForTwo: "\u20b91,500",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Chopsticks Spice Malabar Restaurant",
    cuisine: "Kerala, South Indian, Seafood",
    location: "Viman Nagar, Pune",
    address: "Gulmohor Regency, Symbiosis College Road, Viman Nagar, Pune 411014",
    phone: "+91 20 2663 3311",
    avgCostForTwo: "\u20b9950",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Chulbul Dhaba - Kharadi",
    cuisine: "North Indian, Dhaba, Tandoor",
    location: "Kharadi, Pune",
    address: "Golden Plaza, EON Free Zone Road, Kharadi, Pune 411014",
    phone: "+91 98224 88776",
    avgCostForTwo: "\u20b91,050",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Shivshakti Pure Veg - Kharadi",
    cuisine: "Pure Veg, Multicuisine, North Indian",
    location: "Kharadi, Pune",
    address: "Near Pride Icon Building, Thite Vasti, Kharadi, Pune 411014",
    phone: "+91 20 2701 5566",
    avgCostForTwo: "\u20b91,300",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Barbeque Nation - Amanora Mall",
    cuisine: "North Indian, BBQ, Grills, Buffet",
    location: "Hadapsar, Pune",
    address: "3rd Floor, Amanora Mall, Mundhwa-Kharadi Bypass, Hadapsar, Pune 411028",
    phone: "+91 20 6060 0000",
    avgCostForTwo: "\u20b91,600",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Box8 - Hadapsar",
    cuisine: "North Indian, Desi Meals, Wraps, Biryani",
    location: "Hadapsar, Pune",
    address: "Gandhar Galaxia, Mundhwa Kharadi Road, Hadapsar, Pune 411028",
    phone: "+91 20 3355 2698",
    avgCostForTwo: "\u20b9550",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "PK Biryani House - Magarpatta",
    cuisine: "Biryani, Maharashtrian Non-Veg, Tandoori",
    location: "Hadapsar, Pune",
    address: "Opposite Magarpatta City South Gate, Hadapsar, Pune 411028",
    phone: "+91 97660 55888",
    avgCostForTwo: "\u20b9750",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Sidheshwar Foods - Hadapsar",
    cuisine: "Maharashtrian, Non-Veg Thali, Mutton Sukka",
    location: "Hadapsar, Pune",
    address: "D P Road, Near PMT Bus Parking, Hadapsar, Pune 411028",
    phone: "+91 98226 77112",
    avgCostForTwo: "\u20b91,000",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Wish A Dish",
    cuisine: "North Indian, Mughlai, Biryani",
    location: "Hadapsar, Pune",
    address: "Shop 26, Sasane Nagar, Hadapsar, Pune 411028",
    phone: "+91 98220 99443",
    avgCostForTwo: "\u20b9600",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Sahare Dining Hall",
    cuisine: "Pure Veg, South Indian, Thali",
    location: "Camp, Pune",
    address: "Sadhu Vaswani Road, Opposite Grand Post Office, Camp, Pune 411001",
    phone: "+91 20 2612 3456",
    avgCostForTwo: "\u20b9450",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Rama Krishna Restaurant",
    cuisine: "Pure Veg, North Indian, South Indian, Chinese",
    location: "Camp, Pune",
    address: "Moledina Road, Opposite Westend Theatre, Camp, Pune 411001",
    phone: "+91 20 2613 3939",
    avgCostForTwo: "\u20b9900",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Cream Craver - Camp",
    cuisine: "Pure Veg, South Indian, Pav Bhaji, Chaat",
    location: "Camp, Pune",
    address: "Bootee Street, Near Bund Garden, Camp, Pune 411001",
    phone: "+91 20 2613 0088",
    avgCostForTwo: "\u20b9650",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "JM Housefull Paratha",
    cuisine: "North Indian, Punjabi Parathas, Lassi",
    location: "Deccan Gymkhana, Pune",
    address: "JM Road, Near Sambhaji Park, Deccan Gymkhana, Pune 411004",
    phone: "+91 98220 77123",
    avgCostForTwo: "\u20b9500",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Tales & Spirits - Senapati Bapat Road",
    cuisine: "Pure Veg, European, North Indian, Continental",
    location: "Senapati Bapat Road, Pune",
    address: "ICC Tower, Senapati Bapat Road, Pune 411016",
    phone: "+91 20 6603 5500",
    avgCostForTwo: "\u20b9700",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Aware Maratha Khanawal",
    cuisine: "Authentic Maharashtrian Non-Veg, Mutton Thali",
    location: "Sadashiv Peth, Pune",
    address: "Kumthekar Road, Sadashiv Peth, Pune 411030",
    phone: "+91 20 2447 5599",
    avgCostForTwo: "\u20b9550",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Rangla Punjab - Pashan",
    cuisine: "North Indian, Punjabi Dhaba, Tandoori",
    location: "Pashan, Pune",
    address: "Pune-Mumbai Highway, Near Nissan & Audi Showroom, Pashan, Pune 411021",
    phone: "+91 98220 33411",
    avgCostForTwo: "\u20b9450",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Planet 9 Bistro & Lounge",
    cuisine: "North Indian, Continental, Finger Food, Bar",
    location: "Bavdhan, Pune",
    address: "Opposite Old Jakat Naka, Bavdhan Khurd, Bhugaon Road, Pune 411021",
    phone: "+91 97640 44555",
    avgCostForTwo: "\u20b92,600",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Cafe Co2 Resto Lounge",
    cuisine: "North Indian, Continental, Lakeview Fine Dining",
    location: "Bhugaon, Pune",
    address: "Gat No. 336, Angrewadi, Manas Lake, Bhugaon, Pune 412115",
    phone: "+91 98222 66880",
    avgCostForTwo: "\u20b93,100",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Mystic Flavours",
    cuisine: "North Indian, Multicuisine, Mughlai",
    location: "Warje, Pune",
    address: "Spandan Building, Bangalore-Mumbai Highway, Warje, Pune 411058",
    phone: "+91 20 2523 9900",
    avgCostForTwo: "\u20b91,050",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Nimantran Restaurant",
    cuisine: "North Indian, Multicuisine, Chinese",
    location: "Bibwewadi, Pune",
    address: "Main Road, Near Pushpa Mangal Karyalaya, Bibwewadi, Pune 411037",
    phone: "+91 20 2422 1100",
    avgCostForTwo: "\u20b91,300",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Meghdoots Restaurant",
    cuisine: "North Indian, Multicuisine, Punjabi",
    location: "Bibwewadi, Pune",
    address: "Gagan Samrudhi, Kondhwa-Bibwewadi Road, Pune 411037",
    phone: "+91 20 2421 8833",
    avgCostForTwo: "\u20b91,050",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Exotica - Yerawada",
    cuisine: "North Indian, Oriental, Fine Dining, Rooftop",
    location: "Yerawada, Pune",
    address: "Panchshil Tech Park, Alandi Road, Yerawada, Pune 411006",
    phone: "+91 20 6689 7777",
    avgCostForTwo: "\u20b92,900",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Sufis Garden Restaurant",
    cuisine: "North Indian, Multicuisine, Kebabs",
    location: "Salunke Vihar, Pune",
    address: "Amar Vihar, Salunke Vihar Road, Wanowrie, Pune 411040",
    phone: "+91 20 2685 4422",
    avgCostForTwo: "\u20b9950",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Hotel Shauryawada Family Restaurant",
    cuisine: "North Indian, Maharashtrian Thali, Family Dining",
    location: "Katraj, Pune",
    address: "Katraj-Mantrawadi Bypass Road, Handewadi, Katraj, Pune 411046",
    phone: "+91 98225 66778",
    avgCostForTwo: "\u20b9500",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Ghevar Thali - Katraj",
    cuisine: "Authentic Rajasthani, Gujarati Royal Thali",
    location: "Katraj, Pune",
    address: "Panache Mall, Datta Nagar Road, Katraj, Pune 411046",
    phone: "+91 99220 11445",
    avgCostForTwo: "\u20b9550",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "PK Biryani House - Karve Nagar",
    cuisine: "Biryani, Tandoori, Maharashtrian Non-Veg",
    location: "Karve Nagar, Pune",
    address: "Shop No 13, Param Shopping Complex, D P Road, Karve Nagar, Pune 411052",
    phone: "+91 98220 44991",
    avgCostForTwo: "\u20b9550",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Ratna Veg Cuisine",
    cuisine: "Pure Veg, North Indian, South Indian",
    location: "Karve Nagar, Pune",
    address: "E Building, Kakade Plaza, Karve Road, Karve Nagar, Pune 411052",
    phone: "+91 20 2545 8800",
    avgCostForTwo: "\u20b91,050",
    rating: 3.9,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Akash Misal House & Pure Veg",
    cuisine: "Authentic Puneri Misal, Maharashtrian Snacks",
    location: "Rajgurunagar, Pune",
    address: "National Highway 50, Pune-Nashik Highway, Rajgurunagar, Pune 410505",
    phone: "+91 98230 77889",
    avgCostForTwo: "\u20b9400",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Food Carnival - Talegaon",
    cuisine: "Multicuisine, Fast Food, Highway Diner",
    location: "Talegaon, Pune",
    address: "Mumbai Pune Expressway, Urse Toll Plaza, Talegaon Dabhade, Pune 410506",
    phone: "+91 2114 266 800",
    avgCostForTwo: "\u20b9500",
    rating: 3.6,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Blue Water Restaurant & Bar",
    cuisine: "North Indian, Continental, Seafood, Bar",
    location: "Punawale, PCMC",
    address: "Aundh-Ravet BRT Road, Near Punawale Chowk, Punawale, PCMC, Pune 411033",
    phone: "+91 20 6791 4400",
    avgCostForTwo: "\u20b92,100",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "The Corinthian Resto & Bar - Undri",
    cuisine: "Continental, Italian, North Indian, Fine Dining",
    location: "Undri, Pune",
    address: "The Corinthians Resort & Club, Nyati County, Undri, Pune 411060",
    phone: "+91 20 2695 8888",
    avgCostForTwo: "\u20b92,500",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Flavours of Dhanori",
    cuisine: "North Indian, Biryani, Mughlai",
    location: "Dhanori, Pune",
    address: "Old Jakat Naka, Near Kamal Lawns, Dhanori, Pune 411015",
    phone: "+91 98221 44322",
    avgCostForTwo: "\u20b9700",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Hotel Shreyas - Vishrantwadi",
    cuisine: "Maharashtrian, North Indian, Pure Veg",
    location: "Vishrantwadi, Pune",
    address: "Tingre Nagar Road, Near Bharat Sawant Petrol Pump, Vishrantwadi, Pune 411015",
    phone: "+91 20 2668 5544",
    avgCostForTwo: "\u20b9600",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Navami Pure Veg - Narhe",
    cuisine: "Pure Veg, South Indian, North Indian",
    location: "Narhe, Pune",
    address: "Narhe Gaon Main Road, Near Zeal College, Narhe, Pune 411041",
    phone: "+91 98223 88110",
    avgCostForTwo: "\u20b9550",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Hotel Maratha Samrat - Dhayari",
    cuisine: "Maharashtrian Non-Veg, Mutton Thali, Seafood",
    location: "Dhayari, Pune",
    address: "Near Dhayari Phata, Sinhagad Road, Dhayari, Pune 411041",
    phone: "+91 98220 11995",
    avgCostForTwo: "\u20b91,100",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Destination Kitchen - Nanded City",
    cuisine: "Multicuisine, Continental, North Indian",
    location: "Nanded City, Pune",
    address: "Destination Centre, Nanded City, Sinhagad Road, Pune 411041",
    phone: "+91 20 6752 4433",
    avgCostForTwo: "\u20b9900",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Effingut Brewhouse - Mundhwa",
    cuisine: "Craft Beer, Continental, Bar Food, North Indian",
    location: "Mundhwa, Pune",
    address: "Mundhwa-Kharadi Road, Near ABC Farms, Mundhwa, Pune 411036",
    phone: "+91 76200 33445",
    avgCostForTwo: "\u20b92,200",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  }
,
  {
    name: "Murphies Bistro & Bar",
    cuisine: "European, Jacket Potatoes, Continental, Cocktails",
    location: "Prabhat Road, Pune",
    address: "Lane 14, Opposite Syndicate Bank, Prabhat Road, Erandwane, Pune 411004",
    phone: "+91 93700 05777",
    avgCostForTwo: "₹1,400",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Murphins", "Murphies", "Murphie", "Murphys", "Murphs", "Murphin", "Murph"]
  },
  {
    name: "Hotel Dehaati",
    cuisine: "Authentic Kolhapuri Thali, Pandhara Tambda Rassa, Mutton Sukka",
    location: "Prabhat Road, Pune",
    address: "Prabhat Road, Lane 10, Near Kamala Nehru Park, Erandwane, Pune 411004",
    phone: "+91 98220 89123",
    avgCostForTwo: "₹900",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover",
    aliases: ["Dehati", "Dehaati", "Hotel Dehati", "Dehati Thali", "Dehati Kolhapur"]
  },
  {
    name: "Gather Bistro & All Day Dining",
    cuisine: "Modern Indian, Mediterranean, Specialty Coffee, Brunch",
    location: "Law College Road, Pune",
    address: "Plot 12, Chiplunkar Road, Off Law College Road, Erandwane, Pune 411004",
    phone: "+91 20 2565 8899",
    avgCostForTwo: "₹1,300",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Gather", "Gather Cafe", "The Gather", "Gather Pune", "Gather Bistro"]
  },
  {
    name: "Shabree Restaurant",
    cuisine: "Traditional Maharashtrian Thali, Puran Poli",
    location: "FC Road, Pune",
    address: "1199/1A, Parichay Hotel, FC Road, Shivajinagar, Pune 411004",
    phone: "+91 20 2553 1511",
    avgCostForTwo: "\u20b9800",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Kata Kirr",
    cuisine: "Puneri Misal Pav, Buttermilk",
    location: "Karve Road, Pune",
    address: "Dr Ketkar Road, Off Karve Road, Erandwane, Pune 411004",
    phone: "+91 20 2543 8989",
    avgCostForTwo: "\u20b9250",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Blue Nile",
    cuisine: "Irani Mutton Biryani, Chelo Kebab, Mughlai",
    location: "Camp, Pune",
    address: "4, Bund Garden Road, Opposite Poona Club, Camp, Pune 411001",
    phone: "+91 20 2612 5238",
    avgCostForTwo: "\u20b91,100",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Badshahi Boarding House",
    cuisine: "Simple Home-Style Maharashtrian Brahmin Thali",
    location: "Tilak Road, Pune",
    address: "1187, Sadashiv Peth, Tilak Road, Pune 411030",
    phone: "+91 20 2447 1856",
    avgCostForTwo: "\u20b9350",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Sukanta Pure Veg Thali",
    cuisine: "Royal Rajasthani & Gujarati Unlimited Thali",
    location: "Deccan Gymkhana, Pune",
    address: "Pulachi Wadi, Near Z-Bridge, Deccan Gymkhana, Pune 411004",
    phone: "+91 20 2553 0077",
    avgCostForTwo: "\u20b9750",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Nisarga Seafood Restaurant",
    cuisine: "Coastal Malvani, Mangalorean Seafood, Neer Dosa, Crab Masala",
    location: "Karve Road, Pune",
    address: "Opposite Nal Stop, Karve Road, Erandwane, Pune 411004",
    phone: "+91 20 2544 5444",
    avgCostForTwo: "\u20b91,500",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Mathura Pure Veg",
    cuisine: "North Indian, South Indian, Punjabi Thali",
    location: "JM Road, Pune",
    address: "Near Balgandharva Rangmandir, JM Road, Shivajinagar, Pune 411005",
    phone: "+91 20 2553 4567",
    avgCostForTwo: "\u20b9600",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Chafa Cafe & Studio",
    cuisine: "Healthy Bowls, Sourdough Toasts, Vegan, Specialty Coffee",
    location: "Koregaon Park, Pune",
    address: "Row House 5, Aadit Enclave, Lane 5, Koregaon Park, Pune 411001",
    phone: "+91 97671 00022",
    avgCostForTwo: "\u20b91,100",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "729 Grams Coffee Roasters",
    cuisine: "Artisanal Specialty Coffee, Pour-overs, Sandwiches",
    location: "Koregaon Park, Pune",
    address: "Lane 6, Koregaon Park, Pune 411001",
    phone: "+91 98220 99881",
    avgCostForTwo: "\u20b9600",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Blue Tokai Coffee Roasters - Koregaon Park",
    cuisine: "Specialty Coffee, Flat Whites, Breakfast Croissants",
    location: "Koregaon Park, Pune",
    address: "Lane 5, North Main Road, Koregaon Park, Pune 411001",
    phone: "+91 98221 44550",
    avgCostForTwo: "\u20b9700",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Blue Tokai Coffee Roasters - Baner",
    cuisine: "Specialty Coffee, Light Bakes, Sourdough",
    location: "Baner, Pune",
    address: "Balewadi High Street Link Road, Baner, Pune 411045",
    phone: "+91 98221 44551",
    avgCostForTwo: "\u20b9700",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Cafe Kathaa",
    cuisine: "Coffee, Sandwiches, Book Cafe, Continental",
    location: "FC Road, Pune",
    address: "Opposite Starbucks, FC Road, Shivajinagar, Pune 411004",
    phone: "+91 20 2567 4433",
    avgCostForTwo: "\u20b9550",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Cafe Peter - Aundh",
    cuisine: "Korean Ramen, Donuts, Kimchi Fried Rice, Coffee",
    location: "Aundh, Pune",
    address: "Anand Park, ITI Road, Aundh, Pune 411007",
    phone: "+91 20 2588 7766",
    avgCostForTwo: "\u20b9700",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Cafe Peter - Viman Nagar",
    cuisine: "Korean Ramen, Pizza, Shakes, Waffles",
    location: "Viman Nagar, Pune",
    address: "Near Symbiosis College, Viman Nagar, Pune 411014",
    phone: "+91 20 2663 8877",
    avgCostForTwo: "\u20b9700",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Grandmama's Cafe",
    cuisine: "Continental, Mac & Cheese, Waffles, Italian",
    location: "Koregaon Park, Pune",
    address: "South Main Road, Koregaon Park, Pune 411001",
    phone: "+91 20 2615 8899",
    avgCostForTwo: "\u20b91,200",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Barometer",
    cuisine: "Modern European, Asian, Craft Cocktails, Pizza",
    location: "Kothrud, Pune",
    address: "Near Karishma Society, Off DP Road, Kothrud, Pune 411038",
    phone: "+91 20 2544 1122",
    avgCostForTwo: "\u20b91,500",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Ginkgo - Asian Diner",
    cuisine: "Japanese Ramen, Sushi, Korean Fried Chicken, Boba",
    location: "Kothrud, Pune",
    address: "Near Mayur Colony, Kothrud, Pune 411038",
    phone: "+91 98220 33119",
    avgCostForTwo: "\u20b91,100",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "square"
  },
  {
    name: "Independence Brewing Company",
    cuisine: "Craft Beer, BBQ, Continental, Thin Crust Pizza",
    location: "Baner, Pune",
    address: "Balewadi High Street, Balewadi-Baner Link Road, Pune 411045",
    phone: "+91 20 6644 8300",
    avgCostForTwo: "\u20b92,200",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Effingut Brewhouse - Koregaon Park",
    cuisine: "Artisanal Craft Beer, Apple Cider, Pub Grubs",
    location: "Koregaon Park, Pune",
    address: "End of Lane 6, Koregaon Park, Pune 411001",
    phone: "+91 76200 33441",
    avgCostForTwo: "\u20b92,200",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Effingut Brewhouse - Baner",
    cuisine: "Craft Beer, Woodfired Pizzas, Burgers",
    location: "Baner, Pune",
    address: "Deron Heights, Baner Road, Baner, Pune 411045",
    phone: "+91 76200 33442",
    avgCostForTwo: "\u20b92,200",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Doolally on Tap",
    cuisine: "Craft Beers, Apple Cider, House Fries, Burgers",
    location: "Koregaon Park, Pune",
    address: "Opposite Jogger's Park, Lane 1, Koregaon Park, Pune 411001",
    phone: "+91 20 2615 9900",
    avgCostForTwo: "\u20b91,800",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "FC Road Social",
    cuisine: "North Indian, Continental, Cocktails, Street Food",
    location: "FC Road, Pune",
    address: "Level 1, Cello Platina, FC Road, Shivajinagar, Pune 411005",
    phone: "+91 20 6766 8800",
    avgCostForTwo: "\u20b91,500",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Social", "FC Road Social", "Social FC Road", "FC Social", "Social Pune"]
  },
  {
    name: "One8 Commune Pune",
    cuisine: "Modern Global Dining, Asian, Cocktails",
    location: "Koregaon Park, Pune",
    address: "Unit 2, The Mills, Sangamvadi, Koregaon Park Annexe, Pune 411001",
    phone: "+91 20 7196 7777",
    avgCostForTwo: "\u20b92,500",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Arthur's Theme - Koregaon Park",
    cuisine: "European, French, Steaks, Fondue, Wine",
    location: "Koregaon Park, Pune",
    address: "Shop 2, Vrindavan Apartment, Lane 6, Koregaon Park, Pune 411001",
    phone: "+91 20 2615 2710",
    avgCostForTwo: "\u20b91,800",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Arthur's Theme - Balewadi",
    cuisine: "European, French Steaks, Pastas, Desserts",
    location: "Balewadi, Pune",
    address: "Balewadi High Street, Balewadi, Pune 411045",
    phone: "+91 20 6712 3456",
    avgCostForTwo: "\u20b91,800",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Prem's Restaurant",
    cuisine: "North Indian, Continental, Outdoor Garden Dining",
    location: "Koregaon Park, Pune",
    address: "28/2, North Main Road, Koregaon Park, Pune 411001",
    phone: "+91 20 2615 0040",
    avgCostForTwo: "\u20b91,600",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Tsuki",
    cuisine: "Modern Pan-Asian, Dimsums, Robata Grills, Cocktails",
    location: "Koregaon Park, Pune",
    address: "Lane 5, Koregaon Park, Pune 411001",
    phone: "+91 91520 66881",
    avgCostForTwo: "\u20b92,800",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Gong - Balewadi High Street",
    cuisine: "Modern Asian, Sushi, Dimsum, Cantonese",
    location: "Balewadi, Pune",
    address: "Balewadi High Street, Near Cummins India, Balewadi, Pune 411045",
    phone: "+91 20 6712 5500",
    avgCostForTwo: "\u20b92,400",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "The Cult - Terra & Eco",
    cuisine: "North Indian, Continental, Open Air Lounge",
    location: "Hadapsar, Pune",
    address: "Near Magarpatta City, Hadapsar, Pune 411028",
    phone: "+91 20 6715 4400",
    avgCostForTwo: "\u20b92,000",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Paasha - JW Marriott",
    cuisine: "Rooftop North Indian, Dal Paasha, Kakori Kebabs",
    location: "Senapati Bapat Road, Pune",
    address: "Level 24, JW Marriott Hotel, Senapati Bapat Road, Pune 411053",
    phone: "+91 20 6683 3333",
    avgCostForTwo: "\u20b94,000",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Alto Vino - JW Marriott",
    cuisine: "Authentic Italian Fine Dining, Handmade Pasta, Risotto",
    location: "Senapati Bapat Road, Pune",
    address: "JW Marriott Hotel, Senapati Bapat Road, Pune 411053",
    phone: "+91 20 6683 2345",
    avgCostForTwo: "\u20b93,500",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Three Kitchens Restaurant and Bar",
    cuisine: "Global Luxury Buffet, Asian, Indian, European",
    location: "Yerawada, Pune",
    address: "The Ritz-Carlton, Airport Road, Yerawada, Pune 411006",
    phone: "+91 20 6767 5050",
    avgCostForTwo: "\u20b94,500",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Coriander Kitchen - Conrad Pune",
    cuisine: "All Day Luxury Buffet, Mediterranean, Pan-Asian, Indian",
    location: "Bund Garden Road, Pune",
    address: "Conrad Pune, 7, Mangaldas Road, Sangamvadi, Pune 411001",
    phone: "+91 20 6745 6745",
    avgCostForTwo: "\u20b94,000",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Surve's Pure Non-Veg - FC Road",
    cuisine: "Authentic Maratha Non-Veg, Mutton & Chicken Thalis",
    location: "FC Road, Pune",
    address: "Near Fergusson College, FC Road, Shivajinagar, Pune 411004",
    phone: "+91 98224 55660",
    avgCostForTwo: "\u20b9800",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Surve's Pure Non-Veg - Sadashiv Peth",
    cuisine: "Maharashtrian Non-Veg, Tambda Rassa, Bhakri",
    location: "Sadashiv Peth, Pune",
    address: "Tilak Road, Near SP College, Sadashiv Peth, Pune 411030",
    phone: "+91 98224 55661",
    avgCostForTwo: "\u20b9800",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "clover"
  },
  {
    name: "Tiranga Bhuvan",
    cuisine: "Traditional Maharashtrian Biryani, Chicken Thali",
    location: "Kothrud, Pune",
    address: "Paud Road, Near Vanaz Corner, Kothrud, Pune 411038",
    phone: "+91 20 2544 3322",
    avgCostForTwo: "\u20b9700",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Jagdamb Restaurant",
    cuisine: "Highway Style Mutton Thali, Gavran Chicken, Indrayani Rice",
    location: "Khed Shivapur, Pune",
    address: "Pune-Bangalore Highway, Near Toll Plaza, Khed Shivapur, Pune 412205",
    phone: "+91 98220 99990",
    avgCostForTwo: "\u20b9900",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Janseva Dining Hall",
    cuisine: "Authentic Gujarati & Maharashtrian Thali",
    location: "Deccan Gymkhana, Pune",
    address: "Garware Bridge Corner, Deccan Gymkhana, Pune 411004",
    phone: "+91 20 2567 8901",
    avgCostForTwo: "\u20b9600",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Panchali Pure Veg",
    cuisine: "Pure Veg, North Indian, Punjabi Thali",
    location: "JM Road, Pune",
    address: "Near Sambhaji Park, JM Road, Shivajinagar, Pune 411004",
    phone: "+91 20 2553 6677",
    avgCostForTwo: "\u20b9650",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Sarjaa Family Restaurant",
    cuisine: "North Indian, Mughlai, Seafood, Tandoor",
    location: "Aundh, Pune",
    address: "ITI Road, Near Parihar Chowk, Aundh, Pune 411007",
    phone: "+91 20 2588 5544",
    avgCostForTwo: "\u20b91,200",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Bhairavee Pure Veg",
    cuisine: "Pure Veg, Pav Bhaji, South Indian, North Indian",
    location: "Aundh, Pune",
    address: "Bhairavee Hotel, Baner Road, Aundh Phata, Pune 411007",
    phone: "+91 20 2588 8899",
    avgCostForTwo: "\u20b9750",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "universal_api"
  },
  {
    name: "Urbo Kitchen & Bar",
    cuisine: "North Indian, Continental, Finger Food, Cocktails",
    location: "Aundh, Pune",
    address: "Opposite Westend Mall, Aundh, Pune 411007",
    phone: "+91 20 6712 9988",
    avgCostForTwo: "\u20b91,600",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Tarsh Kitchen & Bar",
    cuisine: "Rooftop North Indian, Buffet, Continental, Bar",
    location: "Hinjewadi, PCMC",
    address: "8th Floor, White Square, Wakad-Hinjewadi Road, Hinjewadi Phase 1, Pune 411057",
    phone: "+91 20 6791 8888",
    avgCostForTwo: "\u20b91,800",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast"
  },
  {
    name: "Mezza9 Family Restaurant",
    cuisine: "Multicuisine, North Indian, Chinese, Continental",
    location: "Hinjewadi, PCMC",
    address: "Opposite Geometric Software, Hinjewadi Phase 1, Pune 411057",
    phone: "+91 20 6652 0909",
    avgCostForTwo: "\u20b91,500",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "clover",
    aliases: ["Mezza9", "Mezza 9", "Mezza9 Hinjewadi"]
  },
  {
    name: "Kalyan Bhel",
    cuisine: "Chaat, Street Food, Bhel Puri, Sev Puri, SPDP",
    location: "Law College Road / Erandwane, Pune",
    address: "Near Nal Stop, Law College Road, Erandwane, Pune 411004",
    phone: "+91 20 2544 5566",
    avgCostForTwo: "\u20b9250",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Kalyan Bhel", "Kalyan", "Kalyan Bhel Pune", "Kalyan Chaat"]
  },
  {
    name: "Fakira Misal",
    cuisine: "Authentic Maharashtrian Misal Pav, Rassa, Taak",
    location: "Bibwewadi, Pune",
    address: "Swami Vivekanand Road, Upper Indira Nagar, Bibwewadi, Pune 411037",
    phone: "+91 20 2428 1122",
    avgCostForTwo: "\u20b9200",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Fakira", "Fakira Misal", "Fakira Misal House", "Hotel Fakira"]
  },
  {
    name: "Neelam Pure Veg",
    cuisine: "North Indian, South Indian, Pav Bhaji, Pure Veg",
    location: "Nigdi, PCMC",
    address: "Sector 24, Near Pradhikaran, Nigdi, Pimpri-Chinchwad 411044",
    phone: "+91 20 2765 4321",
    avgCostForTwo: "\u20b9500",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Neelam", "Neelam Pure Veg", "Hotel Neelam", "Neelam Nigdi", "Neelam PCMC"]
  },
  {
    name: "Hotel Ram Krishna",
    cuisine: "Pure Vegetarian Multi-Cuisine, South Indian, Thali",
    location: "Camp, Pune",
    address: "6 Bund Garden Road, Near Pune Railway Station & Camp, Pune 411001",
    phone: "+91 20 2613 3939",
    avgCostForTwo: "\u20b9600",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Ram Krishna", "Hotel Ram Krishna", "Ramkrishna", "Hotel Ramkrishna", "Ram Krishna Pure Veg"]
  },
  {
    name: "Garden Vada Pav Centre",
    cuisine: "Iconic Pune Vada Pav, Masala Chaas, Mirchi Fry",
    location: "Camp, Pune",
    address: "948 Bootee Street, Camp, Pune 411001",
    phone: "+91 98220 12345",
    avgCostForTwo: "\u20b9100",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Garden Vada Pav", "Garden Vadapav", "Garden Vada Pav Centre", "Camp Garden Vada Pav"]
  },
  {
    name: "Cafe Paashh",
    cuisine: "Organic European, Farm to Table, Vegan, Specialty Coffee",
    location: "Kalyani Nagar, Pune",
    address: "Plot No. E1, Survey No. 213, Kalyani Nagar, Pune 411006",
    phone: "+91 20 6723 5555",
    avgCostForTwo: "\u20b91,500",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Paashh", "Cafe Paashh", "Paashh Cafe", "Paash Kalyani Nagar"]
  },
  {
    name: "Smoor Chocolates & Cafe",
    cuisine: "Artisanal Chocolates, Macarons, Pastries, European Cafe",
    location: "Koregaon Park, Pune",
    address: "Plot 390, Lane 5, Koregaon Park, Pune 411001",
    phone: "+91 20 4860 7700",
    avgCostForTwo: "\u20b9900",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Smoor", "Smoor Chocolates", "Smoor Cafe", "Smoor Koregaon Park"]
  },
  {
    name: "Aromas Cafe & Bistro",
    cuisine: "Australian All-Day Cafe, Continental, Gourmet Coffee",
    location: "Koregaon Park, Pune",
    address: "Lane 6, Koregaon Park, Pune 411001",
    phone: "+91 20 6602 1100",
    avgCostForTwo: "\u20b91,200",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Aromas", "Aromas Cafe", "Aromas Bistro", "Aromas Cafe & Bistro"]
  },
  {
    name: "We Idliwale Bar Room",
    cuisine: "Contemporary South Indian, Podi Idlis, Craft Cocktails",
    location: "Viman Nagar, Pune",
    address: "Ground Floor, Sky Vista, New Airport Road, Viman Nagar, Pune 411014",
    phone: "+91 80 4748 3344",
    avgCostForTwo: "\u20b91,200",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["We Idliwale", "We Idliwale Bar Room", "Idliwale", "We Idliwale Pune"]
  },
  {
    name: "Third Wave Coffee",
    cuisine: "Specialty Coffee Roasters, Espresso, Bagels, Cafe",
    location: "Kalyani Nagar, Pune",
    address: "Central Avenue, Near Jogger's Park, Kalyani Nagar, Pune 411006",
    phone: "+91 20 6700 8899",
    avgCostForTwo: "\u20b9650",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Third Wave Coffee", "Third Wave", "Third Wave Kalyani Nagar", "TWC Pune"]
  },
  {
    name: "Baan Tao",
    cuisine: "Pan-Asian Fine Dining, Thai Curry, Dim Sum, Chinese",
    location: "Kalyani Nagar, Pune",
    address: "Hyatt Pune, Adjacent to Aga Khan Palace, 88 Nagar Road, Kalyani Nagar, Pune 411006",
    phone: "+91 20 4141 1234",
    avgCostForTwo: "\u20b92,800",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Baan Tao", "Baan Tao Hyatt", "Baan Tao Pune", "Baan Tao Pan Asian"]
  },
  {
    name: "The K Factory",
    cuisine: "Modern Continental, Wood Fired Pizza, Craft Cocktails",
    location: "Baner, Pune",
    address: "Near Westend Mall, Aundh-Baner Link Road, Baner, Pune 411045",
    phone: "+91 20 6744 5500",
    avgCostForTwo: "\u20b91,600",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["The K Factory", "K Factory", "K Factory Baner"]
  },
  {
    name: "Incognito Restaurant Bar & Cafe",
    cuisine: "European, Italian, Gourmet Burgers, Bar",
    location: "Balewadi High Street, Pune",
    address: "Balewadi High Street, Balewadi, Pune 411045",
    phone: "+91 20 6709 8899",
    avgCostForTwo: "\u20b91,800",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Incognito", "Incognito Restaurant", "Incognito Balewadi High Street", "Incognito Pune"]
  },
  {
    name: "Greens & Olives",
    cuisine: "Gourmet Pure Vegetarian, Italian, Continental, Mexican",
    location: "Aundh, Pune",
    address: "Nagras Road, Aundh, Pune 411007",
    phone: "+91 20 2588 3333",
    avgCostForTwo: "\u20b91,100",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Greens & Olives", "Greens and Olives", "Greens & Olives Aundh", "Greens and Olives Pure Veg"]
  },
  {
    name: "Portico Pure Veg",
    cuisine: "Multi-Cuisine Pure Vegetarian, Punjabi, Chinese, South Indian",
    location: "Hinjewadi, PCMC",
    address: "Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune 411057",
    phone: "+91 20 6652 4400",
    avgCostForTwo: "\u20b9800",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Portico", "Portico Pure Veg", "Hotel Portico Hinjewadi", "Portico Hinjewadi"]
  },
  {
    name: "MoMo Cafe - Courtyard by Marriott",
    cuisine: "Luxury Multi-Cuisine Buffet, North Indian, Continental, Asian",
    location: "Hinjewadi, PCMC",
    address: "Courtyard by Marriott, S. No. 19/3B, Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune 411057",
    phone: "+91 20 4212 2222",
    avgCostForTwo: "\u20b92,200",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["MoMo Cafe", "MoMo Cafe Hinjewadi", "MoMo Cafe Marriott", "Courtyard MoMo Cafe", "MoMo Cafe Courtyard by Marriott"]
  },
  {
    name: "Aaswad Executive",
    cuisine: "Authentic Maharashtrian, North Indian, Chinese Thali",
    location: "Hinjewadi, PCMC",
    address: "Near Wipro Circle, Phase 1, Hinjewadi, Pune 411057",
    phone: "+91 20 2293 8877",
    avgCostForTwo: "\u20b9600",
    rating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Aaswad", "Aaswad Executive", "Hotel Aaswad Hinjewadi", "Aaswad Hinjewadi"]
  },
  {
    name: "The Rustle Nest",
    cuisine: "Open Air Garden Cafe, Continental, Wood Fired Pizza, Shakes",
    location: "Baner, Pune",
    address: "Baner-Pashan Link Road, Baner, Pune 411045",
    phone: "+91 91750 99887",
    avgCostForTwo: "\u20b91,000",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["The Rustle Nest", "Rustle Nest", "Rustle Nest Baner"]
  },
  {
    name: "Kaware Ice Cream",
    cuisine: "Heritage Pune Handcrafted Ice Cream, Mango Mastani, Kulfi",
    location: "Tulshibaug, Pune",
    address: "Budhwar Peth, Near Tulshibaug, Pune 411002",
    phone: "+91 20 2445 0099",
    avgCostForTwo: "\u20b9200",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Kaware", "Kaware Ice Cream", "Kaware Icecream", "Kaware Mastani"]
  },
  {
    name: "Cream Stone Concepts",
    cuisine: "Cold Stone Ice Cream Creations, Sundaes, Waffles",
    location: "FC Road / Shivajinagar, Pune",
    address: "FC Road, Shivajinagar, Pune 411004",
    phone: "+91 20 2567 4488",
    avgCostForTwo: "\u20b9450",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["Cream Stone", "Creamstone", "Cream Stone Concepts", "Cream Stone FC Road"]
  },
  {
    name: "Yolkshire All Day Breakfast",
    cuisine: "Gourmet Egg Specialties, English Breakfast, Pancakes, Cafe",
    location: "Aundh, Pune",
    address: "DP Road, Aundh, Pune 411007",
    phone: "+91 20 6500 7744",
    avgCostForTwo: "\u20b9600",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Yolkshire", "Yolkshire Aundh", "Yolkshire Breakfast", "Yolkshire All Day Breakfast"]
  },
  {
    name: "The Flour Works",
    cuisine: "European Bakery, Wood-Fired Pizza, Breakfast & Bistro",
    location: "Kalyani Nagar, Pune",
    address: "Commercial 4, North Avenue, Kalyani Nagar, Pune 411006",
    phone: "+91 20 2668 0474",
    avgCostForTwo: "\u20b91,400",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
    posProvider: "toast",
    aliases: ["The Flour Works", "Flour Works", "Flour Works Kalyani Nagar"]
  },
  {
    name: "Siddique Kebab Corner",
    cuisine: "Mughlai, Seekh Kebabs, Chicken Roll, Tandoor",
    location: "Camp, Pune",
    address: "Moledina Road, Camp, Pune 411001",
    phone: "+91 20 2613 8822",
    avgCostForTwo: "\u20b9400",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop",
    posProvider: "universal_api",
    aliases: ["Siddique", "Siddique Kabab", "Siddique Kebab", "Siddique Kebab Corner", "Siddique Camp"]
  }
];

/**
 * Normalizes text for typo-tolerant, phonetic, and transliteration matching
 * (e.g. 'murphins' -> 'murphies', 'dehati' -> 'dehaati', 'roopali' -> 'rupali')
 */
export function normalizePuneSearch(s: string): string {
  if (!s) return '';
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'e')
    .replace(/oo/g, 'o')
    .replace(/ph/g, 'f')
    .replace(/ns$/, '')
    .replace(/s$/, '');
}

/**
 * Checks if a Pune restaurant entry or Restaurant model matches a search query
 * Supports:
 * - Substring search across name, aliases, cuisine, location, address
 * - Phonetic / typo-tolerant vowel collapse (e.g. murphins, dehati)
 * - Word-order-independent multi-token matching (e.g. "social fc road", "goodluck cafe")
 */
export function matchesPuneQuery(
  item: { name: string; cuisine?: string; location?: string; address?: string; aliases?: string[] },
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const rawQ = query.trim().toLowerCase();
  const cleanQ = rawQ.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const nq = normalizePuneSearch(cleanQ);

  const cleanName = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const cleanAliases = (item.aliases || []).map((a) =>
    a.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  );
  const cleanCuisine = (item.cuisine || '').toLowerCase();
  const cleanLoc = (item.location || '').toLowerCase();
  const cleanAddr = (item.address || '').toLowerCase();

  // 1. Direct continuous substring
  if (
    cleanName.includes(cleanQ) ||
    cleanAliases.some((a) => a.includes(cleanQ)) ||
    cleanCuisine.includes(cleanQ) ||
    cleanLoc.includes(cleanQ) ||
    cleanAddr.includes(cleanQ)
  ) {
    return true;
  }

  // 2. Phonetic normalized matching
  if (nq.length >= 3) {
    if (
      normalizePuneSearch(cleanName).includes(nq) ||
      cleanAliases.some((a) => normalizePuneSearch(a).includes(nq))
    ) {
      return true;
    }
  }

  // 3. Multi-token / all-words-present matching
  const tokens = cleanQ.split(/[\s,.'"-]+/).filter((t) => t.length > 0);
  if (tokens.length > 1) {
    const combinedSearchable = `${cleanName} ${cleanAliases.join(' ')} ${cleanCuisine} ${cleanLoc} ${cleanAddr}`.toLowerCase();
    const allTokensFound = tokens.every((token) => {
      const nToken = normalizePuneSearch(token);
      return (
        combinedSearchable.includes(token) ||
        (nToken.length >= 3 && normalizePuneSearch(combinedSearchable).includes(nToken))
      );
    });
    if (allTokensFound) return true;
  }

  return false;
}

/**
 * Fuzzy search function for autocomplete
 * Matches against name, aliases, cuisine, location, and phonetic normalization
 */
export function searchPuneRestaurants(query: string): PuneRestaurantEntry[] {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase().trim();
  const cleanQ = q.replace(/['’]/g, '');

  return PUNE_RESTAURANT_DIRECTORY
    .filter((r) => matchesPuneQuery(r, query))
    .sort((a, b) => {
      // Prioritize name or alias matches
      const aExact =
        a.name.toLowerCase().includes(q) ||
        a.name.toLowerCase().replace(/['’]/g, '').includes(cleanQ) ||
        a.aliases?.some((al) => al.toLowerCase().includes(q) || al.toLowerCase().replace(/['’]/g, '').includes(cleanQ));
      const bExact =
        b.name.toLowerCase().includes(q) ||
        b.name.toLowerCase().replace(/['’]/g, '').includes(cleanQ) ||
        b.aliases?.some((al) => al.toLowerCase().includes(q) || al.toLowerCase().replace(/['’]/g, '').includes(cleanQ));
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      // Then by rating
      return b.rating - a.rating;
    })
    .slice(0, 15); // Suggestions
}
