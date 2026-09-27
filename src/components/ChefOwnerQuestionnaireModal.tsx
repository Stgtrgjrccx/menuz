import React, { useState } from 'react';
import {
  X, Sparkles, ChefHat, Heart, Award, FileText, Download,
  Printer, Check, Save, MessageSquare, AlertCircle, RefreshCw,
  Flame, GlassWater, BookOpen, UserCheck
} from 'lucide-react';
import { Restaurant, ChefOwnerAiPersona } from '../types';

interface ChefOwnerQuestionnaireModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onSavePersona: (persona: ChefOwnerAiPersona) => void;
}

export const ChefOwnerQuestionnaireModal: React.FC<ChefOwnerQuestionnaireModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onSavePersona
}) => {
  const defaultPersona: ChefOwnerAiPersona = restaurant.ai_persona || {
    chef_name: 'Head Chef',
    chef_title: 'Executive Head Chef',
    chef_bio: 'Master of authentic regional recipes with 15+ years of kitchen mastery.',
    chef_philosophy: 'Uncompromising fresh ingredients and time-honored traditional preparation.',
    owner_name: restaurant.owner_name || 'Restaurant Owner',
    owner_hospitality_note: `Welcome to ${restaurant.name}. We treat every diner as an honored guest in our home.`,
    greeting_tone: 'warm_traditional',
    signature_pairings: [
      { dish_name: 'Signature Main', pairing_drink: 'House Special Beverage', why: 'Complements the spice and rich aromas.' }
    ],
    secret_stories: [
      { dish_name: 'House Specialty', story: 'Slow-cooked using our secret family spice blend perfected over decades.' }
    ],
    spice_guidance: 'Level 1 is mild and aromatic; Level 3 is traditional authentic heat; Level 5 is fiery.',
    dietary_rules: 'Strict hygiene and separate stations for vegetarian and non-vegetarian dishes.'
  };

  const [formData, setFormData] = useState<ChefOwnerAiPersona>(defaultPersona);
  const [activeSection, setActiveSection] = useState<'chef' | 'owner' | 'dishes' | 'print'>('chef');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePersona(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrintQuestionnaire = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-ivory-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-white text-orange-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              AI Persona Studio
            </span>
            <span className="bg-orange-900/40 text-orange-100 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 100% Chef & Owner Trained
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-white">
            {restaurant.name} · Chef & Owner Knowledge Onboarding
          </h2>
          <p className="text-xs text-orange-100 max-w-2xl mt-1 leading-relaxed">
            Fill out this questionnaire to train your restaurant's dedicated AI dining concierge with your executive chef's culinary secrets, owner hospitality tone, and signature pairings.
          </p>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-5 border-t border-white/20 pt-4">
            <button
              onClick={() => setActiveSection('chef')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'chef' ? 'bg-white text-orange-900 shadow-sm' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <ChefHat className="w-4 h-4" /> 1. Head Chef Philosophy
            </button>
            <button
              onClick={() => setActiveSection('owner')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'owner' ? 'bg-white text-orange-900 shadow-sm' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Heart className="w-4 h-4" /> 2. Owner Lore & Tone
            </button>
            <button
              onClick={() => setActiveSection('dishes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'dishes' ? 'bg-white text-orange-900 shadow-sm' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" /> 3. Secrets & Pairings
            </button>
            <button
              onClick={() => setActiveSection('print')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSection === 'print' ? 'bg-white text-orange-900 shadow-sm' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Printer className="w-4 h-4" /> 4. Print Blank Form
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* SECTION 1: CHEF PHILOSOPHY */}
          {activeSection === 'chef' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <ChefHat className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-950">Executive Chef Credentials & Kitchen Philosophy</h4>
                  <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                    The AI uses this to introduce the culinary team and explain why dishes are cooked a certain way.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Head Chef Full Name</label>
                  <input
                    type="text"
                    value={formData.chef_name}
                    onChange={(e) => setFormData({ ...formData, chef_name: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Chef Sanjay Rawat"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Official Culinary Title</label>
                  <input
                    type="text"
                    value={formData.chef_title}
                    onChange={(e) => setFormData({ ...formData, chef_title: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Executive Head Chef & Master of Dum Pukht"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">Chef Bio & Heritage Background</label>
                <textarea
                  rows={2}
                  value={formData.chef_bio}
                  onChange={(e) => setFormData({ ...formData, chef_bio: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                  placeholder="Where did the chef train? What cooking traditions do they master?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">Core Kitchen Philosophy & Ingredient Standards</label>
                <textarea
                  rows={2}
                  value={formData.chef_philosophy}
                  onChange={(e) => setFormData({ ...formData, chef_philosophy: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. We use hand-pounded spices, cold-pressed mustard oil, and 24-hour slow braising."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">Spice Scale Calibration (1 to 5)</label>
                <input
                  type="text"
                  value={formData.spice_guidance}
                  onChange={(e) => setFormData({ ...formData, spice_guidance: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. 1 = Mild aromatic, 3 = Traditional Indian, 5 = Fiery Guntur chili heat"
                />
              </div>
            </div>
          )}

          {/* SECTION 2: OWNER LORE & HOSPITALITY */}
          {activeSection === 'owner' && (
            <div className="space-y-4">
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                <Heart className="w-5 h-5 text-orange-700 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-orange-950">Owner Hospitality & Brand Voice</h4>
                  <p className="text-xs text-orange-900/80 mt-0.5 leading-relaxed">
                    Controls how warm, formal, or enthusiastic the AI speaks to visiting diners.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">Founder / Owner Name(s)</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Vikramaditya Singhania"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">AI Greeting & Voice Style</label>
                  <select
                    value={formData.greeting_tone}
                    onChange={(e: any) => setFormData({ ...formData, greeting_tone: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="warm_traditional">Warm Traditional ('Atithi Devo Bhava')</option>
                    <option value="bistro_cozy">Cozy European Trattoria / Bistro</option>
                    <option value="fine_dining_artisan">Artisanal Fine Dining Sommelier</option>
                    <option value="modern_chic">Modern Chic & Fast-Casual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">Owner Welcome Message & Guest Promise</label>
                <textarea
                  rows={3}
                  value={formData.owner_hospitality_note}
                  onChange={(e) => setFormData({ ...formData, owner_hospitality_note: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                  placeholder="What is the story behind opening this restaurant? How should diners feel?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">Dietary Safety & Kitchen Rules</label>
                <textarea
                  rows={2}
                  value={formData.dietary_rules}
                  onChange={(e) => setFormData({ ...formData, dietary_rules: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs text-charcoal-900 focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. 100% separate fryers for vegetarian, gluten-free prep protocol, nut allergy warnings."
                />
              </div>
            </div>
          )}

          {/* SECTION 3: DISH SECRETS & SIGNATURE PAIRINGS */}
          {activeSection === 'dishes' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Dish Secrets, Stories & Sommelier Pairings</h4>
                  <p className="text-xs text-emerald-900/80 mt-0.5 leading-relaxed">
                    When diners ask about a dish, the AI quotes these authentic stories to drive high-margin upselling.
                  </p>
                </div>
              </div>

              {/* Secret Stories */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-600" /> Signature Dish Backstories (Trained in AI)
                </h5>
                {formData.secret_stories.map((s, idx) => (
                  <div key={idx} className="bg-ivory-50 border border-ivory-200 p-3.5 rounded-2xl space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={s.dish_name}
                        onChange={(e) => {
                          const updated = [...formData.secret_stories];
                          updated[idx].dish_name = e.target.value;
                          setFormData({ ...formData, secret_stories: updated });
                        }}
                        className="bg-white border border-ivory-300 rounded-xl p-2 text-xs font-bold text-charcoal-900"
                        placeholder="Dish Name"
                      />
                      <input
                        type="text"
                        value={s.story}
                        onChange={(e) => {
                          const updated = [...formData.secret_stories];
                          updated[idx].story = e.target.value;
                          setFormData({ ...formData, secret_stories: updated });
                        }}
                        className="sm:col-span-2 bg-white border border-ivory-300 rounded-xl p-2 text-xs text-charcoal-900"
                        placeholder="Secret backstory, heirloom recipe origin, or cooking method..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pairings */}
              <div className="space-y-3 pt-2 border-t border-ivory-200">
                <h5 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GlassWater className="w-4 h-4 text-blue-600" /> Chef & Owner Signature Drink Pairings
                </h5>
                {formData.signature_pairings.map((p, idx) => (
                  <div key={idx} className="bg-ivory-50 border border-ivory-200 p-3.5 rounded-2xl space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={p.dish_name}
                        onChange={(e) => {
                          const updated = [...formData.signature_pairings];
                          updated[idx].dish_name = e.target.value;
                          setFormData({ ...formData, signature_pairings: updated });
                        }}
                        className="bg-white border border-ivory-300 rounded-xl p-2 text-xs font-bold text-charcoal-900"
                        placeholder="Dish Name"
                      />
                      <input
                        type="text"
                        value={p.pairing_drink}
                        onChange={(e) => {
                          const updated = [...formData.signature_pairings];
                          updated[idx].pairing_drink = e.target.value;
                          setFormData({ ...formData, signature_pairings: updated });
                        }}
                        className="bg-white border border-ivory-300 rounded-xl p-2 text-xs text-charcoal-900 font-semibold"
                        placeholder="Recommended Beverage / Wine"
                      />
                      <input
                        type="text"
                        value={p.why}
                        onChange={(e) => {
                          const updated = [...formData.signature_pairings];
                          updated[idx].why = e.target.value;
                          setFormData({ ...formData, signature_pairings: updated });
                        }}
                        className="bg-white border border-ivory-300 rounded-xl p-2 text-xs text-charcoal-900"
                        placeholder="Why they pair perfectly..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: PRINTABLE QUESTIONNAIRE HANDOUT */}
          {activeSection === 'print' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-blue-950">Printable Handout for Restaurant Owner & Chef</h4>
                  <p className="text-xs text-blue-900/80 mt-0.5">
                    Print this sheet to give to the owner and head chef during initial onboarding.
                  </p>
                </div>
                <button
                  onClick={handlePrintQuestionnaire}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Handout
                </button>
              </div>

              {/* Printable Paper Preview */}
              <div className="border-2 border-dashed border-ivory-300 rounded-2xl p-6 bg-ivory-50/50 space-y-4 text-charcoal-900">
                <div className="text-center pb-4 border-b border-ivory-200">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-700">MENUZ RESTAURANT AI SYSTEM</span>
                  <h3 className="font-serif text-xl font-bold">{restaurant.name} · Chef & Owner Intake Form</h3>
                  <p className="text-xs text-charcoal-600">Please fill out these 6 questions to train your dining concierge.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-ivory-200">
                    <p className="font-bold">1. Head Chef Name & Bio:</p>
                    <p className="text-charcoal-600 italic mt-1">{formData.chef_name} ({formData.chef_title}) — {formData.chef_bio}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-ivory-200">
                    <p className="font-bold">2. Culinary Philosophy & Signature Techniques:</p>
                    <p className="text-charcoal-600 italic mt-1">{formData.chef_philosophy}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-ivory-200">
                    <p className="font-bold">3. Owner's Welcome Message to Diners:</p>
                    <p className="text-charcoal-600 italic mt-1">{formData.owner_hospitality_note}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-ivory-200">
                    <p className="font-bold">4. Top 3 Dish Secrets & Stories:</p>
                    <ul className="list-disc list-inside text-charcoal-600 italic mt-1 space-y-1">
                      {formData.secret_stories.map((s, i) => (
                        <li key={i}><strong>{s.dish_name}:</strong> {s.story}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-ivory-200">
                    <p className="font-bold">5. Signature Beverage Pairings:</p>
                    <ul className="list-disc list-inside text-charcoal-600 italic mt-1 space-y-1">
                      {formData.signature_pairings.map((p, i) => (
                        <li key={i}><strong>{p.dish_name}</strong> + <strong>{p.pairing_drink}</strong>: {p.why}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-ivory-50 border-t border-ivory-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> AI Persona Saved & Trained Successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-ivory-100 text-charcoal-700 border border-ivory-300 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" /> Save & Train AI Persona
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
