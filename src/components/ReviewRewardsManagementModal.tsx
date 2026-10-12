import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Star,
  Gift,
  Settings,
  Sparkles,
  Trophy,
  Save,
  RotateCw,
  Layers,
  Percent,
  CheckCircle2,
  ExternalLink,
  Dice5,
  Eye,
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { Restaurant, ReviewRewardsPortalConfig, RewardGameType, GameSliceConfig } from '../types';
import { WinChallengeModal } from './WinChallengeModal';

interface ReviewRewardsManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
}

export const ReviewRewardsManagementModal: React.FC<ReviewRewardsManagementModalProps> = ({
  isOpen,
  onClose,
  restaurant
}) => {
  const updateReviewRewardsConfig = useRestaurantStore((state) => state.updateReviewRewardsConfig);
  const reviews = useRestaurantStore((state) => state.reviews);
  const restaurantReviews = reviews.filter((r) => r.restaurant_id === restaurant.id);

  // Active Tab: 'rewards_config' | 'game_customizer' | 'live_reviews'
  const [activeTab, setActiveTab] = useState<'rewards_config' | 'game_customizer' | 'live_reviews'>('rewards_config');

  // Form State initialized from restaurant.review_rewards_config
  const existingConfig = restaurant.review_rewards_config;

  const [enabled, setEnabled] = useState<boolean>(existingConfig?.enabled ?? true);
  const [googlePlaceUrl, setGooglePlaceUrl] = useState<string>(
    existingConfig?.google_place_url || restaurant.google_place_url || ''
  );
  const [minRating, setMinRating] = useState<number>(existingConfig?.min_rating_for_google ?? 4);
  const [privateEscalation, setPrivateEscalation] = useState<boolean>(
    existingConfig?.private_escalation_enabled ?? true
  );

  // Reward settings
  const [rewardType, setRewardType] = useState<ReviewRewardsPortalConfig['reward_type']>(
    existingConfig?.reward_type || 'percent_discount'
  );
  const [discountPercent, setDiscountPercent] = useState<number>(existingConfig?.discount_percentage ?? 15);
  const [flatAmount, setFlatAmount] = useState<number>(existingConfig?.flat_discount_amount ?? 100);
  const [freeItemName, setFreeItemName] = useState<string>(
    existingConfig?.free_item_name || 'Chef Saffron Kulfi & Rabri'
  );
  const [minBill, setMinBill] = useState<number>(existingConfig?.minimum_bill_amount ?? 500);
  const [validityHours, setValidityHours] = useState<number>(existingConfig?.validity_hours ?? 24);
  const [promoPrefix, setPromoPrefix] = useState<string>(
    existingConfig?.promo_code_prefix || `WIN-${restaurant.slug?.toUpperCase() || 'SAFFRON'}-`
  );

  // Game Settings
  const [activeGame, setActiveGame] = useState<RewardGameType>(existingConfig?.active_game || 'spin_wheel');
  const [allowPlayerChoice, setAllowPlayerChoice] = useState<boolean>(
    existingConfig?.allow_player_choice ?? true
  );

  // Games Config
  const [slices, setSlices] = useState<GameSliceConfig[]>(
    existingConfig?.games?.spin_wheel?.slices || [
      { id: '1', label: '15% Off Bill', reward: '15% Off Total Bill', emoji: '🎉', color: '#F59E0B', probabilityWeight: 30 },
      { id: '2', label: 'Free Dessert', reward: 'Free Chef Dessert Treat', emoji: '🍨', color: '#EC4899', probabilityWeight: 25 },
      { id: '3', label: '10% Off Bill', reward: '10% Bill Discount', emoji: '✨', color: '#10B981', probabilityWeight: 25 },
      { id: '4', label: 'Free Beverage', reward: 'Free Signature Drink', emoji: '🥤', color: '#3B82F6', probabilityWeight: 12 },
      { id: '5', label: '₹100 Off Bill', reward: 'Flat ₹100 Off Bill', emoji: '💰', color: '#8B5CF6', probabilityWeight: 8 }
    ]
  );

  const [scratchTitle, setScratchTitle] = useState<string>(
    existingConfig?.games?.scratch_card?.card_title || 'Lucky Diner Scratch & Win'
  );
  const [scratchPrize, setScratchPrize] = useState<string>(
    existingConfig?.games?.scratch_card?.hidden_prize || '15% Off Your Entire Bill Today!'
  );

  const [mysteryBoxes, setMysteryBoxes] = useState(
    existingConfig?.games?.mystery_box?.boxes || [
      { id: 1, title: 'Golden Spice Vault', prize: '15% Off Total Bill', emoji: '🏺' },
      { id: 2, title: 'Royal Chef Treasure', prize: 'Free Dessert Treat', emoji: '🎁' },
      { id: 3, title: 'Emerald Diner Cask', prize: 'Flat ₹150 Bill Discount', emoji: '💎' }
    ]
  );

  const [diceGrandPrize, setDiceGrandPrize] = useState<string>(
    existingConfig?.games?.lucky_dice?.grand_prize || '20% VIP Dining Discount'
  );
  const [diceRunnerPrize, setDiceRunnerPrize] = useState<string>(
    existingConfig?.games?.lucky_dice?.runner_up_prize || 'Free Signature Beverage'
  );

  // Live test preview simulator state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewGame, setPreviewGame] = useState<RewardGameType>('spin_wheel');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (restaurant.review_rewards_config) {
      const cfg = restaurant.review_rewards_config;
      setEnabled(cfg.enabled ?? true);
      setGooglePlaceUrl(cfg.google_place_url || restaurant.google_place_url || '');
      setMinRating(cfg.min_rating_for_google ?? 4);
      setRewardType(cfg.reward_type || 'percent_discount');
      setDiscountPercent(cfg.discount_percentage ?? 15);
      setFlatAmount(cfg.flat_discount_amount ?? 100);
      setFreeItemName(cfg.free_item_name || 'Chef Treat');
      setMinBill(cfg.minimum_bill_amount ?? 500);
      setValidityHours(cfg.validity_hours ?? 24);
      setPromoPrefix(cfg.promo_code_prefix || `WIN-${restaurant.slug?.toUpperCase()}-`);
      setActiveGame(cfg.active_game || 'spin_wheel');
      setAllowPlayerChoice(cfg.allow_player_choice ?? true);
      if (cfg.games?.spin_wheel?.slices?.length) setSlices(cfg.games.spin_wheel.slices);
      if (cfg.games?.scratch_card) {
        setScratchTitle(cfg.games.scratch_card.card_title || 'Lucky Diner Scratch & Win');
        setScratchPrize(cfg.games.scratch_card.hidden_prize || '15% Off Total Bill');
      }
      if (cfg.games?.mystery_box?.boxes?.length) setMysteryBoxes(cfg.games.mystery_box.boxes);
      if (cfg.games?.lucky_dice) {
        setDiceGrandPrize(cfg.games.lucky_dice.grand_prize || '20% VIP Dining Discount');
        setDiceRunnerPrize(cfg.games.lucky_dice.runner_up_prize || 'Free Signature Beverage');
      }
    }
  }, [restaurant]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: ReviewRewardsPortalConfig = {
      enabled,
      google_place_url: googlePlaceUrl,
      min_rating_for_google: minRating,
      private_escalation_enabled: privateEscalation,
      reward_type: rewardType,
      discount_percentage: discountPercent,
      flat_discount_amount: flatAmount,
      free_item_name: freeItemName,
      minimum_bill_amount: minBill,
      validity_hours: validityHours,
      promo_code_prefix: promoPrefix,
      active_game: activeGame,
      allow_player_choice: allowPlayerChoice,
      games: {
        spin_wheel: {
          enabled: true,
          slices
        },
        scratch_card: {
          enabled: true,
          card_title: scratchTitle,
          hidden_prize: scratchPrize,
          scratch_percent_required: 40
        },
        mystery_box: {
          enabled: true,
          boxes: mysteryBoxes
        },
        lucky_dice: {
          enabled: true,
          target_sum: 7,
          grand_prize: diceGrandPrize,
          runner_up_prize: diceRunnerPrize
        }
      }
    };

    updateReviewRewardsConfig(restaurant.id, updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestSimulator = (gameType: RewardGameType) => {
    setPreviewGame(gameType);
    setIsPreviewOpen(true);
  };

  const handleAddSlice = () => {
    const newSlice: GameSliceConfig = {
      id: `slice-${Date.now()}`,
      label: 'Special Treat',
      reward: 'Special Chef Surprise',
      emoji: '🎁',
      color: '#0D9488',
      probabilityWeight: 15
    };
    setSlices([...slices, newSlice]);
  };

  const handleRemoveSlice = (id: string) => {
    if (slices.length <= 2) return;
    setSlices(slices.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain animate-in fade-in duration-150">
      <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-6 border border-amber-500/30 text-white my-2 sm:my-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">⭐</span>
                <h3 className="font-serif font-black text-base sm:text-xl text-white truncate">
                  Google Reviews &amp; Win Challenge Portal
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                Configure rewards, discounts, and custom interactive games for {restaurant.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Portal Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.08] text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setActiveTab('rewards_config')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'rewards_config'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span className="truncate">Discounts &amp; Rewards</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('game_customizer')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'game_customizer'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="truncate">Game Customizer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('live_reviews')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'live_reviews'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span className="truncate">Live Reviews ({restaurantReviews.length})</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 1: DISCOUNTS & REWARDS CONFIGURATION                     */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'rewards_config' && (
          <div className="space-y-5">
            {/* Master Toggle Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Win Challenge Rewards Engine</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Allow diners who leave 5-star Google reviews to unlock instant table discounts &amp; treats.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
              </label>
            </div>

            {/* Google Integration Settings */}
            <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Google Maps Business Link &amp; Shield</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-medium">Google Place / Maps Review URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={googlePlaceUrl}
                      onChange={(e) => setGooglePlaceUrl(e.target.value)}
                      placeholder="https://search.google.com/local/writereview?placeid=..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400"
                    />
                    {googlePlaceUrl && (
                      <a
                        href={googlePlaceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-amber-300 font-bold flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test Link</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Minimum Rating for Public Google Posting</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value={4} className="bg-slate-900">4 Stars &amp; Above (Recommended)</option>
                    <option value={5} className="bg-slate-900">5 Stars Strictly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Private Manager Escalation (&lt;4 Stars)</label>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="escalation-toggle"
                      checked={privateEscalation}
                      onChange={(e) => setPrivateEscalation(e.target.checked)}
                      className="rounded bg-slate-800 border-white/20 text-amber-500 cursor-pointer"
                    />
                    <label htmlFor="escalation-toggle" className="text-slate-300 cursor-pointer">
                      Route lower ratings privately to manager KDS
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Reward & Discount Type Selector */}
            <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Percent className="w-4 h-4 text-amber-400" />
                <span>Custom Reward &amp; Discount Rules</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'percent_discount', label: '% Bill Discount', desc: 'e.g. 15% off food & drinks' },
                  { id: 'flat_discount', label: 'Flat Cash Discount', desc: 'e.g. ₹100 or ₹150 off total bill' },
                  { id: 'free_dessert', label: 'Free Chef Dessert', desc: 'e.g. Saffron Kulfi, Tiramisu' },
                  { id: 'free_beverage', label: 'Free Craft Beverage', desc: 'e.g. Lassi, Craft Soda' },
                  { id: 'chef_special', label: 'Chef Starter Treat', desc: 'e.g. Kebab, Bruschetta' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRewardType(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      rewardType === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Dynamic Inputs according to reward type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                {rewardType === 'percent_discount' && (
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {rewardType === 'flat_discount' && (
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Flat Amount (₹)</label>
                    <input
                      type="number"
                      min={50}
                      max={1000}
                      value={flatAmount}
                      onChange={(e) => setFlatAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {(rewardType === 'free_dessert' || rewardType === 'free_beverage' || rewardType === 'chef_special') && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-400 font-medium">Complimentary Dish Name</label>
                    <input
                      type="text"
                      value={freeItemName}
                      onChange={(e) => setFreeItemName(e.target.value)}
                      placeholder="e.g. Royal Saffron Kulfi & Rabri"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Minimum Bill Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minBill}
                    onChange={(e) => setMinBill(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Promo Voucher Prefix</label>
                  <input
                    type="text"
                    value={promoPrefix}
                    onChange={(e) => setPromoPrefix(e.target.value.toUpperCase())}
                    placeholder="WIN-SAFFRON-"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 2: GAME CUSTOMIZER & BRAINSTORMED CHALLENGE GAMES        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'game_customizer' && (
          <div className="space-y-5">
            {/* Active Game Mode Picker */}
            <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Select Active Reward Game</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Brainstormed interactive dining games designed to engage diners and reward 5-star reviews.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="choice-toggle"
                    checked={allowPlayerChoice}
                    onChange={(e) => setAllowPlayerChoice(e.target.checked)}
                    className="rounded bg-slate-800 border-white/20 text-amber-500 cursor-pointer"
                  />
                  <label htmlFor="choice-toggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Allow Diners to Choose Game
                  </label>
                </div>
              </div>

              {/* 4 Brainstormed Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
                {[
                  {
                    id: 'spin_wheel',
                    name: 'Spin Lucky Wheel',
                    emoji: '🎡',
                    desc: 'Classic spinning wheel with customizable slices & clicking pegs.'
                  },
                  {
                    id: 'scratch_card',
                    name: 'Scratch & Win Card',
                    emoji: '🎟️',
                    desc: 'Interactive silver foil scratch-off card with secret prize.'
                  },
                  {
                    id: 'mystery_box',
                    name: 'Mystery Dining Box',
                    emoji: '📦',
                    desc: '3 treasure chests with animated golden lid unboxing.'
                  },
                  {
                    id: 'lucky_dice',
                    name: 'Lucky Dice Challenge',
                    emoji: '🎲',
                    desc: 'Roll golden dice! Score doubles or high sum for VIP discounts.'
                  }
                ].map((game) => {
                  const isSelected = activeGame === game.id;
                  return (
                    <div
                      key={game.id}
                      onClick={() => setActiveGame(game.id as any)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-lg'
                          : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{game.emoji}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs text-white">{game.name}</h5>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{game.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestSimulator(game.id as any);
                        }}
                        className="mt-3 py-1.5 px-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-amber-300 font-bold text-[10px] flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Test Play</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customizer Sub-section for Spin Wheel */}
            {activeGame === 'spin_wheel' && (
              <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <span>🎡 Spin Wheel Slices ({slices.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSlice}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Slice</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {slices.map((slice, idx) => (
                    <div
                      key={slice.id}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-xs"
                    >
                      <input
                        type="color"
                        value={slice.color}
                        onChange={(e) => {
                          const updated = [...slices];
                          updated[idx].color = e.target.value;
                          setSlices(updated);
                        }}
                        className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={slice.label}
                        onChange={(e) => {
                          const updated = [...slices];
                          updated[idx].label = e.target.value;
                          setSlices(updated);
                        }}
                        placeholder="Slice label"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white"
                      />
                      <input
                        type="text"
                        value={slice.reward}
                        onChange={(e) => {
                          const updated = [...slices];
                          updated[idx].reward = e.target.value;
                          setSlices(updated);
                        }}
                        placeholder="Prize reward description"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSlice(slice.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customizer Sub-section for Scratch Card */}
            {activeGame === 'scratch_card' && (
              <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider">
                  🎟️ Scratch &amp; Win Card Customizer
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Scratch Card Heading Title</label>
                    <input
                      type="text"
                      value={scratchTitle}
                      onChange={(e) => setScratchTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Hidden Reward Prize Beneath Card</label>
                    <input
                      type="text"
                      value={scratchPrize}
                      onChange={(e) => setScratchPrize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Customizer Sub-section for Mystery Box */}
            {activeGame === 'mystery_box' && (
              <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider">
                  📦 Mystery Dining Box Prizes
                </h4>
                <div className="space-y-2">
                  {mysteryBoxes.map((box, idx) => (
                    <div
                      key={box.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3"
                    >
                      <span className="text-xl">{box.emoji}</span>
                      <div className="font-bold text-white min-w-[80px]">Box #{box.id}</div>
                      <input
                        type="text"
                        value={box.prize}
                        onChange={(e) => {
                          const updated = [...mysteryBoxes];
                          updated[idx].prize = e.target.value;
                          setMysteryBoxes(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customizer Sub-section for Dice */}
            {activeGame === 'lucky_dice' && (
              <div className="bg-[#090D16] p-4 sm:p-5 rounded-2xl border border-white/[0.08] space-y-4 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider">
                  🎲 Lucky Dice Roll Rules &amp; Prizes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Grand Prize (Rolls 7+ or Doubles)</label>
                    <input
                      type="text"
                      value={diceGrandPrize}
                      onChange={(e) => setDiceGrandPrize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Runner-Up Prize</label>
                    <input
                      type="text"
                      value={diceRunnerPrize}
                      onChange={(e) => setDiceRunnerPrize(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 3: LIVE REVIEWS & ESCALATIONS                            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'live_reviews' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {restaurantReviews.map((rev) => (
                <div key={rev.id} className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{rev.customer_name || 'Verified Diner'}</span>
                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">"{rev.review_text}"</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                    <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                    <span className="text-emerald-400">✓ Verified Dine-In</span>
                  </div>
                </div>
              ))}
              {restaurantReviews.length === 0 && (
                <div className="p-8 text-center text-slate-400 sm:col-span-2">
                  No diner reviews logged yet. Diners who complete the Win Challenge will appear here!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Actions Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleTestSimulator(activeGame)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-amber-300 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Test Play Customer Popup</span>
          </button>

          <div className="flex items-center space-x-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved &amp; Live!</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Activate Changes</span>
            </button>
          </div>
        </div>

      </div>

      {/* Simulator Preview Modal */}
      {isPreviewOpen && (
        <WinChallengeModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          targetRestaurant={restaurant}
          forceGame={previewGame}
        />
      )}
    </div>
  );
};

export default ReviewRewardsManagementModal;
