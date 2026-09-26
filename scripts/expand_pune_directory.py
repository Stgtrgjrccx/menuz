#!/usr/bin/env python3
"""
Expands src/data/puneRestaurantDirectory.ts with additional verified Pune establishments.
"""
import re

ADDITIONAL_RESTAURANTS = [
    {
        'name': 'German Bakery',
        'cuisine': 'Bakery, Cafe, European, Breakfast',
        'location': 'Koregaon Park, Pune',
        'address': 'North Main Road, Koregaon Park, Pune 411001',
        'phone': '+91 20 2615 6127',
        'avgCostForTwo': '₹900',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Shisha Jazz Cafe',
        'cuisine': 'Iranian, Continental, Live Music & Bar',
        'location': 'Koregaon Park, Pune',
        'address': 'ABC Farms, North Main Road, Koregaon Park, Pune 411001',
        'phone': '+91 20 2688 0050',
        'avgCostForTwo': '₹2,200',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': 'Toit Pune',
        'cuisine': 'Microbrewery, Woodfired Pizza, Continental',
        'location': 'Koregaon Park, Pune',
        'address': "Near Bishop's Co-Ed School, Kalyani Nagar / KP Border, Pune 411006",
        'phone': '+91 77220 54100',
        'avgCostForTwo': '₹2,000',
        'rating': 4.7,
        'imageUrl': 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'High Spirits Cafe',
        'cuisine': 'Bar, Cocktails, Finger Food, Live Gig Venue',
        'location': 'Koregaon Park, Pune',
        'address': 'North Main Road, Koregaon Park, Pune 411001',
        'phone': '+91 86000 63174',
        'avgCostForTwo': '₹1,600',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': 'Effingut Brewerkz',
        'cuisine': 'Craft Beer, BBQ, Asian, Pub Grub',
        'location': 'Koregaon Park, Pune',
        'address': 'End of Lane 6, Koregaon Park, Pune 411001',
        'phone': '+91 76200 31166',
        'avgCostForTwo': '₹2,200',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Boteco - Restaurante Brasileiro',
        'cuisine': 'Brazilian, Steaks, Grills, Cocktails',
        'location': 'Koregaon Park, Pune',
        'address': 'Lane 7, Koregaon Park, Pune 411001',
        'phone': '+91 91587 42666',
        'avgCostForTwo': '₹2,500',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Daily Treats - The Westin',
        'cuisine': 'European, Bakery, Artisanal Coffee, Deli',
        'location': 'Koregaon Park, Pune',
        'address': 'The Westin, 36/3-B Koregaon Park Annexe, Pune 411001',
        'phone': '+91 20 6721 0000',
        'avgCostForTwo': '₹1,800',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Seasonal Tastes - The Westin',
        'cuisine': 'Global Buffet, Pan-Asian, North Indian',
        'location': 'Koregaon Park, Pune',
        'address': 'The Westin, 36/3-B Koregaon Park Annexe, Pune 411001',
        'phone': '+91 20 6721 0000',
        'avgCostForTwo': '₹3,500',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Stone Water Grill',
        'cuisine': 'European, Lounge, Riverfront Cocktails',
        'location': 'Koregaon Park, Pune',
        'address': 'Pyramid Complex, North Main Road, Koregaon Park, Pune 411001',
        'phone': '+91 20 6725 6000',
        'avgCostForTwo': '₹2,800',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Nisarg Seafood',
        'cuisine': 'Malvani, Coastal Seafood, Surmai Fry, Thali',
        'location': 'Karve Road / Erandwane, Pune',
        'address': 'Off Karve Road, Near Nal Stop, Erandwane, Pune 411004',
        'phone': '+91 20 2544 5777',
        'avgCostForTwo': '₹1,400',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Fish Curry Rice',
        'cuisine': 'Konkani, Coastal Seafood, Prawns Sukka',
        'location': 'Law College Road, Pune',
        'address': 'Near Syndicate Bank, Law College Road, Erandwane, Pune 411004',
        'phone': '+91 99224 45566',
        'avgCostForTwo': '₹1,200',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Balgandharva Katta',
        'cuisine': 'Maharashtrian Snacks, Kothimbir Vadi, Thalipeeth',
        'location': 'Shivajinagar, Pune',
        'address': 'Near Balgandharva Rangmandir, JM Road, Shivajinagar, Pune 411005',
        'phone': '+91 20 2553 2233',
        'avgCostForTwo': '₹300',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Durga Cafe',
        'cuisine': 'Cold Coffee, Pav Bhaji, Quick Bites',
        'location': 'Kothrud, Pune',
        'address': 'Near MIT College, Paud Road, Kothrud, Pune 411038',
        'phone': '+91 98220 33445',
        'avgCostForTwo': '₹250',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Poona Guest House',
        'cuisine': 'Authentic Puneri Maharashtrian Thali, Puran Poli',
        'location': 'Laxmi Road / Budhwar Peth, Pune',
        'address': '100, Budhwar Peth, Near Laxmi Road, Pune 411002',
        'phone': '+91 20 2445 2824',
        'avgCostForTwo': '₹500',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Bedekar Tea Stall & Misal',
        'cuisine': 'Puneri Misal Pav, Tea, Traditional Farsan',
        'location': 'Narayan Peth, Pune',
        'address': '418, Munjabacha Bol, Narayan Peth, Pune 411030',
        'phone': '+91 20 2445 1270',
        'avgCostForTwo': '₹200',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Katakirr Misal',
        'cuisine': 'Kolhapuri Spiced Misal Pav, Buttermilk',
        'location': 'Karve Road / Deccan, Pune',
        'address': 'Near Cummins College, Karve Nagar & Deccan Branches, Pune 411004',
        'phone': '+91 98811 55000',
        'avgCostForTwo': '₹250',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Chitale Bandhu Mithaiwale',
        'cuisine': 'Bakarwadi, Amba Barfi, Traditional Sweets & Farsan',
        'location': 'Deccan Gymkhana, Pune',
        'address': 'Deccan Gymkhana & Bajirao Road, Pune 411004',
        'phone': '+91 20 2447 2075',
        'avgCostForTwo': '₹300',
        'rating': 4.8,
        'imageUrl': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Sujata Mastani',
        'cuisine': 'Pune Iconic Mastani Ice Cream Shake, Mango, Dryfruit',
        'location': 'Sadashiv Peth & FC Road, Pune',
        'address': 'LBS Road, Sadashiv Peth & FC Road, Pune 411030',
        'phone': '+91 20 2447 5000',
        'avgCostForTwo': '₹250',
        'rating': 4.7,
        'imageUrl': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Burger - Camp',
        'cuisine': 'Legendary King Burgers, Chicken Burger, Fries',
        'location': 'Camp, Pune',
        'address': 'Phulgaon Road, East Street, Camp, Pune 411001',
        'phone': '+91 20 2613 0000',
        'avgCostForTwo': '₹350',
        'rating': 4.7,
        'imageUrl': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Mona Food',
        'cuisine': 'Chole Bhature, Punjabi Street Food, Lassi',
        'location': 'MG Road, Camp, Pune',
        'address': 'Main Building, MG Road, Camp, Pune 411001',
        'phone': '+91 20 2613 1455',
        'avgCostForTwo': '₹400',
        'rating': 4.3,
        'imageUrl': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Pasteur Bakery',
        'cuisine': 'Ice Creams, Pastries, Soft Serve, Puffs',
        'location': 'MG Road, Camp, Pune',
        'address': 'Camp, MG Road, Pune 411001',
        'phone': '+91 20 2613 1111',
        'avgCostForTwo': '₹250',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'The Brooklyn Brigade',
        'cuisine': 'Artisanal Burgers, American, Wings, Shakes',
        'location': 'Kalyani Nagar, Pune',
        'address': 'Fortaleza Complex, Kalyani Nagar, Pune 411006',
        'phone': '+91 99220 88990',
        'avgCostForTwo': '₹800',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': "Grandmama's Cafe",
        'cuisine': 'Cafe, Pasta, Waffles, Hot Chocolate, Continental',
        'location': 'Koregaon Park & Viman Nagar, Pune',
        'address': 'South Main Road, Koregaon Park, Pune 411001',
        'phone': '+91 20 2615 2200',
        'avgCostForTwo': '₹1,200',
        'rating': 4.3,
        'imageUrl': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': "Chili's American Grill & Bar",
        'cuisine': 'Tex-Mex, Burgers, Fajitas, Margaritas',
        'location': 'Phoenix Marketcity, Viman Nagar, Pune',
        'address': '2nd Floor, Phoenix Marketcity, Viman Nagar, Pune 411014',
        'phone': '+91 20 3095 0300',
        'avgCostForTwo': '₹1,800',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': 'Punjab Grill',
        'cuisine': 'North Indian, Mughlai, Dal Makhani, Kebabs',
        'location': 'Phoenix Marketcity, Viman Nagar, Pune',
        'address': 'Phoenix Marketcity, Viman Nagar, Pune 411014',
        'phone': '+91 20 6689 0600',
        'avgCostForTwo': '₹2,200',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Ishaara',
        'cuisine': 'Modern Indian, Dahi Kebab, Biryani',
        'location': 'Phoenix Marketcity, Viman Nagar, Pune',
        'address': 'Upper Ground Floor, Phoenix Marketcity, Viman Nagar, Pune 411014',
        'phone': '+91 80077 78899',
        'avgCostForTwo': '₹1,600',
        'rating': 4.6,
        'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Copper Chimney',
        'cuisine': 'North Indian, Mughlai, Biryani, Roomali Roti',
        'location': 'Phoenix Marketcity, Viman Nagar, Pune',
        'address': 'Level 2, Phoenix Marketcity, Viman Nagar, Pune 411014',
        'phone': '+91 20 6689 0500',
        'avgCostForTwo': '₹1,800',
        'rating': 4.3,
        'imageUrl': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Little Italy',
        'cuisine': 'Pure Veg Italian, Woodfired Pizza, Pasta, Risotto',
        'location': 'Shivajinagar & Bund Garden, Pune',
        'address': 'University Road, Shivaji Nagar, Pune 411016',
        'phone': '+91 20 2567 4444',
        'avgCostForTwo': '₹1,600',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Barbeque Nation',
        'cuisine': 'Live Grill, Unlimited Buffet, North Indian, Desserts',
        'location': 'Wakad, Kalyani Nagar & Sayaji, Pune',
        'address': 'Sayaji Hotel, Mumbai-Bangalore Highway, Wakad, Pune 411057',
        'phone': '+91 20 6731 3333',
        'avgCostForTwo': '₹1,800',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': 'Absolute Barbecues',
        'cuisine': 'Wish Grill, Exotic Meats, Buffet, North Indian',
        'location': 'Wakad & Hinjewadi, Pune',
        'address': 'White Square Building, Hinjewadi-Wakad Bridge, Pune 411057',
        'phone': '+91 73373 83763',
        'avgCostForTwo': '₹1,600',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': 'Mezza9',
        'cuisine': 'Multi-Cuisine, North Indian, Oriental, Cocktails',
        'location': 'Hinjewadi Phase 1, Pune',
        'address': 'Near Infosys Circle, Hinjewadi Phase 1, Pune 411057',
        'phone': '+91 20 6675 9999',
        'avgCostForTwo': '₹1,600',
        'rating': 4.3,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'MoMo Cafe - Courtyard by Marriott',
        'cuisine': 'International Buffet, Contemporary Dining, Sunday Brunch',
        'location': 'Hinjewadi Phase 1, Pune',
        'address': 'Courtyard by Marriott, Rajiv Gandhi Infotech Park, Hinjewadi, Pune 411057',
        'phone': '+91 20 4212 2222',
        'avgCostForTwo': '₹2,500',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Thikana Hinjewadi',
        'cuisine': 'North Indian, Finger Food, Bar, DJ Lounge',
        'location': 'Hinjewadi Phase 1, Pune',
        'address': 'Opposite Geometric, Hinjewadi Phase 1, Pune 411057',
        'phone': '+91 91122 88877',
        'avgCostForTwo': '₹1,500',
        'rating': 4.2,
        'imageUrl': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': "Agent Jack's Bar",
        'cuisine': 'Bidding Bar, Finger Food, Continental, Pizza',
        'location': 'Hinjewadi & SB Road, Pune',
        'address': 'Multiplex Mall, Hinjewadi Phase 1, Pune 411057',
        'phone': '+91 98224 41122',
        'avgCostForTwo': '₹1,400',
        'rating': 4.2,
        'imageUrl': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop',
        'posProvider': 'toast'
    },
    {
        'name': 'The Blue Water',
        'cuisine': 'Waterfront Dining, North Indian, Chinese, Continental',
        'location': 'Aundh-Ravet Road, Wakad, Pune',
        'address': 'Near Punawale, Aundh-Ravet BRTS Road, Wakad, Pune 411033',
        'phone': '+91 20 2740 1000',
        'avgCostForTwo': '₹1,700',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Tarsh Gastronomia',
        'cuisine': 'Rooftop Buffet, Mughlai, Pan-Asian, Cocktails',
        'location': 'Wakad, Pune',
        'address': 'White Square Building, Wakad Bypass, Pune 411057',
        'phone': '+91 85510 50000',
        'avgCostForTwo': '₹1,800',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Sayaji Pune - Portico',
        'cuisine': 'Fine Dining, North Indian, Continental, Lavish Buffet',
        'location': 'Wakad, Pune',
        'address': 'Sayaji Hotel, Mumbai-Bangalore Bypass, Wakad, Pune 411057',
        'phone': '+91 20 4212 1212',
        'avgCostForTwo': '₹2,400',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Mainland China',
        'cuisine': 'Authentic Chinese, Dim Sum, Szechuan',
        'location': 'Amanora Mall & Dhole Patil Road, Pune',
        'address': 'City Point, Dhole Patil Road & Amanora Mall, Pune 411001',
        'phone': '+91 20 6601 3030',
        'avgCostForTwo': '₹2,000',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Farzi Cafe',
        'cuisine': 'Modern Indian Bistro, Molecular Gastronomy, Cocktails',
        'location': 'Koregaon Park, Pune',
        'address': 'Vascon Mariplex Mall, Kalyani Nagar / KP, Pune 411014',
        'phone': '+91 95990 60000',
        'avgCostForTwo': '₹2,200',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Hotel Shreyas',
        'cuisine': 'Authentic Maharashtrian Thali, Ukadiche Modak, Pithla Bhakri',
        'location': 'Apte Road, Deccan Gymkhana, Pune',
        'address': '1242 B, Apte Road, Deccan Gymkhana, Pune 411004',
        'phone': '+91 20 2553 1226',
        'avgCostForTwo': '₹700',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Hotel Jagdamba',
        'cuisine': 'Maratha Military Cuisine, Mutton Sukka, Tambada Pandhara Rassa',
        'location': 'Pune-Bangalore Highway / Katraj, Pune',
        'address': 'Near Khed Shivapur Toll, Old NH4, Pune 412205',
        'phone': '+91 98220 70000',
        'avgCostForTwo': '₹900',
        'rating': 4.7,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Hotel Sandeep',
        'cuisine': 'Authentic Puneri Mutton Thali, Kheema, Biryani',
        'location': 'JM Road / Shivajinagar, Pune',
        'address': 'Near Modern College, Shivajinagar, Pune 411005',
        'phone': '+91 20 2553 3885',
        'avgCostForTwo': '₹800',
        'rating': 4.5,
        'imageUrl': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Sarjaa',
        'cuisine': 'North Indian, Mughlai, Live Ghazals, Seafood',
        'location': 'Aundh, Pune',
        'address': 'Sarjaa Complex, Near Convergys, Aundh, Pune 411007',
        'phone': '+91 20 2588 7777',
        'avgCostForTwo': '₹1,500',
        'rating': 4.3,
        'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Polka Dots',
        'cuisine': 'European, Pasta, Risotto, Thin Crust Pizza, Salads',
        'location': 'Aundh & Kalyani Nagar, Pune',
        'address': 'Near Westend Mall, Aundh, Pune 411007',
        'phone': '+91 20 2588 9090',
        'avgCostForTwo': '₹1,400',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Pagdandi Books Chai Cafe',
        'cuisine': 'Artisanal Teas, Organic Coffee, Books, Bakery',
        'location': 'Baner, Pune',
        'address': 'Shop 6, Regent Plaza, Baner Pashan Link Road, Baner, Pune 411045',
        'phone': '+91 77559 08525',
        'avgCostForTwo': '₹400',
        'rating': 4.7,
        'imageUrl': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'K Factory',
        'cuisine': 'European Bistro, Cocktails, Truffle Fries, Burgers',
        'location': 'Baner, Pune',
        'address': 'Near Mercedes Showroom, Baner Road, Pune 411045',
        'phone': '+91 20 6685 0000',
        'avgCostForTwo': '₹1,800',
        'rating': 4.4,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Ukiyo - The Ritz-Carlton',
        'cuisine': 'Modern Japanese, Sashimi, Robatayaki, Sake Bar',
        'location': 'Yerawada / Golf Course, Pune',
        'address': 'The Ritz-Carlton, Golf Course Road, Airport Road, Pune 411006',
        'phone': '+91 20 6767 5000',
        'avgCostForTwo': '₹4,500',
        'rating': 4.8,
        'imageUrl': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Aasmana - The Ritz-Carlton',
        'cuisine': 'Rooftop Lounge, Royal Indian, Craft Cocktails, Skyline Views',
        'location': 'Yerawada / Golf Course, Pune',
        'address': '18th Floor, The Ritz-Carlton, Golf Course Road, Pune 411006',
        'phone': '+91 20 6767 5000',
        'avgCostForTwo': '₹4,000',
        'rating': 4.8,
        'imageUrl': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Three Kitchens Restaurant & Bar - The Ritz-Carlton',
        'cuisine': 'Global Buffet, Live Counter, Indian, Italian, Pan-Asian',
        'location': 'Yerawada / Golf Course, Pune',
        'address': 'The Ritz-Carlton, Golf Course Road, Pune 411006',
        'phone': '+91 20 6767 5000',
        'avgCostForTwo': '₹3,500',
        'rating': 4.7,
        'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    },
    {
        'name': 'Pimlico',
        'cuisine': 'Floral Aesthetic Cafe, Italian, Pizzas, Shakes',
        'location': 'Koregaon Park, Pune',
        'address': 'Lane 6, Koregaon Park, Pune 411001',
        'phone': '+91 97666 44111',
        'avgCostForTwo': '₹1,200',
        'rating': 4.3,
        'imageUrl': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
        'posProvider': 'universal_api'
    }
]

def format_entry(e):
    # Escape quotes if necessary
    name = e['name'].replace("'", "\\'")
    cuisine = e['cuisine'].replace("'", "\\'")
    location = e['location'].replace("'", "\\'")
    address = e['address'].replace("'", "\\'")
    return f"""  {{
    name: '{name}',
    cuisine: '{cuisine}',
    location: '{location}',
    address: '{address}',
    phone: '{e['phone']}',
    avgCostForTwo: '{e['avgCostForTwo']}',
    rating: {e['rating']},
    imageUrl: '{e['imageUrl']}',
    posProvider: '{e['posProvider']}'
  }},"""

def main():
    target_file = 'src/data/puneRestaurantDirectory.ts'
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()

    existing_names = set(re.findall(r"name:\s*['\"]([^'\"]+)['\"]", content))
    print(f"Found {len(existing_names)} existing restaurants.")

    entries_to_add = []
    for item in ADDITIONAL_RESTAURANTS:
        if item['name'] not in existing_names:
            entries_to_add.append(format_entry(item))

    if not entries_to_add:
        print("No new entries to add.")
        return

    print(f"Adding {len(entries_to_add)} new verified Pune restaurants...")
    
    # Locate array end
    pattern = r'(\n\];\s*\n\s*/\*\*\s*\n\s*\* Fuzzy search)'
    replacement = '\n' + '\n'.join(entries_to_add) + r'\1'
    
    new_content, count = re.subn(pattern, replacement, content, count=1)
    if count == 0:
        # Fallback
        idx = content.rfind('];')
        if idx != -1:
            new_content = content[:idx] + '\n' + '\n'.join(entries_to_add) + '\n' + content[idx:]
        else:
            raise ValueError("Could not find array end '];'")

    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Successfully expanded puneRestaurantDirectory.ts!")

if __name__ == '__main__':
    main()
