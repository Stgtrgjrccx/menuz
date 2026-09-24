import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Check,
  Copy,
  Star,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  HeartHandshake
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { RestaurantTable, ReviewChallenge, CustomerReview } from '../types';
import {
  getQuickTagsForRestaurant,
  generateConsumerReviewDraft
} from '../lib/reviewGenerator';

interface PrizeOption {
  id: string;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
}

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTable: RestaurantTable | null;
  challenge?: ReviewChallenge | null;
  initialMode?: string;
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function playWinFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state === 'closed') return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
    });
  } catch {
    // Audio muted or not allowed
  }
}

function playUrgentAlertChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state === 'closed') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Audio muted or not allowed
  }
}

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  activeTable,
  challenge
}) => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const completeChallenge = useRestaurantStore((state) => state.completeChallenge);
  const addSystemNotification = useRestaurantStore((state) => state.addSystemNotification);
  const addReview = useRestaurantStore((state) => state.addReview);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form states: 'form' | 'urgent_service' | 'reward_revealed' | 'urgent_resolved'
  const [step, setStep] = useState<'form' | 'urgent_service' | 'reward_revealed' | 'urgent_resolved'>('form');

  const [starRating, setStarRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dinerName, setDinerName] = useState('');
  const [dinerPhone, setDinerPhone] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  // Below 4-star urgent intervention state
  const [urgentIssues, setUrgentIssues] = useState<string[]>([]);
  const [urgentNote, setUrgentNote] = useState('');
  const [urgentContact, setUrgentContact] = useState('');
  const [isAlertingTeam, setIsAlertingTeam] = useState(false);

  // Winner state
  const [wonPrize, setWonPrize] = useState<PrizeOption | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [aiDraft, setAiDraft] = useState('');

  const isItalian =
    restaurant?.slug === 'casa-bella' || restaurant?.cuisine?.toLowerCase().includes('italian');

  const quickTags = getQuickTagsForRestaurant(restaurant?.cuisine);

  const prizes: PrizeOption[] = isItalian
    ? [
        { id: 'p1', label: 'Complimentary Tiramisu Tradizionale', shortLabel: 'Tiramisu', emoji: '🍮', color: '#D97706' },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#0F766E' },
        { id: 'p3', label: 'Garlic Herb Focaccia on the House', shortLabel: 'Focaccia', emoji: '🥖', color: '#C2410C' },
        { id: 'p4', label: 'Artisanal Illy Double Espresso', shortLabel: 'Espresso', emoji: '☕', color: '#B45309' },
        { id: 'p5', label: '₹100 Dining Voucher', shortLabel: '₹100 Off', emoji: '💰', color: '#047857' }
      ]
    : [
        { id: 'p1', label: 'Free Alphonso Mango Lassi', shortLabel: 'Mango Lassi', emoji: '🍨', color: '#EA580C' },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#059669' },
        { id: 'p3', label: 'Tandoori Truffle Garlic Naan', shortLabel: 'Truffle Naan', emoji: '🫓', color: '#D97706' },
        { id: 'p4', label: 'Royal Rose Petal Kulfi Pop', shortLabel: 'Kulfi Pop', emoji: '🍦', color: '#BE123C' },
        { id: 'p5', label: '₹100 Dining Voucher', shortLabel: '₹100 Off', emoji: '💰', color: '#0284C7' }
      ];

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setStarRating(5);
      setSelectedTags(quickTags.slice(0, 2));
      setWonPrize(null);
      setVoucherCode(null);
      setUrgentIssues([]);
      setUrgentNote('');
      setIsAlertingTeam(false);
    }
  }, [isOpen, restaurant?.cuisine]);

  // Particle confetti burst
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    const animateConfetti = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (frame < 120) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animateConfetti);
  };

  // ── HANDLE RATING CLICK ──────────────────────────────────────
  const handleRatingSelect = (rating: number) => {
    setStarRating(rating);

    // CRITICAL: IF RATED BELOW 4 STARS, NOTIFY TEAM IMMEDIATELY!
    if (rating < 4) {
      playUrgentAlertChime();
      const customerName = dinerName.trim() || `Guest at ${activeTable?.label || 'Table 1'}`;

      // 1. Immediately dispatch high-priority alert to Manager Hub & Kitchen
      addSystemNotification({
        restaurant_id: restaurant?.id || '',
        table_id: activeTable?.id,
        table_label: activeTable?.label || 'Table 1',
        type: 'service_alert',
        customer_name: customerName,
        message: `🚨 URGENT: ${activeTable?.label || 'Table 1'} rated ${rating} Stars! Immediate manager intervention needed on floor!`
      });

      // 2. Seamlessly transition modal to urgent service recovery mode
      setStep('urgent_service');
    }
  };

  // ── SUBMIT URGENT FLOOR ASSISTANCE DETAILS ───────────────────
  const handleSubmitUrgentDetails = () => {
    setIsAlertingTeam(true);
    const customerName = dinerName.trim() || `Guest at ${activeTable?.label || 'Table 1'}`;
    const issuesText = urgentIssues.length > 0 ? urgentIssues.join(', ') : 'Service issue';

    // Broadcast detailed update
    addSystemNotification({
      restaurant_id: restaurant?.id || '',
      table_id: activeTable?.id,
      table_label: activeTable?.label || 'Table 1',
      type: 'service_alert',
      customer_name: customerName,
      message: `🚨 URGENT UPDATE for ${activeTable?.label || 'Table 1'}: (${starRating}★) Issues: ${issuesText}. Note: "${urgentNote || 'Manager requested'}" Contact: ${urgentContact || dinerPhone || 'In person'}`
    });

    // Record internal private feedback in store (deflected from public)
    const privateRev: CustomerReview = {
      id: 'rev_priv_' + Date.now(),
      restaurant_id: restaurant?.id || '',
      customer_name: customerName,
      customer_phone: urgentContact.trim() || dinerPhone.trim() || undefined,
      rating: starRating,
      selected_keywords: urgentIssues,
      review_text: urgentNote.trim() || `Private feedback submitted for ${starRating} star dining experience.`,
      whatsapp_opt_in: false,
      google_review_clicked: false,
      created_at: new Date().toISOString()
    };
    addReview(privateRev);

    setTimeout(() => {
      setIsAlertingTeam(false);
      setStep('urgent_resolved');
    }, 600);
  };

  // ── CLAIM 4/5 STAR INSTANT REWARD ───────────────────────────
  const handleClaimReward = () => {
    const customerName = dinerName.trim() || 'Verified Guest';
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    setWonPrize(randomPrize);

    const prefix = isItalian ? 'BELLAVITA' : 'SAFFRON-WIN';
    const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    setVoucherCode(code);

    // Generate authentic review draft behind the scenes
    const draft = generateConsumerReviewDraft({
      businessName: restaurant?.name || 'Saffron House',
      cuisine: restaurant?.cuisine || 'Contemporary Dining',
      rating: starRating,
      selectedTags,
      tone: 'enthusiastic'
    });
    setAiDraft(draft);

    // Save review in restaurantStore
    const newRev: CustomerReview = {
      id: 'rev_' + Date.now(),
      restaurant_id: restaurant?.id || '',
      customer_name: customerName,
      customer_phone: dinerPhone.trim() || undefined,
      rating: starRating,
      selected_keywords: selectedTags,
      review_text: draft,
      whatsapp_opt_in: whatsappOptIn,
      google_review_clicked: false,
      created_at: new Date().toISOString()
    };
    addReview(newRev);

    // Auto complete challenge
    const chalId = challenge?.id || (isItalian ? 'chal-cb-01' : 'chal-sh-01');
    completeChallenge(chalId, customerName, dinerPhone.trim() || '+91 98000 00000');

    // Notify team
    addSystemNotification({
      restaurant_id: restaurant?.id || '',
      table_id: activeTable?.id,
      table_label: activeTable?.label || 'Table 1',
      type: 'challenge_complete',
      customer_name: customerName,
      message: `🎉 ${customerName} at ${activeTable?.label || 'Table 1'} filled the reward form and won: "${randomPrize.label}"! Voucher: ${code}`
    });

    playWinFanfare();
    setStep('reward_revealed');
    setTimeout(() => {
      triggerConfetti();
    }, 100);
  };

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 3000);
  };

  const openGoogleMapsReview = () => {
    if (aiDraft) {
      navigator.clipboard.writeText(aiDraft);
    }
    const googleUrl =
      restaurant?.google_place_url ||
      `https://search.google.com/local/writereview?placeid=${restaurant?.slug === 'casa-bella' ? 'ChIJCasaBellaTrattoriaPune' : 'ChIJSaffronHouseKoregaonParkPune'}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-ivory-200 relative flex flex-col items-center">
        {/* Confetti canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* Modal Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-ivory-200">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
              <Gift className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 leading-tight">
                {step === 'urgent_service' || step === 'urgent_resolved'
                  ? 'Immediate Floor Assistance'
                  : 'Fill Form to Win Table Reward'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-700">
                {activeTable?.label || 'Table 1'} • 100% Guaranteed Reward
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-400 hover:text-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: THE INTRIGUING, SEAMLESS REWARD FORM                */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'form' && (
          <div className="w-full flex flex-col items-center pt-3 space-y-4 text-center">
            {/* Mystery Box Teaser */}
            <div className="w-full bg-gradient-to-br from-amber-500/10 via-saffron-500/10 to-amber-600/10 border border-amber-300/50 rounded-2xl p-4 text-center space-y-1 relative overflow-hidden">
              <div className="text-3xl animate-bounce">🎁</div>
              <h4 className="font-serif font-bold text-sm text-charcoal-900">
                Unlock Your Table's Mystery Dining Reward!
              </h4>
              <p className="text-[11px] text-charcoal-600 max-w-xs mx-auto leading-relaxed">
                Take 30 seconds to tell us about your visit today. Win an instant complimentary chef treat, craft beverage, or up to 20% off your bill!
              </p>
            </div>

            {/* Question 1: Star Rating */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800">
                1. How is your dining experience today?
              </label>

              <div className="flex items-center justify-center space-x-2 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingSelect(star)}
                    className="p-1 text-3xl transition-transform hover:scale-125 focus:outline-none"
                    title={`${star} Stars`}
                  >
                    <span
                      className={star <= starRating ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200'}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-semibold text-charcoal-500">
                {starRating === 5 ? 'Exceptional! ⭐⭐⭐⭐⭐' : 'Great! ⭐⭐⭐⭐'}
              </span>
            </div>

            {/* Question 2: Quick Highlights */}
            <div className="w-full space-y-1.5 text-left">
              <label className="block text-xs font-bold text-charcoal-800">
                2. What did your table love most? (Tap highlights)
              </label>

              <div className="flex flex-wrap gap-1.5">
                {quickTags.slice(0, 6).map((tag) => {
                  const isSel = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          isSel ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        isSel
                          ? 'bg-charcoal-900 text-white font-semibold shadow-xs'
                          : 'bg-ivory-100 text-charcoal-700 border border-ivory-200 hover:bg-ivory-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact for Voucher */}
            <div className="w-full grid grid-cols-2 gap-2 text-left pt-1">
              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={dinerName}
                  onChange={(e) => setDinerName(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 98220 12345"
                  value={dinerPhone}
                  onChange={(e) => setDinerPhone(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>
            </div>

            {/* WhatsApp Opt-in */}
            <label className="w-full flex items-center space-x-2 text-[11px] text-charcoal-700 cursor-pointer select-none text-left">
              <input
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4 border-ivory-300"
              />
              <span>Send me secret chef specials and table discounts on WhatsApp</span>
            </label>

            {/* PRIMARY SEAMLESS ACTION BUTTON */}
            <button
              type="button"
              onClick={handleClaimReward}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-105 active:scale-95 text-white font-serif text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>🎁 Submit &amp; Reveal My Reward →</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2: URGENT SERVICE ALERT (BELOW 4 STARS SELECTED)       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'urgent_service' && (
          <div className="w-full flex flex-col items-center pt-2 space-y-3.5 text-center">
            {/* Alert Badge */}
            <div className="w-full bg-red-50 border-2 border-red-300 rounded-2xl p-3.5 flex items-center space-x-3 text-left">
              <span className="text-2xl animate-pulse flex-shrink-0">🚨</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider block">
                  Urgent Staff Intervention Dispatched
                </span>
                <p className="text-xs font-bold text-red-950 mt-0.5">
                  Floor Manager alerted for {activeTable?.label || 'Table 1'} ({starRating}★ rating)!
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-charcoal-900">
                We Want to Make This Right Immediately!
              </h4>
              <p className="text-xs text-charcoal-600 mt-1 max-w-sm leading-relaxed">
                Your satisfaction is our absolute priority. A floor manager has been alerted to come to your table right now. Please tell us what we can fix immediately:
              </p>
            </div>

            {/* Quick Issue Chips */}
            <div className="w-full space-y-1 text-left">
              <label className="text-[11px] font-bold text-charcoal-700">What can we resolve right now?</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Food taste / temperature 🍲',
                  'Delayed dish ⏱️',
                  'Need water / extra cutlery 🍴',
                  'Billing inquiry 💳',
                  'Staff attention 😊',
                  'Other request'
                ].map((issue) => {
                  const isSel = urgentIssues.includes(issue);
                  return (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => {
                        setUrgentIssues((prev) =>
                          isSel ? prev.filter((i) => i !== issue) : [...prev, issue]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        isSel
                          ? 'bg-red-600 text-white font-semibold shadow-xs'
                          : 'bg-ivory-100 text-charcoal-700 border border-ivory-200 hover:bg-ivory-200'
                      }`}
                    >
                      {issue}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific Note for Manager */}
            <div className="w-full text-left">
              <label className="text-[11px] font-bold text-charcoal-700 mb-0.5 block">
                Any specific note for the manager?
              </label>
              <textarea
                value={urgentNote}
                onChange={(e) => setUrgentNote(e.target.value)}
                rows={2}
                placeholder="e.g. Dal Makhani was lukewarm, need warm replacement..."
                className="w-full bg-ivory-50 border border-ivory-200 rounded-xl p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-red-400 resize-none"
              />
            </div>

            {/* Contact */}
            <div className="w-full text-left">
              <input
                type="text"
                value={urgentContact}
                onChange={(e) => setUrgentContact(e.target.value)}
                placeholder="Your Name or Phone (optional)"
                className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="w-full space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSubmitUrgentDetails}
                disabled={isAlertingTeam}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-2xl font-serif text-xs sm:text-sm font-bold shadow-subtle transition-all flex items-center justify-center space-x-1.5"
              >
                <span>{isAlertingTeam ? 'Alerting Manager...' : '🚨 Send Manager to Table Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStarRating(5);
                  setStep('form');
                }}
                className="w-full py-1 text-charcoal-500 hover:text-charcoal-800 text-xs font-semibold"
              >
                ← Back to 5-Star Experience
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2-B: MANAGER DISPATCHED CONFIRMATION                  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'urgent_resolved' && (
          <div className="w-full flex flex-col items-center pt-4 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center text-3xl shadow-subtle border border-green-200">
              🏃‍♂️
            </div>

            <div>
              <h4 className="font-serif font-bold text-xl text-charcoal-900">
                A Manager is Heading to Your Table!
              </h4>
              <p className="text-xs text-charcoal-600 mt-1 max-w-sm leading-relaxed">
                The floor manager on duty has received your alert for {activeTable?.label || 'Table 1'} and is coming to assist you immediately.
              </p>
            </div>

            {/* Courtesy Voucher */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                Apology Hospitality Courtesy
              </span>
              <p className="font-mono text-xl font-bold text-charcoal-900">
                CARE15-{activeTable?.label?.replace(/\s+/g, '').toUpperCase() || 'TABLE1'}
              </p>
              <p className="text-[11px] text-amber-800">
                Enjoy 15% off today's bill with our sincerest apologies.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Return to Menu
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 3: REWARD REVEALED SCREEN (4/5 STARS)                 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'reward_revealed' && wonPrize && (
          <div className="w-full flex flex-col items-center pt-3 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-subtle border border-amber-200">
              {wonPrize.emoji}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
                🎉 Congratulations! You Won
              </span>
              <h4 className="font-serif text-2xl font-bold text-charcoal-900 mt-0.5">
                {wonPrize.label}
              </h4>
              <p className="text-xs text-charcoal-600 mt-1">
                Unlocked exclusively for <strong>{activeTable?.label || 'Table 1'}</strong>!
              </p>
            </div>

            {/* Official Redemption Voucher */}
            <div className="w-full bg-gradient-to-br from-amber-50 to-ivory-100 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-widest block">
                Official Table Voucher
              </span>

              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-2xl font-bold text-charcoal-900 tracking-wider">
                  {voucherCode}
                </span>
                <button
                  type="button"
                  onClick={() => voucherCode && copyVoucher(voucherCode)}
                  className="p-1.5 bg-white border border-amber-300 rounded-xl text-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
                  title="Copy Voucher Code"
                >
                  {copiedVoucher ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-green-700 font-semibold">
                ✓ Server &amp; Kitchen notified of your voucher for {activeTable?.label || 'Table 1'}
              </p>
              <p className="text-[10px] text-charcoal-500">
                Show this secret code to your server or at checkout to apply your reward.
              </p>
            </div>

            {/* 1-Tap Google Share (Optional bonus) */}
            <div className="w-full pt-1">
              <button
                type="button"
                onClick={openGoogleMapsReview}
                className="w-full py-2.5 bg-white hover:bg-ivory-50 text-charcoal-800 border border-ivory-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5"
              >
                <span>⭐ Post Your 5-Star Review to Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-charcoal-400" />
              </button>
            </div>

            {/* Return to menu */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle flex items-center justify-center space-x-1.5"
            >
              <span>Return to Dining Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
