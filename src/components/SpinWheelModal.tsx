import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Award,
  Check,
  Copy,
  CheckCircle2,
  Gift,
  RotateCw,
  Star,
  Volume2,
  VolumeX,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
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
  textColor: string;
  probabilityWeight: number;
}

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTable: RestaurantTable | null;
  challenge?: ReviewChallenge | null;
  initialMode?: 'review' | 'wheel';
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

// Synthesized audio without external network dependencies
function playTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state === 'closed') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Audio muted or not allowed
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

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  activeTable,
  challenge,
  initialMode = 'review'
}) => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const completeChallenge = useRestaurantStore((state) => state.completeChallenge);
  const addSystemNotification = useRestaurantStore((state) => state.addSystemNotification);
  const addReview = useRestaurantStore((state) => state.addReview);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Workflow mode: 'review' (AI draft + Google link) or 'wheel' (Lucky spin game)
  const [currentStep, setCurrentStep] = useState<'review' | 'negative' | 'wheel' | 'thanks_private'>('review');

  // Review generator state
  const [starRating, setStarRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewTone, setReviewTone] = useState<'enthusiastic' | 'concise' | 'detailed'>('enthusiastic');
  const [customNotes, setCustomNotes] = useState('');
  const [variationIndex, setVariationIndex] = useState(0);
  const [aiDraft, setAiDraft] = useState('');
  const [copiedReview, setCopiedReview] = useState(false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  // Negative feedback shield state
  const [negativeTags, setNegativeTags] = useState<string[]>([]);
  const [negativeComment, setNegativeComment] = useState('');
  const [negativeContact, setNegativeContact] = useState('');
  const [negativeSubmitting, setNegativeSubmitting] = useState(false);

  // Diner contact & game state
  const [dinerName, setDinerName] = useState('');
  const [dinerPhone, setDinerPhone] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wonPrize, setWonPrize] = useState<PrizeOption | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);

  // Dynamic tags based on restaurant cuisine
  const quickTags = getQuickTagsForRestaurant(restaurant?.cuisine);

  // Reset or initialize state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialMode === 'wheel' ? 'wheel' : 'review');
      setStarRating(5);
      setSelectedTags(quickTags.slice(0, 3));
      setVariationIndex(0);
      setCopiedReview(false);
      setWonPrize(null);
      setVoucherCode(null);
      setHasSpun(false);
      setNegativeTags([]);
      setNegativeComment('');
    }
  }, [isOpen, initialMode, restaurant?.cuisine]);

  // Update AI draft whenever tags, notes, tone, or variation changes
  useEffect(() => {
    if (starRating >= 4) {
      const draft = generateConsumerReviewDraft({
        businessName: restaurant?.name || 'Saffron House',
        cuisine: restaurant?.cuisine || 'Contemporary Dining',
        rating: starRating,
        selectedTags,
        customNotes,
        tone: reviewTone,
        variationIndex
      });
      setAiDraft(draft);
    }
  }, [restaurant?.name, restaurant?.cuisine, starRating, selectedTags, customNotes, reviewTone, variationIndex]);

  // Prizes tailored to cuisine
  const isItalian =
    restaurant?.slug === 'casa-bella' || restaurant?.cuisine?.toLowerCase().includes('italian');

  const prizes: PrizeOption[] = isItalian
    ? [
        { id: 'p1', label: 'Complimentary Tiramisu Tradizionale', shortLabel: 'Tiramisu', emoji: '🍮', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#0F766E', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Garlic Herb Focaccia on the House', shortLabel: 'Focaccia', emoji: '🥖', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Artisanal Illy Espresso & Biscotti', shortLabel: 'Espresso', emoji: '☕', color: '#B45309', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: '₹100 Dining Voucher', shortLabel: '₹100 Off', emoji: '💰', color: '#047857', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Sparkling San Pellegrino Cooler', shortLabel: 'Cooler', emoji: '🍹', color: '#0369A1', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p7', label: 'Truffle Burrata Bruschetta', shortLabel: 'Bruschetta', emoji: '🥗', color: '#9333EA', textColor: '#FFFFFF', probabilityWeight: 5 },
        { id: 'p8', label: '2x Loyalty Points + Chef Surprise', shortLabel: '2x Points', emoji: '⭐', color: '#BE185D', textColor: '#FFFFFF', probabilityWeight: 5 }
      ]
    : [
        { id: 'p1', label: 'Free Alphonso Mango Lassi', shortLabel: 'Mango Lassi', emoji: '🍨', color: '#EA580C', textColor: '#FFFFFF', probabilityWeight: 25 },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#059669', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Tandoori Truffle Garlic Naan', shortLabel: 'Truffle Naan', emoji: '🫓', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Royal Rose Petal Kulfi Pop', shortLabel: 'Kulfi Pop', emoji: '🍦', color: '#BE123C', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: '₹100 Dining Voucher', shortLabel: '₹100 Off', emoji: '💰', color: '#0284C7', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Chilled Kokum Spiced Cooler', shortLabel: 'Kokum Cooler', emoji: '🍹', color: '#7C3AED', textColor: '#FFFFFF', probabilityWeight: 5 },
        { id: 'p7', label: 'Truffle Edamame Potli Samosa', shortLabel: 'Potli Samosa', emoji: '🥟', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 5 },
        { id: 'p8', label: '2x Loyalty Dining Points', shortLabel: '2x Points', emoji: '⭐', color: '#E11D48', textColor: '#FFFFFF', probabilityWeight: 5 }
      ];

  const currentAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Draw wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
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

    // Draw outer golden glowing ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1C1917';
    ctx.fill();

    const ringGradient = ctx.createLinearGradient(0, 0, width, height);
    ringGradient.addColorStop(0, '#F59E0B');
    ringGradient.addColorStop(0.5, '#FCD34D');
    ringGradient.addColorStop(1, '#B45309');
    ctx.lineWidth = 6;
    ctx.strokeStyle = ringGradient;
    ctx.stroke();

    // Draw marquee bulb dots around the edge
    const numBulbs = 24;
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

      // Radial slice gradient for depth
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, '#0C0A09');
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF40';
      ctx.stroke();

      // Text and Emoji
      ctx.save();
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);

      ctx.textAlign = 'right';
      ctx.fillStyle = p.textColor;
      ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;

      ctx.fillText(`${p.emoji} ${p.shortLabel}`, radius - 20, 4);

      ctx.restore();
    }

    // Center metallic hub
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    const hubGrad = ctx.createRadialGradient(centerX - 5, centerY - 5, 2, centerX, centerY, 30);
    hubGrad.addColorStop(0, '#FEF08A');
    hubGrad.addColorStop(0.4, '#F59E0B');
    hubGrad.addColorStop(1, '#78350F');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Center star icon
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', centerX, centerY);
    ctx.restore();
  };

  useEffect(() => {
    if (isOpen && currentStep === 'wheel' && canvasRef.current) {
      drawWheel(currentAngleRef.current);
    }
  }, [isOpen, currentStep, prizes]);

  // Confetti particles generator
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
        p.vy += 0.35; // gravity
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (frame < 130) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animateConfetti);
  };

  // Execute Wheel Spin with deceleration physics
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    setVoucherCode(null);
    setHasSpun(true);

    const totalSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    // Pick prize based on weights
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

    const duration = 4500; // 4.5 seconds of suspense
    const startTime = performance.now();
    let lastTickAngle = startAngle;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateWheel = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const currentAngle = startAngle + deltaAngle * eased;
      currentAngleRef.current = currentAngle;
      drawWheel(currentAngle);

      // Play tick sound when peg passes pointer
      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle * 0.8) {
        lastTickAngle = currentAngle;
        if (soundEnabled) {
          playTickSound();
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateWheel);
      } else {
        // Spin finished
        setIsSpinning(false);
        setWonPrize(prize);

        // Generate verified voucher
        const prefix = isItalian ? 'BELLAVITA' : 'SAFFRON-WIN';
        const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        setVoucherCode(code);

        if (soundEnabled) {
          playWinFanfare();
        }
        triggerConfetti();

        // Automatically complete challenge in restaurantStore
        const chalId = challenge?.id || (isItalian ? 'chal-cb-01' : 'chal-sh-01');
        const nameToRecord = dinerName.trim() || 'Lucky Diner';
        const phoneToRecord = dinerPhone.trim() || '+91 98000 00000';

        completeChallenge(chalId, nameToRecord, phoneToRecord);

        // Broadcast real-time system notification to system/managers
        addSystemNotification({
          restaurant_id: restaurant?.id || '',
          table_id: activeTable?.id,
          table_label: activeTable?.label || 'Table 1',
          type: 'challenge_complete',
          customer_name: nameToRecord,
          message: `🎉 ${nameToRecord} from ${activeTable?.label || 'Table 1'} spun the wheel and won: "${prize.label}"! Voucher: ${code}`
        });
      }
    };

    animFrameRef.current = requestAnimationFrame(animateWheel);
  };

  // Primary Copy Review & Open Google Maps
  const handleCopyAndOpenGoogle = () => {
    // 1. Copy AI draft to clipboard
    navigator.clipboard.writeText(aiDraft);
    setCopiedReview(true);

    const customerName = dinerName.trim() || 'Verified Diner';
    const googleUrl =
      restaurant?.google_place_url ||
      `https://search.google.com/local/writereview?placeid=${restaurant?.slug === 'casa-bella' ? 'ChIJCasaBellaTrattoriaPune' : 'ChIJSaffronHouseKoregaonParkPune'}`;

    // 2. Record review in restaurantStore
    const newReview: CustomerReview = {
      id: 'rev_' + Date.now(),
      restaurant_id: restaurant?.id || '',
      customer_name: customerName,
      customer_phone: dinerPhone.trim() || undefined,
      rating: starRating,
      selected_keywords: selectedTags,
      review_text: aiDraft,
      whatsapp_opt_in: whatsappOptIn,
      google_review_clicked: true,
      created_at: new Date().toISOString()
    };
    addReview(newReview);

    // 3. Notify management
    addSystemNotification({
      restaurant_id: restaurant?.id || '',
      table_id: activeTable?.id,
      table_label: activeTable?.label || 'Table 1',
      type: 'review_submitted',
      customer_name: customerName,
      message: `⭐ 5-Star Google Review drafted by ${customerName} at ${activeTable?.label || 'Table 1'}! Review text copied & Google Maps opened.`
    });

    setReviewCompleted(true);

    // 4. Open Google Review URL in new tab
    window.open(googleUrl, '_blank', 'noopener,noreferrer');

    // 5. Seamlessly unlock and advance to Step 2: Spin the Wheel
    setTimeout(() => {
      setCurrentStep('wheel');
    }, 1200);
  };

  // Handle Negative Rating Private Feedback
  const handleSubmitNegative = () => {
    setNegativeSubmitting(true);
    const customerName = dinerName.trim() || 'Diner at ' + (activeTable?.label || 'Table 1');

    // Save as private internal review (deflected from Google)
    const privateReview: CustomerReview = {
      id: 'rev_private_' + Date.now(),
      restaurant_id: restaurant?.id || '',
      customer_name: customerName,
      customer_phone: negativeContact.trim() || dinerPhone.trim() || undefined,
      rating: starRating,
      selected_keywords: negativeTags,
      review_text: negativeComment.trim() || 'Private feedback submitted via in-app shield.',
      whatsapp_opt_in: false,
      google_review_clicked: false,
      created_at: new Date().toISOString()
    };
    addReview(privateReview);

    // Broadcast urgent notification to manager & kitchen
    addSystemNotification({
      restaurant_id: restaurant?.id || '',
      table_id: activeTable?.id,
      table_label: activeTable?.label || 'Table 1',
      type: 'review_submitted',
      customer_name: customerName,
      message: `⚠️ Service Concern at ${activeTable?.label || 'Table 1'}: (${starRating}★) Issues: ${negativeTags.join(', ') || 'General'}. Note: "${negativeComment}"`
    });

    setTimeout(() => {
      setNegativeSubmitting(false);
      setCurrentStep('thanks_private');
    }, 700);
  };

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-ivory-200 relative flex flex-col items-center">
        {/* Confetti canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* Modal Top Header Controls */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-ivory-200">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 leading-tight">
                {currentStep === 'review'
                  ? '⭐ Google Review & Win Challenge'
                  : currentStep === 'wheel'
                  ? '🎡 Lucky Dining Wheel'
                  : 'Private Dining Feedback'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-700">
                {activeTable?.label || 'Table 1'} • {restaurant?.name || 'Saffron House'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {currentStep === 'wheel' && (
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-500 hover:text-charcoal-800 transition-colors"
                title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-400 hover:text-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Step Nav Tabs */}
        {currentStep !== 'thanks_private' && (
          <div className="w-full grid grid-cols-2 gap-2 mt-3 mb-2 bg-ivory-100 p-1 rounded-2xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCurrentStep('review')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                currentStep === 'review' || currentStep === 'negative'
                  ? 'bg-white text-charcoal-900 shadow-xs font-bold'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <span>⭐ 1. AI Review</span>
              {reviewCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('wheel')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                currentStep === 'wheel'
                  ? 'bg-white text-charcoal-900 shadow-xs font-bold'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <span>🎡 2. Lucky Wheel</span>
              {wonPrize && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 rounded-full">Won</span>}
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: GOOGLE REVIEW & AI REVIEW GENERATOR               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'review' && (
          <div className="w-full flex flex-col items-center pt-2 space-y-4">
            <div className="text-center max-w-sm">
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                100% Win Rate • Instant Unlock
              </span>
              <h4 className="font-serif font-bold text-lg text-charcoal-900 mt-1">
                How was your dining experience?
              </h4>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Rate your visit to generate an authentic 1-tap review and unlock your spin on the Lucky Dining Wheel!
              </p>
            </div>

            {/* Interactive Star Rating */}
            <div className="flex items-center space-x-2 my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setStarRating(star);
                    if (star <= 3) {
                      setCurrentStep('negative');
                    }
                  }}
                  className="p-1 text-3xl transition-transform hover:scale-125 focus:outline-none"
                  title={`${star} Star`}
                >
                  <span className={star <= starRating ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200'}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Highlights / Tag Selector */}
            <div className="w-full space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-charcoal-800">
                  Tap what you loved (AI incorporates these automatically):
                </label>
                <span className="text-[10px] text-charcoal-500 font-mono">
                  {selectedTags.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-charcoal-900 text-white shadow-xs border border-charcoal-900 font-semibold'
                          : 'bg-ivory-100 text-charcoal-700 border border-ivory-200 hover:bg-ivory-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Review Tone Selector */}
            <div className="w-full flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-charcoal-800">Review Tone:</span>
              <div className="flex space-x-1.5">
                {(['enthusiastic', 'concise', 'detailed'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReviewTone(t)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      reviewTone === t
                        ? 'bg-saffron-600 text-white shadow-xs'
                        : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200'
                    }`}
                  >
                    {t === 'enthusiastic' ? '🔥 Enthusiastic' : t === 'concise' ? '⚡ Concise' : '🍷 Foodie'}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Custom Notes */}
            <div className="w-full">
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Add personal note (e.g. celebrated birthday, loved the mocktails)..."
                className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
              />
            </div>

            {/* AI Generated Review Draft Box */}
            <div className="w-full bg-ivory-50 border border-ivory-200 rounded-2xl p-3.5 space-y-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-charcoal-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>AI Review Draft (Ready for Google Maps)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setVariationIndex((prev) => prev + 1)}
                  className="px-2 py-0.5 rounded-lg bg-white border border-ivory-200 text-charcoal-700 hover:bg-ivory-100 text-[10px] font-semibold flex items-center space-x-1 transition-all shadow-xs"
                  title="Generate a fresh variation"
                >
                  <RotateCw className="w-3 h-3 text-saffron-600" />
                  <span>Regenerate</span>
                </button>
              </div>

              <textarea
                value={aiDraft}
                onChange={(e) => setAiDraft(e.target.value)}
                rows={3}
                className="w-full bg-white border border-ivory-200 rounded-xl p-2.5 text-xs text-charcoal-800 focus:outline-none focus:border-saffron-600 resize-none leading-relaxed shadow-xs"
                placeholder="Generating authentic review draft..."
              />
            </div>

            {/* Optional Diner Contact for Voucher */}
            <div className="w-full grid grid-cols-2 gap-2 text-left">
              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Deshmukh"
                  value={dinerName}
                  onChange={(e) => setDinerName(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 98220 12345"
                  value={dinerPhone}
                  onChange={(e) => setDinerPhone(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>
            </div>

            {/* WhatsApp Opt-in */}
            <label className="w-full flex items-center space-x-2 text-[11px] text-charcoal-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4 border-ivory-300"
              />
              <span>Send me secret chef specials and table discounts on WhatsApp</span>
            </label>

            {/* Success Copy Feedback Toast */}
            {copiedReview && (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-2.5 text-xs text-green-800 font-semibold flex items-center justify-center space-x-2 animate-fadeIn">
                <Check className="w-4 h-4 text-green-600" />
                <span>Review copied! Opening Google Maps — paste &amp; hit post! Unlocking wheel...</span>
              </div>
            )}

            {/* PRIMARY 1-TAP ACTION (COPY & OPEN GOOGLE MAPS) */}
            <div className="w-full space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCopyAndOpenGoogle}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 hover:brightness-110 active:scale-95 text-white font-serif text-xs sm:text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all border border-charcoal-700"
              >
                <Copy className="w-4 h-4 text-amber-400" />
                <span>📋 Copy Review &amp; Open Google Maps ↗</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('wheel')}
                className="w-full py-2 text-charcoal-500 hover:text-charcoal-800 text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <span>Skip review, take me straight to the Wheel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1-B: NEGATIVE RATING SHIELD (1-3 STARS)              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'negative' && (
          <div className="w-full flex flex-col items-center pt-2 space-y-3.5 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl shadow-xs">
              😔
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-charcoal-900">
                We're Sorry Your Visit Wasn't 5 Stars
              </h4>
              <p className="text-xs text-charcoal-600 mt-1 max-w-sm leading-relaxed">
                We take customer satisfaction seriously. Please tell management privately what went wrong so we can make it right immediately for your table — this is 100% private and never published online.
              </p>
            </div>

            {/* Quick Issue Tags */}
            <div className="w-full space-y-1 text-left">
              <label className="text-[11px] font-bold text-charcoal-700">What went wrong?</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Slow service ⏳',
                  'Food / Temperature 🍲',
                  'Wait time ⏱️',
                  'Cleanliness 🧹',
                  'Staff attitude 😠',
                  'Billing / Price 💳',
                  'Other'
                ].map((tag) => {
                  const isSel = negativeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setNegativeTags((prev) =>
                          isSel ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        isSel
                          ? 'bg-red-500 text-white font-semibold'
                          : 'bg-ivory-100 text-charcoal-700 border border-ivory-200 hover:bg-ivory-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Private Notes Textarea */}
            <div className="w-full text-left">
              <label className="text-[11px] font-bold text-charcoal-700 mb-1 block">
                Your Private Feedback:
              </label>
              <textarea
                value={negativeComment}
                onChange={(e) => setNegativeComment(e.target.value)}
                rows={3}
                placeholder="What can we improve? This goes directly to the restaurant owner..."
                className="w-full bg-ivory-50 border border-ivory-200 rounded-xl p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-red-400"
              />
            </div>

            {/* Contact for Management Follow-up */}
            <div className="w-full text-left">
              <label className="text-[11px] font-bold text-charcoal-700 mb-1 block">
                Your Phone or Email (so owner can resolve this):
              </label>
              <input
                type="text"
                value={negativeContact}
                onChange={(e) => setNegativeContact(e.target.value)}
                placeholder="e.g. 98220 00000 or email@domain.com"
                className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="w-full space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSubmitNegative}
                disabled={negativeSubmitting}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-serif text-xs sm:text-sm font-bold shadow-subtle transition-all"
              >
                {negativeSubmitting ? 'Sending to Management...' : '📩 Submit Private Feedback to Owner'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStarRating(5);
                  setCurrentStep('review');
                }}
                className="w-full py-1.5 text-charcoal-500 hover:text-charcoal-800 text-xs font-semibold"
              >
                ← Back to 5-Star Review
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1-C: PRIVATE FEEDBACK SUBMITTED ACKNOWLEDGEMENT      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'thanks_private' && (
          <div className="w-full flex flex-col items-center pt-4 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-green-50 text-green-600 flex items-center justify-center text-3xl shadow-subtle border border-green-200">
              🙏
            </div>

            <div>
              <h4 className="font-serif text-xl font-bold text-charcoal-900">
                Thank You For Letting Us Know
              </h4>
              <p className="text-xs text-charcoal-600 mt-1 max-w-sm leading-relaxed">
                Your feedback has been sent directly to the owner &amp; manager of {restaurant?.name}. We take every detail to heart and are addressing your table right away.
              </p>
            </div>

            {/* Apology Voucher */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                Apology Hospitality Voucher
              </span>
              <p className="font-mono text-xl font-bold text-charcoal-900">
                CARE15-{activeTable?.label?.replace(/\s+/g, '').toUpperCase() || 'TABLE1'}
              </p>
              <p className="text-[11px] text-amber-800">
                Enjoy 15% off today's bill as our sincere courtesy.
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
        {/* STEP 2: LUCKY DINING WHEEL GAME                           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'wheel' && !wonPrize && (
          <div className="w-full flex flex-col items-center pt-2 space-y-3">
            <div className="text-center max-w-xs">
              {reviewCompleted && (
                <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 inline-block mb-1">
                  ✓ Review Complete • Spin Unlocked
                </span>
              )}
              <h4 className="font-serif font-bold text-lg text-charcoal-900">
                Spin to Win Your Reward!
              </h4>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Unlock complimentary treats, craft beverages, or bill discounts for your table!
              </p>
            </div>

            {/* Wheel Canvas Container */}
            <div className="relative flex items-center justify-center my-1">
              {/* Golden Pointer Needle at 12 o'clock */}
              <div className="absolute -top-3 z-20 flex flex-col items-center">
                <div
                  className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-red-600 filter drop-shadow(0 2px 4px rgba(0,0,0,0.4)) transition-transform duration-75"
                  style={{
                    transform: isSpinning ? 'rotate(4deg)' : 'none'
                  }}
                />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white -mt-1 shadow-xs" />
              </div>

              {/* Wheel Canvas */}
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="max-w-[280px] sm:max-w-[300px] aspect-square rounded-full shadow-float"
              />
            </div>

            {/* Big Action Spin Button */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-3.5 px-6 rounded-2xl font-serif text-sm font-bold tracking-wide text-white shadow-float flex items-center justify-center space-x-2 transition-all ${
                isSpinning
                  ? 'bg-charcoal-400 cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-105 active:scale-95 animate-pulse'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING THE WHEEL...' : '🎡 TAP TO SPIN & WIN'}</span>
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 2-B: CELEBRATORY WINNER SCREEN                       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'wheel' && wonPrize && (
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
                Your reward is unlocked for <strong>{activeTable?.label || 'Table 1'}</strong>!
              </p>
            </div>

            {/* Secret Voucher Box */}
            <div className="w-full bg-gradient-to-br from-amber-50 to-ivory-100 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-widest block">
                Official Redemption Voucher
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
                  {copiedCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-green-700 font-semibold">
                ✓ Server &amp; Kitchen notified of your voucher for {activeTable?.label || 'Table 1'}
              </p>
              <p className="text-[10px] text-charcoal-500">
                Present this secret code to your waiter or at checkout to apply your reward.
              </p>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle flex items-center justify-center space-x-1.5"
              >
                <span>Return to Dining Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setWonPrize(null);
                  setVoucherCode(null);
                }}
                className="w-full py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Spin Again (Demo Mode)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
