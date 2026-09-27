import re
import json

# Read existing directory
with open('src/data/puneRestaurantDirectory.ts', 'r') as f:
    content = f.read()

existing_names = set(re.findall(r'name:\s*[\'\"]([^\'\"]+)[\'\"]', content))
print(f"Existing names count: {len(existing_names)}")

# New restaurants from Perplexity report
perplexity_data = [
    # PCMC - Pimpri
    {
        "name": "Domino's Pizza - Pimpri",
        "cuisine": "Pizza, Fast Food, Desserts",
        "location": "Pimpri, PCMC",
        "address": "Mewani Complex, Old Mumbai Pune Highway, Pimpri, PCMC, Pune 411018",
        "phone": "+91 20 2742 8800",
        "avgCostForTwo": "₹500",
        "rating": 3.6,
        "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Frozen Bottle - Pimpri",
        "cuisine": "Beverages, Milkshakes, Desserts",
        "location": "Pimpri, PCMC",
        "address": "Near Deluxe Cinema, Pimpri Colony, PCMC, Pune 411017",
        "phone": "+91 91520 84821",
        "avgCostForTwo": "₹400",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop",
        "posProvider": "square"
    },
    {
        "name": "Sky Social Lounge And Bar",
        "cuisine": "North Indian, Continental, Cocktails",
        "location": "Bhosari, PCMC",
        "address": "Opposite Century Enka, Pune-Nashik Highway, Bhosari, PCMC, Pune 411039",
        "phone": "+91 20 2712 9944",
        "avgCostForTwo": "₹700",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Chinchwad
    {
        "name": "Domino's Pizza - Elpro Mall",
        "cuisine": "Pizza, Fast Food, Desserts",
        "location": "Chinchwad, PCMC",
        "address": "Elpro City Square Mall, Chinchwad Gaon, PCMC, Pune 411033",
        "phone": "+91 20 6710 4400",
        "avgCostForTwo": "₹500",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Faro The Sky Bar",
        "cuisine": "Continental, North Indian, Cocktails",
        "location": "Chinchwad, PCMC",
        "address": "Kudale Plaza, Old Mumbai Pune Highway, Chinchwad, PCMC, Pune 411019",
        "phone": "+91 88888 77612",
        "avgCostForTwo": "₹1,500",
        "rating": 3.8,
        "imageUrl": "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "360 Degree Multicuisine Family Restaurant",
        "cuisine": "Chinese, North Indian, Mughlai",
        "location": "Chinchwad, PCMC",
        "address": "Near Chaphekar Chowk, Chinchwad, PCMC, Pune 411033",
        "phone": "+91 20 2735 3600",
        "avgCostForTwo": "₹1,000",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Pimple Saudagar
    {
        "name": "Govind Garden",
        "cuisine": "North Indian, Asian, Mughlai, Bar",
        "location": "Pimple Saudagar, PCMC",
        "address": "Ganesh Park Society, Aundh-Ravet BRT Road, Pimple Saudagar, PCMC, Pune 411027",
        "phone": "+91 20 2720 1888",
        "avgCostForTwo": "₹1,400",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Chulbul Dhaba - Pimple Saudagar",
        "cuisine": "North Indian, Punjabi Dhaba, Desserts",
        "location": "Pimple Saudagar, PCMC",
        "address": "Spot 18 Mall Road, Pimple Saudagar, PCMC, Pune 411027",
        "phone": "+91 98901 23456",
        "avgCostForTwo": "₹800",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Pimple Nilakh
    {
        "name": "Copa Cabana",
        "cuisine": "North Indian, Asian, Fine Dining, Cocktails",
        "location": "Pimple Nilakh, PCMC",
        "address": "Opposite Gajraj Laundry, Wakad-Pimple Nilakh Road, Vishal Nagar, Pimple Nilakh, PCMC, Pune 411027",
        "phone": "+91 20 2729 3333",
        "avgCostForTwo": "₹2,900",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Apple 5 Family Restaurant",
        "cuisine": "North Indian, Chinese, Tandoor",
        "location": "Pimple Nilakh, PCMC",
        "address": "Vishal Nagar, DP Road, Pimple Nilakh, PCMC, Pune 411027",
        "phone": "+91 98220 55432",
        "avgCostForTwo": "₹650",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Pimple Gurav
    {
        "name": "Vault Kitchen and Bar",
        "cuisine": "Chinese, North Indian, Finger Food, Bar",
        "location": "Pimple Gurav, PCMC",
        "address": "Near Kate Puram Chowk, Pimple Gurav, PCMC, Pune 411061",
        "phone": "+91 97666 41122",
        "avgCostForTwo": "₹1,000",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Akurdi
    {
        "name": "La Rangila Restaurant",
        "cuisine": "North Indian, Chinese, Punjabi Thali",
        "location": "Akurdi, PCMC",
        "address": "Shop 4, La Regalia Building, Opposite Akurdi Railway Station, Akurdi, PCMC, Pune 411035",
        "phone": "+91 98231 44556",
        "avgCostForTwo": "₹600",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Tathawade
    {
        "name": "Raaga Imperio Restaurant & Banquet",
        "cuisine": "North Indian, Continental, Mughlai, Bar",
        "location": "Tathawade, PCMC",
        "address": "Aundh-Ravet BRT Road, Near JSPM College, Tathawade, PCMC, Pune 411033",
        "phone": "+91 20 6791 2222",
        "avgCostForTwo": "₹2,100",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Wakad
    {
        "name": "Hotel Vishwanath Palace",
        "cuisine": "North Indian, South Indian, Fast Food",
        "location": "Wakad, PCMC",
        "address": "City Avenue, Near Jaguar Showroom, Mumbai-Bangalore Highway, Wakad, PCMC, Pune 411057",
        "phone": "+91 98500 11223",
        "avgCostForTwo": "₹800",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Hinjewadi
    {
        "name": "The FML Lounge - Hinjewadi",
        "cuisine": "North Indian, Continental, Finger Food, Bar",
        "location": "Hinjewadi, PCMC",
        "address": "Survey 286, Hinjawadi-Wakad Road, Hinjewadi Phase 1, PCMC, Pune 411057",
        "phone": "+91 90110 32444",
        "avgCostForTwo": "₹2,000",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Aroma's Hyderabad House - Hinjewadi",
        "cuisine": "Hyderabadi, Biryani, Mughlai",
        "location": "Hinjewadi, PCMC",
        "address": "Phase 2 Road, Hinjewadi Phase 1, PCMC, Pune 411057",
        "phone": "+91 20 6652 3344",
        "avgCostForTwo": "₹1,400",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Baner
    {
        "name": "Green Park Multicuisine",
        "cuisine": "North Indian, Mughlai, Chinese, Multicuisine",
        "location": "Baner, Pune",
        "address": "Baner Road, Near Baner Phata, Baner, Pune 411045",
        "phone": "+91 20 2565 6777",
        "avgCostForTwo": "₹1,800",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Elephant & Co. Baner",
        "cuisine": "Japanese, Asian, Cocktails, Bar",
        "location": "Baner, Pune",
        "address": "Survey 33/2, Balewadi High Street Link Road, Baner, Pune 411045",
        "phone": "+91 98230 11999",
        "avgCostForTwo": "₹1,800",
        "rating": 4.8,
        "imageUrl": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
        "posProvider": "square"
    },
    # Kothrud
    {
        "name": "Spice Garden Restaurant",
        "cuisine": "North Indian, Multicuisine, Tandoor",
        "location": "Kothrud, Pune",
        "address": "Rambaug Colony, Paud Road, Near MIT College, Kothrud, Pune 411038",
        "phone": "+91 20 2544 5566",
        "avgCostForTwo": "₹1,600",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Fish Curry Rice - Kothrud",
        "cuisine": "Konkani, Malvani, Seafood, Coastal Indian",
        "location": "Kothrud, Pune",
        "address": "Mayur Colony, Near Joggers Park, Kothrud, Pune 411038",
        "phone": "+91 20 2543 8899",
        "avgCostForTwo": "₹1,200",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    {
        "name": "Wow Momo - Kothrud",
        "cuisine": "Tibetan, Momos, Asian Street Food",
        "location": "Kothrud, Pune",
        "address": "Shop 33, Ground Floor, Karishma CHS, Ideal Colony, Kothrud, Pune 411038",
        "phone": "+91 98300 22334",
        "avgCostForTwo": "₹400",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=200&auto=format&fit=crop",
        "posProvider": "square"
    },
    # Koregaon Park
    {
        "name": "The Voyage - Koregaon Park",
        "cuisine": "Continental, Cafe, European",
        "location": "Koregaon Park, Pune",
        "address": "Lane No. 5, North Main Road, Koregaon Park, Pune 411001",
        "phone": "+91 98223 44556",
        "avgCostForTwo": "₹1,200",
        "rating": 4.5,
        "imageUrl": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop",
        "posProvider": "square"
    },
    {
        "name": "Koregaon Park Social",
        "cuisine": "North Indian, Continental, Cocktails, Bar",
        "location": "Koregaon Park, Pune",
        "address": "Unit 1, The Mills, Behind Sheraton Grand, Sangamvadi, Koregaon Park Annexe, Pune 411001",
        "phone": "+91 20 7196 6699",
        "avgCostForTwo": "₹1,600",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Kalyani Nagar
    {
        "name": "Kalyani Veg Restaurant",
        "cuisine": "Pure Veg, North Indian, South Indian, Chinese",
        "location": "Kalyani Nagar, Pune",
        "address": "Fortaleza Building, Central Avenue, Kalyani Nagar, Pune 411006",
        "phone": "+91 20 2665 4433",
        "avgCostForTwo": "₹700",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Viman Nagar
    {
        "name": "Copper Chimney - Viman Nagar",
        "cuisine": "North Indian, Mughlai, Biryani",
        "location": "Viman Nagar, Pune",
        "address": "Level 2, Phoenix Market City, Nagar Road, Viman Nagar, Pune 411014",
        "phone": "+91 20 6689 0088",
        "avgCostForTwo": "₹1,500",
        "rating": 4.5,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Chopsticks Spice Malabar Restaurant",
        "cuisine": "Kerala, South Indian, Seafood",
        "location": "Viman Nagar, Pune",
        "address": "Gulmohor Regency, Symbiosis College Road, Viman Nagar, Pune 411014",
        "phone": "+91 20 2663 3311",
        "avgCostForTwo": "₹950",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Kharadi
    {
        "name": "Chulbul Dhaba - Kharadi",
        "cuisine": "North Indian, Dhaba, Tandoor",
        "location": "Kharadi, Pune",
        "address": "Golden Plaza, EON Free Zone Road, Kharadi, Pune 411014",
        "phone": "+91 98224 88776",
        "avgCostForTwo": "₹1,050",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    {
        "name": "Shivshakti Pure Veg - Kharadi",
        "cuisine": "Pure Veg, Multicuisine, North Indian",
        "location": "Kharadi, Pune",
        "address": "Near Pride Icon Building, Thite Vasti, Kharadi, Pune 411014",
        "phone": "+91 20 2701 5566",
        "avgCostForTwo": "₹1,300",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Hadapsar / Magarpatta
    {
        "name": "Barbeque Nation - Amanora Mall",
        "cuisine": "North Indian, BBQ, Grills, Buffet",
        "location": "Hadapsar, Pune",
        "address": "3rd Floor, Amanora Mall, Mundhwa-Kharadi Bypass, Hadapsar, Pune 411028",
        "phone": "+91 20 6060 0000",
        "avgCostForTwo": "₹1,600",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Box8 - Hadapsar",
        "cuisine": "North Indian, Desi Meals, Wraps, Biryani",
        "location": "Hadapsar, Pune",
        "address": "Gandhar Galaxia, Mundhwa Kharadi Road, Hadapsar, Pune 411028",
        "phone": "+91 20 3355 2698",
        "avgCostForTwo": "₹550",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
        "posProvider": "square"
    },
    {
        "name": "PK Biryani House - Magarpatta",
        "cuisine": "Biryani, Maharashtrian Non-Veg, Tandoori",
        "location": "Hadapsar, Pune",
        "address": "Opposite Magarpatta City South Gate, Hadapsar, Pune 411028",
        "phone": "+91 97660 55888",
        "avgCostForTwo": "₹750",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    {
        "name": "Sidheshwar Foods - Hadapsar",
        "cuisine": "Maharashtrian, Non-Veg Thali, Mutton Sukka",
        "location": "Hadapsar, Pune",
        "address": "D P Road, Near PMT Bus Parking, Hadapsar, Pune 411028",
        "phone": "+91 98226 77112",
        "avgCostForTwo": "₹1,000",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    {
        "name": "Wish A Dish",
        "cuisine": "North Indian, Mughlai, Biryani",
        "location": "Hadapsar, Pune",
        "address": "Shop 26, Sasane Nagar, Hadapsar, Pune 411028",
        "phone": "+91 98220 99443",
        "avgCostForTwo": "₹600",
        "rating": 4.6,
        "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Camp
    {
        "name": "Sahare Dining Hall",
        "cuisine": "Pure Veg, South Indian, Thali",
        "location": "Camp, Pune",
        "address": "Sadhu Vaswani Road, Opposite Grand Post Office, Camp, Pune 411001",
        "phone": "+91 20 2612 3456",
        "avgCostForTwo": "₹450",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Rama Krishna Restaurant",
        "cuisine": "Pure Veg, North Indian, South Indian, Chinese",
        "location": "Camp, Pune",
        "address": "Moledina Road, Opposite Westend Theatre, Camp, Pune 411001",
        "phone": "+91 20 2613 3939",
        "avgCostForTwo": "₹900",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    {
        "name": "Cream Craver - Camp",
        "cuisine": "Pure Veg, South Indian, Pav Bhaji, Chaat",
        "location": "Camp, Pune",
        "address": "Bootee Street, Near Bund Garden, Camp, Pune 411001",
        "phone": "+91 20 2613 0088",
        "avgCostForTwo": "₹650",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
        "posProvider": "square"
    },
    # Deccan / FC Road / JM Road
    {
        "name": "JM Housefull Paratha",
        "cuisine": "North Indian, Punjabi Parathas, Lassi",
        "location": "Deccan Gymkhana, Pune",
        "address": "JM Road, Near Sambhaji Park, Deccan Gymkhana, Pune 411004",
        "phone": "+91 98220 77123",
        "avgCostForTwo": "₹500",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Tales & Spirits - Senapati Bapat Road",
        "cuisine": "Pure Veg, European, North Indian, Continental",
        "location": "Senapati Bapat Road, Pune",
        "address": "ICC Tower, Senapati Bapat Road, Pune 411016",
        "phone": "+91 20 6603 5500",
        "avgCostForTwo": "₹700",
        "rating": 4.5,
        "imageUrl": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Aware Maratha Khanawal",
        "cuisine": "Authentic Maharashtrian Non-Veg, Mutton Thali",
        "location": "Sadashiv Peth, Pune",
        "address": "Kumthekar Road, Sadashiv Peth, Pune 411030",
        "phone": "+91 20 2447 5599",
        "avgCostForTwo": "₹550",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Pashan
    {
        "name": "Rangla Punjab - Pashan",
        "cuisine": "North Indian, Punjabi Dhaba, Tandoori",
        "location": "Pashan, Pune",
        "address": "Pune-Mumbai Highway, Near Nissan & Audi Showroom, Pashan, Pune 411021",
        "phone": "+91 98220 33411",
        "avgCostForTwo": "₹450",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Bavdhan / Bhugaon
    {
        "name": "Planet 9 Bistro & Lounge",
        "cuisine": "North Indian, Continental, Finger Food, Bar",
        "location": "Bavdhan, Pune",
        "address": "Opposite Old Jakat Naka, Bavdhan Khurd, Bhugaon Road, Pune 411021",
        "phone": "+91 97640 44555",
        "avgCostForTwo": "₹2,600",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    {
        "name": "Cafe Co2 Resto Lounge",
        "cuisine": "North Indian, Continental, Lakeview Fine Dining",
        "location": "Bhugaon, Pune",
        "address": "Gat No. 336, Angrewadi, Manas Lake, Bhugaon, Pune 412115",
        "phone": "+91 98222 66880",
        "avgCostForTwo": "₹3,100",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Warje
    {
        "name": "Mystic Flavours",
        "cuisine": "North Indian, Multicuisine, Mughlai",
        "location": "Warje, Pune",
        "address": "Spandan Building, Bangalore-Mumbai Highway, Warje, Pune 411058",
        "phone": "+91 20 2523 9900",
        "avgCostForTwo": "₹1,050",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Bibwewadi
    {
        "name": "Nimantran Restaurant",
        "cuisine": "North Indian, Multicuisine, Chinese",
        "location": "Bibwewadi, Pune",
        "address": "Main Road, Near Pushpa Mangal Karyalaya, Bibwewadi, Pune 411037",
        "phone": "+91 20 2422 1100",
        "avgCostForTwo": "₹1,300",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Meghdoots Restaurant",
        "cuisine": "North Indian, Multicuisine, Punjabi",
        "location": "Bibwewadi, Pune",
        "address": "Gagan Samrudhi, Kondhwa-Bibwewadi Road, Pune 411037",
        "phone": "+91 20 2421 8833",
        "avgCostForTwo": "₹1,050",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Yerawada
    {
        "name": "Exotica - Yerawada",
        "cuisine": "North Indian, Oriental, Fine Dining, Rooftop",
        "location": "Yerawada, Pune",
        "address": "Panchshil Tech Park, Alandi Road, Yerawada, Pune 411006",
        "phone": "+91 20 6689 7777",
        "avgCostForTwo": "₹2,900",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Salunke Vihar / Wanowrie
    {
        "name": "Sufis Garden Restaurant",
        "cuisine": "North Indian, Multicuisine, Kebabs",
        "location": "Salunke Vihar, Pune",
        "address": "Amar Vihar, Salunke Vihar Road, Wanowrie, Pune 411040",
        "phone": "+91 20 2685 4422",
        "avgCostForTwo": "₹950",
        "rating": 4.0,
        "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Katraj
    {
        "name": "Hotel Shauryawada Family Restaurant",
        "cuisine": "North Indian, Maharashtrian Thali, Family Dining",
        "location": "Katraj, Pune",
        "address": "Katraj-Mantrawadi Bypass Road, Handewadi, Katraj, Pune 411046",
        "phone": "+91 98225 66778",
        "avgCostForTwo": "₹500",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    {
        "name": "Ghevar Thali - Katraj",
        "cuisine": "Authentic Rajasthani, Gujarati Royal Thali",
        "location": "Katraj, Pune",
        "address": "Panache Mall, Datta Nagar Road, Katraj, Pune 411046",
        "phone": "+91 99220 11445",
        "avgCostForTwo": "₹550",
        "rating": 4.9,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Karve Nagar
    {
        "name": "PK Biryani House - Karve Nagar",
        "cuisine": "Biryani, Tandoori, Maharashtrian Non-Veg",
        "location": "Karve Nagar, Pune",
        "address": "Shop No 13, Param Shopping Complex, D P Road, Karve Nagar, Pune 411052",
        "phone": "+91 98220 44991",
        "avgCostForTwo": "₹550",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    {
        "name": "Ratna Veg Cuisine",
        "cuisine": "Pure Veg, North Indian, South Indian",
        "location": "Karve Nagar, Pune",
        "address": "E Building, Kakade Plaza, Karve Road, Karve Nagar, Pune 411052",
        "phone": "+91 20 2545 8800",
        "avgCostForTwo": "₹1,050",
        "rating": 3.9,
        "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Rajgurunagar
    {
        "name": "Akash Misal House & Pure Veg",
        "cuisine": "Authentic Puneri Misal, Maharashtrian Snacks",
        "location": "Rajgurunagar, Pune",
        "address": "National Highway 50, Pune-Nashik Highway, Rajgurunagar, Pune 410505",
        "phone": "+91 98230 77889",
        "avgCostForTwo": "₹400",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Talegaon
    {
        "name": "Food Carnival - Talegaon",
        "cuisine": "Multicuisine, Fast Food, Highway Diner",
        "location": "Talegaon, Pune",
        "address": "Mumbai Pune Expressway, Urse Toll Plaza, Talegaon Dabhade, Pune 410506",
        "phone": "+91 2114 266 800",
        "avgCostForTwo": "₹500",
        "rating": 3.6,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Punawale
    {
        "name": "Blue Water Restaurant & Bar",
        "cuisine": "North Indian, Continental, Seafood, Bar",
        "location": "Punawale, PCMC",
        "address": "Aundh-Ravet BRT Road, Near Punawale Chowk, Punawale, PCMC, Pune 411033",
        "phone": "+91 20 6791 4400",
        "avgCostForTwo": "₹2,100",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Additional High-Profile Outlets in requested areas:
    # Undri
    {
        "name": "The Corinthian Resto & Bar - Undri",
        "cuisine": "Continental, Italian, North Indian, Fine Dining",
        "location": "Undri, Pune",
        "address": "The Corinthians Resort & Club, Nyati County, Undri, Pune 411060",
        "phone": "+91 20 2695 8888",
        "avgCostForTwo": "₹2,500",
        "rating": 4.5,
        "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    },
    # Dhanori
    {
        "name": "Flavours of Dhanori",
        "cuisine": "North Indian, Biryani, Mughlai",
        "location": "Dhanori, Pune",
        "address": "Old Jakat Naka, Near Kamal Lawns, Dhanori, Pune 411015",
        "phone": "+91 98221 44322",
        "avgCostForTwo": "₹700",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Vishrantwadi
    {
        "name": "Hotel Shreyas - Vishrantwadi",
        "cuisine": "Maharashtrian, North Indian, Pure Veg",
        "location": "Vishrantwadi, Pune",
        "address": "Tingre Nagar Road, Near Bharat Sawant Petrol Pump, Vishrantwadi, Pune 411015",
        "phone": "+91 20 2668 5544",
        "avgCostForTwo": "₹600",
        "rating": 4.1,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Narhe
    {
        "name": "Navami Pure Veg - Narhe",
        "cuisine": "Pure Veg, South Indian, North Indian",
        "location": "Narhe, Pune",
        "address": "Narhe Gaon Main Road, Near Zeal College, Narhe, Pune 411041",
        "phone": "+91 98223 88110",
        "avgCostForTwo": "₹550",
        "rating": 4.3,
        "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop",
        "posProvider": "universal_api"
    },
    # Dhayari
    {
        "name": "Hotel Maratha Samrat - Dhayari",
        "cuisine": "Maharashtrian Non-Veg, Mutton Thali, Seafood",
        "location": "Dhayari, Pune",
        "address": "Near Dhayari Phata, Sinhagad Road, Dhayari, Pune 411041",
        "phone": "+91 98220 11995",
        "avgCostForTwo": "₹1,100",
        "rating": 4.4,
        "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Nanded City
    {
        "name": "Destination Kitchen - Nanded City",
        "cuisine": "Multicuisine, Continental, North Indian",
        "location": "Nanded City, Pune",
        "address": "Destination Centre, Nanded City, Sinhagad Road, Pune 411041",
        "phone": "+91 20 6752 4433",
        "avgCostForTwo": "₹900",
        "rating": 4.2,
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop",
        "posProvider": "clover"
    },
    # Mundhwa
    {
        "name": "Effingut Brewhouse - Mundhwa",
        "cuisine": "Craft Beer, Continental, Bar Food, North Indian",
        "location": "Mundhwa, Pune",
        "address": "Mundhwa-Kharadi Road, Near ABC Farms, Mundhwa, Pune 411036",
        "phone": "+91 76200 33445",
        "avgCostForTwo": "₹2,200",
        "rating": 4.6,
        "imageUrl": "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&auto=format&fit=crop",
        "posProvider": "toast"
    }
]

# Filter out duplicates
to_add = []
for item in perplexity_data:
    norm_name = item['name'].strip().lower()
    matched = False
    for ex in existing_names:
        if ex.strip().lower() == norm_name:
            matched = True
            break
    if not matched:
        to_add.append(item)

print(f"Found {len(to_add)} new unique restaurants to add out of {len(perplexity_data)}.")

# Format as TypeScript
ts_entries = []
for entry in to_add:
    ts_entries.append(f"""  {{
    name: {json.dumps(entry['name'])},
    cuisine: {json.dumps(entry['cuisine'])},
    location: {json.dumps(entry['location'])},
    address: {json.dumps(entry['address'])},
    phone: {json.dumps(entry['phone'])},
    avgCostForTwo: {json.dumps(entry['avgCostForTwo'])},
    rating: {entry['rating']},
    imageUrl: {json.dumps(entry['imageUrl'])},
    posProvider: {json.dumps(entry['posProvider'])}
  }}""")

insert_code = ",\n" + ",\n".join(ts_entries)

# Find target location: right before `];\n\n/**\n * Fuzzy search function`
marker = "];\n\n/**\n * Fuzzy search function for autocomplete"
if marker in content:
    new_content = content.replace(marker, insert_code + "\n" + marker)
    with open('src/data/puneRestaurantDirectory.ts', 'w') as f:
        f.write(new_content)
    print(f"Successfully injected into src/data/puneRestaurantDirectory.ts!")
else:
    print(f"Marker not found! Let's check where `searchPuneRestaurants` starts.")
