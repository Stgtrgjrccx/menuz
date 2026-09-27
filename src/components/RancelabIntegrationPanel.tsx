import React, { useState } from 'react';
import {
  Printer, CheckCircle2, Terminal, Send, RefreshCw,
  Sliders, Zap, Receipt, HelpCircle, BarChart3
} from 'lucide-react';
import { Restaurant, RancelabConfig, Order, GenericKotReceipt } from '../types';
import { sendOrderToRancelab } from '../services/rancelabService';

interface RancelabIntegrationPanelProps {
  restaurant: Restaurant;
  onUpdateConfig?: (config: RancelabConfig) => void;
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

export const RancelabIntegrationPanel: React.FC<RancelabIntegrationPanelProps> = ({
  restaurant, onUpdateConfig
}) => {
  const [config, setConfig] = useState<RancelabConfig>(
    restaurant.rancelab_config || {
      enabled: true,
      branch_code: 'rl_pune_branch_01',
      partner_key: 'rl_partner_key_3f2a9c1b77',
      environment: 'sandbox',
      auto_push_kot: true,
      auto_sync_menu: true,
      gst_slab: 5,
      last_synced_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  );

  const [savedNotification, setSavedNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'credentials' | 'guide'>('simulator');
  const [simTable, setSimTable] = useState('Table 4 (Patio)');
  const [includeDiscount, setIncludeDiscount] = useState(true);
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
    const discountInfo = includeDiscount
      ? { label: 'Menuz Google Review Lucky Wheel (15% OFF)', amount: 156, ratePercent: 15 }
      : undefined;
    try {
      const res = await sendOrderToRancelab(sampleOrder, restaurant, config, discountInfo);
      setLastReceipt(res.receipt);
    } finally {
      setIsFiringKot(false);
    }
  };

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
      activeTab === tab ? 'bg-white text-violet-800 shadow-sm' : 'text-white/80 hover:bg-white/10'
    }`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-800 via-purple-700 to-violet-800 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="bg-white text-violet-700 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Enterprise ERP Bridge
              </span>
              <span className="bg-purple-500/40 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> RanceLab · 200k+ Restaurants
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              RanceLab Precision Billing Suite Dispatch
            </h2>
            <p className="text-sm text-purple-100 max-w-xl mt-1">
              Menuz pushes orders to RanceLab's Integrations & Apps Panel — GST-slab aware, offline-resilient, with full inventory deduction and KOT auto-generation.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10 self-start md:self-auto">
            <div className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            <div>
              <div className="text-xs font-bold leading-none">{config.enabled ? 'POS Link Active' : 'POS Link Paused'}</div>
              <div className="text-[10px] text-purple-200 mt-0.5">Branch: <code className="font-mono text-white">{config.branch_code}</code></div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-6 border-t border-white/20 pt-4">
          <button onClick={() => setActiveTab('simulator')} className={tabClass('simulator')}><Printer className="w-3.5 h-3.5" /> Live KOT Simulator</button>
          <button onClick={() => setActiveTab('credentials')} className={tabClass('credentials')}><Sliders className="w-3.5 h-3.5" /> API Keys & GST Config</button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}><HelpCircle className="w-3.5 h-3.5" /> Onboarding Guide</button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-violet-50/60 border border-violet-200 rounded-xl p-4">
                <h3 className="font-bold text-sm text-violet-950 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600" /> Test RanceLab Push Order Dispatch
                </h3>
                <p className="text-xs text-violet-900/80 mt-1 leading-relaxed">
                  Simulates a POST to <code className="font-mono bg-violet-100 px-1 rounded">https://api.rancelab.com/v1/integration/order/push</code> with GST slab {config.gst_slab}% applied. KOT auto-generates at kitchen printer with inventory deduction.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Simulated Table</label>
                <select value={simTable} onChange={(e) => setSimTable(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-violet-500 bg-white">
                  <option>Table 1 (Indoor)</option><option>Table 2 (Indoor)</option>
                  <option>Table 4 (Patio)</option><option>Table 8 (Family AC)</option><option>Table 12 (Balcony)</option>
                </select>
              </div>

              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Apply 15% Google Review Reward Discount</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={includeDiscount} onChange={(e) => setIncludeDiscount(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>

              <div className="border border-gray-200 rounded-xl p-3 bg-white space-y-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Basket (3 Items)</div>
                {sampleOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0">
                    <span className="font-semibold text-gray-900">{it.quantity}x {it.item_name_snapshot}</span>
                    <span className="font-mono text-gray-700">₹{it.line_total_amount}</span>
                  </div>
                ))}
                <div className="text-[10px] text-violet-700 font-semibold pt-1">GST Slab: {config.gst_slab}% (Indian tax slab)</div>
              </div>

              <button type="button" disabled={isFiringKot} onClick={handleTestKot}
                className="w-full py-3.5 px-4 bg-violet-700 hover:bg-violet-800 disabled:bg-gray-300 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {isFiringKot
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Dispatching to RanceLab ERP...</>
                  : <><Send className="w-4 h-4" /> ⚡ Fire KOT into RanceLab Billing Suite</>}
              </button>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-gray-600" /> Kitchen Thermal Printer Preview (80mm)
                </span>
                {lastReceipt && (
                  <button onClick={() => setShowJsonPayload(!showJsonPayload)} className="text-xs text-violet-600 font-bold hover:underline flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" /> {showJsonPayload ? 'View Receipt' : 'View Raw JSON'}
                  </button>
                )}
              </div>
              {showJsonPayload && lastReceipt ? (
                <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[480px]">
                  <pre>{JSON.stringify(lastReceipt.raw_payload, null, 2)}</pre>
                </div>
              ) : (
                <div className="bg-violet-50/10 border-2 border-dashed border-gray-300 rounded-xl p-5 font-mono text-xs text-gray-900 leading-relaxed max-w-md mx-auto">
                  {lastReceipt ? (
                    <div>
                      <div className="text-center border-b border-dashed border-gray-400 pb-3">
                        <div className="text-base font-black tracking-tight">{lastReceipt.restaurant_name.toUpperCase()}</div>
                        <div className="text-[11px] font-bold text-gray-600">RANCELAB KITCHEN ORDER TICKET (KOT)</div>
                        <div className="text-xs font-bold mt-1 text-violet-800 bg-violet-100/80 px-2 py-0.5 rounded-sm inline-block">{lastReceipt.kot_number}</div>
                      </div>
                      <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold text-sm text-black">
                          <span>{lastReceipt.table_label.toUpperCase()}</span><span>{lastReceipt.timestamp}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>RL Order: {lastReceipt.pos_order_id}</span><span>Type: DINE-IN</span>
                        </div>
                        <div className="text-gray-600">Waiter ID: MENUZ_QR</div>
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
                        <div className="flex justify-between text-gray-600"><span>Gross Amount:</span><span>₹{lastReceipt.subtotal.toFixed(2)}</span></div>
                        {lastReceipt.discount_amount > 0 && (
                          <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-sm">
                            <span>- {lastReceipt.discount_name}:</span><span>-₹{lastReceipt.discount_amount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600"><span>GST ({config.gst_slab}%):</span><span>₹{lastReceipt.taxes.toFixed(2)}</span></div>
                        <div className="flex justify-between font-black text-sm text-black pt-1 border-t border-gray-400">
                          <span>NET PAYABLE:</span><span>₹{lastReceipt.grand_total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-gray-500 pt-3 border-t border-dashed border-gray-400 mt-2">
                        *** POWERED BY MENUZ SMART DINING ***<br />KOT via RanceLab Integrations & Apps Panel
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 space-y-2">
                      <Printer className="w-10 h-10 mx-auto text-gray-400" />
                      <p className="font-bold text-gray-700">No KOT Printed Yet</p>
                      <p className="text-xs max-w-xs mx-auto">Click <strong>"⚡ Fire KOT into RanceLab Billing Suite"</strong> to simulate.</p>
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
                <h3 className="font-bold text-base text-gray-900">RanceLab API & GST Configuration</h3>
                <p className="text-xs text-gray-500 mt-1">Partner credentials issued by RanceLab (sales@rancelab.com · +91 98319 26662). RanceLab has 30+ years and 200k+ customers globally.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={config.enabled} onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-700"></div>
              </label>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Branch Code</label>
                <input type="text" value={config.branch_code} onChange={(e) => setConfig({ ...config, branch_code: e.target.value })}
                  placeholder="rl_pune_branch_01" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-violet-500" />
                <span className="text-[11px] text-gray-500 mt-0.5 block">Unique outlet/branch code from RanceLab admin panel.</span>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Partner Key (X-Partner-Key header)</label>
                <input type="password" value={config.partner_key} onChange={(e) => setConfig({ ...config, partner_key: e.target.value })}
                  placeholder="Enter Partner Key" className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-violet-500" />
                <span className="text-[11px] text-gray-500 mt-0.5 block">Issued by RanceLab to Menuz as an authorized integration partner.</span>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">GST Slab (%)</label>
                <div className="flex gap-3">
                  {([5, 12, 18, 28] as const).map((slab) => (
                    <label key={slab} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="gst-slab" checked={config.gst_slab === slab} onChange={() => setConfig({ ...config, gst_slab: slab })} className="text-violet-600" />
                      <span className={config.gst_slab === slab ? 'font-bold text-violet-700' : ''}>{slab}%</span>
                    </label>
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">Indian GST: 5% (AC restaurant), 12% (non-AC), 18%/28% (luxury). RanceLab's billing engine handles all slabs natively.</span>
              </div>
              <div className="flex gap-4">
                {(['sandbox', 'production'] as const).map((env) => (
                  <label key={env} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input type="radio" name="rl-env" checked={config.environment === env} onChange={() => setConfig({ ...config, environment: env })} className="text-violet-600" />
                    <span className={env === 'production' ? 'font-bold text-emerald-700' : ''}>{env === 'sandbox' ? 'Sandbox / Testing' : 'Production (Live Kitchen)'}</span>
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleSaveConfig}
                className="px-6 py-2.5 bg-violet-700 hover:bg-violet-800 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save RanceLab Configuration
              </button>
              {savedNotification && <span className="text-emerald-600 font-semibold ml-3">✓ Saved!</span>}
            </div>
          </div>
        )}

        {/* TAB 3: GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-3xl space-y-5">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <h3 className="font-bold text-sm text-violet-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-violet-600" /> How RanceLab Integration Works
              </h3>
              <p className="text-xs text-violet-900/80 mt-1">
                RanceLab is one of India's most established POS ERP vendors (30+ years, 200k+ customers). They have a formal partner program and provide API access via their Integrations & Apps Panel. Contact: <strong>sales@rancelab.com</strong> or <strong>+91 98319 26662</strong>.
              </p>
            </div>
            {[
              { step: 1, title: 'Request Integration Partnership from RanceLab', desc: 'Email sales@rancelab.com or call +91 98319 26662. Say: "We are Menuz, a QR table-ordering platform seeking integration with RanceLab\'s Integrations & Apps Panel to push orders and generate KOTs."' },
              { step: 2, title: 'RanceLab Issues Partner Key + Branch Codes', desc: 'RanceLab onboards Menuz as an authorized integration partner. They issue an X-Partner-Key and per-outlet Branch Codes. Both are entered into the Credentials tab.' },
              { step: 3, title: 'Configure GST Slab per Restaurant', desc: 'Indian GST varies: 5% for AC restaurants, 12% for non-AC. Enter the correct slab per outlet — RanceLab\'s billing engine applies it to every Menuz-pushed order automatically.' },
              { step: 4, title: 'Live Dispatch with Full ERP Integration', desc: 'Every Menuz QR order pushes to RanceLab, triggers KOT printing, deducts raw material inventory, and appears in the manager\'s consolidated sales report — all in one transaction.' }
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-black flex items-center justify-center shrink-0 text-sm">{step}</div>
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
