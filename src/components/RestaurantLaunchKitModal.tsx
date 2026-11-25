import React, { useState } from 'react';
import { Restaurant, RestaurantTable, MODERN_POS_PROVIDERS } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  ChefHat,
  LayoutDashboard,
  ShoppingBag,
  Globe,
  ShieldCheck,
  Printer,
  Smartphone,
  Send,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
  Server,
  Zap,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface RestaurantLaunchKitModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  isInitialOnboarding?: boolean;
  onOpenTableManagement?: () => void;
}

export const RestaurantLaunchKitModal: React.FC<RestaurantLaunchKitModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  isInitialOnboarding = false,
  onOpenTableManagement
}) => {
  const tables = useRestaurantStore((state) => state.tables);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
  
  const [activeTab, setActiveTab] = useState<'links' | 'share_kit' | 'white_label'>('links');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // White label form state
  const [customDomain, setCustomDomain] = useState(restaurant.white_label?.custom_domain || '');
  const [hideBranding, setHideBranding] = useState(restaurant.white_label?.hide_menuz_branding || false);
  const [customEmail, setCustomEmail] = useState(restaurant.white_label?.custom_support_email || restaurant.contact_email || '');
  const [customPhone, setCustomPhone] = useState(restaurant.white_label?.custom_support_phone || restaurant.contact_phone || '');
  const [customFavicon, setCustomFavicon] = useState(restaurant.white_label?.custom_favicon_url || '');
  const [domainVerified, setDomainVerified] = useState(restaurant.white_label?.domain_verified || false);
  const [isSavingWhiteLabel, setIsSavingWhiteLabel] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const restaurantTables = tables.filter((t) => t.restaurant_id === restaurant.id);
  const defaultToken = restaurantTables[0]?.public_token || `token-${restaurant.slug}-01`;
  
  // Base URLs
  const origin = window.location.origin + window.location.pathname;
  const dinerUrl = `${origin}#/r/${restaurant.slug}/menu?t=${defaultToken}`;
  const managerUrl = `${origin}#/manage/${restaurant.slug}`;
  const kitchenUrl = `${origin}#/kitchen`;
  const aiStudioUrl = `${origin}#/ai-studio`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const posProviderInfo = MODERN_POS_PROVIDERS.find((p) => p.id === restaurant.pos_provider) || {
    name: restaurant.pos_provider ? restaurant.pos_provider.toUpperCase() : 'Universal API',
    region: 'Connected',
    tag: 'Active'
  };

  // Pre-formatted WhatsApp Client Handover Message
  const whatsappHandoverMessage = `*🎉 Menuz Onboarding Complete — ${restaurant.name} is LIVE!*

Hello ${restaurant.owner_name || restaurant.name + ' Team'},
Your AI-Powered In-Dining Operating System and Digital Table Menus are ready for service!

━━━━━━━━━━━━━━━━━━━━
🍽️ *1. Live Customer Dining Menu (Table 1):*
${dinerUrl}

👨‍💼 *2. Manager Operations & Order Hub:*
${managerUrl}

🍳 *3. Kitchen Display System (KDS):*
${kitchenUrl}

🤖 *4. Chef & Owner AI Training Studio:*
${aiStudioUrl}
━━━━━━━━━━━━━━━━━━━━

✨ *Highlights Active on Your Menu:*
• Personalized Chef AI trained on your secret recipes & wine pairings
• Verified 5-Star Google Review Engine with Lucky Wheel Game
• Multi-Channel KOT: ${posProviderInfo.name} (${posProviderInfo.region})
• Ready Table QR Codes for Tables 1 to ${Math.max(restaurantTables.length, 4)}

For table adjustments or custom domain setup, open your manager console anytime.`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappHandoverMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleSaveWhiteLabel = () => {
    setIsSavingWhiteLabel(true);
    setTimeout(() => {
      updateRestaurant(restaurant.id, {
        white_label: {
          custom_domain: customDomain.trim(),
          domain_verified: domainVerified,
          cname_target: 'cname.menuz.co',
          ssl_status: domainVerified ? 'active' : 'pending',
          hide_menuz_branding: hideBranding,
          custom_support_email: customEmail.trim(),
          custom_support_phone: customPhone.trim(),
          custom_favicon_url: customFavicon.trim()
        }
      });
      setIsSavingWhiteLabel(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-5 flex justify-center items-start overscroll-contain">
      <div className="bg-[#FFFFFF] border border-black/[0.08] rounded-3xl max-w-2xl w-full overflow-hidden flex flex-col my-2 sm:my-6 shadow-2xl">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#F4511E] via-[#F4511E] to-[#F4511E] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white font-bold text-xs border border-black/20 transition-all cursor-pointer mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF]/10 backdrop-blur-sm border border-black/20 flex items-center justify-center text-[#141414] font-serif font-bold text-xl shadow-inner">
              {restaurant.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/20 text-[#141414] border border-black/30">
                  {isInitialOnboarding ? '🎉 Onboarding Successful' : '📱 Venue Links & Access'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#2F7A4F] border border-emerald-400/30 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Ready for Diners</span>
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414] mt-1">
                {restaurant.name}
              </h2>
              <p className="text-xs text-[#141414]/80 font-medium">
                {restaurant.cuisine} • {restaurant.location || 'Pune, India'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1.5 mt-4 pt-3 border-t border-black/15 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('links')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'links'
                  ? 'bg-white text-[#141414] shadow-sm'
                  : 'text-[#141414]/80 hover:text-[#141414] hover:bg-black/[0.06]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Direct Links</span>
            </button>
            <button
              onClick={() => setActiveTab('share_kit')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'share_kit'
                  ? 'bg-white text-[#141414] shadow-sm'
                  : 'text-[#141414]/80 hover:text-[#141414] hover:bg-black/[0.06]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Handover</span>
            </button>

            <button
              onClick={() => setActiveTab('white_label')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'white_label'
                  ? 'bg-white text-[#141414] shadow-sm'
                  : 'text-[#141414]/80 hover:text-[#141414] hover:bg-black/[0.06]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Domain</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#141414] text-xs flex-1">
          
          {/* TAB 1: ALL VENUE LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-3">
              <p className="text-[#6E6E6E] leading-relaxed">
                Permanent, isolated URLs for <strong>{restaurant.name}</strong>. Share these with the dining floor, manager, and kitchen staff:
              </p>

              {/* Link Card 1: Customer Diner Menu */}
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF]/[0.03] border border-black/[0.08] hover:border-[#F4511E]/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-[#F4511E]/20 text-[#2D4A3E]">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-[#141414] text-sm">Customer Dining Menu ({restaurantTables[0]?.label || 'Table 1'})</h4>
                      <span className="text-[10px] text-[#7A7A7A]">Guest-facing menu with Personalized Chef AI & 5-star review wheel</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#2F7A4F] border border-emerald-500/20 font-bold">
                    Zero Admin Leaks
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-[#FFFFFF] p-2 rounded-xl border border-black/[0.08] font-mono text-[11px] text-[#2D4A3E] truncate">
                  <span className="flex-1 truncate">{dinerUrl}</span>
                  <button
                    onClick={() => copyToClipboard(dinerUrl, 'diner')}
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex items-center space-x-1 flex-shrink-0"
                    title="Copy Customer Menu Link"
                  >
                    {copiedKey === 'diner' ? <Check className="w-3.5 h-3.5 text-[#2F7A4F]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'diner' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={dinerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex-shrink-0"
                    title="Open Live Menu"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2D4A3E]" />
                  </a>
                </div>
              </div>

              {/* Link Card 2: Manager Operations Hub */}
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF]/[0.03] border border-black/[0.08] hover:border-[#F4511E]/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-[#F4511E]/20 text-[#2D4A3E]">
                      <LayoutDashboard className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-[#141414] text-sm">Manager Operations Hub</h4>
                      <span className="text-[10px] text-[#7A7A7A]">Live table management, dish catalog, waiter call alerts, and billing</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4511E]/10 text-[#2D4A3E] border border-[#F4511E]/20 font-bold">
                    Staff Portal
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-[#FFFFFF] p-2 rounded-xl border border-black/[0.08] font-mono text-[11px] text-[#2D4A3E] truncate">
                  <span className="flex-1 truncate">{managerUrl}</span>
                  <button
                    onClick={() => copyToClipboard(managerUrl, 'manager')}
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedKey === 'manager' ? <Check className="w-3.5 h-3.5 text-[#2F7A4F]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'manager' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={managerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2D4A3E]" />
                  </a>
                </div>
              </div>

              {/* Link Card 3: Kitchen Display System (KDS) */}
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF]/[0.03] border border-black/[0.08] hover:border-[#F4511E]/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-[#F4511E]/20 text-[#F4511E]">
                      <ChefHat className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-[#141414] text-sm">Kitchen Display Screen (KDS)</h4>
                      <span className="text-[10px] text-[#7A7A7A]">Real-time thermal KOT cards, prep timers, station routing</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4511E]/10 text-[#F4511E] border border-[#F4511E]/20 font-bold">
                    Kitchen Terminal
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-[#FFFFFF] p-2 rounded-xl border border-black/[0.08] font-mono text-[11px] text-[#F4511E] truncate">
                  <span className="flex-1 truncate">{kitchenUrl}</span>
                  <button
                    onClick={() => copyToClipboard(kitchenUrl, 'kitchen')}
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedKey === 'kitchen' ? <Check className="w-3.5 h-3.5 text-[#2F7A4F]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'kitchen' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={kitchenUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#F4511E]" />
                  </a>
                </div>
              </div>

              {/* Link Card 4: Chef & Owner AI Studio */}
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF]/[0.03] border border-black/[0.08] hover:border-[#F4511E]/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-[#F4511E]/20 text-[#2D4A3E]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-[#141414] text-sm">Chef & Owner AI Bot Studio</h4>
                      <span className="text-[10px] text-[#7A7A7A]">Daily freshness broadcasts, secret recipe lore, personality tuning</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4511E]/10 text-[#2D4A3E] border border-[#F4511E]/20 font-bold">
                    AI Knowledge Base
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-[#FFFFFF] p-2 rounded-xl border border-black/[0.08] font-mono text-[11px] text-[#2D4A3E] truncate">
                  <span className="flex-1 truncate">{aiStudioUrl}</span>
                  <button
                    onClick={() => copyToClipboard(aiStudioUrl, 'aistudio')}
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedKey === 'aistudio' ? <Check className="w-3.5 h-3.5 text-[#2F7A4F]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'aistudio' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={aiStudioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-[#F5F1E8] rounded-lg text-[#6E6E6E] hover:text-[#141414] transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2D4A3E]" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP CLIENT HANDOVER */}
          {activeTab === 'share_kit' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-[#F4511E]/10 border border-[#F4511E]/20 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#141414] text-xs">Ready-to-Send Client Handover Brief</h4>
                  <p className="text-[10px] text-[#6E6E6E] mt-0.5">
                    Send this formatted brief directly to the restaurant owner via WhatsApp or Email in 1 click.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(whatsappHandoverMessage, 'full_brief')}
                    className="px-3 py-1.5 rounded-xl bg-[#F5F1E8] hover:bg-black/[0.04] text-[#141414] font-bold text-xs flex items-center space-x-1.5 border border-black/[0.1] transition-colors"
                  >
                    {copiedKey === 'full_brief' ? <Check className="w-3.5 h-3.5 text-[#2F7A4F]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'full_brief' ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Message Preview */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-black/[0.08] font-mono text-[11px] text-[#4A4A4A] whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto select-all">
                {whatsappHandoverMessage}
              </div>
            </div>
          )}



          {/* TAB 4: WHITE-LABEL & CUSTOM DOMAIN */}
          {activeTab === 'white_label' && (
            <div className="space-y-4">
              
              {/* How it works 3-Step Guide */}
              <div className="p-4 bg-gradient-to-r from-[#F5F1E8] to-[#F5F1E8] border border-black/[0.08] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#2D4A3E]" />
                    <h4 className="font-bold text-[#141414] text-sm">How to Connect a Custom Domain</h4>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    domainVerified
                      ? 'bg-emerald-500/20 text-[#2F7A4F] border-emerald-500/30'
                      : 'bg-[#F4511E]/20 text-[#2D4A3E] border-[#F4511E]/30'
                  }`}>
                    {domainVerified ? 'SSL Active & Verified' : 'DNS Propagation Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-[#6E6E6E] pt-1">
                  <div className="p-2.5 bg-[#FFFFFF]/90 rounded-xl border border-black/[0.08] space-y-1">
                    <span className="font-bold text-[#2D4A3E] text-xs block">Step 1: In GoDaddy / Cloudflare</span>
                    <p className="text-[10px] text-[#7A7A7A]">Add a <strong>CNAME</strong> record in your DNS settings for your restaurant domain.</p>
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF]/90 rounded-xl border border-black/[0.08] space-y-1">
                    <span className="font-bold text-[#2D4A3E] text-xs block">Step 2: Point to Menuz Server</span>
                    <p className="text-[10px] text-[#7A7A7A]">Host: <code>menu</code> &rarr; Target: <code>cname.menuz.co</code></p>
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF]/90 rounded-xl border border-black/[0.08] space-y-1">
                    <span className="font-bold text-[#2D4A3E] text-xs block">Step 3: Free Automated SSL</span>
                    <p className="text-[10px] text-[#7A7A7A]">Enter domain below and click "Verify". Free HTTPS/SSL activates automatically!</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-[#FFFFFF]/[0.03] p-4 rounded-2xl border border-black/[0.08]">
                <div>
                  <label className="font-bold text-[#141414] block mb-1">Your Custom Domain URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder={`menu.${restaurant.slug.replace(/[^a-z0-9]/g, '')}.com`}
                      className="flex-1 bg-[#FFFFFF] border border-black/[0.08] rounded-xl px-3 py-2 text-[#141414] font-mono text-xs focus:outline-none focus:border-[#F4511E]"
                    />
                    <button
                      type="button"
                      onClick={() => setDomainVerified(!domainVerified)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                        domainVerified
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F4511E] hover:bg-[#F4511E] text-white'
                      }`}
                    >
                      {domainVerified ? 'Verified ✓' : 'Verify DNS'}
                    </button>
                  </div>
                  <div className="mt-2 p-2.5 bg-[#FFFFFF] rounded-xl border border-black/[0.08] text-[10px] text-[#7A7A7A] font-mono flex items-center justify-between">
                    <span>DNS CNAME Target: <strong className="text-[#2D4A3E]">cname.menuz.co</strong></span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('cname.menuz.co', 'cname')}
                      className="text-[#2D4A3E] hover:text-[#2D4A3E] flex items-center space-x-1"
                    >
                      {copiedKey === 'cname' ? <Check className="w-3 h-3 text-[#2F7A4F]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cname' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-black/[0.08]">
                  <div>
                    <label className="font-bold text-[#141414] block mb-1">Custom Support Email</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="support@restaurant.com"
                      className="w-full bg-[#FFFFFF] border border-black/[0.08] rounded-xl px-3 py-2 text-[#141414] text-xs focus:outline-none focus:border-[#F4511E]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#141414] block mb-1">Custom Support Phone</label>
                    <input
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="+91 20 2600 0000"
                      className="w-full bg-[#FFFFFF] border border-black/[0.08] rounded-xl px-3 py-2 text-[#141414] text-xs focus:outline-none focus:border-[#F4511E]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.08] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#141414] text-xs block">White-Label Enterprise Mode</span>
                    <span className="text-[10px] text-[#7A7A7A]">Hide all "Powered by Menuz" logos and branding from diner UI</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideBranding}
                      onChange={(e) => setHideBranding(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#FFFFFF]/[0.06] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4511E]"></div>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveWhiteLabel}
                    disabled={isSavingWhiteLabel}
                    className="w-full py-2.5 rounded-xl bg-[#F4511E] hover:bg-[#F4511E] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    {isSavingWhiteLabel ? (
                      <span>Saving Configuration...</span>
                    ) : saveSuccess ? (
                      <span className="flex items-center space-x-1.5 text-[#141414]">
                        <CheckCircle2 className="w-4 h-4 text-[#141414]" />
                        <span>Domain & White-Label Settings Saved!</span>
                      </span>
                    ) : (
                      <span>Save Custom Domain & Brand Settings</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFFFF] border-t border-black/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#7A7A7A]">
            <ShieldCheck className="w-4 h-4 text-[#2D4A3E]" />
            <span className="text-[11px]">POS Connected: <strong className="text-[#141414]">{posProviderInfo.name}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F5F1E8] hover:bg-black/[0.04] text-[#141414] font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
