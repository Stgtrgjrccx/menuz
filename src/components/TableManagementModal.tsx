import React, { useState } from 'react';
import { Restaurant, RestaurantTable, MODERN_POS_PROVIDERS } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  QrCode,
  Users,
  Copy,
  ExternalLink,
  Printer,
  Sparkles,
  Building2,
  Sliders,
  CheckCircle2,
  Save,
  Layers,
  MapPin,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react';

interface TableManagementModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'tables' | 'edit_restaurant';
}

export const TableManagementModal: React.FC<TableManagementModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  defaultTab = 'tables'
}) => {
  const tables = useRestaurantStore((state) => state.tables);
  const addTable = useRestaurantStore((state) => state.addTable);
  const updateTable = useRestaurantStore((state) => state.updateTable);
  const deleteTable = useRestaurantStore((state) => state.deleteTable);
  const batchCreateTables = useRestaurantStore((state) => state.batchCreateTables);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);

  const [activeTab, setActiveTab] = useState<'tables' | 'batch_add' | 'edit_restaurant'>(defaultTab);
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Single Add Table Form
  const [newLabel, setNewLabel] = useState('');
  const [newCapacity, setNewCapacity] = useState(4);
  const [newSection, setNewSection] = useState('Indoor Main');
  const [newServer, setNewServer] = useState('');

  // Editing Table State
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editCapacity, setEditCapacity] = useState(4);
  const [editSection, setEditSection] = useState('');
  const [editStatus, setEditStatus] = useState<'vacant' | 'occupied' | 'reserved' | 'cleaning'>('vacant');
  const [editServer, setEditServer] = useState('');

  // Batch Generation State
  const [batchCount, setBatchCount] = useState(6);
  const [batchStartNum, setBatchStartNum] = useState(1);
  const [batchSection, setBatchSection] = useState('Outdoor Patio');
  const [batchCapacity, setBatchCapacity] = useState(4);
  const [batchSuccess, setBatchSuccess] = useState(false);

  // Edit Restaurant Form State
  const [restName, setRestName] = useState(restaurant.name);
  const [restCuisine, setRestCuisine] = useState(restaurant.cuisine);
  const [restLocation, setRestLocation] = useState(restaurant.location || '');
  const [restOwner, setRestOwner] = useState(restaurant.owner_name || '');
  const [restEmail, setRestEmail] = useState(restaurant.contact_email || '');
  const [restPhone, setRestPhone] = useState(restaurant.contact_phone || '');
  const [restColor, setRestColor] = useState(restaurant.brand_colors?.primary || '#E85D04');
  const [restTaxRate, setRestTaxRate] = useState(restaurant.tax_rate_percent || 5);
  const [restGoogleUrl, setRestGoogleUrl] = useState(restaurant.google_place_url || '');
  const [restPos, setRestPos] = useState(restaurant.pos_provider || 'petpooja');
  const [isSavingRest, setIsSavingRest] = useState(false);
  const [restSaveSuccess, setRestSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTables = tables.filter((t) => t.restaurant_id === restaurant.id);
  const sections = Array.from(new Set(currentTables.map((t) => t.section || 'Indoor Main').concat(['Indoor Main', 'Outdoor Patio', 'Rooftop Terrace', 'VIP Dining', 'Bar Lounge'])));

  const filteredTables = currentTables.filter(
    (t) => sectionFilter === 'all' || (t.section || 'Indoor Main') === sectionFilter
  );

  const origin = window.location.origin + window.location.pathname;

  const copyUrl = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleAddSingleTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const token = `token-${restaurant.slug}-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 6)}`;
    const newTbl: RestaurantTable = {
      id: `tbl-${restaurant.slug}-${Date.now()}`,
      restaurant_id: restaurant.id,
      label: newLabel.trim(),
      public_token: token,
      is_active: true,
      capacity: newCapacity,
      section: newSection,
      status: 'vacant',
      assigned_server: newServer.trim() || undefined
    };

    addTable(newTbl);
    setNewLabel('');
    setNewServer('');
  };

  const handleStartEdit = (t: RestaurantTable) => {
    setEditingTableId(t.id);
    setEditLabel(t.label);
    setEditCapacity(t.capacity || 4);
    setEditSection(t.section || 'Indoor Main');
    setEditStatus(t.status || 'vacant');
    setEditServer(t.assigned_server || '');
  };

  const handleSaveEdit = (tableId: string) => {
    updateTable(tableId, {
      label: editLabel.trim(),
      capacity: editCapacity,
      section: editSection,
      status: editStatus,
      assigned_server: editServer.trim() || undefined
    });
    setEditingTableId(null);
  };

  const handleBatchGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    batchCreateTables(restaurant.id, batchCount, batchStartNum, batchSection, batchCapacity);
    setBatchSuccess(true);
    setTimeout(() => {
      setBatchSuccess(false);
      setActiveTab('tables');
    }, 1200);
  };

  const handleSaveRestaurantProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRest(true);
    setTimeout(() => {
      updateRestaurant(restaurant.id, {
        name: restName.trim(),
        cuisine: restCuisine.trim(),
        location: restLocation.trim(),
        owner_name: restOwner.trim(),
        contact_email: restEmail.trim(),
        contact_phone: restPhone.trim(),
        brand_colors: {
          ...restaurant.brand_colors,
          primary: restColor,
          accent: restColor
        },
        tax_rate_percent: Number(restTaxRate),
        google_place_url: restGoogleUrl.trim(),
        pos_provider: restPos as any
      });
      setIsSavingRest(false);
      setRestSaveSuccess(true);
      setTimeout(() => setRestSaveSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0D1322] border border-white/[0.08] rounded-3xl max-w-3xl w-full  overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#090D16] via-[#0D1322] to-[#090D16] p-5 text-white border-b border-white/[0.08] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-serif font-bold text-xl shadow-inner">
              🪑
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Floor Plan & Profile Studio
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {restaurant.name}
              </h2>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-2 mt-4 pt-2 border-t border-white/[0.08] text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'tables'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Tables & QR Cards ({currentTables.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('batch_add')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'batch_add'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Batch Generate Tables</span>
            </button>
            <button
              onClick={() => setActiveTab('edit_restaurant')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'edit_restaurant'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Restaurant Profile</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-white text-xs flex-1">
          
          {/* TAB 1: ALL TABLES & QR CODES */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              
              {/* Add Single Table Bar */}
              <form onSubmit={handleAddSingleTable} className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.08] space-y-3">
                <span className="font-bold text-white text-xs block">Add New Dining Table</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    required
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Table Label (e.g. Table 5, VIP 2)"
                    className="bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Indoor Main">Indoor Main</option>
                    <option value="Outdoor Patio">Outdoor Patio</option>
                    <option value="Rooftop Terrace">Rooftop Terrace</option>
                    <option value="VIP Dining">VIP Dining</option>
                    <option value="Bar Lounge">Bar Lounge</option>
                  </select>
                  <select
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value={2}>2 Seats (Couple)</option>
                    <option value={4}>4 Seats (Standard)</option>
                    <option value={6}>6 Seats (Family)</option>
                    <option value={8}>8 Seats (Group)</option>
                    <option value={12}>12+ Seats (Party)</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:brightness-110 text-slate-950 font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Table</span>
                  </button>
                </div>
              </form>

              {/* Section Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-bold text-[11px]">Section:</span>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="bg-[#0D1322] border border-white/[0.08] rounded-xl px-2.5 py-1 text-white text-xs focus:outline-none"
                  >
                    <option value="all">All Sections ({currentTables.length})</option>
                    {sections.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white rounded-xl font-bold flex items-center space-x-1 border border-white/[0.08] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print All Table QRs</span>
                </button>
              </div>

              {/* Tables Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredTables.map((t) => {
                  const tableDinerUrl = `${origin}#/r/${restaurant.slug}/menu?t=${t.public_token}`;
                  const isEditing = editingTableId === t.id;

                  if (isEditing) {
                    return (
                      <div key={t.id} className="p-3 bg-[#0D1322] border-2 border-amber-500 rounded-2xl space-y-2">
                        <span className="font-bold text-amber-400 text-xs">Edit {t.label}</span>
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-white text-xs"
                          placeholder="Table Label"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <select
                            value={editSection}
                            onChange={(e) => setEditSection(e.target.value)}
                            className="bg-[#0D1322] border border-white/[0.08] rounded-xl px-2 py-1 text-white text-xs"
                          >
                            <option value="Indoor Main">Indoor Main</option>
                            <option value="Outdoor Patio">Outdoor Patio</option>
                            <option value="Rooftop Terrace">Rooftop Terrace</option>
                            <option value="VIP Dining">VIP Dining</option>
                            <option value="Bar Lounge">Bar Lounge</option>
                          </select>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="bg-[#0D1322] border border-white/[0.08] rounded-xl px-2 py-1 text-white text-xs"
                          >
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                            <option value="cleaning">Cleaning</option>
                          </select>
                        </div>
                        <div className="flex space-x-1.5 pt-1">
                          <button
                            onClick={() => handleSaveEdit(t.id)}
                            className="flex-1 py-1.5 bg-amber-500 hover:brightness-110 rounded-xl text-slate-950 font-bold text-[11px] flex items-center justify-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setEditingTableId(null)}
                            className="px-2.5 py-1.5 bg-[#090D16]/[0.06] hover:bg-white/[0.1] rounded-xl text-slate-400 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={t.id}
                      className="p-3 bg-[#090D16]/[0.03] border border-white/[0.08] rounded-2xl hover:border-white/[0.16] transition-all flex flex-col justify-between space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{t.label}</h4>
                          <span className="text-[10px] text-amber-300 font-medium block">
                            {t.section || 'Indoor Main'} • {t.capacity || 4} Seats
                          </span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                          t.status === 'occupied'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : t.status === 'reserved'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {t.status || 'vacant'}
                        </span>
                      </div>

                      <div className="p-2 bg-[#090D16] rounded-xl border border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-400 truncate">
                        <span className="truncate mr-1">Token: {t.public_token.slice(0, 14)}...</span>
                        <button
                          onClick={() => copyUrl(tableDinerUrl, t.id)}
                          className="text-amber-400 hover:text-amber-300 flex items-center space-x-0.5 flex-shrink-0"
                          title="Copy Table QR Diner URL"
                        >
                          {copiedToken === t.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedToken === t.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5 pt-1 border-t border-white/[0.08]/60">
                        <a
                          href={tableDinerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1 bg-[#090D16] hover:bg-[#090D16] text-white rounded-lg text-center font-bold text-[10px] border border-white/[0.08] flex items-center justify-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3 text-amber-400" />
                          <span>Test Menu</span>
                        </a>
                        <button
                          onClick={() => handleStartEdit(t)}
                          className="p-1 bg-[#090D16]/[0.06] hover:bg-white/[0.1] rounded-lg text-slate-400 hover:text-white"
                          title="Edit Table Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTable(t.id)}
                          className="p-1 bg-[#090D16]/[0.06] hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400"
                          title="Delete Table"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BATCH GENERATE TABLES */}
          {activeTab === 'batch_add' && (
            <form onSubmit={handleBatchGenerate} className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] space-y-4 max-w-xl mx-auto">
              <div className="flex items-center space-x-2 pb-2 border-b border-white/[0.08]">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Batch Floor Plan Generator</h4>
              </div>
              <p className="text-slate-400 text-xs">
                Quickly create multiple tables for a dining room, rooftop, or banquet hall with auto-generated encrypted tokens.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Number of Tables</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Starting Table Number</label>
                  <input
                    type="number"
                    min={1}
                    value={batchStartNum}
                    onChange={(e) => setBatchStartNum(Number(e.target.value))}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Dining Section</label>
                  <select
                    value={batchSection}
                    onChange={(e) => setBatchSection(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Indoor Main">Indoor Main</option>
                    <option value="Outdoor Patio">Outdoor Patio</option>
                    <option value="Rooftop Terrace">Rooftop Terrace</option>
                    <option value="VIP Dining">VIP Dining</option>
                    <option value="Bar Lounge">Bar Lounge</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Seats per Table</label>
                  <select
                    value={batchCapacity}
                    onChange={(e) => setBatchCapacity(Number(e.target.value))}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value={2}>2 Seats (Couple)</option>
                    <option value={4}>4 Seats (Standard)</option>
                    <option value={6}>6 Seats (Family)</option>
                    <option value={8}>8 Seats (Group)</option>
                    <option value={12}>12 Seats (Party)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md mt-2"
              >
                {batchSuccess ? (
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{batchCount} Tables Generated!</span>
                  </span>
                ) : (
                  <span>Generate {batchCount} Tables Now</span>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: EDIT RESTAURANT PROFILE */}
          {activeTab === 'edit_restaurant' && (
            <form onSubmit={handleSaveRestaurantProfile} className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">Update Restaurant Information</h4>
                </div>
                {restSaveSuccess && (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Profile Saved!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    value={restName}
                    onChange={(e) => setRestName(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Cuisine / Category</label>
                  <input
                    type="text"
                    required
                    value={restCuisine}
                    onChange={(e) => setRestCuisine(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Location & City</label>
                  <input
                    type="text"
                    value={restLocation}
                    onChange={(e) => setRestLocation(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Owner / GM Name</label>
                  <input
                    type="text"
                    value={restOwner}
                    onChange={(e) => setRestOwner(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={restEmail}
                    onChange={(e) => setRestEmail(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={restPhone}
                    onChange={(e) => setRestPhone(e.target.value)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-white block mb-1">POS System</label>
                  <select
                    value={restPos}
                    onChange={(e) => setRestPos(e.target.value as any)}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  >
                    {MODERN_POS_PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={restTaxRate}
                    onChange={(e) => setRestTaxRate(Number(e.target.value))}
                    className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-white block mb-1">Brand Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={restColor}
                      onChange={(e) => setRestColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-white/[0.08] cursor-pointer bg-[#090D16]"
                    />
                    <span className="font-mono text-xs">{restColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Google Place Review URL</label>
                <input
                  type="text"
                  value={restGoogleUrl}
                  onChange={(e) => setRestGoogleUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full bg-[#0D1322] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingRest}
                className="w-full py-2.5 bg-amber-500 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md mt-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingRest ? 'Saving Updates...' : 'Save Restaurant Profile Updates'}</span>
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#090D16] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Total active tables: <strong className="text-white">{currentTables.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
