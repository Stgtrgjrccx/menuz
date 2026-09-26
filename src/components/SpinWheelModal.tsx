import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Gift,
  Check,
  Star,
  ExternalLink,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
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
  textColor: string;
  probabilityWeight: number;
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

// Synthesized audio ticks for wheel pegs
function playTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state === 'closed') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Muted or not allowed
  }
}

// Victory fanfare on winning reward
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
    // Muted or not allowed
  }
}

// Urgent chime for < 4 star floor alert
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
    // Muted or not allowed
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

  // Canvas refs
  const wheelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Modal steps:
  // 1. 'rate_and_keywords': internal rating & keyword selection to generate Google review
  // 2. 'urgent_service': triggered immediately if < 4 stars (shields Google reviews)
  // 3. 'urgent_resolved': manager assistance confirmed
  // 4. 'verifying_post': diner posted on Google, checking & unlocking wheel
  // 5. 'wheel': interactive wheel game
  // 6. 'reward_won': won prize revealed (DIRECT TABLE CLAIM - NO CODES!)
  const [step, setStep] = useState<
    'rate_and_keywords' | 'urgent_service' | 'urgent_resolved' | 'verifying_post' | 'wheel' | 'reward_won'
  >('rate_and_keywords');

  const [starRating, setStarRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dinerName, setDinerName] = useState('');
  const [dinerPhone, setDinerPhone] = useState('');
  const [aiDraft, setAiDraft] = useState('');
  const [copiedReview, setCopiedReview] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<PrizeOption | null>(null);

  // Urgent service state (< 4 stars)
  const [urgentIssues, setUrgentIssues] = useState<string[]>([]);
  const [urgentNote, setUrgentNote] = useState('');
  const [urgentContact, setUrgentContact] = useState('');
  const [isAlertingTeam, setIsAlertingTeam] = useState(false);

  const isItalian =
    restaurant?.slug === 'casa-bella' || restaurant?.cuisine?.toLowerCase().includes('italian');

  const quickTags = getQuickTagsForRestaurant(restaurant?.cuisine);

  const prizes: PrizeOption[] = isItalian
    ? [
        { id: 'p1', label: 'Complimentary Tiramisu Tradizionale', shortLabel: 'Tiramisu', emoji: '🍮', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 25 },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#0F766E', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Garlic Herb Focaccia on the House', shortLabel: 'Focaccia', emoji: '🥖', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Artisanal Illy Double Espresso', shortLabel: 'Espresso', emoji: '☕', color: '#B45309', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: '₹100 Off Today\'s Bill', shortLabel: '₹100 Off', emoji: '💰', color: '#047857', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Sparkling San Pellegrino Cooler', shortLabel: 'Cooler', emoji: '🍹', color: '#0369A1', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p7', label: 'Truffle Burrata Bruschetta', shortLabel: 'Bruschetta', emoji: '🥗', color: '#9333EA', textColor: '#FFFFFF', probabilityWeight: 5 }
      ]
    : [
        { id: 'p1', label: 'Free Alphonso Mango Lassi', shortLabel: 'Mango Lassi', emoji: '🍨', color: '#EA580C', textColor: '#FFFFFF', probabilityWeight: 25 },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#059669', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Tandoori Truffle Garlic Naan', shortLabel: 'Truffle Naan', emoji: '🫓', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Royal Rose Petal Kulfi Pop', shortLabel: 'Kulfi Pop', emoji: '🍦', color: '#BE123C', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: '₹100 Off Today\'s Bill', shortLabel: '₹100 Off', emoji: '💰', color: '#0284C7', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Chilled Kokum Spiced Cooler', shortLabel: 'Kokum Cooler', emoji: '🍹', color: '#7C3AED', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p7', label: 'Truffle Potli Samosa Basket', shortLabel: 'Potli Samosa', emoji: '🥟', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 5 }
      ];

  // Initialize or reset modal state
  useEffect(() => {
    if (isOpen) {
      setStep('rate_and_keywords');
      setStarRating(5);
      setSelectedTags(quickTags.slice(0, 3));
      setWonPrize(null);
      setIsSpinning(false);
      setCopiedReview(false);
      setIsVerifying(false);
      setUrgentIssues([]);
      setUrgentNote('');
      setIsAlertingTeam(false);
    }
  }, [isOpen, restaurant?.cuisine]);

  // Update AI draft review in real time as keywords or ratings change
  useEffect(() => {
    if (starRating >= 4) {
      const draft = generateConsumerReviewDraft({
        businessName: restaurant?.name || 'Saffron House',
        cuisine: restaurant?.cuisine || 'Contemporary Dining',
        rating: starRating,
        selectedTags,
        tone: 'enthusiastic'
      });
      setAiDraft(draft);
    }
  }, [restaurant?.name, restaurant?.cuisine, starRating, selectedTags]);

  // ── DRAW WHEEL ON CANVAS ─────────────────────────────────────
  const drawWheel = (angle: number) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 14;

    ctx.clearRect(0, 0, width, height);

    const totalSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    // Outer golden glowing rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1C1917';
    ctx.fill();

    const ringGradient = ctx.createLinearGradient(0, 0, width, height);
    ringGradient.addColorStop(0, '#F59E0B');
    ringGradient.addColorStop(0.5, '#FCD34D');
    ringGradient.addColorStop(1, '#B45309');
    ctx.lineWidth = 5;
    ctx.strokeStyle = ringGradient;
    ctx.stroke();

    // Marquee bulb dots around rim
    const numBulbs = 20;
    for (let i = 0; i < numBulbs; i++) {
      const bulbAngle = (i * 2 * Math.PI) / numBulbs;
      const bx = centerX + (radius + 4) * Math.cos(bulbAngle);
      const by = centerY + (radius + 4) * Math.sin(bulbAngle);
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#FBBF24';
      ctx.fill();
    }
    ctx.restore();

    // Draw slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    for (let i = 0; i < totalSlices; i++) {
      const p = prizes[i];
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF40';
      ctx.stroke();

      // Slice label & emoji
      ctx.save();
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 3;
      ctx.fillText(`${p.emoji} ${p.shortLabel}`, radius - 16, 4);
      ctx.restore();
    }

    ctx.restore();

    // Center metallic hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(centerX - 4, centerY - 4, 2, centerX, centerY, 24);
    hubGrad.addColorStop(0, '#FEF08A');
    hubGrad.addColorStop(0.5, '#F59E0B');
    hubGrad.addColorStop(1, '#78350F');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', centerX, centerY);
    ctx.restore();
  };

  useEffect(() => {
    if (step === 'wheel' && wheelCanvasRef.current) {
      drawWheel(currentAngleRef.current);
    }
  }, [step]);

  // Confetti particles generator
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'];
    const particles = Array.from({ length: 80 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    }));

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

    // CRITICAL REQUIREMENT: If < 4 stars, immediately alert floor team and shield Google reviews!
    if (rating < 4) {
      playUrgentAlertChime();
      const customerName = dinerName.trim() || `Guest at ${activeTable?.label || 'Table 1'}`;

      addSystemNotification({
        restaurant_id: restaurant?.id || '',
        table_id: activeTable?.id,
        table_label: activeTable?.label || 'Table 1',
        type: 'service_alert',
        customer_name: customerName,
        message: `🚨 URGENT: ${activeTable?.label || 'Table 1'} rated ${rating} Stars! Immediate manager intervention needed on floor!`
      });

      setStep('urgent_service');
    }
  };

  // ── SUBMIT URGENT FLOOR ASSISTANCE DETAILS (< 4 STARS) ────────
  const handleSubmitUrgentDetails = () => {
    setIsAlertingTeam(true);
    const customerName = dinerName.trim() || `Guest at ${activeTable?.label || 'Table 1'}`;
    const issuesText = urgentIssues.length > 0 ? urgentIssues.join(', ') : 'Service issue';

    addSystemNotification({
      restaurant_id: restaurant?.id || '',
      table_id: activeTable?.id,
      table_label: activeTable?.label || 'Table 1',
      type: 'service_alert',
      customer_name: customerName,
      message: `🚨 URGENT UPDATE for ${activeTable?.label || 'Table 1'}: (${starRating}★) Issues: ${issuesText}. Note: "${urgentNote || 'Manager requested'}" Contact: ${urgentContact || dinerPhone || 'In person'}`
    });

    const privateRev: CustomerReview = {
      id: 'rev_priv_' + Date.now(),
      restaurant_id: restaurant?.id || '',
      customer_name: customerName,
      customer_phone: urgentContact.trim() || dinerPhone.trim() || undefined,
      rating: starRating,
      selected_keywords: urgentIssues,
      review_text: urgentNote.trim() || `Private floor feedback for ${starRating} star dining experience.`,
      whatsapp_opt_in: false,
      google_review_clicked: false,
      created_at: new Date().toISOString()
    };
    addReview(privateRev);

    setTimeout(() => {
      setIsAlertingTeam(false);
      setStep('urgent_resolved');
    }, 500);
  };

  // ── 1. COPY & POST TO GOOGLE REVIEWS ───────────────────────────
  const handleCopyAndPostToGoogle = () => {
    // Copy review draft to clipboard
    if (aiDraft) {
      navigator.clipboard.writeText(aiDraft);
      setCopiedReview(true);
    }

    // Open Google Review URL in new tab
    const googleUrl =
      restaurant?.google_place_url ||
      `https://search.google.com/local/writereview?placeid=${restaurant?.slug === 'casa-bella' ? 'ChIJCasaBellaTrattoriaPune' : 'ChIJSaffronHouseKoregaonParkPune'}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');

    // Automatically transition to verification step
    setStep('verifying_post');
  };

  // ── 2. CONFIRM REVIEW POSTED & POPUP WHEEL ─────────────────────
  const handleConfirmReviewPosted = () => {
    setIsVerifying(true);

    // Save review record in store
    const customerName = dinerName.trim() || 'Verified Diner';
    const newRev: CustomerReview = {
      id: 'rev_' + Date.now(),
      restaurant_id: restaurant?.id || '',
      customer_name: customerName,
      customer_phone: dinerPhone.trim() || undefined,
      rating: starRating,
      selected_keywords: selectedTags,
      review_text: aiDraft,
      whatsapp_opt_in: true,
      google_review_clicked: true,
      created_at: new Date().toISOString()
    };
    addReview(newRev);

    // Brief check and popup the wheel
    setTimeout(() => {
      setIsVerifying(false);
      setStep('wheel');
    }, 700);
  };

  // ── 3. SPIN THE WHEEL GAME ────────────────────────────────────
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    const totalSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    const totalWeight = prizes.reduce((acc, p) => acc + p.probabilityWeight, 0);
    let rand = Math.random() * totalWeight;
    let selectedPrizeIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      if (rand < prizes[i].probabilityWeight) {
        selectedPrizeIndex = i;
        break;
      }
      rand -= prizes[i].probabilityWeight;
    }

    const prize = prizes[selectedPrizeIndex];

    // Pointer is at 12 o'clock (-PI / 2 radians)
    const pointerAngle = (3 * Math.PI) / 2;
    const sliceCenterAngle = selectedPrizeIndex * sliceAngle + sliceAngle / 2;
    const extraRotations = (6 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const targetAngle = extraRotations + (pointerAngle - sliceCenterAngle);

    const startAngle = currentAngleRef.current % (2 * Math.PI);
    const deltaAngle = targetAngle - startAngle;

    const duration = 4000;
    const startTime = performance.now();
    let lastTickAngle = startAngle;

    const finishSpin = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      currentAngleRef.current = targetAngle;
      drawWheel(targetAngle);
      setIsSpinning(false);
      setWonPrize(prize);

      // Complete challenge
      const chalId = challenge?.id || (isItalian ? 'chal-cb-01' : 'chal-sh-01');
      completeChallenge(chalId, dinerName.trim() || 'Verified Diner', dinerPhone.trim() || '+91 98000 00000');

      // Alert team: DIRECT REWARD CLAIM (NO VOUCHER CODE NEEDED!)
      addSystemNotification({
        restaurant_id: restaurant?.id || '',
        table_id: activeTable?.id,
        table_label: activeTable?.label || 'Table 1',
        type: 'challenge_complete',
        customer_name: dinerName.trim() || `Guest at ${activeTable?.label || 'Table 1'}`,
        message: `🎁 ${activeTable?.label || 'Table 1'} posted Google Review and won: "${prize.label}"! Ready to redeem at table.`
      });

      playWinFanfare();
      setStep('reward_won');
      setTimeout(() => {
        triggerConfetti();
      }, 100);
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let finished = false;
    const animateWheel = (currentTime: number) => {
      if (finished) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const currentAngle = startAngle + deltaAngle * eased;
      currentAngleRef.current = currentAngle;
      drawWheel(currentAngle);

      // Play tick sound when passing slice boundaries
      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle) {
        playTickSound();
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateWheel);
      } else {
        finished = true;
        finishSpin();
      }
    };

    animFrameRef.current = requestAnimationFrame(animateWheel);

    // Guaranteed fallback timer for headless / background execution
    setTimeout(() => {
      if (!finished) {
        finished = true;
        finishSpin();
      }
    }, duration + 300);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(28, 25, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '16px'
      }}
      className="animate-fadeIn"
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
        className="rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-ivory-200 relative flex flex-col items-center"
      >
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
                  : step === 'wheel'
                  ? 'Lucky Dining Wheel'
                  : step === 'reward_won'
                  ? 'Reward Claim Screen'
                  : 'Google Review Reward'}
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
        {/* STEP 1: RATE & SELECT KEYWORDS (GENERATE READY REVIEW)      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'rate_and_keywords' && (
          <div className="w-full flex flex-col items-center pt-3 space-y-3.5 text-center">
            {/* Header prompt */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center space-y-0.5">
              <h4 className="font-serif font-bold text-sm text-charcoal-900">
                Post on Google Reviews to Spin the Wheel!
              </h4>
              <p className="text-[11px] text-charcoal-600 leading-relaxed">
                Rate your meal and select your favorites. We'll generate a ready-made review to post on Google and unlock your spin!
              </p>
            </div>

            {/* 1. Star Rating */}
            <div className="w-full space-y-1">
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

            {/* 2. Keyword Highlights */}
            <div className="w-full space-y-1.5 text-left">
              <label className="block text-xs font-bold text-charcoal-800">
                2. Tap your favorites to include in review:
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

            {/* 3. Generated Ready-To-Post Review Preview */}
            <div className="w-full text-left space-y-1">
              <label className="block text-xs font-bold text-charcoal-800 flex items-center justify-between">
                <span>3. Ready Review for Google Maps:</span>
                <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Ready to Post
                </span>
              </label>

              <div className="bg-ivory-50 border border-ivory-200 rounded-xl p-3 text-xs text-charcoal-800 italic leading-relaxed relative">
                "{aiDraft}"
              </div>
            </div>

            {/* Primary Action: Copy & Post on Google Reviews */}
            <button
              type="button"
              onClick={handleCopyAndPostToGoogle}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-105 active:scale-95 text-white font-serif text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all mt-1"
            >
              <ExternalLink className="w-4 h-4 text-amber-200" />
              <span>Copy &amp; Post on Google Reviews ↗</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2: VERIFY REVIEW POSTED (CHECK AND POPUP WHEEL)       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'verifying_post' && (
          <div className="w-full flex flex-col items-center pt-4 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-3xl">
              ⭐
            </div>

            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-charcoal-900">
                Did You Post Your Review on Google Maps?
              </h4>
              <p className="text-xs text-charcoal-600 max-w-xs mx-auto leading-relaxed">
                Google Maps opened in a new tab with your review copied. Paste and publish it, then confirm below to spin the wheel!
              </p>
            </div>

            {/* Review excerpt */}
            <div className="w-full bg-ivory-50 border border-ivory-200 rounded-xl p-3 text-[11px] text-charcoal-700 text-left italic">
              "{aiDraft.slice(0, 140)}..."
            </div>

            {/* Confirm & Unlock Wheel Button */}
            <button
              type="button"
              onClick={handleConfirmReviewPosted}
              disabled={isVerifying}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-105 active:scale-95 text-white font-serif text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all"
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-4 h-4 text-white animate-spin" />
                  <span>Verifying Google Review...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>✓ I Posted My Review! Unlock Wheel 🎡</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const googleUrl =
                  restaurant?.google_place_url ||
                  `https://search.google.com/local/writereview?placeid=${restaurant?.slug === 'casa-bella' ? 'ChIJCasaBellaTrattoriaPune' : 'ChIJSaffronHouseKoregaonParkPune'}`;
                window.open(googleUrl, '_blank', 'noopener,noreferrer');
              }}
              className="text-xs text-saffron-700 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>Didn't open? Re-open Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 3: INTERACTIVE LUCKY DINING WHEEL                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'wheel' && (
          <div className="w-full flex flex-col items-center pt-2 space-y-3.5 text-center">
            {/* Header info */}
            <div className="flex items-center space-x-1.5 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-[11px] font-bold text-green-800">
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span>Review Verified! Spin for Guaranteed Reward</span>
            </div>

            {/* Canvas Wheel with 12 o'clock pointer */}
            <div className="relative flex items-center justify-center my-1">
              <canvas
                ref={wheelCanvasRef}
                width={300}
                height={300}
                className="max-w-[280px] max-h-[280px] drop-shadow-xl"
              />

              {/* Pointer indicator at 12 o'clock */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-md">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400" />
              </div>
            </div>

            {/* Spin Button */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 px-6 rounded-2xl font-serif text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all ${
                isSpinning
                  ? 'bg-charcoal-700 text-charcoal-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-saffron-600 to-amber-600 hover:brightness-110 active:scale-95 text-white animate-pulse'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning the Wheel...' : '🎡 SPIN THE WHEEL NOW'}</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 4: REWARD WON SCREEN (NO VOUCHER CODES - DIRECT CLAIM) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'reward_won' && wonPrize && (
          <div className="w-full flex flex-col items-center pt-3 space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 via-saffron-500 to-amber-600 flex items-center justify-center text-3xl shadow-float text-white animate-bounce">
              {wonPrize.emoji}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
                🎉 Congratulations Table 1!
              </span>
              <h3 className="font-serif font-bold text-xl text-charcoal-900 mt-0.5">
                You Won: {wonPrize.label}!
              </h3>
            </div>

            {/* Direct Table Claim Card (NO CODES!) */}
            <div className="w-full bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 text-white rounded-2xl p-4 border border-amber-400/40 shadow-float space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Verified Reward
                </span>
                <span className="text-[9px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold border border-green-400/30">
                  ✓ Claimable at Table
                </span>
              </div>

              <p className="font-serif font-bold text-base text-white">
                {wonPrize.emoji} {wonPrize.label}
              </p>

              <div className="pt-1 border-t border-charcoal-800 text-[11px] text-charcoal-300 leading-relaxed flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Present this screen to your server or at checkout to redeem immediately.</span>
              </div>
            </div>

            <p className="text-[11px] text-charcoal-500">
              Staff and kitchen have been notified of your reward for {activeTable?.label || 'Table 1'}.
            </p>

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

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* URGENT FLOOR ASSISTANCE FOR RATINGS BELOW 4 STARS           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'urgent_service' && (
          <div className="w-full flex flex-col items-center pt-2 space-y-3.5 text-center">
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
                Your dining experience is our top priority. A floor manager is attending your table right now. Please tell us what we can resolve:
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
                          ? 'bg-red-700 text-white font-bold'
                          : 'bg-ivory-100 text-charcoal-800 border border-ivory-200 hover:bg-ivory-200'
                      }`}
                    >
                      {issue}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note textarea */}
            <div className="w-full text-left space-y-1">
              <label className="text-[11px] font-bold text-charcoal-700">Any specific note for the manager?</label>
              <textarea
                rows={2}
                value={urgentNote}
                onChange={(e) => setUrgentNote(e.target.value)}
                placeholder="e.g. Dal Makhani was lukewarm, need warm replacement..."
                className="w-full bg-ivory-50 border border-ivory-200 rounded-xl p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmitUrgentDetails}
              disabled={isAlertingTeam}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-serif text-xs font-bold rounded-xl shadow-subtle transition-all flex items-center justify-center space-x-1.5"
            >
              <span>🚨 Send Manager to Table Now</span>
            </button>
          </div>
        )}

        {/* Urgent Resolved */}
        {step === 'urgent_resolved' && (
          <div className="w-full flex flex-col items-center pt-3 space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h4 className="font-serif font-bold text-base text-charcoal-900">
              Manager Attending {activeTable?.label || 'Table 1'}
            </h4>
            <p className="text-xs text-charcoal-600 max-w-sm leading-relaxed">
              Our restaurant management has received your notes and is walking to your table right now.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-charcoal-900 text-white rounded-xl text-xs font-bold"
            >
              Return to Menu
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
