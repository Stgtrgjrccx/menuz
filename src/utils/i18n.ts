export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  // Navigation & Header
  brandTagline: string;
  table: string;
  callWaiter: string;
  waiterCalled: string;
  aiSommelier: string;
  instagramStory: string;
  languageSelect: string;
  
  // Search & Filters
  searchPlaceholder: string;
  allCategories: string;
  filterAll: string;
  filterVeg: string;
  filterNonVeg: string;
  filterJain: string;
  filterVegan: string;
  filterSpicy: string;
  
  // Menu Item Cards
  add: string;
  added: string;
  customizable: string;
  spiciness: string;
  mild: string;
  medium: string;
  hot: string;
  bestseller: string;
  chefSpecial: string;
  
  // Cart Drawer
  yourTableCart: string;
  tableCartSyncActive: string;
  addedByGuest: string;
  chefsPairings: string;
  bundleDeal: string;
  specialInstructions: string;
  specialInstructionsPlaceholder: string;
  itemTotal: string;
  taxAndGst: string;
  grandTotal: string;
  sendToKitchen: string;
  cartEmpty: string;
  addDishesPrompt: string;
  
  // Status & Feedback
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  directKotSent: string;
  spinWheelPrompt: string;
  happyHourActive: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTagline: 'Interactive Dining Engine',
    table: 'Table',
    callWaiter: 'Call Captain',
    waiterCalled: 'Captain Notified!',
    aiSommelier: 'AI Sommelier',
    instagramStory: 'Instagram Story',
    languageSelect: 'Language',
    searchPlaceholder: 'Search truffle pasta, biryani, starters, cocktails...',
    allCategories: 'All Categories',
    filterAll: 'All',
    filterVeg: 'Veg Only',
    filterNonVeg: 'Non-Veg',
    filterJain: 'Jain Friendly',
    filterVegan: '100% Vegan',
    filterSpicy: 'Spicy 🔥',
    add: 'Add',
    added: 'In Cart',
    customizable: 'Customizable',
    spiciness: 'Spiciness',
    mild: 'Mild',
    medium: 'Medium',
    hot: 'Hot',
    bestseller: 'Bestseller',
    chefSpecial: "Chef's Pick",
    yourTableCart: 'Your Table Cart',
    tableCartSyncActive: 'Live Table Cart Sync Active',
    addedByGuest: 'Added by Table Guest',
    chefsPairings: "🧑‍🍳 Chef's Recommended Pairings",
    bundleDeal: 'Bundle Deal',
    specialInstructions: 'Special Cooking Notes',
    specialInstructionsPlaceholder: 'E.g., Less oil, extra lime, separate sauce...',
    itemTotal: 'Item Total',
    taxAndGst: 'Taxes & GST (5%)',
    grandTotal: 'Grand Total',
    sendToKitchen: 'Send Order to Kitchen',
    cartEmpty: 'Your Table Cart is Empty',
    addDishesPrompt: 'Explore the culinary menu above to add artisan dishes!',
    orderSuccessTitle: 'Order Fired to Kitchen!',
    orderSuccessDesc: 'Your meal is being freshly crafted by our kitchen brigade.',
    directKotSent: 'Direct KOT auto-dispatched to Kitchen Line',
    spinWheelPrompt: 'Review & Spin for Free Reward',
    happyHourActive: '⚡ Twilight Happy Hour: 20% Off Beverages & Small Bites!'
  },
  hi: {
    brandTagline: 'स्मार्ट इंटरएक्टिव डाइनिंग',
    table: 'टेबल',
    callWaiter: 'वेटर को बुलाएं',
    waiterCalled: 'कप्तान को सूचित किया गया!',
    aiSommelier: 'एआई शेफ गाइड',
    instagramStory: 'इंस्टाग्राम स्टोरी',
    languageSelect: 'भाषा',
    searchPlaceholder: 'व्यंजन, बिरयानी, पनीर, पेय पदार्थ खोजें...',
    allCategories: 'सभी श्रेणियां',
    filterAll: 'सभी',
    filterVeg: 'केवल शाकाहारी',
    filterNonVeg: 'मांसाहारी',
    filterJain: 'जैन अनुकूल',
    filterVegan: '100% वीगन',
    filterSpicy: 'मसालेदार 🔥',
    add: 'जोड़ें',
    added: 'कार्ट में',
    customizable: 'कस्टमाइज़ योग्य',
    spiciness: 'तीखापन',
    mild: 'कम तीखा',
    medium: 'मध्यम',
    hot: 'तेज तीखा',
    bestseller: 'सबसे लोकप्रिय',
    chefSpecial: 'शेफ की पसंद',
    yourTableCart: 'आपकी टेबल की थाली',
    tableCartSyncActive: 'लाइव टेबल कार्ट सिंक सक्रिय',
    addedByGuest: 'टेबल साथी द्वारा जोड़ा गया',
    chefsPairings: "🧑‍🍳 शेफ की अनुशंसित जोड़ियां",
    bundleDeal: 'विशेष छूट',
    specialInstructions: 'रसोई के लिए विशेष निर्देश',
    specialInstructionsPlaceholder: 'उदा. कम तेल, अतिरिक्त नींबू, अलग सॉस...',
    itemTotal: 'कुल व्यंजन मूल्य',
    taxAndGst: 'कर एवं जीएसटी (5%)',
    grandTotal: 'कुल देय राशि',
    sendToKitchen: 'रसोई में ऑर्डर भेजें',
    cartEmpty: 'आपकी कार्ट खाली है',
    addDishesPrompt: 'स्वादिष्ट व्यंजन जोड़ने के लिए मेनू देखें!',
    orderSuccessTitle: 'ऑर्डर रसोई में पहुंच गया!',
    orderSuccessDesc: 'शेफ द्वारा आपका भोजन ताजा तैयार किया जा रहा है।',
    directKotSent: 'सीधा KOT रसोई प्रिंटर पर भेज दिया गया है',
    spinWheelPrompt: 'रेटिंग दें और लकी व्हील घुमाएं',
    happyHourActive: '⚡ हैप्पी आवर: पेय और स्नैक्स पर 20% की विशेष छूट!'
  },
  mr: {
    brandTagline: 'स्मार्ट डिजिटल मेनू प्रणाली',
    table: 'टेबल',
    callWaiter: 'कॅप्टनला बोलवा',
    waiterCalled: 'कॅप्टनला कळवले आहे!',
    aiSommelier: 'एआय शेफ मार्गदर्शक',
    instagramStory: 'इन्स्टाग्राम स्टोरी',
    languageSelect: 'भाषा',
    searchPlaceholder: 'व्यंजन, बिर्याणी, स्टार्टर्स, पेये शोधा...',
    allCategories: 'सर्व वर्गवारी',
    filterAll: 'सर्व',
    filterVeg: 'शुद्ध शाकाहारी',
    filterNonVeg: 'मांसाहारी',
    filterJain: 'जैन सुसंगत',
    filterVegan: '100% व्हीगन',
    filterSpicy: 'झणझणीत 🔥',
    add: 'घ्या',
    added: 'कार्टमध्ये',
    customizable: 'बदल शक्य',
    spiciness: 'तिखटपणा',
    mild: 'कमी तिखट',
    medium: 'मध्यम',
    hot: 'झणझणीत',
    bestseller: 'सर्वाधिक पसंती',
    chefSpecial: 'शेफची खास निवड',
    yourTableCart: 'तुमची टेबल कार्ट',
    tableCartSyncActive: 'थेट टेबल कार्ट सिंक सुरू',
    addedByGuest: 'टेबल मित्राने जोडले',
    chefsPairings: "🧑‍🍳 शेफच्या शिफारस केलेल्या जोड्या",
    bundleDeal: 'खास कॉम्बो',
    specialInstructions: 'स्वयंपाकघरासाठी विशेष सूचना',
    specialInstructionsPlaceholder: 'उदा. कमी तेल, जास्तीचे लिंबू, कमी तिखट...',
    itemTotal: 'एकूण रक्कम',
    taxAndGst: 'कर आणि जीएसटी (5%)',
    grandTotal: 'एकूण देय रक्कम',
    sendToKitchen: 'ऑर्डर किचनमध्ये पाठवा',
    cartEmpty: 'तुमची कार्ट रिकामी आहे',
    addDishesPrompt: 'स्वादिष्ट पदार्थ जोडण्यासाठी मेनू तपासा!',
    orderSuccessTitle: 'ऑर्डर किचनमध्ये पाठवली गेली!',
    orderSuccessDesc: 'आमचे शेफ आपले जेवण प्रेमाने व ताजे तयार करत आहेत.',
    directKotSent: 'थेट KOT किचन लाईनकडे पाठवले गेले',
    spinWheelPrompt: 'रिव्ह्यू द्या आणि बक्षीस जिंका',
    happyHourActive: '⚡ हॅपी अवर: पेये आणि अल्पोपहारावर 20% विशेष सूट!'
  }
};

