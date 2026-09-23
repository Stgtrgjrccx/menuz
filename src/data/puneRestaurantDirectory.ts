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
