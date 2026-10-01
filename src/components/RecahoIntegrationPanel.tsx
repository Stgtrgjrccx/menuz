import React, { useState } from 'react';
import {
  Printer, CheckCircle2, Terminal, Send, RefreshCw,
  Sliders, ShieldCheck, Zap, Receipt, HelpCircle, Cloud, Tag
} from 'lucide-react';
import { Restaurant, RecahoConfig, Order, GenericKotReceipt } from '../types';
import { sendOrderToRecaho } from '../services/recahoService';

interface RecahoIntegrationPanelProps {
  restaurant: Restaurant;
  onUpdateConfig?: (config: RecahoConfig) => void;
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

export const RecahoIntegrationPanel: React.FC<RecahoIntegrationPanelProps> = ({
  restaurant, onUpdateConfig
}) => {
  const [config, setConfig] = useState<RecahoConfig>(
    restaurant.recaho_config || {
      enabled: true,
      outlet_token: 'rch_outlet_mock_pune_01',
      api_key: 'rch_live_api_7b3e92fa11',
      environment: 'sandbox',
      auto_push_kot: true,
      auto_sync_menu: true,
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
      const res = await sendOrderToRecaho(orderToDispatch, restaurant, config);
      setLastReceipt(res.receipt);
    } finally {
      setIsFiringKot(false);
    }
  };

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
      activeTab === tab ? 'bg-white text-teal-800 shadow-sm' : 'text-white/80 hover:bg-white/10'
    }`;

  return (
    <div className="bg-[#0D1322] rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="bg-white text-teal-700 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Cloud REST Bridge
              </span>
              <span className="bg-teal-500/40 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Recaho API-First
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Recaho Cloud Kitchen Dispatch
            </h2>
            <p className="text-sm text-teal-100 max-w-xl mt-1">
              Orders from Menuz push directly to Recaho's cloud API — no local device required. Instant KOT generation across PCMC, Hadapsar, Chakan & Pune city.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10 self-start md:self-auto">
            <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <div className="text-xs font-bold leading-none">{config.enabled ? 'POS Link Active' : 'POS Link Paused'}</div>
              <div className="text-[10px] text-teal-200 mt-0.5">Outlet: <code className="font-mono text-white">{config.outlet_token.slice(0, 18)}…</code></div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-6 border-t border-white/20 pt-4">
          <button onClick={() => setActiveTab('simulator')} className={tabClass('simulator')}><Printer className="w-3.5 h-3.5" /> Live KOT Simulator</button>
          <button onClick={() => setActiveTab('credentials')} className={tabClass('credentials')}><Sliders className="w-3.5 h-3.5" /> API Keys</button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}><HelpCircle className="w-3.5 h-3.5" /> Onboarding Guide</button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4">
                <h3 className="font-bold text-sm text-teal-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-600" /> Test Recaho Cloud KOT Dispatch
                </h3>
                <p className="text-xs text-teal-900/80 mt-1 leading-relaxed">
                  Simulates a POST to <code className="font-mono bg-teal-100 px-1 rounded">https://api.recaho.com/v2/orders/create</code> with outlet token + API key headers. Instant KOT generation at the kitchen display system.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Simulated Table</label>
                <select value={simTable} onChange={(e) => setSimTable(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 bg-[#090D16]">
                  <option>Table 1 (Indoor)</option><option>Table 2 (Indoor)</option>
                  <option>Table 4 (Patio)</option><option>Table 8 (Family AC)</option><option>Table 12 (Balcony)</option>
                </select>
              </div>

              {/* Optional Food-as-Reward */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-teal-600" /> Optional: Complimentary Food Reward
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
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                {includeFoodReward && (
                  <div className="text-[11px] text-teal-900 bg-teal-50 border border-teal-200 p-2.5 rounded-lg flex items-center gap-2">
                    <span>🎁</span>
                    <span>1x Complimentary Chef Dessert (₹0) added to kitchen ticket. Zero bill discount deducted.</span>
                  </div>
                )}
              </div>

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
                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {isFiringKot
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Syncing to Recaho Cloud...</>
                  : <><Send className="w-4 h-4" /> ⚡ Fire KOT to Recaho Kitchen Station</>}
              </button>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-gray-600" /> Kitchen Thermal Printer Preview (80mm)
                </span>
                {lastReceipt && (
                  <button onClick={() => setShowJsonPayload(!showJsonPayload)} className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" /> {showJsonPayload ? 'View Receipt' : 'View Raw JSON'}
                  </button>
                )}
              </div>
              {showJsonPayload && lastReceipt ? (
                <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[480px]">
                  <pre>{JSON.stringify(lastReceipt.raw_payload, null, 2)}</pre>
                </div>
              ) : (
                <div className="bg-teal-50/20 border-2 border-dashed border-gray-300 rounded-xl p-5 font-mono text-xs text-gray-900 leading-relaxed max-w-md mx-auto">
                  {lastReceipt ? (
                    <div>
                      <div className="text-center border-b border-dashed border-gray-400 pb-3">
                        <div className="text-base font-black tracking-tight">{lastReceipt.restaurant_name.toUpperCase()}</div>
                        <div className="text-[11px] font-bold text-gray-600">RECAHO KITCHEN ORDER TICKET (KOT)</div>
                        <div className="text-xs font-bold mt-1 text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-sm inline-block">{lastReceipt.kot_number}</div>
                      </div>
                      <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold text-sm text-black">
                          <span>{lastReceipt.table_label.toUpperCase()}</span><span>{lastReceipt.timestamp}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>RCH Order: {lastReceipt.pos_order_id}</span><span>Type: DINE-IN</span>
                        </div>
                        <div className="text-gray-600">Source: {lastReceipt.server_name}</div>
                      </div>
                      <div className="py-3 border-b border-dashed border-gray-400 space-y-2">
                        <div className="flex justify-between font-bold text-[11px] text-gray-500 pb-1 border-b border-gray-200"><span>ITEM NAME</span><span>QTY</span></div>
                        {lastReceipt.items.map((it, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between font-bold text-sm text-black">
                              <span className="max-w-[240px]">{it.name}</span><span className="text-base font-black">x{it.quantity}</span>
                            </div>
                            {it.options && it.options.length > 0 && <div className="text-[10px] text-gray-600 italic">** {it.options.join(', ')}</div>}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 text-[11px] space-y-1">
                        <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>₹{lastReceipt.subtotal.toFixed(2)}</span></div>
                        {lastReceipt.discount_amount > 0 && (
                          <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-sm">
                            <span>- {lastReceipt.discount_name}:</span><span>-₹{lastReceipt.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600"><span>GST (5%):</span><span>₹{lastReceipt.taxes.toFixed(2)}</span></div>
                        <div className="flex justify-between font-black text-sm text-black pt-1 border-t border-gray-400">
                          <span>KITCHEN BILL TOTAL:</span><span>₹{lastReceipt.grand_total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-gray-500 pt-3 border-t border-dashed border-gray-400 mt-2">
                        *** POWERED BY MENUZ SMART DINING ***<br />KOT via Recaho Cloud API · api.recaho.com
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 space-y-2">
                      <Printer className="w-10 h-10 mx-auto text-gray-400" />
                      <p className="font-bold text-gray-700">No KOT Printed Yet</p>
                      <p className="text-xs max-w-xs mx-auto">Click <strong>"⚡ Fire KOT to Recaho Kitchen Station"</strong> to simulate.</p>
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
                <h3 className="font-bold text-base text-gray-900">Recaho API Configuration</h3>
                <p className="text-xs text-gray-500 mt-1">Credentials provided by Recaho after requesting partner access (sales@recaho.com).</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={config.enabled} onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Outlet Token (X-Outlet-Token header)</label>
                <input type="text" value={config.outlet_token} onChange={(e) => setConfig({ ...config, outlet_token: e.target.value })}
                  placeholder="rch_outlet_pune_01" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-teal-500" />
                <span className="text-[11px] text-gray-500 mt-0.5 block">Per-outlet token from the Recaho partner dashboard.</span>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">API Key (X-Api-Key header)</label>
                <input type="password" value={config.api_key} onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                  placeholder="Enter API Key" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-4">
                {(['sandbox', 'production'] as const).map((env) => (
                  <label key={env} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input type="radio" name="rch-env" checked={config.environment === env} onChange={() => setConfig({ ...config, environment: env })} className="text-teal-600" />
                    <span className={env === 'production' ? 'font-bold text-emerald-700' : ''}>{env === 'sandbox' ? 'Sandbox / Testing' : 'Production (Live Kitchen)'}</span>
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleSaveConfig}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Recaho Configuration
              </button>
              {savedNotification && <span className="text-emerald-600 font-semibold ml-3">✓ Saved!</span>}
            </div>
          </div>
        )}

        {/* TAB 3: GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-3xl space-y-5">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <h3 className="font-bold text-sm text-teal-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" /> How Recaho Integration Works
              </h3>
              <p className="text-xs text-teal-900/80 mt-1">Recaho is API-first but doesn't have a self-service developer portal. Credentials are issued after a partnership request — typically resolved within 1–2 business days.</p>
            </div>
            {[
              { step: 1, title: 'Request API Access from Recaho', desc: 'Email sales@recaho.com or book a demo at recaho.com. Specify: "We are Menuz, a QR table ordering platform. We need API credentials to push orders into Recaho and trigger KOTs."' },
              { step: 2, title: 'Recaho Issues Outlet Token + API Key', desc: 'You receive an account-level API Key and a per-outlet Outlet Token. These are entered into Menuz credentials panel above.' },
              { step: 3, title: 'Enter Credentials & Test in Sandbox', desc: 'Paste both keys into the Credentials tab. Fire test KOTs from the Simulator tab with the environment set to Sandbox.' },
              { step: 4, title: 'Flip to Production', desc: 'Switch environment to Production. All Menuz QR orders now push to Recaho cloud and trigger KOT printing at the kitchen display system in real time.' }
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start p-4 bg-[#090D16] border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-black flex items-center justify-center shrink-0 text-sm">{step}</div>
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
