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
  Download,
  Globe,
  Share2,
  Sliders
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

const DEMO_DISH_DATA = {
  en: {
    title: 'Awadhi Murgh Dum Biryani',
    desc: 'Slow-simmered fragrant basmati rice layered with marinated chicken, saffron & whole Awadhi spices.',
    price: '₹480',
    addBtn: 'Add to Table Cart',
    addedBtn: 'In Table Cart',
    guest: '👤 Guest 1 (Host)',
    category: 'Biryanis & Rice'
  },
  hi: {
    title: 'अवधी मुर्ग दम बिरयानी',
    desc: 'धीमी आंच पर पका सुगंधित बासमती चावल, केसर और साबुत अवधी मसालों से लबरेज रसीला चिकन।',
    price: '₹480',
    addBtn: 'टेबल कार्ट में जोड़ें',
    addedBtn: 'कार्ट में शामिल',
    guest: '👤 अतिथि 1 (मेज़बान)',
    category: 'बिरयानी और चावल'
  },
  mr: {
    title: 'अवधी मुर्ग दम बिर्याणी',
    desc: 'मंद आचेवर शिजवलेला सुगंधी बासमती तांदूळ, केसर आणि अस्सल खडे मसाल्यांचा शाही स्वाद.',
    price: '₹480',
    addBtn: 'टेबल कार्टमध्ये जोडा',
    addedBtn: 'कार्टमध्ये जोडले',
    guest: '👤 पाहुणे 1 (यजमान)',
    category: 'बिर्याणी आणि भात'
  }
};

