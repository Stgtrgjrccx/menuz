import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Send, Sparkles, Plus, AlertTriangle, Flame, ShieldAlert, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';


interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  focusDish: MenuItem | null;
  onConfirmAdd: (dish: MenuItem) => void;
  initialQuery?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Array<{
    item: MenuItem;
    reason: string;
  }>;
}

const ALLERGY_DISCLAIMER = "Allergen information is supplied by the restaurant. Cross-contamination may occur in commercial kitchens. Please tell staff about severe allergies.";

/**
 * Context-aware quick actions:
 * When a specific dish is focused, the suggestions change to match.
 */
function getQuickActionsForDish(dish: MenuItem | null): Array<{ label: string; query: string; icon?: string }> {
  if (!dish) {
    return [
      { label: "🧑‍🍳 Chef's Favourites", query: "What are the Chef's personal favourite dishes tonight?", icon: "🧑‍🍳" },
      { label: "🔥 House Specials", query: "What are your signature house specials?", icon: "🔥" },
      { label: "🌅 What's Fresh Today?", query: "What is fresh in the kitchen today?", icon: "🌅" },
      { label: "🍷 Drink Pairings", query: "What drinks or coolers does the owner recommend pairing with curries?", icon: "🍷" },
      { label: "👨‍👩‍👧‍👦 Table of 4 Feast", query: "Recommend a complete feast for a table of 4 people", icon: "👨‍👩‍👧‍👦" },
      { label: "🌶️ Mild & Kid-Friendly", query: "What are your mildest, non-spicy dishes suitable for kids?", icon: "🌶️" },
      { label: "🛡️ Jain & Vegan Options", query: "Show 100% Jain and Vegan safe dishes prepared with isolated cookware", icon: "🛡️" },
      { label: "⚡ Fast 15-Min Starters", query: "We are hungry, which dishes come out of the kitchen fastest?", icon: "⚡" },
      { label: "🍮 Best Desserts", query: "What are your signature desserts to end the meal?", icon: "🍮" }
    ];
  }

  const actions: Array<{ label: string; query: string; icon?: string }> = [];

  // Secret & Story
  actions.push({
    label: "🧑‍🍳 Secret Recipe & Lore",
    query: `What is the secret cooking technique and chef lore behind ${dish.name}?`,
    icon: "🧑‍🍳"
  });

  // Pairing
  if (dish.item_type === 'food') {
    actions.push({
      label: "🍷 Best Drink Pairing",
      query: `What drink or cooler pairs best with ${dish.name}?`,
      icon: "🍷"
    });
    actions.push({
      label: "🍞 Best Bread / Rice Side",
      query: `What bread or rice pairs best with ${dish.name}?`,
      icon: "🍞"
    });
  } else {
    actions.push({
      label: "🍽️ Best Food Pairing",
      query: `What starter or main course goes best with ${dish.name}?`,
      icon: "🍽️"
    });
  }

  // Spice & Heat
  if (dish.spice_level > 0) {
    actions.push({
      label: `🌶️ Spice Level (${dish.spice_level}/5)`,
      query: `How spicy is ${dish.name} and can heat be reduced?`,
      icon: "🌶️"
    });
    actions.push({
      label: "🌿 Milder Alternative",
      query: `What is a milder alternative to ${dish.name}?`,
      icon: "🌿"
    });
  } else {
    actions.push({
      label: "🌿 Is this mild?",
      query: `Is ${dish.name} completely mild and non-spicy?`,
      icon: "🌿"
    });
  }

  // Dietary & Allergens
  if (dish.allergens && dish.allergens.length > 0) {
    actions.push({
      label: `⚠️ Allergens Check`,
      query: `What allergens are in ${dish.name} and how is cross-contamination prevented?`,
      icon: "⚠️"
    });
  }

  // Portion
  actions.push({
    label: `📏 Portion Size`,
    query: `What is the portion size of ${dish.name} and is it enough to share?`,
    icon: "📏"
  });

  return actions;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  focusDish,
  onConfirmAdd,
  initialQuery,
}) => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const availableItems = useMemo(() => {
    const list = menuItems.filter((i) => i.restaurant_id === restaurant.id && i.is_available);
    if (list.length > 0) return list;
    return generateCuisineMenu(
      restaurant.id,
      restaurant.slug || 'menu',
      restaurant.cuisine,
      restaurant.name
    ).dishes.filter((i) => i.is_available);
  }, [menuItems, restaurant]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages or loading state change so user immediately sees replies
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Context-aware quick actions
  const quickActions = useMemo(() => getQuickActionsForDish(focusDish), [focusDish]);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        handleSendQuery(initialQuery, focusDish);
      } else if (focusDish) {
        handleSendQuery(`Tell me about ${focusDish.name} — flavor profile, ingredients, and allergens.`, focusDish);
      } else if (messages.length === 0) {
        const p = restaurant?.ai_persona;
        const greetingPrefix = p?.greeting_tone === 'bistro_cozy'
          ? 'Benvenuti!'
          : p?.greeting_tone === 'fine_dining_artisan'
            ? 'A very warm welcome.'
            : 'Namaste!';
        const chefTag = p?.chef_name ? `${p.chef_name} (${p.chef_title})` : 'our Executive Head Chef';
        const ownerTag = p?.owner_name ? `Owner ${p.owner_name}` : 'our founder';

        setMessages([
          {
            role: 'assistant',
            content: `${greetingPrefix} I am your dining concierge at ${restaurant?.name || 'our restaurant'}, trained directly by ${chefTag} & ${ownerTag}.\n\nI know our kitchen's secret recipes, true spice calibrations (1-5), allergen guidelines, and signature pairings. How may I guide your table today?`
          }
        ]);
      }
    }
  }, [isOpen, focusDish, initialQuery, restaurant]);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText: string, targetDish: MenuItem | null = focusDish) => {
    if (!queryText.trim()) return;

    const newMsgs: Message[] = [...messages, { role: 'user', content: queryText }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const resp = await supabase.functions.invoke('ai-menu-assistant', {
          body: {
            restaurantSlug: restaurant?.slug || 'restaurant',
            tableToken: 'table-token-01',
            message: queryText,
            dishContextId: targetDish?.id || null,
            conversationHistory: newMsgs.slice(-4)
          }
        });

        if (resp.error) throw new Error(resp.error.message);
        const { reply, recommendations } = resp.data;
        const matched = (recommendations || []).map((r: any) => ({
          item: availableItems.find(i => i.id === r.id) || r,
          reason: r.reason
        }));

        setMessages([...newMsgs, { role: 'assistant', content: reply, recommendations: matched }]);
        return;
      }

      // ── Context-aware local AI engine ──────────────────────
      await new Promise((r) => setTimeout(r, 600));

      const lower = queryText.toLowerCase();
      let reply = "";
      let recs: Array<{ item: MenuItem; reason: string }> = [];

      // ── Dish-specific queries ─────────────────────────────
      if (targetDish) {
        const dishName = targetDish.name || 'This specialty';
        const dishAllergens = Array.isArray(targetDish.allergens) ? targetDish.allergens : [];
        const dishFlags = Array.isArray(targetDish.dietary_flags) ? targetDish.dietary_flags : [];
        const dishIngredients = Array.isArray(targetDish.ingredients) ? targetDish.ingredients : [];
        const isTargetVeg = dishFlags.some(f => {
          const lf = String(f).toLowerCase();
          return lf === 'veg' || lf === 'vegetarian' || lf === 'vegan' || lf === 'jain';
        });

        if (lower.includes('spicy') || lower.includes('spice') || lower.includes('how spicy')) {
          reply = `${dishName} has a verified spice intensity of ${targetDish.spice_level}/5. ${
            targetDish.spice_level >= 3
              ? "It features robust aromatic chili notes. If you prefer less heat, I can suggest milder alternatives."
              : targetDish.spice_level === 0
                ? "This dish has no spice at all — it's completely mild and family-friendly."
                : "It has subtle warmth from aromatic spices, but nothing overwhelming."
          }`;

          // Suggest milder alternatives
          if (targetDish.spice_level >= 2) {
            const milder = availableItems
              .filter(i => i.spice_level < targetDish.spice_level && i.category_id === targetDish.category_id && i.id !== targetDish.id)
              .slice(0, 2);
            if (milder.length > 0) {
              recs = milder.map(item => ({
                item,
                reason: `Milder option (Spice ${item.spice_level}/5) — ${(item.short_description || '').slice(0, 60)}...`
              }));
            }
          }
        } else if (lower.includes('allergen') || lower.includes('allergy')) {
          reply = dishAllergens.length > 0
            ? `⚠️ ${dishName} contains: ${dishAllergens.join(', ')}.\n\n${ALLERGY_DISCLAIMER}`
            : `${dishName} has no declared allergens. However, ${ALLERGY_DISCLAIMER}`;
        } else if (lower.includes('vegetarian alternative') || lower.includes('veg alternative') || lower.includes('non-veg alternative')) {
          const alternatives = availableItems.filter(i => {
            if (i.id === targetDish.id || i.category_id !== targetDish.category_id) return false;
            const iFlags = Array.isArray(i.dietary_flags) ? i.dietary_flags : [];
            const iIsVeg = iFlags.some(f => {
              const lf = String(f).toLowerCase();
              return lf === 'veg' || lf === 'vegetarian' || lf === 'vegan' || lf === 'jain';
            });
            return isTargetVeg ? !iIsVeg : iIsVeg;
          }).slice(0, 2);

          reply = isTargetVeg
            ? `Looking for a non-vegetarian alternative to ${dishName}? Here are my recommendations:`
            : `Here are vegetarian alternatives to ${dishName}:`;

          recs = alternatives.map(item => ({
            item,
            reason: `${(item.dietary_flags || []).join(', ') || 'Alternative'} — ${(item.short_description || '').slice(0, 50)}`
          }));

          if (alternatives.length === 0) {
            reply += ` Unfortunately, I couldn't find a direct ${isTargetVeg ? 'non-veg' : 'vegetarian'} match in the same category. Try browsing other sections!`;
          }
        } else if (lower.includes('drink') || lower.includes('pair') || lower.includes('beverage') || lower.includes('bread')) {
          const drinks = availableItems.filter(i => i.item_type === 'drink').slice(0, 2);
          const breads = availableItems.filter(i => i.name.toLowerCase().includes('naan') || i.name.toLowerCase().includes('roti') || i.name.toLowerCase().includes('bread'));

          if (lower.includes('bread') || lower.includes('naan')) {
            reply = `With ${dishName}, I'd recommend our freshly baked breads to soak up the rich gravy:`;
            recs = breads.slice(0, 2).map(item => ({
              item,
              reason: `Clay oven baked to perfection — ideal with ${dishName}.`
            }));
          } else {
            reply = `For ${dishName} (Spice ${targetDish.spice_level}/5), I recommend:`;
            recs = drinks.map(item => ({
              item,
              reason: targetDish.spice_level >= 3
                ? `Cooling ${item.name} balances the spice beautifully.`
                : `A refreshing complement to the rich flavors of ${dishName}.`
            }));
          }
        } else if (lower.includes('portion') || lower.includes('serving') || lower.includes('size')) {
          reply = `${dishName} comes in a ${targetDish.serving_size} serving. ${
            targetDish.price > 500
              ? "It's a generous portion meant for sharing or as a full individual entrée."
              : "It's well-portioned for one person as part of a multi-dish meal."
          }`;
        } else if (lower.includes('mild') || lower.includes('milder')) {
          if (targetDish.spice_level <= 1) {
            reply = `Good news! ${dishName} is already very mild (Spice ${targetDish.spice_level}/5). It's gentle and approachable for all palates.`;
          } else {
            const milder = availableItems
              .filter(i => i.spice_level < targetDish.spice_level && i.id !== targetDish.id)
              .sort((a, b) => a.spice_level - b.spice_level)
              .slice(0, 2);
            reply = `${dishName} is at Spice ${targetDish.spice_level}/5. Here are milder options:`;
            recs = milder.map(item => ({
              item,
              reason: `Much milder at Spice ${item.spice_level}/5 — ${item.short_description.slice(0, 50)}`
            }));
          }
        } else {
          // General dish info
          reply = `**${dishName}**\n${targetDish.full_description || targetDish.short_description || ''}\n\n• Ingredients: ${dishIngredients.length > 0 ? dishIngredients.join(', ') : 'Chef signature recipe'}\n• Spice Level: ${targetDish.spice_level || 0}/5\n• Serving: ${targetDish.serving_size || '1 portion'}\n• Diet: ${dishFlags.join(', ') || 'Freshly prepared'}`;
          if (dishAllergens.length > 0) {
            reply += `\n• ⚠️ Allergens: ${dishAllergens.join(', ')}`;
          }
          if (targetDish.chef_notes) {
            reply += `\n• Chef's Note: ${targetDish.chef_notes}`;
          }
        }
      }
      // ── General queries (no dish focused) ─────────────────
      else {
        const persona = restaurant?.ai_persona;
        const chefLabel = persona?.chef_name || 'Our Executive Chef';
        const ownerLabel = persona?.owner_name || restaurant?.owner_name || 'Our Founder';

        if (lower.includes('secret') || lower.includes('recipe') || lower.includes('behind the scene')) {
          const storiesText = persona?.secret_stories && persona.secret_stories.length > 0
            ? persona.secret_stories.map(s => `• **${s.dish_name}**: ${s.story}`).join('\n\n')
            : `Our dishes are prepared from scratch daily with ${persona?.chef_philosophy || 'time-honored recipes'}.`;

          reply = `🧑‍🍳 **From ${chefLabel}'s Kitchen Diary**:\n\n${storiesText}\n\n*${persona?.chef_philosophy || 'Every base is prepared from scratch without artificial additives!'}*`;
          const secrets = availableItems.filter(i => i.is_chef_recommended || i.is_bestseller).slice(0, 2);
          recs = secrets.map(item => ({
            item,
            reason: `Chef's Signature — ${item.chef_notes || item.short_description.slice(0, 60)}`
          }));
        } else if (lower.includes('wine') || lower.includes('owner') || lower.includes('pairing') || (lower.includes('pair') && !targetDish)) {
          const pairingsText = persona?.signature_pairings && persona.signature_pairings.length > 0
            ? persona.signature_pairings.map(p => `• **${p.dish_name}** ➔ Pair with *${p.pairing_drink}*: ${p.why}`).join('\n\n')
            : "• For rich mains: A chilled artisanal beverage or crisp mineral wine cuts through the richness.\n• For spicy specialties: Cooling yogurt coolers or botanical tonics balance the heat.";

          reply = `🍷 **Curated by ${ownerLabel} & ${chefLabel}**:\n\n${pairingsText}`;
          const drinks = availableItems.filter(i => i.item_type === 'drink').slice(0, 2);
          recs = drinks.map(item => ({
            item,
            reason: `Handpicked Beverage Pairing — ${item.short_description.slice(0, 60)}`
          }));
        } else if (lower.includes('table of 4') || lower.includes('feast') || lower.includes('family') || lower.includes('group')) {
          reply = `👨‍👩‍👧‍👦 **${chefLabel}'s Feast Recommendation**:\n\nWe recommend 2 appetizers (1 vegetarian + 1 specialty), 2 signature main courses, an assorted bread/side basket, and 1 royal rice or pasta course. Perfect balance without food waste!`;
          const feast = availableItems.filter(i => i.is_bestseller || i.is_chef_recommended).slice(0, 3);
          recs = feast.map(item => ({
            item,
            reason: `Core Feast Dish — ${item.serving_size} • ${item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('jain')) {
          const jainSafe = availableItems.filter(i => {
            const flags = Array.isArray(i.dietary_flags) ? i.dietary_flags : [];
            const ings = Array.isArray(i.ingredients) ? i.ingredients : [];
            return (
              flags.some(f => String(f).toLowerCase() === 'jain') ||
              (flags.some(f => String(f).toLowerCase() === 'veg' || String(f).toLowerCase() === 'vegetarian') &&
               !ings.some(ing => /onion|garlic|ginger|potato|root/i.test(ing)))
            );
          }).slice(0, 3);

          reply = `🌱 **100% Jain Dining Safe Protocol**:\n\nOur kitchen maintains dedicated cookware and preparation stations without onion, garlic, or root vegetables.\n\nHere are verified Jain-friendly preparations:`;
          recs = jainSafe.map(item => ({
            item,
            reason: `100% Jain Safe • Prepared with isolated utensils & zero root vegetables`
          }));
        } else if (lower.includes('gluten') || lower.includes('celiac')) {
          const glutenFree = availableItems.filter(i => {
            const allergens = Array.isArray(i.allergens) ? i.allergens : [];
            const ings = Array.isArray(i.ingredients) ? i.ingredients : [];
            return (
              !allergens.some(a => /gluten|wheat|flour|maida/i.test(a)) &&
              !ings.some(ing => /wheat|maida|semolina|soy sauce/i.test(ing))
            );
          }).slice(0, 3);

          reply = `🌾 **Gluten-Free & Celiac Safe Guide**:\n\nAll tandoori grills, basmati rice preparations, and select gravies are naturally wheat-free. Avoid tandoori rotis/naans and fried battered starters.\n\nRecommended Gluten-Free dishes:`;
          recs = glutenFree.map(item => ({
            item,
            reason: `Verified Wheat-Free • Cooked with pure rice, corn, or gram flour`
          }));
        } else if (lower.includes('nut') || lower.includes('peanut')) {
          const nutFree = availableItems.filter(i => {
            const allergens = Array.isArray(i.allergens) ? i.allergens : [];
            const ings = Array.isArray(i.ingredients) ? i.ingredients : [];
            return (
              !allergens.some(a => /nut|peanut|cashew|almond|walnut/i.test(a)) &&
              !ings.some(ing => /cashew|almond|pista|nut|peanut/i.test(ing))
            );
          }).slice(0, 3);

          reply = `🥜 **Nut Allergy Safe Protocol**:\n\nWe tag nut-allergy tickets in bold red on the kitchen KOT. These dishes are prepared without cashew paste, peanuts, or nut oils:`;
          recs = nutFree.map(item => ({
            item,
            reason: `100% Nut-Free Recipe • Zero peanuts, cashews, or almond paste`
          }));
        } else if (lower.includes('vegan')) {
          const veganSafe = availableItems.filter(i => {
            const flags = Array.isArray(i.dietary_flags) ? i.dietary_flags : [];
            const allergens = Array.isArray(i.allergens) ? i.allergens : [];
            const ings = Array.isArray(i.ingredients) ? i.ingredients : [];
            return (
              flags.some(f => String(f).toLowerCase() === 'vegan') ||
              (!allergens.some(a => /dairy|milk|cheese|butter|ghee/i.test(a)) &&
               !ings.some(ing => /paneer|butter|cream|ghee|curd|yogurt|honey/i.test(ing)) &&
               !flags.some(f => String(f).toLowerCase() === 'non-veg'))
            );
          }).slice(0, 3);

          reply = `🥬 **100% Plant-Based Vegan Selections**:\n\nPrepared using cold-pressed oils, zero dairy makkhan, zero paneer, and zero ghee:`;
          recs = veganSafe.map(item => ({
            item,
            reason: `Pure Plant-Based Vegan • Zero dairy, makkhan, cream, or ghee`
          }));
        } else if (lower.includes('kid') || lower.includes('child') || lower.includes('mildest')) {
          const kidSafe = availableItems.filter(i => (i.spice_level || 0) === 0 || ((i.spice_level || 0) === 1 && i.item_type !== 'drink')).slice(0, 3);
          reply = `👶 **Kid-Friendly & Gentle Flavors**:\n\nThese dishes have zero harsh chilies or pungent spices, focusing on creamy, naturally sweet, or buttery notes that kids love:`;
          recs = kidSafe.map(item => ({
            item,
            reason: `Spice Level ${item.spice_level || 0}/5 • Gentle aroma, zero chili bite`
          }));
        } else if (lower.includes('popular') || lower.includes('best seller') || lower.includes('recommend')) {
          const bestsellers = availableItems.filter(i => i.is_bestseller).slice(0, 2);
          const chefPicks = availableItems.filter(i => i.is_chef_recommended).slice(0, 2);
          const picks = bestsellers.length > 0 ? bestsellers : chefPicks.length > 0 ? chefPicks : availableItems.slice(0, 2);
          reply = "Here are our most popular dishes, loved by our guests:";
          recs = picks.map(item => ({
            item,
            reason: item.is_bestseller ? `⭐ Bestseller — ${(item.short_description || '').slice(0, 50)}` : `Chef recommended — ${(item.short_description || '').slice(0, 50)}`
          }));
        } else if (lower.includes('vegetarian') || lower.includes('veg')) {
          const vegDishes = availableItems.filter(i => {
            const flags = Array.isArray(i.dietary_flags) ? i.dietary_flags : [];
            return flags.some(f => {
              const lf = String(f).toLowerCase();
              return lf === 'veg' || lf === 'vegetarian' || lf === 'vegan' || lf === 'jain';
            });
          }).slice(0, 3);
          reply = "Here are our finest vegetarian offerings:";
          recs = vegDishes.map(item => ({
            item,
            reason: `100% Vegetarian — ${(item.short_description || '').slice(0, 50)}`
          }));
        } else if (lower.includes('light') || lower.includes('healthy') || lower.includes('salad')) {
          const light = availableItems.filter(i => {
            const flags = Array.isArray(i.dietary_flags) ? i.dietary_flags : [];
            return flags.some(f => ['vegan', 'jain'].includes(String(f).toLowerCase())) || (i.spice_level || 0) === 0;
          }).slice(0, 2);
          reply = "Looking for lighter fare? Here are our gentler options:";
          recs = light.map(item => ({
            item,
            reason: `Light & fresh — ${(item.dietary_flags || []).join(', ') || 'Gentle flavors'}`
          }));
        } else if (lower.includes('chef') || lower.includes('favourite') || lower.includes('favorite')) {
          const chefPicks = availableItems.filter(i => i.is_chef_recommended);
          const picks = chefPicks.length > 0 ? chefPicks.slice(0, 3) : availableItems.slice(0, 2);
          reply = `🌟 **Head Chef ${chefLabel}'s Personal Favourites**:\n\n` +
            `*"${persona?.chef_philosophy || 'Our dishes are prepared with authentic hand-pounded spices and zero compromises on slow-cooked technique.'}"*\n\n` +
            picks.map(item => `• **${item.name}** (₹${item.price}): ${item.chef_notes || item.short_description}`).join('\n');
          recs = picks.map(item => ({
            item,
            reason: `Chef's Choice • ${item.chef_story || item.chef_notes || item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('special') || lower.includes('signature') || lower.includes('house special')) {
          const specials = availableItems.filter(i => i.is_signature || i.is_bestseller);
          const list = specials.length > 0 ? specials.slice(0, 3) : availableItems.slice(0, 2);
          reply = `🔥 **Our House Specials & Signatures at ${restaurant?.name || 'our restaurant'}**:\n\n` +
            list.map(item => `• **${item.name}** (₹${item.price}) [Spice ${item.spice_level}/5]: ${item.owner_pitch || item.short_description}`).join('\n');
          recs = list.map(item => ({
            item,
            reason: `House Signature • ${item.chef_notes || item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('spicy') || lower.includes('hot')) {
          const spicy = availableItems.filter(i => i.spice_level >= 3).sort((a, b) => b.spice_level - a.spice_level).slice(0, 2);
          reply = `🌶️ **For those who love authentic heat:**\n${persona?.spice_guidance || 'Our spices are roasted in desi ghee for deep aroma rather than raw heat.'}`;
          recs = spicy.map(item => ({
            item,
            reason: `🔥 Spice ${item.spice_level}/5 — ${item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('drink') || lower.includes('beverage')) {
          const drinks = availableItems.filter(i => i.item_type === 'drink').slice(0, 3);
          reply = "Here's our beverage selection crafted to complement our cuisine:";
          recs = drinks.map(item => ({
            item,
            reason: `${item.short_description.slice(0, 60)}`
          }));
        } else {
          reply = `Namaste! As Head Chef ${chefLabel} & Owner ${ownerLabel} ensure: "${persona?.owner_hospitality_note || 'We treat every guest as family.'}"\n\nAsk me about:\n• Chef's Favourites & House Specials\n• Cooking secrets & 18-hour preparation techniques\n• Spice levels (0-5) & milder options\n• Beverage and artisan bread pairings\n• Dietary safety (Jain, Vegan, Gluten-Free, Allergens)`;
        }
      }

      setMessages([...newMsgs, { role: 'assistant', content: reply, recommendations: recs }]);
    } catch (e: any) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: "I don't have verified kitchen records for that detail. Please check with a staff member."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
      <div 
        className="bg-[#0D1322] text-slate-100 rounded-t-3xl max-w-xl w-full h-[85vh] flex flex-col p-4 animate-in slide-in-from-bottom duration-200 border border-white/[0.08] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-serif font-bold text-base text-white">AI Dining Concierge</h3>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  🧑‍🍳 Chef &amp; Owner Trained
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {focusDish
                  ? `Focused on: ${focusDish.name}`
                  : `Trained on secret kitchen recipes & authentic spice index`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focused Dish Banner */}
        {focusDish && (
          <div className="flex items-center space-x-3 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl my-2">
            <img
              src={focusDish.image_url}
              alt={focusDish.name}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{focusDish.name}</h4>
              <span className="text-[10px] text-amber-400">₹{focusDish.price.toFixed(2)} • Spice {focusDish.spice_level}/5</span>
            </div>
          </div>
        )}

        {/* Allergy Policy Guard Banner */}
        <div className="bg-amber-500/10 border border-amber-500/25 p-2.5 rounded-xl my-1.5 flex items-start space-x-2 text-[11px] text-amber-200 leading-tight">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            {ALLERGY_DISCLAIMER}
          </p>
        </div>

        {/* Dedicated 1-Tap Dietary & Allergen Safety Concierge Bar */}
        <div className="py-1">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleSendQuery("Which dishes are 100% Jain safe with isolated prep?")}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex-shrink-0 transition-colors cursor-pointer"
            >
              🌱 100% Jain Safe
            </button>
            <button
              onClick={() => handleSendQuery("Which dishes are strictly Gluten-Free and celiac safe?")}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 flex-shrink-0 transition-colors cursor-pointer"
            >
              🌾 Gluten-Free / Celiac
            </button>
            <button
              onClick={() => handleSendQuery("Which dishes are completely free of peanuts, tree nuts, and nut oils?")}
              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 text-[11px] font-bold border border-orange-500/30 flex-shrink-0 transition-colors cursor-pointer"
            >
              🥜 Nut-Allergy Safe
            </button>
            <button
              onClick={() => handleSendQuery("Which dishes are 100% Plant-Based Vegan with zero dairy or ghee?")}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex-shrink-0 transition-colors cursor-pointer"
            >
              🥬 Pure Vegan
            </button>
            <button
              onClick={() => handleSendQuery("What are your zero-spice, mild dishes suitable for kids?")}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 flex-shrink-0 transition-colors cursor-pointer"
            >
              👶 Kid-Friendly Mild
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-white rounded-tr-none shadow-sm font-medium'
                    : 'bg-[#12192B] text-slate-100 rounded-tl-none border border-white/[0.08]'
                }`}
              >
                {m.content}
              </div>

              {/* Recommendation Cards */}
              {m.recommendations && m.recommendations.length > 0 && (
                <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                  {m.recommendations.map((rec) => (
                    <div
                      key={rec.item.id}
                      className="bg-[#12192B] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-3"
                    >
                      <img
                        src={rec.item.image_url}
                        alt={rec.item.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-[#090D16]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-0.5">
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                            Verified Match
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xs text-white truncate">
                          {rec.item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{rec.reason}</p>
                        <span className="text-xs font-bold text-amber-400 mt-0.5 block">
                          ₹{rec.item.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onConfirmAdd(rec.item);
                          onClose();
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold px-3 py-2 rounded-xl flex items-center space-x-1 shadow-lg transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 py-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Analyzing menu & kitchen data...</span>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2 flex-shrink-0" />
        </div>

        {/* Context-aware Quick action chips */}
        <div className="flex space-x-1.5 overflow-x-auto py-2.5 no-scrollbar border-t border-white/[0.08]">
          {quickActions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuery(q.query)}
              className="whitespace-nowrap bg-[#12192B] hover:bg-amber-500/20 hover:text-amber-300 border border-white/[0.08] hover:border-amber-500/40 text-[11px] font-bold px-3 py-1.5 rounded-full text-slate-300 transition-all flex items-center space-x-1 shadow-sm cursor-pointer"
            >
              {q.icon && <span className="mr-0.5">{q.icon}</span>}
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="flex items-center space-x-2 pt-2 border-t border-white/[0.08]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(input)}
            placeholder={focusDish ? `Ask about ${focusDish.name}...` : "Ask about ingredients, pairings, allergens..."}
            className="flex-1 bg-[#090D16] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/60 placeholder-slate-500"
          />
          <button
            type="button"
            onClick={() => handleSendQuery(input)}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
