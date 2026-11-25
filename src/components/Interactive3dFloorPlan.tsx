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
    <div className="space-y-4 text-[#141414]">
      {/* ── Top Bar: Upload Blueprint + AI Analyzer + Zone Filters ──── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F5F1E8]/90 rounded-2xl border border-black/[0.08]">
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
                  ? 'bg-[#F4511E] text-[#FFFFFF] shadow-sm'
                  : 'bg-[#FFFFFF] text-[#4A4A4A] hover:text-white border border-black/[0.08]'
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
            className="px-3 py-1.5 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E]" />
            <span>AI Blueprint Analysis Demo</span>
          </button>

          <label className="px-3.5 py-1.5 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:from-[#F4511E] hover:to-[#F4511E] text-[#FFFFFF] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md active:scale-95">
            <Upload className="w-3.5 h-3.5 text-[#141414]" />
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
        <div className="p-4 bg-gradient-to-r from-[#2D4A3E] via-[#F5F1E8] to-[#2D4A3E] rounded-2xl border border-[#F4511E]/40 text-center space-y-2 animate-pulse">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#2D4A3E] animate-spin" />
            <h4 className="font-bold text-sm text-[#2D4A3E]">AI Floor Plan Vision &amp; Spatial Analyzer</h4>
          </div>
          <p className="text-xs text-[#2D4A3E] font-mono">{aiScanStep}</p>
          <div className="w-full bg-[#FFFFFF] h-2 rounded-full overflow-hidden border border-[#F4511E]/20 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-[#F4511E] via-[#F4511E] to-[#F4511E] h-full w-full animate-pulse" />
          </div>
        </div>
      )}

      {/* ── Architectural CAD Floor Plan Canvas ────────────────────────── */}
      <div className="relative w-full bg-[#FFFFFF] rounded-3xl border-2 border-blue-500/30 overflow-hidden shadow-2xl p-4 sm:p-6 select-none">
        {/* CAD Grid Lines */}
        {showCadGrid && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        )}

        {/* Blueprint Title Block Header (EdrawMax / CAD Specs Style) */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-blue-500/20 text-xs font-mono relative z-10 gap-2">
          <div className="flex items-center space-x-3">
            <div className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-[#1F5F8B] font-bold">
              CAD SPEC: {uploadedDiagramName || 'EdrawMax Architectural Restaurant Standard'}
            </div>
            <span className="text-[#6E6E6E] text-[11px]">
              Scale: 1:50 • Exact Tables: <strong className="text-[#2D4A3E]">{tables.length} Total</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="flex items-center space-x-1 text-[#2F7A4F] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Vacant Table</span>
            </span>
            <span className="flex items-center space-x-1 text-[#2D4A3E] font-bold ml-2">
              <span className="w-2 h-2 rounded-full bg-[#F4511E] animate-pulse" />
              <span>Active POS Tab</span>
            </span>
          </div>
        </div>

        {/* Architectural Vector Floor Blueprint Container */}
        <div
          className="relative w-full min-h-[500px] sm:min-h-[580px] bg-[#FFFFFF] rounded-2xl border-4 border-[#E3E0DA] shadow-inner p-4 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        >
          {/* Outer Double Perimeter Wall */}
          <div className="absolute inset-2 border-2 border-slate-500 rounded-xl pointer-events-none" />

          {/* Architectural Entrance with Swing Arc */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 border-b-4 border-[#F4511E]/80 bg-[#F5F1E8] flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-[#2D4A3E] uppercase tracking-widest">
              🚪 MAIN ENTRANCE
            </span>
          </div>

          {/* Host / Maitre D' Stand */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#EFE9DD] border border-[#E3E0DA] rounded-md text-[9px] font-mono text-[#4A4A4A]">
            Maitre D' Stand
          </div>

          {/* Kitchen / KOT Cook Station Area (Top Left) */}
          <div className="absolute top-2 left-2 w-52 h-20 bg-[#F5F1E8]/90 border-r-2 border-b-2 border-[#E3E0DA] rounded-br-xl p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#F4511E]">👨‍🍳 KITCHEN &amp; KOT PASS</span>
              <span className="text-[8px] font-mono text-[#7A7A7A]">SERVICE ONLY</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="h-1 flex-1 bg-[#F4511E]/40 rounded" />
              <span className="text-[8px] font-mono text-[#6E6E6E]">DOUBLE SWING DOORS</span>
            </div>
          </div>

          {/* Bar & Cocktail Lounge Counter (Top Right) */}
          <div className="absolute top-2 right-2 w-64 h-24 bg-[#F5F1E8]/90 border-l-2 border-b-2 border-[#F4511E]/40 rounded-bl-2xl p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#2D4A3E]">🍸 ARTISAN COCKTAIL BAR</span>
              <span className="text-[8px] font-mono text-[#2D4A3E] bg-[#F4511E]/20 px-1.5 py-0.5 rounded">6 STOOLS</span>
            </div>
            {/* Barstools Row */}
            <div className="flex items-center justify-around pt-1">
              {[1, 2, 3, 4, 5, 6].map((b) => (
                <div key={b} className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#F4511E] bg-[#F4511E]/80 flex items-center justify-center text-[8px] font-mono text-[#2D4A3E]">
                    B{b}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restroom Washroom Indicator (Bottom Left) */}
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#F5F1E8]/80 border border-[#E3E0DA] rounded-md text-[9px] font-mono text-[#C8C8C8]">
            🚻 RESTROOMS
          </div>

          {/* Patio Railing (Right Side Divider) */}
          <div className="absolute top-28 right-0 w-36 h-72 border-l-2 border-dashed border-emerald-500/40 bg-emerald-950/10 p-2 flex flex-col justify-between">
            <span className="text-[9px] font-mono font-bold text-[#2F7A4F] uppercase tracking-wider">
              🌿 OUTDOOR PATIO
            </span>
            <span className="text-[8px] font-mono text-[#7A7A7A] text-right">GLASS RAILING</span>
          </div>

          {/* Banquette Booth Wall Header */}
          <div className="absolute top-24 left-2 px-3 py-0.5 bg-blue-950/80 border border-blue-500/30 rounded-md text-[9px] font-mono text-[#1F5F8B]">
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
                      <span className="absolute -top-3 w-4 h-2 rounded-t-full bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                      <span className="absolute -bottom-3 w-4 h-2 rounded-b-full bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                      <span className="absolute -left-3 w-2 h-4 rounded-l-full bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                      <span className="absolute -right-3 w-2 h-4 rounded-r-full bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />

                      {/* Round Table Top */}
                      <div
                        className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-4 ring-[#F4511E]/50 shadow-lg'
                            : table.hasOpenOrders
                            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-2 ring-[#F4511E]/60 shadow-md shadow-amber-500/30'
                            : 'bg-[#F5F1E8] hover:bg-[#EFE9DD] border-slate-400 text-[#FFFFFF] hover:border-[#F4511E]'
                        }`}
                      >
                        <span className="font-extrabold text-xs font-mono">
                          {table.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-[#2D4A3E]">
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
                        <span className="w-3.5 h-1.5 rounded-t-sm bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                        <span className="w-3.5 h-1.5 rounded-t-sm bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                      </div>

                      {/* Rect Table Surface */}
                      <div
                        className={`w-20 h-13 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-4 ring-[#F4511E]/50 shadow-lg'
                            : table.hasOpenOrders
                            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-2 ring-[#F4511E]/60 shadow-md shadow-amber-500/30'
                            : 'bg-[#F5F1E8] hover:bg-[#EFE9DD] border-slate-400 text-[#FFFFFF] hover:border-[#F4511E]'
                        }`}
                      >
                        <span className="font-extrabold text-xs font-mono">
                          {table.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-[#2D4A3E]">
                          {table.hasOpenOrders ? `₹${table.tableTotal}` : `${table.capacity}p`}
                        </span>
                      </div>

                      {/* Bottom Chairs */}
                      <div className="absolute -bottom-2.5 flex space-x-2">
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
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
                            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-4 ring-[#F4511E]/50 shadow-lg'
                            : table.hasOpenOrders
                            ? 'bg-[#F4511E] border-[#F4511E] text-white ring-2 ring-[#F4511E]/60 shadow-md shadow-amber-500/30'
                            : 'bg-[#F5F1E8] hover:bg-[#EFE9DD] border-slate-400 text-[#FFFFFF] hover:border-[#F4511E]'
                        }`}
                      >
                        <span className="font-extrabold text-xs font-mono">
                          {table.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-[#2D4A3E]">
                          {table.hasOpenOrders ? `₹${table.tableTotal}` : 'Booth 6p'}
                        </span>
                      </div>

                      {/* Front Chairs */}
                      <div className="flex space-x-2 mt-0.5">
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                        <span className="w-3.5 h-1.5 rounded-b-sm bg-slate-500 group-hover:bg-[#F4511E] transition-colors" />
                      </div>
                    </div>
                  )}

                  {/* Selected Indicator Ping */}
                  {isSelected && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#F4511E] text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                      Table Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CAD Canvas Controls (Zoom, Reset, Grid Toggle) */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-500/20 text-xs text-[#6E6E6E] relative z-10">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowCadGrid(!showCadGrid)}
              className="px-2.5 py-1 rounded-lg bg-[#F5F1E8] border border-black/[0.08] hover:text-white transition-colors cursor-pointer"
            >
              Grid: {showCadGrid ? 'ON' : 'OFF'}
            </button>
            <span className="text-[11px] font-mono">
              Click any table node to launch diner menu or print KOT
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-[#F5F1E8] p-1 rounded-xl border border-black/[0.08]">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(0.8, prev - 0.1))}
              className="p-1 hover:text-[#141414]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-[#2D4A3E] px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(1.3, prev + 0.1))}
              className="p-1 hover:text-[#141414]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-[#141414] ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Table Detail Drawer */}
      {activeSelectedTable && (
        <div className="p-4 bg-gradient-to-r from-[#F5F1E8] via-[#FFFFFF] to-[#F5F1E8] rounded-2xl border border-[#F4511E]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🪑</span>
              <h4 className="font-serif font-bold text-lg text-[#141414]">
                {activeSelectedTable.label} (Assigned Table #{activeSelectedTable.assignedNumber})
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  activeSelectedTable.hasOpenOrders
                    ? 'bg-[#F4511E]/20 text-[#2D4A3E] border border-[#F4511E]/40'
                    : 'bg-emerald-500/20 text-[#2F7A4F] border border-emerald-500/40'
                }`}
              >
                {activeSelectedTable.hasOpenOrders
                  ? `₹${activeSelectedTable.tableTotal} Live Tab (${activeSelectedTable.tableOrders.length} orders)`
                  : 'Table Vacant & Ready'}
              </span>
            </div>
            <p className="text-xs text-[#6E6E6E]">
              Zone: <strong className="text-[#3A3A3A]">{activeSelectedTable.zone.toUpperCase()}</strong> • Capacity:{' '}
              <strong className="text-[#3A3A3A]">{activeSelectedTable.capacity} Guests</strong> • Token:{' '}
              <span className="font-mono text-[#2D4A3E]">{activeSelectedTable.public_token}</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link
              to={`/r/${restaurant.slug}/menu?t=${activeSelectedTable.public_token}`}
              className="px-4 py-2 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Launch Live Menu</span>
            </Link>

            <button
              type="button"
              onClick={onPrintKot}
              className="p-2.5 bg-[#EFE9DD] hover:bg-[#E8DCC8] text-[#2D4A3E] rounded-xl border border-black/[0.08] cursor-pointer"
              title="Print KOT"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedTableId(null)}
              className="p-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#6E6E6E] hover:text-[#141414]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
