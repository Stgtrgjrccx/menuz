import React, { useState } from 'react';
import {
  X,
  Sliders,
  Zap,
  UtensilsCrossed,
  Check,
  Save,
  Clock,
  Tag,
  Gift,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Restaurant } from '../types';

interface SmartOperationsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  onSave: (updates: Partial<Restaurant>) => void;
  initialTab?: 'happy_hour' | 'pairings' | 'rewards';
}

export const SmartOperationsSettingsModal: React.FC<SmartOperationsSettingsModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onSave,
  initialTab = 'pairings'
}) => {
  const [activeTab, setActiveTab] = useState<'happy_hour' | 'pairings' | 'rewards'>(
    initialTab === 'happy_hour' || initialTab === 'rewards' ? initialTab : 'pairings'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Happy Hour & Surge State
  const [happyHourEnabled, setHappyHourEnabled] = useState(
    restaurant.happy_hour_config?.enabled ?? false
  );
  const [happyHourStartTime, setHappyHourStartTime] = useState(
    restaurant.happy_hour_config?.start_time || '16:00'
  );
  const [happyHourEndTime, setHappyHourEndTime] = useState(
    restaurant.happy_hour_config?.end_time || '19:30'
  );
  const [happyHourDiscount, setHappyHourDiscount] = useState(
    restaurant.happy_hour_config?.discount_percent ?? 20
  );
  const [happyHourBanner, setHappyHourBanner] = useState(
    restaurant.happy_hour_config?.banner_label || '⚡ Twilight Happy Hour: 20% Off Beverages & Small Bites!'
  );
  const [surgeEnabled, setSurgeEnabled] = useState(
    restaurant.happy_hour_config?.surge_pricing_enabled ?? false
  );
  const [surgeMarkup, setSurgeMarkup] = useState(
    restaurant.happy_hour_config?.surge_markup_percent ?? 10
  );

  // Smart Pairings State (Permanently Retained & Saved)
  const [pairingsEnabled, setPairingsEnabled] = useState(
    restaurant.smart_pairings_config?.enabled ?? true
  );
  const [pairingsBadge, setPairingsBadge] = useState(
    restaurant.smart_pairings_config?.badge_text || "🧑‍🍳 Chef's Recommended Pairings"
  );
  const [pairingsDiscount, setPairingsDiscount] = useState(
    restaurant.smart_pairings_config?.discount_percent ?? 10
  );
  const [pairingsRule, setPairingsRule] = useState(
    restaurant.smart_pairings_config?.rule_description || "Auto-suggest signature beverage or chef dessert with every main course order."
  );

  // Rewards & Loyalty
  const [allowBillDiscounts, setAllowBillDiscounts] = useState(
    restaurant.reward_settings?.allow_bill_discounts ?? false
  );
  const [rewardDiscountPercent, setRewardDiscountPercent] = useState(
    restaurant.reward_settings?.discount_percentage ?? 10
  );
  const [rewardMode, setRewardMode] = useState<'hospitality_food_only' | 'owner_custom_discount' | 'hybrid'>(
    restaurant.reward_settings?.reward_mode ?? 'hospitality_food_only'
  );

  if (!isOpen) return null;

  const handleSaveAll = () => {
    onSave({
      happy_hour_config: {
        enabled: happyHourEnabled,
        start_time: happyHourStartTime,
        end_time: happyHourEndTime,
        discount_percent: Number(happyHourDiscount),
        banner_label: happyHourBanner,
        surge_pricing_enabled: surgeEnabled,
        surge_markup_percent: Number(surgeMarkup)
      },
      smart_pairings_config: {
        enabled: pairingsEnabled,
        badge_text: pairingsBadge,
        discount_percent: Number(pairingsDiscount),
        rule_description: pairingsRule
      },
      reward_settings: {
        allow_bill_discounts: allowBillDiscounts,
        discount_percentage: Number(rewardDiscountPercent),
        reward_mode: allowBillDiscounts ? (rewardMode === 'hospitality_food_only' ? 'owner_custom_discount' : rewardMode) : 'hospitality_food_only',
        custom_discount_label: `${rewardDiscountPercent}% Off Next Dine-In Visit`
      }
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-4 flex justify-center items-start overscroll-contain">
      <div className="bg-[#F5F1E8] border border-black/[0.12] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-2 sm:my-6 text-[#141414]">
        {/* Header */}
        <div className="p-5 border-b border-black/[0.08] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#3A3A3A] hover:text-[#141414] font-bold text-xs border border-black/[0.1] transition-all cursor-pointer mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#F4511E]/15 border border-[#F4511E]/30 flex items-center justify-center text-[#2D4A3E] shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#141414] flex items-center space-x-2">
                <span>Smart Growth &amp; Upsell Engine</span>
              </h3>
              <p className="text-xs text-[#6E6E6E]">Configure happy hour, chef pairings, and reward incentives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.04] text-[#4A4A4A] hover:text-[#141414] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 p-3 bg-[#FFFFFF] border-b border-black/[0.08] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('pairings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'pairings'
                ? 'bg-[#F4511E]/20 text-[#2D4A3E] shadow-sm border border-[#F4511E]/40 font-bold'
                : 'text-[#6E6E6E] hover:text-[#141414] bg-black/[0.04]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#2F7A4F]" />
            <span>Smart Chef Pairings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('happy_hour')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'happy_hour'
                ? 'bg-[#F4511E]/20 text-[#2D4A3E] shadow-sm border border-[#F4511E]/40 font-bold'
                : 'text-[#6E6E6E] hover:text-[#141414] bg-black/[0.04]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#2D4A3E]" />
            <span>Happy Hour &amp; Surge</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-[#F4511E]/20 text-[#2D4A3E] shadow-sm border border-[#F4511E]/40 font-bold'
                : 'text-[#6E6E6E] hover:text-[#141414] bg-black/[0.04]'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#2D4A3E]" />
            <span>Spin Wheel &amp; Food Rewards</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: SMART CHEF PAIRINGS (CONSTANTLY RETAINED) */}
          {activeTab === 'pairings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-[#141414] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2F7A4F]" />
                    <span>AI Chef's Cart Upsell Pairings</span>
                  </h4>
                  <p className="text-[11px] text-[#4A4A4A] mt-0.5">
                    Intelligently recommends matching drinks, desserts, and sides inside diner cart to boost ticket size (+28% avg).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPairingsEnabled(!pairingsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    pairingsEnabled ? 'bg-emerald-600' : 'bg-[#E8DCC8]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                      pairingsEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5">Pairing Header Label</label>
                <input
                  type="text"
                  value={pairingsBadge}
                  onChange={(e) => setPairingsBadge(e.target.value)}
                  placeholder="e.g. 🧑‍🍳 Chef's Recommended Pairings"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5">Pairing Upsell Incentive Discount (% Off)</label>
                <input
                  type="number"
                  value={pairingsDiscount}
                  onChange={(e) => setPairingsDiscount(Number(e.target.value))}
                  placeholder="10"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                />
                <p className="text-[10px] text-[#6E6E6E] mt-1">
                  Optional extra incentive discount applied when diner adds the suggested pairing dish to their order.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5">Upsell Strategy Rule</label>
                <textarea
                  rows={2}
                  value={pairingsRule}
                  onChange={(e) => setPairingsRule(e.target.value)}
                  placeholder="Describe your pairing strategy..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                />
              </div>
            </div>
          )}

          {/* TAB 2: HAPPY HOUR & SURGE */}
          {activeTab === 'happy_hour' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F4511E]/30 border border-[#F4511E]/30 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-[#141414]">Happy Hour Schedule &amp; Discount</h4>
                  <p className="text-[11px] text-[#4A4A4A] mt-0.5">
                    Automatically triggers off-peak pricing and promotes signature beverages and small bites.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHappyHourEnabled(!happyHourEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    happyHourEnabled ? 'bg-[#F4511E]' : 'bg-[#E8DCC8]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                      happyHourEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#6E6E6E]" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="time"
                    value={happyHourStartTime}
                    onChange={(e) => setHappyHourStartTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#6E6E6E]" />
                    <span>End Time</span>
                  </label>
                  <input
                    type="time"
                    value={happyHourEndTime}
                    onChange={(e) => setHappyHourEndTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5 flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-[#6E6E6E]" />
                    <span>Discount (%)</span>
                  </label>
                  <input
                    type="number"
                    value={happyHourDiscount}
                    onChange={(e) => setHappyHourDiscount(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5">Announcement Banner Text</label>
                <input
                  type="text"
                  value={happyHourBanner}
                  onChange={(e) => setHappyHourBanner(e.target.value)}
                  placeholder="e.g. ⚡ Twilight Happy Hour: 20% Off Beverages & Small Bites!"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                />
              </div>

              {/* Dynamic Surge Pricing */}
              <div className="pt-2 border-t border-black/[0.08]">
                <div className="flex items-center justify-between p-4 bg-[#F4511E]/30 border border-[#F4511E]/30 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-xs text-[#141414]">Peak Weekend Surge Pricing (Optional)</h4>
                    <p className="text-[11px] text-[#4A4A4A] mt-0.5">
                      Apply a subtle automatic markup (+5% to +10%) during packed Saturday evening dinner rushes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSurgeEnabled(!surgeEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      surgeEnabled ? 'bg-[#F4511E]' : 'bg-[#E8DCC8]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform absolute top-1 ${
                        surgeEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {surgeEnabled && (
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-[#3A3A3A] mb-1.5">Surge Markup Percentage (%)</label>
                    <input
                      type="number"
                      value={surgeMarkup}
                      onChange={(e) => setSurgeMarkup(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F5F1E8] border border-black/[0.15] text-white focus:outline-none focus:border-[#F4511E]/60"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F4511E]/30 border border-[#F4511E]/30 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-[#141414]">Spin Wheel &amp; Dining Rewards Mode</h4>
                  <p className="text-[11px] text-[#4A4A4A] mt-0.5">
                    Controls whether rewards are hospitality food items (Chef Dessert, Mocktail) or bill discounts.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#3A3A3A]">Reward Policy</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRewardMode('hospitality_food_only')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      rewardMode === 'hospitality_food_only'
                        ? 'bg-[#F4511E]/20 border-[#F4511E]/40 text-[#2D4A3E] font-bold'
                        : 'bg-[#F5F1E8] border-black/[0.1] text-[#4A4A4A]'
                    }`}
                  >
                    <h5 className="font-bold text-xs text-[#141414]">🍰 Complimentary Food &amp; Drinks</h5>
                    <p className="text-[10px] text-[#6E6E6E] mt-1">Chef Dessert, Artisan Mocktail, Gourmet Starter (Best Margin)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRewardMode('hybrid')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      rewardMode === 'hybrid'
                        ? 'bg-[#F4511E]/20 border-[#F4511E]/40 text-[#2D4A3E] font-bold'
                        : 'bg-[#F5F1E8] border-black/[0.1] text-[#4A4A4A]'
                    }`}
                  >
                    <h5 className="font-bold text-xs text-[#141414]">🎁 Hybrid Food &amp; Next-Visit Perk</h5>
                    <p className="text-[10px] text-[#6E6E6E] mt-1">Instant food reward + discount code for next table reservation</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/[0.08] flex items-center justify-between bg-[#FFFFFF]">
          <span className="text-[11px] text-[#6E6E6E]">
            {savedSuccess ? '✓ Settings saved successfully!' : 'All changes update live across diner menus.'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#4A4A4A] hover:text-[#141414] border border-black/[0.1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:from-[#F4511E] text-white shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