const DEMO_STORIES = {
  biryani: {
    title: 'Awadhi Murgh Dum Biryani',
    tag: 'Signature Charcoal Dum',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    quote: '"Unmatched aroma and royal flavors. A must-try in Pune!"'
  },
  curry: {
    title: 'Old Delhi Butter Chicken',
    tag: '36-Hour Simmered Makkhan',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    quote: '"Velvety rich gravy with tandoor charcoal smoky chicken."'
  },
  cocktail: {
    title: 'Royal Saffron Smoked Cooler',
    tag: 'Artisan Beverage Pairing',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
    quote: '"The perfect balance to elevate authentic North Indian spices."'
  }
};

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);

  // Active section (0 to 5)
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSections = 6;

  // Simulator states for Chapter 1: The Google Rating Dilemma
  const [demoRating, setDemoRating] = useState<'average' | 'stellar'>('stellar');

  // Simulator states for Chapter 2: Multiplayer Table Sync & Multilingual Engine
  const [demoLang, setDemoLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [demoGuestAdded, setDemoGuestAdded] = useState<boolean>(false);

  // Simulator states for Chapter 3: Chef & Owner AI Chatbot & Pairings
  const [selectedAiQuery, setSelectedAiQuery] = useState<'chef' | 'spice' | 'allergen' | 'pairing'>('chef');
  const [aiItemAdded, setAiItemAdded] = useState(false);
  const [pairingAdded, setPairingAdded] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Simulator states for Chapter 4: Universal Kitchen KOT & Direct Line Mode
  const [activeKotMode, setActiveKotMode] = useState<'direct' | 'captain'>('direct');
  const [selectedDeckPos, setSelectedDeckPos] = useState<'Petpooja' | 'RoyalPOS' | 'Recaho' | 'RanceLab' | 'Direct ESC/POS'>('Petpooja');
  const [kotPrinting, setKotPrinting] = useState(false);
  const [kotPrinted, setKotPrinted] = useState(true);

  // Simulator states for Chapter 5: Viral Growth Gateway (Instagram vs Google) & Platform Architecture
  const [rewardGatewayChoice, setRewardGatewayChoice] = useState<'google' | 'instagram' | 'both'>('both');
  const [selectedStoryDish, setSelectedStoryDish] = useState<'biryani' | 'curry' | 'cocktail'>('biryani');
  const [storyGenerated, setStoryGenerated] = useState(false);

  // Simulator states for Chapter 6: AI Review Booster & Floor Shield & Direct Access
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>('15% Off Food Bill');
  const [voucherSeconds, setVoucherSeconds] = useState(882); // 14m 42s
  const [enteredPin, setEnteredPin] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Dedicated 18-Slide Deck Presentation State
  const [activeViewMode, setActiveViewMode] = useState<'slides' | 'interactive'>('slides');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const SLIDE_DATA = [
    { num: 1, title: 'MENUZ Executive Master Pitch Deck', tag: 'Brand Identity', file: './pitch_slides/slide_01.png' },
    { num: 2, title: 'The Multi-Crore Dining Reality & 3 Severe Fractures', tag: 'Market Crisis', file: './pitch_slides/slide_02.png' },
    { num: 3, title: 'The 3 Reputation Channels Decoupled (Google vs IG vs Shield)', tag: 'Reputation Architecture', file: './pitch_slides/slide_03.png' },
    { num: 4, title: 'Channel 1: Public Google Reviews (SEO Ranking Engine)', tag: 'Google SEO Engine', file: './pitch_slides/slide_04.png' },
    { num: 5, title: 'Channel 2: Instagram UGC Virality (Word-of-Mouth Engine)', tag: 'Instagram Virality', file: './pitch_slides/slide_05.png' },
    { num: 6, title: 'Channel 3: Private Floor Shield & Table Escalation', tag: 'Floor Grievance Shield', file: './pitch_slides/slide_06.png' },
    { num: 7, title: 'Hardware-Free Smart KOT Engine (Zero-CapEx WhatsApp & Web)', tag: 'Kitchen Automation', file: './pitch_slides/slide_07.png' },
    { num: 8, title: 'Real-Time Collaborative Table Sync (Multi-Diner Cart)', tag: 'Table Sync Protocol', file: './pitch_slides/slide_08.png' },
    { num: 9, title: 'High-Converting Visual Menu & Multi-Language AI Storytelling', tag: 'Menu Engineering', file: './pitch_slides/slide_09.png' },
    { num: 10, title: 'Frictionless Dining Protocol (Zero App Download, Zero Login)', tag: 'Diner Experience', file: './pitch_slides/slide_10.png' },
    { num: 11, title: 'Enterprise Multi-Outlet Architecture & Real-Time Sync', tag: 'Enterprise Cloud', file: './pitch_slides/slide_11.png' },
    { num: 12, title: 'Boardroom Pitch: 15 Diverse Restaurant Formats (100% Approval)', tag: 'Boardroom Validation', file: './pitch_slides/slide_12.png' },
    { num: 13, title: 'Unit Economics & Verified ROI Model (+₹3.8L Net Margin)', tag: 'Financial Model', file: './pitch_slides/slide_13.png' },
    { num: 14, title: 'Rapid 30-Minute Zero-Downtime Deployment Roadmap', tag: 'Deployment Speed', file: './pitch_slides/slide_14.png' },
    { num: 15, title: 'Competitive Hegemony Matrix (Menuz vs POS vs Aggregators)', tag: 'Competitive Edge', file: './pitch_slides/slide_15.png' },
    { num: 16, title: 'Customer Retention & Repeat Diner Engine (Gamified Rewards)', tag: 'Retention & Loyalty', file: './pitch_slides/slide_16.png' },
    { num: 17, title: 'Transparent Enterprise Subscription & Revenue Model', tag: 'Commercial Terms', file: './pitch_slides/slide_17.png' },
    { num: 18, title: 'Conclusion & Boardroom Onboarding Partnership', tag: 'Onboarding Call to Action', file: './pitch_slides/slide_18.png' },
  ];

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
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    sectionRefs[index]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chapters = [
    { num: '01', short: 'The Dilemma', title: 'The Silent Diner Dilemma' },
    { num: '02', short: 'Table Sync & Service', title: 'Real-Time Table Sync & Joint Ordering' },
    { num: '03', short: "Chef's AI & Pairings", title: 'Chef AI Sommelier & Smart Pairings' },
    { num: '04', short: 'Direct Kitchen KOT', title: 'Direct Kitchen KOT & Universal POS Bridge' },
    { num: '05', short: 'Instagram vs. Google', title: "Owner's Growth Gateway: Instagram Story vs. Google Review" },
    { num: '06', short: 'Shield & Multilingual', title: 'Reputation Shield, Direct Access & Multilingual' }
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
              href="./menuz_executive_pitch_deck.pptx"
              download="Menuz_Executive_Pitch_Deck.pptx"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Download 16:9 Widescreen PowerPoint Presentation (PPTX)"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Download PPTX</span>
              <span className="sm:hidden">PPTX</span>
            </a>
            <a
              href="./menuz_executive_pitch_deck.pdf"
              download="Menuz_Executive_Pitch_Deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-amber-500/30 shadow-xs"
              title="Download Executive Pitch Deck PDF"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Download PDF</span>
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
      {/* 2. EXECUTIVE 18-SLIDE VISUAL PRESENTATION VIEWER (TOP HERO STAGE)  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#05070d] border-b border-slate-800/80 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Presentation Deck • 18 Widescreen Slides</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {SLIDE_DATA[currentSlideIndex].title}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
              <a
                href="./presentation.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Fullscreen Player</span>
              </a>
              <a
                href="./menuz_executive_pitch_deck.pptx"
                download="Menuz_Executive_Pitch_Deck.pptx"
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .PPTX</span>
              </a>
            </div>
          </div>

          {/* Slide Stage Container */}
          <div className="relative w-full aspect-[16/9] bg-black rounded-2xl border border-slate-800 overflow-hidden shadow-2xl group flex items-center justify-center">
            <img
              src={SLIDE_DATA[currentSlideIndex].file}
              alt={`Slide ${currentSlideIndex + 1}`}
              className="w-full h-full object-contain select-none"
            />

            {/* Left Prev Arrow */}
            <button
              type="button"
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700/80 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md z-10 shadow-lg"
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow */}
            <button
              type="button"
              onClick={() => setCurrentSlideIndex(prev => Math.min(SLIDE_DATA.length - 1, prev + 1))}
              disabled={currentSlideIndex === SLIDE_DATA.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700/80 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md z-10 shadow-lg"
              title="Next Slide (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Index Badge */}
            <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-slate-300">
              Slide <span className="text-amber-400 font-black">{currentSlideIndex + 1}</span> / {SLIDE_DATA.length}
            </div>
          </div>

          {/* Thumbnails Scroller */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {SLIDE_DATA.map((s, idx) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`relative shrink-0 w-28 sm:w-36 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all bg-black ${
                  currentSlideIndex === idx
                    ? 'border-amber-500 shadow-md shadow-amber-500/20 scale-105 opacity-100'
                    : 'border-slate-800 opacity-60 hover:opacity-90'
                }`}
              >
                <img src={s.file} alt={`Thumb ${s.num}`} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-black/80 text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                  {s.num}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. MAIN SCROLLYTELLING CONTAINER                                   */}
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
        {/* CHAPTER 02: REAL-TIME TABLE SYNC & MULTILINGUAL ENGINE            */}
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
                <span>MULTIPLAYER TABLE CART SYNC</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Real-Time Table Sync. <span className="text-amber-400">Multiplayer Co-Ordering.</span>
                <span className="block text-xl sm:text-2xl font-bold text-slate-300 mt-1">
                  1-Tap Waiter Calls &amp; Unified Joint Table Ordering.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                When a family or group sits at Table 4, multiple phones can scan the QR code and co-order simultaneously. Items appear instantly across all diners' screens with guest tags. Diners can also summon waitstaff with 1-tap quick actions ("Call Waiter", "Request Water", "Clean Table", "Request Bill") with zero hand-waving friction.
              </p>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Multiplayer Table Cart Synchronization</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Live cart tray sync across all diners at Table 4. Guest 1 and Guest 2 add dishes seamlessly with zero duplicate orders and unified table billing.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">1-Tap Service Calls &amp; Floor SOS</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Diners summon floor staff with 1 tap: 'Call Waiter', 'Water Needed', or 'Bill Requested' — buzzing the captain's tablet in real time.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Seamless Guest Attribution &amp; Joint Dispatch</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Each dish is labeled with its respective guest ("👤 Host", "👤 Guest 2 - Rohan"), giving waitstaff and kitchen perfect order clarity.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(2)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Explore Chef AI &amp; Upsell Pairings</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual: Live Table Sync & Language Simulator */}
            <div className="lg:col-span-6">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs text-emerald-400 font-bold">
                      T4
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Table 4 • Live Shared Session</span>
                      <span className="text-[10px] text-emerald-400 font-mono">● 2 Diners Connected (Host + Guest)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Live Table Cart Sync
                  </span>
                </div>

                {/* Language Switcher Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                    <span>Select Language (English Default):</span>
                    <span className="text-amber-400 font-mono">{demoLang.toUpperCase()} Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDemoLang('en');
                        playTone(523.25, 'sine', 0.15);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        demoLang === 'en'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🇬🇧 English (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDemoLang('hi');
                        playTone(587.33, 'sine', 0.15);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        demoLang === 'hi'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🇮🇳 हिन्दी (Hindi)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDemoLang('mr');
                        playTone(659.25, 'sine', 0.15);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        demoLang === 'mr'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      🚩 मराठी (Marathi)
                    </button>
                  </div>
                </div>

                {/* Localized Dish Card Demo */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        {DEMO_DISH_DATA[demoLang].category}
                      </span>
                      <h4 className="text-sm font-extrabold text-white">
                        {DEMO_DISH_DATA[demoLang].title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {DEMO_DISH_DATA[demoLang].desc}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {DEMO_DISH_DATA[demoLang].price}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <span className="text-[10px] font-medium text-slate-400">
                      Ordered by: <strong className="text-amber-300">{DEMO_DISH_DATA[demoLang].guest}</strong>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ✓ In Table Cart
                    </span>
                  </div>
                </div>

                {/* Multiplayer Co-Ordering Simulation Tray */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Table 4 Unified Cart (2 Diners)</span>
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      ₹{demoGuestAdded ? '960' : '480'}
                    </span>
                  </div>

                  {/* Guest 1 Item */}
                  <div className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded">Host</span>
                      <span className="text-white font-medium text-[11px]">{DEMO_DISH_DATA[demoLang].title}</span>
                    </div>
                    <span className="text-slate-300 font-mono text-[11px]">₹480</span>
                  </div>

                  {/* Guest 2 Simulated Item */}
                  {demoGuestAdded ? (
                    <div className="flex items-center justify-between text-xs bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30 animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">Guest 2 (Rohan)</span>
                        <span className="text-emerald-200 font-medium text-[11px]">Kashmiri Mutton Rogan Josh</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">₹480</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 italic p-1.5 text-center">
                      Guest 2 is currently browsing appetizers on their phone...
                    </div>
                  )}

                  {/* Action to simulate Guest 2 co-ordering */}
                  <button
                    type="button"
                    onClick={() => {
                      setDemoGuestAdded(!demoGuestAdded);
                      playTone(demoGuestAdded ? 330 : 660, 'triangle', 0.2);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-lg border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{demoGuestAdded ? '✕ Remove Guest 2 Dish' : '⚡ Simulate Guest 2 Adding Item to Cart'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 text-center italic">
                  💡 Zero app downloads required. Table cart syncs in &lt;100ms via WebSocket state channels.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 03: CHEF AI SOMMELIER & SMART PAIRING ENGINE             */}
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
                <span>CHEF AI &amp; UPSELL SOMMELIER</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Trained by Your Chef. <span className="text-amber-400">Upsells Like an Owner.</span>
                <span className="block text-xl sm:text-2xl font-bold text-slate-300 mt-1">
                  Auto-Scroll Conversational UX &amp; Intelligent Dish Pairings.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Generic AI chatbots hallucinate ingredients. Menuz elevates the table experience: <strong>a personalized concierge trained directly by your Head Chef and Restaurant Owner</strong>. It knows your kitchen's secret recipe notes, calibrated spice levels (1-5), allergen cautions, and your owner's high-margin pairing rules.
              </p>

              {/* 3 Core Points */}
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
                    <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Smart Beverage &amp; Side Pairings (+22% Order Value)</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Suggests signature coolers, artisan mocktails, and tandoor breads paired with the guest's selection, unlocking bundle savings.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Frictionless Auto-Scroll UX</h3>
                    <p className="text-xs text-slate-300 mt-0.5">When diners tap quick suggestions, the chat window smoothly auto-follows to reveal the newest reply without awkward manual scrolling.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(3)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>See Direct Kitchen KOT Architecture</span>
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

            {/* Right Interactive Visual: Live AI Sommelier & Pairings Simulator */}
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
                          : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
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
                          : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
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
                          : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
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
                          : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
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
                        {selectedAiQuery === 'chef' && "Chef Sanjeev highlights our Awadhi Murgh Dum Biryani and Slow-Cooked Dal Makhani. Both are slow-cooked in sealed handis with authentic Awadhi spices."}
                        {selectedAiQuery === 'spice' && "Old Delhi Butter Chicken is calibrated at Spice 1/5 (very mild). The gravy is tomato, cream, and cashew based with zero harsh green chilies. It's 100% kid and senior-friendly."}
                        {selectedAiQuery === 'pairing' && "Owner Rohit recommends pairing rich curries with our clay-oven Garlic Butter Naan and chilled Royal Kokum Cooler to refresh your palate between bites."}
                        {selectedAiQuery === 'allergen' && "Our Slow-Cooked Dal Makhani and Tandoori Murgh are 100% gluten-free. For nut allergies, our kitchen uses dedicated allergen-safe pans and separate ladles."}
                      </p>

                      {/* Chef / Owner Note Box */}
                      <div className="bg-amber-500/10 border-l-2 border-amber-500 px-2.5 py-1.5 rounded-r-md text-[11px] text-amber-300">
                        {selectedAiQuery === 'chef' && "🧑‍🍳 Chef's Secret: Hand-smoked charcoal tandoori finish gives it the iconic Old Delhi flavor."}
                        {selectedAiQuery === 'spice' && "🧑‍🍳 Chef's Note: Spice can be customized to zero heat upon your request."}
                        {selectedAiQuery === 'pairing' && "💼 Owner's Tip: Pairing cooler + naan completes the meal and unlocks a bundle discount!"}
                        {selectedAiQuery === 'allergen' && "🧑‍🍳 Chef's Safety Guarantee: All cross-contamination protocols verified in our kitchen."}
                      </div>

                      {/* 1-Tap Add to Tray */}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                        <span className="text-[11px] font-bold text-white">
                          {selectedAiQuery === 'chef' && "Awadhi Murgh Biryani • ₹480"}
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

                {/* Chef Recommended Pairing Upsell Card */}
                <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs">🍷</span>
                      <span className="text-xs font-bold text-white">Chef's Recommended Pairing</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        Save 15%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Garlic Butter Naan + Royal Kokum Cooler bundle with Biryani (₹240 bundle price).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPairingAdded(!pairingAdded);
                      playTone(pairingAdded ? 330 : 660, 'sine', 0.2);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      pairingAdded
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {pairingAdded ? 'Pairing Added ✓' : '+ Add Pairing Deal'}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 text-center italic">
                  💡 Zero hallucinations: The AI answers only using your exact menu recipes, spice data, and owner upsell rules.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 04: DIRECT KITCHEN KOT & UNIVERSAL POS BRIDGE            */}
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
                <span>DIRECT KITCHEN KOT &amp; POS BRIDGE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Direct Line to Kitchen. <span className="text-amber-400">Owner Decides Workflow.</span>
                <span className="block text-xl sm:text-2xl font-bold text-slate-300 mt-1">
                  Mode A Instant Auto-KOT or Mode B Captain Review First.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Every restaurant runs differently. Menuz leaves the choice 100% in the owner's hands: <strong>Send orders directly to the kitchen thermal printer in 1 second (Mode A)</strong>, or <strong>route them to the floor captain for quick verification first (Mode B)</strong>. Coupled with triple-redundant POS integration (Petpooja, RoyalPOS, Recaho, RanceLab, and direct ESC/POS network hardware).
              </p>

              {/* Owner Options Comparison Cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div
                  onClick={() => setActiveKotMode('direct')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeKotMode === 'direct'
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">⚡</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mode A: Direct Auto-KOT</h3>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Order prints directly in kitchen in 1 second. Zero staff delay. Perfect for high-speed QSRs and casual dining.
                  </p>
                </div>

                <div
                  onClick={() => setActiveKotMode('captain')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeKotMode === 'captain'
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">👨‍✈️</span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mode B: Captain Review</h3>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Captain reviews and approves on floor tablet before KOT prints. Ideal for fine dining and course coordination.
                  </p>
                </div>
              </div>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Printer className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant 80mm ESC/POS Thermal Printing</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Kitchen printer beeps and prints immediately with table number, items, guest tags, and spice notes.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Triple-Redundancy Zero Downtime</h3>
                    <p className="text-xs text-slate-300 mt-0.5">If cloud internet drops, orders fail over seamlessly to Local Wi-Fi LAN bridge and Port 9100 direct printing.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(4)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Explore Viral Instagram Stories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>2-Min KOT Wizard</span>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      {activeKotMode === 'direct' ? 'MODE A: AUTO-KOT' : 'MODE B: CAPTAIN APPROVED'}
                    </span>
                    <button
                      type="button"
                      onClick={handlePrintKot}
                      disabled={kotPrinting}
                      className="text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCw className={`w-3 h-3 ${kotPrinting ? 'animate-spin' : ''}`} />
                      <span>{kotPrinting ? 'Printing...' : 'Re-Print KOT'}</span>
                    </button>
                  </div>
                </div>

                {/* POS Selector Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-center">
                  {(['Petpooja', 'RoyalPOS', 'Recaho', 'RanceLab', 'Direct ESC/POS'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setSelectedDeckPos(pos)}
                      className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all truncate cursor-pointer ${
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
                      <span>1x AWADHI MURGH BIRYANI [GUEST 1]</span>
                      <span>₹480</span>
                    </div>
                    <div className="text-[10px] text-slate-600 pl-2">
                      Notes: Medium spice, layered dum, salan on side
                    </div>

                    <div className="flex justify-between font-bold">
                      <span>1x GARLIC NAAN &amp; KOKUM COOLER [PAIRING]</span>
                      <span>₹240</span>
                    </div>
                    <div className="text-[10px] text-emerald-800 pl-2">
                      Bundle Discount Applied (15% Off)
                    </div>

                    <div className="flex justify-between font-bold">
                      <span>1x MUTTON ROGAN JOSH [GUEST 2]</span>
                      <span>₹480</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-slate-400 text-[10px] text-slate-600 space-y-0.5">
                    <div className="flex justify-between">
                      <span>DISPATCH: {activeKotMode === 'direct' ? 'DIRECT TO KITCHEN' : 'CAPTAIN VERIFIED'}</span>
                      <span className="text-emerald-700 font-bold">
                        {selectedDeckPos === 'Direct ESC/POS'
                          ? 'ESC/POS: OK (RAW PRINT)'
                          : `${selectedDeckPos.toUpperCase()} STATUS: OK (200)`}
                      </span>
                    </div>
                    <div className="text-center text-slate-500 pt-1">
                      *** KITCHEN THERMAL COPY • ZERO RE-TYPING ***
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Order Routing Mode:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {activeKotMode === 'direct' ? 'Mode A: Instant Direct (0 min lag)' : 'Mode B: Captain Approved First'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 05: OWNER'S REWARD GATEWAY (INSTAGRAM VS GOOGLE REVIEW)   */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[4]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12 border-b border-slate-800/60"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full text-pink-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 05</span>
                <span>•</span>
                <span>OWNER REWARD GATEWAY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Instagram Story vs. Google Review. <span className="text-amber-400">Owner Decides.</span>
                <span className="block text-xl sm:text-2xl font-bold text-slate-300 mt-1">
                  Choose How Diners Unlock Free Dishes, Drinks &amp; Table Discounts.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Every restaurant brand has different marketing priorities. Menuz empowers the owner to configure which social channel unlocks the table reward (e.g. 15% discount or free signature dessert): <strong>5-Star Google Reviews</strong> to dominate Google Maps rankings, <strong>9:16 Instagram Stories</strong> to reach diners' local followers, or <strong>Dual Mode</strong> where the guest chooses.
              </p>

              {/* Owner Gateway Configuration Selector */}
              <div className="space-y-2 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Owner Reward Gateway Setting:</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {rewardGatewayChoice === 'both' ? 'Dual Mode Active' : `${rewardGatewayChoice.toUpperCase()} ONLY`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRewardGatewayChoice('google');
                      playTone(523.25, 'sine', 0.15);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      rewardGatewayChoice === 'google'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    ⭐ Google Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRewardGatewayChoice('instagram');
                      playTone(587.33, 'sine', 0.15);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      rewardGatewayChoice === 'instagram'
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    📸 Instagram Story
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRewardGatewayChoice('both');
                      playTone(659.25, 'sine', 0.15);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      rewardGatewayChoice === 'both'
                        ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    ⚡ Diner's Choice
                  </button>
                </div>

                <div className="text-[11px] text-slate-300 pt-1">
                  {rewardGatewayChoice === 'google' && "Diners post an AI-crafted 5-star Google review to unlock their 15% discount. Best for fast Google Maps SEO growth."}
                  {rewardGatewayChoice === 'instagram' && "Diners share a branded 9:16 Instagram Story tagging @restaurant to unlock their free dessert. Best for weekend social buzz."}
                  {rewardGatewayChoice === 'both' && "Diners choose either Google Review or Instagram Story on their phone to unlock the reward. Maximum participation rate!"}
                </div>
              </div>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Share2 className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Branded 9:16 Vertical Story Asset</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Auto-generates high-aesthetic Instagram stories with high-res dish photography, verified 5★ stickers, and your Instagram tag (@saffronhouse.pune).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Multi-Restaurant Partitioned Image Library</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Each restaurant operates with a completely isolated cloud image repository. Dish photography and logos are saved in segregated namespaces permanently.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Next Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(5)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>See Review Shield &amp; Direct Access</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual: 9:16 Instagram Story Preview Simulator */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm bg-[#111622] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">📸</span>
                    <span className="text-xs font-bold text-white">Instagram Story Generator</span>
                  </div>
                  <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                    9:16 Format
                  </span>
                </div>

                {/* Dish Selector Pills */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoryDish('biryani');
                      playTone(523.25, 'sine', 0.15);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      selectedStoryDish === 'biryani'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Biryani
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoryDish('curry');
                      playTone(587.33, 'sine', 0.15);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      selectedStoryDish === 'curry'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Butter Chicken
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoryDish('cocktail');
                      playTone(659.25, 'sine', 0.15);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                      selectedStoryDish === 'cocktail'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cocktail
                  </button>
                </div>

                {/* Realistic 9:16 Vertical Story Mockup */}
                <div className="relative aspect-[9/14] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group">
                  {/* Background Image */}
                  <img
                    src={DEMO_STORIES[selectedStoryDish].image}
                    alt={DEMO_STORIES[selectedStoryDish].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />

                  {/* Top Instagram Story Bar */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500 p-0.5 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-950">M</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white drop-shadow">@saffronhouse.pune</span>
                        <span className="text-[9px] text-slate-300 block drop-shadow">Koregaon Park • 12m ago</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-slate-200">
                      ★ 5.0 Google Review
                    </span>
                  </div>

                  {/* Center Dish Tag & Quote */}
                  <div className="absolute bottom-16 left-3 right-3 space-y-2 z-10">
                    <div className="inline-block bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
                      {DEMO_STORIES[selectedStoryDish].tag}
                    </div>
                    <h4 className="text-base font-black text-white leading-tight drop-shadow-md">
                      {DEMO_STORIES[selectedStoryDish].title}
                    </h4>
                    <p className="text-xs text-slate-200 italic leading-snug drop-shadow">
                      {DEMO_STORIES[selectedStoryDish].quote}
                    </p>
                  </div>

                  {/* Bottom Share Trigger Button */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setStoryGenerated(true);
                        playTone(784, 'triangle', 0.25);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{storyGenerated ? 'Story Shared to @Instagram ✓' : 'Share to Instagram Story'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-center italic">
                  💡 Zero design effort for diner: Menuz auto-generates branded 9:16 stickers ready to post.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* CHAPTER 06: AI REVIEW SHIELD & DIRECT ACCESS ONBOARDING          */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section
          ref={sectionRefs[5]}
          className="min-h-[calc(100vh-60px)] scroll-mt-16 py-12 lg:py-16 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#0b0f18]"
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                <span>CHAPTER 06</span>
                <span>•</span>
                <span>REPUTATION SHIELD &amp; DIRECT ACCESS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Public 5★ Reviews. <span className="text-amber-400">Direct Access Onboarding.</span>
                <span className="block text-xl sm:text-2xl font-bold text-slate-300 mt-1">
                  Floor Shield, Anti-Cheat Voucher Timers &amp; 0% Commission.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Menuz turns happy diners into verified 5-star Google reviews using an AI-crafted review generator and Lucky Wheel hook on the way in. Unhappy ratings (1-3★) silently alert your floor manager to resolve issues at the table. Plus, we've <strong>removed arbitrary 7-day trials — the platform owner directly grants complete access</strong> with flat ₹1,999/month pricing and 0% food commission.
              </p>

              {/* 3 Core Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Dish-Specific Review Builder</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Mentions actual dishes ("Awadhi Murgh Dum Biryani", "crispy garlic naan") so Google Maps indexes your high-margin specialties.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Negative Review Floor Shield</h3>
                    <p className="text-xs text-slate-300 mt-0.5">1-3 star ratings NEVER reach Google Maps. A silent floor buzzer alerts your manager to Table 4 to resolve complaints before the guest walks out.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Direct Owner-Granted Access (0% Commission)</h3>
                    <p className="text-xs text-slate-300 mt-0.5">No arbitrary 7-day trials. Complete operational platform unlocked on demand. Flat ₹1,999/month subscription — zero commission on your food sales.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/admin"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Launch Operations Hub</span>
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

            {/* Right Interactive Visual: Dual Review Gate & Live Anti-Cheat Voucher */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Reputation Shield Simulator
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                    ⚡ Fires on QR Scan
                  </span>
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
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all cursor-pointer ${
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
                        <span>Eligible for Google Review &amp; Wheel</span>
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
                        "Had an unforgettable dinner at Saffron House! The Awadhi Murgh Dum Biryani was rich, aromatic, and tender, and the garlic butter naan was perfection. 5 stars all the way!"
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
                        "Guest reported slow bread service &amp; lukewarm curry. Floor manager alerted via SOS buzzer to resolve at table."
                      </p>
                    </div>

                    <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 text-center font-semibold">
                      ✓ Saved: Customer leaves satisfied after table visit; 0 bad reviews posted online!
                    </div>
                  </div>
                )}

                {/* Anti-Cheat Voucher Simulator Card */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-xl space-y-2.5 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        Table 4 Verified Reward
                      </span>
                      <h4 className="text-sm font-black text-white">15% Off Total Food Bill</h4>
                    </div>
                    {/* Live Ticking Seconds Pill */}
                    <div className="bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-lg text-center">
                      <span className="text-[8px] text-amber-300 font-bold block uppercase">Expires in</span>
                      <span className="text-xs font-extrabold text-amber-400 font-mono">
                        {formatTimer(voucherSeconds)}
                      </span>
                    </div>
                  </div>

                  {/* Waiter PIN verification box */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[10px] text-slate-400">Waiter PIN (Enter 1234):</span>
                    </div>
                    {pinVerified ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        ✓ Voided &amp; Redeemed
                      </span>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="password"
                          maxLength={4}
                          value={enteredPin}
                          onChange={(e) => setEnteredPin(e.target.value)}
                          placeholder="PIN"
                          className="w-14 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-center text-xs font-mono text-white tracking-widest focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPin}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded cursor-pointer"
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </div>
                  {pinError && (
                    <div className="text-[10px] text-red-400 text-right">Invalid PIN! Try 1234</div>
                  )}
                </div>

                {/* Transparent Direct Access Callout */}
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Direct Access Onboarding
                    </span>
                    <span className="font-bold text-white">Flat ₹1,999 / Month • 0% Commission</span>
                  </div>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 text-[11px]">
                    Direct Owner Access
                  </span>
                </div>

                {/* Regional Inclusivity (English Primary, Hindi & Marathi) */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-bold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Regional Languages (English Default Primary):</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">{demoLang.toUpperCase()} Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDemoLang('en');
                        playTone(523.25, 'sine', 0.15);
                      }}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                        demoLang === 'en'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      🇬🇧 English (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDemoLang('hi');
                        playTone(587.33, 'sine', 0.15);
                      }}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                        demoLang === 'hi'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      🇮🇳 हिन्दी
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDemoLang('mr');
                        playTone(659.25, 'sine', 0.15);
                      }}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                        demoLang === 'mr'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      🚩 मराठी
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Always opens in English by default. Guests can toggle physically to Hindi or Marathi without losing their cart state.
                  </p>
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
