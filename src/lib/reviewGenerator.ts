/**
 * RevMe AI Review Generator Engine
 * Generates human, authentic, 5-star Google review drafts for diners to copy & post with 1 tap.
 * Supports tone switching (Enthusiastic, Concise, Foodie/Detailed) and instant regeneration.
 */

export interface ReviewDraftParams {
  businessName: string;
  cuisine?: string;
  rating?: number;
  selectedTags?: string[];
  customNotes?: string;
  tone?: 'enthusiastic' | 'concise' | 'detailed';
  variationIndex?: number;
}

export const RESTAURANT_QUICK_TAGS: Record<string, string[]> = {
  indian: [
    'Dal Makhani was heavenly 🍲',
    'Truffle Potli Samosa 🥟',
    'Melt-in-mouth Galouti Kebab 🍖',
    'Attentive & warm staff 😊',
    'Royal luxury ambiance ✨',
    'Fast & seamless QR ordering ⚡',
    'Authentic heritage flavors 🌶️',
    'Must visit in Pune! 📍',
    'Will definitely return 🔁'
  ],
  italian: [
    'Crispy woodfired pizza 🍕',
    'Creamy Burrata & Pomodoro 🧀',
    'Handmade pasta cooked al dente 🍝',
    'Classic Tiramisu was divine 🍮',
    'Cozy authentic Italian vibe 🕯️',
    'Super friendly team 😊',
    'Lightning fast table service ⚡',
    'Top spot in Koregaon Park 📍',
    'Will definitely return 🔁'
  ],
  default: [
    'Outstanding food quality 🍽️',
    'Warm and attentive team 😊',
    'Stunning dining ambiance ✨',
    'Fast digital table ordering ⚡',
    'Great value & portions 💰',
    'Perfect for dining out 🎉',
    '10/10 culinary experience ⭐',
    'Will definitely return 🔁'
  ]
};

export function getQuickTagsForRestaurant(cuisine?: string): string[] {
  const c = (cuisine || '').toLowerCase();
  if (c.includes('indian') || c.includes('punjabi') || c.includes('mughlai') || c.includes('tandoor')) {
    return RESTAURANT_QUICK_TAGS.indian;
  }
  if (c.includes('italian') || c.includes('pizza') || c.includes('pasta') || c.includes('trattoria')) {
    return RESTAURANT_QUICK_TAGS.italian;
  }
  return RESTAURANT_QUICK_TAGS.default;
}

export function generateConsumerReviewDraft({
  businessName,
  cuisine = 'contemporary dining',
  rating = 5,
  selectedTags = [],
  customNotes = '',
  tone = 'enthusiastic',
  variationIndex = 0
}: ReviewDraftParams): string {
  const cleanTags = selectedTags
    .map((t) => t.replace(/[^\w\s&]/gi, '').trim())
    .filter(Boolean);

  const highlights = cleanTags.length > 0 ? cleanTags.join(', ') : 'the remarkable culinary flavors and prompt hospitality';
  const customNoteClean = customNotes.trim();

  // Tone: Concise
  if (tone === 'concise') {
    const conciseTemplates = [
      `Had a fantastic dining experience at ${businessName}. Loved ${highlights.toLowerCase()}${customNoteClean ? ` (${customNoteClean})` : ''}. Fast service and great vibes — 5 stars all the way!`,
      `Superb visit to ${businessName}! The ${highlights.toLowerCase()} was spot on${customNoteClean ? ` — ${customNoteClean}` : ''}. Clean, welcoming, and quick. Highly recommend!`,
      `Outstanding dinner at ${businessName} in Pune. Really appreciated ${highlights.toLowerCase()}. We will definitely be coming back soon! ⭐⭐⭐⭐⭐`
    ];
    return conciseTemplates[variationIndex % conciseTemplates.length];
  }

  // Tone: Foodie / Detailed
  if (tone === 'detailed') {
    const detailedTemplates = [
      `Visited ${businessName} tonight and was blown away by the attention to culinary detail. Highlight of the meal was definitely ${highlights.toLowerCase()}${customNoteClean ? ` — ${customNoteClean}` : ''}. The seamless digital table ordering and warm hospitality made our evening special. Easily one of Pune’s finest dining gems!`,
      `If you appreciate authentic ${cuisine}, ${businessName} is a must-visit. From the moment we sat down, service was courteous and swift. Everything from ${highlights.toLowerCase()} was prepared to perfection${customNoteClean ? `. ${customNoteClean}` : ''}. Exceptional craftsmanship in every bite!`,
      `An unforgettable dining affair at ${businessName}! The textures and rich flavors were executed brilliantly, especially ${highlights.toLowerCase()}${customNoteClean ? ` (${customNoteClean})` : ''}. The staff took such great care of our table. Deserves every bit of a 5-star rating!`
    ];
    return detailedTemplates[variationIndex % detailedTemplates.length];
  }

  // Tone: Enthusiastic (Default)
  const enthusiasticTemplates = [
    `Had an incredible 5-star experience at ${businessName}! ${highlights} was absolutely sensational${customNoteClean ? ` — ${customNoteClean}` : ''}. The ambiance is gorgeous and the staff made us feel right at home. 10/10 recommend to anyone visiting! ⭐⭐⭐⭐⭐`,
    `Hands down one of the best meals we've had in Pune! Everything about ${businessName} exceeded expectations, especially ${highlights.toLowerCase()}${customNoteClean ? ` (${customNoteClean})` : ''}. Super fast digital ordering right at the table. Will definitely be returning soon! 🔥✨`,
    `What a gem! Visited ${businessName} and couldn't be happier with our meal. Loved ${highlights.toLowerCase()}${customNoteClean ? ` — ${customNoteClean}` : ''}. Friendly faces, wonderful energy, and mouth-watering food. Solid 5 stars! ⭐⭐⭐⭐⭐`
  ];
  return enthusiasticTemplates[variationIndex % enthusiasticTemplates.length];
}
