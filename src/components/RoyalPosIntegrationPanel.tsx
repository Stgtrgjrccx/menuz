import React, { useState } from 'react';
import {
  Printer, CheckCircle2, Terminal, Send, RefreshCw,
  Sliders, ShieldCheck, Zap, Receipt, HelpCircle, Wifi
} from 'lucide-react';
import { Restaurant, RoyalPosConfig, Order, GenericKotReceipt } from '../types';
import { sendOrderToRoyalPos, buildRoyalPosKotPayload } from '../services/royalposService';

interface RoyalPosIntegrationPanelProps {
  restaurant: Restaurant;
  onUpdateConfig?: (config: RoyalPosConfig) => void;
}

const sampleOrderItems = (restaurantId: string): Order['items'] => [
  {
    id: 'item-1', order_id: 'ord-sim', menu_item_id: 'mi-101',
    item_name_snapshot: restaurantId === 'rest-saffron-house-01' ? 'Old Delhi Butter Chicken' : 'Wood-Fired Margherita Pizza',
    unit_price_snapshot: restaurantId === 'rest-saffron-house-01' ? 480 : 540,
    quantity: 1,
    selected_options_snapshot: [{ option_id: 'opt-spice', name: 'Medium Spice', price_modifier: 0 }],
    line_total_amount: restaurantId === 'rest-saffron-house-01' ? 480 : 540
  },
  {
    id: 'item-2', order_id: 'ord-sim', menu_item_id: 'mi-102',
    item_name_snapshot: restaurantId === 'rest-saffron-house-01' ? 'Slow-Cooked Dal Makhani' : 'Truffle & Porcini Tagliatelle',
    unit_price_snapshot: restaurantId === 'rest-saffron-house-01' ? 360 : 420,
    quantity: 1,
    selected_options_snapshot: [{ option_id: 'opt-butter', name: 'Extra White Butter', price_modifier: 40 }],
    line_total_amount: restaurantId === 'rest-saffron-house-01' ? 400 : 460
  },
  {
    id: 'item-3', order_id: 'ord-sim', menu_item_id: 'mi-103',
    item_name_snapshot: restaurantId === 'rest-saffron-house-01' ? 'Garlic Butter Naan' : 'Classic Garlic Herb Focaccia',
    unit_price_snapshot: restaurantId === 'rest-saffron-house-01' ? 80 : 120,
    quantity: 2, selected_options_snapshot: [],
    line_total_amount: restaurantId === 'rest-saffron-house-01' ? 160 : 240
  }
];

