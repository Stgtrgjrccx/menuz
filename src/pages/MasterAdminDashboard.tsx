import React, { useState } from 'react';
import { useRestaurantStore, WhatsAppCampaign } from '../store/restaurantStore';
import { Restaurant, PosSyncEvent } from '../types';
import {
  Building2,
  Users,
  UtensilsCrossed,
  Star,
  MessageSquare,
  Trophy,
  Share2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MasterAdminDashboard: React.FC = () => {
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const toggleRestaurantStatus = useRestaurantStore((state) => state.toggleRestaurantStatus);
  const tables = useRestaurantStore((state) => state.tables);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const orders = useRestaurantStore((state) => state.orders);
  const reviews = useRestaurantStore((state) => state.reviews);
  const challenges = useRestaurantStore((state) => state.challenges);
  const redemptions = useRestaurantStore((state) => state.redemptions);
  const redeemVoucher = useRestaurantStore((state) => state.redeemVoucher);
  const posConfigs = useRestaurantStore((state) => state.posConfigs);
  const triggerPosSync = useRestaurantStore((state) => state.triggerPosSync);
  const simulateIncomingPosOrder = useRestaurantStore((state) => state.simulateIncomingPosOrder);
  const campaigns = useRestaurantStore((state) => state.campaigns);
  const sendWhatsAppCampaign = useRestaurantStore((state) => state.sendWhatsAppCampaign);
  const assignImageToItem = useRestaurantStore((state) => state.assignImageToItem);

  const [activeTab, setActiveTab] = useState<'restaurants' | 'reviews' | 'challenges' | 'pos' | 'images' | 'marketing'>('restaurants');
  const [restaurantFilter, setRestaurantFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isImageAssignModalOpen, setIsImageAssignModalOpen] = useState(false);
  const [selectedImageForAssign, setSelectedImageForAssign] = useState<string>('');
  const [targetMenuItemId, setTargetMenuItemId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // New restaurant form state
  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestLocation, setNewRestLocation] = useState('');
  const [newRestOwner, setNewRestOwner] = useState('');
  const [newRestEmail, setNewRestEmail] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('');
  const [newRestPos, setNewRestPos] = useState<'toast' | 'clover' | 'square' | 'universal_api'>('toast');
  const [newRestColor, setNewRestColor] = useState('#E85D04');

  // Campaign form state
  const [campaignName, setCampaignName] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignTargetRest, setCampaignTargetRest] = useState<string>('all');

  // Overall statistics
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.status === 'active').length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';
  const whatsappOptInCount = reviews.filter((r) => r.whatsapp_opt_in).length;

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName || !newRestSlug) return;

    const newRest: Restaurant = {
      id: 'rest-' + newRestSlug + '-' + Math.floor(100 + Math.random() * 900),
      slug: newRestSlug.toLowerCase().trim().replace(/\s+/g, '-'),
      name: newRestName,
      cuisine: newRestCuisine || 'Contemporary Dining',
      location: newRestLocation || 'Mumbai, India',
      owner_name: newRestOwner || 'Restaurant Owner',
      contact_email: newRestEmail || `admin@${newRestSlug}.com`,
      contact_phone: newRestPhone || '+91 98000 00000',
      status: 'active',
      logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
      brand_colors: {
        primary: newRestColor,
        background: '#FDFBF7',
        text: '#1C1917',
        accent: newRestColor
      },
      currency: 'INR',
      tax_rate_percent: 5.0,
      ordering_enabled: true,
      google_place_url: 'https://maps.google.com',
      authentic_photography_statement: 'Every dish photograph represents the true culinary creations of our kitchen.',
      pos_provider: newRestPos
    };

    addRestaurant(newRest);
    setIsAddRestaurantOpen(false);
    // Reset form
    setNewRestName('');
    setNewRestSlug('');
    setNewRestCuisine('');
    setNewRestLocation('');
    setNewRestOwner('');
    setNewRestEmail('');
    setNewRestPhone('');
  };

  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const ok = redeemVoucher(voucherInput.trim());
    if (ok) {
      setVoucherMessage({ text: `Voucher ${voucherInput.trim().toUpperCase()} redeemed successfully!`, type: 'success' });
      setVoucherInput('');
    } else {
      setVoucherMessage({ text: `Voucher "${voucherInput}" not found or already redeemed.`, type: 'error' });
    }
    setTimeout(() => setVoucherMessage(null), 4000);
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || !campaignMessage) return;

    const optInRecipients = reviews.filter((r) =>
      r.whatsapp_opt_in && (campaignTargetRest === 'all' || r.restaurant_id === campaignTargetRest)
    );

    sendWhatsAppCampaign({
      campaign_name: campaignName,
      message_template: campaignMessage,
      target_restaurant_id: campaignTargetRest === 'all' ? undefined : campaignTargetRest,
      recipients_count: Math.max(optInRecipients.length, 1),
      status: 'sent'
    });

    setIsCampaignModalOpen(false);
    setCampaignName('');
    setCampaignMessage('');
  };

  const copyUrl = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((rev) => {
    if (restaurantFilter !== 'all' && rev.restaurant_id !== restaurantFilter) return false;
    if (ratingFilter !== 'all' && rev.rating !== ratingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rev.customer_name.toLowerCase().includes(q);
      const matchText = rev.review_text.toLowerCase().includes(q);
      const matchKeyword = rev.selected_keywords.some((k) => k.toLowerCase().includes(q));
      if (!matchName && !matchText && !matchKeyword) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ivory-100/60 pb-24 text-charcoal-900">
      {/* Top Banner: Master Control Center */}
      <div className="bg-charcoal-900 text-white border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-saffron-500/20 text-saffron-400 border border-saffron-500/30">
                  Global Ecosystem Control
                </span>
                <span className="flex items-center text-xs text-green-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5" />
                  Real-time Cascade Active
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-white tracking-tight">
                Menuz Master Admin
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-300 mt-1 max-w-2xl">
                Central command centre orchestrating partner restaurants, 2-way POS synchronization, verified customer reviews, review-locked reward challenges, and marketing CRM.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Restaurant</span>
              </button>
              <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp Campaign</span>
              </button>
            </div>
          </div>

          {/* Metric Overview Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-8">
            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
              <span className="text-[11px] text-charcoal-400 block font-medium">Partner Restaurants</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-white font-mono">{totalRestaurants}</span>
                <span className="text-[11px] text-green-400 font-medium">({activeRestaurants} active)</span>
              </div>
            </div>

            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
              <span className="text-[11px] text-charcoal-400 block font-medium">Catalog Items</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-white font-mono">{menuItems.length}</span>
                <span className="text-[11px] text-charcoal-400">across {tables.length} tables</span>
              </div>
            </div>

            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
              <span className="text-[11px] text-charcoal-400 block font-medium">Total Orders</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-white font-mono">{totalOrders}</span>
                <span className="text-[11px] text-saffron-400">₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
              <span className="text-[11px] text-charcoal-400 block font-medium">Average Rating</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-amber-400 font-mono flex items-center">
                  <Star className="w-4 h-4 fill-amber-400 inline mr-1" />
                  {avgRating}
                </span>
                <span className="text-[11px] text-charcoal-400">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
              <span className="text-[11px] text-charcoal-400 block font-medium">WhatsApp Opt-Ins</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-green-400 font-mono">{whatsappOptInCount}</span>
                <span className="text-[11px] text-charcoal-400">compliant</span>
              </div>
            </div>

            <div className="bg-charcoal-800/80 p-3.5 rounded-2xl border border-charcoal-700">
              <span className="text-[11px] text-charcoal-400 block font-medium">Connected POS</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-bold text-blue-400 font-mono">
                  {Object.keys(posConfigs).length}
                </span>
                <span className="text-[11px] text-green-400 font-medium">100% online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-ivory-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-3 no-scrollbar">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === 'restaurants'
                  ? 'bg-saffron-600 text-white shadow-subtle'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Partner Restaurants ({restaurants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === 'reviews'
                  ? 'bg-saffron-600 text-white shadow-subtle'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reviews & Customer CRM ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === 'challenges'
                  ? 'bg-saffron-600 text-white shadow-subtle'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Challenges & Rewards ({challenges.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === 'pos'
                  ? 'bg-saffron-600 text-white shadow-subtle'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Universal POS Bridge</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === 'images'
                  ? 'bg-saffron-600 text-white shadow-subtle'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Master Image Library</span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeTab === 'marketing'
                  ? 'bg-saffron-600 text-white shadow-subtle'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Marketing & Campaigns ({campaigns.length})</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: RESTAURANTS DIRECTORY (Phases 7 & 8)                               */}
        {/* ========================================================================= */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle">
              <div>
                <h2 className="text-lg font-bold font-serif text-charcoal-900">Partner Restaurant Registry</h2>
                <p className="text-xs text-charcoal-600">
                  Manage restaurant accounts, toggle live availability, review operational metrics, and launch management hubs.
                </p>
              </div>
              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Partner Restaurant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((rest) => {
                const restTables = tables.filter((t) => t.restaurant_id === rest.id);
                const restItems = menuItems.filter((i) => i.restaurant_id === rest.id);
                const restOrders = orders.filter((o) => o.restaurant_id === rest.id);
                const restReviews = reviews.filter((r) => r.restaurant_id === rest.id);
                const firstTableToken = restTables[0]?.public_token || 'table-token-01-saffron';
                const dinerUrl = `/#/r/${rest.slug}/menu?t=${firstTableToken}`;

                return (
                  <div
                    key={rest.id}
                    className="bg-white rounded-3xl border border-ivory-300 p-6 shadow-subtle hover:shadow-float transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rest.logo_url}
                            alt={rest.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-ivory-300 shadow-sm"
                          />
                          <div>
                            <h3 className="font-bold text-base text-charcoal-900 font-serif leading-tight">{rest.name}</h3>
                            <span className="text-xs text-saffron-700 font-medium block">{rest.cuisine}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleRestaurantStatus(rest.id)}
                          title="Click to toggle restaurant active/inactive"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors ${
                            rest.status === 'active'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${rest.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
                          <span>{rest.status}</span>
                        </button>
                      </div>

                      {/* Location & Contact */}
                      <div className="mt-4 p-3 bg-ivory-50 rounded-2xl border border-ivory-200 text-xs space-y-1">
                        <div className="flex justify-between text-charcoal-700">
                          <span className="text-charcoal-500">Location:</span>
                          <span className="font-medium text-right">{rest.location}</span>
                        </div>
                        <div className="flex justify-between text-charcoal-700">
                          <span className="text-charcoal-500">Owner:</span>
                          <span className="font-medium">{rest.owner_name}</span>
                        </div>
                        <div className="flex justify-between text-charcoal-700">
                          <span className="text-charcoal-500">Contact:</span>
                          <span className="font-mono text-[11px]">{rest.contact_phone}</span>
                        </div>
                        <div className="flex justify-between text-charcoal-700">
                          <span className="text-charcoal-500">POS Integration:</span>
                          <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {rest.pos_provider}
                          </span>
                        </div>
                      </div>

                      {/* Metrics row */}
                      <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                        <div className="p-2 bg-ivory-100/60 rounded-xl">
                          <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Tables</span>
                          <span className="text-sm font-bold font-mono text-charcoal-900">{restTables.length}</span>
                        </div>
                        <div className="p-2 bg-ivory-100/60 rounded-xl">
                          <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Dishes</span>
                          <span className="text-sm font-bold font-mono text-charcoal-900">{restItems.length}</span>
                        </div>
                        <div className="p-2 bg-ivory-100/60 rounded-xl">
                          <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Orders</span>
                          <span className="text-sm font-bold font-mono text-charcoal-900">{restOrders.length}</span>
                        </div>
                        <div className="p-2 bg-ivory-100/60 rounded-xl">
                          <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Rating</span>
                          <span className="text-sm font-bold font-mono text-amber-600 flex items-center justify-center">
                            <Star className="w-3 h-3 fill-amber-500 inline mr-0.5" />
                            {restReviews.length > 0 ? (restReviews.reduce((s, r) => s + r.rating, 0) / restReviews.length).toFixed(1) : '5.0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="mt-5 pt-4 border-t border-ivory-200 flex flex-col space-y-2">
                      <Link
                        to={`/r/${rest.slug}/menu?t=${firstTableToken}`}
                        target="_blank"
                        className="w-full bg-saffron-50 hover:bg-saffron-100 text-saffron-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-saffron-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch Diner Menu ({restTables[0]?.label || 'Table 1'})</span>
                      </Link>

                      <div className="flex space-x-2">
                        <Link
                          to={`/manage/${rest.slug}`}
                          className="flex-1 bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors text-center"
                        >
                          <span>Manage Hub</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => copyUrl(window.location.origin + dinerUrl, rest.id)}
                          className="px-3 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 py-2 rounded-xl text-xs font-semibold border border-ivory-300 flex items-center space-x-1"
                          title="Copy Table 1 Menu Link"
                        >
                          {copiedLink === rest.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REVIEWS & CUSTOMER CRM (Phases 9 & 10)                             */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-charcoal-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by diner name, text or keywords..."
                    className="w-full bg-ivory-50 border border-ivory-200 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>

                {/* Restaurant Filter */}
                <select
                  value={restaurantFilter}
                  onChange={(e) => setRestaurantFilter(e.target.value)}
                  className="bg-ivory-50 border border-ivory-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                >
                  <option value="all">All Restaurants</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>

                {/* Star Filter */}
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-ivory-50 border border-ivory-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                >
                  <option value="all">All Ratings (1 - 5 ★)</option>
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★</option>
                  <option value={3}>3 Stars ★★★</option>
                </select>
              </div>

              <div className="text-xs text-charcoal-600 font-medium">
                Showing <strong className="text-charcoal-900">{filteredReviews.length}</strong> verified customer reviews
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReviews.map((rev) => {
                const rest = restaurants.find((r) => r.id === rev.restaurant_id) || restaurants[0];
                return (
                  <div
                    key={rev.id}
                    className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-float transition-all"
                  >
                    <div>
                      {/* Header with Stars and Restaurant */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-ivory-200 text-ivory-300'
                                }`}
                              />
                            ))}
                          </div>
                          <h4 className="font-bold text-sm text-charcoal-900 mt-1">{rev.customer_name}</h4>
                          <span className="text-[11px] text-charcoal-500 font-medium">{rest.name} • {new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* WhatsApp Consent Badge */}
                        {rev.whatsapp_opt_in ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span>WhatsApp Opt-in</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-ivory-100 text-charcoal-500">
                            No Marketing
                          </span>
                        )}
                      </div>

                      {/* Keywords Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {rev.selected_keywords.map((kw) => (
                          <span
                            key={kw}
                            className="px-2 py-0.5 bg-saffron-50 text-saffron-800 border border-saffron-200 rounded-lg text-[10px] font-semibold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-xs text-charcoal-700 mt-3 leading-relaxed bg-ivory-50 p-3 rounded-2xl border border-ivory-200 italic">
                        "{rev.review_text}"
                      </p>
                    </div>

                    {/* Customer Contact & 1-Click Action */}
                    <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                      <span className="font-mono text-charcoal-600 text-[11px]">
                        {rev.customer_phone || 'No phone recorded'}
                      </span>

                      {rev.whatsapp_opt_in && (
                        <button
                          onClick={() => {
                            setCampaignTargetRest(rev.restaurant_id);
                            setCampaignName(`VIP Perk for ${rev.customer_name}`);
                            setCampaignMessage(`Hello ${rev.customer_name}! Thank you for your review of ${rest.name}. We'd love to treat you with a special surprise on your next table!`);
                            setIsCampaignModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl text-[11px] font-bold border border-green-200 flex items-center space-x-1 transition-colors"
                        >
                          <Send className="w-3 h-3 text-green-600" />
                          <span>Message</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CHALLENGES & VOUCHERS (Phases 15–21)                               */}
        {/* ========================================================================= */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Quick Voucher Validator Card */}
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700">Staff Redemption Center</span>
                  <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Verify Customer Challenge Voucher</h3>
                  <p className="text-xs text-charcoal-600 mt-0.5">
                    When a diner presents a winning scratch card or wheel voucher code, enter it below to validate and mark redeemed.
                  </p>
                </div>

                <form onSubmit={handleRedeemVoucher} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="e.g. SAFFRON-WIN-9418"
                    className="bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-charcoal-900 uppercase focus:outline-none focus:border-saffron-600 min-w-[200px]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle"
                  >
                    Redeem
                  </button>
                </form>
              </div>

              {voucherMessage && (
                <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  voucherMessage.type === 'success' ? 'bg-green-100 text-green-900 border border-green-200' : 'bg-red-100 text-red-900 border border-red-200'
                }`}>
                  {voucherMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>{voucherMessage.text}</span>
                </div>
              )}
            </div>

            {/* Active Challenge Configs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-serif text-charcoal-900 flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-saffron-600" />
                    <span>Configured Review Challenges</span>
                  </h3>
                  <span className="text-xs text-charcoal-500">{challenges.length} active</span>
                </div>

                <div className="space-y-3">
                  {challenges.map((c) => {
                    const rest = restaurants.find((r) => r.id === c.restaurant_id);
                    return (
                      <div key={c.id} className="p-4 bg-ivory-50 rounded-2xl border border-ivory-200 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700">{rest?.name || 'All'}</span>
                            <h4 className="font-bold text-sm text-charcoal-900">{c.title}</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
                            100% Win Rate
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-600">{c.description}</p>
                        <div className="p-2.5 bg-white rounded-xl border border-ivory-200 flex items-center justify-between text-xs">
                          <span className="text-charcoal-500">Reward:</span>
                          <span className="font-bold text-saffron-800">{c.reward_item_name}</span>
                        </div>
                        <span className="text-[10px] text-charcoal-400 block italic">Terms: {c.terms}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Redemption Ledger */}
              <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-serif text-charcoal-900 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Customer Redemption Ledger</span>
                  </h3>
                  <span className="text-xs text-charcoal-500">{redemptions.length} vouchers</span>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {redemptions.map((red) => (
                    <div
                      key={red.id}
                      className="p-3.5 bg-ivory-50 rounded-2xl border border-ivory-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-charcoal-900 text-sm tracking-wide">{red.voucher_code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            red.status === 'redeemed'
                              ? 'bg-charcoal-100 text-charcoal-700'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {red.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-charcoal-600 block mt-0.5">
                          {red.customer_name} • {red.reward_item_name}
                        </span>
                      </div>

                      {red.status === 'unclaimed' && (
                        <button
                          onClick={() => {
                            redeemVoucher(red.voucher_code);
                            setVoucherMessage({ text: `Voucher ${red.voucher_code} redeemed!`, type: 'success' });
                            setTimeout(() => setVoucherMessage(null), 3000);
                          }}
                          className="px-3 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Mark Used
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: UNIVERSAL POS INTEGRATION HUB (Phases 4, 5, 27)                    */}
        {/* ========================================================================= */}
        {activeTab === 'pos' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700">Universal Adapter Layer</span>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Two-Way Real-time POS Synchronisation</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Universal adapter integrating Toast, Clover, Square, and restaurant ordering engines. Orders sync bidirectionally with automatic source tagging.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const firstRest = restaurants[0];
                    simulateIncomingPosOrder(firstRest.id);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Simulate Inbound POS Floor Order</span>
                </button>
              </div>
            </div>

            {/* POS Cards for Each Restaurant */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurants.map((rest) => {
                const config = posConfigs[rest.id] || {
                  restaurant_id: rest.id,
                  provider: rest.pos_provider || 'toast',
                  connection_status: 'connected',
                  last_sync_time: new Date().toISOString(),
                  auto_sync_orders: true,
                  sync_latency_ms: 125,
                  sync_log: []
                };

                return (
                  <div key={rest.id} className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-saffron-700 tracking-wider">{rest.name}</span>
                        <h4 className="text-base font-bold text-charcoal-900 capitalize flex items-center space-x-1.5 mt-0.5">
                          <span>{config.provider.replace('_', ' ')} POS Bridge</span>
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-300 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                        <span>Connected</span>
                      </span>
                    </div>

                    <div className="p-3 bg-ivory-50 rounded-2xl border border-ivory-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Latency:</span>
                        <span className="font-mono font-bold text-green-700">{config.sync_latency_ms} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Auto Sync:</span>
                        <span className="font-bold text-charcoal-800">Enabled (Bidirectional)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-500">Last Ping:</span>
                        <span className="font-mono text-[11px] text-charcoal-600">{new Date(config.last_sync_time).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => triggerPosSync(rest.id)}
                      className="w-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-ivory-300 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Trigger Full Catalog Sync</span>
                    </button>

                    {/* Log feed */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1.5">Recent Sync Stream</span>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto text-[11px] font-mono">
                        {config.sync_log.map((log) => (
                          <div key={log.id} className="p-2 bg-ivory-100/70 rounded-xl border border-ivory-200">
                            <div className="flex justify-between text-charcoal-500 text-[10px]">
                              <span>{log.event}</span>
                              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <span className="text-charcoal-800 truncate block mt-0.5">{log.details}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MASTER IMAGE LIBRARY (Phase 14)                                    */}
        {/* ========================================================================= */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700">Central Asset Repository</span>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Master Culinary Photography Library</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  High-resolution food and drink imagery. Audit, replace, or assign photographs to any partner restaurant's catalog in real time.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedImageForAssign('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop');
                  setIsImageAssignModalOpen(true);
                }}
                className="px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-colors self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Image to Dish</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-ivory-300 overflow-hidden shadow-subtle group hover:shadow-float transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-ivory-200">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-charcoal-900/80 text-white backdrop-blur-sm">
                      {item.item_type}
                    </span>
                  </div>

                  <div className="p-3">
                    <h5 className="font-bold text-xs text-charcoal-900 truncate" title={item.name}>{item.name}</h5>
                    <span className="text-[10px] text-saffron-700 font-semibold block mt-0.5">₹{item.price.toFixed(2)}</span>

                    <button
                      onClick={() => {
                        setSelectedImageForAssign(item.image_url);
                        setTargetMenuItemId(item.id);
                        setIsImageAssignModalOpen(true);
                      }}
                      className="w-full mt-2.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 text-[10px] font-bold py-1.5 rounded-lg border border-ivory-200 transition-colors"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MARKETING & WHATSAPP CAMPAIGNS (Phase 22)                          */}
        {/* ========================================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-green-700">Consent & Privacy Compliant</span>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Customer Marketing & WhatsApp Broadcasting</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Broadcast promotions and announcements strictly to diners who provided explicit consent during the review experience.
                </p>
              </div>

              <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-colors self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {/* Campaign History Table */}
            <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-subtle">
              <div className="p-5 border-b border-ivory-200 flex items-center justify-between">
                <h4 className="font-bold text-sm text-charcoal-900 font-serif">Broadcast Campaign History</h4>
                <span className="text-xs text-charcoal-500 font-medium">{campaigns.length} campaigns executed</span>
              </div>

              <div className="divide-y divide-ivory-200">
                {campaigns.map((camp) => {
                  const targetRest = restaurants.find((r) => r.id === camp.target_restaurant_id);
                  return (
                    <div key={camp.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-ivory-50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-sm text-charcoal-900">{camp.campaign_name}</h5>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 uppercase">
                            {camp.status}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-600 font-mono bg-ivory-100 p-2.5 rounded-xl border border-ivory-200 max-w-2xl">
                          "{camp.message_template}"
                        </p>
                        <span className="text-[11px] text-charcoal-500 block">
                          Target: <strong>{targetRest?.name || 'All Opt-In Diners'}</strong> • Sent on {new Date(camp.sent_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-sm font-bold text-green-700 font-mono block">
                          {camp.recipients_count} Diners
                        </span>
                        <span className="text-[10px] text-charcoal-400">Delivered</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD PARTNER RESTAURANT                                           */}
      {/* ========================================================================= */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-float border border-ivory-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Onboard Partner Restaurant</h3>
              <button onClick={() => setIsAddRestaurantOpen(false)} className="text-charcoal-400 hover:text-charcoal-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => {
                    setNewRestName(e.target.value);
                    if (!newRestSlug) {
                      setNewRestSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Bombay Canteen"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={newRestSlug}
                    onChange={(e) => setNewRestSlug(e.target.value)}
                    placeholder="bombay-canteen"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 font-mono text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">Cuisine</label>
                  <input
                    type="text"
                    value={newRestCuisine}
                    onChange={(e) => setNewRestCuisine(e.target.value)}
                    placeholder="Modern Indian"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Location & City</label>
                <input
                  type="text"
                  value={newRestLocation}
                  onChange={(e) => setNewRestLocation(e.target.value)}
                  placeholder="Lower Parel, Mumbai"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={newRestOwner}
                    onChange={(e) => setNewRestOwner(e.target.value)}
                    placeholder="Sameer Seth"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newRestPhone}
                    onChange={(e) => setNewRestPhone(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">POS Integration</label>
                  <select
                    value={newRestPos}
                    onChange={(e) => setNewRestPos(e.target.value as any)}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  >
                    <option value="toast">Toast POS</option>
                    <option value="clover">Clover</option>
                    <option value="square">Square</option>
                    <option value="universal_api">Universal API Adapter</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">Brand Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newRestColor}
                      onChange={(e) => setNewRestColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-ivory-300 cursor-pointer"
                    />
                    <span className="font-mono text-xs">{newRestColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantOpen(false)}
                  className="px-4 py-2 bg-ivory-200 text-charcoal-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl font-bold shadow-subtle"
                >
                  Create & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WHATSAPP CAMPAIGN COMPOSER                                       */}
      {/* ========================================================================= */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-float border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900">Broadcast WhatsApp Campaign</h3>
                <span className="text-[11px] text-green-700 font-semibold flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Only diners with explicit WhatsApp consent are messaged</span>
                </span>
              </div>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Midweek Chef's Special Invitation"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Target Diner Audience</label>
                <select
                  value={campaignTargetRest}
                  onChange={(e) => setCampaignTargetRest(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-green-600"
                >
                  <option value="all">All Verified Opt-In Reviewers ({whatsappOptInCount} recipients)</option>
                  {restaurants.map((r) => {
                    const count = reviews.filter((rev) => rev.restaurant_id === r.id && rev.whatsapp_opt_in).length;
                    return (
                      <option key={r.id} value={r.id}>
                        {r.name} Diners ({count} opt-ins)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Namaste {{name}}! We are featuring an exclusive chef special tasting this Thursday. Reserve your table early to enjoy a complimentary beverage."
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-green-600 leading-relaxed font-sans"
                />
                <span className="text-[10px] text-charcoal-500 block mt-1">Tip: Use variables like <code>&#123;&#123;name&#125;&#125;</code> for personal greetings.</span>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 bg-ivory-200 text-charcoal-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold shadow-subtle flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN IMAGE TO DISH (Phase 14)                                  */}
      {/* ========================================================================= */}
      {isImageAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-float border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Assign Photograph to Dish</h3>
              <button onClick={() => setIsImageAssignModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Image Preview</label>
                <img
                  src={selectedImageForAssign}
                  alt="Selected"
                  className="w-full h-40 rounded-2xl object-cover border border-ivory-300"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Target Menu Item</label>
                <select
                  value={targetMenuItemId}
                  onChange={(e) => setTargetMenuItemId(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                >
                  <option value="">Select dish to assign...</option>
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (₹{item.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsImageAssignModalOpen(false)}
                  className="px-4 py-2 bg-ivory-200 text-charcoal-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetMenuItemId}
                  onClick={() => {
                    if (targetMenuItemId) {
                      assignImageToItem(targetMenuItemId, selectedImageForAssign);
                      setIsImageAssignModalOpen(false);
                    }
                  }}
                  className="px-5 py-2 bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-subtle"
                >
                  Apply & Synchronize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
