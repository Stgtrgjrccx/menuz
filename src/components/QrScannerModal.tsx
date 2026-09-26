import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Camera,
  X,
  QrCode,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Upload,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Flame,
  Info
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { PUNE_RESTAURANT_DIRECTORY, PuneRestaurantEntry } from '../data/puneRestaurantDirectory';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRestaurantSlug?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  defaultRestaurantSlug
}) => {
  const navigate = useNavigate();
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const [activeTab, setActiveTab] = useState<'camera' | 'tables' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Quick launch sample tables for instant testing & demonstration
  const demoTables = [
    {
      restaurantName: 'Saffron House',
      slug: 'saffron-house',
      tableLabel: 'Table 1',
      token: 'table-token-01-saffron',
      cuisine: 'Contemporary Indian Dining',
      badge: '🔥 Guaranteed Free Treat & 20% Off',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop'
    },
    {
      restaurantName: 'Casa Bella Trattoria',
      slug: 'casa-bella',
      tableLabel: 'Table 3',
      token: 'table-token-03-casabella',
      cuisine: 'Artisanal Italian Trattoria',
      badge: '🍮 Free Tiramisu & Discount Wheel',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop'
    },
    {
      restaurantName: 'Malaka Spice',
      slug: 'malaka-spice',
      tableLabel: 'Table 4',
      token: 'token-malaka-spice-04',
      cuisine: 'Pan-Asian & Thai Delights',
      badge: '🥟 Free Dim Sum & Special Cooler',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&auto=format&fit=crop'
    },
    {
      restaurantName: 'Paasha Rooftop Lounge',
      slug: 'paasha-rooftop',
      tableLabel: 'Table 2',
      token: 'token-paasha-rooftop-02',
      cuisine: 'North Indian & Sunset Cocktails',
      badge: '🍹 House Mocktail on Google Review',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&auto=format&fit=crop'
    }
  ];

  // Initialize camera when camera tab is active
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function startCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported in this browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        if (isMounted) {
          setCameraError(
            err.message || 'Unable to access camera. Please pick a table below or enter a code.'
          );
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleLaunchTable = (slug: string, token: string) => {
    // Check if restaurant is in store; if not, create it
    const existing = restaurants.find((r) => r.slug === slug);
    if (!existing) {
      const dirEntry = PUNE_RESTAURANT_DIRECTORY.find(
        (p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug || p.name.toLowerCase().includes(slug)
      );

      const name = dirEntry?.name || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      addRestaurant({
        id: `rest-${slug}-custom`,
        slug: slug,
        name: name,
        cuisine: dirEntry?.cuisine || 'Multi-Cuisine Dining',
        logo_url: dirEntry?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
        brand_colors: {
          primary: '#E85D04',
          background: '#FDFBF7',
          text: '#1C1917',
          accent: '#C84B00'
        },
        currency: 'INR',
        tax_rate_percent: 5.0,
        google_place_url: `https://search.google.com/local/writereview?placeid=${slug}`
      });
    }

    onClose();
    navigate(`/r/${slug}/menu?t=${token}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    let targetSlug = defaultRestaurantSlug || 'saffron-house';
    let targetToken = manualCode.trim();

    // Check if full URL was pasted: e.g. /#/r/saffron-house/menu?t=table-token-01
    if (manualCode.includes('/r/')) {
      const parts = manualCode.split('/r/')[1].split('/menu');
      if (parts[0]) targetSlug = parts[0];
      if (manualCode.includes('?t=')) {
        targetToken = manualCode.split('?t=')[1].split('&')[0];
      }
    }

    handleLaunchTable(targetSlug, targetToken);
  };

  // Simulate instant QR scan detection
  const handleSimulateScan = (slug: string, token: string, label: string) => {
    setScannedResult(`Found: ${label}`);
    setIsScanning(false);
    setTimeout(() => {
      handleLaunchTable(slug, token);
    }, 700);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999
      }}
      className="bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-charcoal-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white p-4.5 px-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-saffron-500/20 text-saffron-400 flex items-center justify-center border border-saffron-500/30">
              <QrCode className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Scan Table QR</h3>
              <p className="text-[11px] text-charcoal-300">Unlock your digital menu &amp; instant rewards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-ivory-200 bg-ivory-50/60 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-white text-saffron-700 shadow-sm font-bold border border-ivory-200'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tables')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'tables'
                ? 'bg-white text-saffron-700 shadow-sm font-bold border border-ivory-200'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Demo Tables</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-saffron-700 shadow-sm font-bold border border-ivory-200'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Enter Code</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* TAB 1: CAMERA SCANNER */}
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-full aspect-square max-w-[280px] bg-charcoal-900 rounded-3xl overflow-hidden shadow-inner border-2 border-charcoal-700 flex items-center justify-center">
                {/* Live video feed if available */}
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${cameraError ? 'hidden' : 'block'}`}
                />

                {/* Laser scan animation overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  {/* Viewfinder Target corners */}
                  <div className="w-full h-full border-2 border-dashed border-amber-400/60 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                    {/* Animated scanning laser */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#F59E0B] animate-bounce" />
                  </div>
                </div>

                {/* Fallback if camera permission is not granted */}
                {cameraError && (
                  <div className="absolute inset-0 bg-charcoal-900/90 p-5 flex flex-col items-center justify-center text-white space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-amber-200">Point Camera at Table QR</p>
                    <p className="text-[11px] text-charcoal-400 max-w-[200px] leading-relaxed">
                      Camera preview simulated in browser. You can tap below to scan any sample table instantly!
                    </p>
                  </div>
                )}

                {/* Success feedback */}
                {scannedResult && (
                  <div className="absolute inset-0 bg-emerald-950/90 text-white flex flex-col items-center justify-center space-y-2 p-4 animate-in fade-in">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                    <p className="text-sm font-bold">{scannedResult}</p>
                    <p className="text-xs text-emerald-200">Opening Digital Menu...</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-charcoal-800">
                  Align the table QR sticker within the square
                </p>
                <p className="text-[11px] text-charcoal-500">
                  Or select any sample table below to test the full diner experience immediately:
                </p>
              </div>

              {/* Quick simulation buttons */}
              <div className="w-full grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleSimulateScan('saffron-house', 'table-token-01-saffron', 'Saffron House - Table 1')
                  }
                  className="p-2.5 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 rounded-xl text-left transition-colors flex items-center space-x-2 group"
                >
                  <span className="text-xl">🍛</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 group-hover:text-saffron-700 truncate">
                      Saffron House
                    </p>
                    <p className="text-[10px] text-saffron-700 font-semibold">Table 1 • Indian</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSimulateScan('casa-bella', 'table-token-03-casabella', 'Casa Bella - Table 3')
                  }
                  className="p-2.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-left transition-colors flex items-center space-x-2 group"
                >
                  <span className="text-xl">🍕</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 group-hover:text-teal-700 truncate">
                      Casa Bella
                    </p>
                    <p className="text-[10px] text-teal-700 font-semibold">Table 3 • Italian</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DEMO TABLES */}
          {activeTab === 'tables' && (
            <div className="space-y-3">
              <p className="text-xs text-charcoal-600">
                Choose any active restaurant table to view live digital menus and spin the reward wheel:
              </p>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {demoTables.map((t) => (
                  <div
                    key={t.slug}
                    onClick={() => handleLaunchTable(t.slug, t.token)}
                    className="p-3 rounded-2xl border border-ivory-200 hover:border-saffron-300 hover:bg-saffron-50/50 transition-all cursor-pointer flex items-center space-x-3 group shadow-subtle"
                  >
                    <img
                      src={t.image}
                      alt={t.restaurantName}
                      className="w-16 h-16 min-w-[64px] max-w-[64px] rounded-xl object-cover border border-ivory-300 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-xs text-charcoal-900 group-hover:text-saffron-700 truncate">
                          {t.restaurantName}
                        </h4>
                        <span className="text-[10px] bg-charcoal-900 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                          {t.tableLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-500 truncate mt-0.5">{t.cuisine}</p>
                      <p className="text-[10px] text-saffron-700 font-semibold flex items-center space-x-1 mt-0.5">
                        <span>{t.badge}</span>
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-saffron-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL CODE ENTRY */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-charcoal-800">
                  Table Token or Menuz URL:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g. table-token-01-saffron"
                    className="w-full py-2.5 px-3.5 pl-9 rounded-xl border border-ivory-300 text-xs focus:outline-none focus:border-saffron-500 bg-ivory-50 text-charcoal-900"
                  />
                  <QrCode className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-charcoal-500">
                  You can paste a direct table token or full menu URL from your printed QR card.
                </p>
              </div>

              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-500 hover:brightness-105 active:scale-95 text-white font-serif text-xs font-bold shadow-float transition-all disabled:opacity-50"
              >
                Open Table Menu ↗
              </button>

              <div className="pt-2 border-t border-ivory-200">
                <p className="text-[11px] text-charcoal-600 text-center mb-2">Popular quick tokens:</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {['table-token-01-saffron', 'table-token-03-casabella', 'token-malaka-spice-04'].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => setManualCode(tok)}
                      className="text-[10px] font-mono bg-ivory-100 hover:bg-saffron-50 border border-ivory-200 text-charcoal-700 px-2 py-1 rounded-lg transition-colors"
                    >
                      {tok}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-ivory-50 border-t border-ivory-200 p-3 px-5 flex items-center justify-between text-[11px] text-charcoal-600">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Guaranteed reward upon Google review</span>
          </div>

          <button
            onClick={() => {
              onClose();
              navigate('/');
            }}
            className="text-saffron-700 hover:underline font-semibold"
          >
            Explore all restaurants →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