export const RoyalPosIntegrationPanel: React.FC<RoyalPosIntegrationPanelProps> = ({
  restaurant, onUpdateConfig
}) => {
  const [config, setConfig] = useState<RoyalPosConfig>(
    restaurant.royalpos_config || {
      enabled: true,
      outlet_id: 'rp_pune_saffron_01',
      bearer_token: 'rp_live_bearer_4a7f81c2d9',
      device_ip: '192.168.1.101',
      device_port: 8080,
      environment: 'sandbox',
      auto_push_kot: true,
      last_synced_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  );

  const [savedNotification, setSavedNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'credentials' | 'guide'>('simulator');
  const [simTable, setSimTable] = useState('Table 4 (Patio)');
  const [includeFoodReward, setIncludeFoodReward] = useState(false);
  const [isFiringKot, setIsFiringKot] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<GenericKotReceipt | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  const sampleOrder: Order = {
    id: 'ord-sim-' + Date.now(), restaurant_id: restaurant.id,
    table_id: 'tbl-4', table_label: simTable,
    anonymous_session_id: 'sess-sim-883',
    order_number: 'ORD-' + Math.floor(100 + Math.random() * 900),
    source: 'menuz', status: 'received', currency: '₹',
    subtotal_amount: 1040, tax_amount: 52, total_amount: 1092,
    customer_notes: 'Extra crispy naan, separate mint chutney.',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    items: sampleOrderItems(restaurant.id)
  };

  const handleSaveConfig = () => {
    if (onUpdateConfig) onUpdateConfig(config);
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
      const res = await sendOrderToRoyalPos(orderToDispatch, restaurant, config);
      setLastReceipt(res.receipt);
    } finally {
      setIsFiringKot(false);
    }
  };

  const accentColor = 'blue';
  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
      activeTab === tab ? 'bg-white text-blue-800 shadow-sm' : 'text-white/80 hover:bg-white/10'
    }`;

  return (
    <div className="bg-[#0D1322] rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="bg-white text-blue-700 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                LAN / Wi-Fi Bridge
              </span>
              <span className="bg-blue-500/40 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wifi className="w-3 h-3" /> RoyalPOS Local API
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              RoyalPOS Direct Kitchen Dispatch
            </h2>
            <p className="text-sm text-blue-100 max-w-xl mt-1">
              Menuz pushes orders directly to the RoyalPOS Android/Windows terminal on the restaurant's local network — no cloud required.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10 self-start md:self-auto">
            <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <div className="text-xs font-bold leading-none">{config.enabled ? 'POS Link Active' : 'POS Link Paused'}</div>
              <div className="text-[10px] text-blue-200 mt-0.5">
                Device: <code className="font-mono text-white">{config.device_ip}:{config.device_port}</code>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-6 border-t border-white/20 pt-4">
          <button onClick={() => setActiveTab('simulator')} className={tabClass('simulator')}>
            <Printer className="w-3.5 h-3.5" /> Live KOT Simulator
          </button>
          <button onClick={() => setActiveTab('credentials')} className={tabClass('credentials')}>
            <Sliders className="w-3.5 h-3.5" /> Device & Credentials
          </button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>
            <HelpCircle className="w-3.5 h-3.5" /> Onboarding Guide
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" /> Test RoyalPOS LAN KOT Dispatch
                </h3>
                <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                  Simulates a POST to <code className="font-mono bg-blue-100 px-1 rounded">http://{config.device_ip}:{config.device_port}/api/v1/kot/save</code> on the restaurant's local network. Verify the thermal receipt layout before going live.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Simulated Table</label>
                <select value={simTable} onChange={(e) => setSimTable(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 bg-[#090D16]">
                  <option>Table 1 (Indoor)</option>
                  <option>Table 2 (Indoor)</option>
                  <option>Table 4 (Patio)</option>
                  <option>Table 8 (Family AC)</option>
                  <option>Table 12 (Balcony)</option>
                </select>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-800">Optional: Complimentary Food Reward</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Discounts are completely optional. Reward diners with a complimentary food/dessert item with zero bill deduction.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                    <input type="checkbox" checked={includeFoodReward} onChange={(e) => setIncludeFoodReward(e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {includeFoodReward && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-2">
                    <span>🎁</span>
                    <span>1x Complimentary Chef Dessert (₹0) added to KOT. Zero bill discount deducted.</span>
                  </div>
                )}
              </div>

              {/* Items preview */}
              <div className="border border-gray-200 rounded-xl p-3 bg-[#090D16] space-y-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Basket (3 Items)</div>
                {sampleOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0">
                    <span className="font-semibold text-gray-900">{it.quantity}x {it.item_name_snapshot}</span>
                    <span className="font-mono text-gray-700">₹{it.line_total_amount}</span>
                  </div>
                ))}
              </div>

              <button type="button" disabled={isFiringKot} onClick={handleTestKot}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {isFiringKot
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Dispatching to RoyalPOS LAN...</>
                  : <><Send className="w-4 h-4" /> ⚡ Fire KOT to RoyalPOS Kitchen Station</>}
              </button>
            </div>

            {/* Right: Thermal receipt */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-gray-600" /> Kitchen Thermal Printer Preview (80mm)
                </span>
                {lastReceipt && (
                  <button onClick={() => setShowJsonPayload(!showJsonPayload)}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" /> {showJsonPayload ? 'View Receipt' : 'View Raw JSON'}
                  </button>
                )}
              </div>

              {showJsonPayload && lastReceipt ? (
                <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[480px]">
                  <pre>{JSON.stringify(lastReceipt.raw_payload, null, 2)}</pre>
                </div>
              ) : (
                <div className="bg-blue-50/20 border-2 border-dashed border-gray-300 rounded-xl p-5 font-mono text-xs text-gray-900 leading-relaxed max-w-md mx-auto">
                  {lastReceipt ? (
                    <div>
                      <div className="text-center border-b border-dashed border-gray-400 pb-3">
                        <div className="text-base font-black tracking-tight">{lastReceipt.restaurant_name.toUpperCase()}</div>
                        <div className="text-[11px] font-bold text-gray-600">ROYALPOS KITCHEN ORDER TICKET (KOT)</div>
                        <div className="text-xs font-bold mt-1 text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-sm inline-block">{lastReceipt.kot_number}</div>
                      </div>
                      <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold text-sm text-black">
                          <span>{lastReceipt.table_label.toUpperCase()}</span>
                          <span>{lastReceipt.timestamp}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>RP Order: {lastReceipt.pos_order_id}</span>
                          <span>Type: DINE-IN</span>
                        </div>
                        <div className="text-gray-600">Source: {lastReceipt.server_name}</div>
                      </div>
                      <div className="py-3 border-b border-dashed border-gray-400 space-y-2">
                        <div className="flex justify-between font-bold text-[11px] text-gray-500 pb-1 border-b border-gray-200">
                          <span>ITEM NAME</span><span>QTY</span>
                        </div>
                        {lastReceipt.items.map((it, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between font-bold text-sm text-black">
                              <span className="max-w-[240px]">{it.name}</span>
                              <span className="text-base font-black">x{it.quantity}</span>
                            </div>
                            {it.options && it.options.length > 0 && (
                              <div className="text-[10px] text-gray-600 italic">** {it.options.join(', ')}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 text-[11px] space-y-1">
                        <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>₹{lastReceipt.subtotal.toFixed(2)}</span></div>
                        {lastReceipt.discount_amount > 0 && (
                          <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-sm">
                            <span>- {lastReceipt.discount_name}:</span>
                            <span>-₹{lastReceipt.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600"><span>GST (5%):</span><span>₹{lastReceipt.taxes.toFixed(2)}</span></div>
                        <div className="flex justify-between font-black text-sm text-black pt-1 border-t border-gray-400">
                          <span>KITCHEN BILL TOTAL:</span><span>₹{lastReceipt.grand_total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-gray-500 pt-3 border-t border-dashed border-gray-400 mt-2">
                        *** POWERED BY MENUZ SMART DINING ***<br />KOT via RoyalPOS LAN API · {config.device_ip}:{config.device_port}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 space-y-2">
                      <Printer className="w-10 h-10 mx-auto text-gray-400" />
                      <p className="font-bold text-gray-700">No KOT Printed Yet</p>
                      <p className="text-xs max-w-xs mx-auto">Click <strong>"⚡ Fire KOT to RoyalPOS Kitchen Station"</strong> to simulate a live thermal printout.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIALS */}
        {activeTab === 'credentials' && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-base text-gray-900">RoyalPOS Device & API Configuration</h3>
                <p className="text-xs text-gray-500 mt-1">Enter the device IP and API credentials from the RoyalPOS admin dashboard (Settings → Integrations).</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={config.enabled} onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Device LAN IP Address</label>
                  <input type="text" value={config.device_ip} onChange={(e) => setConfig({ ...config, device_ip: e.target.value })}
                    placeholder="192.168.1.101" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500" />
                  <span className="text-[11px] text-gray-500 mt-0.5 block">Android POS tablet / Windows POS machine on restaurant Wi-Fi</span>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Port</label>
                  <input type="number" value={config.device_port} onChange={(e) => setConfig({ ...config, device_port: Number(e.target.value) })}
                    placeholder="8080" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500" />
                  <span className="text-[11px] text-gray-500 mt-0.5 block">Default: 8080</span>
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Outlet ID</label>
                <input type="text" value={config.outlet_id} onChange={(e) => setConfig({ ...config, outlet_id: e.target.value })}
                  placeholder="rp_pune_outlet_01" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Bearer Token</label>
                <input type="password" value={config.bearer_token} onChange={(e) => setConfig({ ...config, bearer_token: e.target.value })}
                  placeholder="Enter Bearer Token" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500" />
                <span className="text-[11px] text-gray-500 mt-0.5 block">From RoyalPOS Admin → Settings → Integrations → API Token</span>
              </div>
              <div className="flex gap-4">
                {(['sandbox', 'production'] as const).map((env) => (
                  <label key={env} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input type="radio" name="rp-env" checked={config.environment === env} onChange={() => setConfig({ ...config, environment: env })} className="text-blue-600" />
                    <span className={env === 'production' ? 'font-bold text-emerald-700' : ''}>{env === 'sandbox' ? 'Sandbox / Testing' : 'Production (Live Kitchen)'}</span>
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleSaveConfig}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save RoyalPOS Configuration
              </button>
              {savedNotification && <span className="text-emerald-600 font-semibold ml-3">✓ Saved!</span>}
            </div>
          </div>
        )}

        {/* TAB 3: GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-3xl space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" /> How RoyalPOS Integration Works
              </h3>
              <p className="text-xs text-blue-900/80 mt-1">
                RoyalPOS doesn't have a public developer portal. Integration is done via their local REST API — the POS terminal itself acts as the server on the restaurant's LAN.
              </p>
            </div>
            {[
              { step: 1, title: 'Restaurant Owner Contacts RoyalPOS Account Manager', desc: 'Every RoyalPOS restaurant has a local account manager or a support WhatsApp group. Owner sends: "Please enable API access for our Menuz QR integration and share the Bearer Token."' },
              { step: 2, title: 'RoyalPOS Enables API on the POS Terminal', desc: 'The RoyalPOS admin dashboard (Settings → Integrations) exposes an API Token and starts the local HTTP server on port 8080. The POS must be on the same Wi-Fi as the Menuz relay.' },
              { step: 3, title: 'You Enter Device IP + Token in Menuz', desc: 'Paste the device IP (visible in the POS under About → Network) and the API Token in the Credentials tab above. Switch to Production.' },
              { step: 4, title: 'Live KOT Printing', desc: 'Every Menuz order fires directly to the RoyalPOS kitchen station. Kitchen items and optional food rewards are structured in real-time.' }
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start p-4 bg-[#090D16] border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 text-sm">{step}</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{title}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
