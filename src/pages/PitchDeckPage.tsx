import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  RotateCw, 
  UtensilsCrossed, 
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

interface Chapter {
  id: string;
  stepNum: string;
  tag: string;
  title: string;
  oneLiner: string;
  points: string[];
  bigStat: string;
  bigStatLabel: string;
}

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);

  // Active step (0 to 4: 5 concise steps)
  const [activeStep, setActiveStep] = useState<number>(0);
  const totalSteps = 5;

  // Simple ROI state
  const [dailyTables, setDailyTables] = useState<number>(50);
  const [avgBill, setAvgBill] = useState<number>(1000);

  // Wheel demo state for step 3
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setActiveStep((p) => Math.min(totalSteps - 1, p + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setActiveStep((p) => Math.max(0, p - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const steps: Chapter[] = [
    {
      id: 'problem',
      stepNum: '01',
      tag: 'The Daily Problem',
      title: 'Dine-In Margins Are Getting Squeezed',
      oneLiner: 'Aggregators take 20% cuts, waiters miswrite orders, and 1-star reviews hurt your ranking.',
      points: [
        'Zomato & Swiggy charge 18% to 25% commission on dine-in bills.',
        'Waiters rush during peak dinner hours and punch wrong items.',
        'Unhappy diners write public 1-star Google reviews with zero chance to resolve it.'
      ],
      bigStat: '₹40,000+',
      bigStatLabel: 'Average monthly commission lost per outlet'
    },
    {
      id: 'ordering',
      stepNum: '02',
      tag: 'Contactless Table Menu',
      title: 'Scan QR. Order in 10 Seconds.',
      oneLiner: 'No app download needed. Works instantly on any phone camera.',
      points: [
        'Guests scan the acrylic table QR stand with their normal camera.',
        'High-resolution photos, dish descriptions, and spice levels open in 0.3s.',
        'Appetizers and drinks get ordered immediately without waiting for a waiter.'
      ],
      bigStat: '+20%',
      bigStatLabel: 'Faster table turnaround & higher beverage orders'
    },
    {
      id: 'kitchen',
      stepNum: '03',
      tag: 'Petpooja POS Sync',
      title: 'Orders Print Straight to Your Kitchen Printer',
      oneLiner: 'Zero waiter re-typing. Zero kitchen confusion.',
      points: [
        'Orders flow directly into your existing Petpooja billing terminal.',
        'The kitchen thermal printer spits out the KOT with table number & notes.',
        'Your staff doesn’t touch a screen. Kitchen starts cooking instantly.'
      ],
      bigStat: '0 sec',
      bigStatLabel: 'Waitstaff re-entry time per order'
    },
    {
      id: 'reviews',
      stepNum: '04',
      tag: 'Google Review Machine',
      title: '5★ Goes to Google Maps. 1–3★ Goes Privately to You.',
      oneLiner: 'Multiply positive reviews while protecting your reputation from bad days.',
      points: [
        'Happy diners get AI-assisted 5-star reviews and spin a lucky wheel for 15% off.',
        'Unhappy diners are intercepted privately so your manager can fix it at the table.',
        'Anti-cheat live countdown timer ensures vouchers cannot be screenshotted or reused.'
      ],
      bigStat: '150+',
      bigStatLabel: 'Authentic 5★ Google reviews gained every month'
    },
    {
      id: 'roi',
      stepNum: '05',
      tag: 'Zero Commission',
      title: 'Flat ₹1,999/month. You Keep 100% Profit.',
      oneLiner: 'Zero commission on your food sales. You own all customer phone numbers.',
      points: [
        '0% commission on all dine-in orders — keep every rupee of your margin.',
        'Build your private customer WhatsApp list for Diwali & weekend promos.',
        'Try free for 14 days with custom-printed acrylic QR stands delivered to your door.'
      ],
      bigStat: '0%',
      bigStatLabel: 'Commission taken on food revenue'
    }
  ];

  const current = steps[activeStep];

  // Simple ROI math
  const monthlyTables = dailyTables * 30;
  const monthlyVolume = monthlyTables * avgBill;
  const newReviews = Math.round(monthlyTables * 0.10);
  const aggregatorSaved = Math.round(monthlyVolume * 0.18);
  const extraRevenue = Math.round(monthlyVolume * 0.12);

  return (
    <div className="min-h-screen bg-[#0e1117] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black antialiased">
      {/* Top Clean Header */}
      <header className="sticky top-0 z-50 bg-[#0e1117]/95 backdrop-blur-md border-b border-white/10 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-extrabold tracking-tight text-white">
              MENU<span className="text-amber-500">Z</span>
            </span>
            <span className="text-xs text-charcoal-400 font-medium border-l border-white/15 pl-3 hidden sm:inline">
              Restaurant Partner Overview
            </span>
          </div>

          {/* Clean Step Dots */}
          <div className="flex items-center space-x-2">
            {steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeStep === idx
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-white/5 text-charcoal-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {st.stepNum}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="text-xs text-charcoal-400 hover:text-white transition-colors hidden md:inline"
            >
              Master Admin
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Test Live Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div 
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Scrollytelling Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Clear, Crisp Content */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
          {/* Step Tag */}
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Step {current.stepNum} • {current.tag}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {current.title}
          </h1>

          {/* One-Liner */}
          <p className="text-base text-amber-200/90 font-medium leading-relaxed">
            {current.oneLiner}
          </p>

          {/* 3 Clear Bullet Points */}
          <div className="space-y-3 pt-1">
            {current.points.map((pt, i) => (
              <div key={i} className="flex items-start space-x-3 text-sm text-charcoal-200 leading-relaxed">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Big Stat Box */}
          <div className="pt-3">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-400 font-medium block">Key Takeaway</span>
                <span className="text-sm font-semibold text-white">{current.bigStatLabel}</span>
              </div>
              <span className="text-3xl font-extrabold text-amber-400">{current.bigStat}</span>
            </div>
          </div>

          {/* Step Navigation Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ChevronUp className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={activeStep === totalSteps - 1}
                onClick={() => setActiveStep((p) => Math.min(totalSteps - 1, p + 1))}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-25 text-black font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                Continue <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-charcoal-400">
              Step {activeStep + 1} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Right Column: Clean Visual Device Stage */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="w-full max-w-sm bg-[#161a23] border border-white/15 rounded-2xl p-5 shadow-2xl space-y-4">
            {/* Stage Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10 text-xs">
              <span className="text-charcoal-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </span>
              <span className="text-amber-400 font-bold uppercase">{current.id}</span>
            </div>

            {/* STAGE 1: PROBLEM */}
            {activeStep === 0 && (
              <div className="space-y-3 py-2 text-left">
                <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Aggregator Bill Cut
                    </span>
                    <span className="text-red-400 font-bold">-18% to -25%</span>
                  </div>
                  <div className="font-mono text-xs space-y-1 text-charcoal-300">
                    <div className="flex justify-between">
                      <span>Table Bill:</span>
                      <span className="text-white font-bold">₹2,000.00</span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>Zomato Cut:</span>
                      <span>-₹400.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-red-500/20">
                      <span>You Receive:</span>
                      <span>₹1,600.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Public 1-Star Google Review
                  </span>
                  <p className="text-charcoal-300 text-[11px] italic">
                    "Waited 25 mins for simple naan. Slow service."
                  </p>
                  <p className="text-[10px] text-red-400 font-medium pt-0.5">
                    Permanent damage to your Google Maps footfall.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 2: QR MENU */}
            {activeStep === 1 && (
              <div className="space-y-3 py-1 text-left">
                <div className="text-xs font-bold text-charcoal-300 flex justify-between">
                  <span>Table 4 • Saffron House</span>
                  <span className="text-emerald-400 font-bold">0.3s Load</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=160&q=80"
                    alt="Butter Chicken"
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Old Delhi Butter Chicken</span>
                    <span className="text-[11px] text-amber-400 font-bold">₹480</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                    Added ✓
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=160&q=80"
                    alt="Dal Makhani"
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Slow-Cooked Dal Makhani</span>
                    <span className="text-[11px] text-amber-400 font-bold">₹360</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                    Added ✓
                  </span>
                </div>

                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs flex justify-between text-amber-300 font-bold">
                  <span>2 Items in Tray</span>
                  <span>Total: ₹840</span>
                </div>
              </div>
            )}

            {/* STAGE 3: PETPOOJA KOT */}
            {activeStep === 2 && (
              <div className="space-y-3 py-1 text-left">
                <div className="bg-amber-100 text-black p-3.5 rounded-xl font-mono text-xs shadow-md space-y-2 border-t-4 border-amber-600">
                  <div className="text-center pb-1.5 border-b border-dashed border-gray-400">
                    <span className="font-extrabold block">PETPOOJA KITCHEN TICKET</span>
                    <span className="text-[10px] text-gray-700">KOT #1042 • TABLE 4</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between font-bold">
                      <span>1x Butter Chicken</span>
                      <span>MEDIUM</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>1x Dal Makhani</span>
                      <span>EXTRA BUTTER</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>2x Butter Naan</span>
                      <span>HOT</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-600 pt-1 border-t border-dashed border-gray-400">
                    Source: Menuz QR • Zero waitstaff typing
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Printed at kitchen counter instantly.</span>
                </div>
              </div>
            )}

            {/* STAGE 4: REVIEWS & SHIELD */}
            {activeStep === 3 && (
              <div className="space-y-3 py-1 text-left">
                {/* 5 Star */}
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> 5-Star Diner
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                      Posted to Google
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-300 italic bg-black/40 p-2 rounded-lg">
                    "Amazing food! Butter chicken and hot garlic naan were outstanding. 5/5!"
                  </p>
                  <button
                    onClick={() => {
                      setIsSpinning(true);
                      setTimeout(() => {
                        setIsSpinning(false);
                        setSpinResult('15% Off Your Bill');
                      }, 1200);
                    }}
                    disabled={isSpinning}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'Spinning Wheel...' : 'Simulate Lucky Wheel'}</span>
                  </button>
                  {spinResult && (
                    <div className="text-center text-xs font-bold text-emerald-400 pt-1">
                      🎉 Won: {spinResult}! (15-Min Live Timer)
                    </div>
                  )}
                </div>

                {/* 1-3 Star Shield */}
                <div className="bg-red-950/30 border border-red-500/30 p-2.5 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> 1–3 Star Private Shield
                  </span>
                  <p className="text-[11px] text-charcoal-300">
                    Never touches Google Maps. Floor manager alerted on mobile to resolve at the table.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 5: ROI SLIDERS */}
            {activeStep === 4 && (
              <div className="space-y-3.5 py-1 text-left">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-charcoal-300">Daily Tables:</span>
                    <span className="text-amber-400 font-bold">{dailyTables} tables</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={150}
                    value={dailyTables}
                    onChange={(e) => setDailyTables(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-xs font-semibold pt-1">
                    <span className="text-charcoal-300">Average Bill:</span>
                    <span className="text-amber-400 font-bold">₹{avgBill}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={2500}
                    step={100}
                    value={avgBill}
                    onChange={(e) => setAvgBill(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-400 font-bold block">Aggregator Cut Saved</span>
                    <span className="text-base font-extrabold text-white">₹{aggregatorSaved.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-xl">
                    <span className="text-[10px] text-amber-400 font-bold block">New 5★ Reviews</span>
                    <span className="text-base font-extrabold text-white">+{newReviews} / mo</span>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <Link
                    to="/admin"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition-colors"
                  >
                    <span>Activate 14-Day Free Pilot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
