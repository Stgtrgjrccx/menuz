import React from 'react';
import { DollarSign, ShoppingBag, Download, ToggleLeft, ToggleRight, QrCode, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

export const ManagerDashboard: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const tables = useRestaurantStore((state) => state.tables);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const orders = useRestaurantStore((state) => state.orders);
  const toggleItemAvailability = useRestaurantStore((state) => state.toggleItemAvailability);
  const resetToDefaults = useRestaurantStore((state) => state.resetToDefaults);

  const totalVolume = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = orders.length;

  const downloadTableQrSvg = (tableLabel: string, publicToken: string) => {
    const origin = window.location.origin;
    const targetUrl = `${origin}/r/saffron-house/menu?t=${publicToken}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(targetUrl)}&color=1C1917&bgcolor=FFFFFF`;

    const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;700&amp;display=swap');
      .serif { font-family: 'Playfair Display', Georgia, serif; }
      .sans { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    </style>
  </defs>
  <!-- Background Card -->
  <rect width="420" height="560" rx="32" fill="#FDFBF7" stroke="#EFE9DE" stroke-width="2"/>
  
  <!-- Outer Gold Border -->
  <rect x="24" y="24" width="372" height="512" rx="24" fill="none" stroke="#E85D04" stroke-width="2" stroke-dasharray="6 4"/>
  
  <!-- Header Branding -->
  <text x="210" y="75" text-anchor="middle" fill="#E85D04" class="sans" font-size="11" font-weight="700" letter-spacing="3">CONTEMPORARY INDIAN DINING</text>
  <text x="210" y="110" text-anchor="middle" fill="#1C1917" class="serif" font-size="28" font-weight="700">SAFFRON HOUSE</text>
  
  <!-- Table Badge -->
  <rect x="135" y="130" width="150" height="34" rx="17" fill="#FFEDD5"/>
  <text x="210" y="152" text-anchor="middle" fill="#C84B00" class="sans" font-size="14" font-weight="700">${tableLabel}</text>
  
  <!-- QR Code Framing -->
  <rect x="70" y="185" width="280" height="280" rx="20" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(28,25,23,0.06))"/>
  <image href="${qrApiUrl}" x="85" y="200" width="250" height="250"/>
  
  <!-- Instructions -->
  <text x="210" y="495" text-anchor="middle" fill="#1C1917" class="serif" font-size="15" font-weight="700">Scan to View Menu &amp; Order</text>
  <text x="210" y="515" text-anchor="middle" fill="#78716C" class="sans" font-size="11">No app download • Powered by Menuz AI</text>
</svg>`.trim();

    const blob = new Blob([svgTemplate], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SaffronHouse_${tableLabel.replace(/\s+/g, '_')}_QR.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-ivory-50 p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Bar */}
      <header className="flex flex-wrap justify-between items-center pb-5 border-b border-ivory-200 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
            Restaurant Operations Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">{restaurant.name}</h1>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          className="flex items-center space-x-1.5 text-xs text-charcoal-700 bg-white border border-ivory-200 px-3.5 py-2 rounded-xl shadow-subtle hover:bg-ivory-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-saffron-600" />
          <span>Reset Demo Catalog</span>
        </button>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-saffron-100 flex items-center justify-center text-saffron-700">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-700/60 font-medium">Session Revenue</span>
            <p className="font-serif text-2xl font-bold text-charcoal-900">₹{totalVolume.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-700/60 font-medium">Orders Placed</span>
            <p className="font-serif text-2xl font-bold text-charcoal-900">{totalOrdersCount} tickets</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-700/60 font-medium">Active QR Tables</span>
            <p className="font-serif text-2xl font-bold text-charcoal-900">{tables.length} tables</p>
          </div>
        </div>
      </div>

      {/* Table QR Card Generator */}
      <section className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-subtle">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Table QR Badges</h2>
            <p className="text-xs text-charcoal-700/60 mt-0.5">
              Download high-resolution, print-ready SVG cards with embedded table routing tokens.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-ivory-50/70 border border-ivory-200 rounded-2xl p-4 text-center space-y-3"
            >
              <div className="w-10 h-10 bg-saffron-100 text-saffron-700 rounded-xl mx-auto flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-base text-charcoal-900">{table.label}</p>
                <p className="text-[10px] text-charcoal-700/50 font-mono truncate">{table.public_token}</p>
              </div>
              <button
                type="button"
                onClick={() => downloadTableQrSvg(table.label, table.public_token)}
                className="w-full bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-subtle transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG Card</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Live Menu Availability (86 Stock Toggle) */}
      <section className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-subtle">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Live Kitchen Stock Manager (86-ing)
            </h2>
            <p className="text-xs text-charcoal-700/60 mt-0.5">
              Toggle dish availability instantly. Sold-out dishes immediately lock on diner phones and are excluded from AI recommendations.
            </p>
          </div>
        </div>

        <div className="divide-y divide-ivory-100">
          {menuItems.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-ivory-100"
                />
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-sm text-charcoal-900 truncate">{item.name}</h4>
                  <span className="text-xs text-saffron-700 font-semibold block">₹{item.price.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleItemAvailability(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                  item.is_available
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {item.is_available ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-green-700" />
                    <span>Available</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-red-700" />
                    <span>Sold Out (86)</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
