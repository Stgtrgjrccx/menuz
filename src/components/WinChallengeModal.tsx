import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Trophy,
  Star,
  Check,
  Copy,
  ExternalLink,
  RotateCw,
  Gift,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Dice5,
  Package,
  Layers,
  Award
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { Restaurant, RewardGameType } from '../types';
import { getQuickTagsForRestaurant, generateConsumerReviewDraft } from '../lib/reviewGenerator';
import { Turntable } from '@lucasmarkes/hairline/react';

interface WinChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRestaurant?: Restaurant | null;
  tableLabel?: string;
  forceGame?: RewardGameType;
}

export const WinChallengeModal: React.FC<WinChallengeModalProps> = ({
  isOpen,
  onClose,
  targetRestaurant,
  tableLabel = 'Table 1',
  forceGame
}) => {
  const defaultRestaurant = useRestaurantStore((state) => state.restaurant);
  const activeRest = targetRestaurant || defaultRestaurant;
  const config = activeRest?.review_rewards_config;
  const addReview = useRestaurantStore((state) => state.addReview);
  const addSystemNotification = useRestaurantStore((state) => state.addSystemNotification);

  // Modal Stage: 'review' -> 'game' -> 'won'
  const [stage, setStage] = useState<'review' | 'game' | 'won'>('review');

  // Review step state
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customFeedback, setCustomFeedback] = useState<string>('');
  const [hasClickedGoogle, setHasClickedGoogle] = useState<boolean>(false);
  const [copiedReview, setCopiedReview] = useState<boolean>(false);

  // Active game choice
  const initialGame: RewardGameType = forceGame || config?.active_game || 'turntable_roulette';
  const [selectedGame, setSelectedGame] = useState<RewardGameType>(initialGame);

  // Won reward state
  const [wonReward, setWonReward] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Turntable Game State
  const [isSpinningTurntable, setIsSpinningTurntable] = useState<boolean>(false);

  // Wheel Game State
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  // Scratch Card Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState<number>(0);
  const [isScratching, setIsScratching] = useState<boolean>(false);

  // Mystery Box State
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState<boolean>(false);

  // Dice Roll State
  const [diceValues, setDiceValues] = useState<[number, number]>([3, 4]);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  const tags = useMemo(() => {
    return getQuickTagsForRestaurant(activeRest?.cuisine || 'Contemporary Indian');
  }, [activeRest]);

  const reviewDraft = useMemo(() => {
    return generateConsumerReviewDraft({
      businessName: activeRest?.name || 'Restaurant',
      rating,
      selectedTags,
      cuisine: activeRest?.cuisine || 'dining'
    });
  }, [activeRest, rating, selectedTags]);

  const slices = useMemo(() => {
    return config?.games?.spin_wheel?.slices?.length
      ? config.games.spin_wheel.slices
      : [
          { id: '1', label: '15% Off Bill', reward: '15% Off Total Bill', emoji: '🎉', color: '#2D4A3E', textColor: '#000', probabilityWeight: 30 },
          { id: '2', label: 'Free Dessert', reward: 'Free Chef Dessert Treat', emoji: '🍨', color: '#EC4899', textColor: '#fff', probabilityWeight: 25 },
          { id: '3', label: '10% Off Bill', reward: '10% Bill Discount', emoji: '✨', color: '#10B981', textColor: '#fff', probabilityWeight: 25 },
          { id: '4', label: 'Free Beverage', reward: 'Free Signature Drink', emoji: '🥤', color: '#3B82F6', textColor: '#fff', probabilityWeight: 12 },
          { id: '5', label: '₹100 Bill Credit', reward: 'Flat ₹100 Off Bill', emoji: '💰', color: '#8B5CF6', textColor: '#fff', probabilityWeight: 8 }
        ];
  }, [config]);

  // Reset modal when reopened
  useEffect(() => {
    if (isOpen) {
      setStage('review');
      setRating(5);
      setSelectedTags(tags.slice(0, 2));
      setWonReward('');
      setVoucherCode('');
      setHasClickedGoogle(false);
      setCopiedCode(false);
      setCopiedReview(false);
      setScratchedPercent(0);
      setSelectedBox(null);
      setSelectedGame(forceGame || config?.active_game || 'spin_wheel');
    }
  }, [isOpen, forceGame, config?.active_game, tags]);

  // Canvas Scratch Card initial draw
  useEffect(() => {
    if (stage === 'game' && selectedGame === 'scratch_card' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#64748B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Silver glitter pattern
      ctx.fillStyle = '#94A3B8';
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ SCRATCH HERE WITH FINGER ✨', canvas.width / 2, canvas.height / 2 + 6);
    }
  }, [stage, selectedGame]);

  if (!isOpen) return null;

  const handleCopyReview = () => {
    navigator.clipboard.writeText(reviewDraft);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 3000);
  };

  const handleOpenGoogle = () => {
    const url = config?.google_place_url || activeRest?.google_place_url || 'https://www.google.com/maps';
    window.open(url, '_blank');
    setHasClickedGoogle(true);
  };

  const generateVoucher = (rewardText: string) => {
    const prefix = config?.promo_code_prefix || `WIN-${activeRest?.slug?.toUpperCase() || 'MENU'}-`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = `${prefix.endsWith('-') ? prefix : prefix + '-'}${rand}`;
    setWonReward(rewardText);
    setVoucherCode(code);
    setStage('won');

    // Record review & notification in restaurant store
    addReview({
      id: `rev-${Date.now()}`,
      restaurant_id: activeRest?.id || 'rest-01',
      customer_name: customerName || 'Verified Diner',
      rating,
      selected_keywords: selectedTags,
      review_text: reviewDraft,
      whatsapp_opt_in: false,
      google_review_clicked: hasClickedGoogle,
      created_at: new Date().toISOString()
    });

    addSystemNotification({
      restaurant_id: activeRest?.id || 'rest-01',
      type: 'challenge_complete',
      message: `🎉 ${customerName || 'Diner'} unlocked Win Challenge reward: "${rewardText}" (Code: ${code})`
    });
  };

  const TURNTABLE_REWARDS = [
    { id: '1', name: 'Free Chef Dessert Treat', subtitle: 'Artisanal Panna Cotta or Tiramisu', emoji: '🍨' },
    { id: '2', name: 'Signature Table Mocktail', subtitle: 'Crafted seasonal fruit cooler', emoji: '🍹' },
    { id: '3', name: 'Free Chef Appetizer', subtitle: 'Artisanal starter plate on the house', emoji: '🍟' },
    { id: '4', name: '20% Total Bill Discount', subtitle: 'Instant table bill deduction', emoji: '🏷️' }
  ];

  const handleSpinTurntable = () => {
    if (isSpinningTurntable) return;
    setIsSpinningTurntable(true);
    setTimeout(() => {
      const chosen = TURNTABLE_REWARDS[Math.floor(Math.random() * TURNTABLE_REWARDS.length)];
      generateVoucher(chosen.name);
      setIsSpinningTurntable(false);
    }, 2400);
  };

  // 1. Spin Wheel Logic
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const sliceCount = slices.length;
    const winningIndex = Math.floor(Math.random() * sliceCount);
    const arc = 360 / sliceCount;
    // Rotate 5 full turns + slice center
    const totalRotation = wheelRotation + 1800 + (360 - winningIndex * arc - arc / 2);
    setWheelRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonSlice = slices[winningIndex];
      generateVoucher(wonSlice.reward || wonSlice.label);
    }, 4000);
  };

  // 2. Scratch Card Logic
  const handleScratchMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const newPercent = Math.min(scratchedPercent + 4, 100);
    setScratchedPercent(newPercent);

    if (newPercent >= 45 && stage === 'game') {
      const prize = config?.games?.scratch_card?.hidden_prize || config?.free_item_name || '15% Off Your Entire Bill Today!';
      setTimeout(() => generateVoucher(prize), 800);
    }
  };

  // 3. Mystery Box Logic
  const handlePickBox = (boxId: number) => {
    if (isOpeningBox || selectedBox !== null) return;
    setSelectedBox(boxId);
    setIsOpeningBox(true);
    setTimeout(() => {
      setIsOpeningBox(false);
      const boxes = config?.games?.mystery_box?.boxes;
      const match = boxes?.find((b) => b.id === boxId);
      const prize = match?.prize || '15% Off Total Bill';
      generateVoucher(prize);
    }, 1500);
  };

  // 4. Lucky Dice Logic
  const handleRollDice = () => {
    if (isRollingDice) return;
    setIsRollingDice(true);
    let intervalCount = 0;
    const interval = setInterval(() => {
      setDiceValues([Math.floor(1 + Math.random() * 6), Math.floor(1 + Math.random() * 6)]);
      intervalCount++;
      if (intervalCount >= 10) {
        clearInterval(interval);
        const finalDice: [number, number] = [Math.floor(1 + Math.random() * 6), Math.floor(1 + Math.random() * 6)];
        setDiceValues(finalDice);
        setIsRollingDice(false);
        const sum = finalDice[0] + finalDice[1];
        const isDouble = finalDice[0] === finalDice[1];
        const prize = (sum >= 7 || isDouble)
          ? config?.games?.lucky_dice?.grand_prize || '20% VIP Dining Discount'
          : config?.games?.lucky_dice?.runner_up_prize || 'Free Signature Beverage';
        setTimeout(() => generateVoucher(prize), 1000);
      }
    }, 100);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#F5F1E8] border border-[#F4511E]/30 rounded-3xl max-w-lg w-full text-[#141414] shadow-2xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F4511E]/15 via-[#F4511E]/10 to-transparent border-b border-black/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F4511E] to-[#F4511E] text-[#FFFFFF] font-black flex items-center justify-center text-lg shadow-md">
              🎁
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-black text-base sm:text-lg text-[#141414]">
                  Win Challenge
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4511E]/20 text-[#2D4A3E] border border-[#F4511E]/30">
                  {activeRest?.name || 'Menuz'}
                </span>
              </div>
              <p className="text-[11px] text-[#6E6E6E]">
                Review &amp; Unlock Instant Dining Treats
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#6E6E6E] hover:text-[#141414] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="px-5 py-2.5 bg-black/[0.04] border-b border-black/[0.06] flex items-center justify-between text-[11px] font-bold">
          <div className={`flex items-center space-x-1.5 ${stage === 'review' ? 'text-[#2D4A3E]' : 'text-[#2F7A4F]'}`}>
            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">1</span>
            <span>Google Review</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center space-x-1.5 ${stage === 'game' ? 'text-[#2D4A3E]' : stage === 'won' ? 'text-[#2F7A4F]' : 'text-[#7A7A7A]'}`}>
            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">2</span>
            <span>Play Game</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center space-x-1.5 ${stage === 'won' ? 'text-[#2F7A4F]' : 'text-[#7A7A7A]'}`}>
            <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">3</span>
            <span>Claim Treat</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 1: REVIEW & GOOGLE MAPS SHORTCUT                       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {stage === 'review' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider">
                  Step 1 • How was your dining experience?
                </span>
                <div className="flex justify-center items-center space-x-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          s <= rating ? 'fill-[#2D4A3E] text-[#2D4A3E]' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag selector */}
              <div>
                <label className="text-[11px] font-bold text-[#6E6E6E] block mb-1.5 uppercase">
                  What did you love most? (Tap tags)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag));
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4511E]/20 border-[#F4511E] text-[#2D4A3E] font-bold'
                            : 'bg-black/[0.04] border-black/[0.08] text-[#4A4A4A] hover:border-black/20'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Generated Review Preview Box */}
              <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-black/[0.08] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#6E6E6E]">
                  <span className="flex items-center space-x-1 font-bold text-[#2D4A3E]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>1-Tap AI Draft Ready to Post</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReview}
                    className="text-xs text-[#2D4A3E] hover:text-[#141414] flex items-center space-x-1 cursor-pointer font-bold"
                  >
                    {copiedReview ? <Check className="w-3 h-3 text-[#2F7A4F]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedReview ? 'Copied!' : 'Copy Draft'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#3A3A3A] leading-relaxed italic bg-black/[0.04] p-2 rounded-xl border border-black/[0.04]">
                  "{reviewDraft}"
                </p>
              </div>

              {/* Action Buttons: Post on Google + Unlock Challenge */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleOpenGoogle}
                  className="w-full py-3 px-4 rounded-xl bg-white text-[#141414] hover:bg-slate-100 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png"
                    alt="Google"
                    className="w-4 h-4 object-contain"
                  />
                  <span>Post Review on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7A7A7A]" />
                </button>

                <button
                  type="button"
                  onClick={() => setStage('game')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 font-black text-xs sm:text-sm text-[#FFFFFF] flex items-center justify-center space-x-2 shadow-xl shadow-amber-950/40 transition-transform active:scale-95 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#141414]" />
                  <span>I'm Ready • Play Win Challenge Games! →</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 2: INTERACTIVE CHALLENGE GAME                          */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {stage === 'game' && (
            <div className="space-y-4">
              
              {/* Game Selector Tab Pills (if allowed) */}
              {(config?.allow_player_choice !== false) && (
                <div className="grid grid-cols-5 gap-1 p-1 bg-black/[0.04] rounded-xl border border-black/[0.08] text-[10px] font-bold text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedGame('turntable_roulette')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedGame === 'turntable_roulette' ? 'bg-[#F4511E] text-[#FFFFFF] font-black' : 'text-[#6E6E6E] hover:text-[#141414]'
                    }`}
                  >
                    🎯 Turntable
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGame('spin_wheel')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedGame === 'spin_wheel' ? 'bg-[#F4511E] text-[#FFFFFF] font-black' : 'text-[#6E6E6E] hover:text-[#141414]'
                    }`}
                  >
                    🎡 Wheel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGame('scratch_card')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedGame === 'scratch_card' ? 'bg-[#F4511E] text-[#FFFFFF] font-black' : 'text-[#6E6E6E] hover:text-[#141414]'
                    }`}
                  >
                    🎟️ Scratch
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGame('mystery_box')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedGame === 'mystery_box' ? 'bg-[#F4511E] text-[#FFFFFF] font-black' : 'text-[#6E6E6E] hover:text-[#141414]'
                    }`}
                  >
                    📦 Mystery
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGame('lucky_dice')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedGame === 'lucky_dice' ? 'bg-[#F4511E] text-[#FFFFFF] font-black' : 'text-[#6E6E6E] hover:text-[#141414]'
                    }`}
                  >
                    🎲 Dice
                  </button>
                </div>
              )}

              {/* GAME 0: ISOMETRIC TURNTABLE ROULETTE */}
              {selectedGame === 'turntable_roulette' && (
                <div className="flex flex-col items-center justify-center space-y-4 py-2 font-mono">
                  <div className="text-center space-y-1">
                    <div className="text-xs text-[#2D4A3E] font-bold uppercase tracking-wider">
                      [ISOMETRIC 3D ROULETTE PLINTH]
                    </div>
                    <p className="text-[11px] text-[#6E6E6E] font-sans">
                      Flick with your finger or cursor to spin the turntable plinth. It settles on one of 4 tableside treats.
                    </p>
                  </div>

                  {/* The Live Turntable Figure */}
                  <div className="w-full max-w-[240px] py-1 relative">
                    <Turntable
                      intensity={0.8}
                      theme="dark"
                      label="Tableside reward roulette turntable"
                      className="w-full filter drop-shadow-[0_10px_25px_rgba(245,158,11,0.2)]"
                    />
                  </div>

                  {/* 4 Quarter Cards */}
                  <div className="grid grid-cols-2 gap-2 w-full text-left">
                    {TURNTABLE_REWARDS.map((rew) => (
                      <div key={rew.id} className="p-2.5 rounded-xl bg-black/[0.04] border border-black/[0.08] flex items-center space-x-2">
                        <span className="text-xl shrink-0">{rew.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-[#141414] truncate">{rew.name}</div>
                          <div className="text-[10px] text-[#6E6E6E] truncate font-sans">{rew.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isSpinningTurntable}
                    onClick={handleSpinTurntable}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 disabled:opacity-50 text-[#FFFFFF] font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                  >
                    <RotateCw className={`w-4 h-4 ${isSpinningTurntable ? 'animate-spin' : ''}`} />
                    <span>{isSpinningTurntable ? 'TURNTABLE IN MOTION...' : 'FLICK & CLAIM REWARD'}</span>
                  </button>
                </div>
              )}

              {/* GAME 1: SPIN THE WHEEL */}
              {selectedGame === 'spin_wheel' && (
                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                    {/* Arrow Pointer */}
                    <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />

                    {/* Wheel Canvas / SVG */}
                    <div
                      style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
                      }}
                      className="w-full h-full rounded-full border-4 border-[#F4511E]/80 shadow-2xl relative overflow-hidden bg-[#F5F1E8]"
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {slices.map((slice, i) => {
                          const angle = 360 / slices.length;
                          const startAngle = i * angle;
                          const endAngle = (i + 1) * angle;
                          const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                          const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                          const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                          const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                          const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                          return (
                            <path
                              key={slice.id}
                              d={pathData}
                              fill={slice.color}
                              stroke="#FFFFFF"
                              strokeWidth="0.8"
                            />
                          );
                        })}
                      </svg>
                      {/* Center Hub */}
                      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#F5F1E8] border-2 border-[#F4511E] shadow-xl flex items-center justify-center font-black text-[#2D4A3E] text-xs">
                        WIN
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={handleSpinWheel}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 disabled:opacity-50 text-[#FFFFFF] font-black text-sm flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                  >
                    <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'Spinning Wheel...' : 'Spin The Wheel Now!'}</span>
                  </button>
                </div>
              )}

              {/* GAME 2: SCRATCH CARD */}
              {selectedGame === 'scratch_card' && (
                <div className="space-y-3 text-center">
                  <p className="text-xs text-[#4A4A4A]">
                    Use your finger or mouse to scratch the silver card and reveal your prize!
                  </p>
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-black/20 shadow-2xl bg-gradient-to-br from-[#F4511E]/60 to-[#2D4A3E]/80 flex items-center justify-center">
                    {/* Underlying Prize */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-1">
                      <span className="text-3xl">🎉</span>
                      <h4 className="font-serif font-black text-lg text-[#2D4A3E]">
                        {config?.games?.scratch_card?.hidden_prize || '15% Off Your Entire Bill!'}
                      </h4>
                      <p className="text-[10px] text-[#4A4A4A]">Dine-in voucher ready to claim</p>
                    </div>

                    {/* Scratch Canvas Surface */}
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={180}
                      onMouseDown={() => setIsScratching(true)}
                      onMouseUp={() => setIsScratching(false)}
                      onMouseLeave={() => setIsScratching(false)}
                      onMouseMove={handleScratchMove}
                      onTouchStart={() => setIsScratching(true)}
                      onTouchEnd={() => setIsScratching(false)}
                      onTouchMove={handleScratchMove}
                      className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    />
                  </div>
                </div>
              )}

              {/* GAME 3: MYSTERY DINING BOX */}
              {selectedGame === 'mystery_box' && (
                <div className="space-y-3 text-center py-2">
                  <p className="text-xs text-[#4A4A4A]">
                    Tap any of the 3 chef treasure boxes to reveal your prize!
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((boxId) => (
                      <button
                        key={boxId}
                        type="button"
                        disabled={isOpeningBox}
                        onClick={() => handlePickBox(boxId)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group ${
                          selectedBox === boxId
                            ? 'bg-[#F4511E]/20 border-[#F4511E] scale-105 shadow-xl'
                            : 'bg-black/[0.04] border-black/[0.1] hover:border-[#F4511E]/50 hover:bg-black/[0.04]'
                        }`}
                      >
                        <span className={`text-3xl sm:text-4xl transition-transform ${isOpeningBox && selectedBox === boxId ? 'animate-bounce' : 'group-hover:scale-110'}`}>
                          {selectedBox === boxId ? '🎁' : '📦'}
                        </span>
                        <span className="text-xs font-bold text-[#141414]">
                          Box #{boxId}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 4: LUCKY DICE ROLL */}
              {selectedGame === 'lucky_dice' && (
                <div className="space-y-4 text-center py-2">
                  <p className="text-xs text-[#4A4A4A]">
                    Roll the golden dice! Score 7 or doubles to win the Grand VIP Discount!
                  </p>
                  <div className="flex items-center justify-center space-x-6 py-4">
                    {diceValues.map((val, idx) => (
                      <div
                        key={idx}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#F4511E] to-amber-200 text-[#FFFFFF] font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl border-2 border-black/40 ${
                          isRollingDice ? 'animate-spin' : ''
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={isRollingDice}
                    onClick={handleRollDice}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 text-[#FFFFFF] font-black text-sm flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                  >
                    <Dice5 className="w-5 h-5 text-[#141414]" />
                    <span>{isRollingDice ? 'Rolling Dice...' : 'Roll Dice Now!'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* STEP 3: REWARD CLAIM & VOUCHER DISPLAY                      */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {stage === 'won' && (
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#FFFFFF] flex items-center justify-center text-3xl mx-auto shadow-xl">
                🏆
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#2F7A4F] uppercase tracking-wider">
                  Congratulations! Reward Unlocked
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#141414]">
                  {wonReward}
                </h3>
                <p className="text-xs text-[#4A4A4A]">
                  Valid for your dining session at {activeRest?.name || 'Restaurant'}.
                </p>
              </div>

              {/* Unique Voucher Code Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F5F1E8] to-[#FFFFFF] border border-[#F4511E]/40 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#6E6E6E] block tracking-wider">
                  Your Table Voucher Code
                </span>
                <div className="flex items-center justify-center space-x-3">
                  <span className="font-mono font-black text-lg sm:text-xl text-[#2D4A3E] tracking-wider">
                    {voucherCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(voucherCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 3000);
                    }}
                    className="p-2 rounded-lg bg-black/[0.04] hover:bg-black/[0.04] text-[#3A3A3A] hover:text-[#141414] transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-[#2F7A4F]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#6E6E6E]">
                  Show this code to your waiter or manager when settling the bill to redeem your reward!
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#141414] font-bold text-xs sm:text-sm border border-black/[0.12] transition-colors cursor-pointer"
              >
                Close &amp; Enjoy Your Meal
              </button>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};

export default WinChallengeModal;
