import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRestaurantStore, isDishNameAsRestaurant, WhatsAppCampaign } from '../store/restaurantStore';
import { Restaurant, PosSyncEvent, isWorkingWithMenuz, PetpoojaConfig, RoyalPosConfig, RecahoConfig, RancelabConfig, MODERN_POS_PROVIDERS } from '../types';
import { SEED_RESTAURANTS } from '../data/seedData';
import { PUNE_RESTAURANT_DIRECTORY, searchPuneRestaurants, PuneRestaurantEntry, normalizePuneSearch, matchesPuneQuery } from '../data/puneRestaurantDirectory';
import { PetpoojaIntegrationPanel } from '../components/PetpoojaIntegrationPanel';
import { RoyalPosIntegrationPanel } from '../components/RoyalPosIntegrationPanel';
import { RecahoIntegrationPanel } from '../components/RecahoIntegrationPanel';
import { RancelabIntegrationPanel } from '../components/RancelabIntegrationPanel';
import { TableManagementModal } from '../components/TableManagementModal';
import { RestaurantLaunchKitModal } from '../components/RestaurantLaunchKitModal';
import { MasterImageLibrary } from '../components/MasterImageLibrary';
import { IndependentWebsitesDirectoryModal } from '../components/IndependentWebsitesDirectoryModal';
import { RestaurantPhotoManagerModal } from '../components/RestaurantPhotoManagerModal';
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
  Download,
  FileText,
  QrCode,
  Lock,
  UserMinus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PwaInstallModal } from '../components/PwaInstallModal';

const getSafeSession = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && 'sessionStorage' in window && window.sessionStorage) {
      return window.sessionStorage.getItem(key);
    }
  } catch (e) {}
  return null;
};

const setSafeSession = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && 'sessionStorage' in window && window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  } catch (e) {}
};

