import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Smartphone, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  RotateCw, 
  UtensilsCrossed, 
  Award,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
  Timer,
  Lock,
  MessageSquare,
  Gift,
  Flame,
  QrCode,
  MapPin,
  HelpCircle,
  Copy
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

interface Chapter {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  body: string[];
  highlightMetric: { value: string; label: string };
  callout?: { title: string; desc: string; type: 'danger' | 'success' | 'amber' };
}

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);

  // Scrollytelling active chapter index (0 to 6)
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const totalChapters = 7;

  // Chapter 6: Interactive ROI Calculator state
  const [dailyTables, setDailyTables] = useState<number>(60);
  const [avgBill, setAvgBill] = useState<number>(1200);

  // Wheel animation state for Chapter 4
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wonDiscount, setWonDiscount] = useState<string | null>(null);

  // Live anti-cheat clock for Chapter 5
  const [liveSeconds, setLiveSeconds] = useState(842);
  const [isPinVoided, setIsPinVoided] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation (ArrowDown / ArrowUp / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setActiveChapter((prev) => Math.min(totalChapters - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setActiveChapter((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const chapters: Chapter[] = [
    {
      id: 'pain',
      tag: '01 / The Bleeding Margin',
      title: 'Saturday Night 8:45 PM in Pune. Where Does Your Profit Go?',
      subtitle: 'The 3 hidden leaks quietly draining Indian restaurants every evening.',
      body: [
        'Zomato Gold & Swiggy Dineout take 18% to 25% of your food bill. For a table that spent ₹2,000, you hand over ₹400 for someone sitting in YOUR dining room.',
        'Waiters rush between tables writing orders on paper, miscommunicating with the kitchen, and forgetting modifiers during peak rush.',
        'Worst of all: If a diner has a poor experience, they write a 1-star Google review that hurts your ranking forever — and you have zero customer contact numbers to fix it.'
      ],
      highlightMetric: { value: '₹45,000+', label: 'Average monthly commission lost per outlet' },
      callout: {
        title: 'The Aggregator Trap',
        desc: 'Aggregators keep customer phone numbers strictly hidden so you can never market to your own guests directly.',
        type: 'danger'
      }
    },
    {
      id: 'experience',
      tag: '02 / Contactless Luxury',
      title: 'Diners Sit Down. No App to Install. 0.3s Magic.',
      subtitle: 'A high-definition visual dining menu on their own smartphone.',
      body: [
        'An elegant acrylic QR stand sits on Table 4. Diners simply point their phone camera — no app download, no sign-up friction.',
        'In 0.3 seconds, a magazine-quality menu opens with authentic photography, spice levels, chef notes, and beverage pairings.',
        'Diners order appetizers and cocktails immediately without waiting 15 minutes to flag down a busy server.'
      ],
      highlightMetric: { value: '+24%', label: 'Average increase in appetizer & beverage orders' },
      callout: {
        title: 'Zero Cellular Delay',
        desc: 'Optimized for slow 4G in basement dining rooms and rooftop decks with offline caching.',
        type: 'success'
      }
    },
    {
      id: 'petpooja',
      tag: '03 / Direct Kitchen Dispatch',
      title: 'KOT Prints Directly to Your Existing Petpooja Printer.',
      subtitle: 'Zero staff re-typing. Zero kitchen confusion.',
      body: [
        'The moment the diner taps "Place Order", Menuz fires the exact order payload directly into your Petpooja POS via certified API.',
        'The kitchen thermal printer immediately spits out the kitchen ticket (KOT) with table number, customizations, and special requests.',
        'Your staff doesn’t touch a tablet or punch anything twice. The kitchen cooks it immediately.'
      ],
      highlightMetric: { value: '0 sec', label: 'Waitstaff re-punching time per table' },
      callout: {
        title: 'Certified POS Bridge',
        desc: 'Works seamlessly with your existing Petpooja desktop billing terminal and kitchen stations.',
        type: 'amber'
      }
    },
    {
      id: 'reviews',
      tag: '04 / The Review Multiplier',
      title: '5x Your 5-Star Google Reviews on Pure Autopilot.',
      subtitle: 'The smart gamified reward loop with the Negative Review Shield.',
      body: [
        'When diners finish their meal, Menuz prompts them: "How was the Butter Chicken & Garlic Naan today?"',
        'If 5 Stars: Our AI Assistant drafts a glowing, keyword-rich review ("Crispy naan, authentic gravy"). The diner copies it to Google Maps in 1 tap, spins the lucky wheel, and wins 15% off!',
        'If 1 to 3 Stars: THE SHIELD ACTIVATES. It NEVER goes to Google Maps. Instead, the Floor Manager’s phone vibrates instantly: "Table 4 needs attention: Biryani salt level is high." You resolve it at the table before they walk out.'
      ],
      highlightMetric: { value: '+180', label: 'New verified 5★ Google reviews per month' },
      callout: {
        title: 'The Negative Review Shield',
        desc: 'Protects your public Google Maps rating from bad days by routing unhappy feedback privately to the manager.',
        type: 'success'
      }
    },
    {
      id: 'anticheat',
      tag: '05 / Margin Protection',
      title: 'Anti-Cheat Voucher Security. Zero Fraud.',
      subtitle: 'Engineered specifically so diners cannot cheat your discounts.',
      body: [
        'Restaurant owners often worry: "What if customers use old screenshots or share vouchers?" Menuz makes cheating impossible.',
        'Dynamic Live Seconds Clock: Seconds tick live on screen with a pulsating radar watermark. A static photo or screenshot is immediately exposed to the cashier.',
        '15-Minute Expiry: Vouchers expire automatically once the table bill is closed.',
        'Server PIN Void: The waiter taps a 4-digit PIN on the diner’s screen to permanently void the voucher in Petpooja.'
      ],
      highlightMetric: { value: '100%', label: 'Protection against voucher screenshot fraud' },
      callout: {
        title: 'Waitstaff PIN Protected',
        desc: 'Cashiers and servers void vouchers directly at checkout in 3 seconds.',
        type: 'amber'
      }
    },
    {
      id: 'economics',
      tag: '06 / The Honest Math',
      title: '0% Commission vs Aggregator Extortion.',
      subtitle: 'Keep 100% of your money. Own your customer database forever.',
      body: [
        'Zomato & Swiggy charge 18% to 25% commission on dine-in payments. Menuz charges a simple flat software fee of ₹1,999/month with 0% commission on your food.',
        'You collect customer names, phone numbers, and visit counts directly on your dashboard for WhatsApp re-engagement campaigns.',
        'Use the interactive calculator on the right to see your exact savings and review growth.'
      ],
      highlightMetric: { value: '0%', label: 'Commission on table food volume' },
      callout: {
        title: 'Own Your Audience',
        desc: 'Export your customer phone numbers anytime to launch Diwali and weekend WhatsApp specials.',
        type: 'success'
      }
    },
    {
      id: 'onboarding',
      tag: '07 / 24-Hour Deployment',
      title: 'Start Dominating Pune Dining This Weekend.',
      subtitle: '14-Day Free Pilot for your restaurant. Zero risk.',
      body: [
        'Step 1: We deliver custom-branded acrylic QR table stands with your logo, colors, and Wi-Fi code.',
        'Step 2: 1-click sync with your Petpooja RestID. Your menu, dishes, and GST rates import in 60 seconds.',
        'Step 3: Sit back as your kitchen prints KOTs automatically and 100+ new 5-star Google Reviews pour in every month.'
      ],
      highlightMetric: { value: '14 Days', label: 'Free trial on your first Pune outlet' },
      callout: {
        title: 'Zero Hardware To Buy',
        desc: 'Works with your existing smartphone, tablets, and thermal POS printers.',
        type: 'success'
      }
    }
  ];

  // ROI math
  const monthlyTables = dailyTables * 30;
  const monthlyVolume = monthlyTables * avgBill;
  const estimatedReviewsPerMonth = Math.round(monthlyTables * 0.10);
  const zomatoCommissionLost = Math.round(monthlyVolume * 0.18);
  const estimatedExtraRevenue = Math.round(monthlyVolume * 0.14);

  const curr = chapters[activeChapter];

  return (
    <div className="min-h-screen bg-[#090b10] text-white flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      {/* Top Scrollytelling Header */}
      <header className="sticky top-0 z-50 bg-[#090b10]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-2xl font-black tracking-tight text-white">
              MENU<span className="text-amber-500">Z</span>
            </span>
            <span className="hidden sm:inline-block bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Interactive Scrollytelling Deck
            </span>
          </div>

          {/* Chapter Quick Selector Dots */}
          <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 p-1 rounded-full">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(idx)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeChapter === idx
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'text-charcoal-400 hover:text-white'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/admin"
              className="text-xs text-charcoal-400 hover:text-white transition-colors hidden md:block"
            >
              Master Admin
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Live Diner Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${((activeChapter + 1) / totalChapters) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Scrollytelling Stage: Two Columns */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: The Narrative Story */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
          {/* Chapter Tag */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {curr.tag}
            </span>
            <span className="text-xs text-charcoal-500">
              Chapter {activeChapter + 1} of {totalChapters}
            </span>
          </div>

          {/* Chapter Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {curr.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base text-amber-200/90 font-medium leading-relaxed">
            {curr.subtitle}
          </p>

          {/* Body Paragraphs */}
          <div className="space-y-3.5 text-sm text-charcoal-300 leading-relaxed border-l-2 border-white/10 pl-4">
            {curr.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Highlight Metric Callout */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="font-serif text-3xl font-black text-amber-400 block">
                {curr.highlightMetric.value}
              </span>
              <span className="text-xs text-charcoal-400 font-medium">
                {curr.highlightMetric.label}
              </span>
            </div>

            {curr.callout && (
              <div className={`p-4 rounded-2xl border text-xs ${
                curr.callout.type === 'danger'
                  ? 'bg-red-950/30 border-red-500/30 text-red-300'
                  : curr.callout.type === 'amber'
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              }`}>
                <span className="font-bold block uppercase tracking-wider text-[10px] mb-1">
                  💡 {curr.callout.title}
                </span>
                <p className="leading-snug opacity-90">{curr.callout.desc}</p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={activeChapter === 0}
                onClick={() => setActiveChapter((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ChevronUp className="w-4 h-4" /> Previous
              </button>
              <button
                type="button"
                disabled={activeChapter === totalChapters - 1}
                onClick={() => setActiveChapter((p) => Math.min(totalChapters - 1, p + 1))}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Next Chapter <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[11px] text-charcoal-500 hidden sm:inline">
              Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">↓</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">↑</kbd> keys
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Device / Graphic Stage */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="w-full max-w-md bg-gradient-to-b from-[#141824] to-[#0c0f17] border-2 border-white/15 rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-all duration-500">
            {/* Top Phone Speaker / Island Notch */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10 text-[10px] text-charcoal-400 font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MENUZ LIVE SIMULATOR</span>
              </div>
              <span className="text-amber-400 font-bold uppercase">{curr.id.toUpperCase()}</span>
            </div>

            {/* DYNAMIC SCENE 01: THE BLEEDING MARGIN */}
            {activeChapter === 0 && (
              <div className="py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-2xl text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> Aggregator Bill Deductions
                    </span>
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold">
                      -22% CUT
                    </span>
                  </div>
                  <div className="font-mono text-xs text-white space-y-1">
                    <div className="flex justify-between">
                      <span className="text-charcoal-400">Table 8 Food Bill:</span>
                      <span>₹2,450.00</span>
                    </div>
                    <div className="flex justify-between text-red-400 font-bold">
                      <span>Zomato Dineout Cut (18%):</span>
                      <span>-₹441.00</span>
                    </div>
                    <div className="flex justify-between text-red-400 font-bold">
                      <span>Payment Gateway (2%):</span>
                      <span>-₹49.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-red-500/20">
                      <span>Owner Takes Home:</span>
                      <span>₹1,960.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left space-y-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>The Unanswered 1-Star Review</span>
                  </div>
                  <p className="text-charcoal-300 text-[11px] italic">
                    "Water took 20 minutes to arrive. Food was cold. Never coming back."
                  </p>
                  <p className="text-[10px] text-red-400 font-semibold pt-1">
                    Result: Permanently drags your Google rating from 4.4 to 4.2.
                  </p>
                </div>
              </div>
            )}

            {/* DYNAMIC SCENE 02: CONTACTLESS LUXURY */}
            {activeChapter === 1 && (
              <div className="py-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-300 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">Saffron House Contemporary</h3>
                    <p className="text-[10px] text-amber-400 font-semibold">Table 4 (Patio) • 0.3s QR Load</p>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Active
                  </span>
                </div>

                {/* Dish 1 */}
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80"
                    alt="Dal Makhani"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">Slow-Cooked Dal Makhani</span>
                    <span className="text-[10px] text-charcoal-400 block">Simmered 24 hours with white butter</span>
                    <span className="text-xs text-amber-400 font-bold mt-0.5 block">₹360</span>
                  </div>
                  <button className="px-2.5 py-1 bg-amber-500 text-black text-xs font-bold rounded-lg shrink-0">
                    + Add
                  </button>
                </div>

                {/* Dish 2 */}
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80"
                    alt="Butter Chicken"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">Old Delhi Butter Chicken</span>
                    <span className="text-[10px] text-charcoal-400 block">Charred tandoori morsels in silky makhani</span>
                    <span className="text-xs text-amber-400 font-bold mt-0.5 block">₹480</span>
                  </div>
                  <button className="px-2.5 py-1 bg-amber-500 text-black text-xs font-bold rounded-lg shrink-0">
                    + Add
                  </button>
                </div>

                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center justify-between">
                  <span>Tray: 2 Items Selected</span>
                  <span className="font-bold">Total: ₹840</span>
                </div>
              </div>
            )}

            {/* DYNAMIC SCENE 03: PETPOOJA DIRECT KOT */}
            {activeChapter === 2 && (
              <div className="py-4 space-y-3 animate-in fade-in zoom-in-95 duration-300 text-left">
                <div className="bg-amber-100 text-black p-4 rounded-2xl font-mono text-xs shadow-md space-y-2 border-t-4 border-amber-600">
                  <div className="text-center pb-2 border-b border-dashed border-gray-400">
                    <span className="text-xs font-black block">SAFFRON HOUSE KITCHEN KOT</span>
                    <span className="text-[10px] text-gray-700">*** PETPOOJA POS DIRECT INJECTION ***</span>
                    <span className="font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded text-[10px] inline-block mt-1">
                      KOT #1042 • TABLE 4
                    </span>
                  </div>

                  <div className="space-y-1 py-1 border-b border-dashed border-gray-400 text-[11px]">
                    <div className="flex justify-between font-bold">
                      <span>1x Old Delhi Butter Chicken</span>
                      <span>MEDIUM SPICE</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>1x Dal Makhani</span>
                      <span>EXTRA BUTTER</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>2x Garlic Naan</span>
                      <span>CRISPY</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-600 pt-1">
                    Special Note: "Please serve naans piping hot."
                    <br />
                    Source: Menuz Smart QR • 0 sec waiter re-entry
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Printed at kitchen counter without staff touching any device.</span>
                </div>
              </div>
            )}

            {/* DYNAMIC SCENE 04: THE REVIEW ENGINE & SHIELD */}
            {activeChapter === 3 && (
              <div className="py-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-300 text-left">
                {/* 5-Star Scenario */}
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> 5-Star Scenario (AI Boost)
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      Routed to Google Maps
                    </span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 text-[11px] text-charcoal-300">
                    "Had an unforgettable dinner at Saffron House! The Old Delhi Butter Chicken was rich and velvety, paired with hot garlic naan. 5/5 stars!"
                  </div>
                  <button
                    onClick={() => {
                      setIsWheelSpinning(true);
                      setTimeout(() => {
                        setIsWheelSpinning(false);
                        setWonDiscount('15% Off Your Entire Bill');
                      }, 1800);
                    }}
                    disabled={isWheelSpinning}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-saffron-600 hover:brightness-110 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isWheelSpinning ? 'animate-spin' : ''}`} />
                    <span>{isWheelSpinning ? 'Spinning...' : 'Test Lucky Wheel Spin'}</span>
                  </button>
                  {wonDiscount && (
                    <div className="p-2 bg-amber-500/20 border border-amber-400/40 rounded-lg text-center text-xs font-bold text-amber-300 animate-bounce">
                      🎉 Won: {wonDiscount}!
                    </div>
                  )}
                </div>

                {/* The Negative Shield */}
                <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-2xl space-y-1 text-xs">
                  <span className="font-bold text-red-400 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Unhappy Diner (1–3 Stars) Shield
                  </span>
                  <p className="text-[11px] text-charcoal-300">
                    Never touches Google Maps. Floor manager alerted instantly to resolve table grievance privately.
                  </p>
                </div>
              </div>
            )}

            {/* DYNAMIC SCENE 05: ANTI-CHEAT LIVE VOUCHER */}
            {activeChapter === 4 && (
              <div className="py-4 space-y-3 animate-in fade-in zoom-in-95 duration-300 text-left">
                <div className="bg-gradient-to-br from-charcoal-950 via-gray-900 to-charcoal-950 border-2 border-amber-400 rounded-2xl p-4 text-white space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE SECONDS TICKING: {Math.floor(liveSeconds / 60)}:{(liveSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                      Anti-Screenshot
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold block">15% Off Your Entire Bill</span>
                      <span className="text-[10px] text-charcoal-400">Table 4 • Ref: #WIN-4821</span>
                    </div>
                    <span className="font-mono text-xs font-black text-amber-400">15% OFF</span>
                  </div>

                  {!isPinVoided ? (
                    <button
                      onClick={() => setIsPinVoided(true)}
                      className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Server: Tap to Void (PIN: 1234)</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-center text-xs font-bold text-emerald-300">
                      ✓ VOIDED BY SERVER • APPLIED TO PETPOOJA BILL
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-charcoal-400 text-center">
                  Screenshots show a frozen clock and are rejected by your cashier.
                </p>
              </div>
            )}

            {/* DYNAMIC SCENE 06: THE HONEST MATH & CALCULATOR */}
            {activeChapter === 5 && (
              <div className="py-3 space-y-4 animate-in fade-in zoom-in-95 duration-300 text-left">
                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-charcoal-300">Daily Tables:</span>
                      <span className="text-amber-400">{dailyTables} tables/day</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={150}
                      value={dailyTables}
                      onChange={(e) => setDailyTables(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-charcoal-300">Average Table Bill:</span>
                      <span className="text-amber-400">₹{avgBill.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min={400}
                      max={3000}
                      step={100}
                      value={avgBill}
                      onChange={(e) => setAvgBill(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl">
                    <span className="text-[10px] text-emerald-300 font-bold block uppercase">Extra Revenue</span>
                    <span className="text-lg font-serif font-black text-white">+₹{estimatedExtraRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-red-950/40 border border-red-500/40 p-3 rounded-xl">
                    <span className="text-[10px] text-red-300 font-bold block uppercase">Aggregator Cut Saved</span>
                    <span className="text-lg font-serif font-black text-white">₹{zomatoCommissionLost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC SCENE 07: 24-HOUR DEPLOYMENT */}
            {activeChapter === 6 && (
              <div className="py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-3xl">
                  🚀
                </div>
                <h3 className="font-serif font-bold text-xl text-white">Pune Pilot Activation</h3>
                <p className="text-xs text-charcoal-300 max-w-xs mx-auto">
                  Try Menuz free for 14 days. We print your acrylic stands and link your Petpooja POS in 24 hours.
                </p>

                <div className="pt-2 space-y-2">
                  <Link
                    to="/admin"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-saffron-500 to-orange-500 hover:brightness-110 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-float"
                  >
                    <span>Open Master Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>Launch Live Table Menu</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
