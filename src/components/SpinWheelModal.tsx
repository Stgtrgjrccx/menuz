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
  AlertTriangle,
  Clock,
  Timer,
  Lock,
  Key,
  Copy,
  CheckCircle2,
  Radio
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
  const [reviewTone, setReviewTone] = useState<'enthusiastic' | 'detailed' | 'concise'>('enthusiastic');
  const [variationIndex, setVariationIndex] = useState<number>(0);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<PrizeOption | null>(null);

  // Anti-Cheat & Live Security Voucher State
  const [voucherSecondsLeft, setVoucherSecondsLeft] = useState<number>(900); // 15 mins (900s)
  const [liveClock, setLiveClock] = useState<string>('');
  const [isVoucherRedeemed, setIsVoucherRedeemed] = useState<boolean>(false);
  const [redeemedTimestamp, setRedeemedTimestamp] = useState<string>('');
  const [showStaffPinModal, setShowStaffPinModal] = useState<boolean>(false);
  const [staffPinInput, setStaffPinInput] = useState<string>('');
  const [pinErrorMessage, setPinErrorMessage] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);

  // Live ticking security clock for anti-screenshot verification
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // 15-Minute Countdown Timer for Live Table Voucher
  useEffect(() => {
    if (step === 'reward_won' && !isVoucherRedeemed && voucherSecondsLeft > 0) {
      const timer = setInterval(() => {
        setVoucherSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, isVoucherRedeemed, voucherSecondsLeft]);

  // Urgent service state (< 4 stars)
  const [urgentIssues, setUrgentIssues] = useState<string[]>([]);
  const [urgentNote, setUrgentNote] = useState('');
  const [urgentContact, setUrgentContact] = useState('');
  const [isAlertingTeam, setIsAlertingTeam] = useState(false);

  const isItalian =
    restaurant?.slug === 'casa-bella' || restaurant?.cuisine?.toLowerCase().includes('italian');

  const quickTags = getQuickTagsForRestaurant(restaurant?.cuisine);

  const allowDiscounts = restaurant?.reward_settings?.allow_bill_discounts ?? false;
  const ownerDiscountPct = restaurant?.reward_settings?.discount_percentage ?? 10;
  const discountLabel = restaurant?.reward_settings?.custom_discount_label || `${ownerDiscountPct}% Off Next Visit`;

  const prizes: PrizeOption[] = isItalian
    ? [
        { id: 'p1', label: 'Complimentary Tiramisu Tradizionale', shortLabel: 'Tiramisu', emoji: '🍮', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 25 },
        allowDiscounts 
          ? { id: 'p2', label: discountLabel, shortLabel: `${ownerDiscountPct}% Off`, emoji: '🏷️', color: '#0F766E', textColor: '#FFFFFF', probabilityWeight: 15 }
          : { id: 'p2', label: 'Chef\'s Artisan Truffle Arancini', shortLabel: 'Truffle Arancini', emoji: '🧀', color: '#0F766E', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Garlic Herb Focaccia on the House', shortLabel: 'Focaccia', emoji: '🥖', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Artisanal Illy Double Espresso', shortLabel: 'Espresso', emoji: '☕', color: '#B45309', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: 'VIP Priority Weekend Table Pass', shortLabel: 'VIP Table Pass', emoji: '⭐', color: '#047857', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Sparkling San Pellegrino Cooler', shortLabel: 'Cooler', emoji: '🍹', color: '#0369A1', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p7', label: 'Truffle Burrata Bruschetta', shortLabel: 'Bruschetta', emoji: '🥗', color: '#9333EA', textColor: '#FFFFFF', probabilityWeight: 5 }
      ]
    : [
        { id: 'p1', label: 'Complimentary Alphonso Mango Lassi', shortLabel: 'Mango Lassi', emoji: '🍨', color: '#EA580C', textColor: '#FFFFFF', probabilityWeight: 25 },
        allowDiscounts
          ? { id: 'p2', label: discountLabel, shortLabel: `${ownerDiscountPct}% Off`, emoji: '🏷️', color: '#059669', textColor: '#FFFFFF', probabilityWeight: 15 }
          : { id: 'p2', label: 'Chef\'s Special Saffron Shahi Tukda', shortLabel: 'Shahi Tukda', emoji: '🍮', color: '#059669', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Tandoori Truffle Garlic Naan Basket', shortLabel: 'Truffle Naan', emoji: '🫓', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Royal Rose Petal Kulfi Pop', shortLabel: 'Kulfi Pop', emoji: '🍦', color: '#BE123C', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: 'VIP Priority Weekend Table Reservation', shortLabel: 'VIP Reservation', emoji: '⭐', color: '#0284C7', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Chilled Kokum Spiced Artisan Cooler', shortLabel: 'Kokum Cooler', emoji: '🍹', color: '#7C3AED', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p7', label: 'Crispy Truffle Potli Samosa Basket', shortLabel: 'Potli Samosa', emoji: '🥟', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 5 }
      ];

  // Initialize or reset modal state
  useEffect(() => {
    if (isOpen) {
      setStep('rate_and_keywords');
      setStarRating(5);
      setSelectedTags(quickTags.slice(0, 3));
      setReviewTone('enthusiastic');
      setVariationIndex(0);
      setWonPrize(null);
      setIsSpinning(false);
      setCopiedReview(false);
      setIsVerifying(false);
      setUrgentIssues([]);
      setUrgentNote('');
      setIsAlertingTeam(false);
    }
  }, [isOpen, restaurant?.cuisine]);

  // Update AI draft review in real time as keywords, ratings, tone, or variations change
  useEffect(() => {
    if (starRating >= 4) {
      const draft = generateConsumerReviewDraft({
        businessName: restaurant?.name || 'Saffron House',
        cuisine: restaurant?.cuisine || 'Contemporary Dining',
        rating: starRating,
        selectedTags,
        tone: reviewTone,
        variationIndex
      });
      setAiDraft(draft);
    }
  }, [restaurant?.name, restaurant?.cuisine, starRating, selectedTags, reviewTone, variationIndex]);

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
      const uniqueCode = `${isItalian ? 'CASA' : 'SAFFRON'}-WIN-${Math.floor(1000 + Math.random() * 9000)}`;
      setVoucherCode(uniqueCode);
      setVoucherSecondsLeft(900); // 15 mins
      setIsVoucherRedeemed(false);
      setRedeemedTimestamp('');

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
        padding: '12px'
      }}
      className="animate-fadeIn"
    >
      <div
        style={{
          backgroundColor: '#0D1322',
          maxHeight: '94vh',
          overflowY: 'auto'
        }}
        className="rounded-2xl sm:rounded-3xl max-w-md w-full p-3.5 sm:p-6 shadow-2xl border border-white/[0.08] relative flex flex-col items-center text-slate-100"
      >
        {/* Confetti canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* Modal Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Gift className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-white leading-tight">
                {step === 'urgent_service' || step === 'urgent_resolved'
                  ? 'Immediate Floor Assistance'
                  : step === 'wheel'
                  ? 'Lucky Dining Wheel'
                  : step === 'reward_won'
                  ? 'Reward Claim Screen'
                  : 'Google Review Reward'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {activeTable?.label || 'Table 1'} • 100% Guaranteed Reward
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: RATE & SELECT KEYWORDS (GENERATE READY REVIEW)      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: ULTRA-CLEAN 5-STAR REVIEW GENERATOR & PREVIEW       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'rate_and_keywords' && (
          <div className="w-full flex flex-col pt-1 space-y-3.5 text-left">
            {/* Header banner */}
            <div className="w-full bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-3.5 flex items-start space-x-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif font-black text-sm sm:text-base text-white tracking-wide">
                    1-Tap Google Review Generator
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Reward Unlocked
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Rate your meal &amp; tap your highlights. We generate an authentic 5-star Google review below ready for you to copy, edit, and post!
                </p>
              </div>
            </div>

            {/* 1. Interactive Star Rating */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/[0.08] space-y-1.5 text-center shadow-md">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-200">Rate your experience:</span>
                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {starRating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5/5)' : starRating === 4 ? '⭐⭐⭐⭐ Very Good (4/5)' : `⭐ ${starRating} Stars (Private Feedback)`}
                </span>
              </div>

              <div className="flex items-center justify-center space-x-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingSelect(star)}
                    className="p-1 text-3xl sm:text-4xl transition-all hover:scale-125 active:scale-95 focus:outline-none cursor-pointer"
                    title={`${star} Stars`}
                  >
                    <span
                      className={
                        star <= starRating
                          ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : 'text-slate-700 hover:text-slate-500'
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Highlight Tag Chips */}
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/[0.08] space-y-2 shadow-md">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-200">Tap highlights to include in your review:</span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">{selectedTags.length} selected</span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
                {quickTags.map((tag) => {
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
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                        isSel
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                          : 'bg-[#12192B] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {isSel && <Check className="w-3 h-3 text-slate-950" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. LIVE AI GENERATED REVIEW BOX (Visible, Editable, Real-Time) */}
            <div className="p-3.5 bg-[#0A0F1D] rounded-2xl border-2 border-amber-500/40 shadow-xl space-y-2.5 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <label className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
                    Live Generated Review Draft
                  </label>
                </div>

                {/* Tone Controls & Shuffle */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setReviewTone('enthusiastic')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      reviewTone === 'enthusiastic' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Enthusiastic
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewTone('detailed')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      reviewTone === 'detailed' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Foodie
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewTone('concise')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      reviewTone === 'concise' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Crisp
                  </button>

                  <button
                    type="button"
                    onClick={() => setVariationIndex((prev) => prev + 1)}
                    className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer ml-1"
                    title="Shuffle AI draft variation"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editable Live Textarea with in-place copy button */}
              <div className="relative">
                <textarea
                  value={aiDraft}
                  onChange={(e) => setAiDraft(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-white/[0.12] rounded-xl p-3 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-amber-400 resize-none shadow-inner"
                  placeholder="Generating review draft..."
                />

                <button
                  type="button"
                  onClick={() => {
                    if (aiDraft) {
                      navigator.clipboard.writeText(aiDraft);
                      setCopiedReview(true);
                      setTimeout(() => setCopiedReview(false), 2000);
                    }
                  }}
                  className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1 cursor-pointer ${
                    copiedReview
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-900/90 text-slate-300 border-white/20 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {copiedReview ? (
                    <>
                      <Check className="w-3 h-3 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="italic text-slate-400">Feel free to customize or edit the text above</span>
                <span className="font-mono text-slate-400">{aiDraft.length} characters</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={handleCopyAndPostToGoogle}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:scale-98 text-slate-950 font-serif font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-xl shadow-amber-500/25 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-slate-950" />
                <span>Copy Draft &amp; Post on Google Reviews ↗</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 leading-tight">
                Review draft copies automatically to clipboard. Simply paste it on Google Maps and confirm to spin the wheel!
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2: VERIFY REVIEW POSTED (CHECK AND POPUP WHEEL)       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'verifying_post' && (
          <div className="w-full flex flex-col items-center pt-4 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-500/40 text-amber-300 flex items-center justify-center text-3xl">
              ⭐
            </div>

            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-white">
                Did You Post Your Review on Google Maps?
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Google Maps opened in a new tab with your review copied. Paste and publish it, then confirm below to spin the wheel!
              </p>
            </div>

            {/* Full AI-generated review — shown only after user decides to participate */}
            <div className="w-full text-left space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">Your ready-made review:</label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiDraft);
                    setCopiedReview(true);
                    setTimeout(() => setCopiedReview(false), 2000);
                  }}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                    copiedReview
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#12192B] text-slate-400 border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {copiedReview ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
              <div className="bg-[#12192B] border border-white/[0.08] rounded-xl p-3 text-[11px] text-slate-200 italic leading-relaxed">
                “{aiDraft}”
              </div>
              <p className="text-[10px] text-slate-500 text-center">Paste this into Google Maps → then confirm below to unlock your spin.</p>
            </div>

            {/* Confirm & Unlock Wheel Button */}
            <button
              type="button"
              onClick={handleConfirmReviewPosted}
              disabled={isVerifying}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-105 active:scale-95 text-white font-serif text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
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
              className="text-xs text-amber-400 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
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
            <div className="flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              className={`w-full py-4 px-6 rounded-2xl font-serif text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isSpinning
                  ? 'bg-white/[0.06] text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 animate-pulse shadow-lg'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning the Wheel...' : '🎡 SPIN THE WHEEL NOW'}</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 4: REWARD WON SCREEN (ANTI-CHEAT LIVE SECURITY CARD)   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {step === 'reward_won' && wonPrize && (
          <div className="w-full flex flex-col items-center pt-2 space-y-3.5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-3xl text-slate-950 animate-bounce shadow-lg">
              {wonPrize.emoji}
            </div>

            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                🎉 Verified Google Review Winner!
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-0.5">
                {wonPrize.label}
              </h3>
            </div>

            {/* ANTI-CHEAT DYNAMIC LIVE VOUCHER CARD */}
            <div className="w-full relative overflow-hidden rounded-2xl border-2 border-amber-400 text-left bg-gradient-to-br from-[#090D16] via-[#0D1322] to-[#090D16] text-white p-4 space-y-3">
              {/* Animated Live Security Watermark Banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    Live Session: {liveClock || 'Active'}
                  </span>
                </div>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Anti-Screenshot Guard
                </span>
              </div>

              {/* Status Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Authorized Diner Table
                  </span>
                  <span className="text-sm font-bold text-white font-serif">
                    {activeTable?.label || 'Table 1'} • {restaurant?.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Security Code</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-xs font-black text-amber-400 tracking-wider">
                      {voucherCode || 'WIN-4821'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(voucherCode || 'WIN-4821');
                        setCopiedVoucher(true);
                        setTimeout(() => setCopiedVoucher(false), 2000);
                      }}
                      className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                      title="Copy Voucher Code"
                    >
                      {copiedVoucher ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reward Display */}
              <div className="bg-[#12192B] border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{wonPrize.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{wonPrize.label}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Valid on today's dining bill</span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-400/30">
                  {wonPrize.shortLabel}
                </span>
              </div>

              {/* 15-MINUTE LIVE COUNTDOWN TIMER OR REDEEMED SEAL */}
              {!isVoucherRedeemed ? (
                voucherSecondsLeft > 0 ? (
                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Live Claim Window
                      </span>
                      <span className="font-mono font-black text-amber-400 text-sm tracking-wider">
                        {Math.floor(voucherSecondsLeft / 60).toString().padStart(2, '0')}:
                        {(voucherSecondsLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#090D16] h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-1000"
                        style={{ width: `${(voucherSecondsLeft / 900) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-amber-200/70 block leading-tight">
                      Screenshots and expired timers will not be accepted by staff.
                    </span>
                  </div>
                ) : (
                  <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-2.5 flex items-center space-x-2 text-red-300 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>Voucher expired. Please request a new bill from your server.</span>
                  </div>
                )
              ) : (
                <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 flex items-center space-x-2.5 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold block uppercase tracking-wide">
                      ✓ VOIDED & APPLIED TO BILL
                    </span>
                    <span className="text-[10px] text-emerald-400/80">
                      Redeemed by Server at {redeemedTimestamp} • Cannot be re-used.
                    </span>
                  </div>
                </div>
              )}

              {/* INSTANT ZERO-PASSWORD 1-TAP REDEMPTION */}
              {!isVoucherRedeemed && voucherSecondsLeft > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-1">
                    <p className="text-xs font-bold text-amber-300">
                      Show this voucher code to your waiter or server
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Zero password required. Your reward is automatically honored on your table bill.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsVoucherRedeemed(true);
                      setRedeemedTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
                      playWinFanfare();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Redeem Voucher at Table (1-Tap)</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Kitchen staff & POS have been alerted for {activeTable?.label || 'Table 1'}.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
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
            <div className="w-full bg-red-950/40 border-2 border-red-500/40 rounded-2xl p-3.5 flex items-center space-x-3 text-left">
              <span className="text-2xl animate-pulse flex-shrink-0">🚨</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider block">
                  Urgent Staff Intervention Dispatched
                </span>
                <p className="text-xs font-bold text-red-200 mt-0.5">
                  Floor Manager alerted for {activeTable?.label || 'Table 1'} ({starRating}★ rating)!
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-white">
                We Want to Make This Right Immediately!
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                Your dining experience is our top priority. A floor manager is attending your table right now. Please tell us what we can resolve:
              </p>
            </div>

            {/* Quick Issue Chips */}
            <div className="w-full space-y-1 text-left">
              <label className="text-[11px] font-bold text-slate-400">What can we resolve right now?</label>
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
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                        isSel
                          ? 'bg-red-700 text-white font-bold'
                          : 'bg-[#12192B] text-slate-200 border border-white/[0.08] hover:bg-white/[0.06]'
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
              <label className="text-[11px] font-bold text-slate-400">Any specific note for the manager?</label>
              <textarea
                rows={2}
                value={urgentNote}
                onChange={(e) => setUrgentNote(e.target.value)}
                placeholder="e.g. Dal Makhani was lukewarm, need warm replacement..."
                className="w-full bg-[#090D16] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmitUrgentDetails}
              disabled={isAlertingTeam}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-serif text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>🚨 Send Manager to Table Now</span>
            </button>

            <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-white/[0.08] text-xs">
              <a
                href={restaurant?.google_place_url || 'https://maps.google.com'}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-white underline flex items-center gap-1 font-medium"
              >
                <span>Leave public review on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setStep('wheel')}
                className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Spin Table Wheel →
              </button>
            </div>
          </div>
        )}

        {/* Urgent Resolved */}
        {step === 'urgent_resolved' && (
          <div className="w-full flex flex-col items-center pt-3 space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-300 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h4 className="font-serif font-bold text-base text-white">
              Manager Attending {activeTable?.label || 'Table 1'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Our restaurant management has received your notes and is walking to your table right now.
            </p>
            <div className="w-full space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('wheel')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Claim Table Appreciation Wheel Treat
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-[#090D16] border border-white/[0.08] text-slate-300 rounded-xl text-xs font-semibold hover:bg-white/[0.06] hover:text-white cursor-pointer"
              >
                Return to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
