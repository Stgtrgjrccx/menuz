import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRestaurantStore, WhatsAppCampaign } from '../store/restaurantStore';
import { Restaurant, PosSyncEvent } from '../types';
import { searchPuneRestaurants, PuneRestaurantEntry } from '../data/puneRestaurantDirectory';
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
  ChevronLeft,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  Phone,
  ArrowLeft,
  Utensils,
  Zap,
  Globe,
  ChefHat,
  QrCode
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const MasterAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // ── Review drill-down state ────────────────────────────────
  const [selectedReviewRestaurant, setSelectedReviewRestaurant] = useState<string | null>(null);
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | 'all'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  // ── Modals state ───────────────────────────────────────────
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isImageAssignModalOpen, setIsImageAssignModalOpen] = useState(false);
  const [selectedImageForAssign, setSelectedImageForAssign] = useState<string>('');
  const [targetMenuItemId, setTargetMenuItemId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // ── Onboarding form state ──────────────────────────────────
  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestLocation, setNewRestLocation] = useState('');
  const [newRestAddress, setNewRestAddress] = useState('');
  const [newRestOwner, setNewRestOwner] = useState('');
  const [newRestEmail, setNewRestEmail] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('');
  const [newRestPos, setNewRestPos] = useState<'toast' | 'clover' | 'square' | 'universal_api'>('universal_api');
  const [newRestColor, setNewRestColor] = useState('#E85D04');

  // ── Autocomplete state ─────────────────────────────────────
  const [autocompleteQuery, setAutocompleteQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<PuneRestaurantEntry[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedFromDirectory, setSelectedFromDirectory] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // ── Campaign form state ────────────────────────────────────
  const [campaignName, setCampaignName] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignTargetRest, setCampaignTargetRest] = useState<string>('all');

  // ── Click outside autocomplete to close ────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Autocomplete search logic ──────────────────────────────
  useEffect(() => {
    if (autocompleteQuery.length >= 2 && !selectedFromDirectory) {
      const results = searchPuneRestaurants(autocompleteQuery);
      setAutocompleteResults(results);
      setShowAutocomplete(results.length > 0);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  }, [autocompleteQuery, selectedFromDirectory]);

  // ── Overall statistics ─────────────────────────────────────
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.status === 'active').length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '-';
  const whatsappOptInCount = reviews.filter((r) => r.whatsapp_opt_in).length;

  // ── Restaurant filtering and search state ───────────────────
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [visibleCount, setVisibleCount] = useState(24);

  const neighborhoods = useMemo(() => {
    return [
      'all',
      'Koregaon Park',
      'Shivajinagar',
      'Camp',
      'Baner',
      'Kothrud',
      'Viman Nagar',
      'Hinjewadi',
      'Wakad',
      'Aundh',
      'Hadapsar'
    ];
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const q = restaurantSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        (r.location && r.location.toLowerCase().includes(q));

      const matchesArea =
        selectedNeighborhood === 'all' ||
        (r.location && r.location.toLowerCase().includes(selectedNeighborhood.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? r.status === 'active' : r.status !== 'active');

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [restaurants, restaurantSearch, selectedNeighborhood, statusFilter]);

  // ── Select from autocomplete ───────────────────────────────
  const handleSelectAutocomplete = (entry: PuneRestaurantEntry) => {
    setSelectedFromDirectory(true);
    setAutocompleteQuery(entry.name);
    setNewRestName(entry.name);
    setNewRestSlug(entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''));
    setNewRestCuisine(entry.cuisine);
    setNewRestLocation(entry.location);
    setNewRestAddress(entry.address);
    setNewRestPhone(entry.phone);
    setNewRestPos(entry.posProvider);
    setShowAutocomplete(false);
  };

  // ── Create restaurant ──────────────────────────────────────
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName || !newRestSlug) return;

    const newRest: Restaurant = {
      id: 'rest-' + newRestSlug + '-' + Math.floor(100 + Math.random() * 900),
      slug: newRestSlug.toLowerCase().trim().replace(/\s+/g, '-'),
      name: newRestName,
      cuisine: newRestCuisine || 'Contemporary Dining',
      location: newRestLocation || 'Pune, India',
      owner_name: newRestOwner || '',
      contact_email: newRestEmail || '',
      contact_phone: newRestPhone || '',
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
    setNewRestAddress('');
    setNewRestOwner('');
    setNewRestEmail('');
    setNewRestPhone('');
    setAutocompleteQuery('');
    setSelectedFromDirectory(false);
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

  // ── Review drill-down filtered reviews ─────────────────────
  const selectedRestForReviews = selectedReviewRestaurant
    ? restaurants.find((r) => r.id === selectedReviewRestaurant)
    : null;
  
  const filteredReviews = reviews.filter((rev) => {
    if (selectedReviewRestaurant && rev.restaurant_id !== selectedReviewRestaurant) return false;
    if (reviewRatingFilter !== 'all' && rev.rating !== reviewRatingFilter) return false;
    if (reviewSearchQuery.trim()) {
      const q = reviewSearchQuery.toLowerCase();
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
                  Pune Ecosystem Control
                </span>
                <span className="flex items-center text-xs text-green-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5" />
                  Live Production
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-white tracking-tight">
                Menuz Master Admin
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-300 mt-1 max-w-2xl">
                Central command centre for Pune partner restaurants. Onboard restaurants, manage reviews, POS sync, challenges, and marketing CRM.
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
                <span className="text-[11px] text-green-400 font-medium">{Object.keys(posConfigs).length > 0 ? '100% online' : 'None yet'}</span>
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
              onClick={() => { setActiveTab('reviews'); setSelectedReviewRestaurant(null); }}
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
        {/* TAB 1: RESTAURANTS DIRECTORY                                               */}
        {/* ========================================================================= */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle">
              <div>
                <h2 className="text-lg font-bold font-serif text-charcoal-900">Partner Restaurant Registry</h2>
                <p className="text-xs text-charcoal-600">
                  {restaurants.length > 0
                    ? 'Manage restaurant accounts, toggle availability, and launch management hubs.'
                    : 'No restaurants onboarded yet. Click "Onboard Restaurant" to get started — just type a name from Pune!'}
                </p>
              </div>
              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Restaurant</span>
              </button>
            </div>

            {/* Empty State */}
            {restaurants.length === 0 && (
              <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                <div className="w-20 h-20 rounded-full bg-saffron-50 mx-auto flex items-center justify-center mb-4 border-2 border-saffron-200">
                  <Building2 className="w-10 h-10 text-saffron-500" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mt-2">Welcome to Menuz — Pune Edition</h3>
                <p className="text-sm text-charcoal-600 mt-2 max-w-md mx-auto">
                  Your restaurant management ecosystem is ready. Start by onboarding your first partner restaurant.
                  Our Pune directory has 50+ restaurants pre-loaded for instant auto-fill.
                </p>
                <button
                  onClick={() => setIsAddRestaurantOpen(true)}
                  className="mt-6 px-6 py-3 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-xl shadow-subtle flex items-center space-x-2 mx-auto transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Onboard Your First Restaurant</span>
                </button>
              </div>
            )}

            {/* Quick Direct-Access Launchpad - Flagship Quick Launch */}
            {restaurants.length > 0 && (
              <div className="bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 border border-charcoal-800 rounded-3xl p-5 text-white shadow-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal-800/80">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400">Flagship Quick Launch</h3>
                      <span className="text-[10px] bg-charcoal-800 text-charcoal-300 px-2 py-0.5 rounded-full border border-charcoal-700">
                        {restaurants.length} Total Registered
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-300 mt-0.5">Instant one-click direct jump to flagship operations or diner experience</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {restaurants.slice(0, 6).map((r) => {
                    const rTables = tables.filter((t) => t.restaurant_id === r.id);
                    const rToken = rTables[0]?.public_token || 'table-token-01';
                    return (
                      <div
                        key={`quick-${r.id}`}
                        className="bg-charcoal-800/90 border border-charcoal-700 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-saffron-500/50 transition-all"
                      >
                        <div
                          onClick={() => {
                            setCurrentRestaurant(r.id);
                            navigate(`/manage/${r.slug}`);
                          }}
                          className="flex items-center space-x-3 cursor-pointer min-w-0 flex-1 group"
                        >
                          <img src={r.logo_url} alt={r.name} className="w-10 h-10 rounded-xl object-cover border border-charcoal-700 flex-shrink-0" />
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white group-hover:text-saffron-400 transition-colors truncate">{r.name}</h4>
                            <span className="text-[10px] text-charcoal-400 block truncate">{r.cuisine}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <Link
                            to={`/manage/${r.slug}`}
                            onClick={() => setCurrentRestaurant(r.id)}
                            className="px-2.5 py-1.5 bg-saffron-600 hover:bg-saffron-500 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-1"
                            title={`Open ${r.name} Management Hub`}
                          >
                            <span>Hub</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                          <Link
                            to={`/r/${r.slug}/menu?t=${rToken}`}
                            onClick={() => setCurrentRestaurant(r.id)}
                            className="px-2.5 py-1.5 bg-charcoal-700 hover:bg-charcoal-600 text-charcoal-200 hover:text-white text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-1 border border-charcoal-600"
                            title={`Open ${r.name} Diner Menu (Table 1)`}
                          >
                            <UtensilsCrossed className="w-3 h-3 text-saffron-400" />
                            <span>Diner</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search, Status, and Neighborhood Filter Control Center */}
            <div className="bg-white rounded-3xl border border-ivory-300 p-5 shadow-subtle space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restaurantSearch}
                    onChange={(e) => {
                      setRestaurantSearch(e.target.value);
                      setVisibleCount(24);
                    }}
                    placeholder={`Search all ${restaurants.length} Pune partner restaurants by name, cuisine, area, or street...`}
                    className="w-full pl-10 pr-8 py-2.5 bg-ivory-50 border border-ivory-300 rounded-2xl text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-saffron-500 focus:bg-white transition-all font-medium"
                  />
                  {restaurantSearch && (
                    <button
                      onClick={() => setRestaurantSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-700 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Filter Toggle */}
                <div className="flex items-center space-x-1.5 bg-ivory-100 p-1 rounded-2xl border border-ivory-300 flex-shrink-0">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setVisibleCount(24);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'all'
                        ? 'bg-charcoal-900 text-white shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    All ({restaurants.length})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('active');
                      setVisibleCount(24);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'active'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    Active ({activeRestaurants})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('inactive');
                      setVisibleCount(24);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'inactive'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    Inactive ({totalRestaurants - activeRestaurants})
                  </button>
                </div>
              </div>

              {/* Neighborhood Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider whitespace-nowrap mr-1">
                  Hubs:
                </span>
                {neighborhoods.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setSelectedNeighborhood(area);
                      setVisibleCount(24);
                    }}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                      selectedNeighborhood === area
                        ? 'bg-saffron-600 text-white shadow-xs'
                        : 'bg-ivory-100 text-charcoal-600 hover:bg-ivory-200 border border-ivory-200'
                    }`}
                  >
                    {area === 'all' ? 'All Locations' : area}
                  </button>
                ))}
              </div>

              {/* Count Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-ivory-200 text-xs text-charcoal-600">
                <span>
                  Showing <strong>{Math.min(visibleCount, filteredRestaurants.length)}</strong> of{' '}
                  <strong>{filteredRestaurants.length}</strong> matching restaurants (
                  <strong>{restaurants.length}</strong> loaded in Pune database)
                </span>
                <div className="flex items-center space-x-3">
                  {visibleCount < filteredRestaurants.length && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="text-saffron-700 hover:underline font-bold"
                    >
                      Load More (+24)
                    </button>
                  )}
                  {visibleCount < filteredRestaurants.length && (
                    <button
                      onClick={() => setVisibleCount(filteredRestaurants.length)}
                      className="text-charcoal-800 hover:text-saffron-700 font-bold underline"
                    >
                      Show All {filteredRestaurants.length}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Empty search state */}
            {filteredRestaurants.length === 0 && (
              <div className="bg-white rounded-3xl border border-ivory-300 p-10 text-center text-charcoal-500 shadow-subtle">
                <Building2 className="w-10 h-10 mx-auto text-charcoal-300 mb-2" />
                <h4 className="font-serif font-bold text-charcoal-900 text-base">No restaurants match your filters</h4>
                <p className="text-xs text-charcoal-500 mt-1 mb-4">
                  No partners found matching "{restaurantSearch || selectedNeighborhood}".
                </p>
                <button
                  onClick={() => {
                    setRestaurantSearch('');
                    setSelectedNeighborhood('all');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-charcoal-900 text-white font-bold text-xs rounded-xl shadow-subtle"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Restaurant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.slice(0, visibleCount).map((rest) => {
                const restTables = tables.filter((t) => t.restaurant_id === rest.id);
                const restItems = menuItems.filter((i) => i.restaurant_id === rest.id);
                const restOrders = orders.filter((o) => o.restaurant_id === rest.id);
                const restReviews = reviews.filter((r) => r.restaurant_id === rest.id);
                const firstTableToken = restTables[0]?.public_token || 'table-token-01';
                const dinerUrl = `/#/r/${rest.slug}/menu?t=${firstTableToken}`;

                return (
                  <div
                    key={rest.id}
                    className="bg-white rounded-3xl border border-ivory-300 p-6 shadow-subtle hover:shadow-float hover:border-saffron-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header - Clickable to open Manage Hub */}
                      <div className="flex items-start justify-between">
                        <div
                          onClick={() => {
                            setCurrentRestaurant(rest.id);
                            navigate(`/manage/${rest.slug}`);
                          }}
                          className="flex items-center space-x-3 cursor-pointer flex-1 mr-2"
                        >
                          <img
                            src={rest.logo_url}
                            alt={rest.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-ivory-300 shadow-sm group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <h3 className="font-bold text-base text-charcoal-900 font-serif leading-tight group-hover:text-saffron-700 transition-colors">
                              {rest.name}
                            </h3>
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
                        {rest.owner_name && (
                          <div className="flex justify-between text-charcoal-700">
                            <span className="text-charcoal-500">Owner:</span>
                            <span className="font-medium">{rest.owner_name}</span>
                          </div>
                        )}
                        {rest.contact_phone && (
                          <div className="flex justify-between text-charcoal-700">
                            <span className="text-charcoal-500">Contact:</span>
                            <span className="font-mono text-[11px]">{rest.contact_phone}</span>
                          </div>
                        )}
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
                            {restReviews.length > 0 ? (restReviews.reduce((s, r) => s + r.rating, 0) / restReviews.length).toFixed(1) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Links & Multi-Button Control */}
                    <div className="mt-5 pt-4 border-t border-ivory-200 flex flex-col space-y-2.5">
                      <Link
                        to={`/r/${rest.slug}/menu?t=${firstTableToken}`}
                        onClick={() => setCurrentRestaurant(rest.id)}
                        className="w-full bg-saffron-50 hover:bg-saffron-100 text-saffron-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-saffron-200 shadow-xs"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5 text-saffron-600" />
                        <span>Launch Diner Menu ({restTables[0]?.label || 'Table 1'})</span>
                        <ExternalLink className="w-3 h-3 text-saffron-500 ml-0.5" />
                      </Link>

                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          to={`/manage/${rest.slug}`}
                          onClick={() => setCurrentRestaurant(rest.id)}
                          className="bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors text-center"
                          title="Manager Hub & Menu Editor"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>

                        <Link
                          to="/kitchen"
                          onClick={() => setCurrentRestaurant(rest.id)}
                          className="bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 border border-ivory-300 transition-colors text-center"
                          title="Kitchen Display System (KDS)"
                        >
                          <ChefHat className="w-3.5 h-3.5 text-saffron-600" />
                          <span>KDS</span>
                        </Link>

                        <Link
                          to="/qr"
                          onClick={() => setCurrentRestaurant(rest.id)}
                          className="bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 border border-ivory-300 transition-colors text-center"
                          title="View & Download Table QR Badges"
                        >
                          <QrCode className="w-3.5 h-3.5 text-charcoal-600" />
                          <span>QRs</span>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-charcoal-500">
                        <span className="truncate max-w-[170px] font-mono text-[10px]">/#/r/{rest.slug}/menu</span>
                        <button
                          onClick={() => copyUrl(window.location.origin + dinerUrl, rest.id)}
                          className="px-2.5 py-1 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 rounded-lg font-medium border border-ivory-200 flex items-center space-x-1 flex-shrink-0 transition-colors"
                          title="Copy Table 1 Menu Link"
                        >
                          {copiedLink === rest.id ? (
                            <>
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-green-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Pagination Controls */}
            {visibleCount < filteredRestaurants.length && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-6 py-3 bg-saffron-600 hover:bg-saffron-700 text-white font-serif text-xs font-bold rounded-2xl shadow-subtle flex items-center space-x-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Load 24 More Restaurants ({filteredRestaurants.length - visibleCount} remaining)</span>
                </button>
                <button
                  onClick={() => setVisibleCount(filteredRestaurants.length)}
                  className="px-5 py-3 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 text-charcoal-800 text-xs font-semibold rounded-2xl transition-colors"
                >
                  Show All {filteredRestaurants.length} Restaurants
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REVIEWS — DRILL-DOWN BY RESTAURANT                                 */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* If no restaurant selected: Show restaurant list for drill-down */}
            {!selectedReviewRestaurant ? (
              <>
                <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle">
                  <h2 className="text-lg font-bold font-serif text-charcoal-900">Customer Reviews Dashboard</h2>
                  <p className="text-xs text-charcoal-600 mt-1">
                    {restaurants.length > 0
                      ? 'Click on a restaurant to view its reviews and customer insights.'
                      : 'No restaurants onboarded yet. Reviews will appear here once you onboard a restaurant.'}
                  </p>
                </div>

                {/* Empty state for reviews */}
                {restaurants.length === 0 && (
                  <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                    <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-4">No Reviews Yet</h3>
                    <p className="text-xs text-charcoal-500 mt-1">Onboard your first restaurant to start collecting reviews.</p>
                  </div>
                )}

                {/* Restaurant cards for drill-down */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {restaurants.map((rest) => {
                    const restReviews = reviews.filter((r) => r.restaurant_id === rest.id);
                    const restAvgRating = restReviews.length > 0
                      ? (restReviews.reduce((s, r) => s + r.rating, 0) / restReviews.length).toFixed(1)
                      : '-';
                    const optIns = restReviews.filter((r) => r.whatsapp_opt_in).length;

                    return (
                      <button
                        key={rest.id}
                        onClick={() => setSelectedReviewRestaurant(rest.id)}
                        className="bg-white rounded-3xl border border-ivory-300 p-6 shadow-subtle hover:shadow-float hover:border-saffron-300 transition-all text-left group"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={rest.logo_url}
                            alt={rest.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-ivory-300"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-charcoal-900 font-serif truncate group-hover:text-saffron-700 transition-colors">{rest.name}</h3>
                            <span className="text-[11px] text-charcoal-500">{rest.location}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-charcoal-300 group-hover:text-saffron-600 transition-colors" />
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="p-2.5 bg-ivory-50 rounded-xl text-center border border-ivory-200">
                            <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Reviews</span>
                            <span className="text-lg font-bold font-mono text-charcoal-900">{restReviews.length}</span>
                          </div>
                          <div className="p-2.5 bg-ivory-50 rounded-xl text-center border border-ivory-200">
                            <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Avg Rating</span>
                            <span className="text-lg font-bold font-mono text-amber-600 flex items-center justify-center">
                              <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                              {restAvgRating}
                            </span>
                          </div>
                          <div className="p-2.5 bg-ivory-50 rounded-xl text-center border border-ivory-200">
                            <span className="text-[10px] text-charcoal-500 block uppercase font-bold">Opt-Ins</span>
                            <span className="text-lg font-bold font-mono text-green-600">{optIns}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ── Restaurant-specific reviews view ─────────────────── */
              <>
                {/* Back button + restaurant header */}
                <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle">
                  <button
                    onClick={() => { setSelectedReviewRestaurant(null); setReviewSearchQuery(''); setReviewRatingFilter('all'); }}
                    className="flex items-center space-x-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-900 mb-3 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Restaurants</span>
                  </button>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedRestForReviews?.logo_url || ''}
                        alt={selectedRestForReviews?.name || ''}
                        className="w-12 h-12 rounded-2xl object-cover border border-ivory-300"
                      />
                      <div>
                        <h2 className="text-lg font-bold font-serif text-charcoal-900">{selectedRestForReviews?.name}</h2>
                        <span className="text-xs text-charcoal-500">{selectedRestForReviews?.location} • {filteredReviews.length} reviews</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search */}
                      <div className="relative min-w-[220px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-charcoal-400" />
                        <input
                          type="text"
                          value={reviewSearchQuery}
                          onChange={(e) => setReviewSearchQuery(e.target.value)}
                          placeholder="Search reviews..."
                          className="w-full bg-ivory-50 border border-ivory-200 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                        />
                      </div>

                      {/* Star Filter */}
                      <select
                        value={reviewRatingFilter}
                        onChange={(e) => setReviewRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="bg-ivory-50 border border-ivory-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600"
                      >
                        <option value="all">All Ratings</option>
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★</option>
                        <option value={3}>3 Stars ★★★</option>
                        <option value={2}>2 Stars ★★</option>
                        <option value={1}>1 Star ★</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Review Cards */}
                {filteredReviews.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                    <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-4">No Reviews Yet</h3>
                    <p className="text-xs text-charcoal-500 mt-1">Reviews from diners will appear here once they submit feedback.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredReviews.map((rev) => {
                      const rest = restaurants.find((r) => r.id === rev.restaurant_id) || restaurants[0];
                      return (
                        <div
                          key={rev.id}
                          className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-float transition-all"
                        >
                          <div>
                            {/* Header with Stars */}
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
                                <span className="text-[11px] text-charcoal-500 font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                              </div>

                              {/* WhatsApp Consent Badge */}
                              {rev.whatsapp_opt_in ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  <span>WhatsApp</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-ivory-100 text-charcoal-500">
                                  No Marketing
                                </span>
                              )}
                            </div>

                            {/* Keywords */}
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

                          {/* Customer Contact */}
                          <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                            <span className="font-mono text-charcoal-600 text-[11px]">
                              {rev.customer_phone || 'No phone recorded'}
                            </span>

                            {rev.whatsapp_opt_in && rest && (
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
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CHALLENGES & VOUCHERS                                               */}
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
                    Enter voucher codes from scratch cards or wheels to validate and redeem.
                  </p>
                </div>

                <form onSubmit={handleRedeemVoucher} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="e.g. WIN-9418"
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

            {/* Challenge + Redemption grid */}
            {challenges.length === 0 && redemptions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                <Trophy className="w-12 h-12 text-charcoal-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-4">No Challenges Configured</h3>
                <p className="text-xs text-charcoal-500 mt-1">Challenges will be created when restaurants set up their review reward programs.</p>
              </div>
            ) : (
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
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-charcoal-600">{c.description}</p>
                          <div className="p-2.5 bg-white rounded-xl border border-ivory-200 flex items-center justify-between text-xs">
                            <span className="text-charcoal-500">Reward:</span>
                            <span className="font-bold text-saffron-800">{c.reward_item_name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-charcoal-900 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Customer Redemption Ledger</span>
                    </h3>
                    <span className="text-xs text-charcoal-500">{redemptions.length} vouchers</span>
                  </div>

                  {redemptions.length === 0 ? (
                    <p className="text-xs text-charcoal-500 text-center py-8">No vouchers issued yet.</p>
                  ) : (
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
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: UNIVERSAL POS INTEGRATION HUB                                      */}
        {/* ========================================================================= */}
        {activeTab === 'pos' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700">Universal Adapter Layer</span>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Two-Way Real-time POS Synchronisation</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  {restaurants.length > 0
                    ? 'Universal adapter integrating Toast, Clover, Square, and restaurant ordering engines.'
                    : 'Connect POS systems once restaurants are onboarded.'}
                </p>
              </div>

              {restaurants.length > 0 && (
                <button
                  onClick={() => {
                    const firstRest = restaurants[0];
                    simulateIncomingPosOrder(firstRest.id);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-subtle flex items-center space-x-1.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Simulate Inbound POS Order</span>
                </button>
              )}
            </div>

            {restaurants.length === 0 ? (
              <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                <RefreshCw className="w-12 h-12 text-charcoal-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-4">No POS Connections</h3>
                <p className="text-xs text-charcoal-500 mt-1">POS integrations will appear here once restaurants are onboarded.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {restaurants.map((rest) => {
                  const config = posConfigs[rest.id] || {
                    restaurant_id: rest.id,
                    provider: rest.pos_provider || 'universal_api',
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

                      <button
                        onClick={() => triggerPosSync(rest.id)}
                        className="w-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-ivory-300 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Trigger Full Catalog Sync</span>
                      </button>

                      {config.sync_log.length > 0 && (
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
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MASTER IMAGE LIBRARY                                                */}
        {/* ========================================================================= */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700">Central Asset Repository</span>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Master Culinary Photography Library</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  {menuItems.length > 0
                    ? 'Audit, replace, or assign photographs to any partner restaurant\'s catalog.'
                    : 'No menu items yet. Add menu items through restaurant management hubs.'}
                </p>
              </div>

              {menuItems.length > 0 && (
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
              )}
            </div>

            {menuItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                <ImageIcon className="w-12 h-12 text-charcoal-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-4">No Images Yet</h3>
                <p className="text-xs text-charcoal-500 mt-1">Menu item photos will appear here once dishes are added to restaurant catalogs.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MARKETING & WHATSAPP CAMPAIGNS                                     */}
        {/* ========================================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-ivory-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-green-700">Consent & Privacy Compliant</span>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 mt-0.5">Customer Marketing & WhatsApp Broadcasting</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Broadcast promotions strictly to diners who provided explicit consent.
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

            {campaigns.length === 0 ? (
              <div className="bg-white rounded-3xl border border-ivory-300 p-12 text-center shadow-subtle">
                <Send className="w-12 h-12 text-charcoal-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mt-4">No Campaigns Yet</h3>
                <p className="text-xs text-charcoal-500 mt-1">Create your first WhatsApp campaign to reach diners who opted in.</p>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ONBOARD PARTNER RESTAURANT — WITH PUNE AUTOCOMPLETE              */}
      {/* ========================================================================= */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-float border border-ivory-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900">Onboard Partner Restaurant</h3>
                <span className="text-[11px] text-saffron-700 font-semibold flex items-center space-x-1 mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Pune Directory — 50+ restaurants pre-loaded</span>
                </span>
              </div>
              <button onClick={() => { setIsAddRestaurantOpen(false); setAutocompleteQuery(''); setSelectedFromDirectory(false); }} className="text-charcoal-400 hover:text-charcoal-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* ── Autocomplete Search ─────────────────────────────── */}
            <div ref={autocompleteRef} className="relative">
              <label className="font-bold text-xs text-charcoal-800 block mb-1.5">
                Search Pune Restaurants
                <span className="font-normal text-charcoal-500 ml-1">(type 2+ characters)</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-charcoal-400" />
                <input
                  type="text"
                  value={autocompleteQuery}
                  onChange={(e) => {
                    setAutocompleteQuery(e.target.value);
                    setSelectedFromDirectory(false);
                  }}
                  placeholder="e.g. Malaka Spice, Vaishali, Barbeque..."
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-saffron-600 focus:ring-2 focus:ring-saffron-200"
                />
              </div>

              {/* Autocomplete dropdown */}
              {showAutocomplete && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ivory-300 rounded-2xl shadow-float max-h-[280px] overflow-y-auto z-[60]">
                  {autocompleteResults.map((entry, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAutocomplete(entry)}
                      className="w-full p-3.5 text-left hover:bg-saffron-50 transition-colors border-b border-ivory-100 last:border-b-0 flex items-start space-x-3"
                    >
                      <img
                        src={entry.imageUrl}
                        alt={entry.name}
                        className="w-10 h-10 rounded-xl object-cover border border-ivory-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-charcoal-900 truncate">{entry.name}</h4>
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold text-charcoal-700">{entry.rating}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-saffron-700 font-medium block truncate">{entry.cuisine}</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-charcoal-400 flex-shrink-0" />
                          <span className="text-[10px] text-charcoal-500 truncate">{entry.location}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-fill indicator */}
            {selectedFromDirectory && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-800 font-semibold">
                  Restaurant details auto-filled from Pune directory. Review and complete the remaining fields.
                </span>
              </div>
            )}

            <form onSubmit={handleCreateRestaurant} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => {
                    setNewRestName(e.target.value);
                    if (!newRestSlug || selectedFromDirectory) {
                      setNewRestSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''));
                    }
                  }}
                  placeholder="e.g. Malaka Spice"
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
                    placeholder="malaka-spice"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 font-mono text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">Cuisine</label>
                  <input
                    type="text"
                    value={newRestCuisine}
                    onChange={(e) => setNewRestCuisine(e.target.value)}
                    placeholder="Pan-Asian, Thai"
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
                  placeholder="Koregaon Park, Pune"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Full Address</label>
                <input
                  type="text"
                  value={newRestAddress}
                  onChange={(e) => setNewRestAddress(e.target.value)}
                  placeholder="Lane No. 5, North Main Road, Koregaon Park, Pune 411001"
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
                    placeholder="To be filled by owner"
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

              <div>
                <label className="font-bold text-charcoal-800 block mb-1">Contact Email</label>
                <input
                  type="email"
                  value={newRestEmail}
                  onChange={(e) => setNewRestEmail(e.target.value)}
                  placeholder="contact@restaurant.in"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal-800 block mb-1">POS Integration</label>
                  <select
                    value={newRestPos}
                    onChange={(e) => setNewRestPos(e.target.value as any)}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-saffron-600"
                  >
                    <option value="universal_api">Universal API Adapter</option>
                    <option value="toast">Toast POS</option>
                    <option value="clover">Clover</option>
                    <option value="square">Square</option>
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
                  onClick={() => { setIsAddRestaurantOpen(false); setAutocompleteQuery(''); setSelectedFromDirectory(false); }}
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
                  placeholder="Namaste {{name}}! We are featuring an exclusive chef special tasting this Thursday..."
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-charcoal-900 focus:outline-none focus:border-green-600 leading-relaxed font-sans"
                />
                <span className="text-[10px] text-charcoal-500 block mt-1">Tip: Use <code>{'{{name}}'}</code> for personal greetings.</span>
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
      {/* MODAL 3: ASSIGN IMAGE TO DISH                                              */}
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
