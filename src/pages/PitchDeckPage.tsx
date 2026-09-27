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
  ChevronDown
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

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

  // Simulator states for Chapter 2: Smart Table Menu
  const [waiterCalled, setWaiterCalled] = useState(false);

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

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    playTone(523.25, 'sine', 0.15);
    setTimeout(() => playTone(659.25, 'sine', 0.25), 150);
    setTimeout(() => setWaiterCalled(false), 4000);
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
    { num: '02', short: 'QR Menu', title: 'Smart Contactless Table Menu' },
    { num: '03', short: 'All KOT & POS', title: 'Universal POS & Kitchen KOT Integration' },
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

          {/* Live System Demo Links */}
          <div className="flex items-center space-x-2">
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
        {/* CHAPTER 02: SMART CONTACTLESS TABLE MENU                         */}
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
                <span>THE TABLE EXPERIENCE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Scan & Browse <span className="text-amber-400">in 0.3 Seconds.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                No app download. Diners point any phone camera at the custom acrylic stand on Table 4. High-definition photos, spice meters, and dietary tags make decision-making effortless.
              </p>

              {/* 3 Standout Features */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Zero App Download</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Opens instantly in Safari or Chrome without asking guests to install any application.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Visual Dishes with Chef Notes</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Clear Veg/Non-Veg badges, 1–3 chili spice indicators, and beverage pairings drive 18% higher dessert and drink sales.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Dining Concierge — Trained by Your Chef</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Every dish question answered instantly: allergens, spice levels, alternatives, pairings. The AI is trained on your restaurant owner's actual menu data and your head chef's personal notes — not generic knowledge.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(2)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>See How It Connects to POS</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual: Table 4 Live Phone Menu Simulation */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Saffron House • Table 4</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Live Mobile Menu
                  </span>
                </div>

                {/* Saffron House Live Dish Card 1 */}
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=150&q=80"
                    alt="Old Delhi Butter Chicken"
                    className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-red-600 shrink-0" title="Non-Veg" />
                      <span className="text-xs font-bold text-white truncate">Old Delhi Butter Chicken</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Charcoal tandoor chicken, velvet makhani sauce</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-amber-400 font-mono">₹480</span>
                      <span className="text-[10px] text-amber-500/80">🌶️ Mild Spice</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-1 rounded-md shrink-0">
                    In Tray ✓
                  </span>
                </div>

                {/* Saffron House Live Dish Card 2 */}
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80"
                    alt="Slow Cooked Dal Makhani"
                    className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 shrink-0" title="Veg" />
                      <span className="text-xs font-bold text-white truncate">Slow-Cooked Dal Makhani</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Simmered 16 hours with cream & white butter</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-amber-400 font-mono">₹360</span>
                      <span className="text-[10px] text-emerald-400">Chef Special</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-1 rounded-md shrink-0">
                    In Tray ✓
                  </span>
                </div>

                {/* AI Dining Concierge Chat Preview */}
                <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-300">AI Dining Concierge</span>
                    <span className="text-[9px] text-slate-500 ml-auto">Trained on Saffron House kitchen data</span>
                  </div>
                  {/* Guest question */}
                  <div className="flex justify-end">
                    <div className="bg-amber-500/20 border border-amber-500/20 px-2.5 py-1.5 rounded-xl rounded-tr-sm text-[11px] text-amber-200 max-w-[75%]">
                      Is the Butter Chicken very spicy? I'm sensitive.
                    </div>
                  </div>
                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-xl rounded-tl-sm text-[11px] text-slate-200 max-w-[85%] space-y-1">
                      <p>Old Delhi Butter Chicken is Spice 1/5 — very mild. The makhani sauce is rich and creamy with no chili heat.</p>
                      <p className="text-[10px] text-purple-300">🧑‍🍳 Chef's note: "Can be made extra mild on request."</p>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center">
                  Chef's personal notes & allergen data built in — no waiter needed for basic questions.
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
                <span>UNIVERSAL KITCHEN KOT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Direct to Any POS &amp; Kitchen Printer. <span className="text-amber-400">Zero Waiter Re-Typing.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Menuz doesn't replace your billing software — it seamlessly links with whatever you already run. Whether your restaurant uses <strong>Petpooja, RoyalPOS, Recaho, RanceLab FusionResto, or a standalone Wi-Fi thermal printer</strong>, orders placed on Menuz instantly fire physical 80mm KOT tickets in your kitchen in 1 second.
              </p>

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
    </div>
  );
};
