import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Printer, 
  Sparkles, 
  Smartphone, 
  RotateCw,
  ShieldCheck,
  QrCode,
  Users,
  CheckCircle2,
  Bell,
  Clock,
  Lock,
  Flame,
  UtensilsCrossed,
  MapPin,
  Check,
  Layers,
  ChevronDown,
  FileText,
  Download
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { SelfServeKotSetupWizard } from '../components/SelfServeKotSetupWizard';

// Web Audio API chimes for interactive pitch experience
function playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.2) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio muted or not supported
  }
}

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);

  // Active section (0 to 4)
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSections = 5;

  // Simulator states for Chapter 1: The Google Rating Dilemma
  const [demoRating, setDemoRating] = useState<'average' | 'stellar'>('stellar');

  // Simulator states for Chapter 2: Chef & Owner AI Chatbot
  const [selectedAiQuery, setSelectedAiQuery] = useState<'chef' | 'spice' | 'allergen' | 'pairing'>('chef');
  const [aiItemAdded, setAiItemAdded] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Simulator states for Chapter 3: Universal Kitchen KOT (Petpooja, RoyalPOS, Recaho, RanceLab, Direct ESC/POS)
  const [selectedDeckPos, setSelectedDeckPos] = useState<'Petpooja' | 'RoyalPOS' | 'Recaho' | 'RanceLab' | 'Direct ESC/POS'>('Petpooja');
  const [kotPrinting, setKotPrinting] = useState(false);
  const [kotPrinted, setKotPrinted] = useState(true);

  // Simulator states for Chapter 4: AI Review Booster & Floor Shield
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>('15% Off Food Bill');

  // Simulator states for Chapter 5: Anti-Cheat & ROI
  const [voucherSeconds, setVoucherSeconds] = useState(882); // 14m 42s
  const [enteredPin, setEnteredPin] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Live countdown timer for voucher demo
  useEffect(() => {
    const timer = setInterval(() => {
      setVoucherSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerifyPin = () => {
    if (enteredPin === '1234') {
      setPinVerified(true);
      setPinError(false);
      playTone(587.33, 'triangle', 0.25);
    } else {
      setPinError(true);
      playTone(196, 'sawtooth', 0.3);
    }
  };

  const handlePrintKot = () => {
    setKotPrinting(true);
    playTone(440, 'square', 0.1);
    setTimeout(() => {
      setKotPrinting(false);
      setKotPrinted(true);
      playTone(880, 'triangle', 0.2);
    }, 800);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    playTone(392, 'sine', 0.1);
    setTimeout(() => playTone(440, 'sine', 0.1), 200);
    setTimeout(() => playTone(493.88, 'sine', 0.1), 400);
    setTimeout(() => playTone(523.25, 'sine', 0.15), 600);
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize('15% Off Total Food Bill');
      playTone(659.25, 'triangle', 0.35);
    }, 1200);
  };

  // Keyboard navigation between sections
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToSection(Math.min(totalSections - 1, activeSection + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToSection(Math.max(0, activeSection - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeSection]);

  // Automatic scroll spy using IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(idx);
            }
          });
        },
        { rootMargin: '-20% 0px -40% 0px', threshold: 0.2 }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    sectionRefs[index]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chapters = [
    { num: '01', short: 'The Dilemma', title: 'The Silent Diner Dilemma' },
    { num: '02', short: "Chef's AI Chatbot", title: 'Chef & Owner Trained AI Dining Chatbot' },
    { num: '03', short: 'Universal KOT', title: 'Universal POS & Kitchen KOT Integration' },
    { num: '04', short: 'Review Shield', title: 'AI Review & 4★ Floor Shield' },
    { num: '05', short: 'Zero Commission', title: 'Anti-Cheat Security & 0% Cut' }
  ];

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black antialiased">
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. TOP STICKY EXECUTIVE NAVIGATION BAR                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#0d121c]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-md text-sm">
                M
              </span>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  MENU<span className="text-amber-500">Z</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-1 hidden sm:block">
                  Restaurant Partner Deck
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Jump Chapter Pills */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {chapters.map((ch, idx) => (
              <button
                key={ch.num}
                type="button"
                onClick={() => scrollToSection(idx)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeSection === idx
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={ch.title}
              >
                <span>{ch.num}</span>
                <span className="hidden md:inline">{ch.short}</span>
              </button>
            ))}
          </nav>

          {/* Live System Demo Links & PDF Download */}
          <div className="flex items-center space-x-2">
            <a
              href="./menuz_complete_pitch_and_product_deck.pdf"
              download="Menuz_Complete_Pitch_and_Product_Deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-amber-500/30 shadow-xs"
              title="Download Full Multi-Page Pitch & Product Architecture PDF"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Download Deck (PDF)</span>
              <span className="sm:hidden">PDF</span>
            </a>
            <Link
              to="/admin"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors hidden lg:inline-flex items-center gap-1"
            >
              <span>Admin Floor</span>
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live Diner Menu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN SCROLLYTELLING CONTAINER                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 01: THE SILENT DINER DILEMMA                             */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[0]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12 border-b border-slate-800/60"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column (15-Second Glance) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 01</span>
                <span>•</span>
                <span>THE REPUTATION BOTTLENECK</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                95% of Happy Diners <span className="text-amber-400">Leave Silently.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Satisfied guests rarely post on Google Maps. But if just one guest encounters a delay or cold soup, they leave a permanent 1-star review that damages your weekend walk-in footfall forever.
              </p>

              {/* 3 Core Owner Pain Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Negative Reviews Live Forever</h2>
                    <p className="text-xs text-slate-300 mt-0.5">A single 1-star review on Google Maps lowers your search rank and repels new walk-in diners.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Managers Hear Too Late</h2>
                    <p className="text-xs text-slate-300 mt-0.5">By the time the floor manager reads the complaint on Google, the customer has already left unhappy.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">The 4.8★ Revenue Advantage</h2>
                    <p className="text-xs text-slate-300 mt-0.5">Restaurants above 4.7★ on Google Maps command 30% higher table reservations and zero marketing spend.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(1)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>See How Menuz Fixes This</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual Card: Google Maps Impact Simulator */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Google Maps Restaurant Profile
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Pune Fine Dining</span>
                </div>

                {/* Rating State Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setDemoRating('average')}
                    className={`py-2 rounded-lg transition-all ${
                      demoRating === 'average'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Without Menuz (4.1★)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRating('stellar')}
                    className={`py-2 rounded-lg transition-all ${
                      demoRating === 'stellar'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    With Menuz Engine (4.8★)
                  </button>
                </div>

                {/* Interactive Card Display */}
                {demoRating === 'average' ? (
                  <div className="bg-slate-900/80 border border-red-500/30 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-white">Saffron House Contemporary Dining</h3>
                        <p className="text-xs text-slate-400">North Indian • Koregaon Park</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-amber-400 font-mono">4.1</span>
                        <div className="text-xs text-amber-400">★★★★☆</div>
                        <span className="text-[10px] text-slate-400 block">42 reviews</span>
                      </div>
                    </div>

                    <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex items-center text-red-400 font-bold gap-1">
                        <span>★☆☆☆☆</span>
                        <span>"Food was delayed by 25 mins. Terrible service."</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Public Google review posted 3 days ago • Unresolved</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-slate-400">Weekend Table Occupancy:</span>
                      <span className="font-bold text-red-400 font-mono">55% (Empty Tables)</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-extrabold text-white">Saffron House Contemporary Dining</h3>
                        <p className="text-xs text-emerald-400 font-medium">Verified Top Rated in Koregaon Park</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400 font-mono">4.8</span>
                        <div className="text-xs text-amber-400">★★★★★</div>
                        <span className="text-[10px] text-slate-400 block">284 verified reviews</span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex items-center text-emerald-400 font-bold gap-1">
                        <span>★★★★★</span>
                        <span>"Exceptional Old Delhi Butter Chicken! Fast service at Table 4."</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80 block">AI-Assisted diner review with dish mention • 2 hours ago</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-slate-400">Weekend Table Occupancy:</span>
                      <span className="font-bold text-emerald-400 font-mono">98% (Waitlist at Door)</span>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 text-center italic">
                  💡 Menuz turns 95% of happy silent diners into verified 5-star Google reviews.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 02: CHEF & OWNER TRAINED AI CHATBOT                      */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[1]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12 border-b border-slate-800/60 bg-[#0b0f18]"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 02</span>
                <span>•</span>
                <span>CHEF &amp; OWNER TRAINED AI CHATBOT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Trained Directly by Your <span className="text-amber-400">Head Chef &amp; Owner.</span>
                <span className="block text-2xl sm:text-3xl font-bold text-slate-300 mt-1">A Personalised Dining Concierge at Every Table.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Generic AI chatbots hallucinate ingredients. Menuz elevates the table experience: <strong>a personalized concierge trained directly by your Head Chef and Restaurant Owner</strong>. It knows your kitchen's secret recipe notes, calibrated spice levels (1-5), allergen cautions, and your owner's high-margin pairing rules.
              </p>

              {/* 3 Pillars of Chef & Owner Training */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">🧑‍🍳</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Trained by Head Chef: True Spice &amp; Recipes</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Calibrated spice meters (1-5), secret marinades, preparation styles, and exact allergen cross-contamination warnings.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">💼</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Trained by Restaurant Owner: High-Margin Upselling</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Subtly suggests signature coolers, hot tandoor breads, and desserts that pair perfectly with the diner's selection, increasing check size by +18%.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">5-Min Fast Intake: Voice Dictation &amp; 1-Click AI Auto-Draft</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Chefs don't type for hours — 1-click auto-completes secret spices, origin lore, pairings, and daily morning catch broadcasts with voice input and printable PDF sheets.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next & Try Studio Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(2)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>See How It Connects to POS &amp; KOT</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <Link
                  to="/ai-studio"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Try AI Onboarding Studio Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Visual: Live Chef & Owner AI Chatbot Simulation */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-saffron-600 flex items-center justify-center text-xs">
                      🧑‍🍳
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Saffron House • Chef's AI Assistant</span>
                      <span className="text-[10px] text-amber-400/90 font-mono">Trained directly by Chef Sanjeev &amp; Owner Rohit</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    Live Chat Simulation
                  </span>
                </div>

                {/* Interactive Query Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Click a question to test Chef &amp; Owner training:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAiQuery('chef');
                        setAiItemAdded(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                        selectedAiQuery === 'chef'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🧑‍🍳 Chef recommendations
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAiQuery('spice');
                        setAiItemAdded(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                        selectedAiQuery === 'spice'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🔥 Spice level check
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAiQuery('pairing');
                        setAiItemAdded(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                        selectedAiQuery === 'pairing'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🍷 Owner's pairing upsell
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAiQuery('allergen');
                        setAiItemAdded(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                        selectedAiQuery === 'allergen'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🌾 Gluten &amp; nut-free check
                    </button>
                  </div>
                </div>

                {/* Dialogue Container */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 min-h-[220px] flex flex-col justify-between">
                  {/* Diner Bubble */}
                  <div className="flex justify-end">
                    <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-2xl rounded-tr-sm text-xs text-amber-200 max-w-[80%]">
                      {selectedAiQuery === 'chef' && "What does the Chef recommend for first-time diners tonight?"}
                      {selectedAiQuery === 'spice' && "Is the Butter Chicken spicy? We have elderly parents and kids."}
                      {selectedAiQuery === 'pairing' && "What drink and bread does the owner recommend with curries?"}
                      {selectedAiQuery === 'allergen' && "Do you have gluten-free or nut-free dishes prepared safely?"}
                    </div>
                  </div>

                  {/* AI Response Bubble */}
                  <div className="flex justify-start">
                    <div className="bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs text-slate-200 max-w-[90%] space-y-2">
                      <p className="leading-relaxed">
                        {selectedAiQuery === 'chef' && "Chef Sanjeev highlights our Old Delhi Butter Chicken and 16-hour Slow-Cooked Dal Makhani. Both are prepared with hand-churned white butter and aromatic Kashmiri spices."}
                        {selectedAiQuery === 'spice' && "Old Delhi Butter Chicken is calibrated at Spice 1/5 (very mild). The gravy is tomato, cream, and cashew based with zero harsh green chilies. It's 100% kid and senior-friendly."}
                        {selectedAiQuery === 'pairing' && "Owner Rohit recommends pairing rich curries with our clay-oven Garlic Butter Naan and a chilled Kokum Mint Cooler to refresh your palate between bites."}
                        {selectedAiQuery === 'allergen' && "Our Slow-Cooked Dal Makhani and Tandoori Murgh are 100% gluten-free. For nut allergies, our kitchen uses dedicated allergen-safe pans and separate ladles."}
                      </p>

                      {/* Chef / Owner Note Box */}
                      <div className="bg-amber-500/10 border-l-2 border-amber-500 px-2.5 py-1.5 rounded-r-md text-[11px] text-amber-300">
                        {selectedAiQuery === 'chef' && "🧑‍🍳 Chef's Secret: Hand-smoked charcoal tandoori finish gives it the iconic Old Delhi flavor."}
                        {selectedAiQuery === 'spice' && "🧑‍🍳 Chef's Note: Spice can be customized to zero heat upon your request."}
                        {selectedAiQuery === 'pairing' && "💼 Owner's Tip: Pairing cooler + naan completes the meal and qualifies for our Google Review dessert reward!"}
                        {selectedAiQuery === 'allergen' && "🧑‍🍳 Chef's Safety Guarantee: All cross-contamination protocols verified in our kitchen."}
                      </div>

                      {/* 1-Tap Add to Tray */}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                        <span className="text-[11px] font-bold text-white">
                          {selectedAiQuery === 'chef' && "Old Delhi Butter Chicken • ₹480"}
                          {selectedAiQuery === 'spice' && "Kid-Friendly Butter Chicken • ₹480"}
                          {selectedAiQuery === 'pairing' && "Garlic Naan & Kokum Cooler • ₹240"}
                          {selectedAiQuery === 'allergen' && "Gluten-Free Dal Makhani • ₹360"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAiItemAdded(true);
                            playTone(587.33, 'triangle', 0.2);
                          }}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                            aiItemAdded
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          {aiItemAdded ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Added to Tray ✓</span>
                            </>
                          ) : (
                            <>
                              <span>+ Add to Table Tray</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center">
                  💡 Zero hallucinations: The AI answers only using your exact menu recipes, spice data, and owner upsell rules.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 03: UNIVERSAL POS & DIRECT KITCHEN KOT                   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[2]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12 border-b border-slate-800/60"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 03</span>
                <span>•</span>
                <span>TRIPLE-REDUNDANCY KITCHEN KOT ENGINE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Take All 3 Connections Available: <span className="text-amber-400">Setup Can Be Done Any How.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Menuz doesn't restrict you to one single channel. <strong>Take all 3 connections simultaneously</strong> — Cloud POS API (Petpooja, Recaho, RanceLab) + Local Wi-Fi LAN Bridge (RoyalPOS / Android / Windows) + Direct Hardware ESC/POS Thermal Printer (Port 9100). Setup can be done any how in under 2 minutes without developer help, providing 100% zero-downtime kitchen order tickets even if WAN internet drops.
              </p>

              {/* Self-Service Quick Setup Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className="text-xs">⚡</span>
                    <span className="text-xs font-bold text-white">Triple-Sync 2-Minute KOT Setup</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                      Zero-Dev / All 3 Connections
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Connect Cloud POS, Local Wi-Fi Tablet &amp; Direct Thermal Printer together so no kitchen order is ever dropped.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Launch 2-Min Wizard</span>
                  <span>→</span>
                </button>
              </div>

              {/* 3-Step Real-time KOT Architecture Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                    How The Menuz KOT System Works
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ⚡ 1-Second Latency
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-md">STEP 1</span>
                    <div className="text-xs font-bold text-white mt-1">Diner Scans &amp; Orders</div>
                    <p className="text-[10px] text-slate-400">Table QR opens menu on their phone. Customized order sent in 1 tap.</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[9px] font-black text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded-md">STEP 2</span>
                    <div className="text-xs font-bold text-white mt-1">Universal POS Bridge</div>
                    <p className="text-[10px] text-slate-400">Routes to Petpooja, RoyalPOS, Recaho, RanceLab, or LAN printer.</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">STEP 3</span>
                    <div className="text-xs font-bold text-white mt-1">Kitchen Beeps &amp; Prints</div>
                    <p className="text-[10px] text-slate-400">80mm thermal paper KOT fires in 1 second. Zero staff handwriting mistakes.</p>
                  </div>
                </div>
              </div>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Printer className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant 80mm ESC/POS Printing</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Thermal kitchen printer fires immediately with table number, items, and preparation notes.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Every Major POS in India &amp; Pune</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Built-in adapters for Petpooja (50k+ outlets), RoyalPOS (FC Road/Pune local), Recaho (PCMC/Chakan), and RanceLab (Chains), plus direct network thermal printer printing.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2-Way Live Menu &amp; 86 Item Sync</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Mark a dish sold out in your POS, and it instantly hides from diner mobile menus.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(3)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>See The Google Review Shield</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual: Universal POS Thermal KOT Printout */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                {/* Header & Re-Print */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {selectedDeckPos} Kitchen Thermal Printer
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrintKot}
                    disabled={kotPrinting}
                    className="text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCw className={`w-3 h-3 ${kotPrinting ? 'animate-spin' : ''}`} />
                    <span>{kotPrinting ? 'Printing...' : 'Re-Print KOT'}</span>
                  </button>
                </div>

                {/* POS Selector Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-center">
                  {(['Petpooja', 'RoyalPOS', 'Recaho', 'RanceLab', 'Direct ESC/POS'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setSelectedDeckPos(pos)}
                      className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all truncate ${
                        selectedDeckPos === pos
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>

                {/* Connection Protocol Pill */}
                <div className="text-[10px] text-center font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  {selectedDeckPos === 'Petpooja' && '⚡ Cloud REST API (restID + app_key) • 50k+ Outlets in India'}
                  {selectedDeckPos === 'RoyalPOS' && '📶 Local LAN Wi-Fi API (Port 8080) • FC Road & Pune QSRs'}
                  {selectedDeckPos === 'Recaho' && '☁️ Cloud REST API (X-Api-Key) • PCMC & Suburban Pune Hub'}
                  {selectedDeckPos === 'RanceLab' && '🏢 FusionResto Enterprise API • Multi-Outlet Chains & Fine Dining'}
                  {selectedDeckPos === 'Direct ESC/POS' && '🖨️ Wi-Fi / Ethernet TCP Direct (Port 9100) • Works Without POS API'}
                </div>

                {/* 80mm ESC/POS Thermal Receipt Simulation */}
                <div className="bg-[#fffdfa] text-slate-950 p-5 rounded-xl font-mono text-xs shadow-lg space-y-2 border-t-4 border-amber-500">
                  <div className="text-center pb-2 border-b border-dashed border-slate-400">
                    <span className="font-extrabold text-sm tracking-wide block">SAFFRON HOUSE • KOREGAON PARK</span>
                    <span className="font-bold text-xs text-slate-800 block">KITCHEN ORDER TICKET (KOT #1042)</span>
                    <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                      <span>TABLE: #4 (PATIO)</span>
                      <span>TIME: 20:45:12</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 py-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>1x OLD DELHI BUTTER CHICKEN</span>
                      <span>[MEDIUM]</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>1x SLOW-COOKED DAL MAKHANI</span>
                      <span>[EXTRA BUTTER]</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>2x GARLIC BUTTER NAAN</span>
                      <span>[CRISPY]</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-slate-400 text-[10px] text-slate-600 space-y-0.5">
                    <div className="flex justify-between">
                      <span>SOURCE: Menuz QR In-Table</span>
                      <span className="text-emerald-700 font-bold">
                        {selectedDeckPos === 'Direct ESC/POS'
                          ? 'ESC/POS: OK (RAW PRINT)'
                          : `${selectedDeckPos.toUpperCase()} STATUS: OK (200)`}
                      </span>
                    </div>
                    <div className="text-center text-slate-500 pt-1">
                      *** {selectedDeckPos.toUpperCase()} KITCHEN COPY • NO CASH VALUE ***
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Time saved per order:</span>
                  <span className="font-bold text-amber-400 font-mono">3–5 Minutes (Zero Staff Re-typing)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 04: AI REVIEW GENERATOR & 4★ FLOOR SHIELD                */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[3]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12 border-b border-slate-800/60 bg-[#0b0f18]"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 04</span>
                <span>•</span>
                <span>THE REPUTATION ENGINE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Public 5★ Reviews. <span className="text-amber-400">Complaints Stay Private.</span>
              </h2>

              {/* Timing callout */}
              <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl text-red-300 text-xs">
                <span className="text-red-400 font-black text-base">⚡</span>
                <span><strong className="text-white">Triggered the moment they scan</strong> — before they even browse the menu. Not at bill time.</span>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                The review challenge appears instantly when a diner scans the QR code. They rate, get an AI-written Google review, and spin the Lucky Wheel — all before they've even placed an order. A 1-3 star rating never reaches Google Maps; it silently alerts your manager to fix it at the table.
              </p>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Writes Dish-Specific Reviews</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Mentions actual dishes ("crispy garlic naan", "tender butter chicken") so Google indexes your best menu items.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <RotateCw className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Lucky Wheel Hooks Them on the Way In</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Guests spin immediately on scan — winning 15% off their bill or a free dessert before they've even ordered. That reward guarantees they stay, eat, and enjoy.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">The Negative Review Floor Shield</h3>
                    <p className="text-xs text-slate-300 mt-0.5">1-3 star ratings NEVER reach Google Maps. A silent alert sends your manager to Table 4 to resolve it before the guest leaves.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(4)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>See Anti-Fraud Security & 0% Pricing</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual: Dual Review Gate Simulator */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Test The Reputation Gate</span>
                  </div>
                  <span className="text-[10px] font-bold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">⚡ Fires on QR Scan</span>
                </div>

                {/* Star Selector Buttons */}
                <div className="flex items-center justify-center space-x-2 py-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedStars(st);
                        if (st < 4) {
                          playTone(220, 'sawtooth', 0.25);
                        } else {
                          playTone(523.25, 'sine', 0.2);
                        }
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                        selectedStars >= st
                          ? st < 4
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500 text-slate-950 shadow-md scale-105'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Branch 1: 4 or 5 Stars -> Google Review & Wheel Spin */}
                {selectedStars >= 4 ? (
                  <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Eligible for Google Review & Wheel</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                        Goes to Google Maps
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        AI-Generated Review Preview:
                      </span>
                      <p className="text-slate-200 italic text-[11px]">
                        "Had an unforgettable dinner at Saffron House! The Old Delhi Butter Chicken was rich and tender, and the crispy garlic naan was perfection. 5 stars all the way!"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSpinWheel}
                      disabled={isSpinning}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                      <span>{isSpinning ? 'Spinning Lucky Wheel...' : 'Spin Lucky Wheel for Table Discount'}</span>
                    </button>

                    {wonPrize && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center text-xs font-bold text-amber-400">
                        🎉 Prize Unlocked: {wonPrize}!
                      </div>
                    )}
                  </div>
                ) : (
                  /* Branch 2: 1 to 3 Stars -> Silent Floor Manager Shield */
                  <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-red-400" />
                        <span>Blocked from Google Maps</span>
                      </span>
                      <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded">
                        Manager Intercept
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-red-500/20 space-y-1.5">
                      <span className="text-xs font-extrabold text-red-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>🚨 URGENT FLOOR ALERT (TABLE 4)</span>
                      </span>
                      <p className="text-[11px] text-slate-300">
                        "Guest reported slow bread service & lukewarm curry. Floor manager alerted via SOS buzzer to resolve at table."
                      </p>
                    </div>

                    <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 text-center font-semibold">
                      ✓ Saved: Customer leaves satisfied after table visit; 0 bad reviews posted online!
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 text-center">
                  Filters out public negativity while funneling happy diners straight to your Google Maps listing.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 05: ANTI-CHEAT SECURITY & ZERO COMMISSION                */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[4]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 05</span>
                <span>•</span>
                <span>FRAUD PROTECTION & ROI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Anti-Cheat Security. <span className="text-amber-400">0% Commission.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Never worry about diners using screenshot coupons or fake claims. Menuz enforces a live 15-minute countdown clock and a Waiter PIN to permanently void vouchers at billing. Plus, you own 100% of guest phone numbers.
              </p>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live 15-Min Timer & Waiter PIN</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Dynamic countdown clock with live seconds prevents reused screenshots. Server enters PIN 1234 on diner's screen to redeem.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">100% Customer Data Ownership</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Unlike third-party aggregators who hide diner data, Menuz builds your own verified WhatsApp guest list for festival remarketing.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Flat ₹1,999/Month. 0% Food Cut.</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Keep 100% of your bill values. Free 14-day trial with printed high-durability acrylic table stands included.</p>
                  </div>
                </div>
              </div>

              {/* Final Call to Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/admin"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Launch 14-Day Free Pilot</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors border border-slate-700"
                >
                  Test Diner Menu Live
                </Link>
              </div>
            </div>

            {/* Right Interactive Visual: Live Anti-Cheat Voucher Simulator */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Voucher Security Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ANTI-CHEAT ACTIVE
                  </span>
                </div>

                {/* Live Voucher Card with Ticking Clock */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        Table 4 Reward Claim
                      </span>
                      <h3 className="text-lg font-black text-white">15% Off Total Food Bill</h3>
                    </div>
                    {/* Live Ticking Seconds Pill */}
                    <div className="bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-xl text-center">
                      <span className="text-[9px] text-amber-300 font-bold block uppercase">Expires in</span>
                      <span className="text-base font-extrabold text-amber-400 font-mono">
                        {formatTimer(voucherSeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300">
                    Valid for Table 4 dine-in only. Must be redeemed before leaving table.
                  </div>

                  {/* Anti-cheat protection note */}
                  <div className="pt-2 border-t border-slate-800">
                    <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Countdown is dynamically generated server-side — no static code or screenshot can ever replicate it. Voucher auto-expires and cannot be reused across tables or sessions.</span>
                    </div>
                  </div>
                </div>

                {/* Transparent Pricing Callout */}
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Transparent Pricing
                    </span>
                    <span className="text-xs font-bold text-white">Flat ₹1,999 / Month • Zero Commission</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    14-Day Free Pilot
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. PRESENTATION FOOTER CONTROLS                                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0b0e16] border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-white">MENU<span className="text-amber-500">Z</span></span>
          <span>•</span>
          <span>Dine-In Operating System & Reputation Engine</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => scrollToSection(0)}
            className="hover:text-amber-400 transition-colors"
          >
            Back to Top
          </button>
          <span>•</span>
          <Link to="/admin" className="hover:text-white transition-colors">
            Master Admin
          </Link>
          <span>•</span>
          <Link to="/" className="hover:text-white transition-colors">
            Customer Directory
          </Link>
        </div>
      </footer>

      {/* 2-Minute Self-Service KOT Setup Wizard Modal */}
      {isWizardOpen && (
        <SelfServeKotSetupWizard
          restaurant={restaurant}
          onComplete={(_updates) => {
            setIsWizardOpen(false);
          }}
          onCancel={() => setIsWizardOpen(false)}
        />
      )}
    </div>
  );
};
