import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ChefHat, Heart, BookOpen, GlassWater, Download,
  Printer, Check, Save, MessageSquare, Share2, Copy, Send,
  Mic, MicOff, Plus, Trash2, ArrowLeft, RefreshCw, Flame,
  AlertCircle, Table as TableIcon, Layers, Sliders, CheckCircle2,
  ExternalLink, Mail
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { ChefOwnerAiPersona, MenuItem, isWorkingWithMenuz } from '../types';

export const AiBotOnboardingStudioPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const updateMenuItem = useRestaurantStore((state) => state.updateMenuItem);

  const activeWorkingRestaurants = restaurants.filter((r) => isWorkingWithMenuz(r));
  const currentMenuItems = menuItems.filter((i) => i.restaurant_id === restaurant.id);
  const currentCategories = categories.filter((c) => c.restaurant_id === restaurant.id);

  // Active Tab
  const [viewMode, setViewMode] = useState<'cards' | 'matrix' | 'lore' | 'test'>('cards');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Voice simulation state
  const [recordingDishId, setRecordingDishId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Test Chat state
  const [testMessages, setTestMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Namaste! I am the AI Concierge for ${restaurant.name}, trained directly with Chef ${restaurant.ai_persona?.chef_name || 'Sanjay'} and Owner ${restaurant.ai_persona?.owner_name || 'Vikram'}. Ask me about secret recipes, spice levels, or pairings!`
    }
  ]);
  const [testInput, setTestInput] = useState('');

  // Persona state
  const defaultPersona: ChefOwnerAiPersona = restaurant.ai_persona || {
    chef_name: 'Executive Head Chef',
    chef_title: 'Executive Head Chef & Culinary Master',
    chef_bio: 'Master of regional culinary heritage with 18+ years of authentic kitchen craftsmanship.',
    chef_philosophy: 'Zero artificial bases, slow-roasted hand-pounded spices, and daily fresh preparation.',
    owner_name: restaurant.owner_name || 'Founding Partner',
    owner_hospitality_note: `At ${restaurant.name}, we treat every diner as an honored guest at our family table.`,
    greeting_tone: 'warm_traditional',
    signature_pairings: [
      { dish_name: 'Signature Curry', pairing_drink: 'Cardamom Saffron Lassi', why: 'Cuts through the rich aromatic butter.' }
    ],
    secret_stories: [
      { dish_name: 'House Special', story: 'Slow-simmered for 18 hours using a generational family recipe.' }
    ],
    spice_guidance: 'Level 1 is mild aromatic; Level 3 is traditional Indian heat; Level 5 is fiery Guntur heat.',
    dietary_rules: 'Strict separate cookware and oil fryers for vegetarian and non-vegetarian dishes.'
  };

  const [persona, setPersona] = useState<ChefOwnerAiPersona>(defaultPersona);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return currentMenuItems.filter((dish) => {
      const matchCat = selectedCatId === 'all' || dish.category_id === selectedCatId;
      const matchSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.short_description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [currentMenuItems, selectedCatId, searchQuery]);

  // Handle Quick Auto-Generate Secret for a dish
  const handleAutoSuggestSecret = (dish: MenuItem) => {
    let suggestedSecret = '';
    const name = dish.name.toLowerCase();
    if (name.includes('butter chicken') || name.includes('murg')) {
      suggestedSecret = 'Tandoor-charred chicken simmered for 8 hours in vine-ripened tomato coulis with slow-churned white makkhan and crushed fenugreek.';
    } else if (name.includes('dal') || name.includes('lentil')) {
      suggestedSecret = 'Slow-simmered continuously for 36 hours over glowing charcoal embers with cultured dairy butter.';
    } else if (name.includes('biryani') || name.includes('rice')) {
      suggestedSecret = 'Aged royal Basmati sealed with whole spices and saffron-infused milk in heavy copper deghs with dough purdah.';
    } else if (name.includes('pizza') || name.includes('margherita')) {
      suggestedSecret = '72-hour cold-fermented Caputo Tipo 00 dough blistered at 480°C in an artisanal volcanic stone oven.';
    } else if (name.includes('pasta') || name.includes('tagliatelle')) {
      suggestedSecret = 'Hand-extruded through bronze dies every morning at 7 AM using organic pasture-raised farm eggs.';
    } else {
      suggestedSecret = `Handcrafted daily from scratch using ${dish.ingredients.slice(0, 3).join(', ')} and our chef's secret heirloom spice blend.`;
    }

    updateMenuItem(dish.id, { chef_notes: suggestedSecret });
  };

  // Auto-fill all missing secrets in 1 click
  const handleAutoFillAllMissingSecrets = () => {
    currentMenuItems.forEach((dish) => {
      if (!dish.chef_notes || dish.chef_notes.trim().length === 0) {
        handleAutoSuggestSecret(dish);
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Voice Note Dictation Simulation
  const handleToggleVoiceRecord = (dishId: string) => {
    if (recordingDishId === dishId) {
      setRecordingDishId(null);
    } else {
      setRecordingDishId(dishId);
      // Simulate speech-to-text input after 2.5 seconds
      setTimeout(() => {
        const dish = currentMenuItems.find((d) => d.id === dishId);
        if (dish) {
          const simulatedTranscription = `Chef note: We roast the whole spices for ${dish.name} on gentle charcoal heat and finish with fresh cold-pressed oil for deep aroma.`;
          updateMenuItem(dishId, {
            chef_notes: dish.chef_notes ? `${dish.chef_notes} ${simulatedTranscription}` : simulatedTranscription
          });
        }
        setRecordingDishId(null);
      }, 2400);
    }
  };

  // Save Persona
  const handleSaveAll = () => {
    updateRestaurant(restaurant.id, { ai_persona: persona });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Share Actions
  const intakeUrl = `${window.location.origin}/#/manage/${restaurant.slug}`;
  const shareText = `Namaste Chef! Please fill out the Menuz AI training details for ${restaurant.name} here: ${intakeUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(intakeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareEmail = () => {
    const mailUrl = `mailto:?subject=${encodeURIComponent(`Menuz AI Intake Questionnaire - ${restaurant.name}`)}&body=${encodeURIComponent(shareText)}`;
    window.location.href = mailUrl;
  };

  // Test Chat Submit
  const handleTestChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const userMsg = testInput;
    setTestMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setTestInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let botReply = '';

      const matchedDish = currentMenuItems.find((d) => lower.includes(d.name.toLowerCase()));
      if (matchedDish) {
        botReply = `🧑‍🍳 **${matchedDish.name} (Spice ${matchedDish.spice_level}/5)**:\n${matchedDish.full_description}\n\n• **Chef's Secret**: ${matchedDish.chef_notes || 'Handcrafted fresh daily.'}\n• **Ingredients**: ${matchedDish.ingredients.join(', ')}\n• **Allergens**: ${matchedDish.allergens.length > 0 ? matchedDish.allergens.join(', ') : 'None'}`;
      } else if (lower.includes('spice') || lower.includes('spicy')) {
        botReply = `Our kitchen calibrates spice on a strict 1-5 scale. ${persona.spice_guidance}`;
      } else if (lower.includes('chef') || lower.includes('philosophy')) {
        botReply = `Chef ${persona.chef_name} (${persona.chef_title}): "${persona.chef_philosophy}"`;
      } else if (lower.includes('pair') || lower.includes('drink') || lower.includes('wine')) {
        botReply = `Here are our signature pairings curated by Owner ${persona.owner_name}:\n` +
          persona.signature_pairings.map((p) => `• **${p.dish_name}** ➔ *${p.pairing_drink}*: ${p.why}`).join('\n');
      } else {
        botReply = `Welcome to ${restaurant.name}! How can I help guide your meal with Chef ${persona.chef_name}'s recommendations?`;
      }

      setTestMessages((prev) => [...prev, { role: 'assistant', text: botReply }]);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-24">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 text-white p-6 md:p-8 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/manage/${restaurant.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Manager Hub</span>
            </Link>

            {/* Restaurant Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-orange-200 hidden sm:inline">Active Restaurant:</span>
              <select
                value={restaurant.id}
                onChange={(e) => setCurrentRestaurant(e.target.value)}
                className="bg-black/30 text-white font-bold text-xs border border-white/20 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 cursor-pointer"
              >
                {activeWorkingRestaurants.map((r) => (
                  <option key={r.id} value={r.id} className="bg-charcoal-900 text-white">
                    {r.name} ({r.cuisine})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-white text-orange-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                  Dedicated AI Intake Studio
                </span>
                <span className="bg-orange-600/60 text-orange-100 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 100% Chef & Owner Trained
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                {restaurant.name} · AI Dining Concierge Training Hub
              </h1>
              <p className="text-sm text-orange-100 max-w-3xl mt-1 leading-relaxed">
                Train your restaurant's bespoke AI dining concierge with detailed dish-by-dish secret recipes, spice calibrations (1-5), allergen guidelines, and owner hospitality lore.
              </p>
            </div>

            {/* Quick Share & Export Action Bar */}
            <div className="flex flex-wrap items-center gap-2 bg-black/20 p-2.5 rounded-2xl border border-white/10 self-start md:self-auto">
              <a
                href="./menuz_complete_pitch_and_product_deck.pdf"
                download="Menuz_Chef_Owner_AI_Intake_Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white text-orange-900 hover:bg-orange-50 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                title="Download Printable PDF Questionnaire"
              >
                <Download className="w-3.5 h-3.5 text-orange-700" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                title="Share Form via WhatsApp to Chef / Owner"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareEmail}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                title="Email Questionnaire to Chef / Owner"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                title="Copy Intake Form Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'cards' ? 'bg-white text-orange-950 shadow-md scale-102' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 1. Dish-by-Dish Intake Cards ({currentMenuItems.length} Dishes)
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'matrix' ? 'bg-white text-orange-950 shadow-md scale-102' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <TableIcon className="w-4 h-4" /> 2. Fast Speed-Tagger Matrix
            </button>
            <button
              onClick={() => setViewMode('lore')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'lore' ? 'bg-white text-orange-950 shadow-md scale-102' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <ChefHat className="w-4 h-4" /> 3. Chef & Owner Lore & Voice
            </button>
            <button
              onClick={() => setViewMode('test')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'test' ? 'bg-white text-orange-950 shadow-md scale-102' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> 4. Live Bot Test Playground
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>AI Knowledge Base & Dish Secrets successfully trained into {restaurant.name}'s Concierge!</span>
            </div>
            <button onClick={() => setSavedSuccess(false)} className="text-emerald-700 hover:text-emerald-950">
              Dismiss
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* MODE 1: DISH-BY-DISH INTAKE CARDS (WITH VOICE & AUTO-SUGGEST)      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {viewMode === 'cards' && (
          <div className="space-y-6">
            {/* Action Bar & Quick-Fill Shortcuts */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-charcoal-700">Filter Category:</span>
                <button
                  onClick={() => setSelectedCatId('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCatId === 'all' ? 'bg-saffron-600 text-white shadow-xs' : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  All ({currentMenuItems.length})
                </button>
                {currentCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCatId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCatId === c.id ? 'bg-saffron-600 text-white shadow-xs' : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleAutoFillAllMissingSecrets}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Auto-generate high-margin culinary stories for all empty dishes"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>✨ Auto-Draft Missing Secrets ({currentMenuItems.filter(d => !d.chef_notes).length})</span>
                </button>

                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            {/* Dish Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDishes.map((dish) => {
                const isRecording = recordingDishId === dish.id;

                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-3xl border border-ivory-200 shadow-subtle p-5 flex flex-col justify-between space-y-4 hover:border-saffron-300 transition-all"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-ivory-200 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-charcoal-700/60 font-mono block">
                              {currentCategories.find(c => c.id === dish.category_id)?.name || 'Dish'} · INR {dish.price}
                            </span>
                            <h3 className="font-serif font-bold text-base text-charcoal-900 leading-tight">
                              {dish.name}
                            </h3>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              {dish.dietary_flags.map((flag, fIdx) => (
                                <span key={fIdx} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-ivory-100 text-charcoal-700">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Spice Level Control Slider (0 to 5) */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] uppercase font-bold text-charcoal-500 block">
                            Spice: <strong className="text-charcoal-900">{dish.spice_level}/5</strong>
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={5}
                            value={dish.spice_level}
                            onChange={(e) => updateMenuItem(dish.id, { spice_level: parseInt(e.target.value, 10) })}
                            className="w-20 accent-orange-600 cursor-pointer"
                          />
                          <span className="text-[9px] text-charcoal-500 block">
                            {dish.spice_level === 0 ? 'No Heat' : dish.spice_level <= 2 ? 'Mild/Aroma' : dish.spice_level <= 4 ? 'Traditional' : 'Fiery'}
                          </span>
                        </div>
                      </div>

                      {/* Chef's Secret Story (The core AI knowledge field) */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                            <span>Chef's Secret / Heirloom Backstory (Fed to AI)</span>
                          </label>

                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleVoiceRecord(dish.id)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                                isRecording
                                  ? 'bg-red-500 text-white animate-pulse'
                                  : 'bg-ivory-100 text-charcoal-700 hover:bg-orange-100 hover:text-orange-900'
                              }`}
                              title="Dictate chef voice note"
                            >
                              {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                              <span>{isRecording ? 'Listening...' : 'Dictate'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAutoSuggestSecret(dish)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                              title="Auto-draft story"
                            >
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>Auto-Draft</span>
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={dish.chef_notes || ''}
                          onChange={(e) => updateMenuItem(dish.id, { chef_notes: e.target.value })}
                          placeholder="e.g. Simmered for 18 hours in copper pots with hand-ground spices and organic butter..."
                          className="w-full bg-ivory-50/70 border border-ivory-300 rounded-2xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500 font-medium"
                        />
                      </div>

                      {/* Ingredients & Allergens Quick Tags */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-charcoal-500 block mb-0.5">Key Ingredients</label>
                          <input
                            type="text"
                            value={dish.ingredients.join(', ')}
                            onChange={(e) => updateMenuItem(dish.id, { ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            placeholder="Cashews, fenugreek, cream..."
                            className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-charcoal-500 block mb-0.5">Allergens</label>
                          <input
                            type="text"
                            value={dish.allergens.join(', ')}
                            onChange={(e) => updateMenuItem(dish.id, { allergens: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            placeholder="Nuts, Dairy, Gluten..."
                            className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* MODE 2: FAST SPEED-TAGGER MATRIX (BULK FAST EDITING)               */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-3xl border border-ivory-200 shadow-subtle overflow-hidden">
            <div className="p-5 bg-ivory-50 border-b border-ivory-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal-900">High-Speed Matrix Mode</h3>
                <p className="text-xs text-charcoal-700/70">
                  Calibrate spice levels, key ingredients, and stories across all {currentMenuItems.length} dishes in under 3 minutes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAutoFillAllMissingSecrets}
                  className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Auto-Draft All</span>
                </button>
                <button
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-100/70 text-charcoal-700 font-bold border-b border-ivory-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Dish Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Spice (0-5)</th>
                    <th className="p-3">Chef Heirloom Story (Fed to AI)</th>
                    <th className="p-3">Allergens</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100">
                  {currentMenuItems.map((dish) => (
                    <tr key={dish.id} className="hover:bg-ivory-50/80">
                      <td className="p-3 font-bold text-charcoal-900 min-w-[150px]">
                        {dish.name}
                      </td>
                      <td className="p-3 text-charcoal-600">
                        {currentCategories.find(c => c.id === dish.category_id)?.name || 'Dish'}
                      </td>
                      <td className="p-3 font-mono font-bold text-charcoal-800">
                        INR {dish.price}
                      </td>
                      <td className="p-3 min-w-[110px]">
                        <select
                          value={dish.spice_level}
                          onChange={(e) => updateMenuItem(dish.id, { spice_level: parseInt(e.target.value, 10) })}
                          className="bg-ivory-50 border border-ivory-300 rounded-lg p-1.5 text-xs font-bold"
                        >
                          <option value={0}>0 (No Heat)</option>
                          <option value={1}>1 (Mild Aroma)</option>
                          <option value={2}>2 (Gentle)</option>
                          <option value={3}>3 (Authentic Heat)</option>
                          <option value={4}>4 (Bold)</option>
                          <option value={5}>5 (Fiery)</option>
                        </select>
                      </td>
                      <td className="p-3 min-w-[280px]">
                        <input
                          type="text"
                          value={dish.chef_notes || ''}
                          onChange={(e) => updateMenuItem(dish.id, { chef_notes: e.target.value })}
                          placeholder="Secret preparation lore..."
                          className="w-full bg-ivory-50 border border-ivory-300 rounded-lg p-1.5 text-xs text-charcoal-900"
                        />
                      </td>
                      <td className="p-3 min-w-[120px]">
                        <input
                          type="text"
                          value={dish.allergens.join(', ')}
                          onChange={(e) => updateMenuItem(dish.id, { allergens: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          placeholder="e.g. Nuts, Dairy"
                          className="w-full bg-ivory-50 border border-ivory-300 rounded-lg p-1.5 text-xs text-charcoal-900"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleAutoSuggestSecret(dish)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg"
                          title="Auto-draft story"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* MODE 3: CHEF & OWNER LORE & VOICE STYLE                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {viewMode === 'lore' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-ivory-200 shadow-subtle space-y-6">
            <div className="border-b border-ivory-200 pb-4">
              <h3 className="font-serif font-bold text-2xl text-charcoal-900">Executive Chef & Founder Personality</h3>
              <p className="text-xs text-charcoal-700/70 mt-1">
                Configure the background, voice tone, and signature pairings that make your AI concierge sound like your restaurant's founders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chef Credentials */}
              <div className="space-y-4 bg-amber-50/50 border border-amber-200 p-5 rounded-3xl">
                <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-700" /> Head Chef Credentials
                </h4>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Chef Full Name</label>
                  <input
                    type="text"
                    value={persona.chef_name}
                    onChange={(e) => setPersona({ ...persona, chef_name: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Official Culinary Title</label>
                  <input
                    type="text"
                    value={persona.chef_title}
                    onChange={(e) => setPersona({ ...persona, chef_title: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Chef Bio & Heritage Background</label>
                  <textarea
                    rows={2}
                    value={persona.chef_bio}
                    onChange={(e) => setPersona({ ...persona, chef_bio: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Kitchen Standards & Philosophy</label>
                  <textarea
                    rows={2}
                    value={persona.chef_philosophy}
                    onChange={(e) => setPersona({ ...persona, chef_philosophy: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>
              </div>

              {/* Owner Lore */}
              <div className="space-y-4 bg-orange-50/50 border border-orange-200 p-5 rounded-3xl">
                <h4 className="font-bold text-sm text-orange-950 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-orange-700" /> Owner Hospitality & Voice
                </h4>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Founder / Owner Name(s)</label>
                  <input
                    type="text"
                    value={persona.owner_name}
                    onChange={(e) => setPersona({ ...persona, owner_name: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">AI Voice Style</label>
                  <select
                    value={persona.greeting_tone}
                    onChange={(e: any) => setPersona({ ...persona, greeting_tone: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  >
                    <option value="warm_traditional">Warm Traditional ('Atithi Devo Bhava')</option>
                    <option value="bistro_cozy">Cozy European Trattoria / Bistro</option>
                    <option value="fine_dining_artisan">Artisanal Fine Dining Sommelier</option>
                    <option value="modern_chic">Modern Chic & Fast-Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Welcome Message to Guests</label>
                  <textarea
                    rows={2}
                    value={persona.owner_hospitality_note}
                    onChange={(e) => setPersona({ ...persona, owner_hospitality_note: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Spice Scale Description (1 to 5)</label>
                  <input
                    type="text"
                    value={persona.spice_guidance}
                    onChange={(e) => setPersona({ ...persona, spice_guidance: e.target.value })}
                    className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-ivory-200">
              <button
                onClick={handleSaveAll}
                className="px-6 py-3 bg-saffron-600 hover:bg-saffron-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" /> Save & Train Persona
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* MODE 4: LIVE AI PLAYGROUND & TEST CONSOLE                          */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {viewMode === 'test' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle space-y-3">
                <h3 className="font-serif font-bold text-base text-charcoal-900">Test Prompts to Try</h3>
                <p className="text-xs text-charcoal-700/70">Click any prompt to test how the AI answers using your trained dish secrets:</p>
                <div className="space-y-2">
                  {[
                    `Tell me a secret about ${currentMenuItems[0]?.name || 'your signature dish'}`,
                    `How spicy is ${currentMenuItems[1]?.name || 'the curry'}?`,
                    `What beverage pairs best with ${currentMenuItems[0]?.name || 'the main course'}?`,
                    `What are Chef ${persona.chef_name}'s vegetarian recommendations?`,
                    `Are there any nut or gluten allergens in your menu?`
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestInput(p)}
                      className="w-full text-left p-2.5 rounded-xl bg-ivory-50 hover:bg-orange-50 text-xs font-semibold text-charcoal-800 border border-ivory-200 hover:border-orange-300 transition-colors"
                    >
                      💬 {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white rounded-3xl border border-ivory-200 shadow-subtle p-5 flex flex-col h-[520px]">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-serif font-bold text-sm text-charcoal-900">
                    Live Concierge Simulation ({restaurant.name})
                  </span>
                </div>
                <button
                  onClick={() => setTestMessages([{ role: 'assistant', text: `Namaste! I am the AI Concierge for ${restaurant.name}. How can I assist you?` }])}
                  className="text-[10px] font-bold text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Chat
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {testMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-saffron-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-ivory-100 text-charcoal-900 rounded-bl-xs border border-ivory-200'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleTestChatSubmit} className="pt-3 border-t border-ivory-200 flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder={`Ask anything about ${restaurant.name}'s menu...`}
                  className="flex-1 bg-ivory-50 border border-ivory-200 rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
