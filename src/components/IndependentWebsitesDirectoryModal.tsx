import React, { useState, useMemo } from 'react';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  LayoutDashboard,
  ChefHat,
  Sparkles,
  QrCode,
  ShieldCheck,
  Building2,
  X,
  Search,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Restaurant, isWorkingWithMenuz } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { getCustomerSiteUrl, getOwnerSiteUrl } from '../config/siteMode';

interface IndependentWebsitesDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTableManagement?: (restaurant: Restaurant) => void;
}

export const IndependentWebsitesDirectoryModal: React.FC<IndependentWebsitesDirectoryModalProps> = ({
  isOpen,
  onClose,
  onOpenTableManagement
}) => {
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const partnerRestaurants = useMemo(() => {
    return restaurants.filter((r) => isWorkingWithMenuz(r));
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return partnerRestaurants;
    const q = searchQuery.toLowerCase();
    return partnerRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q)
    );
  }, [partnerRestaurants, searchQuery]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#F5F1E8] rounded-3xl max-w-4xl w-full p-6 sm:p-8  border border-black/[0.08] max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-black/[0.08]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#F4511E]/10 text-[#2D4A3E] border border-[#F4511E]/20 flex items-center space-x-1">
                <Globe className="w-3 h-3 text-[#2D4A3E]" />
                <span>Multi-Tenant Architecture</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                {partnerRestaurants.length} Standalone Sites Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#141414] mt-2">
              Independent Restaurant Websites & Direct Access Portals
            </h2>
            <p className="text-xs text-[#6E6E6E] mt-1 max-w-2xl">
              Each restaurant operates as a completely <strong>independent, white-labeled website</strong> with its own dedicated customer menu, table tokens, QR ordering, and manager hub. There is zero Master Admin navigation visible on customer sites.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7A7A7A] hover:text-[#6E6E6E] rounded-2xl hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* How Independent Sites Work Callout */}
        <div className="bg-gradient-to-r from-[#F4511E]/20 via-[#F4511E]/20 to-[#F4511E]/20 p-4 rounded-2xl border border-[#F4511E]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-xs text-amber-950 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2D4A3E]" />
              <span>How Independent Access Works:</span>
            </h4>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              • <strong>Customer Ordering Site</strong>: Scoped strictly to that restaurant. Diners scan the Table QR and see only that restaurant’s menu, brand colors, and AI bot.<br/>
              • <strong>Custom Domains</strong>: Any restaurant can point a custom domain (e.g. <code>menu.restaurantname.com</code>) via CNAME to <code>cname.menuz.co</code> for 100% white labeling.<br/>
              • <strong>Master Admin Oversight</strong>: As the platform owner, you have master access across all sites from your Master Hub.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A7A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search restaurant by name, cuisine, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFFFF]/[0.03] border border-black/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#F4511E]/40 shadow-sm"
          />
        </div>

        {/* Restaurant Standalone Directory Cards */}
        <div className="space-y-4">
          {filteredRestaurants.map((rest) => {
            const restTables = tables.filter((t) => t.restaurant_id === rest.id);
            const defaultToken = restTables[0]?.public_token || `table-token-01-${rest.slug}`;
            const customerFullUrl = getCustomerSiteUrl(`#/r/${rest.slug}/menu?t=${defaultToken}`);
            const managerFullUrl = getOwnerSiteUrl(`#/r/${rest.slug}`);
            const kitchenFullUrl = getOwnerSiteUrl('#/kitchen');
            const customDomain = rest.white_label?.custom_domain || `menu.${rest.slug}.com`;

            return (
              <div
                key={rest.id}
                className="bg-[#F5F1E8] rounded-2xl border border-black/[0.08] p-5 shadow-lg hover: transition-all space-y-4"
              >
                {/* Restaurant Brand Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.08]">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={rest.logo_url}
                      alt={rest.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-black/[0.08] shadow-sm"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-serif font-bold text-base text-[#141414]">{rest.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4511E]/10 text-[#2D4A3E] border border-[#F4511E]/20">
                          {rest.cuisine}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          Active Site
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                        📍 {rest.location || 'Pune, India'} • {restTables.length || 12} Tables • POS: {rest.pos_provider || 'Petpooja'}
                      </p>
                    </div>
                  </div>

                  {onOpenTableManagement && (
                    <button
                      onClick={() => onOpenTableManagement(rest)}
                      className="px-3.5 py-1.5 bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] text-[#3A3A3A] text-xs font-bold rounded-xl border border-black/[0.08] transition-colors self-start sm:self-auto flex items-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      <span>Configure Floor Plan & QRs</span>
                    </button>
                  )}
                </div>

                {/* 3 Standalone Direct URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 1. Customer Dining Website */}
                  <div className="bg-black/[0.04] p-3.5 rounded-xl border border-black/[0.08] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#141414] flex items-center space-x-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-[#2D4A3E]" />
                          <span>Independent Diner Website</span>
                        </span>
                        <span className="text-[9px] font-bold bg-[#F4511E] text-white px-1.5 py-0.2 rounded">
                          Customer Facing
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A7A7A] mt-1">
                        Zero Menuz master nav. Full table ordering, AI head chef bot, and live review wheel.
                      </p>
                      <code className="text-[10px] text-[#6E6E6E] font-mono block bg-[#FFFFFF] px-2 py-1 rounded border border-black/[0.08] mt-1.5 truncate">
                        {customerFullUrl}
                      </code>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <a
                        href={customerFullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-3 py-1.5 bg-[#F4511E] hover:bg-[#F4511E] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Customer Site</span>
                      </a>
                      <button
                        onClick={() => handleCopy(customerFullUrl)}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-black/[0.04] text-[#6E6E6E] text-xs font-semibold rounded-lg border border-black/[0.08] transition-colors flex items-center space-x-1"
                        title="Copy direct Diner URL"
                      >
                        {copiedLink === customerFullUrl ? (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-green-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#7A7A7A]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2. Manager Operations Hub */}
                  <div className="bg-black/[0.04] p-3.5 rounded-xl border border-black/[0.08] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#141414] flex items-center space-x-1.5">
                          <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                          <span>Manager Operations Hub</span>
                        </span>
                        <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          Staff / Owner
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A7A7A] mt-1">
                        Table floor plan, POS bridge status, KOT orders, live revenue and challenge controls.
                      </p>
                      <code className="text-[10px] text-[#6E6E6E] font-mono block bg-[#FFFFFF] px-2 py-1 rounded border border-black/[0.08] mt-1.5 truncate">
                        {managerFullUrl}
                      </code>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <a
                        href={managerFullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F5F1E8] text-[#141414] text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Manager Hub</span>
                      </a>
                      <button
                        onClick={() => handleCopy(managerFullUrl)}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-black/[0.04] text-[#6E6E6E] text-xs font-semibold rounded-lg border border-black/[0.08] transition-colors flex items-center space-x-1"
                        title="Copy direct Manager URL"
                      >
                        {copiedLink === managerFullUrl ? (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-green-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#7A7A7A]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Domain White-label line */}
                <div className="bg-[#FFFFFF] text-[#6E6E6E] px-3.5 py-2.5 rounded-xl text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>
                      Custom Domain CNAME: <strong className="text-[#141414] font-mono">{customDomain}</strong> → <strong className="text-[#2D4A3E] font-mono">cname.menuz.co</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-[#2F7A4F] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Auto SSL Active</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
