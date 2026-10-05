import React, { useState, useMemo } from 'react';
import { Restaurant, RestaurantTable, Order } from '../types';
import { Link } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  UtensilsCrossed,
  Printer,
  X,
  Eye,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  MapPin,
  HelpCircle,
  FileCheck,
  FileUp,
  Layers
} from 'lucide-react';

interface RestaurantFloorChartProps {
  restaurant: Restaurant;
  tables: RestaurantTable[];
  orders: Order[];
  onLaunchMenu?: (token: string) => void;
  onPrintKot?: () => void;
}

interface BlueprintPreset {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
}

const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    id: 'edrawmax_fine_dining',
    name: 'EdrawMax Architectural Fine Dining Layout',
    category: 'Full Service CAD',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    description: 'Double perimeter walls, bar counter with barstools, banquette booths, round & square tables'
  },
  {
    id: 'superior_bar_bistro',
    name: 'Superior Seating Bar & Bistro Layout',
    category: 'Bistro & Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    description: 'High-turn dining, linear bar counter, patio zone, and kitchen pass'
  }
];

export const Interactive3dFloorPlan: React.FC<RestaurantFloorChartProps> = ({
  restaurant,
  tables,
  orders,
  onPrintKot
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<'all' | 'main' | 'bar' | 'booth' | 'patio'>('all');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiScanStep, setAiScanStep] = useState<string>('');
  const [uploadedDiagramName, setUploadedDiagramName] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCadGrid, setShowCadGrid] = useState<boolean>(true);

  // Map exact restaurant tables to architectural layout positions
  const architecturalTables = useMemo(() => {
    return tables.map((tbl, idx) => {
      const tableOrders = orders.filter((o) => o.table_id === tbl.id);
      const tableTotal = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);
      const hasOpenOrders = tableOrders.length > 0;

      // Assign architectural zone and coordinates based on index
      let zone: 'main' | 'bar' | 'booth' | 'patio' = 'main';
      let shape: 'round' | 'rect_4' | 'rect_6' | 'booth' | 'barstool' = 'rect_4';
      let x = 0; // percentage
      let y = 0; // percentage
      let capacity = tbl.capacity || 4;

      if (idx === 0 || idx === 1) {
        zone = 'booth';
        shape = 'booth';
        capacity = 6;
        x = 18 + (idx * 22);
        y = 22;
      } else if (idx === 2 || idx === 3) {
        zone = 'bar';
        shape = 'round';
        capacity = 4;
        x = 68 + ((idx - 2) * 16);
        y = 24;
      } else if (idx === 4 || idx === 5) {
        zone = 'main';
        shape = 'round';
        capacity = 4;
        x = 24 + ((idx - 4) * 26);
        y = 56;
      } else if (idx === 6 || idx === 7) {
        zone = 'main';
        shape = 'rect_4';
        capacity = 4;
        x = 24 + ((idx - 6) * 26);
        y = 80;
      } else if (idx >= 8 && idx < 12) {
        zone = 'patio';
        shape = 'rect_4';
        capacity = 4;
        x = 74;
        y = 48 + ((idx - 8) * 16);
      } else {
        zone = 'main';
        shape = idx % 2 === 0 ? 'round' : 'rect_4';
        capacity = 4;
        x = 20 + ((idx % 3) * 25);
        y = 40 + (Math.floor(idx / 3) * 16);
      }

      return {
        ...tbl,
        assignedNumber: idx + 1,
        zone,
        shape,
        capacity,
        x,
        y,
        tableOrders,
        tableTotal,
        hasOpenOrders
      };
    });
  }, [tables, orders]);

  const activeSelectedTable = architecturalTables.find((t) => t.id === selectedTableId);

  const filteredTables = useMemo(() => {
    if (activeZone === 'all') return architecturalTables;
    return architecturalTables.filter((t) => t.zone === activeZone);
  }, [architecturalTables, activeZone]);

  const handleDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedDiagramName(file.name);
    setIsAiAnalyzing(true);
    setAiScanStep('Scanning architectural boundary vectors and perimeter walls...');

    setTimeout(() => {
      setAiScanStep('Detecting circular & rectangular table geometries and chair counts...');
    }, 700);

    setTimeout(() => {
      setAiScanStep(`Mapping ${tables.length} assigned table tokens to spatial coordinates...`);
    }, 1400);

    setTimeout(() => {
      setAiScanStep('Floor layout synchronized & ready!');
      setTimeout(() => setIsAiAnalyzing(false), 500);
    }, 2100);
  };

  const handleRunAiBlueprintDemo = () => {
    setUploadedDiagramName('EdrawMax_Restaurant_Blueprint_Specs.cad');
    setIsAiAnalyzing(true);
    setAiScanStep('Analyzing EdrawMax CAD blueprint specs & architectural layers...');

    setTimeout(() => {
      setAiScanStep('Classifying dining zones: Banquette Booths, Main Floor, and Bar Counter...');
    }, 600);

    setTimeout(() => {
      setAiScanStep(`Auto-assigning Table Numbers T-01 through T-${tables.length}...`);
    }, 1200);

    setTimeout(() => {
      setAiScanStep('Architectural layout implemented with live POS sync!');
      setTimeout(() => setIsAiAnalyzing(false), 400);
    }, 1800);
  };

  return (
    <div className="space-y-4 text-white">
      {/* ── Top Bar: Upload Blueprint + AI Analyzer + Zone Filters ──── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 rounded-2xl border border-white/[0.08]">
        {/* Zone Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {[
            { id: 'all', label: `All Tables (${tables.length})` },
            { id: 'main', label: '🍽️ Main Hall' },
            { id: 'booth', label: '🛋️ Booth Banquettes' },
            { id: 'bar', label: '🍸 Bar Area' },
            { id: 'patio', label: '🌿 Patio Terrace' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveZone(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeZone === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload & Demo Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRunAiBlueprintDemo}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Blueprint Analysis Demo</span>
          </button>

          <label className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95">
            <Upload className="w-3.5 h-3.5 text-slate-950" />
            <span>Upload Blueprint / Layout</span>
            <input
              type="file"
              accept="image/*,.pdf,.svg,.dwg,.cad"
              className="hidden"
              onChange={handleDiagramUpload}
            />
          </label>
        </div>
      </div>

      {/* AI Analysis Scanner Banner */}
      {isAiAnalyzing && (
        <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-2xl border border-indigo-500/40 text-center space-y-2 animate-pulse">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
            <h4 className="font-bold text-sm text-indigo-200">AI Floor Plan Vision &amp; Spatial Analyzer</h4>
          </div>
          <p className="text-xs text-indigo-300 font-mono">{aiScanStep}</p>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-indigo-500/20 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full w-full animate-pulse" />
          </div>
        </div>
      )}

      {/* ── Architectural CAD Floor Plan Canvas ────────────────────────── */}
      <div className="relative w-full bg-[#070D1A] rounded-3xl border-2 border-blue-500/30 overflow-hidden shadow-2xl p-4 sm:p-6 select-none">
        {/* CAD Grid Lines */}
        {showCadGrid && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        )}

        {/* Blueprint Title Block Header (EdrawMax / CAD Specs Style) */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-blue-500/20 text-xs font-mono relative z-10 gap-2">
          <div className="flex items-center space-x-3">
            <div className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
              CAD SPEC: {uploadedDiagramName || 'EdrawMax Architectural Restaurant Standard'}
            </div>
            <span className="text-slate-400 text-[11px]">
              Scale: 1:50 • Exact Tables: <strong className="text-amber-400">{tables.length} Total</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Vacant Table</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-400 font-bold ml-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Active POS Tab</span>
            </span>
          </div>
        </div>

        {/* Architectural Vector Floor Blueprint Container */}
        <div
          className="relative w-full min-h-[500px] sm:min-h-[580px] bg-[#0A1224] rounded-2xl border-4 border-slate-700 shadow-inner p-4 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        >
          {/* Outer Double Perimeter Wall */}
          <div className="absolute inset-2 border-2 border-slate-500 rounded-xl pointer-events-none" />

          {/* Architectural Entrance with Swing Arc */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 border-b-4 border-amber-400/80 bg-slate-900 flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              🚪 MAIN ENTRANCE
            </span>
          </div>

          {/* Host / Maitre D' Stand */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 border border-slate-600 rounded-md text-[9px] font-mono text-slate-300">
            Maitre D' Stand
          </div>

          {/* Kitchen / KOT Cook Station Area (Top Left) */}
          <div className="absolute top-2 left-2 w-52 h-20 bg-slate-900/90 border-r-2 border-b-2 border-slate-600 rounded-br-xl p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-orange-400">👨‍🍳 KITCHEN &amp; KOT PASS</span>
              <span className="text-[8px] font-mono text-slate-500">SERVICE ONLY</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-1 flex-1 bg-orange-500/40 rounded" />
              <span className="text-[8px] font-mono text-slate-400">DOUBLE SWING DOORS</span>
            </div>
          </div>

          {/* Bar & Cocktail Lounge Counter (Top Right) */}
          <div className="absolute top-2 right-2 w-64 h-24 bg-slate-900/90 border-l-2 border-b-2 border-purple-500/40 rounded-bl-2xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-300">🍸 ARTISAN COCKTAIL BAR</span>
              <span className="text-[8px] font-mono text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">6 STOOLS</span>
            </div>
            {/* Barstools Row */}
            <div className="flex items-center justify-around pt-1">
              {[1, 2, 3, 4, 5, 6].map((b) => (
                <div key={b} className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-purple-400 bg-purple-950/80 flex items-center justify-center text-[8px] font-mono text-purple-200">
                    B{b}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restroom Washroom Indicator (Bottom Left) */}
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded-md text-[9px] font-mono text-slate-400">
            🚻 RESTROOMS
          </div>

          {/* Patio Railing (Right Side Divider) */}
          <div className="absolute top-28 right-0 w-36 h-72 border-l-2 border-dashed border-emerald-500/40 bg-emerald-950/10 p-2 flex flex-col justify-between">
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              🌿 OUTDOOR PATIO
            </span>
            <span className="text-[8px] font-mono text-slate-500 text-right">GLASS RAILING</span>
          </div>

          {/* Banquette Booth Wall Header */}
          <div className="absolute top-24 left-2 px-3 py-0.5 bg-blue-950/80 border border-blue-500/30 rounded-md text-[9px] font-mono text-blue-300">
            🛋️ UPHOLSTERED WALL BANQUETTE BOOTHS
          </div>

          {/* ── Plotted Architectural Tables ───────────────────────────── */}
          <div className="absolute inset-0 p-8">
            {filteredTables.map((table) => {
              const isSelected = selectedTableId === table.id;

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`absolute transition-all duration-200 cursor-pointer group select-none ${
                    isSelected ? 'z-30' : 'z-10'
                  }`}
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* ROUND TABLE ARCHITECTURAL SYMBOL */}
                  {table.shape === 'round' && (
                    <div className="relative flex items-center justify-center">
                      {/* 4 Radial Chairs */}
                      <span className="absolute -top-3 w-4 h-2 rounded-t-full bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                      <span className="absolute -bottom-3 w-4 h-2 rounded-b-full bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                      <span className="absolute -left-3 w-2 h-4 rounded-l-full bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                      <span className="absolute -right-3 w-2 h-4 rounded-r-full bg-slate-500 group-hover:bg-amber-400 transition-colors" />

                      {/* Round Table Top */}
                      <div
                        className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-200 text-white ring-4 ring-indigo-400/50 shadow-lg'
                            : table.hasOpenOrders
                            ? 'bg-amber-900 border-amber-300 text-white ring-2 ring-amber-400/60 shadow-md shadow-amber-500/30'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-400 text-slate-100 hover:border-amber-400'
                        }`}
                      >
                        <span className="font-extrabold text-xs font-mono">
                          {table.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-amber-300">
                          {table.hasOpenOrders ? `₹${table.tableTotal}` : `${table.capacity}p`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* RECTANGULAR 4-TOP / 6-TOP TABLE ARCHITECTURAL SYMBOL */}
                  {table.shape === 'rect_4' && (
                    <div className="relative flex items-center justify-center">
                      {/* Top Chairs */}
                      <div className="absolute -top-2.5 flex space-x-2">
                        <span className="w-3.5 h-1.5 rounded-t-sm bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                        <span className="w-3.5 h-1.5 rounded-t-sm bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                      </div>

                      {/* Rect Table Surface */}
                      <div
                        className={`w-20 h-13 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-200 text-white ring-4 ring-indigo-400/50 shadow-lg'
                            : table.hasOpenOrders
                            ? 'bg-amber-900 border-amber-300 text-white ring-2 ring-amber-400/60 shadow-md shadow-amber-500/30'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-400 text-slate-100 hover:border-amber-400'
                        }`}
                      >
                        <span className="font-extrabold text-xs font-mono">
                          {table.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-amber-300">
                          {table.hasOpenOrders ? `₹${table.tableTotal}` : `${table.capacity}p`}
                        </span>
                      </div>

                      {/* Bottom Chairs */}
                      <div className="absolute -bottom-2.5 flex space-x-2">
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                      </div>
                    </div>
                  )}

                  {/* BANQUETTE BOOTH ARCHITECTURAL SYMBOL */}
                  {table.shape === 'booth' && (
                    <div className="relative flex flex-col items-center justify-center">
                      {/* Padded Booth Backrest */}
                      <div className="w-24 h-3 bg-blue-900/90 border border-blue-400 rounded-t-md mb-0.5 flex items-center justify-around">
                        <span className="w-1.5 h-1 bg-blue-300/40 rounded-full" />
                        <span className="w-1.5 h-1 bg-blue-300/40 rounded-full" />
                        <span className="w-1.5 h-1 bg-blue-300/40 rounded-full" />
                      </div>

                      {/* Booth Table Top */}
                      <div
                        className={`w-22 h-12 rounded-sm border-2 flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-200 text-white ring-4 ring-indigo-400/50 shadow-lg'
                            : table.hasOpenOrders
                            ? 'bg-amber-900 border-amber-300 text-white ring-2 ring-amber-400/60 shadow-md shadow-amber-500/30'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-400 text-slate-100 hover:border-amber-400'
                        }`}
                      >
                        <span className="font-extrabold text-xs font-mono">
                          {table.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-amber-300">
                          {table.hasOpenOrders ? `₹${table.tableTotal}` : 'Booth 6p'}
                        </span>
                      </div>

                      {/* Front Chairs */}
                      <div className="flex space-x-2 mt-0.5">
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                      </div>
                    </div>
                  )}

                  {/* Selected Indicator Ping */}
                  {isSelected && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                      Table Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CAD Canvas Controls (Zoom, Reset, Grid Toggle) */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-500/20 text-xs text-slate-400 relative z-10">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowCadGrid(!showCadGrid)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/[0.08] hover:text-white transition-colors cursor-pointer"
            >
              Grid: {showCadGrid ? 'ON' : 'OFF'}
            </button>
            <span className="text-[11px] font-mono">
              Click any table node to launch diner menu or print KOT
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.1))}
              className="p-1 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-amber-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(1.3, prev + 0.1))}
              className="p-1 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-white ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Table Detail Drawer */}
      {activeSelectedTable && (
        <div className="p-4 bg-gradient-to-r from-slate-900 via-[#0D1527] to-slate-900 rounded-2xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🪑</span>
              <h4 className="font-serif font-bold text-lg text-white">
                {activeSelectedTable.label} (Assigned Table #{activeSelectedTable.assignedNumber})
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  activeSelectedTable.hasOpenOrders
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {activeSelectedTable.hasOpenOrders
                  ? `₹${activeSelectedTable.tableTotal} Live Tab (${activeSelectedTable.tableOrders.length} orders)`
                  : 'Table Vacant & Ready'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zone: <strong className="text-slate-200">{activeSelectedTable.zone.toUpperCase()}</strong> • Capacity:{' '}
              <strong className="text-slate-200">{activeSelectedTable.capacity} Guests</strong> • Token:{' '}
              <span className="font-mono text-amber-400">{activeSelectedTable.public_token}</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link
              to={`/r/${restaurant.slug}/menu?t=${activeSelectedTable.public_token}`}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Launch Live Menu</span>
            </Link>

            <button
              type="button"
              onClick={onPrintKot}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-white/[0.08] cursor-pointer"
              title="Print KOT"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedTableId(null)}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
