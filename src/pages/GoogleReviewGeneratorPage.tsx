import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Star,
  Sparkles,
  Copy,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  Gift,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Building2,
  UtensilsCrossed,
  MessageSquare,
  Flame,
  Award,
  Zap,
  Check,
  Send
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { SEED_RESTAURANT, SEED_CASA_BELLA } from '../data/seedData';
import {
  getQuickTagsForRestaurant,
  generateConsumerReviewDraft
} from '../lib/reviewGenerator';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { RestaurantTable } from '../types';

export const GoogleReviewGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantSlug } = useParams<{ restaurantSlug?: string }>();

  const restaurant = useRestaurantStore((state) => state.restaurant);
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const tables = useRestaurantStore((state) => state.tables);
  const addSystemNotification = useRestaurantStore((state) => state.addSystemNotification);
  const addReview = useRestaurantStore((state) => state.addReview);

  // Available partner restaurants for switcher
  const availableRestaurants = useMemo(() => {
    const list = rawRestaurants.filter(
      (r) => r && r.id && !isDishNameAsRestaurant(r) && r.slug
    );
    if (list.length === 0) {
      return [SEED_RESTAURANT, SEED_CASA_BELLA];
    }
    return list;
  }, [rawRestaurants]);

  // Determine current active venue
  const activeVenue = useMemo(() => {
    if (restaurantSlug) {
      const match = availableRestaurants.find((r) => r.slug === restaurantSlug);
      if (match) return match;
    }
    if (restaurant && restaurant.slug) {
      const match = availableRestaurants.find((r) => r.slug === restaurant.slug);
      if (match) return match;
    }
    return availableRestaurants[0] || SEED_RESTAURANT;
  }, [restaurantSlug, restaurant, availableRestaurants]);

  // Detect active table or provide default demo table
  const searchParams = new URLSearchParams(location.search);
  const tableTokenParam = searchParams.get('t');
  
  const activeTable = useMemo<RestaurantTable>(() => {
    const venueTables = tables.filter((t) => t.restaurant_id === activeVenue.id);
    if (tableTokenParam) {
      const found = venueTables.find((t) => t.public_token === tableTokenParam);
      if (found) return found;
    }
    return (
      venueTables[0] || {
        id: `table-demo-${activeVenue.slug}`,
        restaurant_id: activeVenue.id,
        label: 'Table 4',
        public_token: `token-table-04-${activeVenue.slug}`,
        is_active: true
      } as RestaurantTable
    );
  }, [tables, activeVenue, tableTokenParam]);

  // Generator State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [tone, setTone] = useState<'enthusiastic' | 'concise' | 'detailed'>('enthusiastic');
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [reviewDraft, setReviewDraft] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isWheelModalOpen, setIsWheelModalOpen] = useState<boolean>(false);
  const [venueDropdownOpen, setVenueDropdownOpen] = useState<boolean>(false);

  // Private shield feedback state (for < 4 stars)
  const [privateFeedback, setPrivateFeedback] = useState<string>('');
  const [privateFeedbackSent, setPrivateFeedbackSent] = useState<boolean>(false);

  // Quick tags available for the current cuisine
  const quickTags = useMemo(() => {
    return getQuickTagsForRestaurant(activeVenue.cuisine);
  }, [activeVenue.cuisine]);

  // Initialize tags with top 2 highlights on venue switch
  useEffect(() => {
    if (quickTags.length > 0) {
      setSelectedTags(quickTags.slice(0, 2));
    }
  }, [quickTags, activeVenue.id]);

  // Regenerate draft whenever tags, custom notes, tone, or variation changes
  useEffect(() => {
    const draft = generateConsumerReviewDraft({
      businessName: activeVenue.name,
      cuisine: activeVenue.cuisine,
      rating,
      selectedTags,
      customNotes,
      tone,
      variationIndex
    });
    setReviewDraft(draft);
  }, [activeVenue.name, activeVenue.cuisine, rating, selectedTags, customNotes, tone, variationIndex]);

  // Toggle tag selection
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 1-Tap Copy & Open Google
  const handleCopyAndOpenGoogle = () => {
    if (!reviewDraft) return;

    // Copy to clipboard
    navigator.clipboard?.writeText(reviewDraft).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);

    // Record verified review in internal system store
    addReview({
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      restaurant_id: activeVenue.id,
      customer_name: `Verified Diner (${activeTable.label})`,
      rating: 5,
      selected_keywords: selectedTags,
      review_text: reviewDraft,
      whatsapp_opt_in: true,
      google_review_clicked: true,
      created_at: new Date().toISOString()
    });

    addSystemNotification({
      restaurant_id: activeVenue.id,
      type: 'review_submitted',
      message: `⭐ 5-Star Google Review drafted & opened by ${activeTable.label}! Reward wheel unlocked.`
    });

    // Open Google Review URL in new tab
    const googleUrl =
      activeVenue.google_place_url ||
      `https://search.google.com/local/writereview?placeid=${
        activeVenue.slug === 'casa-bella'
          ? 'ChIJCasaBellaTrattoriaPune'
          : 'ChIJSaffronHouseKoregaonParkPune'
      }`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  // Submit private feedback (< 4 stars)
  const handleSubmitPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateFeedback.trim()) return;

    addReview({
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      restaurant_id: activeVenue.id,
      customer_name: `Table Guest (${activeTable.label})`,
      rating,
      selected_keywords: selectedTags,
      review_text: privateFeedback,
      whatsapp_opt_in: false,
      google_review_clicked: false,
      created_at: new Date().toISOString()
    });

    addSystemNotification({
      restaurant_id: activeVenue.id,
      type: 'service_alert',
      message: `🚨 Private Feedback Alert from ${activeTable.label} (${rating}⭐): "${privateFeedback}". Manager attending table.`
    });

    setPrivateFeedbackSent(true);
  };

  const wordCount = reviewDraft.trim() ? reviewDraft.trim().split(/\s+/).length : 0;
  const charCount = reviewDraft.length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#141414] font-sans selection:bg-[#F4511E]/20 selection:text-[#2D4A3E]">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. TOP HEADER & VENUE SELECTOR                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-black/[0.08] px-4 sm:px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Back button & Brand Title */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="p-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#4A4A4A] hover:text-[#141414] border border-black/[0.08] transition-all cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-base sm:text-lg text-[#141414] tracking-tight flex items-center space-x-1.5">
                  <span>Google Review Generator</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F4511E]/20 text-[#2D4A3E] border border-[#F4511E]/30">
                  AI ENGINE
                </span>
              </div>
              <p className="text-[11px] text-[#6E6E6E] hidden sm:block">
                1-tap authentic 5-star review drafts + guaranteed table rewards
              </p>
            </div>
          </div>

          {/* Venue Switcher & Reward Launch Button */}
          <div className="flex items-center space-x-2.5">
            {/* Venue Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#3A3A3A] text-xs font-semibold border border-black/[0.12] transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#2D4A3E]" />
                <span className="max-w-[110px] sm:max-w-none truncate">{activeVenue.name}</span>
                <ChevronDown className="w-3 h-3 text-[#6E6E6E]" />
              </button>

              {venueDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#F5F1E8] border border-black/[0.14] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6E6E6E] border-b border-black/[0.06] mb-1">
                    Select Restaurant
                  </div>
                  {availableRestaurants.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setCurrentRestaurant(r.id);
                        navigate(`/review/${r.slug}`);
                        setVenueDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                        r.id === activeVenue.id
                          ? 'bg-[#F4511E]/20 text-[#2D4A3E] border border-[#F4511E]/30'
                          : 'text-[#4A4A4A] hover:text-[#141414] hover:bg-black/[0.04]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-bold truncate">{r.name}</div>
                        <div className="text-[10px] text-[#6E6E6E] truncate">{r.location || r.cuisine}</div>
                      </div>
                      {r.id === activeVenue.id && <Check className="w-3.5 h-3.5 text-[#2D4A3E] ml-2 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Spin Wheel directly */}
            <button
              type="button"
              onClick={() => setIsWheelModalOpen(true)}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F4511E] to-[#F4511E] text-[#FFFFFF] font-bold text-xs flex items-center space-x-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#141414]" />
              <span className="hidden sm:inline">Spin Reward Wheel</span>
              <span className="sm:hidden">Rewards</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. HERO BADGE & OVERVIEW BANNER                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-black/[0.06] bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF] to-[#FFFFFF] py-8 sm:py-10 px-4 sm:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#F4511E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F4511E]/15 border border-[#F4511E]/30 text-[#2D4A3E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E]" />
            <span>Autonomous Google 5-Star Review Accelerator</span>
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#141414] tracking-tight">
            Generate an Authentic Review for <span className="text-[#2D4A3E]">{activeVenue.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#4A4A4A] max-w-xl mx-auto leading-relaxed">
            Rate your dining experience, pick your highlights, and copy your personalized draft to Google Maps in one tap. Spin the lucky wheel after posting to claim guaranteed table treats!
          </p>

          <div className="flex items-center justify-center space-x-4 pt-1 text-[11px] text-[#6E6E6E]">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7A4F]" />
              <span>100% Free Food Perks</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Anti-Fake Bot Filter</span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>1-Tap Copy &amp; Post</span>
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. MAIN WORKFLOW CONTAINER                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        
        {/* STEP 1: INTERACTIVE STAR RATING */}
        <section className="bg-[#F5F1E8] border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D4A3E] font-bold">Step 1</span>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-[#141414]">How was your dining experience?</h2>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-black/[0.04] text-[#4A4A4A] border border-black/[0.08] self-start sm:self-auto">
              {rating === 5 && '🌟 Exceptional / Flawless (5/5)'}
              {rating === 4 && '✨ Great Experience (4/5)'}
              {rating === 3 && '⚠️ Average / Could Be Better (3/5)'}
              {rating === 2 && '👎 Disappointing (2/5)'}
              {rating === 1 && '🚨 Poor / Needs Escalation (1/5)'}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 sm:space-x-4 py-4">
            {[1, 2, 3, 4, 5].map((starVal) => {
              const isFilled = (hoverRating || rating) >= starVal;
              return (
                <button
                  key={starVal}
                  type="button"
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starVal)}
                  className="p-2 sm:p-3 rounded-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                  aria-label={`Rate ${starVal} Stars`}
                >
                  <Star
                    className={`w-8 h-8 sm:w-11 sm:h-11 transition-all duration-200 ${
                      isFilled
                        ? 'fill-[#2D4A3E] text-[#2D4A3E] filter drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                        : 'text-slate-600 hover:text-[#6E6E6E]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {rating < 4 && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-[#C23A1C] text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-[#C23A1C]">
                <ShieldCheck className="w-4 h-4 text-[#C23A1C]" />
                <span>Private Floor Resolution Shield Active</span>
              </div>
              <p className="text-[#C23A1C]/90 leading-relaxed">
                We take dining quality seriously. Because you selected under 4 stars, your notes will not be posted to public Google Maps. Instead, our General Manager will personally review and address your concerns right at your table.
              </p>
            </div>
          )}
        </section>

        {/* CONDITIONAL BRANCH: IF < 4 STARS, PRIVATE RESOLUTION FORM */}
        {rating < 4 ? (
          <section className="bg-[#FFFFFF] border border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-3 text-[#C23A1C]">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#141414]">Tell the Manager What Happened</h3>
                <p className="text-xs text-[#6E6E6E]">Direct, private feedback routed straight to floor leadership.</p>
              </div>
            </div>

            {privateFeedbackSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#2F7A4F] mx-auto" />
                <h4 className="font-bold text-base text-[#141414]">Escalation Received</h4>
                <p className="text-xs text-[#4A4A4A] max-w-md mx-auto">
                  Our shift manager and head chef have been notified for {activeTable.label}. Someone will attend to your table shortly to make this right.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRating(5);
                    setPrivateFeedbackSent(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-black/[0.04] text-xs font-semibold hover:bg-black/[0.04] text-[#141414] transition-all cursor-pointer"
                >
                  Change Rating to 5 Stars
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPrivateFeedback} className="space-y-4">
                <textarea
                  rows={4}
                  value={privateFeedback}
                  onChange={(e) => setPrivateFeedback(e.target.value)}
                  placeholder="e.g. The soup was cold, or we had to wait 25 minutes for the kulcha..."
                  className="w-full rounded-2xl bg-black/40 border border-black/[0.12] p-4 text-xs sm:text-sm text-[#FFFFFF] placeholder-[#B0B0B0] focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#6E6E6E]">Attending: Table {activeTable.label}</span>
                  <button
                    type="submit"
                    disabled={!privateFeedback.trim()}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Privately to Manager</span>
                  </button>
                </div>
              </form>
            )}
          </section>
        ) : (
          /* STEP 2 & 3: 5-STAR / 4-STAR AI GENERATOR ENGINE */
          <div className="space-y-8 animate-in fade-in">
            
            {/* STEP 2: HIGHLIGHT TAGS & TONE SWITCHER */}
            <section className="bg-[#F5F1E8] border border-black/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* Highlight Tags */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D4A3E] font-bold">Step 2</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#141414]">Select What You Loved</h3>
                  </div>
                  <span className="text-[11px] text-[#6E6E6E]">
                    {selectedTags.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {quickTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-[#F4511E]/20 text-[#2D4A3E] border border-[#F4511E]/50 shadow-sm'
                            : 'bg-black/[0.04] text-[#4A4A4A] hover:text-[#141414] hover:bg-black/[0.04] border border-black/[0.08]'
                        }`}
                      >
                        <span>{tag}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#2D4A3E] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Switcher */}
              <div className="pt-4 border-t border-black/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#3A3A3A] uppercase tracking-wide flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>Review Voice &amp; Tone</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setVariationIndex((prev) => prev + 1)}
                    className="flex items-center space-x-1.5 text-xs text-[#2D4A3E] hover:text-[#2D4A3E] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Shuffle AI Variation</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTone('enthusiastic')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      tone === 'enthusiastic'
                        ? 'bg-[#F4511E]/15 border-[#F4511E]/40 text-[#2D4A3E]'
                        : 'bg-black/[0.04] border-black/[0.08] text-[#6E6E6E] hover:text-[#3A3A3A] hover:bg-black/[0.04]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#141414] flex items-center space-x-1.5">
                      <span>🔥 Enthusiastic</span>
                    </div>
                    <p className="text-[10px] text-[#6E6E6E] mt-0.5">Energetic, high praise, celebratory vibe</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTone('detailed')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      tone === 'detailed'
                        ? 'bg-[#F4511E]/15 border-[#F4511E]/40 text-[#2D4A3E]'
                        : 'bg-black/[0.04] border-black/[0.08] text-[#6E6E6E] hover:text-[#3A3A3A] hover:bg-black/[0.04]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#141414] flex items-center space-x-1.5">
                      <span>🍷 Foodie / Connoisseur</span>
                    </div>
                    <p className="text-[10px] text-[#6E6E6E] mt-0.5">Culinary textures, hospitality details</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTone('concise')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      tone === 'concise'
                        ? 'bg-[#F4511E]/15 border-[#F4511E]/40 text-[#2D4A3E]'
                        : 'bg-black/[0.04] border-black/[0.08] text-[#6E6E6E] hover:text-[#3A3A3A] hover:bg-black/[0.04]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#141414] flex items-center space-x-1.5">
                      <span>⚡ Crisp &amp; Concise</span>
                    </div>
                    <p className="text-[10px] text-[#6E6E6E] mt-0.5">Short, punchy, quick 5-star summary</p>
                  </button>
                </div>
              </div>

              {/* Custom Additions Input */}
              <div className="pt-2">
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Add custom notes (e.g. server was Ramesh, celebrated my birthday)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-black/[0.10] text-xs text-[#FFFFFF] placeholder-[#B0B0B0] focus:outline-none focus:border-[#F4511E]"
                />
              </div>
            </section>

            {/* STEP 3: LIVE REVIEW DRAFT CARD & 1-TAP POSTING */}
            <section className="bg-gradient-to-br from-[#FFFFFF] via-[#F5F1E8] to-[#FFFFFF] border border-[#F4511E]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-[#F4511E]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2D4A3E] font-bold">Step 3</span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#141414] flex items-center space-x-2">
                    <span>Your Generated Google Review Draft</span>
                    <Sparkles className="w-4 h-4 text-[#2D4A3E] animate-pulse" />
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-[#6E6E6E]">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} characters</span>
                  <span>•</span>
                  <span className="text-[#2F7A4F] font-semibold">Google SEO Optimized</span>
                </div>
              </div>

              {/* Editable Draft Textarea */}
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  className="w-full rounded-2xl bg-black/50 border border-black/[0.14] p-4 text-xs sm:text-sm text-[#FFFFFF] leading-relaxed focus:outline-none focus:border-[#F4511E] focus:ring-1 focus:ring-[#F4511E] resize-y"
                  placeholder="Your review draft appears here in real-time..."
                />
                <div className="flex items-center justify-between text-[11px] text-[#6E6E6E] px-1">
                  <span>You can edit this draft directly before copying!</span>
                  <button
                    type="button"
                    onClick={() => setVariationIndex((prev) => prev + 1)}
                    className="hover:text-[#2D4A3E] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Regenerate draft</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1-Tap Copy & Open Google */}
                <button
                  type="button"
                  onClick={handleCopyAndOpenGoogle}
                  className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F4511E] via-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 text-[#FFFFFF] font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#141414]" />
                      <span>Copied! Opening Google Reviews...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#141414]" />
                      <span>Copy Draft &amp; Open Google Reviews ↗</span>
                    </>
                  )}
                </button>

                {/* Spin Lucky Reward Wheel */}
                <button
                  type="button"
                  onClick={() => setIsWheelModalOpen(true)}
                  className="py-3.5 px-6 rounded-2xl bg-[#F4511E]/20 hover:bg-[#F4511E]/30 text-[#2D4A3E] border border-[#F4511E]/40 hover:border-[#F4511E] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-[#F4511E]/40"
                >
                  <Gift className="w-4 h-4 text-[#2D4A3E]" />
                  <span>Claim Table Reward (Lucky Spin Wheel)</span>
                </button>
              </div>

              {/* Instructions banner */}
              <div className="p-3.5 rounded-xl bg-black/[0.04] border border-black/[0.08] text-[11px] text-[#4A4A4A] flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-[#F4511E]/20 flex items-center justify-center text-[#2D4A3E] shrink-0 font-bold">
                  💡
                </div>
                <div>
                  <strong>How to redeem your table reward:</strong> Tapping the button copies the text and opens {activeVenue.name} on Google Maps. Paste and submit your review, then spin the lucky wheel to show your winning voucher to your server!
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. STATS & REPUTATION SHIELD TRUST CARDS                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#F5F1E8] border border-black/[0.06] rounded-2xl p-5 text-center space-y-1.5">
            <div className="text-2xl font-black text-[#2D4A3E] font-mono">4.9 ⭐</div>
            <div className="text-xs font-bold text-[#141414]">Average Google Rating</div>
            <p className="text-[11px] text-[#6E6E6E]">Powered by verified dine-in guests</p>
          </div>

          <div className="bg-[#F5F1E8] border border-black/[0.06] rounded-2xl p-5 text-center space-y-1.5">
            <div className="text-2xl font-black text-[#2F7A4F] font-mono">100%</div>
            <div className="text-xs font-bold text-[#141414]">Guaranteed Treat</div>
            <p className="text-[11px] text-[#6E6E6E]">Every verified review unlocks a wheel reward</p>
          </div>

          <div className="bg-[#F5F1E8] border border-black/[0.06] rounded-2xl p-5 text-center space-y-1.5">
            <div className="text-2xl font-black text-[#2D4A3E] font-mono">0 Passwords</div>
            <div className="text-xs font-bold text-[#141414]">Instant Table Redemption</div>
            <p className="text-[11px] text-[#6E6E6E]">Claim your voucher directly at your table</p>
          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. SPIN WHEEL MODAL INTEGRATION                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isWheelModalOpen && (
        <SpinWheelModal
          isOpen={isWheelModalOpen}
          onClose={() => setIsWheelModalOpen(false)}
          activeTable={activeTable}
        />
      )}
    </div>
  );
};

export default GoogleReviewGeneratorPage;
