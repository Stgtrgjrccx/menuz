import React, { useState } from 'react';
import {
  X,
  Sliders,
  Flame,
  ShieldCheck,
  Zap,
  Instagram,
  UtensilsCrossed,
  Check,
  Save,
  Clock,
  Printer,
  Volume2,
  Calendar,
  DollarSign,
  Star,
  Tag,
  Gift
} from 'lucide-react';
import { Restaurant } from '../types';

interface SmartOperationsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  onSave: (updates: Partial<Restaurant>) => void;
  initialTab?: 'kot' | 'happy_hour' | 'instagram' | 'pairings' | 'rewards';
}

export const SmartOperationsSettingsModal: React.FC<SmartOperationsSettingsModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onSave,
  initialTab = 'kot'
}) => {
  const [activeTab, setActiveTab] = useState<'kot' | 'happy_hour' | 'instagram' | 'pairings' | 'rewards'>(initialTab);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // KOT State
  const [directKotEnabled, setDirectKotEnabled] = useState(
    restaurant.direct_kitchen_kot_enabled ?? false
  );
  const [kotStationName, setKotStationName] = useState(
    restaurant.direct_kitchen_kot_config?.station_name || 'Main Kitchen & Bar KDS'
  );
  const [kotDelaySeconds, setKotDelaySeconds] = useState(
    restaurant.direct_kitchen_kot_config?.auto_dispatch_delay_seconds ?? 0
  );
  const [kotAudioChime, setKotAudioChime] = useState(
    restaurant.direct_kitchen_kot_config?.audio_chime_enabled ?? true
  );
  const [kotPrinterIp, setKotPrinterIp] = useState(
    restaurant.direct_kitchen_kot_config?.printer_target_ip || '192.168.1.150:9100'
  );

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

  // Instagram State
  const [igHandle, setIgHandle] = useState(
    restaurant.instagram_config?.handle || restaurant.instagram_handle || `@${restaurant.slug.replace(/-/g, '_')}`
  );
  const [igHashtag, setIgHashtag] = useState(
    restaurant.instagram_config?.hashtag || `#PuneFoodie #${restaurant.slug.replace(/-/g, '')} #MenuzDining`
  );
  const [igQuote, setIgQuote] = useState(
    restaurant.instagram_config?.story_quote || 'Incredible culinary experience'
  );
  const [igBadge, setIgBadge] = useState(
    restaurant.instagram_config?.reward_badge_text || '5-Star Culinary Night'
  );

  // Smart Pairings State
  // Smart Pairings State
  const [pairingsEnabled, setPairingsEnabled] = useState(
    restaurant.smart_pairings_config?.enabled ?? true
  );
  const [pairingsBadge, setPairingsBadge] = useState(
    restaurant.smart_pairings_config?.badge_text || "🧑‍🍳 Chef's Recommended Pairings"
  );
  const [pairingsDiscount, setPairingsDiscount] = useState(
    restaurant.smart_pairings_config?.discount_percent ?? 0
  );

  // Rewards & Loyalty (Spin Wheel & Review Incentives)
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
      direct_kitchen_kot_enabled: directKotEnabled,
      direct_kitchen_kot_config: {
        enabled: directKotEnabled,
        station_name: kotStationName,
        auto_dispatch_delay_seconds: Number(kotDelaySeconds),
        audio_chime_enabled: kotAudioChime,
        printer_target_ip: kotPrinterIp
      },
      happy_hour_config: {
        enabled: happyHourEnabled,
        start_time: happyHourStartTime,
        end_time: happyHourEndTime,
        discount_percent: Number(happyHourDiscount),
        banner_label: happyHourBanner,
        surge_pricing_enabled: surgeEnabled,
        surge_markup_percent: Number(surgeMarkup)
      },
      instagram_handle: igHandle,
      instagram_config: {
        handle: igHandle,
        hashtag: igHashtag,
        story_quote: igQuote,
        reward_badge_text: igBadge
      },
      smart_pairings_config: {
        enabled: pairingsEnabled,
        badge_text: pairingsBadge,
        discount_percent: Number(pairingsDiscount)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090D16]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-white/[0.08] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#090D16]/[0.03]/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center space-x-2">
                <span>Smart Operations & Growth Settings</span>
              </h3>
              <p className="text-xs text-slate-400">Customize operational automation and growth mechanics for {restaurant.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#090D16]/[0.06] hover:bg-white/[0.08] text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 p-2 bg-[#090D16]/[0.04]/70 border-b border-white/[0.08] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('kot')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'kot'
                ? 'bg-white text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Direct KOT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('happy_hour')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'happy_hour'
                ? 'bg-white text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span>Happy Hour & Surge</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instagram')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'instagram'
                ? 'bg-white text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>Instagram Story</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pairings')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'pairings'
                ? 'bg-white text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" />
            <span>Smart Upsell Pairings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-white text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-purple-600" />
            <span>Spin Wheel & Rewards</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: KOT */}
          {activeTab === 'kot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50/60 border border-orange-200 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-white">Direct-to-Kitchen Auto-Dispatch</h4>
                  <p className="text-[11px] text-slate-400">
                    Bypasses manual floor manager confirmation and fires orders straight to kitchen thermal printers or KDS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDirectKotEnabled(!directKotEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    directKotEnabled ? 'bg-emerald-600' : 'bg-white/[0.1]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#090D16] shadow-md transform transition-transform absolute top-1 ${
                      directKotEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kitchen Station / KDS Name</span>
                  </label>
                  <input
                    type="text"
                    value={kotStationName}
                    onChange={(e) => setKotStationName(e.target.value)}
                    placeholder="e.g. Main Kitchen Line, Pizza Oven, Bar KOT"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Auto-Dispatch Delay Buffer</span>
                  </label>
                  <select
                    value={kotDelaySeconds}
                    onChange={(e) => setKotDelaySeconds(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40 bg-[#090D16]"
                  >
                    <option value={0}>Instant (0 Seconds)</option>
                    <option value={30}>30s Waiter Check Window</option>
                    <option value={60}>60s Grace Review Window</option>
                    <option value={120}>120s Table Confirmation Buffer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Printer IP / Port Destination</span>
                  </label>
                  <input
                    type="text"
                    value={kotPrinterIp}
                    onChange={(e) => setKotPrinterIp(e.target.value)}
                    placeholder="e.g. 192.168.1.150:9100"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 border border-white/[0.08] rounded-xl bg-[#090D16]/[0.03]/50">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">KOT Audio Alert Chime</span>
                      <span className="text-[10px] text-slate-500">Play sound when a new order arrives</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={kotAudioChime}
                    onChange={(e) => setKotAudioChime(e.target.checked)}
                    className="w-4 h-4 text-amber-400 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HAPPY HOUR & SURGE */}
          {activeTab === 'happy_hour' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50/60 border border-yellow-200 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-white">Happy Hour Schedule & Discount</h4>
                  <p className="text-[11px] text-slate-400">
                    Automatically triggers off-peak pricing and promotes signature beverages/small bites.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHappyHourEnabled(!happyHourEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    happyHourEnabled ? 'bg-orange-600' : 'bg-white/[0.1]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#090D16] shadow-md transform transition-transform absolute top-1 ${
                      happyHourEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="time"
                    value={happyHourStartTime}
                    onChange={(e) => setHappyHourStartTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40 bg-[#090D16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>End Time</span>
                  </label>
                  <input
                    type="time"
                    value={happyHourEndTime}
                    onChange={(e) => setHappyHourEndTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40 bg-[#090D16]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span>Discount (%)</span>
                  </label>
                  <input
                    type="number"
                    value={happyHourDiscount}
                    onChange={(e) => setHappyHourDiscount(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Announcement Banner Text</label>
                <input
                  type="text"
                  value={happyHourBanner}
                  onChange={(e) => setHappyHourBanner(e.target.value)}
                  placeholder="e.g. ⚡ Twilight Happy Hour: 20% Off Beverages & Small Bites!"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                />
              </div>

              {/* Dynamic Surge Pricing */}
              <div className="pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between p-4 bg-purple-50/60 border border-purple-200 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-xs text-white">Peak Weekend Surge Pricing (Optional)</h4>
                    <p className="text-[11px] text-slate-400">
                      Apply a subtle automatic markup (+5% to +10%) during packed Saturday evening dinner rushes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSurgeEnabled(!surgeEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      surgeEnabled ? 'bg-purple-600' : 'bg-white/[0.1]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-[#090D16] shadow-md transform transition-transform absolute top-1 ${
                        surgeEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {surgeEnabled && (
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">Peak Surge Markup (%)</label>
                    <input
                      type="number"
                      value={surgeMarkup}
                      onChange={(e) => setSurgeMarkup(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: INSTAGRAM STORY */}
          {activeTab === 'instagram' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center space-x-1">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Restaurant Instagram Handle</span>
                  </label>
                  <input
                    type="text"
                    value={igHandle}
                    onChange={(e) => setIgHandle(e.target.value)}
                    placeholder="@casabella_bistro"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Campaign Hashtags</label>
                  <input
                    type="text"
                    value={igHashtag}
                    onChange={(e) => setIgHashtag(e.target.value)}
                    placeholder="#PuneFoodie #MenuzDining #CasaBella"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Default Story Caption Quote</label>
                <input
                  type="text"
                  value={igQuote}
                  onChange={(e) => setIgQuote(e.target.value)}
                  placeholder="Incredible culinary experience"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">Story Badge Stamp</label>
                <input
                  type="text"
                  value={igBadge}
                  onChange={(e) => setIgBadge(e.target.value)}
                  placeholder="5-Star Culinary Night"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SMART PAIRINGS */}
          {activeTab === 'pairings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div>
                  <h4 className="font-bold text-xs text-white">Cart Upsell &amp; Chef's Pairings</h4>
                  <p className="text-[11px] text-slate-400">
                    Displays complementary drinks, sides, and signature desserts right inside the diner's slide-out cart.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPairingsEnabled(!pairingsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    pairingsEnabled ? 'bg-emerald-600' : 'bg-white/[0.1]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#090D16] shadow-md transform transition-transform absolute top-1 ${
                      pairingsEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Upsell Section Header</label>
                  <input
                    type="text"
                    value={pairingsBadge}
                    onChange={(e) => setPairingsBadge(e.target.value)}
                    placeholder="🧑‍🍳 Chef's Recommended Pairings"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">Pairing Incentive Discount (%)</label>
                  <input
                    type="number"
                    value={pairingsDiscount}
                    onChange={(e) => setPairingsDiscount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-amber-600/40"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">0% = regular dish price, 10% = bundle deal</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REWARDS & SPIN WHEEL (OWNER SOVEREIGN DISCOUNT CONTROL) */}
          {activeTab === 'rewards' && (
            <div className="space-y-5">
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-xs text-white">Owner-Controlled Loyalty &amp; Rewards Policy</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unlike delivery aggregators that mandate 20%–40% discounts, Menuz puts operators in 100% control. By default, your margin is protected with zero cash discounting (using chef culinary treats &amp; VIP perks). You decide whether bill discounts are allowed and at what percentage.
                </p>
              </div>

              {/* Toggle: Allow Bill Discounts */}
              <div className="flex items-center justify-between p-4 bg-[#090D16]/[0.03] border border-white/[0.08] rounded-2xl">
                <div>
                  <h5 className="font-bold text-xs text-white">Allow Bill Discounts on Spin Wheel</h5>
                  <p className="text-[11px] text-slate-400">
                    {allowBillDiscounts 
                      ? 'Enabled: Guests can win your custom percentage discount voucher.'
                      : 'Disabled (Recommended): 100% Food-only treats & VIP passes. Zero bill discounting.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowBillDiscounts(!allowBillDiscounts)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    allowBillDiscounts ? 'bg-purple-600' : 'bg-white/[0.1]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#090D16] shadow-md transform transition-transform absolute top-1 ${
                      allowBillDiscounts ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* If Allowed: Configure Custom Percentage */}
              {allowBillDiscounts && (
                <div className="p-4 bg-[#090D16]/[0.03] border border-purple-200 rounded-2xl space-y-4 animate-in fade-in">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        Owner-Defined Discount Percentage
                      </label>
                      <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        {rewardDiscountPercent}% OFF
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={rewardDiscountPercent}
                      onChange={(e) => setRewardDiscountPercent(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>5% (Conservative)</span>
                      <span>10% (Balanced)</span>
                      <span>15%</span>
                      <span>20%</span>
                      <span>25%</span>
                      <span>30% (Max)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">Voucher Label on Wheel</label>
                    <input
                      type="text"
                      value={`${rewardDiscountPercent}% Off Next Dine-In Visit`}
                      readOnly
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#090D16]/[0.04] text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Reward Strategy Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-200">Reward Distribution Strategy</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => {
                      setRewardMode('hospitality_food_only');
                      setAllowBillDiscounts(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      !allowBillDiscounts
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-white/[0.08] bg-[#090D16] hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white flex items-center justify-between">
                      <span>🛡️ Food-Only Perks</span>
                      {!allowBillDiscounts && <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">Active</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Complimentary desserts, starters &amp; mocktails. 100% margin safe, zero cash discount.
                    </p>
                  </div>

                  <div 
                    onClick={() => {
                      setRewardMode('owner_custom_discount');
                      setAllowBillDiscounts(true);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      allowBillDiscounts
                        ? 'border-purple-500 bg-purple-50/50 shadow-sm'
                        : 'border-white/[0.08] bg-[#090D16] hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white flex items-center justify-between">
                      <span>🏷️ Custom % Discount</span>
                      {allowBillDiscounts && <span className="text-[10px] bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded">Active</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {rewardDiscountPercent}% discount voucher set by you. Great for off-peak days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#090D16]/[0.03] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-green-700 flex items-center space-x-1 animate-in fade-in">
                <Check className="w-4 h-4 text-green-600" />
                <span>All settings saved and persisted!</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Apply Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