export const MasterAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // ── Authentication lock state ──────────────────────────────
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return true; // Always unlocked by default for instant frictionless mobile/desktop demo access
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  // ── View Mode from global store (Phone vs Mac) ──
  const deviceViewMode = useRestaurantStore((state) => state.deviceViewMode);
  const setDeviceViewMode = useRestaurantStore((state) => state.setDeviceViewMode);

  const handleForceRefresh = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {}
    window.location.reload();
  };

  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const restaurants = useMemo(
    () =>
      rawRestaurants.filter(
        (r) =>
          !isDishNameAsRestaurant(r) &&
          (SEED_RESTAURANTS.some((s) => s.id === r.id || s.slug === r.slug) || (r.location && r.cuisine))
      ),
    [rawRestaurants]
  );
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const deleteRestaurant = useRestaurantStore((state) => state.deleteRestaurant);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
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
  const [selectedPosTab, setSelectedPosTab] = useState<'petpooja' | 'royalpos' | 'recaho' | 'rancelab'>('petpooja');
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

  // ── Instant Table QRs & Share Links Modal State ───────────────
  const [launchKitRestaurant, setLaunchKitRestaurant] = useState<Restaurant | null>(null);
  const [isLaunchKitOpen, setIsLaunchKitOpen] = useState(false);

  // ── Table Management & Floor Plan Modal State ───────────────
  const [tableModalRestaurant, setTableModalRestaurant] = useState<Restaurant | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // ── Restaurant Photo & Ambiance Manager Modal State ──────────
  const [photoModalRestaurant, setPhotoModalRestaurant] = useState<Restaurant | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // ── Independent Websites Directory Modal State ──────────────
  const [isIndependentSitesOpen, setIsIndependentSitesOpen] = useState(false);

  // ── PWA Install Modal State ────────────────────────────────
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // ── Offboard Restaurant Modal State ─────────────────────────
  const [offboardTarget, setOffboardTarget] = useState<Restaurant | null>(null);

  // ── Onboarding form state ──────────────────────────────────
  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestLocation, setNewRestLocation] = useState('');
  const [newRestAddress, setNewRestAddress] = useState('');
  const [newRestOwner, setNewRestOwner] = useState('');
  const [newRestEmail, setNewRestEmail] = useState('');
  const [newRestPhone, setNewRestPhone] = useState('');
  const [newRestPos, setNewRestPos] = useState<Restaurant['pos_provider']>('petpooja');
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
  const menuzPartnerCount = restaurants.filter((r) => isWorkingWithMenuz(r)).length;
  const directoryOnlyCount = restaurants.filter((r) => !isWorkingWithMenuz(r)).length;

  // ── Restaurant filtering and search state ───────────────────
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [showAdminSuggestions, setShowAdminSuggestions] = useState(false);
  const adminSearchRef = useRef<HTMLDivElement>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [partnerFilter, setPartnerFilter] = useState<'menuz_partners' | 'directory'>('menuz_partners');
  const [visibleCount, setVisibleCount] = useState(24);

  // Click outside to close admin suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminSearchRef.current && !adminSearchRef.current.contains(e.target as Node)) {
        setShowAdminSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminSuggestions = useMemo(() => {
    const q = restaurantSearch.trim();
    if (!q) return [];
    return searchPuneRestaurants(q).slice(0, 10);
  }, [restaurantSearch]);

  const handleOnboardDirectoryEntry = (entry: PuneRestaurantEntry) => {
    const cleanSlug =
      entry.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `pune-rest-${Date.now().toString().slice(-4)}`;

    const existing = restaurants.find(
      (r) =>
        r.slug === cleanSlug ||
        r.name.toLowerCase() === entry.name.toLowerCase() ||
        (r.aliases && r.aliases.some((a) => a.toLowerCase() === entry.name.toLowerCase()))
    );

    if (existing) {
      updateRestaurant(existing.id, { is_menuz_partner: true, status: 'active' });
      setCurrentRestaurant(existing.id);
      setLaunchKitRestaurant(existing);
      setIsLaunchKitOpen(true);
      return;
    }

    const newRest: Restaurant = {
      id: `rest-${cleanSlug}`,
      slug: cleanSlug,
      name: entry.name,
      cuisine: entry.cuisine,
      location: entry.location,
      owner_name: `${entry.name} Hospitality Team`,
      contact_email: `contact@${cleanSlug.slice(0, 16).replace(/-$/, '')}.in`,
      contact_phone: entry.phone || '+91 20 2600 0000',
      status: 'active',
      logo_url: entry.imageUrl,
      brand_colors: {
        primary: '#E85D04',
        background: '#FDFBF7',
        text: '#1C1917',
        accent: '#C84B00'
      },
      currency: 'INR',
      tax_rate_percent: 5.0,
      ordering_enabled: true,
      google_place_url: `https://search.google.com/local/writereview?placeid=${cleanSlug}`,
      is_menuz_partner: true,
      pos_provider: entry.posProvider || 'petpooja',
      aliases: entry.aliases || []
    };

    addRestaurant(newRest);
    setCurrentRestaurant(newRest.id);
    setLaunchKitRestaurant(newRest);
    setIsLaunchKitOpen(true);
  };

  const neighborhoods = useMemo(() => {
    return [
      'all',
      'PCMC',
      'Koregaon Park',
      'Shivajinagar',
      'Camp',
      'Baner',
      'Kothrud',
      'Viman Nagar',
      'Hinjewadi',
      'Wakad',
      'Pimple Saudagar',
      'Kharadi',
      'Hadapsar',
      'Katraj',
      'Kalyani Nagar',
      'Aundh'
    ];
  }, []);

  const filteredRestaurants = useMemo(() => {
    const q = restaurantSearch.toLowerCase().trim();
    const cleanQ = q.replace(/['’]/g, '');

    return restaurants
      .filter((r) => {
        const matchesSearch = matchesPuneQuery(r, restaurantSearch);

        const matchesArea =
          selectedNeighborhood === 'all' ||
          (r.location && r.location.toLowerCase().includes(selectedNeighborhood.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' ? r.status === 'active' : r.status !== 'active');

        const matchesPartner =
          partnerFilter === 'menuz_partners' ? isWorkingWithMenuz(r) : !isWorkingWithMenuz(r);

        return matchesSearch && matchesArea && matchesStatus && matchesPartner;
      })
      .sort((a, b) => {
        if (!q) return 0;
        const aExact =
          a.name.toLowerCase().includes(q) ||
          a.name.toLowerCase().replace(/['’]/g, '').includes(cleanQ) ||
          a.aliases?.some((al: string) => al.toLowerCase().includes(q) || al.toLowerCase().replace(/['’]/g, '').includes(cleanQ));
        const bExact =
          b.name.toLowerCase().includes(q) ||
          b.name.toLowerCase().replace(/['’]/g, '').includes(cleanQ) ||
          b.aliases?.some((al: string) => al.toLowerCase().includes(q) || al.toLowerCase().replace(/['’]/g, '').includes(cleanQ));
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0;
      });
  }, [restaurants, restaurantSearch, selectedNeighborhood, statusFilter, partnerFilter]);

  // Pune directory database items filtered by query and neighborhood
  const filteredDirectory = useMemo(() => {
    return PUNE_RESTAURANT_DIRECTORY.filter((entry) => {
      const matchSearch = !restaurantSearch.trim() || matchesPuneQuery(entry, restaurantSearch);
      const matchArea =
        selectedNeighborhood === 'all' ||
        entry.location.toLowerCase().includes(selectedNeighborhood.toLowerCase());
      return matchSearch && matchArea;
    });
  }, [restaurantSearch, selectedNeighborhood]);

  // ── Quick instant 1-click add for any Pune restaurant ───────
  const handleQuickAddPuneRestaurant = (nameInput: string) => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    // Check if matching restaurant already exists in directory or store
    const existing = restaurants.find(
      (r) =>
        r.name.toLowerCase() === trimmed.toLowerCase() ||
        (r.aliases && r.aliases.some((a) => a.toLowerCase() === trimmed.toLowerCase()))
    );

    if (existing) {
      updateRestaurant(existing.id, { is_menuz_partner: true, status: 'active' });
      setRestaurantSearch(existing.name);
      setLaunchKitRestaurant(existing);
      setIsLaunchKitOpen(true);
      return;
    }

    const cleanSlug =
      trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `pune-restaurant-${Date.now().toString().slice(-4)}`;

    const newRest: Restaurant = {
      id: `rest-${cleanSlug}`,
      slug: cleanSlug,
      name: trimmed,
      cuisine: 'Pune Authentic Dining & Multi-Cuisine',
      location: 'Pune & PCMC, Maharashtra',
      owner_name: `${trimmed} Management`,
      contact_email: `contact@${cleanSlug.slice(0, 16).replace(/-$/, '')}.in`,
      contact_phone: '+91 20 2565 0000',
      status: 'active',
      is_menuz_partner: true,
      logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
      brand_colors: {
        primary: '#E85D04',
        background: '#FDFBF7',
        text: '#1C1917',
        accent: '#C84B00'
      },
      currency: 'INR',
      tax_rate_percent: 5.0,
      ordering_enabled: true,
      google_place_url: `https://search.google.com/local/writereview?placeid=${cleanSlug}`,
      authentic_photography_statement: 'Every dish photograph represents the true culinary creations of our kitchen.',
      pos_provider: 'petpooja',
      aliases: [trimmed]
    };

    addRestaurant(newRest);
    setRestaurantSearch(trimmed);
    setLaunchKitRestaurant(newRest);
    setIsLaunchKitOpen(true);
  };

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
    setNewRestPos(entry.posProvider || 'petpooja');
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
      pos_provider: newRestPos,
      is_menuz_partner: true
    };

    addRestaurant(newRest);
    setIsAddRestaurantOpen(false);
    setLaunchKitRestaurant(newRest);
    setIsLaunchKitOpen(true);
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

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Restricted Operations Access
            </span>
            <h1 className="text-2xl font-black text-white">Master Admin Authorization</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your authorized Menuz platform administrator passphrase to manage demo venues, restaurant registries, and POS integrations.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = adminPasscode.trim().toLowerCase();
              const validPasscodes = ['menuz2026', 'admin123', 'menuz', '8888', 'menuz@admin', 'menuz2025'];
              if (trimmed && validPasscodes.includes(trimmed)) {
                setSafeSession('menuz_admin_session', 'active');
                setIsAdminAuthenticated(true);
                setAuthError(false);
              } else {
                setAuthError(true);
              }
            }}
            className="space-y-4 text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-400">Master Secret Passphrase</label>
              </div>
              <input
                type="password"
                value={adminPasscode}
                onChange={(e) => {
                  setAdminPasscode(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Enter Master Passphrase"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-center tracking-wider"
                autoFocus
              />
              {authError && (
                <div className="text-xs text-rose-400 font-medium mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid administrator credentials. Access denied.</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
            >
              Verify &amp; Unlock Master HQ
            </button>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#060913] pb-24 text-slate-100 font-sans">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STANDALONE ENTERPRISE MASTER HQ GLOBAL COMMAND HEADER        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#060A17]/95 backdrop-blur-md border-b border-indigo-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Enterprise Brand Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/hq" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-black text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    menuz
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold shadow-inner">
                    ENTERPRISE HQ
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 tracking-wider hidden sm:block">
                  Master Platform Governance • 3,000+ Pune Venues
                </span>
              </div>
            </Link>
          </div>

          {/* Center/Right: Quick External Portal Switchers */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Link
              to="/"
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
              title="Open Public Customer Discovery Site"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Customer Site</span>
            </Link>

            <Link
              to="/menu"
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
              title="Open Generic Diner Menus Portal"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Diner Menus</span>
            </Link>

            <Link
              to="/manage"
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
              title="Open Restaurant Partner Portal"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Restaurant Hub</span>
            </Link>

            <Link
              to="/kitchen"
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
              title="Open Kitchen Display System"
            >
              <ChefHat className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden lg:inline">Kitchen KDS</span>
            </Link>

            {/* Force Refresh */}
            <button
              type="button"
              onClick={handleForceRefresh}
              className="p-1.5 sm:p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Purge Caches & Reload DB"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Lock Session */}
            <button
              type="button"
              onClick={() => setIsAdminAuthenticated(false)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all flex items-center space-x-1"
              title="Lock Admin Authorization"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Banner: Platform Operations Control */}
      <div className="bg-[#080D1A] text-white border-b border-indigo-500/15">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Top Quick Utility Bar: Status & Refresh */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                MASTER ENTERPRISE HQ
              </span>
              <span className="flex items-center text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
                Live Production Cluster
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                • DB: 3,000+ Pune Venues
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/[0.06]">
                URL: /hq
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
                Platform Operations &amp; Ecosystem Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Centralized command for Menuz demo operations and Pune restaurant database. Manage live demo venues or onboard any of Pune’s {PUNE_RESTAURANT_DIRECTORY.length}+ restaurants on demand.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/pitch"
                className="px-3 py-2 bg-[#090D16]/[0.06] hover:bg-white/[0.1] active:scale-95 text-white text-xs font-semibold rounded-xl border border-white/[0.12] flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Open Interactive Pitch Deck (19 Slides)"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Pitch Deck</span>
              </Link>
              <a
                href="./menuz_executive_pitch_deck.pdf"
                download="Menuz_Executive_Pitch_Deck.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#090D16]/[0.04] hover:bg-white/[0.08] active:scale-95 text-slate-300 text-xs font-medium rounded-xl border border-white/[0.08] flex items-center space-x-1.5 transition-all"
                title="Download Executive Pitch Deck PDF"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>PDF</span>
              </a>
              <button
                type="button"
                onClick={() => setIsPwaModalOpen(true)}
                className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                title="Install Menuz as an App on this iPhone or Android phone"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Install App</span>
              </button>
              <button
                onClick={() => setIsAddRestaurantOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-950" />
                <span>Onboard</span>
              </button>
              <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setSafeSession('menuz_admin_session', 'locked');
                  setIsAdminAuthenticated(false);
                }}
                className="p-2 bg-[#090D16]/[0.04] hover:bg-rose-500/20 active:scale-95 text-slate-400 hover:text-rose-400 rounded-xl border border-white/[0.08] transition-all cursor-pointer"
                title="Lock Session"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metric Overview Tiles - Fluid 2-Col Mobile to 6-Col Desktop */}
          <div className={`grid gap-2.5 sm:gap-4 mt-6 ${deviceViewMode === 'phone' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
            <div className="bg-[#0E1526] p-3 sm:p-3.5 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Active Venues</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono">{totalRestaurants}</span>
                <span className="text-[10px] sm:text-[11px] text-amber-400 font-medium">({activeRestaurants} demos)</span>
              </div>
            </div>

            <div className="bg-[#0E1526] p-3 sm:p-3.5 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">City Database</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono">{PUNE_RESTAURANT_DIRECTORY.length}</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">leads</span>
              </div>
            </div>

            <div className="bg-[#0E1526] p-3 sm:p-3.5 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Total Orders</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-white font-mono">{totalOrders}</span>
                <span className="text-[10px] sm:text-[11px] text-amber-400">₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#0E1526] p-3 sm:p-3.5 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Average Rating</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono flex items-center">
                  <Star className="w-3.5 h-3.5 fill-amber-400 inline mr-0.5" />
                  {avgRating}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">({reviews.length})</span>
              </div>
            </div>

            <div className="bg-[#0E1526] p-3 sm:p-3.5 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">WhatsApp Opt-Ins</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{whatsappOptInCount}</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">verified</span>
              </div>
            </div>

            <div className="bg-[#0E1526] p-3 sm:p-3.5 rounded-xl border border-white/[0.08]">
              <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Connected POS</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">
                  {Object.keys(posConfigs).length}
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">{Object.keys(posConfigs).length > 0 ? 'online' : 'ready'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Touch Momentum Scrollable with Clean Mobile Stacking */}
      <div className="sticky top-[102px] lg:top-[64px] z-30 bg-[#0A0E17] border-b border-white/[0.08] shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none touch-pan-x items-center">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === 'restaurants'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Venues ({restaurants.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('reviews'); setSelectedReviewRestaurant(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reviews ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === 'challenges'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Challenges ({challenges.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === 'pos'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>POS Bridge</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === 'images'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Media</span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeTab === 'marketing'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Marketing</span>
            </button>

            <Link
              to="/ai-studio"
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Chef AI</span>
            </Link>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E1526] p-5 rounded-2xl border border-white/[0.08]">
              <div>
                <h2 className="text-lg font-bold font-serif text-white">Restaurant Operations &amp; Pune Database</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {restaurants.length > 0
                    ? 'Manage active Menuz demo restaurants or browse the 269+ Pune restaurant database to onboard any restaurant on demand.'
                    : 'Browse Pune restaurant database to onboard your first venue.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsIndependentSitesOpen(true)}
                  className="px-3.5 py-2 bg-[#090D16]/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold rounded-xl border border-white/[0.08] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Independent Websites Directory</span>
                </button>
                <button
                  onClick={() => setIsAddRestaurantOpen(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Onboard Restaurant</span>
                </button>
              </div>
            </div>

            {/* Empty State */}
            {restaurants.length === 0 && (
              <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-12 text-center shadow-lg">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 mx-auto flex items-center justify-center mb-4 border-2 border-amber-500/20">
                  <Building2 className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mt-2">Welcome to Menuz — Pune Edition</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  Your restaurant management ecosystem is ready. Start by onboarding your first restaurant.
                  Our Pune database has 269+ restaurants pre-loaded for instant onboarding.
                </p>
                <button
                  onClick={() => setIsAddRestaurantOpen(true)}
                  className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center space-x-2 mx-auto transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Onboard Your First Restaurant</span>
                </button>
              </div>
            )}

            {/* Quick Direct-Access Launchpad - Flagship Quick Launch */}
            {restaurants.length > 0 && (
              <div className="bg-[#0D1526]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl p-5 text-white shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Active Demos Quick Launch</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-white/[0.08] font-medium">
                        {restaurants.length} Active Venues
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Instant one-click direct jump to demo management hub or diner menu</p>
                  </div>
                </div>

                <div className={`grid gap-3 mt-3 ${deviceViewMode === 'phone' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {restaurants.slice(0, 6).map((r) => {
                    const rTables = tables.filter((t) => t.restaurant_id === r.id);
                    const rToken = rTables[0]?.public_token || 'table-token-01';
                    return (
                      <div
                        key={`quick-${r.id}`}
                        className="bg-slate-900/80 border border-white/[0.06] rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all"
                      >
                        <div
                          onClick={() => {
                            setCurrentRestaurant(r.id);
                            navigate(`/manage/${r.slug}`);
                          }}
                          className="flex items-center space-x-3 cursor-pointer min-w-0 flex-1 group"
                        >
                          <img src={r.logo_url} alt={r.name} className="w-10 h-10 rounded-xl object-cover border border-white/[0.08] flex-shrink-0" />
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">{r.name}</h4>
                            <span className="text-[10px] text-slate-400 block truncate">{r.cuisine}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <Link
                            to={`/manage/${r.slug}`}
                            onClick={() => setCurrentRestaurant(r.id)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm flex items-center space-x-1"
                            title={`Open ${r.name} Management Hub`}
                          >
                            <span>Hub</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                          <Link
                            to={`/r/${r.slug}/menu?t=${rToken}`}
                            onClick={() => setCurrentRestaurant(r.id)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-bold rounded-lg transition-colors flex items-center space-x-1 border border-white/[0.08]"
                            title={`Open ${r.name} Diner Menu (Table 1)`}
                          >
                            <UtensilsCrossed className="w-3 h-3 text-amber-400" />
                            <span>Diner</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setOffboardTarget(r)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors border border-white/[0.08] cursor-pointer"
                            title={`Offboard ${r.name}`}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search, Status, and Neighborhood Filter Control Center */}
            <div className="bg-[#0D1526]/90 rounded-3xl border border-white/[0.08] backdrop-blur-xl p-5 shadow-2xl space-y-4 text-white">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Bar with Autocomplete Suggestions Dropdown */}
                <div className="relative flex-1" ref={adminSearchRef}>
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                  <input
                    type="text"
                    value={restaurantSearch}
                    onFocus={() => setShowAdminSuggestions(true)}
                    onChange={(e) => {
                      setRestaurantSearch(e.target.value);
                      setShowAdminSuggestions(true);
                      setVisibleCount(24);
                    }}
                    placeholder={`Search Pune city database (${PUNE_RESTAURANT_DIRECTORY.length} restaurants) or active demos...`}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-900/90 border border-white/[0.1] rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/60 transition-all font-medium"
                  />
                  {restaurantSearch && (
                    <button
                      onClick={() => {
                        setRestaurantSearch('');
                        setShowAdminSuggestions(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-bold z-10 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}

                  {/* Autocomplete Suggestions Dropdown Popup */}
                  {showAdminSuggestions && restaurantSearch.trim().length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-[#0B1120] rounded-2xl shadow-2xl border border-white/[0.1] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-2.5 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-bold">
                        <span className="flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
                          <span>SUGGESTIONS ({adminSuggestions.length} found)</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">Click to jump or onboard</span>
                      </div>

                      {adminSuggestions.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.06]">
                          {adminSuggestions.map((item) => {
                            const cleanSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                            const existingRest = restaurants.find(
                              (r) =>
                                r.slug === cleanSlug ||
                                r.name.toLowerCase() === item.name.toLowerCase() ||
                                (r.aliases && r.aliases.some((a) => a.toLowerCase() === item.name.toLowerCase()))
                            );
                            const isDemoOrPartner = !!existingRest && isWorkingWithMenuz(existingRest);
                            const rTables = existingRest ? tables.filter((t) => t.restaurant_id === existingRest.id) : [];
                            const rToken = rTables[0]?.public_token || 'table-token-01-saffron';

                            return (
                              <div
                                key={`sugg-${item.name}`}
                                onClick={() => {
                                  setRestaurantSearch(item.name);
                                  setShowAdminSuggestions(false);
                                }}
                                className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                              >
                                <div className="flex items-center space-x-3 min-w-0">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-white/[0.08] flex-shrink-0 group-hover:scale-105 transition-transform"
                                  />
                                  <div className="truncate">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                        {item.name}
                                      </h4>
                                      {isDemoOrPartner ? (
                                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                          Interactive Demo
                                        </span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300 border border-white/[0.08]">
                                          📍 Database Lead
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                      {item.cuisine} • <span className="text-slate-300">{item.location}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                  {isDemoOrPartner && existingRest ? (
                                    <>
                                      <Link
                                        to={`/manage/${existingRest.slug}`}
                                        onClick={() => {
                                          setCurrentRestaurant(existingRest.id);
                                          setShowAdminSuggestions(false);
                                        }}
                                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors border border-white/[0.08] cursor-pointer"
                                      >
                                        Hub
                                      </Link>
                                      <Link
                                        to={`/r/${existingRest.slug}/menu?t=${rToken}`}
                                        onClick={() => {
                                          setCurrentRestaurant(existingRest.id);
                                          setShowAdminSuggestions(false);
                                        }}
                                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-lg transition-colors border border-amber-500/30 cursor-pointer"
                                      >
                                        Menu
                                      </Link>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        handleOnboardDirectoryEntry(item);
                                        setShowAdminSuggestions(false);
                                      }}
                                      className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm flex items-center space-x-1 cursor-pointer"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>+ Onboard</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-slate-400 mb-2">
                            No restaurant in Pune database matches <strong>"{restaurantSearch}"</strong>.
                          </p>
                          <button
                            onClick={() => {
                              handleQuickAddPuneRestaurant(restaurantSearch);
                              setShowAdminSuggestions(false);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Instant 1-Click Register "{restaurantSearch.trim()}"</span>
                          </button>
                        </div>
                      )}

                      <div className="p-2 bg-slate-900 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                        <span>Showing top matches from {PUNE_RESTAURANT_DIRECTORY.length} Pune restaurants</span>
                        <button
                          onClick={() => setShowAdminSuggestions(false)}
                          className="text-amber-400 hover:underline font-bold text-[10px] cursor-pointer"
                        >
                          Close Suggestions ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Demos vs Pune City Database Filter */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-white/[0.08] flex-shrink-0">
                  <button
                    onClick={() => {
                      setPartnerFilter('menuz_partners');
                      setVisibleCount(24);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      partnerFilter === 'menuz_partners'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>✨ Active Demo Venues ({restaurants.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setPartnerFilter('directory');
                      setVisibleCount(24);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      partnerFilter === 'directory'
                        ? 'bg-slate-800 text-white shadow-sm border border-white/[0.1]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>📍 Pune City Database ({PUNE_RESTAURANT_DIRECTORY.length} Leads)</span>
                  </button>
                </div>

                {/* Status Filter Toggle */}
                <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-2xl border border-white/[0.08] flex-shrink-0">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setVisibleCount(24);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'all'
                        ? 'bg-slate-800 text-white shadow-sm border border-white/[0.08]'
                        : 'text-slate-400 hover:text-white'
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
                        ? 'bg-emerald-600/90 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
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
                        ? 'bg-rose-600/90 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Inactive ({totalRestaurants - activeRestaurants})
                  </button>
                </div>
              </div>

              {/* Instant 1-Click Inline Add if searching */}
              {restaurantSearch.trim().length > 1 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-2.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      Missing a restaurant? Register <strong className="text-white">"{restaurantSearch.trim()}"</strong> into Pune database now:
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickAddPuneRestaurant(restaurantSearch)}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-sm flex items-center space-x-1.5 flex-shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Instant 1-Click Register</span>
                  </button>
                </div>
              )}

              {/* Neighborhood Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
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
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm font-semibold'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/[0.06]'
                    }`}
                  >
                    {area === 'all' ? 'All Locations' : area}
                  </button>
                ))}
              </div>

              {/* Count Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs text-slate-400">
                <span>
                  {partnerFilter === 'directory' ? (
                    <>
                      Showing <strong className="text-white">{Math.min(visibleCount, filteredDirectory.length)}</strong> of{' '}
                      <strong className="text-white">{filteredDirectory.length}</strong> matching Pune database leads (
                      <strong className="text-white">{PUNE_RESTAURANT_DIRECTORY.length}</strong> total venues in city database)
                    </>
                  ) : (
                    <>
                      Showing <strong className="text-white">{Math.min(visibleCount, filteredRestaurants.length)}</strong> of{' '}
                      <strong className="text-white">{filteredRestaurants.length}</strong> active demo venues in Menuz
                    </>
                  )}
                </span>
                <div className="flex items-center space-x-3">
                  {visibleCount < (partnerFilter === 'directory' ? filteredDirectory.length : filteredRestaurants.length) && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Load More (+24)
                    </button>
                  )}
                  {visibleCount < (partnerFilter === 'directory' ? filteredDirectory.length : filteredRestaurants.length) && (
                    <button
                      onClick={() => setVisibleCount(partnerFilter === 'directory' ? filteredDirectory.length : filteredRestaurants.length)}
                      className="text-slate-300 hover:text-white font-bold underline cursor-pointer"
                    >
                      Show All ({partnerFilter === 'directory' ? filteredDirectory.length : filteredRestaurants.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* TAB CONTENT: EITHER PUNE CITY DATABASE OR ACTIVE DEMO VENUES */}
            {partnerFilter === 'directory' ? (
              /* ── 1. Pune City Database Leads Grid ──────────────────────── */
              filteredDirectory.length === 0 ? (
                <div className="bg-[#0D1526]/90 rounded-3xl border border-white/[0.08] p-10 text-center text-slate-400 shadow-2xl">
                  <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <h4 className="font-serif font-bold text-white text-base">No restaurants match your filters</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    No leads found matching "{restaurantSearch || selectedNeighborhood}".
                  </p>
                  {restaurantSearch.trim() ? (
                    <div className="max-w-md mx-auto p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-4 text-center">
                      <p className="text-xs text-amber-200 font-medium mb-3">
                        Onboard <strong>"{restaurantSearch.trim()}"</strong> directly into Menuz with 1 click:
                      </p>
                      <button
                        onClick={() => handleQuickAddPuneRestaurant(restaurantSearch)}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 mx-auto transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Onboard "{restaurantSearch.trim()}"</span>
                      </button>
                    </div>
                  ) : null}
                  <button
                    onClick={() => {
                      setRestaurantSearch('');
                      setSelectedNeighborhood('all');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm border border-white/[0.08] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-4 sm:gap-6 ${deviceViewMode === 'phone' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  {filteredDirectory.slice(0, visibleCount).map((entry) => {
                    const cleanSlug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    const existing = restaurants.find(
                      (r) =>
                        r.slug === cleanSlug ||
                        r.name.toLowerCase() === entry.name.toLowerCase() ||
                        (r.aliases && r.aliases.some((a) => a.toLowerCase() === entry.name.toLowerCase()))
                    );
                    const isOnboarded = !!existing && isWorkingWithMenuz(existing);
                    const restTables = existing ? tables.filter((t) => t.restaurant_id === existing.id) : [];
                    const firstToken = restTables[0]?.public_token || 'table-token-01-saffron';

                    return (
                      <div
                        key={`dir-card-${entry.name}`}
                        className="bg-[#0E172A]/90 rounded-3xl border border-white/[0.08] p-6 shadow-xl hover:shadow-2xl hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1 mr-2 min-w-0">
                              <img
                                src={entry.imageUrl}
                                alt={entry.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-white/[0.08] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
                              />
                              <div className="truncate">
                                <h3 className="font-bold text-base text-white font-serif leading-tight group-hover:text-amber-400 transition-colors truncate">
                                  {entry.name}
                                </h3>
                                <span className="text-xs text-amber-400/90 font-medium block truncate">
                                  {entry.cuisine}
                                </span>
                              </div>
                            </div>

                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                              📍 Database Lead
                            </span>
                          </div>

                          {/* Location & Details */}
                          <div className="mt-4 p-3.5 bg-slate-900/70 rounded-2xl border border-white/[0.06] text-xs space-y-1.5 text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Location:</span>
                              <span className="font-medium text-right text-slate-200 truncate max-w-[200px]">{entry.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Avg Cost:</span>
                              <span className="font-medium text-right text-slate-200">{entry.avgCostForTwo} for two</span>
                            </div>
                            {entry.phone && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Phone:</span>
                                <span className="font-mono text-[11px] text-slate-200">{entry.phone}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-400">Rating:</span>
                              <span className="font-bold text-amber-400 flex items-center">
                                <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                                {entry.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Onboard Action */}
                        <div className="mt-5 pt-4 border-t border-white/[0.08]">
                          {isOnboarded && existing ? (
                            <div className="flex gap-2">
                              <Link
                                to={`/manage/${existing.slug}`}
                                onClick={() => setCurrentRestaurant(existing.id)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-white/[0.08] cursor-pointer"
                              >
                                <span>Open Hub</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                to={`/r/${existing.slug}/menu?t=${firstToken}`}
                                onClick={() => setCurrentRestaurant(existing.id)}
                                className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-amber-500/30 cursor-pointer"
                              >
                                <span>Diner Menu</span>
                              </Link>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOnboardDirectoryEntry(entry)}
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>+ Onboard Restaurant to Menuz</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* ── 2. Active Demo Venues Grid ─────────────────────────────── */
              filteredRestaurants.length === 0 ? (
                <div className="bg-[#0D1526]/90 rounded-3xl border border-white/[0.08] p-10 text-center text-slate-400 shadow-2xl">
                  <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <h4 className="font-serif font-bold text-white text-base">No active venues match your filters</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Try switching to the "Pune City Database" tab to onboard from 268+ venues.
                  </p>
                  <button
                    onClick={() => {
                      setRestaurantSearch('');
                      setSelectedNeighborhood('all');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-sm border border-white/[0.08] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-4 sm:gap-6 ${deviceViewMode === 'phone' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
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
                        className="bg-[#0E172A]/90 rounded-3xl border border-white/[0.08] p-6 shadow-xl hover:shadow-2xl hover:border-amber-500/40 transition-all flex flex-col justify-between group"
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
                                className="w-12 h-12 rounded-2xl object-cover border border-white/[0.08] shadow-sm group-hover:scale-105 transition-transform"
                              />
                              <div>
                                <h3 className="font-bold text-base text-white font-serif leading-tight group-hover:text-amber-400 transition-colors">
                                  {rest.name}
                                </h3>
                                <span className="text-xs text-amber-400/90 font-medium block">{rest.cuisine}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-1">
                              <button
                                onClick={() => toggleRestaurantStatus(rest.id)}
                                title="Click to toggle restaurant active/inactive"
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors ${
                                  rest.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${rest.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                <span>{rest.status}</span>
                              </button>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                                Interactive Demo
                              </span>
                            </div>
                          </div>

                          {/* Location & Contact */}
                          <div className="mt-4 p-3 bg-slate-900/70 rounded-2xl border border-white/[0.06] text-xs space-y-1 text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Location:</span>
                              <span className="font-medium text-right text-slate-200">{rest.location}</span>
                            </div>
                            {rest.owner_name && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Owner:</span>
                                <span className="font-medium text-slate-200">{rest.owner_name}</span>
                              </div>
                            )}
                            {rest.contact_phone && (
                              <div className="flex justify-between">
                                <span className="text-slate-400">Contact:</span>
                                <span className="font-mono text-[11px] text-slate-200">{rest.contact_phone}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-400">POS Integration:</span>
                              <span className="font-bold uppercase tracking-wider text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                                {rest.pos_provider}
                              </span>
                            </div>
                          </div>

                          {/* Metrics row */}
                          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                            <div className="p-2 bg-slate-900/80 border border-white/[0.06] rounded-xl">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Tables</span>
                              <span className="text-sm font-bold font-mono text-white">{restTables.length}</span>
                            </div>
                            <div className="p-2 bg-slate-900/80 border border-white/[0.06] rounded-xl">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Dishes</span>
                              <span className="text-sm font-bold font-mono text-white">{restItems.length}</span>
                            </div>
                            <div className="p-2 bg-slate-900/80 border border-white/[0.06] rounded-xl">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Orders</span>
                              <span className="text-sm font-bold font-mono text-white">{restOrders.length}</span>
                            </div>
                            <div className="p-2 bg-slate-900/80 border border-white/[0.06] rounded-xl">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Rating</span>
                              <span className="text-sm font-bold font-mono text-amber-400 flex items-center justify-center">
                                <Star className="w-3 h-3 fill-amber-500 inline mr-0.5" />
                                {restReviews.length > 0 ? (restReviews.reduce((s, r) => s + r.rating, 0) / restReviews.length).toFixed(1) : '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Links & Multi-Button Control */}
                        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col space-y-2.5">
                          <Link
                            to={`/r/${rest.slug}/menu?t=${firstTableToken}`}
                            onClick={() => setCurrentRestaurant(rest.id)}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                          >
                            <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
                            <span>Launch Diner Menu ({restTables[0]?.label || 'Table 1'})</span>
                            <ExternalLink className="w-3 h-3 text-white/80 ml-0.5" />
                          </Link>

                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              to={`/manage/${rest.slug}`}
                              onClick={() => setCurrentRestaurant(rest.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors text-center cursor-pointer border border-white/[0.08]"
                              title="Manager Hub & Menu Editor"
                            >
                              <span>Manage</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>

                            <Link
                              to="/kitchen"
                              onClick={() => setCurrentRestaurant(rest.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 border border-white/[0.08] transition-colors text-center cursor-pointer"
                              title="Kitchen Display System (KDS)"
                            >
                              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                              <span>KDS</span>
                            </Link>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setCurrentRestaurant(rest.id);
                                setLaunchKitRestaurant(rest);
                                setIsLaunchKitOpen(true);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all border border-white/[0.08] cursor-pointer"
                              title="View & Share Guest Links, WhatsApp Handover Brief, Table QRs, and Domain"
                            >
                              <Share2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>📲 Links & QRs</span>
                            </button>

                            <button
                              onClick={() => {
                                setCurrentRestaurant(rest.id);
                                setTableModalRestaurant(rest);
                                setIsTableModalOpen(true);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-white/[0.08] transition-colors cursor-pointer"
                              title="Manage Tables, Floor Plan, Capacity, and Edit Restaurant Details"
                            >
                              <QrCode className="w-3.5 h-3.5 text-amber-400" />
                              <span>🪑 Floor Plan</span>
                            </button>
                          </div>

                          {/* 📸 Dedicated Photo Management & Gallery Tools */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setCurrentRestaurant(rest.id);
                                setPhotoModalRestaurant(rest);
                                setIsPhotoModalOpen(true);
                              }}
                              className="bg-slate-800/90 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300 hover:text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-amber-500/20 transition-all cursor-pointer shadow-sm"
                              title="Upload & Manage Restaurant Ambiance & Cover Photos from Phone Gallery"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                              <span>📸 Venue Photos</span>
                            </button>

                            <Link
                              to={`/manage/${rest.slug}#manager-photo-studio`}
                              onClick={() => setCurrentRestaurant(rest.id)}
                              className="bg-slate-800/90 hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300 hover:text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-amber-500/20 transition-all cursor-pointer shadow-sm text-center"
                              title="Upload & Remove Dish Photos for Each Menu Item from Phone Gallery"
                            >
                              <Utensils className="w-3.5 h-3.5 text-amber-400" />
                              <span>🖼️ Dish Photos</span>
                            </Link>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                            <span className="truncate max-w-[170px] font-mono text-[10px] text-slate-400">/#/r/{rest.slug}/menu</span>
                            <button
                              onClick={() => copyUrl(window.location.origin + dinerUrl, rest.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium border border-white/[0.08] flex items-center space-x-1 flex-shrink-0 transition-colors cursor-pointer"
                              title="Copy Table 1 Menu Link"
                            >
                              {copiedLink === rest.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setOffboardTarget(rest)}
                            className="w-full mt-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold py-1.5 px-2.5 rounded-xl text-[11px] flex items-center justify-center space-x-1.5 border border-rose-500/20 hover:border-rose-600 transition-colors cursor-pointer"
                            title={`Offboard ${rest.name} from active operational hub`}
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Offboard Venue</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Bottom Pagination Controls */}
            {visibleCount < filteredRestaurants.length && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-serif text-xs font-bold rounded-2xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Load 24 More Restaurants ({filteredRestaurants.length - visibleCount} remaining)</span>
                </button>
                <button
                  onClick={() => setVisibleCount(filteredRestaurants.length)}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-white/[0.08] text-white text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
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
                <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-lg">
                  <h2 className="text-lg font-bold font-serif text-white">Customer Reviews Dashboard</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {restaurants.length > 0
                      ? 'Click on a restaurant to view its reviews and customer insights.'
                      : 'No restaurants onboarded yet. Reviews will appear here once you onboard a restaurant.'}
                  </p>
                </div>

                {/* Empty state for reviews */}
                {restaurants.length === 0 && (
                  <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-12 text-center shadow-lg">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-white mt-4">No Reviews Yet</h3>
                    <p className="text-xs text-slate-500 mt-1">Onboard your first restaurant to start collecting reviews.</p>
                  </div>
                )}

                {/* Restaurant cards for drill-down */}
                <div className={`grid gap-4 sm:gap-5 ${deviceViewMode === 'phone' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
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
                        className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-6 shadow-lg hover: hover:border-amber-500/30 transition-all text-left group"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={rest.logo_url}
                            alt={rest.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-white/[0.08]"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-white font-serif truncate group-hover:text-amber-400 transition-colors">{rest.name}</h3>
                            <span className="text-[11px] text-slate-500">{rest.location}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="p-2.5 bg-[#090D16]/[0.03] rounded-xl text-center border border-white/[0.08]">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Reviews</span>
                            <span className="text-lg font-bold font-mono text-white">{restReviews.length}</span>
                          </div>
                          <div className="p-2.5 bg-[#090D16]/[0.03] rounded-xl text-center border border-white/[0.08]">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Avg Rating</span>
                            <span className="text-lg font-bold font-mono text-amber-600 flex items-center justify-center">
                              <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                              {restAvgRating}
                            </span>
                          </div>
                          <div className="p-2.5 bg-[#090D16]/[0.03] rounded-xl text-center border border-white/[0.08]">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Opt-Ins</span>
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
                <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-lg">
                  <button
                    onClick={() => { setSelectedReviewRestaurant(null); setReviewSearchQuery(''); setReviewRatingFilter('all'); }}
                    className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-900 mb-3 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Restaurants</span>
                  </button>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedRestForReviews?.logo_url || ''}
                        alt={selectedRestForReviews?.name || ''}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/[0.08]"
                      />
                      <div>
                        <h2 className="text-lg font-bold font-serif text-white">{selectedRestForReviews?.name}</h2>
                        <span className="text-xs text-slate-500">{selectedRestForReviews?.location} • {filteredReviews.length} reviews</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search */}
                      <div className="relative min-w-[220px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <input
                          type="text"
                          value={reviewSearchQuery}
                          onChange={(e) => setReviewSearchQuery(e.target.value)}
                          placeholder="Search reviews..."
                          className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-600/40"
                        />
                      </div>

                      {/* Star Filter */}
                      <select
                        value={reviewRatingFilter}
                        onChange={(e) => setReviewRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-600/40"
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
                  <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-12 text-center shadow-lg">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-white mt-4">No Reviews Yet</h3>
                    <p className="text-xs text-slate-500 mt-1">Reviews from diners will appear here once they submit feedback.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredReviews.map((rev) => {
                      const rest = restaurants.find((r) => r.id === rev.restaurant_id) || restaurants[0];
                      return (
                        <div
                          key={rev.id}
                          className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-lg flex flex-col justify-between space-y-4 hover: transition-all"
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
                                          : 'fill-ivory-200 text-slate-400'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <h4 className="font-bold text-sm text-white mt-1">{rev.customer_name}</h4>
                                <span className="text-[11px] text-slate-500 font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                              </div>

                              {/* WhatsApp Consent Badge */}
                              {rev.whatsapp_opt_in ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  <span>WhatsApp</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#090D16]/[0.04] text-slate-500">
                                  No Marketing
                                </span>
                              )}
                            </div>

                            {/* Keywords */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {rev.selected_keywords.map((kw) => (
                                <span
                                  key={kw}
                                  className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-semibold"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-xs text-slate-400 mt-3 leading-relaxed bg-[#090D16]/[0.03] p-3 rounded-2xl border border-white/[0.08] italic">
                              "{rev.review_text}"
                            </p>
                          </div>

                          {/* Customer Contact */}
                          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-400 text-[11px]">
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
            <div className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Staff Redemption Center</span>
                  <h3 className="text-lg font-bold font-serif text-white mt-0.5">Verify Customer Challenge Voucher</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enter voucher codes from scratch cards or wheels to validate and redeem.
                  </p>
                </div>

                <form onSubmit={handleRedeemVoucher} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="e.g. WIN-9418"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-amber-600/40 min-w-[200px]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#090D16] hover:bg-[#0D1322] text-white rounded-xl text-xs font-bold transition-colors shadow-lg"
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
              <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-12 text-center shadow-lg">
                <Trophy className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white mt-4">No Challenges Configured</h3>
                <p className="text-xs text-slate-500 mt-1">Challenges will be created when restaurants set up their review reward programs.</p>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${deviceViewMode === 'phone' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-white flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span>Configured Review Challenges</span>
                    </h3>
                    <span className="text-xs text-slate-500">{challenges.length} active</span>
                  </div>

                  <div className="space-y-3">
                    {challenges.map((c) => {
                      const rest = restaurants.find((r) => r.id === c.restaurant_id);
                      return (
                        <div key={c.id} className="p-4 bg-[#090D16]/[0.03] rounded-2xl border border-white/[0.08] space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{rest?.name || 'All'}</span>
                              <h4 className="font-bold text-sm text-white">{c.title}</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{c.description}</p>
                          <div className="p-2.5 bg-[#090D16] rounded-xl border border-white/[0.08] flex items-center justify-between text-xs">
                            <span className="text-slate-500">Reward:</span>
                            <span className="font-bold text-amber-400">{c.reward_item_name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-white flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Customer Redemption Ledger</span>
                    </h3>
                    <span className="text-xs text-slate-500">{redemptions.length} vouchers</span>
                  </div>

                  {redemptions.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">No vouchers issued yet.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {redemptions.map((red) => (
                        <div
                          key={red.id}
                          className="p-3.5 bg-[#090D16]/[0.03] rounded-2xl border border-white/[0.08] flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-white text-sm tracking-wide">{red.voucher_code}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                red.status === 'redeemed'
                                  ? 'bg-white/[0.02] text-slate-400'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {red.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
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
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
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
            {/* POS Provider Switcher Header */}
            <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Supported POS Ecosystems</span>
                  <h3 className="text-xl font-bold font-serif text-white mt-0.5">Pune & India Restaurant POS Bridges</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct two-way KOT sync, dynamic menu updates, and live thermal printing bridges.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    All Multi-Channel KOT Routes Active
                  </span>
                </div>
              </div>

              {/* Provider Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedPosTab('petpooja')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPosTab === 'petpooja'
                      ? 'bg-orange-500/20 border-orange-500/60 shadow-sm ring-1 ring-orange-500/40 text-orange-300'
                      : 'bg-[#12192B] border-white/[0.08] hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-orange-400">Petpooja</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">50k+ Outlets</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">National & Pune #1 REST API</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPosTab('royalpos')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPosTab === 'royalpos'
                      ? 'bg-purple-500/20 border-purple-500/60 shadow-sm ring-1 ring-purple-500/40 text-purple-300'
                      : 'bg-[#12192B] border-white/[0.08] hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-400">RoyalPOS</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">Pune Local</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">FC Road, Hinjewadi & QSRs</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPosTab('recaho')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPosTab === 'recaho'
                      ? 'bg-blue-500/20 border-blue-500/60 shadow-sm ring-1 ring-blue-500/40 text-blue-300'
                      : 'bg-[#12192B] border-white/[0.08] hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400">Recaho</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">PCMC / Chakan</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">Suburban & Family Eateries</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPosTab('rancelab')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPosTab === 'rancelab'
                      ? 'bg-emerald-500/20 border-emerald-500/60 shadow-sm ring-1 ring-emerald-500/40 text-emerald-300'
                      : 'bg-[#12192B] border-white/[0.08] hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400">RanceLab</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">FusionResto</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">Multi-Chain Fine Dining</p>
                </button>
              </div>
            </div>

            {/* Active POS Provider Panel */}
            {restaurants.length > 0 && (
              <>
                {selectedPosTab === 'petpooja' && (
                  <PetpoojaIntegrationPanel
                    restaurant={restaurants[0]}
                    onUpdateConfig={(cfg: PetpoojaConfig) =>
                      updateRestaurant(restaurants[0].id, { petpooja_config: cfg, pos_provider: 'petpooja' })
                    }
                  />
                )}

                {selectedPosTab === 'royalpos' && (
                  <RoyalPosIntegrationPanel
                    restaurant={restaurants[0]}
                    onUpdateConfig={(cfg: RoyalPosConfig) =>
                      updateRestaurant(restaurants[0].id, { royalpos_config: cfg, pos_provider: 'royalpos' })
                    }
                  />
                )}

                {selectedPosTab === 'recaho' && (
                  <RecahoIntegrationPanel
                    restaurant={restaurants[0]}
                    onUpdateConfig={(cfg: RecahoConfig) =>
                      updateRestaurant(restaurants[0].id, { recaho_config: cfg, pos_provider: 'recaho' })
                    }
                  />
                )}

                {selectedPosTab === 'rancelab' && (
                  <RancelabIntegrationPanel
                    restaurant={restaurants[0]}
                    onUpdateConfig={(cfg: RancelabConfig) =>
                      updateRestaurant(restaurants[0].id, { rancelab_config: cfg, pos_provider: 'rancelab' })
                    }
                  />
                )}
              </>
            )}

            <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700">Universal Adapter Layer</span>
                <h3 className="text-lg font-bold font-serif text-white mt-0.5">Two-Way Real-time POS Synchronisation</h3>
                <p className="text-xs text-slate-400 mt-0.5">
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
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Simulate Inbound POS Order</span>
                </button>
              )}
            </div>

            {restaurants.length === 0 ? (
              <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-12 text-center shadow-lg">
                <RefreshCw className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white mt-4">No POS Connections</h3>
                <p className="text-xs text-slate-500 mt-1">POS integrations will appear here once restaurants are onboarded.</p>
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
                    <div key={rest.id} className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-lg space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">{rest.name}</span>
                          <h4 className="text-base font-bold text-white capitalize flex items-center space-x-1.5 mt-0.5">
                            <span>{config.provider.replace('_', ' ')} POS Bridge</span>
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-300 flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                          <span>Connected</span>
                        </span>
                      </div>

                      <div className="p-3 bg-[#090D16]/[0.03] rounded-2xl border border-white/[0.08] text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Latency:</span>
                          <span className="font-mono font-bold text-green-700">{config.sync_latency_ms} ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Auto Sync:</span>
                          <span className="font-bold text-slate-200">Enabled (Bidirectional)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Ping:</span>
                          <span className="font-mono text-[11px] text-slate-400">{new Date(config.last_sync_time).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerPosSync(rest.id)}
                        className="w-full bg-[#090D16]/[0.04] hover:bg-white/[0.06] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-white/[0.08] transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Trigger Full Catalog Sync</span>
                      </button>

                      {config.sync_log.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Recent Sync Stream</span>
                          <div className="space-y-1.5 max-h-[140px] overflow-y-auto text-[11px] font-mono">
                            {config.sync_log.map((log) => (
                              <div key={log.id} className="p-2 bg-[#090D16]/[0.04]/70 rounded-xl border border-white/[0.08]">
                                <div className="flex justify-between text-slate-500 text-[10px]">
                                  <span>{log.event}</span>
                                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <span className="text-slate-200 truncate block mt-0.5">{log.details}</span>
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
        {/* TAB 5: MASTER IMAGE LIBRARY (RESTAURANT-WISE ASSETS)                      */}
        {/* ========================================================================= */}
        {activeTab === 'images' && (
          <MasterImageLibrary />
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MARKETING & WHATSAPP CAMPAIGNS                                     */}
        {/* ========================================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-green-700">Consent & Privacy Compliant</span>
                <h3 className="text-lg font-bold font-serif text-white mt-0.5">Customer Marketing & WhatsApp Broadcasting</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Broadcast promotions strictly to diners who provided explicit consent.
                </p>
              </div>

              <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition-colors self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-12 text-center shadow-lg">
                <Send className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white mt-4">No Campaigns Yet</h3>
                <p className="text-xs text-slate-500 mt-1">Create your first WhatsApp campaign to reach diners who opted in.</p>
              </div>
            ) : (
              <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] overflow-hidden shadow-lg">
                <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white font-serif">Broadcast Campaign History</h4>
                  <span className="text-xs text-slate-500 font-medium">{campaigns.length} campaigns executed</span>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {campaigns.map((camp) => {
                    const targetRest = restaurants.find((r) => r.id === camp.target_restaurant_id);
                    return (
                      <div key={camp.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-sm text-white">{camp.campaign_name}</h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 uppercase">
                              {camp.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono bg-[#090D16]/[0.04] p-2.5 rounded-xl border border-white/[0.08] max-w-2xl">
                            "{camp.message_template}"
                          </p>
                          <span className="text-[11px] text-slate-500 block">
                            Target: <strong>{targetRest?.name || 'All Opt-In Diners'}</strong> • Sent on {new Date(camp.sent_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-right sm:self-center">
                          <span className="text-sm font-bold text-green-700 font-mono block">
                            {camp.recipients_count} Diners
                          </span>
                          <span className="text-[10px] text-slate-500">Delivered</span>
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
          <div className="bg-[#0D1322] rounded-3xl max-w-lg w-full p-6  border border-white/[0.08] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Onboard Restaurant to Menuz</h3>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1 mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Pune Directory — 269+ restaurants ready in city database</span>
                </span>
              </div>
              <button onClick={() => { setIsAddRestaurantOpen(false); setAutocompleteQuery(''); setSelectedFromDirectory(false); }} className="text-slate-500 hover:text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* ── Autocomplete Search ─────────────────────────────── */}
            <div ref={autocompleteRef} className="relative">
              <label className="font-bold text-xs text-slate-200 block mb-1.5">
                Search Pune Restaurants
                <span className="font-normal text-slate-500 ml-1">(type 2+ characters)</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  value={autocompleteQuery}
                  onChange={(e) => {
                    setAutocompleteQuery(e.target.value);
                    setSelectedFromDirectory(false);
                  }}
                  placeholder="e.g. Malaka Spice, Vaishali, Barbeque..."
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-600/40 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              {/* Autocomplete dropdown */}
              {showAutocomplete && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#090D16] border border-white/[0.08] rounded-2xl  max-h-[280px] overflow-y-auto z-[60]">
                  {autocompleteResults.map((entry, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAutocomplete(entry)}
                      className="w-full p-3.5 text-left hover:bg-amber-500/10 transition-colors border-b border-white/[0.06] last:border-b-0 flex items-start space-x-3"
                    >
                      <img
                        src={entry.imageUrl}
                        alt={entry.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/[0.08] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white truncate">{entry.name}</h4>
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold text-slate-400">{entry.rating}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-amber-400 font-medium block truncate">{entry.cuisine}</span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          <span className="text-[10px] text-slate-500 truncate">{entry.location}</span>
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
                <label className="font-bold text-slate-200 block mb-1">Restaurant Name *</label>
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
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={newRestSlug}
                    onChange={(e) => setNewRestSlug(e.target.value)}
                    placeholder="malaka-spice"
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-amber-600/40"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Cuisine</label>
                  <input
                    type="text"
                    value={newRestCuisine}
                    onChange={(e) => setNewRestCuisine(e.target.value)}
                    placeholder="Pan-Asian, Thai"
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Location & City</label>
                <input
                  type="text"
                  value={newRestLocation}
                  onChange={(e) => setNewRestLocation(e.target.value)}
                  placeholder="Koregaon Park, Pune"
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Full Address</label>
                <input
                  type="text"
                  value={newRestAddress}
                  onChange={(e) => setNewRestAddress(e.target.value)}
                  placeholder="Lane No. 5, North Main Road, Koregaon Park, Pune 411001"
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={newRestOwner}
                    onChange={(e) => setNewRestOwner(e.target.value)}
                    placeholder="To be filled by owner"
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newRestPhone}
                    onChange={(e) => setNewRestPhone(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Contact Email</label>
                <input
                  type="email"
                  value={newRestEmail}
                  onChange={(e) => setNewRestEmail(e.target.value)}
                  placeholder="contact@restaurant.in"
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">POS Integration *</label>
                  <select
                    value={newRestPos}
                    onChange={(e) => setNewRestPos(e.target.value as any)}
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40 font-medium"
                  >
                    {MODERN_POS_PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.tag})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Brand Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newRestColor}
                      onChange={(e) => setNewRestColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-white/[0.08] cursor-pointer"
                    />
                    <span className="font-mono text-xs">{newRestColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddRestaurantOpen(false); setAutocompleteQuery(''); setSelectedFromDirectory(false); }}
                  className="px-4 py-2 bg-[#090D16]/[0.06] text-slate-400 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg"
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
          <div className="bg-[#0D1322] rounded-3xl max-w-lg w-full p-6  border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Broadcast WhatsApp Campaign</h3>
                <span className="text-[11px] text-green-700 font-semibold flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Only diners with explicit WhatsApp consent are messaged</span>
                </span>
              </div>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-slate-500 hover:text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Midweek Chef's Special Invitation"
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Target Diner Audience</label>
                <select
                  value={campaignTargetRest}
                  onChange={(e) => setCampaignTargetRest(e.target.value)}
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-green-600"
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
                <label className="font-bold text-slate-200 block mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Namaste {{name}}! We are featuring an exclusive chef special tasting this Thursday..."
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-green-600 leading-relaxed font-sans"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Tip: Use <code>{'{{name}}'}</code> for personal greetings.</span>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 bg-[#090D16]/[0.06] text-slate-400 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold shadow-lg flex items-center space-x-1.5"
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
          <div className="bg-[#0D1322] rounded-3xl max-w-md w-full p-6  border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-serif text-lg font-bold text-white">Assign Photograph to Dish</h3>
              <button onClick={() => setIsImageAssignModalOpen(false)} className="text-slate-500 hover:text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Image Preview</label>
                <img
                  src={selectedImageForAssign}
                  alt="Selected"
                  className="w-full h-40 rounded-2xl object-cover border border-white/[0.08]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Target Menu Item</label>
                <select
                  value={targetMenuItemId}
                  onChange={(e) => setTargetMenuItemId(e.target.value)}
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                >
                  <option value="">Select dish to assign...</option>
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (₹{item.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsImageAssignModalOpen(false)}
                  className="px-4 py-2 bg-[#090D16]/[0.06] text-slate-400 rounded-xl font-semibold"
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
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg"
                >
                  Apply & Synchronize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instant Table QRs & Share Links Handover Modal */}
      {launchKitRestaurant && (
        <RestaurantLaunchKitModal
          restaurant={launchKitRestaurant}
          isOpen={isLaunchKitOpen}
          onClose={() => setIsLaunchKitOpen(false)}
          onOpenTableManagement={() => {
            setTableModalRestaurant(launchKitRestaurant);
            setIsTableModalOpen(true);
          }}
        />
      )}

      {/* Table & Floor Plan / Profile Customizer Modal */}
      {tableModalRestaurant && (
        <TableManagementModal
          restaurant={tableModalRestaurant}
          isOpen={isTableModalOpen}
          onClose={() => setIsTableModalOpen(false)}
        />
      )}

      {/* Restaurant Ambiance & Cover Photo Management Modal */}
      <RestaurantPhotoManagerModal
        isOpen={isPhotoModalOpen}
        restaurant={photoModalRestaurant}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Independent Websites & Standalone Portals Directory Modal */}
      <IndependentWebsitesDirectoryModal
        isOpen={isIndependentSitesOpen}
        onClose={() => setIsIndependentSitesOpen(false)}
        onOpenTableManagement={(r) => {
          setTableModalRestaurant(r);
          setIsTableModalOpen(true);
        }}
      />

      {/* Offboard Restaurant Confirmation Modal */}
      {offboardTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090D16]/60 backdrop-blur-xs">
          <div className="bg-[#0D1322] rounded-3xl max-w-md w-full p-6  border border-white/[0.08] animate-scaleUp text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <UserMinus className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Offboard {offboardTarget.name}?
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                This will remove <strong>{offboardTarget.name}</strong> from your active operational venues hub.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Note: You can re-onboard this restaurant at any time from the Pune Restaurant Directory below.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setOffboardTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:bg-white/[0.04] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = offboardTarget.id;
                  setOffboardTarget(null);
                  deleteRestaurant(targetId);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <UserMinus className="w-4 h-4" />
                <span>Confirm Offboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Direct Installation Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        showFloatingPrompt={false}
      />
    </div>
  );
};
