import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, List as ListIcon, Map as MapIcon, QrCode, Sparkles, Star, Tag, User } from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { geoFor } from '../data/partnerGeo';
import type { MapPartner } from '../components/home/PartnerMap';

// The map library is large; load it only when the home screen is opened.
const PartnerMap = React.lazy(() => import('../components/home/PartnerMap'));

const MAPBOX_TOKEN = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) || '';

const C = {
  ink: '#141414',
  orange: '#F4511E',
  green: '#2D4A3E',
  sand: '#E8DCC8',
  paper: '#F5F1E8',
  line: '#E3E0DA',
  grey: '#6E6E6E'
};

const FILTERS: { id: string; label: string; match: (cuisine: string) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'mughlai', label: 'Mughlai', match: (c) => /mughlai|awadhi/i.test(c) },
  { id: 'italian', label: 'Italian', match: (c) => /italian|pizza/i.test(c) },
  { id: 'bakery', label: 'Bakery & Café', match: (c) => /bakery|coffee|café|cafe/i.test(c) },
  { id: 'continental', label: 'Continental', match: (c) => /continental|bistro/i.test(c) }
];

interface Venue {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  location: string;
  token: string;
  rating?: number;
  ratingCount?: number;
  lat?: number;
  lng?: number;
}

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((s) => s.restaurants);
  const tables = useRestaurantStore((s) => s.tables);

  const [view, setView] = useState<'map' | 'list'>('map');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Global events: other parts of the app can ask for the scanner or the AI concierge.
  useEffect(() => {
    const openScanner = () => setIsScannerOpen(true);
    const openAi = (e?: Event) => {
      const q = (e as CustomEvent<{ query?: string }> | undefined)?.detail?.query;
      if (q) setAiQuery(q);
      setIsAiOpen(true);
    };
    window.addEventListener('open-qr-scanner', openScanner);
    window.addEventListener('open-ai-assistant', openAi);
    return () => {
      window.removeEventListener('open-qr-scanner', openScanner);
      window.removeEventListener('open-ai-assistant', openAi);
    };
  }, []);

  // Customers only ever see restaurants that have signed up with Menuz.
  const venues = useMemo<Venue[]>(
    () =>
      rawRestaurants
        .filter((r) => r && r.id && !isDishNameAsRestaurant(r) && isWorkingWithMenuz(r))
        .map((r) => {
          const first = tables.find((t) => t.restaurant_id === r.id);
          const geo = geoFor(r.slug);
          return {
            id: r.id,
            name: r.name,
            slug: r.slug,
            cuisine: r.cuisine,
            location: (r.location || 'Pune').replace(/,?\s*Pune.*$/i, '') || 'Pune',
            token: first?.public_token || `table-token-01-${r.slug}`,
            rating: geo?.google?.rating,
            ratingCount: geo?.google?.count,
            lat: geo?.lat,
            lng: geo?.lng
          };
        }),
    [rawRestaurants, tables]
  );

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter) || FILTERS[0];
    return venues.filter((v) => f.match(v.cuisine));
  }, [venues, filter]);

  const mapPartners = useMemo<MapPartner[]>(
    () =>
      visible
        .filter((v) => typeof v.lat === 'number' && typeof v.lng === 'number')
        .map((v) => ({ id: v.id, name: v.name, lat: v.lat!, lng: v.lng!, rating: v.rating })),
    [visible]
  );

  const selected = visible.find((v) => v.id === selectedId) || visible[0] || null;
  const onSelect = useCallback((id: string) => setSelectedId(id), []);

  const openMenu = (v: Venue) => navigate(`/r/${v.slug}/menu?t=${v.token}`);

  const soon = (what: string) => {
    setNotice(`${what} is coming soon`);
    window.setTimeout(() => setNotice(null), 2200);
  };

  const showMap = view === 'map' && !!MAPBOX_TOKEN;

  return (
    <div
      className="relative flex flex-col w-full bg-white text-[#141414] overflow-hidden"
      style={{ height: '100dvh', fontFamily: "'Rubik', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-white z-20 max-w-[560px] mx-auto w-full">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: C.green, color: '#fff' }}>
          M
        </div>
        <div className="flex items-center gap-1.5" style={{ fontFamily: "'Anton', Impact, sans-serif", fontSize: 24, letterSpacing: 0.4 }}>
          PUNE <ChevronDown className="w-4 h-4" style={{ color: C.grey }} aria-hidden />
        </div>
        <button
          type="button"
          onClick={() => setIsAiOpen(true)}
          aria-label="Ask Saरा AI"
          className="w-9 h-9 rounded-full border flex items-center justify-center"
          style={{ borderColor: C.line }}
        >
          <Sparkles className="w-4 h-4" style={{ color: C.orange }} />
        </button>
      </header>

      {/* Map / List toggle */}
      <div className="mx-4 rounded-xl p-1 flex gap-1 z-20 self-center max-w-[560px] mx-auto w-full" style={{ background: '#F1EEE8', width: 'calc(100% - 2rem)' }} role="tablist">
        {(
          [
            ['map', 'Map', MapIcon],
            ['list', 'List', ListIcon]
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            role="tab"
            aria-selected={view === id}
            type="button"
            onClick={() => setView(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-medium"
            style={view === id ? { background: C.ink, color: '#fff' } : { color: C.grey }}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto z-20 max-w-[560px] mx-auto w-full" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className="whitespace-nowrap text-[12px] font-medium px-3 py-1.5 rounded-full border"
            style={
              filter === f.id
                ? { background: C.ink, borderColor: C.ink, color: '#fff' }
                : { background: '#fff', borderColor: C.line, color: '#3A3A3A' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="relative flex-1 min-h-0" style={{ background: C.paper }}>
        {showMap ? (
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: C.grey }}>Loading map…</div>}>
            <PartnerMap token={MAPBOX_TOKEN} partners={mapPartners} selectedId={selected?.id ?? null} onSelect={onSelect} />
          </Suspense>
        ) : (
          <div className="absolute inset-0 overflow-y-auto p-4 pb-28 space-y-3 [&>*]:max-w-[560px] [&>*]:mx-auto [&>*]:block">
            {visible.length === 0 && (
              <p className="text-center text-sm pt-10" style={{ color: C.grey }}>
                No partner restaurants match this filter yet.
              </p>
            )}
            {visible.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => openMenu(v)}
                className="w-full text-left bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <p style={{ fontFamily: "'Anton', Impact, sans-serif", fontSize: 20, letterSpacing: 0.3 }}>{v.name.toUpperCase()}</p>
                  <p className="text-xs mt-1" style={{ color: C.grey }}>
                    {v.cuisine} · {v.location}
                  </p>
                </div>
                {typeof v.rating === 'number' && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: C.green, color: '#fff' }}>
                    ★ {v.rating.toFixed(1)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected restaurant sheet */}
      {showMap && selected && (
        <section
          className="absolute z-30 bg-white rounded-t-[22px] px-4 pt-2.5 pb-3 w-full max-w-[560px]"
          style={{ bottom: 92, left: '50%', transform: 'translateX(-50%)', boxShadow: '0 -6px 24px rgba(0,0,0,.10)' }}
          aria-label={`${selected.name} details`}
        >
          <div className="w-10 h-1 rounded mx-auto mb-3" style={{ background: '#DEDAD2' }} />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate" style={{ fontFamily: "'Anton', Impact, sans-serif", fontSize: 21, letterSpacing: 0.3 }}>
                {selected.name.toUpperCase()}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: C.grey }}>
                {selected.cuisine} · {selected.location}
              </p>
            </div>
            {typeof selected.rating === 'number' ? (
              <div className="shrink-0 rounded-xl px-3 py-1.5 text-center border" style={{ borderColor: C.line }}>
                <p className="flex items-center gap-1 text-[17px] font-semibold" style={{ color: C.green }}>
                  <Star className="w-3.5 h-3.5 fill-current" aria-hidden /> {selected.rating.toFixed(1)}
                </p>
                <p className="text-[9px] tracking-[0.12em] font-semibold" style={{ color: '#9A9A9A' }}>
                  GOOGLE{selected.ratingCount ? ` · ${selected.ratingCount}` : ''}
                </p>
              </div>
            ) : (
              <p className="shrink-0 text-[10px] tracking-[0.1em] font-semibold pt-1" style={{ color: '#A39D8E' }}>
                NO RATING YET
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => openMenu(selected)}
            className="w-full mt-3 py-3.5 rounded-xl text-[14px] font-medium"
            style={{ background: C.ink, color: '#fff' }}
          >
            View menu
          </button>
        </section>
      )}

      {/* "Coming soon" toast */}
      {notice && (
        <div
          role="status"
          className="absolute left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-[13px]"
          style={{ bottom: 190, background: C.ink, color: '#fff' }}
        >
          {notice}
        </div>
      )}

      {/* Bottom bar */}
      <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t pt-2 pb-4" style={{ borderColor: C.line }} aria-label="Main">
        <div className="flex items-end max-w-[560px] mx-auto w-full">
        <NavItem label="Map" icon={<MapIcon className="w-5 h-5" />} active={view === 'map'} onClick={() => setView('map')} />
        <NavItem label="Offers" icon={<Tag className="w-5 h-5" />} onClick={() => soon('Offers')} />
        <div className="flex-1 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            aria-label="Scan table QR code"
            className="relative flex items-center justify-center rounded-full"
            style={{
              color: '#fff',
              width: 62,
              height: 62,
              marginTop: -26,
              background: C.orange,
              boxShadow: '0 7px 18px rgba(244,81,30,.45), 0 0 0 5px #fff'
            }}
          >
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: C.orange, opacity: 0.18 }} aria-hidden />
            <QrCode className="w-7 h-7 relative" />
          </button>
          <span className="text-[10px] font-semibold mt-1" style={{ color: C.orange }}>
            Scan
          </span>
        </div>
        <NavItem label="Rewards" icon={<Heart className="w-5 h-5" />} onClick={() => soon('Rewards')} />
        <NavItem label="Profile" icon={<User className="w-5 h-5" />} onClick={() => soon('Profiles')} />
        </div>
      </nav>

      {isScannerOpen && <QrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />}

      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAiQuery(null);
        }}
        focusDish={null}
        onConfirmAdd={() => navigate('/menu')}
        initialQuery={aiQuery}
      />
    </div>
  );
};

const NavItem: React.FC<{ label: string; icon: React.ReactNode; active?: boolean; onClick: () => void }> = ({
  label,
  icon,
  active,
  onClick
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 flex flex-col items-center gap-1 text-[10px]"
    style={{ color: active ? C.ink : '#A5A5A5', fontWeight: active ? 600 : 400 }}
  >
    {icon}
    {label}
  </button>
);
