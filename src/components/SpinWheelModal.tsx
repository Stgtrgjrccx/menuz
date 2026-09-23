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
  ArrowRight
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { RestaurantTable, ReviewChallenge } from '../types';

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
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
  challenge
}) => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const completeChallenge = useRestaurantStore((state) => state.completeChallenge);
  const addSystemNotification = useRestaurantStore((state) => state.addSystemNotification);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [dinerName, setDinerName] = useState('');
  const [dinerPhone, setDinerPhone] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wonPrize, setWonPrize] = useState<PrizeOption | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // Prizes tailored to cuisine
  const isItalian = restaurant?.slug === 'casa-bella' || restaurant?.cuisine?.toLowerCase().includes('italian');

  const prizes: PrizeOption[] = isItalian
    ? [
        { id: 'p1', label: 'Complimentary Tiramisu Tradizionale', shortLabel: 'Tiramisu', emoji: '🍮', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#0F766E', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Garlic Herb Focaccia on the House', shortLabel: 'Focaccia', emoji: '🥖', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Artisanal Illy Espresso & Biscotti', shortLabel: 'Espresso', emoji: '☕', color: '#B45309', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: '₹100 Dining Voucher', shortLabel: '₹100 Off', emoji: '💰', color: '#047857', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Sparkling San Pellegrino Cooler', shortLabel: 'Cooler', emoji: '🍹', color: '#0369A1', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p7', label: 'Truffle Burrata Bruschetta', shortLabel: 'Bruschetta', emoji: '🥗', color: '#9333EA', textColor: '#FFFFFF', probabilityWeight: 5 },
        { id: 'p8', label: '2x Loyalty Points + Chef Surprise', shortLabel: '2x Points', emoji: '⭐', color: '#BE185D', textColor: '#FFFFFF', probabilityWeight: 5 },
      ]
    : [
        { id: 'p1', label: 'Free Alphonso Mango Lassi', shortLabel: 'Mango Lassi', emoji: '🍨', color: '#EA580C', textColor: '#FFFFFF', probabilityWeight: 25 },
        { id: 'p2', label: '15% Off Your Entire Bill', shortLabel: '15% Off', emoji: '🏷️', color: '#059669', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p3', label: 'Tandoori Truffle Garlic Naan', shortLabel: 'Truffle Naan', emoji: '🫓', color: '#D97706', textColor: '#FFFFFF', probabilityWeight: 20 },
        { id: 'p4', label: 'Royal Rose Petal Kulfi Pop', shortLabel: 'Kulfi Pop', emoji: '🍦', color: '#BE123C', textColor: '#FFFFFF', probabilityWeight: 10 },
        { id: 'p5', label: '₹100 Dining Voucher', shortLabel: '₹100 Off', emoji: '💰', color: '#0284C7', textColor: '#FFFFFF', probabilityWeight: 15 },
        { id: 'p6', label: 'Chilled Kokum Spiced Cooler', shortLabel: 'Kokum Cooler', emoji: '🍹', color: '#7C3AED', textColor: '#FFFFFF', probabilityWeight: 5 },
        { id: 'p7', label: 'Truffle Edamame Potli Samosa', shortLabel: 'Potli Samosa', emoji: '🥟', color: '#C2410C', textColor: '#FFFFFF', probabilityWeight: 5 },
        { id: 'p8', label: '2x Loyalty Dining Points', shortLabel: '2x Points', emoji: '⭐', color: '#E11D48', textColor: '#FFFFFF', probabilityWeight: 5 },
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
      ctx.fillStyle = (i % 2 === 0) ? '#FFFFFF' : '#FBBF24';
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

    // Center star / icon
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', centerX, centerY);
    ctx.restore();
  };

  // Redraw when modal opens or prize theme changes
  useEffect(() => {
    if (isOpen) {
      // Small timeout for canvas mount
      const t = setTimeout(() => {
        drawWheel(currentAngleRef.current);
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, isItalian]);

  // Confetti particles loop
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      rot: number;
      vrot: number;
    }> = [];

    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#EF4444', '#8B5CF6'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 2,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.rot += p.vrot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      frame++;
      if (frame < 120) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(animateConfetti);
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);
    setVoucherCode(null);

    // Pick random prize based on probability weight
    const totalWeight = prizes.reduce((acc, p) => acc + p.probabilityWeight, 0);
    let rand = Math.random() * totalWeight;
    let targetIndex = 0;
    for (let i = 0; i < prizes.length; i++) {
      if (rand < prizes[i].probabilityWeight) {
        targetIndex = i;
        break;
      }
      rand -= prizes[i].probabilityWeight;
    }

    const prize = prizes[targetIndex];
    const totalSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;

    // Pointer is at TOP (3 * PI / 2, i.e. 270 deg)
    // Slice i occupies angle [i * sliceAngle, (i + 1) * sliceAngle]
    // To have slice i under the needle: (angle + i * sliceAngle + sliceAngle / 2) mod 2PI == 3*PI/2
    const centerSliceAngle = targetIndex * sliceAngle + sliceAngle / 2;
    const desiredFinalAngle = (3 * Math.PI) / 2 - centerSliceAngle;

    // Number of full spins
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const startAngle = currentAngleRef.current % (2 * Math.PI);
    const targetAngle = startAngle + fullSpins * 2 * Math.PI + (desiredFinalAngle - startAngle);

    const spinDuration = 4500; // ms
    const startTime = performance.now();
    let lastTickAngle = startAngle;

    const animateWheel = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Ease out cubic physics: 1 - Math.pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startAngle + (targetAngle - startAngle) * easeOut;
      currentAngleRef.current = current;

      drawWheel(current);

      // Play tick sound when passing slices
      if (soundEnabled && Math.abs(current - lastTickAngle) >= sliceAngle * 0.7) {
        playTickSound();
        lastTickAngle = current;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateWheel);
      } else {
        // Spin finished!
        setIsSpinning(false);
        setHasSpun(true);
        setWonPrize(prize);

        // Generate voucher code
        const prefix = challenge?.redemption_code_prefix || (isItalian ? 'BELLA-WIN-' : 'SAFFRON-WIN-');
        const code = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
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

  const copyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-ivory-200 relative overflow-hidden flex flex-col items-center">
        {/* Confetti canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* Modal Top Controls */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-ivory-200">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 leading-tight">
                Lucky Dining Wheel
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-700">
                {activeTable?.label || 'Table 1'} • Win Instant Rewards
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-500 hover:text-charcoal-800 transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-400 hover:text-charcoal-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {!wonPrize ? (
          <div className="w-full flex flex-col items-center pt-3 space-y-3">
            <p className="text-xs text-charcoal-600 text-center max-w-xs">
              Spin to unlock complimentary treats, craft beverages, or bill discounts for your table!
            </p>

            {/* Wheel Canvas Container */}
            <div className="relative flex items-center justify-center my-2">
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

            {/* Optional Diner Contact */}
            {!hasSpun && (
              <div className="w-full grid grid-cols-2 gap-2 text-left pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={dinerName}
                    onChange={(e) => setDinerName(e.target.value)}
                    disabled={isSpinning}
                    className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9822011234"
                    value={dinerPhone}
                    onChange={(e) => setDinerPhone(e.target.value)}
                    disabled={isSpinning}
                    className="w-full bg-ivory-50 border border-ivory-200 rounded-xl px-2.5 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
              </div>
            )}

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
        ) : (
          /* Celebratory Winner Screen */
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
                ✓ Server & Kitchen notified of your voucher for {activeTable?.label || 'Table 1'}
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
