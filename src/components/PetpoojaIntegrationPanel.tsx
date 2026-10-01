import React, { useState } from 'react';
import { 
  Printer, 
  CheckCircle2, 
  Terminal, 
  Send, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Receipt,
  HelpCircle,
  Copy,
  ExternalLink,
  Tag
} from 'lucide-react';
import { Restaurant, PetpoojaConfig, Order, PetpoojaKotReceipt } from '../types';
import { sendOrderToPetpooja, buildPetpoojaOrderPayload } from '../services/petpoojaService';

interface PetpoojaIntegrationPanelProps {
  restaurant: Restaurant;
  onUpdateConfig?: (config: PetpoojaConfig) => void;
}

export const PetpoojaIntegrationPanel: React.FC<PetpoojaIntegrationPanelProps> = ({
  restaurant,
  onUpdateConfig
}) => {
  // Existing or default config
  const [config, setConfig] = useState<PetpoojaConfig>(
    restaurant.petpooja_config || {
      enabled: true,
      rest_id: restaurant.id === 'rest-saffron-house-01' ? 'pp_pune_saffron_01' : 'pp_pune_casabella_02',
      app_key: 'pp_live_key_982348a7b1',
      app_secret: '••••••••••••••••••••••••••••',
      environment: 'sandbox',
      auto_push_kot: true,
      auto_sync_menu: true,
      last_synced_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  );

  const [savedNotification, setSavedNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'credentials' | 'guide'>('simulator');
  const [simTable, setSimTable] = useState('Table 4 (Patio)');
  const [simDinerName, setSimDinerName] = useState('Rahul Verma');
  const [includeFoodReward, setIncludeFoodReward] = useState(false);
  const [isFiringKot, setIsFiringKot] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<PetpoojaKotReceipt | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  // Sample order for simulator
  const sampleOrder: Order = {
    id: 'ord-sim-' + Date.now(),
    restaurant_id: restaurant.id,
    table_id: 'tbl-4',
    table_label: simTable,
    anonymous_session_id: 'sess-sim-883',
    order_number: 'ORD-' + Math.floor(100 + Math.random() * 900),
    source: 'menuz',
    status: 'received',
    currency: '₹',
    subtotal_amount: 1040,
    tax_amount: 52,
    total_amount: 1092,
    customer_notes: 'Extra crispy naan, separate mint chutney please.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 'item-1',
        order_id: 'ord-sim',
        menu_item_id: 'mi-101',
        item_name_snapshot: restaurant.id === 'rest-saffron-house-01' ? 'Old Delhi Butter Chicken' : 'Wood-Fired Margherita Pizza',
        unit_price_snapshot: restaurant.id === 'rest-saffron-house-01' ? 480 : 540,
        quantity: 1,
        selected_options_snapshot: [{ option_id: 'opt-spice', name: 'Medium Spice', price_modifier: 0 }],
        line_total_amount: restaurant.id === 'rest-saffron-house-01' ? 480 : 540
      },
      {
        id: 'item-2',
        order_id: 'ord-sim',
        menu_item_id: 'mi-102',
        item_name_snapshot: restaurant.id === 'rest-saffron-house-01' ? 'Slow-Cooked Dal Makhani' : 'Truffle & Porcini Tagliatelle',
        unit_price_snapshot: restaurant.id === 'rest-saffron-house-01' ? 360 : 420,
        quantity: 1,
        selected_options_snapshot: [{ option_id: 'opt-butter', name: 'Extra White Butter', price_modifier: 40 }],
        line_total_amount: restaurant.id === 'rest-saffron-house-01' ? 400 : 460
      },
      {
        id: 'item-3',
        order_id: 'ord-sim',
        menu_item_id: 'mi-103',
        item_name_snapshot: restaurant.id === 'rest-saffron-house-01' ? 'Garlic Butter Naan' : 'Classic Garlic Herb Focaccia',
        unit_price_snapshot: restaurant.id === 'rest-saffron-house-01' ? 80 : 120,
        quantity: 2,
        selected_options_snapshot: [],
        line_total_amount: restaurant.id === 'rest-saffron-house-01' ? 160 : 240
      }
    ]
  };

  const handleSaveConfig = () => {
    if (onUpdateConfig) {
      onUpdateConfig(config);
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleTestKot = async () => {
    setIsFiringKot(true);
    const orderToDispatch: Order = includeFoodReward
      ? {
          ...sampleOrder,
          items: [
            ...sampleOrder.items,
            {
              id: 'ord-it-comp',
              order_id: 'ord-sim',
              menu_item_id: 'mi-comp-dessert',
              item_name_snapshot: 'Complimentary Chef Dessert (Food Reward)',
              unit_price_snapshot: 0,
              quantity: 1,
              selected_options_snapshot: [],
              line_total_amount: 0
            }
          ]
        }
      : sampleOrder;

    try {
      const res = await sendOrderToPetpooja(orderToDispatch, restaurant, config);
      setLastReceipt(res.receipt);
    } finally {
      setIsFiringKot(false);
    }
  };

  return (
    <div className="bg-[#0D1322] rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="bg-white text-orange-700 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Official POS Bridge
              </span>
              <span className="bg-orange-500/40 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Petpooja Certified JSON Spec
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Petpooja POS Direct Kitchen Dispatch
            </h2>
            <p className="text-sm text-orange-100 max-w-xl mt-1">
              Diners scan the table QR code and place their orders. Tickets print directly in your kitchen in 1 second with zero staff handwriting errors.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10 self-start md:self-auto">
            <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <div className="text-xs font-bold leading-none">
                {config.enabled ? 'POS Link Active' : 'POS Link Paused'}
              </div>
              <div className="text-[10px] text-orange-200 mt-0.5">
                RestID: <code className="font-mono text-white">{config.rest_id}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mt-6 border-t border-white/20 pt-4">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'simulator'
                ? 'bg-white text-orange-800 shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Printer className="w-3.5 h-3.5" /> Live KOT Simulator
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'credentials'
                ? 'bg-white text-orange-800 shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> API Keys & Credentials
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'guide'
                ? 'bg-white text-orange-800 shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Pilot Onboarding Guide (Option 3)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {/* TAB 1: LIVE KOT SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" /> Test Kitchen KOT Dispatch
                </h3>
                <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                  Fire a test order from Menuz to verify the thermal kitchen receipt layout and ensure that kitchen ticket items and optional food rewards dispatch accurately to printers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Simulated Table</label>
                    <select
                      value={simTable}
                      onChange={(e) => setSimTable(e.target.value)}
                      className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 bg-[#090D16]"
                    >
                      <option value="Table 1 (Indoor)">Table 1 (Indoor)</option>
                      <option value="Table 2 (Indoor)">Table 2 (Indoor)</option>
                      <option value="Table 4 (Patio)">Table 4 (Patio)</option>
                      <option value="Table 8 (Family AC)">Table 8 (Family AC)</option>
                      <option value="Table 12 (Balcony)">Table 12 (Balcony)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Diner Name</label>
                    <input
                      type="text"
                      value={simDinerName}
                      onChange={(e) => setSimDinerName(e.target.value)}
                      className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 bg-[#090D16]"
                    />
                  </div>
                </div>

                {/* Optional Food-as-Reward Injection */}
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-orange-600" /> Optional: Complimentary Food Reward
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Discounts are completely optional. Many owners prefer rewarding diners with a complimentary food/dessert item rather than discounting the bill.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                      <input
                        type="checkbox"
                        checked={includeFoodReward}
                        onChange={(e) => setIncludeFoodReward(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {includeFoodReward && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-2">
                      <span>🎁</span>
                      <span>1x Complimentary Chef Dessert (₹0) added to kitchen ticket. Zero bill discount deducted.</span>
                    </div>
                  )}
                </div>

                {/* Items Preview */}
                <div className="border border-gray-200 rounded-xl p-3 bg-[#090D16] space-y-2">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Basket Summary (3 Items)
                  </div>
                  {sampleOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="font-semibold text-gray-900">{it.quantity}x {it.item_name_snapshot}</span>
                        {it.selected_options_snapshot.length > 0 && (
                          <span className="text-[10px] text-gray-500 block">
                            ↳ {it.selected_options_snapshot.map((o) => o.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-gray-700">₹{it.line_total_amount}</span>
                    </div>
                  ))}
                  <div className="text-[11px] text-gray-500 italic pt-1">
                    Special Note: "{sampleOrder.customer_notes}"
                  </div>
                </div>

                {/* Fire Button */}
                <button
                  type="button"
                  disabled={isFiringKot}
                  onClick={handleTestKot}
                  className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isFiringKot ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching to Petpooja KOT Engine...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> ⚡ Fire KOT into Petpooja Kitchen Station
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Thermal Receipt Preview */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-gray-600" /> Kitchen Thermal Printer Preview (80mm)
                </span>
                {lastReceipt && (
                  <button
                    onClick={() => setShowJsonPayload(!showJsonPayload)}
                    className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Terminal className="w-3.5 h-3.5" /> {showJsonPayload ? 'View Receipt' : 'View Raw JSON Payload'}
                  </button>
                )}
              </div>

              {/* Thermal Paper Styling */}
              {showJsonPayload && lastReceipt ? (
                <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[480px]">
                  <pre>{JSON.stringify(lastReceipt.raw_payload, null, 2)}</pre>
                </div>
              ) : (
                <div className="bg-amber-50/30 border-2 border-dashed border-gray-300 rounded-xl p-5 shadow-sm font-mono text-xs text-gray-900 leading-relaxed max-w-md mx-auto">
                  {lastReceipt ? (
                    <div>
                      {/* Thermal Receipt Header */}
                      <div className="text-center border-b border-dashed border-gray-400 pb-3">
                        <div className="text-base font-black tracking-tight">{lastReceipt.restaurant_name.toUpperCase()}</div>
                        <div className="text-[11px] font-bold text-gray-600">PETPOOJA KITCHEN ORDER TICKET (KOT)</div>
                        <div className="text-xs font-bold mt-1 text-orange-800 bg-orange-100/80 px-2 py-0.5 rounded-sm inline-block">
                          {lastReceipt.kot_number}
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold text-sm text-black">
                          <span>{lastReceipt.table_label.toUpperCase()}</span>
                          <span>{lastReceipt.timestamp}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>PP Order Ref: {lastReceipt.petpooja_order_id}</span>
                          <span>Type: DINE-IN</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Source: {lastReceipt.server_name}</span>
                          <span>Diner: {simDinerName}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="py-3 border-b border-dashed border-gray-400 space-y-2">
                        <div className="flex justify-between font-bold text-[11px] text-gray-500 pb-1 border-b border-gray-200">
                          <span>ITEM NAME</span>
                          <span>QTY</span>
                        </div>
                        {lastReceipt.items.map((it, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between font-bold text-sm text-black">
                              <span className="max-w-[240px]">{it.name}</span>
                              <span className="text-base font-black">x{it.quantity}</span>
                            </div>
                            {it.options && it.options.length > 0 && (
                              <div className="text-[10px] text-gray-600 italic">
                                ** {it.options.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Special Kitchen Notes */}
                      {sampleOrder.customer_notes && (
                        <div className="py-2 border-b border-dashed border-gray-400 bg-yellow-50/60 px-2 rounded-sm my-1">
                          <span className="font-bold text-[10px] uppercase text-amber-800">Kitchen Instructions:</span>
                          <div className="text-[11px] font-semibold text-gray-800">{sampleOrder.customer_notes}</div>
                        </div>
                      )}

                      {/* Financial / Discount Ledger */}
                      <div className="pt-2 text-[11px] space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal:</span>
                          <span>₹{lastReceipt.subtotal.toFixed(2)}</span>
                        </div>
                        {lastReceipt.discount_amount > 0 && (
                          <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-sm">
                            <span>- {lastReceipt.discount_name || 'Menuz Promo'}:</span>
                            <span>-₹{lastReceipt.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                          <span>GST (5%):</span>
                          <span>₹{lastReceipt.taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-black pt-1 border-t border-gray-400">
                          <span>KITCHEN BILL TOTAL:</span>
                          <span>₹{lastReceipt.grand_total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center text-[10px] text-gray-500 pt-3 border-t border-dashed border-gray-400 mt-2">
                        *** POWERED BY MENUZ SMART DINING ***
                        <br />
                        KOT Dispatched via Petpooja Push API
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 space-y-2">
                      <Printer className="w-10 h-10 mx-auto text-gray-400" />
                      <p className="font-bold text-gray-700">No KOT Printed Yet</p>
                      <p className="text-xs max-w-xs mx-auto">
                        Click the orange <strong>"⚡ Fire KOT into Petpooja Kitchen Station"</strong> button on the left to simulate a live printout.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIALS & API CONFIG */}
        {activeTab === 'credentials' && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-base text-gray-900">Petpooja API Configuration</h3>
                <p className="text-xs text-gray-500">
                  Enter the credentials provided by the restaurant or Petpooja partner support.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Enable POS Dispatch</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Petpooja Restaurant ID (restID)</label>
                <input
                  type="text"
                  value={config.rest_id}
                  onChange={(e) => setConfig({ ...config, rest_id: e.target.value })}
                  placeholder="e.g. pp_pune_saffron_01 or 123456"
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  The unique outlet code assigned to this branch in Petpooja's database.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">App Key</label>
                  <input
                    type="text"
                    value={config.app_key}
                    onChange={(e) => setConfig({ ...config, app_key: e.target.value })}
                    placeholder="Enter App Key"
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">App Secret</label>
                  <input
                    type="password"
                    value={config.app_secret}
                    onChange={(e) => setConfig({ ...config, app_secret: e.target.value })}
                    placeholder="Enter App Secret"
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Environment</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="env"
                      checked={config.environment === 'sandbox'}
                      onChange={() => setConfig({ ...config, environment: 'sandbox' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Sandbox / Staging (Testing & Simulation)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="env"
                      checked={config.environment === 'production'}
                      onChange={() => setConfig({ ...config, environment: 'production' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-bold text-emerald-700">Production (Live Kitchen Printer)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save POS Credentials
                </button>
                {savedNotification && (
                  <span className="text-emerald-600 font-semibold ml-3">
                    ✓ Credentials saved and verified!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPTION 3 EXPLAINER GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" /> How Option 3 (Pilot Fast-Track) Actually Works
              </h3>
              <p className="text-xs text-blue-900/80 mt-1">
                You don't need to wait weeks for enterprise approvals. When you sign up a restaurant in Pune, Petpooja lets the merchant approve third-party apps directly.
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 items-start p-4 bg-[#090D16] border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">The Restaurant Owner Asks Their Account Manager</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Every Petpooja restaurant in Pune has a local field account manager (or POS support WhatsApp group). The owner simply sends:
                  </p>
                  <div className="bg-gray-100 p-2.5 rounded-lg font-mono text-[11px] text-gray-800 my-2">
                    "Hi, please generate API credentials (App Key, App Secret, RestID) for our Menuz QR table ordering integration."
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start p-4 bg-[#090D16] border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Petpooja Whitelists Menuz on that Outlet</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Petpooja emails the keys to the restaurant owner or displays them in their merchant back-office at <code>petpooja.com/dashboard/integrations</code>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start p-4 bg-[#090D16] border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Paste Credentials into Menuz</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    In the <strong>Credentials</strong> tab above, you paste their <code>RestID</code>, <code>App Key</code>, and <code>App Secret</code>, then flip the switch to <strong>Production</strong>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start p-4 bg-[#090D16] border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center shrink-0 text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">1-Click "Sync Menu" & Live KOT Printing</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Menuz pulls their active dishes, prices, and categories into our QR menu. Any customer ordering at the table immediately prints at their kitchen counter with zero manual punching!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
