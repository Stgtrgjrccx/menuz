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
  Sliders,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  Building2,
  Shield,
  Eye,
  MessageSquare,
  RefreshCw,
  Play
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
    desc: 'Slow-simmered fragrant basmati rice layered with marinated tender chicken, saffron & whole Awadhi spices.',
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
    quote: '"Unmatched royal aroma and melt-in-mouth chicken! A must-visit dining experience in Pune."'
  },
  curry: {
    title: 'Old Delhi Butter Chicken',
    tag: '36-Hour Simmered Makkhan Gravy',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    quote: '"Silky smooth velvety gravy with deep tandoor charcoal smokiness."'
  },
  cocktail: {
    title: 'Royal Saffron Smoked Cooler',
    tag: 'Artisan Mixology Pairing',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
    quote: '"The crisp citrus notes balance authentic rich North Indian spices perfectly."'
  }
};

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);

  // View Mode: 'slides' (Interactive 18-Slide HTML Deck) or 'scroll' (Long-Form Executive Scrollytelling)
  const [viewMode, setViewMode] = useState<'slides' | 'scroll'>('slides');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Active section for scrollytelling
  const [activeSection, setActiveSection] = useState<number>(0);

  // Simulator states for Chapter 1 / Slide 4: The Google Rating Dilemma & Review Generator
  const [demoRating, setDemoRating] = useState<'average' | 'stellar'>('stellar');
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [generatedReviewText, setGeneratedReviewText] = useState(
    'Had an incredible dinner! The Awadhi Dum Biryani was exceptionally flavorful and the ambiance was top-notch. Fast service via QR!'
  );
  const [copiedReview, setCopiedReview] = useState(false);

  // Simulator states for Chapter 2 / Slide 8 & 9: Multiplayer Table Sync & Multilingual Engine
  const [demoLang, setDemoLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [demoGuestAdded, setDemoGuestAdded] = useState<boolean>(false);

  // Simulator states for Chapter 3 / Slide 7: Kitchen KOT & Direct Line Mode
  const [activeKotMode, setActiveKotMode] = useState<'direct' | 'captain'>('direct');
  const [selectedDeckPos, setSelectedDeckPos] = useState<'Petpooja' | 'RoyalPOS' | 'Recaho' | 'RanceLab' | 'Direct ESC/POS'>('Petpooja');
  const [kotPrinting, setKotPrinting] = useState(false);
  const [kotPrinted, setKotPrinted] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Simulator states for Chapter 4 / Slide 5: Social Sharing Virality
  const [selectedStoryDish, setSelectedStoryDish] = useState<'biryani' | 'curry' | 'cocktail'>('biryani');
  const [storyShared, setStoryShared] = useState(false);

  // Simulator states for Chapter 5 / Slide 6: Private Floor Shield & Escalation
  const [voucherSeconds, setVoucherSeconds] = useState(882); // 14m 42s
  const [enteredPin, setEnteredPin] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Simulator states for Chapter 6 / Slide 16: Gamified Spin Wheel (Owner Controlled)
  const [isSpinning, setIsSpinning] = useState(false);
  const [ownerAllowsDiscount, setOwnerAllowsDiscount] = useState(false);
  const [ownerDiscountPct, setOwnerDiscountPct] = useState(10);
  const [wonPrize, setWonPrize] = useState<string | null>("Complimentary Chef's Saffron Shahi Tukda (Zero Margin Loss)");

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
      if (ownerAllowsDiscount) {
        setWonPrize(`Owner-Configured ${ownerDiscountPct}% Off Next Visit`);
      } else {
        setWonPrize("Complimentary Chef's Saffron Shahi Tukda (Zero Margin Loss)");
      }
      playTone(659.25, 'triangle', 0.35);
    }, 1200);
  };

  // Keyboard navigation for slide deck mode
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (viewMode === 'slides') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          setCurrentSlide((prev) => Math.min(SLIDES_DATA.length - 1, prev + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          setCurrentSlide((prev) => Math.max(0, prev - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewMode]);

  const SLIDES_DATA = [
    { num: 1, tag: 'Brand Vision & Identity', short: 'Cover & Mission' },
    { num: 2, tag: 'Market Crisis', short: 'The Dining Crisis' },
    { num: 3, tag: 'Reputation Decoupled', short: '3 Growth Channels' },
    { num: 4, tag: 'Channel 1: Google SEO', short: 'Google Maps SEO' },
    { num: 5, tag: 'Channel 2: Social Sharing', short: 'Diner Virality' },
    { num: 6, tag: 'Channel 3: Floor Shield', short: 'Private Floor Shield' },
    { num: 7, tag: 'Kitchen Automation', short: 'Hardware-Free KOT' },
    { num: 8, tag: 'Table Sync Protocol', short: 'Multiplayer Cart' },
    { num: 9, tag: 'Menu Engineering', short: 'Multilingual Menu' },
    { num: 10, tag: 'Diner Experience', short: 'Zero-App Friction' },
    { num: 11, tag: 'Enterprise Scale', short: 'Multi-Outlet Cloud' },
    { num: 12, tag: 'Boardroom Validation', short: '15 Formats Analyzed' },
    { num: 13, tag: 'Financial Model', short: 'Unit Economics & ROI' },
    { num: 14, tag: 'Deployment Speed', short: '30-Min Onboarding' },
    { num: 15, tag: 'Competitive Edge', short: 'Competitive Matrix' },
    { num: 16, tag: 'Loyalty & Retention', short: 'Gamified Rewards' },
    { num: 17, tag: 'Commercial Terms', short: 'Subscription Plans' },
    { num: 18, tag: 'Detailed Breakdown', short: 'Plan Comparison Matrix' },
    { num: 19, tag: 'Executive CTA', short: 'Partner With Menuz' }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#F4511E] selection:text-white antialiased">
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. TOP STICKY EXECUTIVE NAVIGATION BAR                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#F5F1E8]/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F4511E] to-[#F4511E] flex items-center justify-center font-black text-[#FFFFFF] shadow-md text-base">
                M
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#141414] group-hover:text-[#2D4A3E] transition-colors">
                  MENU<span className="text-amber-500">Z</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#2D4A3E] font-bold -mt-1 hidden sm:block">
                  Executive Pitch Deck
                </span>
              </div>
            </Link>
          </div>

          {/* Presentation Master Deck Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F5F1E8] border border-[#E3E0DA]/80 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-[#4A4A4A]">Executive Master Presentation</span>
            <span className="text-[10px] text-[#2D4A3E] font-mono font-bold bg-[#F4511E]/10 px-2 py-0.5 rounded border border-[#F4511E]/20">
              19 Slides
            </span>
          </div>

          {/* Action Downloads & Links */}
          <div className="flex items-center space-x-2">
            <Link
              to="/manage"
              className="px-3.5 py-1.5 bg-[#F4511E]/10 hover:bg-[#F4511E]/25 text-[#2D4A3E] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 border border-[#F4511E]/40 shadow-sm"
              title="Open Restaurant Partner Hub"
            >
              <Building2 className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Partner Hub</span>
            </Link>
            <a
              href="./menuz_executive_pitch_deck.pptx"
              download="Menuz_Executive_Pitch_Deck.pptx"
              className="px-3.5 py-1.5 bg-[#F4511E] hover:bg-[#F4511E] text-[#FFFFFF] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              title="Download 16:9 Widescreen PowerPoint Presentation (PPTX)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download PPTX</span>
              <span className="md:hidden">PPTX</span>
            </a>
            <a
              href="./menuz_executive_pitch_deck.pdf"
              download="Menuz_Executive_Pitch_Deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#EFE9DD] hover:bg-[#E8DCC8] text-[#2D4A3E] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 border border-[#F4511E]/30"
              title="Download High-Resolution PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">PDF</span>
            </a>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-[#1F5F8B] border border-cyan-500/40 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 hidden sm:flex"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live Diner Menu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 19-SLIDE WIDESCREEN EXECUTIVE PRESENTATION VIEWER                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Slide Navigation Top Bar */}
        <div className="flex items-center justify-between mb-4 bg-[#F5F1E8]/80 border border-[#E3E0DA] p-3 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2D4A3E] bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
              Slide {currentSlide + 1} of {SLIDES_DATA.length} • {SLIDES_DATA[currentSlide]?.tag || ''}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#141414] hidden md:block">
              {SLIDES_DATA[currentSlide]?.short || ''}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 bg-[#EFE9DD] hover:bg-[#E8DCC8] text-[#141414] rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            <span className="text-xs font-bold text-[#6E6E6E] px-2 font-mono">
              {currentSlide + 1} / {SLIDES_DATA.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => Math.min(SLIDES_DATA.length - 1, prev + 1))}
              disabled={currentSlide === SLIDES_DATA.length - 1}
              className="px-3.5 py-1.5 bg-[#F4511E] hover:bg-[#F4511E] text-[#FFFFFF] rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SLIDE CANVAS (16:9 WIDESCREEN HIGH-CONTRAST HTML COMPONENT)      */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <div className="relative w-full bg-[#FFFFFF] border-2 border-[#E3E0DA]/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[640px]">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4511E]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* SLIDE 1: COVER & MISSION */}
            {currentSlide === 0 && (
              <div className="space-y-8 my-auto relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-10 bg-[#F4511E] rounded-full" />
                  <span className="text-[#2D4A3E] font-extrabold uppercase tracking-widest text-sm">
                    Executive Master Pitch Deck
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl font-black text-[#141414] tracking-tight leading-tight">
                    MENUZ
                  </h1>
                  <p className="text-xl sm:text-2xl font-bold text-[#2D4A3E]">
                    The Autonomous Dining & Reputation Operating System
                  </p>
                  <p className="text-base sm:text-lg text-[#4A4A4A] max-w-3xl leading-relaxed">
                    Zero-CapEx Table QR Ordering, Real-Time Multiplayer Cart, Decoupled 3-Channel Reputation Engine, and Hardware-Free Kitchen Automation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-5 rounded-2xl">
                    <div className="text-[#2D4A3E] font-black text-2xl mb-1">0% CapEx</div>
                    <div className="text-sm font-bold text-[#141414]">Zero Hardware Investment</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">Works on existing thermal printers & smartphones</div>
                  </div>
                  <div className="bg-[#F5F1E8] border border-cyan-500/30 p-5 rounded-2xl">
                    <div className="text-[#2D4A3E] font-black text-2xl mb-1">+₹3.8L / Mo</div>
                    <div className="text-sm font-bold text-[#141414]">Verified Net Margin Boost</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">Via upsells, faster table turns & direct orders</div>
                  </div>
                  <div className="bg-[#F5F1E8] border border-emerald-500/30 p-5 rounded-2xl">
                    <div className="text-[#2F7A4F] font-black text-2xl mb-1">100% Floor Shield</div>
                    <div className="text-sm font-bold text-[#141414]">Zero Negative Public Leak</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">15-Minute private manager grievance recovery</div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: THE MULTI-CRORE DINING CRISIS */}
            {currentSlide === 1 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#C23A1C] text-xs font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full w-fit">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Market Reality & Revenue Leakage</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  The ₹4,20,000 Monthly Revenue Drain
                </h2>
                <p className="text-base sm:text-lg text-[#4A4A4A] max-w-3xl">
                  Modern restaurants face 3 severe systemic fractures that destroy margins and public reputation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-red-500/30 p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-[#C23A1C] font-black flex items-center justify-center text-lg">
                      95%
                    </div>
                    <h3 className="text-lg font-bold text-[#141414]">The Silent Guest Exodus</h3>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed">
                      95% of satisfied guests pay their bill and leave silently without writing a Google review or recommending to others.
                    </p>
                  </div>

                  <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4511E]/20 text-[#2D4A3E] font-black flex items-center justify-center text-lg">
                      1★
                    </div>
                    <h3 className="text-lg font-bold text-[#141414]">Permanent 1-Star Damage</h3>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed">
                      A single minor table delay or cold soup gets vented on Google Maps permanently, costing an estimated 30+ future walk-ins.
                    </p>
                  </div>

                  <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4511E]/20 text-[#2D4A3E] font-black flex items-center justify-center text-lg">
                      30%
                    </div>
                    <h3 className="text-lg font-bold text-[#141414]">Aggregator Commission Trap</h3>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed">
                      Restaurants bleed 22% to 30% commissions to Zomato & Swiggy because they lack direct customer acquisition at the table.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 3: THE 3 REPUTATION CHANNELS DECOUPLED */}
            {currentSlide === 2 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Strategic Decoupling</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Public Reviews vs. Social Sharing vs. Floor Shield
                </h2>
                <p className="text-base sm:text-lg text-[#4A4A4A] max-w-3xl">
                  They are completely different channels with distinct objectives, algorithms, and conversion mechanics.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border-2 border-[#F4511E]/50 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-[#F4511E]/20 text-[#2D4A3E]">
                        Channel 1
                      </span>
                      <Star className="w-5 h-5 text-[#2D4A3E] fill-[#2D4A3E]" />
                    </div>
                    <h3 className="text-xl font-black text-[#141414]">Google Maps SEO</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      <strong>Goal:</strong> Boost local search ranking when users search "best dining near me". Permanent public 5-star validation.
                    </p>
                    <div className="text-xs text-[#2D4A3E] font-semibold bg-[#F4511E]/40 p-2.5 rounded-lg border border-[#F4511E]/20">
                      Action: AI Keyword Review Builder
                    </div>
                  </div>

                  <div className="bg-[#F5F1E8] border-2 border-rose-500/50 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-rose-500/20 text-[#C23A1C]">
                        Channel 2
                      </span>
                      <Share2 className="w-5 h-5 text-[#C23A1C]" />
                    </div>
                    <h3 className="text-xl font-black text-[#141414]">Social Word-of-Mouth</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      <strong>Goal:</strong> Peer recommendations & social proof. Diners share food cards directly with friends, creating viral footfall.
                    </p>
                    <div className="text-xs text-[#C23A1C] font-semibold bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/20">
                      Action: 1-Click Aesthetic Food Presentation Card
                    </div>
                  </div>

                  <div className="bg-[#F5F1E8] border-2 border-cyan-500/50 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-cyan-500/20 text-[#1F5F8B]">
                        Channel 3
                      </span>
                      <Shield className="w-5 h-5 text-[#2D4A3E]" />
                    </div>
                    <h3 className="text-xl font-black text-[#141414]">Private Floor Shield</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      <strong>Goal:</strong> Intercept grievances instantly (1-3 stars) while the diner is still seated. 100% confidential.
                    </p>
                    <div className="text-xs text-[#2D4A3E] font-semibold bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-500/20">
                      Action: 15-Min Manager Alert & Recovery
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: CHANNEL 1 DEEP DIVE — GOOGLE MAPS SEO ENGINE */}
            {currentSlide === 3 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-[#F4511E]/10 border border-[#F4511E]/30 px-3 py-1 rounded-full w-fit">
                  <Star className="w-4 h-4 fill-[#2D4A3E]" />
                  <span>Channel 1 Breakdown</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Google Maps SEO Review Generator
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                  <div className="lg:col-span-6 space-y-4">
                    <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed">
                      Instead of a blank, intimidating review box, Menuz provides 1-tap positive keyword tags (e.g. <em>#AuthenticDumBiryani, #SuperbAmbiance, #FastService</em>) that construct high-converting Google reviews with rich SEO weight.
                    </p>
                    <ul className="space-y-2.5 text-sm text-[#4A4A4A]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2F7A4F] shrink-0" />
                        <span>Pre-injects target food keywords into Google's search index</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2F7A4F] shrink-0" />
                        <span>Multi-language auto-generation in English, Hindi, and Marathi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2F7A4F] shrink-0" />
                        <span>1-Click direct redirect to restaurant's verified Google Maps Place ID</span>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:col-span-6 bg-[#F5F1E8] border border-[#F4511E]/40 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="text-xs font-bold text-[#2D4A3E] uppercase">Live Review Builder Preview</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-6 h-6 text-[#2D4A3E] fill-[#2D4A3E]" />
                      ))}
                    </div>
                    <div className="p-4 bg-[#F5F1E8]/90 rounded-xl border border-[#E3E0DA] text-sm text-[#F0F0F0]">
                      "{generatedReviewText}"
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCopiedReview(true);
                        setTimeout(() => setCopiedReview(false), 2000);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#F4511E] to-[#F4511E] text-[#FFFFFF] font-bold rounded-xl text-sm transition-all hover:brightness-110 flex items-center justify-center gap-2 shadow-md"
                    >
                      {copiedReview ? <Check className="w-4 h-4" /> : <Star className="w-4 h-4 fill-slate-950" />}
                      <span>{copiedReview ? 'Copied & Ready to Post!' : '1-Click Copy & Open Google Maps'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 5: CHANNEL 2 DEEP DIVE — SOCIAL SHARING VIRALITY */}
            {currentSlide === 4 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#C23A1C] text-xs font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full w-fit">
                  <Share2 className="w-4 h-4" />
                  <span>Channel 2 Breakdown</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Word-of-Mouth Social Sharing Engine
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                  <div className="lg:col-span-6 space-y-4">
                    <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed">
                      Turn every table into a viral advocate. Guests easily share high-resolution food presentation cards, chef recommendations, and direct table booking links with friends and family.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#F5F1E8] p-4 rounded-xl border border-[#E3E0DA]">
                        <div className="text-[#C23A1C] font-bold text-xl">450+ Reach</div>
                        <div className="text-xs text-[#4A4A4A] mt-1">Average reach per diner table recommendation</div>
                      </div>
                      <div className="bg-[#F5F1E8] p-4 rounded-xl border border-[#E3E0DA]">
                        <div className="text-[#2D4A3E] font-bold text-xl">Zero Cost</div>
                        <div className="text-xs text-[#4A4A4A] mt-1">Authentic organic peer-to-peer growth</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex justify-center">
                    <div className="w-72 bg-gradient-to-br from-[#2D4A3E]/80 to-rose-950/80 border-2 border-rose-500/50 rounded-3xl p-5 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#C23A1C] font-bold">
                        <span>📸 CULINARY CARD</span>
                        <span>Saffron House</span>
                      </div>
                      <div className="h-44 rounded-2xl overflow-hidden relative">
                        <img
                          src={DEMO_STORIES[selectedStoryDish].image}
                          alt="Story"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-xs font-bold text-[#2D4A3E]">
                            {DEMO_STORIES[selectedStoryDish].tag}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#3A3A3A] italic">
                        {DEMO_STORIES[selectedStoryDish].quote}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStoryShared(true);
                          setTimeout(() => setStoryShared(false), 2500);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{storyShared ? 'Shared With Friends!' : 'Share Dish & Unlock Reward'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 6: CHANNEL 3 DEEP DIVE — PRIVATE FLOOR SHIELD */}
            {currentSlide === 5 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Channel 3 Breakdown</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Private Floor Shield & 15-Minute Recovery
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                  <div className="lg:col-span-6 space-y-4">
                    <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed">
                      When a guest selects 1, 2, or 3 stars, they are NEVER sent to Google Maps. Instead, their grievance routes instantly to the Floor Manager's WhatsApp & Admin Dashboard with an active 15-minute countdown clock.
                    </p>
                    <div className="space-y-2 text-sm text-[#4A4A4A]">
                      <div className="flex items-center gap-2 text-[#2F7A4F] font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Manager visits table with a complimentary dessert / apology</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#2F7A4F] font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Guest issue resolved on-premise BEFORE they walk out the door</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#2F7A4F] font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Zero permanent 1-star reviews posted to public search engines</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-[#F5F1E8] border-2 border-red-500/50 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold bg-red-500/20 text-[#C23A1C] px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 animate-pulse" />
                        <span>URGENT TABLE ALERT</span>
                      </span>
                      <span className="font-mono text-xs text-[#2D4A3E] font-bold bg-[#F5F1E8] px-2 py-1 rounded">
                        ⏱️ {formatTimer(voucherSeconds)} REMAINING
                      </span>
                    </div>

                    <div className="bg-[#F5F1E8]/90 p-4 rounded-xl border border-red-500/30 text-sm text-[#F0F0F0]">
                      <strong>Table 4 (4 Guests):</strong> "Soup was served lukewarm and we waited 20 minutes for drinks."
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="Manager PIN (1234)"
                        value={enteredPin}
                        onChange={(e) => setEnteredPin(e.target.value)}
                        className="bg-[#F5F1E8] border border-[#E3E0DA] px-3 py-2 rounded-xl text-sm text-white w-40 focus:outline-none focus:border-[#F4511E]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPin}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#FFFFFF] font-bold text-xs rounded-xl transition-all"
                      >
                        Resolve & Close
                      </button>
                    </div>
                    {pinVerified && (
                      <div className="text-xs font-bold text-[#2F7A4F]">
                        ✅ Table grievance resolved on-floor! Guest satisfied.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 7: HARDWARE-FREE SMART KOT ENGINE */}
            {currentSlide === 6 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2F7A4F] text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
                  <Printer className="w-4 h-4" />
                  <span>Kitchen Automation</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Zero-CapEx Universal Kitchen KOT Bridge
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="text-[#2D4A3E] font-bold text-lg">1. WhatsApp Kitchen Bot</div>
                    <p className="text-sm text-[#4A4A4A]">
                      Orders route straight to a kitchen tablet or chef smartphone via WhatsApp with instant loud chime alert.
                    </p>
                  </div>
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="text-[#2D4A3E] font-bold text-lg">2. Direct ESC/POS Print</div>
                    <p className="text-sm text-[#4A4A4A]">
                      Prints instantly to standard 80mm/58mm thermal printers over LAN, USB, or Bluetooth without driver installs.
                    </p>
                  </div>
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="text-[#2F7A4F] font-bold text-lg">3. Universal POS Bridge</div>
                    <p className="text-sm text-[#4A4A4A]">
                      Seamless Webhook & API integration with Petpooja, RoyalPOS, Recaho, and RanceLab.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 8: REAL-TIME COLLABORATIVE TABLE SYNC */}
            {currentSlide === 7 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
                  <Users className="w-4 h-4" />
                  <span>Multiplayer Table Sync</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Real-Time Joint Table Ordering
                </h2>
                <p className="text-base sm:text-lg text-[#4A4A4A] max-w-3xl">
                  Multiple guests seated at the same table can scan their QR codes and add dishes into a unified shared cart simultaneously over WebSockets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141414]">Guest 1 (Host Device)</span>
                      <span className="text-xs bg-[#F4511E]/20 text-[#2D4A3E] px-2.5 py-1 rounded">Cart Host</span>
                    </div>
                    <div className="p-3 bg-[#F5F1E8] rounded-xl text-sm text-[#4A4A4A]">
                      🥘 1x Awadhi Murgh Dum Biryani (₹480)
                    </div>
                    <div className="text-xs text-[#2F7A4F] font-bold">
                      ✓ Synchronized across all 4 guest screens in &lt;50ms
                    </div>
                  </div>

                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141414]">Guest 2 (Companion Device)</span>
                      <span className="text-xs bg-cyan-500/20 text-[#1F5F8B] px-2.5 py-1 rounded">Participant</span>
                    </div>
                    <div className="p-3 bg-[#F5F1E8] rounded-xl text-sm text-[#4A4A4A]">
                      🍹 2x Royal Saffron Cooler (₹560)
                    </div>
                    <div className="text-xs text-[#2F7A4F] font-bold">
                      ✓ Instant table cart update with host checkout control
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 9: MULTI-LANGUAGE AI STORYTELLING */}
            {currentSlide === 8 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-[#F4511E]/10 border border-[#F4511E]/30 px-3 py-1 rounded-full w-fit">
                  <Globe className="w-4 h-4" />
                  <span>Multilingual AI Menu</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Instant English, Hindi & Marathi AI Menu
                </h2>

                <div className="flex gap-2">
                  {(['en', 'hi', 'mr'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setDemoLang(l)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        demoLang === l
                          ? 'bg-[#F4511E] text-[#FFFFFF] shadow-md'
                          : 'bg-[#EFE9DD] text-[#4A4A4A] hover:text-[#141414]'
                      }`}
                    >
                      {l === 'en' ? '🇬🇧 English' : l === 'hi' ? '🇮🇳 हिन्दी (Hindi)' : '🇮🇳 मराठी (Marathi)'}
                    </button>
                  ))}
                </div>

                <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-6 rounded-2xl max-w-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[#141414]">{DEMO_DISH_DATA[demoLang].title}</h3>
                    <span className="text-xl font-bold text-[#2D4A3E]">{DEMO_DISH_DATA[demoLang].price}</span>
                  </div>
                  <p className="text-base text-[#4A4A4A] leading-relaxed">
                    {DEMO_DISH_DATA[demoLang].desc}
                  </p>
                  <button className="px-5 py-2.5 bg-[#F4511E] text-[#FFFFFF] font-bold rounded-xl text-sm">
                    {DEMO_DISH_DATA[demoLang].addBtn}
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 10: ZERO-APP FRICTION PROTOCOL */}
            {currentSlide === 9 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
                  <Smartphone className="w-4 h-4" />
                  <span>Frictionless Protocol</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Zero App Download. Zero Login Barrier.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-[#2D4A3E] font-bold flex items-center justify-center">
                      ⚡
                    </div>
                    <h3 className="text-lg font-bold text-[#141414]">&lt; 1 Second Load Time</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      Ultra-optimized Vite & Tailwind progressive web app loads instantly on 3G, 4G, 5G, and venue Wi-Fi.
                    </p>
                  </div>

                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4511E]/20 text-[#2D4A3E] font-bold flex items-center justify-center">
                      🚫
                    </div>
                    <h3 className="text-lg font-bold text-[#141414]">No App Store Install</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      Dinners do not want to download 50MB apps for a 45-minute meal. Instant browser access via standard iOS & Android camera.
                    </p>
                  </div>

                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#2F7A4F] font-bold flex items-center justify-center">
                      🔒
                    </div>
                    <h3 className="text-lg font-bold text-[#141414]">Secure Encrypted Token</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      Each table QR has an embedded cryptographic token preventing remote unauthorized order spam.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 11: ENTERPRISE MULTI-OUTLET ARCHITECTURE */}
            {currentSlide === 10 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2F7A4F] text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
                  <Building2 className="w-4 h-4" />
                  <span>Enterprise Cloud</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Multi-Outlet Centralized Cloud Control
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-4">
                    <h3 className="text-xl font-bold text-[#141414]">Headquarters HQ Master Dashboard</h3>
                    <ul className="space-y-2 text-sm text-[#4A4A4A]">
                      <li className="flex items-center gap-2">✓ 1-Click global menu item updates across all 15 branches</li>
                      <li className="flex items-center gap-2">✓ Centralized revenue analytics, table turnaround & staff metrics</li>
                      <li className="flex items-center gap-2">✓ Aggregated Google 5-Star reputation tracker</li>
                    </ul>
                  </div>

                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-4">
                    <h3 className="text-xl font-bold text-[#141414]">Local Branch Autonomy</h3>
                    <ul className="space-y-2 text-sm text-[#4A4A4A]">
                      <li className="flex items-center gap-2">✓ Floor manager live view & table grievance alert channel</li>
                      <li className="flex items-center gap-2">✓ Real-time item stockout toggle (Out of Stock in 1 tap)</li>
                      <li className="flex items-center gap-2">✓ Branch-specific kitchen thermal printer routing</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 12: BOARDROOM PITCH: 15 RESTAURANT FORMATS (100% APPROVAL) */}
            {currentSlide === 11 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-[#F4511E]/10 border border-[#F4511E]/30 px-3 py-1 rounded-full w-fit">
                  <Award className="w-4 h-4" />
                  <span>Boardroom Validation</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tight">
                  15 Diverse Restaurant Formats Analyzed (100% Boardroom Approval)
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 max-h-[380px] overflow-y-auto pr-2">
                  {[
                    { name: '1. Fine Dining', metric: '+28% Wine & Dessert Pairing Upsell' },
                    { name: '2. High-Volume Cafe', metric: '+3.2x Faster Table Turns on Weekends' },
                    { name: '3. Microbrewery', metric: 'Real-Time Multiplayer Shared Cart' },
                    { name: '4. Restobar & Lounge', metric: 'Zero Server Wait in Loud Ambiance' },
                    { name: '5. Fast Casual / QSR', metric: '60% Reduction in Cashier Queues' },
                    { name: '6. Buffet & Live Grill', metric: 'Instant 1-Tap Refill Requests' },
                    { name: '7. Rooftop Lounge', metric: 'High Organic Diner Social Word-of-Mouth' },
                    { name: '8. Heritage Thali', metric: 'Multilingual Marathi & Hindi Storytelling' },
                    { name: '9. Multi-Outlet Chain', metric: 'Centralized HQ Cloud Menu Sync' },
                    { name: '10. Pizzeria', metric: 'Custom Crust & Topping Multi-Selection' },
                    { name: '11. Cloud Kitchen Dine-in', metric: 'Direct Zero-Commission Orders' },
                    { name: '12. Coastal Seafood', metric: 'Dynamic Daily Catch Pricing Updates' },
                    { name: '13. Pure Veg Casual', metric: '100% Floor Grievance Recovery Shield' },
                    { name: '14. Asian Noodle Bar', metric: 'Interactive Spice Level Customization' },
                    { name: '15. Hotel Diner', metric: 'Room Charge & Table Token Verification' }
                  ].map((r, i) => (
                    <div key={i} className="bg-[#F5F1E8] border border-[#E3E0DA]/80 p-3.5 rounded-xl space-y-1">
                      <div className="text-xs font-black text-[#2D4A3E]">{r.name}</div>
                      <div className="text-[11px] text-[#4A4A4A]">{r.metric}</div>
                      <div className="text-[10px] font-bold text-[#2F7A4F]">✓ Approved</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE 13: UNIT ECONOMICS & ROI MODEL */}
            {currentSlide === 12 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2F7A4F] text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
                  <TrendingUp className="w-4 h-4" />
                  <span>Financial Validation</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  +₹3,84,000 Net Monthly Profit Impact
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-5 rounded-2xl">
                    <div className="text-2xl font-black text-[#2D4A3E]">+₹1,44,000</div>
                    <div className="text-sm font-bold text-[#141414] mt-1">AI Upsell & Pairings</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">18% increase in beverage & dessert attachment</div>
                  </div>
                  <div className="bg-[#F5F1E8] border border-cyan-500/30 p-5 rounded-2xl">
                    <div className="text-2xl font-black text-[#2D4A3E]">+₹1,20,000</div>
                    <div className="text-sm font-bold text-[#141414] mt-1">Faster Table Turns</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">12 minutes saved per table during peak rush</div>
                  </div>
                  <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-5 rounded-2xl">
                    <div className="text-2xl font-black text-[#2D4A3E]">+₹85,000</div>
                    <div className="text-sm font-bold text-[#141414] mt-1">Commission Savings</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">Direct diner repeat orders vs aggregator fees</div>
                  </div>
                  <div className="bg-[#F5F1E8] border border-emerald-500/30 p-5 rounded-2xl">
                    <div className="text-2xl font-black text-[#2F7A4F]">+₹35,000</div>
                    <div className="text-sm font-bold text-[#141414] mt-1">Staff Efficiency</div>
                    <div className="text-xs text-[#6E6E6E] mt-1">Waiters focus on hospitality rather than order taking</div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 14: 30-MINUTE DEPLOYMENT ROADMAP */}
            {currentSlide === 13 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
                  <Zap className="w-4 h-4" />
                  <span>Rapid Rollout</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Zero Downtime 30-Minute Deployment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="text-[#2D4A3E] font-black text-3xl">01</div>
                    <h3 className="text-lg font-bold text-[#141414]">Menu Ingestion (10 Mins)</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      Upload physical menu PDF/photo. AI auto-extracts categories, prices, diet tags, and creates English/Hindi/Marathi translations.
                    </p>
                  </div>
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="text-[#2D4A3E] font-black text-3xl">02</div>
                    <h3 className="text-lg font-bold text-[#141414]">QR Table Generation (10 Mins)</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      Download pre-designed, branded printable acrylic table standees with dynamic cryptographic table tokens.
                    </p>
                  </div>
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA] p-6 rounded-2xl space-y-3">
                    <div className="text-[#2F7A4F] font-black text-3xl">03</div>
                    <h3 className="text-lg font-bold text-[#141414]">Staff Go-Live (10 Mins)</h3>
                    <p className="text-sm text-[#4A4A4A]">
                      Connect existing thermal printer or WhatsApp bot. 10-minute floor staff orientation and full service go-live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 15: COMPETITIVE HEGEMONY MATRIX */}
            {currentSlide === 14 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-[#F4511E]/10 border border-[#F4511E]/30 px-3 py-1 rounded-full w-fit">
                  <Award className="w-4 h-4" />
                  <span>Market Comparison</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tight">
                  Competitive Hegemony Matrix
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#E3E0DA] text-[#6E6E6E] text-xs uppercase">
                        <th className="py-3 px-4">Feature & Capability</th>
                        <th className="py-3 px-4 text-[#2D4A3E] font-bold bg-[#F4511E]/10 rounded-t-xl">MENUZ</th>
                        <th className="py-3 px-4">Legacy POS (Petpooja/POSist)</th>
                        <th className="py-3 px-4">Food Aggregators</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E0DA] text-[#4A4A4A]">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#141414]">Hardware Requirements</td>
                        <td className="py-3 px-4 font-bold text-[#2F7A4F] bg-[#F4511E]/5">Zero CapEx (Existing Phone/Printer)</td>
                        <td className="py-3 px-4 text-[#6E6E6E]">High (Proprietary terminals/touchpads)</td>
                        <td className="py-3 px-4 text-[#6E6E6E]">Merchant tablets</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#141414]">Reputation Interception Shield</td>
                        <td className="py-3 px-4 font-bold text-[#2F7A4F] bg-[#F4511E]/5">15-Min Private Manager Escalation</td>
                        <td className="py-3 px-4 text-[#C23A1C]">None</td>
                        <td className="py-3 px-4 text-[#C23A1C]">Public ratings destroy rank</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#141414]">Commission on In-Venue Dining</td>
                        <td className="py-3 px-4 font-bold text-[#2F7A4F] bg-[#F4511E]/5">0% Commission</td>
                        <td className="py-3 px-4 text-[#6E6E6E]">0% (Flat SaaS)</td>
                        <td className="py-3 px-4 text-[#C23A1C]">22% - 30% per order</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#141414]">Multiplayer Table Sync</td>
                        <td className="py-3 px-4 font-bold text-[#2F7A4F] bg-[#F4511E]/5">Real-Time WebSockets</td>
                        <td className="py-3 px-4 text-[#6E6E6E]">Single device only</td>
                        <td className="py-3 px-4 text-[#6E6E6E]">Single diner only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SLIDE 16: GAMIFIED CUSTOMER RETENTION ENGINE (OWNER SOVEREIGN CONTROL) */}
            {currentSlide === 15 && (
              <div className="space-y-6 my-auto relative z-10">
                <div className="flex items-center gap-2 text-[#C23A1C] text-xs font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full w-fit">
                  <Sparkles className="w-4 h-4" />
                  <span>Owner-Controlled Incentive Engine</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                  Gamified Retention: <span className="text-[#2D4A3E]">Zero Forced Discounting</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                  <div className="lg:col-span-6 space-y-4">
                    <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed">
                      Unlike aggregators (Zomato/Swiggy) that mandate 20%–40% discounts, <strong>Menuz gives the restaurant owner 100% sovereign control</strong> over loyalty incentives.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-[#F5F1E8] p-4 rounded-xl border border-emerald-500/40 space-y-1">
                        <div className="text-[#2F7A4F] font-bold text-sm flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span>100% Food-Only Perks (Default — Zero Margin Loss)</span>
                        </div>
                        <p className="text-xs text-[#4A4A4A]">
                          Reward guests with chef desserts (e.g. Saffron Shahi Tukda), artisan mocktails, or VIP table passes without slashing bill prices.
                        </p>
                      </div>

                      <div className="bg-[#F5F1E8] p-4 rounded-xl border border-[#F4511E]/40 space-y-1">
                        <div className="text-[#2D4A3E] font-bold text-sm flex items-center gap-2">
                          <Sliders className="w-4 h-4" />
                          <span>Optional Owner-Defined Discount % (You Decide)</span>
                        </div>
                        <p className="text-xs text-[#4A4A4A]">
                          If an owner chooses to run an off-peak promo, they can toggle discounts ON and set the exact percentage (e.g. 5%, 10%, 15%, 20%).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-[#F5F1E8] border-2 border-[#F4511E]/40 p-6 rounded-2xl text-center space-y-4 shadow-xl">
                    {/* Interactive Owner Control Bar on Slide */}
                    <div className="bg-[#F5F1E8]/90 border border-[#E3E0DA]/80 p-3 rounded-xl text-left space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider">
                          ⚙️ Owner Control Simulator
                        </span>
                        <div className="flex items-center gap-1.5 bg-[#EFE9DD] px-2 py-0.5 rounded-lg border border-[#E3E0DA]">
                          <span className="text-[11px] text-[#4A4A4A] font-bold">Discounts:</span>
                          <button
                            type="button"
                            onClick={() => setOwnerAllowsDiscount(!ownerAllowsDiscount)}
                            className={`text-[10px] font-black px-2 py-0.5 rounded transition-all ${
                              ownerAllowsDiscount
                                ? 'bg-[#F4511E] text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {ownerAllowsDiscount ? 'OPTIONAL ON' : 'DISABLED (FOOD ONLY)'}
                          </button>
                        </div>
                      </div>

                      {ownerAllowsDiscount ? (
                        <div className="space-y-1 pt-1 border-t border-[#E3E0DA]">
                          <div className="flex justify-between text-xs text-[#4A4A4A]">
                            <span>Owner Custom Discount:</span>
                            <span className="font-bold text-[#2D4A3E]">{ownerDiscountPct}% OFF</span>
                          </div>
                          <input
                            type="range"
                            min={5}
                            max={25}
                            step={5}
                            value={ownerDiscountPct}
                            onChange={(e) => setOwnerDiscountPct(Number(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#2F7A4F] font-medium pt-1 border-t border-[#E3E0DA]">
                          ✓ Margin Protection Active: Prizes are 100% Culinary Treats &amp; VIP Perks
                        </div>
                      )}
                    </div>

                    <div className="w-36 h-36 mx-auto rounded-full border-4 border-[#F4511E] bg-gradient-to-tr from-[#F4511E] via-rose-600 to-[#F4511E] flex items-center justify-center text-[#FFFFFF] font-black text-base shadow-xl">
                      🎯 SPIN
                    </div>

                    {wonPrize && (
                      <div className="p-3 bg-[#F5F1E8] rounded-xl border border-[#F4511E]/30 text-[#2D4A3E] font-bold text-xs sm:text-sm">
                        🎉 Won: {wonPrize}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSpinWheel}
                      disabled={isSpinning}
                      className="px-6 py-2.5 bg-[#F4511E] hover:bg-[#F4511E] text-[#FFFFFF] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md"
                    >
                      {isSpinning ? 'Spinning...' : 'Test Spin (Simulate Diner)'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 17: TRANSPARENT SUBSCRIPTION & PRICING */}
            {currentSlide === 16 && (
              <div className="space-y-6 my-auto relative z-10 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full w-fit">
                  <DollarSign className="w-4 h-4" />
                  <span>Commercial Model</span>
                </div>
                <div className="space-y-1 text-left">
                  <h2 className="text-3xl sm:text-5xl font-black text-[#141414] tracking-tight">
                    Flat Monthly Subscription. Zero Commissions.
                  </h2>
                  <p className="text-sm text-[#4A4A4A]">
                    Keep 100% of your dining revenue. No hidden per-order fees, no commissions, and zero mandatory hardware lock-in.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#F5F1E8] border border-[#E3E0DA]/80 p-7 rounded-3xl space-y-4 text-left shadow-xl hover:border-[#E3E0DA] transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                          Single Outlet
                        </span>
                        <span className="text-xs text-[#6E6E6E] font-mono">Stand-alone Venue</span>
                      </div>
                      <div className="text-4xl font-black text-[#141414]">
                        ₹5,000 <span className="text-sm text-[#6E6E6E] font-normal">/ month</span>
                      </div>
                      <p className="text-xs text-[#4A4A4A] leading-relaxed">
                        Complete digital ordering, single-station KOT, and reputation machine for independent restaurants, cafes, and bistros.
                      </p>
                      <ul className="space-y-2 text-xs text-[#4A4A4A] pt-2 border-t border-[#E3E0DA]">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>1 Dedicated Outlet (Up to 25 QR Tables • Digital PDF Stickers)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Fast Mobile Table Ordering (Zero diner app download)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Single-Station Thermal ESC/POS KOT &amp; WhatsApp Alerts</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Standard 1-Way Cloud Order Push to POS (Petpooja / RoyalPOS)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Single-Venue Chef AI Studio (Spice &amp; allergen calibration)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>1-Click Google Maps Review Builder &amp; Floor Grievance Shield</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Standalone Spin Wheel (100% Owner-controlled next-visit perks)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Standard Support (9 AM – 9 PM WhatsApp &amp; Email)</span></li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <div className="text-[11px] text-[#1F5F8B] bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30 text-center font-medium">
                        Ideal for high-turnover single-location restaurants &amp; cafes
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F5F1E8] border-2 border-[#F4511E]/90 p-7 rounded-3xl space-y-4 text-left shadow-2xl relative flex flex-col justify-between">
                    <span className="absolute -top-3 right-6 bg-gradient-to-r from-[#F4511E] to-[#F4511E] text-[#FFFFFF] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                      Enterprise &amp; Multi-Chain
                    </span>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider bg-[#F4511E]/10 px-2.5 py-0.5 rounded-full border border-[#F4511E]/30">
                          Multi-Outlet Enterprise
                        </span>
                        <span className="text-xs text-[#2D4A3E] font-mono">Centralized HQ</span>
                      </div>
                      <div className="text-4xl font-black text-[#141414]">
                        ₹10,000 <span className="text-sm text-[#6E6E6E] font-normal">/ month</span>
                      </div>
                      <p className="text-xs text-[#4A4A4A] leading-relaxed">
                        Full multi-branch oversight with centralized master control, cross-outlet menu pushes, and 2-way POS REST integration.
                      </p>
                      <ul className="space-y-2 text-xs text-[#4A4A4A] pt-2 border-t border-[#E3E0DA]">
                        <li className="flex items-center gap-2 font-semibold text-[#141414]"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Unlimited Outlets &amp; Tables + Custom Shipped QR Hardware Kit</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Real-Time Multiplayer Table Sync + Floor Captain Terminal Bridging</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Multi-Kitchen Smart Routing (Auto-splits Bar, Tandoor, Curry &amp; Pantry)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Full 2-Way REST API Bridge (Live 86 item sync, bill settlements, table status)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Multi-Chef AI Studio with City-Level Overrides &amp; Franchise Tone</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>100% White-Label on Your Domain (`order.brand.com` • Zero Menuz Badge)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Cross-Outlet Benchmarks &amp; Heatmaps (Comparative sales &amp; turn speed)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>Granular Multi-Role RBAC (HQ Director, Regional GM, Chef, Waiter)</span></li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#2D4A3E] shrink-0" /> <span>VIP 24/7 Priority Emergency SLA (Dedicated Director • &lt;15 min response)</span></li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <div className="text-[11px] text-[#2D4A3E] bg-[#F4511E]/10 p-2.5 rounded-xl border border-[#F4511E]/30 text-center font-bold">
                        Built for multi-location brands, franchises &amp; hotel groups
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-[#6E6E6E] pt-1 font-mono">
                  * Custom multi-year enterprise contracts and high-volume billing available on request.
                </div>
              </div>
            )}

            {/* SLIDE 18: DETAILED PLAN COMPARISON & FEATURE MATRIX */}
            {currentSlide === 17 && (
              <div className="space-y-4 my-auto relative z-10 w-full max-w-5xl mx-auto">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
                    <Layers className="w-4 h-4" />
                    <span>In-Depth Plan Comparison Matrix</span>
                  </div>
                  <span className="text-xs text-[#6E6E6E] font-mono">
                    Zero Setup Fees • Month-to-Month • Cancel Anytime
                  </span>
                </div>

                <div className="text-left space-y-1">
                  <h2 className="text-2xl sm:text-4xl font-black text-[#141414] tracking-tight">
                    What Exactly You Get in Each Plan
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A4A4A]">
                    Transparent side-by-side feature matrix. Choose single-venue growth or multi-chain network governance.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] border border-[#E3E0DA]/80 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto max-h-[50vh] scrollbar-thin">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 z-20">
                        <tr className="bg-[#F5F1E8] border-b border-[#E3E0DA] text-white shadow-sm">
                          <th className="py-3 px-4 font-bold text-[#4A4A4A] w-2/5">Capability &amp; Modules</th>
                          <th className="py-3 px-4 font-black text-[#1F5F8B] w-[30%] bg-cyan-950/40 border-l border-[#E3E0DA]">
                            Single Outlet
                            <div className="text-[11px] font-normal text-[#6E6E6E]">₹5,000 / month</div>
                          </th>
                          <th className="py-3 px-4 font-black text-[#2D4A3E] w-[30%] bg-[#F4511E]/40 border-l border-[#E3E0DA]">
                            Multi-Outlet Enterprise
                            <div className="text-[11px] font-normal text-[#2D4A3E]/80">₹10,000 / month</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E3E0DA] text-[#3A3A3A]">
                        {/* Row 1 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Outlet Scale &amp; Hardware Kit</div>
                            <span className="text-[10px] text-[#6E6E6E]">Supported locations &amp; table QR materials</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] font-semibold text-[#1F5F8B]">
                            1 Venue (Up to 25 Tables • Digital PDF Stickers)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Unlimited Venues &amp; Tables + Custom Shipped Acrylic &amp; Metal QR Hardware Kit
                          </td>
                        </tr>

                        {/* Row 2 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Interactive Dining &amp; Floor Sync</div>
                            <span className="text-[10px] text-[#6E6E6E]">Guest table ordering &amp; device synchronization</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#1F5F8B] font-medium">
                            Standard Mobile Table Ordering (Zero Diner App Download)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Real-Time Multiplayer Table Cart Sync + Waiter &amp; Captain Terminal Bridging
                          </td>
                        </tr>

                        {/* Row 3 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Chef AI Studio &amp; Customization</div>
                            <span className="text-[10px] text-[#6E6E6E]">Multilingual translation &amp; recipe adaptations</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#4A4A4A]">
                            Single Venue Profile (Head Chef Spice &amp; Allergen Guard)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Multi-Branch AI Studio with City Overrides, Regional Price Tiers &amp; Franchise Voice
                          </td>
                        </tr>

                        {/* Row 4 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Kitchen KOT &amp; Order Routing</div>
                            <span className="text-[10px] text-[#6E6E6E]">Thermal ticket dispatching &amp; printer architecture</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#4A4A4A]">
                            Single-Station KOT (1 ESC/POS Thermal Printer or WhatsApp Alerts)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Multi-Kitchen Smart Routing (Auto-splits items to Bar, Tandoor, Curry &amp; Pantry KDS)
                          </td>
                        </tr>

                        {/* Row 5 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>POS Integration Architecture</div>
                            <span className="text-[10px] text-[#6E6E6E]">Petpooja, RoyalPOS, Recaho, RanceLab, POSist</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#4A4A4A]">
                            Standard 1-Way Cloud Order Relay (Pushes placed orders to POS)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Full 2-Way Live REST API Bridge (Real-time 86'd stockout sync, bill settlement &amp; inventory)
                          </td>
                        </tr>

                        {/* Row 6 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Google Maps SEO &amp; Reputation Engine</div>
                            <span className="text-[10px] text-[#6E6E6E]">Review generation &amp; floor resolution shield</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#4A4A4A]">
                            Single-Branch 1-Click Review Assist + Floor Grievance Private Form
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Multi-Branch Local SEO Command Center (Cross-location Google profile sync &amp; benchmarks)
                          </td>
                        </tr>

                        {/* Row 7 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Gamified Loyalty &amp; Retention Engine</div>
                            <span className="text-[10px] text-[#6E6E6E]">Lucky wheel, repeat guest incentives &amp; visit triggers</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#4A4A4A]">
                            Standard Venue Spin Wheel (Owner-configured next-visit perks)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Cross-Outlet Loyalty Pass &amp; Branch Dynamic Reward Engine (Geo-targeted retention campaigns)
                          </td>
                        </tr>

                        {/* Row 8 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Brand Identity &amp; Custom Domain</div>
                            <span className="text-[10px] text-[#6E6E6E]">Custom URLs, domain CNAME &amp; white-labeling</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#6E6E6E] font-mono text-[11px]">
                            Hosted Branded Menu (`menuz.in/r/your-slug` with custom logo &amp; theme)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            100% White-Label on Your Domain (`order.yourbrand.com` • Zero Menuz Badge • Custom SSL)
                          </td>
                        </tr>

                        {/* Row 9 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Team Governance &amp; Multi-Role RBAC</div>
                            <span className="text-[10px] text-[#6E6E6E]">Access controls, regional oversight &amp; staff permissions</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#6E6E6E]">
                            Single Owner / Floor Manager Access
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            Granular Multi-Role Governance (HQ Director, Regional GM, Outlet Manager, Chef, Waiter)
                          </td>
                        </tr>

                        {/* Row 10 */}
                        <tr className="hover:bg-[#EFE9DD]/40 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#141414]">
                            <div>Support SLA &amp; Dedicated Operations</div>
                            <span className="text-[10px] text-[#6E6E6E]">Account executive, response guarantee &amp; rush support</span>
                          </td>
                          <td className="py-2.5 px-4 bg-cyan-950/10 border-l border-[#E3E0DA] text-[#4A4A4A]">
                            Standard Business Hours Support (9 AM – 9 PM WhatsApp &amp; Email, &lt;4h SLA)
                          </td>
                          <td className="py-2.5 px-4 bg-[#F4511E]/10 border-l border-[#E3E0DA] font-bold text-[#2D4A3E]">
                            VIP 24/7 Priority Emergency SLA (Dedicated Director • Weekend Rush War-Room • &lt;15 min SLA)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 19: EXECUTIVE ONBOARDING & INSTANT TRIAL */}
            {currentSlide === 18 && (
              <div className="space-y-8 my-auto relative z-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 text-[#2D4A3E] text-xs font-bold uppercase tracking-wider bg-[#F4511E]/10 border border-[#F4511E]/30 px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span>Ready to Transform Your Dining Floor?</span>
                </div>

                <h2 className="text-4xl sm:text-6xl font-black text-[#141414] tracking-tight leading-tight">
                  Launch Menuz In <span className="text-[#2D4A3E]">30 Minutes</span>
                </h2>

                <p className="text-base sm:text-xl text-[#4A4A4A] leading-relaxed">
                  Join the next generation of profitable, reputation-shielded restaurants. Zero hardware purchase required.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link
                    to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
                    className="px-8 py-4 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:from-[#F4511E] hover:to-[#F4511E] text-[#FFFFFF] font-black text-base rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Experience Live Table Menu</span>
                  </Link>

                  <Link
                    to="/manage"
                    className="px-8 py-4 bg-[#F5F1E8] hover:bg-[#EFE9DD] text-[#141414] font-bold text-base rounded-2xl transition-all border border-[#E3E0DA] flex items-center gap-2"
                  >
                    <Building2 className="w-5 h-5 text-[#2D4A3E]" />
                    <span>Open Floor Manager Dashboard</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Bottom Footer Controls inside Slide Canvas */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E3E0DA]/80 text-xs text-[#6E6E6E] mt-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Menuz Autonomous OS</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Use <strong>←</strong> / <strong>→</strong> or <strong>Space</strong> to navigate</span>
                <span className="font-mono text-[#2D4A3E] font-bold">Slide {currentSlide + 1} / {SLIDES_DATA.length}</span>
              </div>
            </div>
          </div>

          {/* Bottom Thumbnails Scroller Bar */}
          <div className="flex gap-2.5 overflow-x-auto py-4 scrollbar-thin mt-2">
            {SLIDES_DATA.map((s, idx) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`relative shrink-0 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'bg-[#F4511E]/20 border-[#F4511E] text-[#141414] shadow-md shadow-amber-500/10'
                    : 'bg-[#F5F1E8]/80 border-[#E3E0DA] text-[#C8C8C8] hover:text-[#F0F0F0] hover:bg-[#EFE9DD]'
                }`}
              >
                <div className="text-[10px] font-bold text-[#2D4A3E]">SLIDE {s.num}</div>
                <div className="text-xs font-semibold whitespace-nowrap">{s.short}</div>
              </button>
            ))}
          </div>
        </main>

      {/* KOT Setup Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F5F1E8] rounded-3xl border border-[#E3E0DA] p-6">
            <SelfServeKotSetupWizard 
              restaurant={restaurant} 
              onComplete={() => setIsWizardOpen(false)} 
              onCancel={() => setIsWizardOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default PitchDeckPage;
