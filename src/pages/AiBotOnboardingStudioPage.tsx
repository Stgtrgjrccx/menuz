import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ChefHat, Heart, BookOpen, GlassWater, Download,
  Printer, Check, Save, MessageSquare, Share2, Copy, Send,
  Mic, MicOff, Plus, Trash2, ArrowLeft, RefreshCw, Flame,
  AlertCircle, Table as TableIcon, Layers, Sliders, CheckCircle2,
  ExternalLink, Mail, Star, Award, Zap, Tag, Eye, Info, X,
  Utensils, HelpCircle, FileText, CheckCheck, Compass, Radio,
  Clock, ShieldCheck, Smile, Gift
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { ChefOwnerAiPersona, MenuItem, MenuCategory, isWorkingWithMenuz } from '../types';

export const AiBotOnboardingStudioPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const addMenuItem = useRestaurantStore((state) => state.addMenuItem);
  const updateMenuItem = useRestaurantStore((state) => state.updateMenuItem);
  const addCategory = useRestaurantStore((state) => state.addCategory);

  const activeWorkingRestaurants = restaurants.filter((r) => isWorkingWithMenuz(r));
  const currentMenuItems = menuItems.filter((i) => i.restaurant_id === restaurant.id);
  const currentCategories = categories.filter((c) => c.restaurant_id === restaurant.id);

  // Active View Modes: 'cards' | 'specials' | 'matrix' | 'lore' | 'test'
  const [viewMode, setViewMode] = useState<'cards' | 'specials' | 'matrix' | 'lore' | 'test'>('cards');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [dishFilterType, setDishFilterType] = useState<'all' | 'chef_fav' | 'specials' | 'bestsellers' | 'missing_lore'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Voice simulation state
  const [recordingDishId, setRecordingDishId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Today's Freshness Broadcast
  const [dailyFreshHighlight, setDailyFreshHighlight] = useState(
    'Slow-simmered Rogan Josh batch started at 4:30 AM with fresh Kashmiri morels & whole mace'
  );
  const [isEditingFreshness, setIsEditingFreshness] = useState(false);

  // Add Dish Modal State
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(currentCategories[0]?.id || '');
  const [newDishPrice, setNewDishPrice] = useState('350');
  const [newDishType, setNewDishType] = useState<'food' | 'drink'>('food');
  const [newDishDietary, setNewDishDietary] = useState<string[]>(['Vegetarian']);
  const [newDishSpice, setNewDishSpice] = useState(2);
  const [newDishIsSpecial, setNewDishIsSpecial] = useState(false);
  const [newDishIsChefFav, setNewDishIsChefFav] = useState(false);
  const [autoGenOnCreate, setAutoGenOnCreate] = useState(true);

  // Custom FAQs Trainer State
  const [customFaqs, setCustomFaqs] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'Do you use MSG or artificial food coloring?',
      a: 'Zero MSG and zero synthetic food coloring. We use cold-pressed mustard oil, vine-ripened tomatoes, and natural Kashmiri saffron.'
    },
    {
      q: 'Is all meat 100% Halal certified?',
      a: 'Yes, all our poultry and lamb are 100% Halal certified from audited regional suppliers.'
    },
    {
      q: 'Can the kitchen accommodate low-oil or low-salt for elders?',
      a: 'Absolutely! Our chefs prepare made-to-order portions with reduced salt or cold-pressed ghee upon request.'
    },
    {
      q: 'Do you offer birthday or anniversary celebrations?',
      a: 'Yes! We provide complimentary celebratory dessert sparklers and personalized table greetings.'
    }
  ]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Persona state
  const defaultPersona: ChefOwnerAiPersona = restaurant.ai_persona || {
    chef_name: 'Executive Head Chef',
    chef_title: 'Executive Head Chef & Culinary Director',
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

  // Test Chat state
  const [testMessages, setTestMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; dishHighlights?: MenuItem[] }>>([
    {
      role: 'assistant',
      text: `Namaste! I am the AI Concierge for ${restaurant.name}, trained directly with Head Chef ${persona.chef_name || 'Sanjay'} and Owner ${persona.owner_name || 'Vikram'}.\n\n✨ *Today's Kitchen Highlight:* ${dailyFreshHighlight}\n\nAsk me about our Chef's Favourites, House Specials, 18-hour slow-cooked secrets, spice heat calibrations (1-5), wine/cocktail pairings, or dietary guidelines!`
    }
  ]);
  const [testInput, setTestInput] = useState('');

  // Metrics calculation
  const totalDishes = currentMenuItems.length;
  const chefFavCount = currentMenuItems.filter((d) => d.is_chef_recommended).length;
  const specialCount = currentMenuItems.filter((d) => d.is_signature).length;
  const bestsellerCount = currentMenuItems.filter((d) => d.is_bestseller).length;
  const loreCompleteCount = currentMenuItems.filter((d) => d.chef_notes && d.chef_notes.trim().length > 10).length;
  const aiReadinessPercent = totalDishes > 0 ? Math.round((loreCompleteCount / totalDishes) * 100) : 0;

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return currentMenuItems.filter((dish) => {
      const matchCat = selectedCatId === 'all' || dish.category_id === selectedCatId;
      const matchSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.chef_notes && dish.chef_notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchType = true;
      if (dishFilterType === 'chef_fav') matchType = !!dish.is_chef_recommended;
      else if (dishFilterType === 'specials') matchType = !!dish.is_signature;
      else if (dishFilterType === 'bestsellers') matchType = !!dish.is_bestseller;
      else if (dishFilterType === 'missing_lore') matchType = !dish.chef_notes || dish.chef_notes.trim().length < 10;

      return matchCat && matchSearch && matchType;
    });
  }, [currentMenuItems, selectedCatId, searchQuery, dishFilterType]);

  // Handle Quick Auto-Generate Secret for a dish
  const handleAutoSuggestSecret = (dish: MenuItem) => {
    const name = dish.name.toLowerCase();
    let suggestedSecret = '';
    let suggestedStory = '';
    let suggestedPitch = '';
    let suggestedPairing = '';
    let suggestedPairingReason = '';
    let suggestedTemp = 'Served piping hot in traditional tableware';

    if (name.includes('butter chicken') || name.includes('murg')) {
      suggestedSecret = 'Tandoor-charred chicken simmered for 8 hours in vine-ripened tomato coulis with slow-churned white makkhan and crushed sun-dried fenugreek.';
      suggestedStory = `Chef ${persona.chef_name} perfected this recipe using an 80-year-old family ratio of smoked Kashmiri mirch and hand-pounded mace.`;
      suggestedPitch = 'Our all-time crowd pleaser — velvety, naturally sweet from vine tomatoes, with zero synthetic food coloring.';
      suggestedPairing = 'Butter Garlic Naan & Salted Jeera Chaas';
      suggestedPairingReason = 'Crispy garlic crust scoops the velvet gravy, while cold cumin buttermilk refreshes the palate.';
      suggestedTemp = 'Piping hot in seasoned brass bowl with melted white butter';
    } else if (name.includes('dal') || name.includes('lentil') || name.includes('makhani')) {
      suggestedSecret = 'Slow-simmered continuously for 36 hours over glowing charcoal embers with cultured dairy butter and crushed ginger.';
      suggestedStory = 'Simmered overnight without rushing so the black urad lentils break down into pure creaminess.';
      suggestedPitch = 'The soul of our kitchen. No heavy cream fillers — just pure 36-hour slow thermal breakdown.';
      suggestedPairing = 'Smoked Tandoori Roti & Masala Chaas';
      suggestedPairingReason = 'Charred whole wheat cuts the richness seamlessly.';
      suggestedTemp = 'Simmering hot in clay handi';
    } else if (name.includes('biryani') || name.includes('rice')) {
      suggestedSecret = 'Aged 2-year royal Basmati sealed with whole cloves, star anise, and saffron-infused whole milk in heavy copper deghs under dough purdah.';
      suggestedStory = 'Cooked using authentic Dum Pukht technique where aromatics mature in their own steam.';
      suggestedPitch = 'Every single grain stays unbroken and fragrant with pure saffron and ghee.';
      suggestedPairing = 'Burani Garlic Raita & Mirchi Ka Salan';
      suggestedPairingReason = 'Garlic raita balances the intense whole-spice aromatics.';
      suggestedTemp = 'Freshly unsealed table-side with hot steam release';
    } else if (name.includes('paneer') || name.includes('tikka')) {
      suggestedSecret = 'Double-marinated fresh malai paneer steeped in hung curd, yellow mustard oil, and hand-crushed Ajwain seeds for 6 hours.';
      suggestedStory = 'Sourced fresh every morning from local dairy partners and charred in high-heat clay tandoor.';
      suggestedPitch = 'Melt-in-the-mouth tenderness with genuine charcoal-kissed edges.';
      suggestedPairing = 'Mint Coriander Chutney & Spiced Virgin Mojito';
      suggestedPairingReason = 'Zesty mint and lime lift the roasted mustard marinade.';
      suggestedTemp = 'Sizzling hot off iron skewers';
    } else if (name.includes('pizza') || name.includes('margherita') || name.includes('truffle')) {
      suggestedSecret = '72-hour cold-fermented Caputo Tipo 00 dough blistered at 480°C in an artisanal volcanic stone oven.';
      suggestedStory = 'Imported San Marzano DOP tomatoes crushed raw with fresh sweet basil and extra virgin olive oil.';
      suggestedPitch = 'Airy, leopard-spotted crust with incredible digestive lightness and deep aroma.';
      suggestedPairing = 'San Pellegrino Sparkling Citrus or House Red';
      suggestedPairingReason = 'Crisp mineral effervescence balances the rich molten fior di latte.';
      suggestedTemp = 'Blistering hot straight out of wood-fired oven';
    } else if (name.includes('pasta') || name.includes('tagliatelle') || name.includes('gnocchi')) {
      suggestedSecret = 'Hand-extruded through bronze dies every morning using pasture-raised organic egg yolks and semolina.';
      suggestedStory = 'Bronze die extrusion creates microscopic ridges that hold every drop of emulsified sauce.';
      suggestedPitch = 'True Italian al dente texture that commercially manufactured dried pasta cannot match.';
      suggestedPairing = 'Garlic Rosemary Focaccia & Sparkling Elderflower Cooler';
      suggestedPairingReason = 'Focaccia cleans the remaining emulsion sauce.';
      suggestedTemp = 'Freshly plated and finished with 24-month aged Parmigiano Reggiano';
    } else if (dish.item_type === 'drink') {
      suggestedSecret = 'Cold-steeped botanicals, freshly crushed seasonal fruits, and house-made aromatic spice reductions.';
      suggestedStory = 'Crafted to cleanse the palate and enhance the spice notes of our mains.';
      suggestedPitch = 'Zero artificial syrups or preservatives — pure extracted vitality.';
      suggestedPairing = 'Tandoori Starters & Artisan Breads';
      suggestedPairingReason = 'Chilled botanicals contrast beautifully with warm spices.';
      suggestedTemp = 'Ice cold in chilled glassware with fresh botanical sprig';
    } else {
      suggestedSecret = `Handcrafted daily from scratch using ${dish.ingredients.slice(0, 3).join(', ')} and our chef's secret heirloom spice blend.`;
      suggestedStory = `Generational recipe curated by Chef ${persona.chef_name} to celebrate genuine regional roots.`;
      suggestedPitch = 'Prepared fresh upon order with zero pre-made commercial bases.';
      suggestedPairing = 'House Signature Beverage';
      suggestedPairingReason = 'Enhances the underlying aromatic notes of the dish.';
      suggestedTemp = 'Piping hot and freshly garnished';
    }

    updateMenuItem(dish.id, {
      chef_notes: suggestedSecret,
      chef_story: suggestedStory,
      owner_pitch: suggestedPitch,
      pairing_drink_name: suggestedPairing,
      pairing_reason: suggestedPairingReason,
      temperature_style: suggestedTemp
    });
  };

  // Preset Template Applicator
  const handleApplyPresetTemplate = (dish: MenuItem, presetKey: string) => {
    if (presetKey === 'royal_awadhi') {
      updateMenuItem(dish.id, {
        chef_notes: '18-hour slow dum simmer in heavy copper handi with hand-ground mace, royal saffron, and stone flower.',
        chef_story: 'Inspired by the royal Awadhi Dastarkhwan courts where patience is the primary ingredient.',
        owner_pitch: 'Our supreme culinary masterpiece — opulent, velvety, and intensely aromatic.',
        pairing_drink_name: 'Shahi Kesar Badam Chaas',
        pairing_reason: 'Rich almond and saffron buttermilk elevates the slow-braised meat aromatics.',
        temperature_style: 'Steaming in copper vessel',
        spice_level: 2
      });
    } else if (presetKey === 'tandoor_charcoal') {
      updateMenuItem(dish.id, {
        chef_notes: 'Double-marinated in Kashmiri deghi mirch, mustard oil, and rock salt, roasted at 500°C over charcoal.',
        chef_story: 'Smoked using dried neem wood embers for an authentic earthy wood-smoke depth.',
        owner_pitch: 'Juicy core with crisp caramelized charred edges. Best enjoyed straight off the skewers.',
        pairing_drink_name: 'Zesty Smoked Cumin Nimbu Soda',
        pairing_reason: 'Sparkling citrus cuts through the rich roasted crust.',
        temperature_style: 'Sizzling on cast iron skillet',
        spice_level: 3
      });
    } else if (presetKey === 'coastal_coconut') {
      updateMenuItem(dish.id, {
        chef_notes: 'Freshly grated coconut milk simmered with wild kokum rinds, curry leaves, and Byadgi chilies.',
        chef_story: 'Traditional Konkani recipe balancing gentle sweetness of coconut with tangy wild kokum.',
        owner_pitch: 'Light on the stomach yet deeply flavorful with a gorgeous natural red hue.',
        pairing_drink_name: 'Fresh Solkadhi or Tender Coconut Punch',
        pairing_reason: 'Authentic coastal pairing that aids digestion.',
        temperature_style: 'Warm in traditional clay bowl',
        spice_level: 2
      });
    } else if (presetKey === 'artisan_dessert') {
      updateMenuItem(dish.id, {
        chef_notes: 'Slow-reduced organic whole milk, Persian saffron pistils, green cardamom, and golden pistachio slivers.',
        chef_story: 'Handcrafted over 4 hours with minimal organic unrefined sugar for delicate sweetness.',
        owner_pitch: 'The perfect concluding memory to your meal. Luxurious without being overly sweet.',
        pairing_drink_name: 'Masala Kahwa Green Tea',
        pairing_reason: 'Spiced hot tea gently cleanses the palate after dessert.',
        temperature_style: 'Chilled in earthen matka',
        spice_level: 0
      });
    }
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

  // Voice simulation
  const handleToggleVoiceDictation = (dishId: string) => {
    if (recordingDishId === dishId) {
      setRecordingDishId(null);
    } else {
      setRecordingDishId(dishId);
      setTimeout(() => {
        const dish = currentMenuItems.find((d) => d.id === dishId);
        if (dish) {
          const simulatedVoiceNotes = `[Voice Transcribed by Chef ${persona.chef_name}]: We source whole spices weekly, hand-pound them on stone silbatta, and roast in slow-churned desi ghee. Never use store-bought garam masala. Guests love the authentic warmth!`;
          updateMenuItem(dish.id, {
            chef_notes: (dish.chef_notes ? dish.chef_notes + ' ' : '') + simulatedVoiceNotes
          });
        }
        setRecordingDishId(null);
      }, 2500);
    }
  };

  // Add New Dish Handler
  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newId = `dish-custom-${Date.now()}`;
    const newDish: MenuItem = {
      id: newId,
      restaurant_id: restaurant.id,
      category_id: newDishCategory || currentCategories[0]?.id || 'cat-general',
      name: newDishName.trim(),
      item_type: newDishType,
      price: parseFloat(newDishPrice) || 350,
      short_description: `Freshly prepared ${newDishName} handcrafted in house.`,
      ingredients: ['Fresh herbs', 'Special spices', 'Artisan base'],
      allergens: [],
      dietary_flags: newDishDietary,
      spice_level: newDishSpice,
      serving_size: 'Serves 1-2',
      image_url: newDishType === 'drink'
        ? 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      is_signature: newDishIsSpecial,
      is_chef_recommended: newDishIsChefFav,
      is_bestseller: false,
      pairing_item_ids: [],
      sort_order: currentMenuItems.length + 1
    };

    addMenuItem(newDish);

    if (autoGenOnCreate) {
      setTimeout(() => {
        handleAutoSuggestSecret(newDish);
      }, 100);
    }

    setIsAddDishModalOpen(false);
    setNewDishName('');
    setNewDishPrice('350');
    setNewDishIsSpecial(false);
    setNewDishIsChefFav(false);
  };

  // Save Persona
  const handleSavePersona = () => {
    updateRestaurant(restaurant.id, { ai_persona: persona });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const intakeUrl = window.location.href;
    const msg = encodeURIComponent(
      `*MENUZ AI Bot Dish Intake Studio — ${restaurant.name}*\n\n` +
      `Namaste Chef ${persona.chef_name} & ${persona.owner_name}!\n\n` +
      `Please review and fill in our culinary secrets, Chef's Favourites, and spice calibrations for our AI dining bot:\n` +
      `👉 ${intakeUrl}\n\n` +
      `Includes 1-Click AI Auto-Drafting, voice note dictation, and printable PDF options.`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  // Email share
  const handleEmailShare = () => {
    const intakeUrl = window.location.href;
    const subject = encodeURIComponent(`MENUZ Chef & Owner AI Intake Studio — ${restaurant.name}`);
    const body = encodeURIComponent(
      `Hello Chef ${persona.chef_name} & ${persona.owner_name},\n\n` +
      `Here is the link to complete our personalized AI Concierge intake form with secrets for each dish in the menu:\n\n` +
      `${intakeUrl}\n\n` +
      `You can use 1-Click Auto-Drafting, voice dictation, or export as PDF.\n\n` +
      `Best regards,\nMENUZ Operations Team`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Interactive Test Bot Response Engine
  const handleSendTestQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg = { role: 'user' as const, text: queryText };
    setTestMessages((prev) => [...prev, userMsg]);
    setTestInput('');

    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let reply = '';
      let matchedDishes: MenuItem[] = [];

      const chefFavs = currentMenuItems.filter((d) => d.is_chef_recommended);
      const houseSpecials = currentMenuItems.filter((d) => d.is_signature);
      const bestsellers = currentMenuItems.filter((d) => d.is_bestseller);

      // Check for FAQ match
      const matchedFaq = customFaqs.find(f => lower.includes(f.q.toLowerCase().slice(0, 15)) || f.q.toLowerCase().split(' ').some(w => w.length > 4 && lower.includes(w)));

      if (lower.includes('fresh') || lower.includes('today') || lower.includes('morning')) {
        reply = `🌅 **Today's Kitchen Freshness Broadcast (from Chef ${persona.chef_name}):**\n\n"${dailyFreshHighlight}"\n\nOur kitchen prepares every base fresh daily at sunrise with zero day-old reheats.`;
        matchedDishes = chefFavs.slice(0, 2);
      } else if (matchedFaq) {
        reply = `🛡️ **Kitchen Policy & Guest Assurance:**\n\n**Q: ${matchedFaq.q}**\n**A:** ${matchedFaq.a}`;
      } else if (lower.includes('chef') && (lower.includes('favourite') || lower.includes('favorite') || lower.includes('recommend') || lower.includes('special'))) {
        if (chefFavs.length > 0) {
          reply = `🌟 **Head Chef ${persona.chef_name}'s Personal Favourites:**\n\n` +
            `*"${persona.chef_philosophy}"*\n\n` +
            chefFavs.map((d) => `• **${d.name}** (₹${d.price}): ${d.chef_notes || d.short_description}\n  *Chef's Note:* "${d.chef_story || persona.chef_philosophy}"\n  *Recommended Pairing:* ${d.pairing_drink_name || 'Chef Specialty Beverage'}`).join('\n\n');
          matchedDishes = chefFavs.slice(0, 3);
        } else {
          reply = `Chef ${persona.chef_name} highly recommends trying our freshest daily specialties prepared according to our philosophy: "${persona.chef_philosophy}".`;
          matchedDishes = currentMenuItems.slice(0, 2);
        }
      } else if (lower.includes('special') || lower.includes('signature') || lower.includes('bestseller') || lower.includes('must try')) {
        const list = houseSpecials.length > 0 ? houseSpecials : (bestsellers.length > 0 ? bestsellers : currentMenuItems.slice(0, 3));
        reply = `🔥 **Our House Specials & Signatures at ${restaurant.name}:**\n\n` +
          list.map((d) => `• **${d.name}** (₹${d.price}) [Spice ${d.spice_level}/5]:\n  ${d.owner_pitch || d.short_description}\n  *Secret Preparation:* ${d.chef_notes || 'Handcrafted daily'}`).join('\n\n');
        matchedDishes = list.slice(0, 3);
      } else if (lower.includes('date') || lower.includes('couple') || lower.includes('romantic')) {
        const romanticStarters = currentMenuItems.filter(d => d.is_chef_recommended || d.price > 400).slice(0, 2);
        const romanticDrinks = currentMenuItems.filter(d => d.item_type === 'drink').slice(0, 2);
        reply = `🥂 **Romantic Dinner & Date Night Curation (by Owner ${persona.owner_name}):**\n\n` +
          `We recommend starting with our delicate charred appetizers, followed by slow-simmered handi mains and signature handcrafted coolers:\n\n` +
          romanticStarters.map(d => `• **${d.name}** (₹${d.price}): ${d.chef_story || d.short_description}`).join('\n') +
          `\n\n✨ *Special Touch:* Let us know if you are celebrating an anniversary for complimentary table sparklers!`;
        matchedDishes = [...romanticStarters, ...romanticDrinks].slice(0, 3);
      } else if (lower.includes('family') || lower.includes('kids') || lower.includes('toddler') || lower.includes('grandparent')) {
        const mildDishes = currentMenuItems.filter(d => d.spice_level <= 1).slice(0, 3);
        reply = `👨‍👩‍👧‍👦 **Family & Multi-Generational Feast Selection:**\n\n` +
          `For kids and elders, our kitchen prepares gentler, velvety dishes with zero harsh spices:\n\n` +
          mildDishes.map(d => `• **${d.name}** (₹${d.price}) [Spice ${d.spice_level}/5 - Mild]: ${d.short_description}`).join('\n') +
          `\n\nOur kitchen can easily reduce salt or churn mild lassis upon request.`;
        matchedDishes = mildDishes;
      } else if (lower.includes('quick') || lower.includes('fast') || lower.includes('corporate') || lower.includes('30 min')) {
        const fastDishes = currentMenuItems.filter(d => d.category_id.includes('starter') || d.category_id.includes('tandoor') || d.price < 400).slice(0, 3);
        reply = `⚡ **Fast 30-Minute Business Lunch Recommendations:**\n\n` +
          `These high-speed kitchen items fire and serve in under 10-12 minutes:\n\n` +
          fastDishes.map(d => `• **${d.name}** (₹${d.price}): Ready in ~10 mins`).join('\n');
        matchedDishes = fastDishes;
      } else if (lower.includes('spice') || lower.includes('spicy') || lower.includes('mild')) {
        const mildDishes = currentMenuItems.filter((d) => d.spice_level <= 1);
        const fieryDishes = currentMenuItems.filter((d) => d.spice_level >= 4);

        if (lower.includes('mild') || lower.includes('not spicy') || lower.includes('less spice') || lower.includes('sweet')) {
          reply = `🌿 **Mild & Aromatic Recommendations (Spice 0-1/5):**\n\n` +
            mildDishes.slice(0, 3).map((d) => `• **${d.name}** (₹${d.price}): ${d.short_description}`).join('\n') +
            `\n\n${persona.spice_guidance}`;
          matchedDishes = mildDishes.slice(0, 3);
        } else {
          reply = `🌶️ **Spice Guidance at ${restaurant.name}:**\n${persona.spice_guidance}\n\n` +
            (fieryDishes.length > 0 ? `For heat lovers, try **${fieryDishes.map((d) => d.name).join(', ')}** (Spice 4-5/5)!` : 'We can calibrate heat on request.');
          matchedDishes = fieryDishes.slice(0, 2);
        }
      } else if (lower.includes('pair') || lower.includes('drink') || lower.includes('wine') || lower.includes('beer') || lower.includes('beverage')) {
        const dishesWithPairings = currentMenuItems.filter((d) => d.pairing_drink_name);
        if (dishesWithPairings.length > 0) {
          reply = `🍷 **Chef & Sommelier Curated Pairings:**\n\n` +
            dishesWithPairings.slice(0, 3).map((d) => `• **${d.name}** ➔ Pair with **${d.pairing_drink_name}**\n  *Why:* ${d.pairing_reason || 'Balances richness and lifts aromatics.'}`).join('\n\n');
          matchedDishes = dishesWithPairings.slice(0, 3);
        } else {
          reply = `Our team recommends pairing rich mains with traditional lassis, fresh lime sodas, or craft mocktails to balance the aromatics.`;
        }
      } else if (lower.includes('jain') || lower.includes('vegan') || lower.includes('gluten') || lower.includes('allergy')) {
        const safeDishes = currentMenuItems.filter((d) => {
          if (lower.includes('jain')) return d.dietary_flags.includes('Jain') || d.dietary_flags.includes('Vegetarian');
          if (lower.includes('vegan')) return d.dietary_flags.includes('Vegan');
          if (lower.includes('gluten')) return d.dietary_flags.includes('Gluten-Free');
          return d.allergens.length === 0;
        });

        reply = `🛡️ **Dietary & Allergen Guidance:**\n${persona.dietary_rules}\n\n` +
          `Safe selections: **${safeDishes.slice(0, 3).map((d) => d.name).join(', ')}**. Our kitchen strictly isolates preparation areas.`;
        matchedDishes = safeDishes.slice(0, 3);
      } else {
        // Find dish match
        const matchingDish = currentMenuItems.find((d) => lower.includes(d.name.toLowerCase()));
        if (matchingDish) {
          reply = `🍽️ **${matchingDish.name}** (₹${matchingDish.price})\n\n` +
            `• **Chef's Secret Technique:** ${matchingDish.chef_notes || 'Handcrafted daily from authentic regional spices.'}\n` +
            `• **Origin Story:** ${matchingDish.chef_story || `Curated by Chef ${persona.chef_name} using heirloom cooking methods.`}\n` +
            `• **Owner's Table Note:** "${matchingDish.owner_pitch || persona.owner_hospitality_note}"\n` +
            `• **Spice Intensity:** ${matchingDish.spice_level}/5 (${matchingDish.spice_level <= 1 ? 'Mild & aromatic' : matchingDish.spice_level === 2 ? 'Gentle warmth' : matchingDish.spice_level === 3 ? 'Traditional heat' : 'Fiery heat'})\n` +
            `• **Best Paired With:** ${matchingDish.pairing_drink_name || 'Cardamom Saffron Chaas'}` +
            (matchingDish.pairing_reason ? ` (${matchingDish.pairing_reason})` : '') +
            `\n• **Serving Style:** ${matchingDish.temperature_style || 'Piping hot'}`;
          matchedDishes = [matchingDish];
        } else {
          reply = `As Head Chef ${persona.chef_name} and Owner ${persona.owner_name} believe: "${persona.chef_philosophy}".\n\nI can tell you exact secrets of any dish on our menu, explain allergens, or suggest what pairs best with your meal. Which dish would you like to explore?`;
          matchedDishes = currentMenuItems.slice(0, 3);
        }
      }

      setTestMessages((prev) => [...prev, { role: 'assistant', text: reply, dishHighlights: matchedDishes }]);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 pb-24">
      {/* ── Top Navigation & Restaurant Selector Bar ──────────────────────── */}
      <header className="bg-[#0A0E17]/90 backdrop-blur-md text-white border-b border-white/[0.08] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-[#090D16]/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-xl border border-white/[0.08] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore Demos</span>
            </Link>
            <div className="h-4 w-px bg-[#090D16]/[0.1]" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>Chef &amp; Owner AI Training Studio</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    v2.5
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">
                  Granular Dish Secrets, Chef's Favourites, Daily Freshness &amp; Voice Onboarding
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Always-Visible Admin Page Top Button */}
            <Link
              to="/admin"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/15 hover:bg-amber-500/25 px-3.5 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-400/60 shadow-sm cursor-pointer active:scale-95"
              title="Open Master Admin Control Hub"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin HQ</span>
            </Link>

            {/* Restaurant Switcher */}
            <div className="flex items-center space-x-1.5 bg-[#0D1322] px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <span className="text-xs text-slate-400 font-medium">Venue:</span>
              <select
                value={restaurant.id}
                onChange={(e) => {
                  setCurrentRestaurant(e.target.value);
                  const sel = restaurants.find((r) => r.id === e.target.value);
                  if (sel?.ai_persona) setPersona(sel.ai_persona);
                }}
                className="bg-transparent text-xs font-bold text-amber-300 focus:outline-hidden cursor-pointer"
              >
                {activeWorkingRestaurants.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#090D16] text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <button
              type="button"
              onClick={() => setIsAddDishModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dish</span>
            </button>

            <button
              type="button"
              onClick={handleAutoFillAllMissingSecrets}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Automatically generate chef notes and stories for all dishes missing them"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auto-Draft All Secrets</span>
              <span className="sm:hidden">Auto-Draft</span>
            </button>

            <button
              type="button"
              onClick={handleSavePersona}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-green-600 hover:bg-green-500 text-white px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Saved!' : 'Save & Publish'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Daily Kitchen Freshness Broadcast Flash Banner ────────────────── */}
      <section className="bg-amber-500/15 border-b border-amber-300/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-amber-700" />
              Today's Kitchen Freshness Broadcast:
            </span>
          </div>

          <div className="flex-1 max-w-2xl">
            {isEditingFreshness ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dailyFreshHighlight}
                  onChange={(e) => setDailyFreshHighlight(e.target.value)}
                  className="w-full text-xs bg-[#090D16] border border-amber-400 rounded-xl px-3 py-1 font-bold text-amber-950"
                />
                <button
                  type="button"
                  onClick={() => setIsEditingFreshness(false)}
                  className="text-xs bg-amber-600 text-white px-3 py-1 rounded-xl font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-xs font-bold text-amber-950/90 italic cursor-pointer hover:underline" onClick={() => setIsEditingFreshness(true)}>
                "{dailyFreshHighlight}"
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsEditingFreshness(!isEditingFreshness)}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline self-end sm:self-auto"
          >
            {isEditingFreshness ? 'Done' : 'Edit Today\'s Batch'}
          </button>
        </div>
      </section>

      {/* ── Status & Share Strip ──────────────────────────────────────────── */}
      <section className="bg-[#0D1322] border-b border-white/[0.08] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
            {/* Stat 1: Total Dishes */}
            <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.08]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Total Dishes</span>
              <span className="text-xl font-black font-mono text-white">{totalDishes}</span>
            </div>

            {/* Stat 2: Chef's Favourites */}
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block flex items-center gap-1 font-mono">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                Chef's Favs
              </span>
              <span className="text-xl font-black font-mono text-amber-300">{chefFavCount}</span>
            </div>

            {/* Stat 3: House Specials */}
            <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20">
              <span className="text-[10px] uppercase font-bold text-orange-300 tracking-wider block flex items-center gap-1 font-mono">
                <Flame className="w-3 h-3 text-orange-400" />
                Specials
              </span>
              <span className="text-xl font-black font-mono text-orange-300">{specialCount}</span>
            </div>

            {/* Stat 4: AI Lore Readiness */}
            <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                AI Lore Ready
              </span>
              <span className="text-xl font-black font-mono text-emerald-300">{aiReadinessPercent}%</span>
            </div>

            {/* Multi-Platform Sharing Tools */}
            <div className="col-span-2 lg:col-span-2 flex items-center justify-end gap-2 bg-[#090D16]/[0.04] text-white p-2.5 rounded-2xl border border-white/[0.08]">
              <span className="text-xs text-slate-300 font-medium mr-1 hidden sm:inline">Share Intake:</span>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="inline-flex items-center space-x-1 text-xs font-bold bg-green-600 hover:bg-green-500 text-white px-2.5 py-1.5 rounded-xl transition-all"
                title="Send intake questionnaire to Chef or Owner on WhatsApp"
              >
                <Share2 className="w-3 h-3" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handleEmailShare}
                className="inline-flex items-center space-x-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-xl transition-all"
                title="Send questionnaire via email"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1 text-xs font-bold bg-[#0D1322] hover:bg-white/[0.06] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-white/[0.08] transition-all"
                title="Download / Print PDF Questionnaire"
              >
                <Download className="w-3 h-3" />
                <span>PDF Sheet</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1 text-xs font-bold bg-[#0D1322] hover:bg-white/[0.06] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-white/[0.08] transition-all"
                title="Copy Intake URL"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedLink ? 'Copied!' : 'Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio Mode Tabs & Filters ────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#090D16] p-3.5 rounded-3xl border border-white/[0.08] shadow-sm">
          {/* Main Studio View Mode Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#090D16] text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/[0.04]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Dish-by-Dish Intake Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('specials')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                viewMode === 'specials'
                  ? 'bg-[#090D16] text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/[0.04]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Specials &amp; Chef's Favourites ({chefFavCount + specialCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#090D16] text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/[0.04]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Speed Matrix Table</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('lore')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                viewMode === 'lore'
                  ? 'bg-[#090D16] text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/[0.04]'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Chef &amp; Owner Lore &amp; Personality</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('test')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                viewMode === 'test'
                  ? 'bg-[#090D16] text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/[0.04]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-green-400" />
              <span>Live Concierge Playground</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search dish or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#090D16]/[0.04] border border-white/[0.08] rounded-2xl pl-3 pr-8 py-2 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-400 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Sub-Filter Bar (Category & Highlight Types) ───────────────────── */}
        {(viewMode === 'cards' || viewMode === 'specials' || viewMode === 'matrix') && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D1322] p-3 rounded-2xl border border-white/[0.08]">
            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDishFilterType('all')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  dishFilterType === 'all'
                    ? 'bg-[#0D1322] text-white'
                    : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.06]'
                }`}
              >
                All ({currentMenuItems.length})
              </button>

              <button
                type="button"
                onClick={() => setDishFilterType('chef_fav')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                  dishFilterType === 'chef_fav'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                <span>Chef's Favourites ({chefFavCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setDishFilterType('specials')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                  dishFilterType === 'specials'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-orange-100/80 text-orange-900 hover:bg-orange-200'
                }`}
              >
                <Flame className="w-3 h-3 text-orange-700" />
                <span>House Specials ({specialCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setDishFilterType('bestsellers')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                  dishFilterType === 'bestsellers'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                }`}
              >
                <Award className="w-3 h-3 text-purple-700" />
                <span>Bestsellers ({bestsellerCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setDishFilterType('missing_lore')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer ${
                  dishFilterType === 'missing_lore'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-red-100 text-red-900 hover:bg-red-200'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span>Missing Lore ({totalDishes - loreCompleteCount})</span>
              </button>
            </div>

            {/* Category Dropdown Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="text-xs font-bold bg-[#090D16]/[0.04] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
              >
                <option value="all">All Categories ({currentCategories.length})</option>
                {currentCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: HIGH-DETAIL INTAKE CARDS (WITH VOICE, PRESETS, AUTO-DRAFT)   */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'cards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <strong className="text-white">{filteredDishes.length}</strong> dishes. Click <strong>"✨ Auto-Draft"</strong> or use presets to fill secret recipes in seconds.
              </p>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Missing Dish to Menu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredDishes.map((dish) => {
                const category = currentCategories.find((c) => c.id === dish.category_id);
                const isVeg = dish.dietary_flags.includes('Vegetarian');
                const isRecording = recordingDishId === dish.id;

                return (
                  <div
                    key={dish.id}
                    className="bg-[#0D1322] rounded-3xl border border-white/[0.08]/90 shadow-lg p-5 space-y-4 transition-all hover:border-amber-300/80 relative"
                  >
                    {/* Header Row: Image, Name, Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3.5">
                        <img
                          src={dish.image_url}
                          alt={dish.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-white/[0.08] shadow-sm flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                                isVeg ? 'border-green-600' : 'border-red-600'
                              }`}
                              title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}
                              />
                            </span>
                            <h3 className="text-sm font-bold text-white">{dish.name}</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {category?.name || 'General'} • <span className="font-mono font-bold text-slate-200">₹{dish.price}</span>
                          </p>
                        </div>
                      </div>

                      {/* 1-Click Auto Draft & Voice Tools */}
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAutoSuggestSecret(dish)}
                          className="text-[11px] font-bold bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                          title="Generate complete authentic culinary secrets and pairing notes with 1 click"
                        >
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span>✨ Auto-Draft</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleVoiceDictation(dish.id)}
                          className={`text-[11px] font-bold px-2 py-1.5 rounded-xl border transition-all flex items-center space-x-1 cursor-pointer ${
                            isRecording
                              ? 'bg-red-600 text-white animate-pulse border-red-700'
                              : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.06] border-white/[0.08]'
                          }`}
                          title="Simulate speaking Chef's recipe notes directly via microphone"
                        >
                          {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-amber-400" />}
                          <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Voice'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Highlights / Badges Row (Chef's Fav, House Special, Bestseller) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => updateMenuItem(dish.id, { is_chef_recommended: !dish.is_chef_recommended })}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all flex items-center space-x-1 border cursor-pointer ${
                          dish.is_chef_recommended
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-white/[0.04]/80 text-slate-400 border-white/[0.08] hover:bg-amber-50 hover:text-amber-900'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${dish.is_chef_recommended ? 'fill-white text-white' : 'text-slate-500'}`} />
                        <span>Chef's Favourite</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateMenuItem(dish.id, { is_signature: !dish.is_signature })}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all flex items-center space-x-1 border cursor-pointer ${
                          dish.is_signature
                            ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                            : 'bg-white/[0.04]/80 text-slate-400 border-white/[0.08] hover:bg-orange-50 hover:text-orange-900'
                        }`}
                      >
                        <Flame className="w-3 h-3" />
                        <span>House Special</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateMenuItem(dish.id, { is_bestseller: !dish.is_bestseller })}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all flex items-center space-x-1 border cursor-pointer ${
                          dish.is_bestseller
                            ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                            : 'bg-white/[0.04]/80 text-slate-400 border-white/[0.08] hover:bg-purple-50 hover:text-purple-900'
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        <span>Bestseller</span>
                      </button>

                      {/* Preset Templates Selector */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleApplyPresetTemplate(dish, e.target.value);
                        }}
                        defaultValue=""
                        className="text-[11px] font-bold bg-[#090D16]/[0.04] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl px-2 py-1 text-slate-400 focus:outline-hidden ml-auto"
                      >
                        <option value="" disabled>⚡ Apply Smart Preset...</option>
                        <option value="royal_awadhi">👑 Royal Awadhi 18h Slow-Simmer</option>
                        <option value="tandoor_charcoal">🔥 Charcoal Smoked Tandoori</option>
                        <option value="coastal_coconut">🥥 Coastal Coconut &amp; Kokum</option>
                        <option value="artisan_dessert">🍮 Desi Ghee &amp; Saffron Sweet</option>
                      </select>
                    </div>

                    {/* Section 1: Secret Preparation Technique & Spices */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ChefHat className="w-3 h-3 text-amber-400" />
                          Secret Cooking Technique &amp; Heirloom Spices:
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">Fed directly to AI Bot</span>
                      </label>
                      <textarea
                        rows={2}
                        value={dish.chef_notes || ''}
                        onChange={(e) => updateMenuItem(dish.id, { chef_notes: e.target.value })}
                        placeholder="e.g. 18-hour charcoal simmer with hand-pounded mace, stone flower, and pure white makkhan..."
                        className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Section 2: Chef's Story & Owner's Table Pitch */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          Chef's Origin Lore:
                        </label>
                        <input
                          type="text"
                          value={dish.chef_story || ''}
                          onChange={(e) => updateMenuItem(dish.id, { chef_story: e.target.value })}
                          placeholder="e.g. 80-year-old grandmother recipe from Amritsar"
                          className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          Owner's Table Pitch:
                        </label>
                        <input
                          type="text"
                          value={dish.owner_pitch || ''}
                          onChange={(e) => updateMenuItem(dish.id, { owner_pitch: e.target.value })}
                          placeholder="e.g. Our most beloved comfort dish — light on the stomach"
                          className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Section 3: Beverage Pairing & Serving Temperature */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                          <GlassWater className="w-3 h-3 text-blue-500" />
                          Best Drink Pairing &amp; Reason:
                        </label>
                        <input
                          type="text"
                          value={dish.pairing_drink_name || ''}
                          onChange={(e) => updateMenuItem(dish.id, { pairing_drink_name: e.target.value })}
                          placeholder="e.g. Saffron Lassi (balances rich butter)"
                          className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-400 focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-slate-400" />
                          Serving Style &amp; Temperature:
                        </label>
                        <input
                          type="text"
                          value={dish.temperature_style || ''}
                          onChange={(e) => updateMenuItem(dish.id, { temperature_style: e.target.value })}
                          placeholder="e.g. Sizzling hot in cast iron skillet"
                          className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Section 4: Spice Calibration & Dietary Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                      {/* Spice Calibration Gauge (0-5) */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-400">Spice:</span>
                        <div className="flex items-center space-x-1">
                          {[0, 1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateMenuItem(dish.id, { spice_level: lvl })}
                              className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                dish.spice_level === lvl
                                  ? 'bg-red-600 text-white shadow-sm scale-105'
                                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.06]'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {dish.spice_level === 0 ? 'Mild' : dish.spice_level <= 2 ? 'Warm' : dish.spice_level === 3 ? 'Traditional' : 'Fiery'}
                        </span>
                      </div>

                      {/* Dietary Badges Toggle */}
                      <div className="flex items-center space-x-1">
                        {['Vegetarian', 'Vegan', 'Jain', 'Gluten-Free'].map((tag) => {
                          const hasTag = dish.dietary_flags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                const newFlags = hasTag
                                  ? dish.dietary_flags.filter((f) => f !== tag)
                                  : [...dish.dietary_flags, tag];
                                updateMenuItem(dish.id, { dietary_flags: newFlags });
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                                hasTag
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : 'bg-white/[0.03] text-slate-500 border-white/[0.08] hover:bg-white/[0.04]'
                              }`}
                            >
                              {tag === 'Gluten-Free' ? 'GF' : tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: SPECIALS & CHEF'S FAVOURITES TAGGING SECTION                 */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'specials' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
                  <span>Chef's Favourites &amp; House Specials Curator</span>
                </h3>
                <p className="text-xs text-amber-900/80 mt-1">
                  Tag the hero dishes your Head Chef and Owner are most proud of. When diners ask the AI bot <em>"What should we order?"</em> or <em>"What is the chef's special?"</em>, these dishes are recommended with priority and personal culinary stories.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1.5 rounded-xl">
                  {chefFavCount} Chef's Favs • {specialCount} Specials
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMenuItems.map((dish) => {
                const isChefFav = dish.is_chef_recommended;
                const isSpecial = dish.is_signature;
                const isBestseller = dish.is_bestseller;

                return (
                  <div
                    key={dish.id}
                    className={`bg-[#0D1322] rounded-3xl p-4 border transition-all space-y-3 ${
                      isChefFav
                        ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                        : isSpecial
                          ? 'border-orange-400 ring-2 ring-orange-400/20 shadow-md'
                          : 'border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={dish.image_url}
                          alt={dish.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/[0.08]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                          <span className="text-[11px] font-mono font-bold text-slate-400">₹{dish.price}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 italic">
                      "{dish.chef_notes || dish.short_description}"
                    </p>

                    {/* Tagging Toggles */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/[0.06]">
                      <button
                        type="button"
                        onClick={() => updateMenuItem(dish.id, { is_chef_recommended: !isChefFav })}
                        className={`text-[11px] font-bold py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isChefFav
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-amber-50'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isChefFav ? 'fill-white text-white' : 'text-slate-500'}`} />
                        <span className="text-[9px] mt-0.5">Chef's Fav</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateMenuItem(dish.id, { is_signature: !isSpecial })}
                        className={`text-[11px] font-bold py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSpecial
                            ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                            : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-orange-50'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span className="text-[9px] mt-0.5">House Special</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateMenuItem(dish.id, { is_bestseller: !isBestseller })}
                        className={`text-[11px] font-bold py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isBestseller
                            ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                            : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-purple-50'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span className="text-[9px] mt-0.5">Bestseller</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VIEW 3: SPEED MATRIX TABLE (HIGH-SPEED SPREADSHEET MODE)             */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'matrix' && (
          <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] shadow-lg overflow-hidden">
            <div className="p-4 bg-[#090D16] text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-blue-400" />
                  <span>High-Speed Bulk Matrix Editor</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tab through every dish to quickly edit spice levels, chef notes, pairings, and specials.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoFillAllMissingSecrets}
                className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white px-3 py-1.5 rounded-xl"
              >
                ✨ Auto-Draft Missing Rows
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/[0.04]/80 text-slate-400 font-bold border-b border-white/[0.08]">
                    <th className="p-3">Dish Name</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Flags</th>
                    <th className="p-3">Spice (0-5)</th>
                    <th className="p-3 min-w-[260px]">Chef Secret &amp; Technique</th>
                    <th className="p-3 min-w-[180px]">Beverage Pairing</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredDishes.map((dish) => (
                    <tr key={dish.id} className="hover:bg-white/[0.03]/80 transition-colors">
                      <td className="p-3 font-bold text-white">
                        {dish.name}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-400">
                        ₹{dish.price}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => updateMenuItem(dish.id, { is_chef_recommended: !dish.is_chef_recommended })}
                            className={`p-1 rounded-lg cursor-pointer ${
                              dish.is_chef_recommended ? 'bg-amber-500 text-white' : 'bg-white/[0.04] text-slate-500'
                            }`}
                            title="Chef's Favourite"
                          >
                            <Star className="w-3 h-3 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateMenuItem(dish.id, { is_signature: !dish.is_signature })}
                            className={`p-1 rounded-lg cursor-pointer ${
                              dish.is_signature ? 'bg-orange-500 text-white' : 'bg-white/[0.04] text-slate-500'
                            }`}
                            title="House Special"
                          >
                            <Flame className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={dish.spice_level}
                          onChange={(e) => updateMenuItem(dish.id, { spice_level: parseInt(e.target.value) })}
                          className="bg-white/[0.04] font-bold rounded-lg px-2 py-1 text-xs border border-white/[0.08]"
                        >
                          <option value="0">0 - None</option>
                          <option value="1">1 - Mild</option>
                          <option value="2">2 - Warm</option>
                          <option value="3">3 - Trad.</option>
                          <option value="4">4 - Hot</option>
                          <option value="5">5 - Fiery</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={dish.chef_notes || ''}
                          onChange={(e) => updateMenuItem(dish.id, { chef_notes: e.target.value })}
                          placeholder="Secret spices or cooking technique..."
                          className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-lg px-2 py-1 text-xs focus:bg-white"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={dish.pairing_drink_name || ''}
                          onChange={(e) => updateMenuItem(dish.id, { pairing_drink_name: e.target.value })}
                          placeholder="Recommended drink..."
                          className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-lg px-2 py-1 text-xs focus:bg-white"
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleAutoSuggestSecret(dish)}
                          className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded-lg hover:bg-amber-200"
                        >
                          ✨ Auto
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VIEW 4: CHEF & OWNER LORE, PERSONALITY TONE & FAQS                    */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'lore' && (
          <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] shadow-lg p-6 space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-white/[0.08] pb-4">
              <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <span>Executive Chef &amp; Owner Hospitality Persona</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure the master voice, conversational personality style, and custom kitchen FAQs for your AI concierge.
              </p>
            </div>

            {/* AI Personality & Tone Selector */}
            <div className="space-y-2 bg-[#090D16]/[0.03] p-4 rounded-2xl border border-white/[0.08]">
              <label className="text-xs font-bold text-white block flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-600" />
                <span>AI Conversational Tone &amp; Hospitality Style:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    id: 'warm_traditional',
                    title: '👑 Royal Awadhi & Dastarkhwan Heritage',
                    desc: 'Poetic, respectful, deeply warm (Aadab / Namaste). Explains hand-pounded spices and dum techniques.'
                  },
                  {
                    id: 'fine_dining_artisan',
                    title: '🍷 Michelin-Star Sommelier & Fine Dining',
                    desc: 'Refined culinary prose, wine/cocktail pairing focus, and artisanal origin notes.'
                  },
                  {
                    id: 'modern_chic',
                    title: '⚡ High-Energy Modern Bistro & Tapas',
                    desc: 'Crisp, witty, fast recommendations, cocktail pairings, and high check-size upselling.'
                  },
                  {
                    id: 'bistro_cozy',
                    title: '🏡 Hearty Family Trattoria / Ghar-Jaisa',
                    desc: 'Generous, comforting, family feast-oriented, zero pretension, heartwarming hospitality.'
                  }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setPersona({ ...persona, greeting_tone: tone.id as any })}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      persona.greeting_tone === tone.id
                        ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                        : 'bg-white border-white/[0.08] hover:bg-white/[0.04]'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{tone.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tone.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Head Chef Profile */}
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-amber-700" />
                  Head Chef Identity
                </h4>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Chef Name &amp; Title</label>
                  <input
                    type="text"
                    value={persona.chef_name}
                    onChange={(e) => setPersona({ ...persona, chef_name: e.target.value })}
                    className="w-full text-xs bg-[#090D16] border border-amber-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Culinary Philosophy</label>
                  <textarea
                    rows={3}
                    value={persona.chef_philosophy}
                    onChange={(e) => setPersona({ ...persona, chef_philosophy: e.target.value })}
                    className="w-full text-xs bg-[#090D16] border border-amber-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Owner Hospitality Profile */}
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-200/80">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-blue-700" />
                  Owner Hospitality Voice
                </h4>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Owner / Partner Name</label>
                  <input
                    type="text"
                    value={persona.owner_name}
                    onChange={(e) => setPersona({ ...persona, owner_name: e.target.value })}
                    className="w-full text-xs bg-[#090D16] border border-blue-300 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Hospitality &amp; Guest Welcome Note</label>
                  <textarea
                    rows={3}
                    value={persona.owner_hospitality_note}
                    onChange={(e) => setPersona({ ...persona, owner_hospitality_note: e.target.value })}
                    className="w-full text-xs bg-[#090D16] border border-blue-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Custom Kitchen FAQs Trainer */}
            <div className="space-y-3 bg-[#0D1322] p-4 rounded-2xl border border-white/[0.08]">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Custom Kitchen FAQs Trainer (Halal, Zero MSG, Celebrations, Elders)</span>
              </h4>

              <div className="space-y-2">
                {customFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.08] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Q: {faq.q}</span>
                      <button
                        type="button"
                        onClick={() => setCustomFaqs(customFaqs.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-slate-400 italic">A: {faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Add FAQ form */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Question (e.g., Is your meat 100% Halal?)"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  className="text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Answer for the AI to reply..."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="flex-1 text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFaqQ.trim() && newFaqA.trim()) {
                        setCustomFaqs([...customFaqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
                        setNewFaqQ('');
                        setNewFaqA('');
                      }
                    }}
                    className="text-xs font-bold bg-[#090D16] text-white px-3 py-2 rounded-xl"
                  >
                    Add FAQ
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSavePersona}
                className="bg-[#090D16] hover:bg-black text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md flex items-center space-x-2"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Persona Configuration</span>
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* VIEW 5: INTERACTIVE LIVE CONCIERGE SIMULATOR                          */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'test' && (
          <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] shadow-lg p-6 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span>Interactive Dining Concierge Simulator</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Test questions as a diner. The AI uses Chef {persona.chef_name}'s secrets, today's freshness, and your tagged specials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTestMessages([
                    {
                      role: 'assistant',
                      text: `Namaste! I am your dining concierge for ${restaurant.name}, trained directly by Chef ${persona.chef_name} & Owner ${persona.owner_name}.\n\n✨ *Today's Kitchen Highlight:* ${dailyFreshHighlight}\n\nAsk me about our specials, cooking secrets, or pairings!`
                    }
                  ]);
                }}
                className="text-xs text-slate-500 hover:text-slate-200 flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Quick Scenario Starters */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Simulate Real Guest Scenarios:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: '🌟 What is fresh today?', query: 'What is fresh in the kitchen today?' },
                  { label: "🧑‍🍳 Chef's Favourite Pick", query: "What is Chef Sanjay's personal favourite dish?" },
                  { label: '🔥 House Specials', query: 'What are your signature house specials?' },
                  { label: '👨‍👩‍👧‍👦 Family with Kids/Elders', query: 'We are a family with grandparents and kids, what should we order?' },
                  { label: '🥂 Romantic Date Night', query: 'Planning a romantic dinner for two with pairings' },
                  { label: '⚡ 30-min Business Lunch', query: 'We are on a quick 30-min corporate lunch' },
                  { label: '🛡️ MSG & Halal Policy', query: 'Do you use MSG and is the meat Halal?' }
                ].map((sc) => (
                  <button
                    key={sc.label}
                    type="button"
                    onClick={() => handleSendTestQuery(sc.query)}
                    className="text-[11px] font-bold bg-[#090D16]/[0.04] hover:bg-amber-100 text-slate-200 hover:text-amber-900 border border-white/[0.08] px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History Box */}
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-4 space-y-3 min-h-[320px] max-h-[460px] overflow-y-auto">
              {testMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#090D16] text-white rounded-tr-none'
                        : 'bg-white text-white border border-white/[0.08] shadow-sm rounded-tl-none space-y-2'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Highlighted Dish Cards if any */}
                    {msg.dishHighlights && msg.dishHighlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                        {msg.dishHighlights.map((dish) => (
                          <div key={dish.id} className="flex items-center space-x-2 bg-[#090D16]/[0.03] p-2 rounded-xl border border-white/[0.08]">
                            <img src={dish.image_url} alt={dish.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-bold text-white truncate">{dish.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">₹{dish.price} • Spice {dish.spice_level}/5</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTestQuery(testInput);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Ask anything about recipes, spices, chef's specials, pairings..."
                className="flex-1 text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 text-white focus:outline-hidden focus:border-amber-500 focus:bg-white"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── Modal: Add New Dish ───────────────────────────────────────────── */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1322] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Add New Dish to {restaurant.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="text-slate-500 hover:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Murg Dum Handi Biryani"
                  className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white font-bold focus:outline-hidden focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-2 font-bold"
                  >
                    {currentCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">Type</label>
                  <select
                    value={newDishType}
                    onChange={(e) => setNewDishType(e.target.value as any)}
                    className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-2.5 py-2"
                  >
                    <option value="food">Food Dish</option>
                    <option value="drink">Beverage / Drink</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">Spice Level (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={newDishSpice}
                    onChange={(e) => setNewDishSpice(parseInt(e.target.value) || 0)}
                    className="w-full text-xs bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              {/* Special Badges Checkboxes */}
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.08] space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">Highlight Tags:</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDishIsChefFav}
                      onChange={(e) => setNewDishIsChefFav(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>🌟 Chef's Favourite</span>
                  </label>

                  <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDishIsSpecial}
                      onChange={(e) => setNewDishIsSpecial(e.target.checked)}
                      className="rounded text-orange-600"
                    />
                    <span>🔥 House Special</span>
                  </label>
                </div>
              </div>

              {/* Auto generate secrets on create toggle */}
              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoGenOnCreate}
                  onChange={(e) => setAutoGenOnCreate(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>✨ <strong>Auto-Draft AI Secrets &amp; Lore</strong> immediately upon creating</span>
              </label>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white shadow-sm"
                >
                  Create &amp; Train AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
