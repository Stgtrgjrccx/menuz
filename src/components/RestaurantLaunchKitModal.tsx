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
  Layers
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
  
  const [activeTab, setActiveTab] = useState<'links' | 'share_kit' | 'qr_codes' | 'white_label'>('links');
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-3xl max-w-2xl w-full shadow-float overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-saffron-600 via-amber-600 to-orange-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-serif font-bold text-xl shadow-inner">
              {restaurant.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  {isInitialOnboarding ? '🎉 Onboarding Successful' : '📱 Venue Links & Access'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Ready for Diners</span>
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {restaurant.name}
              </h2>
              <p className="text-xs text-white/80 font-medium">
                {restaurant.cuisine} • {restaurant.location || 'Pune, India'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1.5 mt-4 pt-3 border-t border-white/15 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('links')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'links'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Direct Links</span>
            </button>
            <button
              onClick={() => setActiveTab('share_kit')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'share_kit'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Handover</span>
            </button>
            <button
              onClick={() => setActiveTab('qr_codes')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'qr_codes'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Table QR Cards ({restaurantTables.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('white_label')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'white_label'
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Domain</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-white text-xs flex-1">
          
          {/* TAB 1: ALL VENUE LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-3">
              <p className="text-charcoal-300 leading-relaxed">
                Permanent, isolated URLs for <strong>{restaurant.name}</strong>. Share these with the dining floor, manager, and kitchen staff:
              </p>

              {/* Link Card 1: Customer Diner Menu */}
              <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 hover:border-saffron-500/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-saffron-500/20 text-saffron-400">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Customer Dining Menu ({restaurantTables[0]?.label || 'Table 1'})</h4>
                      <span className="text-[10px] text-charcoal-400">Guest-facing menu with Personalized Chef AI & 5-star review wheel</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Zero Admin Leaks
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-charcoal-950 p-2 rounded-xl border border-charcoal-800 font-mono text-[11px] text-saffron-300 truncate">
                  <span className="flex-1 truncate">{dinerUrl}</span>
                  <button
                    onClick={() => copyToClipboard(dinerUrl, 'diner')}
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex items-center space-x-1 flex-shrink-0"
                    title="Copy Customer Menu Link"
                  >
                    {copiedKey === 'diner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'diner' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={dinerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex-shrink-0"
                    title="Open Live Menu"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-saffron-400" />
                  </a>
                </div>
              </div>

              {/* Link Card 2: Manager Operations Hub */}
              <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <LayoutDashboard className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Manager Operations Hub</h4>
                      <span className="text-[10px] text-charcoal-400">Live table management, dish catalog, waiter call alerts, and billing</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                    Staff Portal
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-charcoal-950 p-2 rounded-xl border border-charcoal-800 font-mono text-[11px] text-amber-300 truncate">
                  <span className="flex-1 truncate">{managerUrl}</span>
                  <button
                    onClick={() => copyToClipboard(managerUrl, 'manager')}
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedKey === 'manager' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'manager' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={managerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                </div>
              </div>

              {/* Link Card 3: Kitchen Display System (KDS) */}
              <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 hover:border-orange-500/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                      <ChefHat className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Kitchen Display Screen (KDS)</h4>
                      <span className="text-[10px] text-charcoal-400">Real-time thermal KOT cards, prep timers, station routing</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 font-bold">
                    Kitchen Terminal
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-charcoal-950 p-2 rounded-xl border border-charcoal-800 font-mono text-[11px] text-orange-300 truncate">
                  <span className="flex-1 truncate">{kitchenUrl}</span>
                  <button
                    onClick={() => copyToClipboard(kitchenUrl, 'kitchen')}
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedKey === 'kitchen' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'kitchen' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={kitchenUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                  </a>
                </div>
              </div>

              {/* Link Card 4: Chef & Owner AI Studio */}
              <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">Chef & Owner AI Bot Studio</h4>
                      <span className="text-[10px] text-charcoal-400">Daily freshness broadcasts, secret recipe lore, personality tuning</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                    AI Knowledge Base
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-charcoal-950 p-2 rounded-xl border border-charcoal-800 font-mono text-[11px] text-purple-300 truncate">
                  <span className="flex-1 truncate">{aiStudioUrl}</span>
                  <button
                    onClick={() => copyToClipboard(aiStudioUrl, 'aistudio')}
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedKey === 'aistudio' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey === 'aistudio' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={aiStudioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-charcoal-800 rounded-lg text-charcoal-300 hover:text-white transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP CLIENT HANDOVER */}
          {activeTab === 'share_kit' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-saffron-500/10 border border-saffron-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Ready-to-Send Client Handover Brief</h4>
                  <p className="text-[10px] text-charcoal-300 mt-0.5">
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
                    className="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-charcoal-600 transition-colors"
                  >
                    {copiedKey === 'full_brief' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'full_brief' ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Message Preview */}
              <div className="bg-charcoal-950 p-4 rounded-2xl border border-charcoal-800 font-mono text-[11px] text-charcoal-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto select-all">
                {whatsappHandoverMessage}
              </div>
            </div>
          )}

          {/* TAB 3: TABLE QR CODES */}
          {activeTab === 'qr_codes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Table QR Code Generator</h4>
                  <p className="text-[11px] text-charcoal-400">
                    Each table has an encrypted token. Guests scan to place orders directly into the kitchen.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {onOpenTableManagement && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTableManagement();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-saffron-300 font-bold text-xs flex items-center space-x-1.5 border border-charcoal-700 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Manage Tables</span>
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print All Stands</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {restaurantTables.slice(0, 12).map((tbl, idx) => {
                  const tableDinerUrl = `${origin}#/r/${restaurant.slug}/menu?t=${tbl.public_token}`;
                  return (
                    <div key={tbl.id} className="p-3 bg-charcoal-800 border border-charcoal-700 rounded-2xl text-center space-y-2">
                      <div className="w-full aspect-square bg-white rounded-xl p-2 flex flex-col items-center justify-center shadow-inner">
                        <QrCode className="w-16 h-16 text-charcoal-900" />
                        <span className="text-[9px] font-bold text-charcoal-700 font-mono mt-1">
                          {tbl.label}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-white truncate">{tbl.label}</div>
                      <button
                        onClick={() => copyToClipboard(tableDinerUrl, `tbl_${idx}`)}
                        className="w-full py-1 rounded-lg bg-charcoal-900 hover:bg-charcoal-950 text-[10px] text-saffron-400 font-bold border border-charcoal-700 transition-colors"
                      >
                        {copiedKey === `tbl_${idx}` ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: WHITE-LABEL & CUSTOM DOMAIN */}
          {activeTab === 'white_label' && (
            <div className="space-y-4">
              
              {/* How it works 3-Step Guide */}
              <div className="p-4 bg-gradient-to-r from-charcoal-800 to-charcoal-850 border border-charcoal-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-saffron-400" />
                    <h4 className="font-bold text-white text-sm">How to Connect a Custom Domain</h4>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    domainVerified
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {domainVerified ? 'SSL Active & Verified' : 'DNS Propagation Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-charcoal-300 pt-1">
                  <div className="p-2.5 bg-charcoal-900/90 rounded-xl border border-charcoal-800 space-y-1">
                    <span className="font-bold text-saffron-400 text-xs block">Step 1: In GoDaddy / Cloudflare</span>
                    <p className="text-[10px] text-charcoal-400">Add a <strong>CNAME</strong> record in your DNS settings for your restaurant domain.</p>
                  </div>
                  <div className="p-2.5 bg-charcoal-900/90 rounded-xl border border-charcoal-800 space-y-1">
                    <span className="font-bold text-saffron-400 text-xs block">Step 2: Point to Menuz Server</span>
                    <p className="text-[10px] text-charcoal-400">Host: <code>menu</code> &rarr; Target: <code>cname.menuz.co</code></p>
                  </div>
                  <div className="p-2.5 bg-charcoal-900/90 rounded-xl border border-charcoal-800 space-y-1">
                    <span className="font-bold text-saffron-400 text-xs block">Step 3: Free Automated SSL</span>
                    <p className="text-[10px] text-charcoal-400">Enter domain below and click "Verify". Free HTTPS/SSL activates automatically!</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-charcoal-800/50 p-4 rounded-2xl border border-charcoal-700">
                <div>
                  <label className="font-bold text-white block mb-1">Your Custom Domain URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder={`menu.${restaurant.slug.replace(/[^a-z0-9]/g, '')}.com`}
                      className="flex-1 bg-charcoal-900 border border-charcoal-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-saffron-500"
                    />
                    <button
                      type="button"
                      onClick={() => setDomainVerified(!domainVerified)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                        domainVerified
                          ? 'bg-emerald-600 text-white'
                          : 'bg-saffron-600 hover:bg-saffron-500 text-white'
                      }`}
                    >
                      {domainVerified ? 'Verified ✓' : 'Verify DNS'}
                    </button>
                  </div>
                  <div className="mt-2 p-2.5 bg-charcoal-950 rounded-xl border border-charcoal-800 text-[10px] text-charcoal-400 font-mono flex items-center justify-between">
                    <span>DNS CNAME Target: <strong className="text-saffron-300">cname.menuz.co</strong></span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('cname.menuz.co', 'cname')}
                      className="text-saffron-400 hover:text-saffron-300 flex items-center space-x-1"
                    >
                      {copiedKey === 'cname' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cname' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-charcoal-700">
                  <div>
                    <label className="font-bold text-white block mb-1">Custom Support Email</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="support@restaurant.com"
                      className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-white block mb-1">Custom Support Phone</label>
                    <input
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="+91 20 2600 0000"
                      className="w-full bg-charcoal-900 border border-charcoal-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-saffron-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-charcoal-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">White-Label Enterprise Mode</span>
                    <span className="text-[10px] text-charcoal-400">Hide all "Powered by Menuz" logos and branding from diner UI</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideBranding}
                      onChange={(e) => setHideBranding(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-charcoal-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron-600"></div>
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveWhiteLabel}
                    disabled={isSavingWhiteLabel}
                    className="w-full py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                  >
                    {isSavingWhiteLabel ? (
                      <span>Saving Configuration...</span>
                    ) : saveSuccess ? (
                      <span className="flex items-center space-x-1.5 text-white">
                        <CheckCircle2 className="w-4 h-4 text-white" />
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
        <div className="p-4 bg-charcoal-950 border-t border-charcoal-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-charcoal-400">
            <ShieldCheck className="w-4 h-4 text-saffron-400" />
            <span className="text-[11px]">POS Connected: <strong className="text-white">{posProviderInfo.name}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