/**
 * Category translation helper for Hindi and Marathi
 */
export const CATEGORY_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {},
  hi: {
    'Starters': 'स्टार्टर्स एवं स्नैक्स',
    'Main Course': 'मुख्य भोजन (मेन कोर्स)',
    'Breads': 'रोटी एवं नान',
    'Rice & Biryani': 'चावल एवं बिरयानी',
    'Desserts': 'मीठा एवं मिष्ठान',
    'Beverages': 'पेय पदार्थ एवं मॉकटेल्स',
    'Pasta': 'पास्ता एवं इटैलियन',
    'Pizza': 'पिज्जा',
    'Sides': 'अन्य व्यंजन'
  },
  mr: {
    'Starters': 'स्टार्टर्स व अल्पोपहार',
    'Main Course': 'मुख्य जेवण (मेन कोर्स)',
    'Breads': 'रोटी व नान',
    'Rice & Biryani': 'भात आणि बिर्याणी',
    'Desserts': 'गोड पदार्थ व मिष्टान्न',
    'Beverages': 'पेये आणि सरबत',
    'Pasta': 'पास्ता',
    'Pizza': 'पिझ्झा',
    'Sides': 'इतर तोंडी लावणी'
  }
};

export function getCategoryTitle(originalName: string, lang: Language): string {
  if (lang === 'en') return originalName;
  const mapped = CATEGORY_TRANSLATIONS[lang]?.[originalName];
  if (mapped) return mapped;
  
  // Generic keyword match
  const lower = originalName.toLowerCase();
  if (lower.includes('starter') || lower.includes('appetizer')) {
    return lang === 'mr' ? 'स्टार्टर्स' : 'स्टार्टर्स';
  }
  if (lower.includes('main') || lower.includes('curry')) {
    return lang === 'mr' ? 'मुख्य भोजन' : 'मेन कोर्स';
  }
  if (lower.includes('dessert') || lower.includes('sweet')) {
    return lang === 'mr' ? 'गोड पदार्थ' : 'मिष्ठान';
  }
  if (lower.includes('drink') || lower.includes('beverage')) {
    return lang === 'mr' ? 'पेये' : 'पेय पदार्थ';
  }
  if (lower.includes('bread') || lower.includes('roti') || lower.includes('naan')) {
    return lang === 'mr' ? 'रोटी व नान' : 'रोटी एवं ब्रेड्स';
  }
  if (lower.includes('biryani') || lower.includes('rice')) {
    return lang === 'mr' ? 'बिर्याणी व भात' : 'बिरयानी एवं चावल';
  }
  return originalName;
}
