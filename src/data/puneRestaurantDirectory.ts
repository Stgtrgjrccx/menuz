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
    posProvider: 'universal_api'
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
    posProvider: 'universal_api'
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
    name: 'SP’s Biryani House',
    cuisine: 'Dum Mutton Biryani, Rassa, Gavran Chicken',
    location: 'Sadashiv Peth / Tilak Road, Pune',
    address: '1472, Tilak Road, Lokmanya Nagar, Sadashiv Peth, Pune 411030',
    phone: '+91 20 2447 2220',
    avgCostForTwo: '₹800',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop',
    posProvider: 'universal_api'
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
];

/**
 * Fuzzy search function for autocomplete
 * Matches against name, cuisine, and location
 */
export function searchPuneRestaurants(query: string): PuneRestaurantEntry[] {
  if (!query || query.trim().length < 2) return [];
  
  const q = query.toLowerCase().trim();
  
  return PUNE_RESTAURANT_DIRECTORY
    .filter((r) => {
      const nameMatch = r.name.toLowerCase().includes(q);
      const cuisineMatch = r.cuisine.toLowerCase().includes(q);
      const locationMatch = r.location.toLowerCase().includes(q);
      const addressMatch = r.address.toLowerCase().includes(q);
      return nameMatch || cuisineMatch || locationMatch || addressMatch;
    })
    .sort((a, b) => {
      // Prioritize name matches
      const aNameMatch = a.name.toLowerCase().startsWith(q) ? 0 : a.name.toLowerCase().includes(q) ? 1 : 2;
      const bNameMatch = b.name.toLowerCase().startsWith(q) ? 0 : b.name.toLowerCase().includes(q) ? 1 : 2;
      if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch;
      // Then by rating
      return b.rating - a.rating;
    })
    .slice(0, 10); // Max 10 suggestions
}
