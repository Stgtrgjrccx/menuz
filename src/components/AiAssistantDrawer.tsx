import React, { useState, useEffect, useMemo } from 'react';
import { X, Send, Sparkles, Plus, AlertTriangle, Flame, ShieldAlert, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  focusDish: MenuItem | null;
  onConfirmAdd: (dish: MenuItem) => void;
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
function getQuickActionsForDish(dish: MenuItem | null): string[] {
  if (!dish) {
    return [
      "What's popular today?",
      "Recommend something light",
      "Any vegetarian specials?",
      "What drinks pair well?",
      "Show chef's recommendations"
    ];
  }

  const actions: string[] = [];

  // Spice-related
  if (dish.spice_level > 0) {
    actions.push(`How spicy is ${dish.name}?`);
    actions.push(`A milder alternative to ${dish.name}?`);
  } else {
    actions.push(`Is ${dish.name} mild?`);
  }

  // Diet-related
  if (dish.dietary_flags.includes('Vegetarian')) {
    actions.push(`Non-veg alternative to ${dish.name}?`);
  } else {
    actions.push(`Vegetarian alternative to ${dish.name}?`);
  }

  // Allergens
  if (dish.allergens.length > 0) {
    actions.push(`Allergens in ${dish.name}?`);
  }

  // Pairing
  if (dish.item_type === 'food') {
    actions.push(`Best drink with ${dish.name}?`);
    actions.push(`What bread goes with ${dish.name}?`);
  } else {
    actions.push(`Best food with ${dish.name}?`);
  }

  // Portion
  actions.push(`Portion size of ${dish.name}?`);

  return actions.slice(0, 5);
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  focusDish,
  onConfirmAdd,
}) => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const availableItems = menuItems.filter((i) => i.is_available);

  // Context-aware quick actions
  const quickActions = useMemo(() => getQuickActionsForDish(focusDish), [focusDish]);

  useEffect(() => {
    if (isOpen) {
      if (focusDish) {
        handleSendQuery(`Tell me about ${focusDish.name} — flavor profile, ingredients, and allergens.`, focusDish);
      } else if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: `Namaste! I'm your AI dining concierge${restaurant?.name ? ` at ${restaurant.name}` : ''}. Ask me about any dish — ingredients, allergens, spice levels, pairings, or dietary alternatives. I'll help you find the perfect meal.`
          }
        ]);
      }
    }
  }, [isOpen, focusDish]);

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
        const dishName = targetDish.name;

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
                reason: `Milder option (Spice ${item.spice_level}/5) — ${item.short_description.slice(0, 60)}...`
              }));
            }
          }
        } else if (lower.includes('allergen') || lower.includes('allergy')) {
          reply = targetDish.allergens.length > 0
            ? `⚠️ ${dishName} contains: ${targetDish.allergens.join(', ')}.\n\n${ALLERGY_DISCLAIMER}`
            : `${dishName} has no declared allergens. However, ${ALLERGY_DISCLAIMER}`;
        } else if (lower.includes('vegetarian alternative') || lower.includes('veg alternative') || lower.includes('non-veg alternative')) {
          const isVeg = targetDish.dietary_flags.includes('Vegetarian');
          const alternatives = availableItems.filter(i =>
            i.id !== targetDish.id &&
            i.category_id === targetDish.category_id &&
            (isVeg
              ? !i.dietary_flags.includes('Vegetarian')
              : i.dietary_flags.includes('Vegetarian'))
          ).slice(0, 2);

          reply = isVeg
            ? `Looking for a non-vegetarian alternative to ${dishName}? Here are my recommendations:`
            : `Here are vegetarian alternatives to ${dishName}:`;

          recs = alternatives.map(item => ({
            item,
            reason: `${item.dietary_flags.join(', ')} — ${item.short_description.slice(0, 50)}`
          }));

          if (alternatives.length === 0) {
            reply += ` Unfortunately, I couldn't find a direct ${isVeg ? 'non-veg' : 'vegetarian'} match in the same category. Try browsing other sections!`;
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
          reply = `**${dishName}**\n${targetDish.full_description}\n\n• Ingredients: ${targetDish.ingredients.join(', ')}\n• Spice Level: ${targetDish.spice_level}/5\n• Serving: ${targetDish.serving_size}\n• Diet: ${targetDish.dietary_flags.join(', ') || 'No specific flags'}`;
          if (targetDish.allergens.length > 0) {
            reply += `\n• ⚠️ Allergens: ${targetDish.allergens.join(', ')}`;
          }
          if (targetDish.chef_notes) {
            reply += `\n• Chef's Note: ${targetDish.chef_notes}`;
          }
        }
      }
      // ── General queries (no dish focused) ─────────────────
      else {
        if (lower.includes('popular') || lower.includes('best seller') || lower.includes('recommend')) {
          const bestsellers = availableItems.filter(i => i.is_bestseller).slice(0, 2);
          const chefPicks = availableItems.filter(i => i.is_chef_recommended).slice(0, 2);
          const picks = bestsellers.length > 0 ? bestsellers : chefPicks.length > 0 ? chefPicks : availableItems.slice(0, 2);
          reply = "Here are our most popular dishes, loved by our guests:";
          recs = picks.map(item => ({
            item,
            reason: item.is_bestseller ? `⭐ Bestseller — ${item.short_description.slice(0, 50)}` : `Chef recommended — ${item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('vegetarian') || lower.includes('veg')) {
          const vegDishes = availableItems.filter(i => i.dietary_flags.includes('Vegetarian')).slice(0, 3);
          reply = "Here are our finest vegetarian offerings:";
          recs = vegDishes.map(item => ({
            item,
            reason: `100% Vegetarian — ${item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('light') || lower.includes('healthy') || lower.includes('salad')) {
          const light = availableItems.filter(i => i.dietary_flags.includes('Vegan') || i.dietary_flags.includes('Jain') || i.spice_level === 0).slice(0, 2);
          reply = "Looking for lighter fare? Here are our gentler options:";
          recs = light.map(item => ({
            item,
            reason: `Light & fresh — ${item.dietary_flags.join(', ')}`
          }));
        } else if (lower.includes('chef') || lower.includes('special')) {
          const chefPicks = availableItems.filter(i => i.is_chef_recommended).slice(0, 2);
          reply = "Our chef personally recommends these dishes:";
          recs = chefPicks.map(item => ({
            item,
            reason: `🧑‍🍳 Chef's Special — ${item.chef_notes || item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('spicy') || lower.includes('hot')) {
          const spicy = availableItems.filter(i => i.spice_level >= 3).sort((a, b) => b.spice_level - a.spice_level).slice(0, 2);
          reply = "For those who love the heat:";
          recs = spicy.map(item => ({
            item,
            reason: `🔥 Spice ${item.spice_level}/5 — ${item.short_description.slice(0, 50)}`
          }));
        } else if (lower.includes('drink') || lower.includes('beverage')) {
          const drinks = availableItems.filter(i => i.item_type === 'drink').slice(0, 3);
          reply = "Here's our beverage selection:";
          recs = drinks.map(item => ({
            item,
            reason: `${item.short_description.slice(0, 60)}`
          }));
        } else {
          reply = "I don't have verified kitchen records for that specific query. You can ask me about:\n\n• Specific dish details & allergens\n• Spice levels & milder alternatives\n• Vegetarian / vegan options\n• Drink & bread pairings\n• Chef's recommendations\n• Portion sizes";
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
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-end justify-center">
      <div 
        className="bg-white rounded-t-3xl max-w-xl w-full h-[85vh] flex flex-col p-4 shadow-float animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-ivory-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900">AI Dining Concierge</h3>
              <p className="text-[10px] text-charcoal-700/60">
                {focusDish
                  ? `Focused on: ${focusDish.name}`
                  : `Powered by ${restaurant?.name || 'restaurant'} kitchen data`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-700 hover:bg-ivory-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focused Dish Banner */}
        {focusDish && (
          <div className="flex items-center space-x-3 p-2.5 bg-saffron-50 border border-saffron-200 rounded-xl my-2">
            <img
              src={focusDish.image_url}
              alt={focusDish.name}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-charcoal-900 truncate">{focusDish.name}</h4>
              <span className="text-[10px] text-saffron-700">₹{focusDish.price.toFixed(2)} • Spice {focusDish.spice_level}/5</span>
            </div>
          </div>
        )}

        {/* Allergy Policy Guard Banner */}
        <div className="bg-amber-50/90 border border-amber-200 p-2.5 rounded-xl my-2 flex items-start space-x-2 text-[11px] text-amber-900 leading-tight">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p>
            {ALLERGY_DISCLAIMER}
          </p>
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
                    ? 'bg-saffron-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-ivory-100 text-charcoal-900 rounded-tl-none border border-ivory-200'
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
                      className="bg-white border border-saffron-200 rounded-2xl p-3 shadow-subtle flex items-center justify-between gap-3"
                    >
                      <img
                        src={rec.item.image_url}
                        alt={rec.item.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-ivory-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-0.5">
                          <span className="text-[10px] text-saffron-700 font-bold uppercase tracking-wider">
                            Verified Match
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xs text-charcoal-900 truncate">
                          {rec.item.name}
                        </h4>
                        <p className="text-[10px] text-charcoal-700/70 line-clamp-1">{rec.reason}</p>
                        <span className="text-xs font-bold text-saffron-700 mt-0.5 block">
                          ₹{rec.item.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onConfirmAdd(rec.item);
                          onClose();
                        }}
                        className="bg-saffron-600 hover:bg-saffron-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl flex items-center space-x-1 shadow-subtle transition-colors flex-shrink-0"
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
            <div className="flex items-center space-x-2 text-xs text-charcoal-700/60 py-2">
              <span className="w-2 h-2 rounded-full bg-saffron-600 animate-ping" />
              <span>Analyzing menu & kitchen data...</span>
            </div>
          )}
        </div>

        {/* Context-aware Quick action chips */}
        <div className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none border-t border-ivory-200">
          {quickActions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuery(q)}
              className="whitespace-nowrap bg-ivory-100 hover:bg-ivory-200 border border-ivory-200 text-[11px] px-2.5 py-1 rounded-full text-charcoal-800 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="flex items-center space-x-2 pt-2 border-t border-ivory-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(input)}
            placeholder={focusDish ? `Ask about ${focusDish.name}...` : "Ask about ingredients, pairings, allergens..."}
            className="flex-1 bg-ivory-50 border border-ivory-200 rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600 placeholder-charcoal-700/40"
          />
          <button
            type="button"
            onClick={() => handleSendQuery(input)}
            className="p-2.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl shadow-subtle transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
