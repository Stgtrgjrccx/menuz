import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ArrowRight, 
  ArrowLeft,
  Check, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Printer, 
  Sparkles, 
  Smartphone, 
  RotateCw,
  ShieldCheck,
  DollarSign,
  QrCode,
  Users,
  CheckCircle2
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

interface Slide {
  id: string;
  stepNum: string;
  badge: string;
  title: string;
  subtitle: string;
  points: Array<{
    title: string;
    desc: string;
    icon: any;
  }>;
  takeawayValue: string;
  takeawayLabel: string;
}

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 5;

  // Simulator state
  const [tablesCount, setTablesCount] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentSlide((p) => Math.min(totalSlides - 1, p + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentSlide((p) => Math.max(0, p - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const slides: Slide[] = [
    {
      id: 'problem',
      stepNum: '01',
      badge: 'The Daily Problem',
      title: 'Stop Losing 20% on Every Table',
      subtitle: 'Aggregators cut into your profits while paper order tickets create floor chaos.',
      points: [
        {
          title: 'High Commissions',
          desc: 'Zomato & Swiggy take ₹400 from every ₹2,000 dine-in bill.',
          icon: DollarSign
        },
        {
          title: 'Rush Hour Errors',
          desc: 'Waiters miswrite orders and forget customizations during dinner rush.',
          icon: AlertTriangle
        },
        {
          title: 'Public Bad Reviews',
          desc: '1-star Google reviews damage your walk-in footfall permanently.',
          icon: Star
        }
      ],
      takeawayValue: '₹40,000+',
      takeawayLabel: 'Lost in commissions every single month'
    },
    {
      id: 'qr-menu',
      stepNum: '02',
      badge: 'Contactless Dining',
      title: 'Guests Scan & Order in 10 Seconds',
      subtitle: 'No app download needed. Works instantly inside any smartphone camera.',
      points: [
        {
          title: 'Instant Camera Scan',
          desc: 'Guests point their camera at the acrylic QR stand on the table.',
          icon: QrCode
        },
        {
          title: 'High-Res Photo Menu',
          desc: 'Full photo menu, chef pairings, and spice levels load in 0.3s.',
          icon: Smartphone
        },
        {
          title: 'Faster Table Orders',
          desc: 'Drinks and appetizers get ordered right away without waiting.',
          icon: Sparkles
        }
      ],
      takeawayValue: '+20%',
      takeawayLabel: 'Faster table turnover & higher beverage sales'
    },
    {
      id: 'petpooja',
      stepNum: '03',
      badge: 'Kitchen Automation',
      title: 'Orders Print Straight to Petpooja',
      subtitle: 'Zero waiter re-typing. The kitchen starts cooking immediately.',
      points: [
        {
          title: 'Direct POS Sync',
          desc: 'Links directly to your existing Petpooja desktop billing system.',
          icon: Printer
        },
        {
          title: 'Instant KOT Print',
          desc: 'Thermal printer prints tickets with table number and chef notes.',
          icon: CheckCircle2
        },
        {
          title: 'Zero Human Error',
          desc: 'Waiters do not re-punch tickets — eliminates kitchen confusion.',
          icon: ShieldCheck
        }
      ],
      takeawayValue: '0 Seconds',
      takeawayLabel: 'Staff time spent typing or re-entering orders'
    },
    {
      id: 'reviews',
      stepNum: '04',
      badge: 'Reputation Engine',
      title: 'Get 150+ Five-Star Google Reviews',
      subtitle: '5-star reviews go public. Unhappy complaints stay private.',
      points: [
        {
          title: '5-Star Incentive',
          desc: 'Happy diners post a 5-star Google review & spin the wheel for 15% off.',
          icon: Star
        },
        {
          title: 'Private Shield',
          desc: 'Unhappy diners (1–3 stars) alert your manager privately at the table.',
          icon: ShieldCheck
        },
        {
          title: 'Anti-Cheat Timer',
          desc: 'Live countdown clock prevents guests from using fake screenshots.',
          icon: Lock
        }
      ],
      takeawayValue: '150+ Reviews',
      takeawayLabel: 'Authentic 5★ reviews gained every single month'
    },
    {
      id: 'pricing',
      stepNum: '05',
      badge: 'Zero Commission',
      title: 'Flat ₹1,999/Month. 0% Commission.',
      subtitle: 'Keep 100% of your bill amount. You own all customer phone numbers.',
      points: [
        {
          title: 'Zero Commission',
          desc: '0% cut on all food orders — keep every rupee of your margin.',
          icon: DollarSign
        },
        {
          title: 'Customer Ownership',
          desc: 'Collect customer WhatsApp numbers for festive & weekend campaigns.',
          icon: Users
        },
        {
          title: '14-Day Free Pilot',
          desc: 'We print and deliver your acrylic table stands completely free.',
          icon: CheckCircle2
        }
      ],
      takeawayValue: '0% Cut',
      takeawayLabel: 'You keep 100% of your dine-in revenue'
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="bg-[#121824] border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-extrabold tracking-tight text-white">
              MENU<span className="text-amber-500">Z</span>
            </span>
            <span className="text-xs text-slate-400 font-medium pl-3 border-l border-slate-700 hidden sm:inline">
              Restaurant Partner Presentation
            </span>
          </div>

          {/* Step Navigation Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-700 p-1 rounded-lg">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  currentSlide === idx
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s.stepNum}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="text-xs text-slate-400 hover:text-white transition-colors hidden md:inline"
            >
              Master Admin
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Diner Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Slide Deck Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-5xl bg-[#121824] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Slide Top Progress Strip */}
          <div className="h-1 bg-slate-800 w-full">
            <div 
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>

          {/* Slide Header Area */}
          <div className="px-6 sm:px-8 pt-7 pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                Step {current.stepNum} • {current.badge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {current.title}
            </h1>
            <p className="text-sm text-slate-300 font-normal mt-1 max-w-2xl">
              {current.subtitle}
            </p>
          </div>

          {/* Slide Content Body: Balanced 2 Columns */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
            {/* Left Column: 3 Clean Point Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {current.points.map((pt, i) => {
                  const Icon = pt.icon;
                  return (
                    <div 
                      key={i} 
                      className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-start space-x-3.5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-snug">
                          {pt.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {pt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Takeaway Metric Card */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Key Metric
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {current.takeawayLabel}
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono shrink-0 ml-4">
                  {current.takeawayValue}
                </span>
              </div>
            </div>

            {/* Right Column: Matched Visual Container */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="h-full bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-center shadow-inner">
                {/* Visual 1: Zomato Split */}
                {currentSlide === 0 && (
                  <div className="space-y-3 w-full">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block text-left">
                      Typical ₹2,000 Table Bill
                    </span>
                    <div className="bg-red-950/30 border border-red-500/30 p-3.5 rounded-xl space-y-2 text-xs font-mono text-left">
                      <div className="flex justify-between text-slate-300">
                        <span>Customer Bill:</span>
                        <span className="text-white font-bold">₹2,000</span>
                      </div>
                      <div className="flex justify-between text-red-400 font-bold">
                        <span>Zomato Cut (20%):</span>
                        <span>-₹400</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-red-500/20 text-sm">
                        <span>Owner Keeps:</span>
                        <span>₹1,600</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-left text-xs space-y-1">
                      <div className="flex text-amber-400 text-xs">
                        ★☆☆☆☆ <span className="text-red-400 font-bold ml-1">1-Star Review</span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic">"Waiter forgot our extra naans. Slow."</p>
                      <span className="text-[10px] text-red-400 font-medium block">
                        Hurts your Google ranking permanently.
                      </span>
                    </div>
                  </div>
                )}

                {/* Visual 2: Phone Menu */}
                {currentSlide === 1 && (
                  <div className="space-y-3 w-full text-left">
                    <div className="flex justify-between items-center text-xs font-semibold pb-1 border-b border-slate-800">
                      <span className="text-white">Table 4 Menu</span>
                      <span className="text-emerald-400 text-[11px]">Loads in 0.3s</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=120&q=80"
                        alt="Butter Chicken"
                        className="w-11 h-11 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">Old Delhi Butter Chicken</span>
                        <span className="text-[11px] text-amber-400 font-bold">₹480</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                        Added ✓
                      </span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=120&q=80"
                        alt="Dal Makhani"
                        className="w-11 h-11 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">Slow-Cooked Dal Makhani</span>
                        <span className="text-[11px] text-amber-400 font-bold">₹360</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                        Added ✓
                      </span>
                    </div>

                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs flex justify-between font-bold text-amber-400">
                      <span>Total in Tray:</span>
                      <span>₹840</span>
                    </div>
                  </div>
                )}

                {/* Visual 3: Petpooja Printer */}
                {currentSlide === 2 && (
                  <div className="space-y-3 w-full text-left">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      Petpooja Kitchen Printout
                    </span>
                    <div className="bg-amber-50 text-slate-950 p-4 rounded-xl font-mono text-xs shadow-md space-y-2 border-t-4 border-amber-600">
                      <div className="text-center pb-1.5 border-b border-dashed border-slate-300">
                        <span className="font-extrabold text-xs block">KITCHEN ORDER TICKET (KOT)</span>
                        <span className="text-[10px] text-slate-600">KOT #1042 • TABLE 4 (PATIO)</span>
                      </div>
                      <div className="space-y-1 text-xs">
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
                          <span>CRISPY</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-dashed border-slate-300">
                        Source: Menuz QR • Prints in 1 sec
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual 4: Google Review Shield */}
                {currentSlide === 3 && (
                  <div className="space-y-3 w-full text-left">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-400">★★★★★ 5-Star Diner</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                          Goes to Google Maps
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsSpinning(true);
                          setTimeout(() => {
                            setIsSpinning(false);
                            setWonPrize('15% Off Food Bill');
                          }, 1000);
                        }}
                        disabled={isSpinning}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                        <span>{isSpinning ? 'Spinning...' : 'Spin Lucky Wheel'}</span>
                      </button>

                      {wonPrize && (
                        <div className="text-center text-xs font-bold text-emerald-400 pt-0.5">
                          🎉 Diner Won: {wonPrize}!
                        </div>
                      )}
                    </div>

                    <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-red-400 block">1–3 Star Negative Shield</span>
                      <p className="text-[11px] text-slate-300">
                        Never touches Google Maps. Alerts manager’s phone to resolve immediately at table.
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual 5: Simple Slider */}
                {currentSlide === 4 && (
                  <div className="space-y-4 w-full text-left">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Your Tables per Day:</span>
                        <span className="text-amber-400 font-bold font-mono">{tablesCount} tables</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={120}
                        value={tablesCount}
                        onChange={(e) => setTablesCount(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
                      />
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl">
                      <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                        Commission Saved vs Zomato
                      </span>
                      <span className="text-xl font-extrabold font-mono text-white">
                        ₹{(tablesCount * 30 * 1000 * 0.18).toLocaleString('en-IN')} / mo
                      </span>
                    </div>

                    <Link
                      to="/admin"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Start 14-Day Free Pilot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slide Deck Footer Controls */}
          <div className="px-6 sm:px-8 py-4 bg-[#0e131d] border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs font-medium text-slate-400">
              Slide {currentSlide + 1} of {totalSlides}
            </span>

            <button
              type="button"
              disabled={currentSlide === totalSlides - 1}
              onClick={() => setCurrentSlide((p) => Math.min(totalSlides - 1, p + 1))}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-20 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              Next Slide <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
