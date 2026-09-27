import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Printer, 
  Sparkles, 
  Smartphone, 
  RotateCw,
  X
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

interface Slide {
  id: string;
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
  stat: string;
  statLabel: string;
}

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 5;

  // Simple simulator slider on slide 5
  const [tablesPerDay, setTablesPerDay] = useState(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonReward, setWonReward] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlide((p) => Math.min(totalSlides - 1, p + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
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
      step: '01',
      badge: 'The Problem',
      title: 'Stop Losing 20% on Every Table',
      subtitle: 'Aggregators eat your margin, while bad Google reviews hurt your business.',
      bullets: [
        'Zomato & Swiggy take ₹400 from a ₹2,000 bill',
        'Waiters make order mistakes during peak dinner rush',
        'Angry diners post 1-star Google reviews that you cannot fix'
      ],
      stat: '₹40,000+',
      statLabel: 'Lost to commissions every month'
    },
    {
      id: 'ordering',
      step: '02',
      badge: 'Table QR',
      title: 'Guests Scan & Order in 10 Seconds',
      subtitle: 'No app download needed. Works directly on any phone camera.',
      bullets: [
        'Diners scan the table QR stand with their phone',
        'Full photo menu with prices loads in 0.3 seconds',
        'Guests order drinks & starters right away without waiting'
      ],
      stat: '20% Faster',
      statLabel: 'Table turnaround & starter orders'
    },
    {
      id: 'kitchen',
      step: '03',
      badge: 'Kitchen Print',
      title: 'Orders Print Straight to Petpooja',
      subtitle: 'Zero waiter typing. The kitchen starts cooking immediately.',
      bullets: [
        'Connected directly to your Petpooja POS system',
        'Thermal printer instantly prints KOT with table number & notes',
        'Waiters don’t re-type anything — zero order mistakes'
      ],
      stat: '0 Seconds',
      statLabel: 'Staff time spent typing orders'
    },
    {
      id: 'reviews',
      step: '04',
      badge: 'Google Reviews',
      title: 'Get 150+ Five-Star Google Reviews',
      subtitle: '5-star reviews go public. Unhappy complaints stay private.',
      bullets: [
        'Happy guests leave a 5-star Google review & win 15% off',
        'Unhappy guests (1–3 stars) alert your manager privately',
        'Live timer prevents guests from using fake screenshots'
      ],
      stat: '150+ Reviews',
      statLabel: 'Gained every single month'
    },
    {
      id: 'pricing',
      step: '05',
      badge: 'Zero Commission',
      title: 'Flat ₹1,999/Month. 0% Commission.',
      subtitle: 'Keep 100% of your money. You own all customer phone numbers.',
      bullets: [
        '0% commission on your food — keep all your profit',
        'Collect customer WhatsApp numbers for festive promos',
        '14-day free trial — we print your table stands free'
      ],
      stat: '0% Cut',
      statLabel: 'You keep 100% of the bill'
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-black">
      {/* Super Clean Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/10 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-white">
              MENU<span className="text-amber-500">Z</span>
            </span>
            <span className="text-[11px] text-charcoal-400 font-medium border-l border-white/15 pl-2">
              Restaurant Pitch
            </span>
          </div>

          {/* Simple Step Indicator */}
          <div className="flex items-center space-x-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  currentSlide === idx
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'bg-white/5 text-charcoal-400 hover:text-white'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="text-xs text-charcoal-400 hover:text-white transition-colors hidden sm:inline"
            >
              Admin
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Try Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div 
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Slide Card: Ultra Clear & Fast to Read */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: 3-Second Read */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Badge */}
          <span className="inline-block text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            {current.step} • {current.badge}
          </span>

          {/* Big Clear Headline */}
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {current.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-charcoal-300 font-medium">
            {current.subtitle}
          </p>

          {/* 3 Short Bullets */}
          <div className="space-y-2.5 pt-2">
            {current.bullets.map((b, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm text-white font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Giant Number Box */}
          <div className="pt-2">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-charcoal-400 uppercase font-bold block">Summary</span>
                <span className="text-xs text-white font-semibold">{current.statLabel}</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {current.stat}
              </span>
            </div>
          </div>

          {/* Simple Navigation */}
          <div className="pt-3 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronUp className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={currentSlide === totalSlides - 1}
                onClick={() => setCurrentSlide((p) => Math.min(totalSlides - 1, p + 1))}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-20 text-black font-bold text-xs flex items-center gap-1"
              >
                Next <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-charcoal-400">
              {currentSlide + 1} of {totalSlides}
            </span>
          </div>
        </div>

        {/* Right Side: Ultra Clean Visual (Takes 2 Seconds to Understand) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="w-full max-w-xs bg-[#131720] border border-white/15 rounded-2xl p-4 shadow-xl text-left space-y-3">
            {/* Slide 1 Graphic: The Zomato Cut */}
            {currentSlide === 0 && (
              <div className="space-y-2 py-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                  Where Your Bill Goes
                </span>
                <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-white">
                    <span>Table Bill:</span>
                    <span className="font-bold">₹2,000</span>
                  </div>
                  <div className="flex justify-between text-red-400 font-bold">
                    <span>Zomato Cut (20%):</span>
                    <span>-₹400</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-red-500/20">
                    <span>You Keep:</span>
                    <span>₹1,600</span>
                  </div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex text-amber-400 text-xs">
                    ★☆☆☆☆ <span className="text-red-400 font-bold ml-1">1 Star</span>
                  </div>
                  <p className="text-[11px] text-charcoal-300 italic">"Waiter was slow. Bad experience."</p>
                </div>
              </div>
            )}

            {/* Slide 2 Graphic: Phone QR Menu */}
            {currentSlide === 1 && (
              <div className="space-y-2 py-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Table 4 • Menu
                </span>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=120&q=80"
                    alt="Butter Chicken"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Butter Chicken</span>
                    <span className="text-[10px] text-amber-400 font-bold">₹480</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                    Added ✓
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=120&q=80"
                    alt="Dal Makhani"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">Dal Makhani</span>
                    <span className="text-[10px] text-amber-400 font-bold">₹360</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                    Added ✓
                  </span>
                </div>
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs flex justify-between font-bold text-amber-300">
                  <span>Order Total:</span>
                  <span>₹840</span>
                </div>
              </div>
            )}

            {/* Slide 3 Graphic: Petpooja Printer */}
            {currentSlide === 2 && (
              <div className="space-y-2 py-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Kitchen Thermal Receipt
                </span>
                <div className="bg-amber-100 text-black p-3 rounded-xl font-mono text-xs shadow-md space-y-1.5 border-t-4 border-amber-600">
                  <div className="text-center pb-1 border-b border-dashed border-gray-400">
                    <span className="font-black block text-xs">PETPOOJA KOT #1042</span>
                    <span className="text-[10px] text-gray-700">TABLE 4 (PATIO)</span>
                  </div>
                  <div className="space-y-0.5 text-[11px]">
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
                  <div className="text-[9px] text-gray-600 pt-1 border-t border-dashed border-gray-400">
                    Printed automatically in 1 second
                  </div>
                </div>
              </div>
            )}

            {/* Slide 4 Graphic: Review Filter */}
            {currentSlide === 3 && (
              <div className="space-y-2.5 py-1">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-400 font-bold">⭐⭐⭐⭐⭐ 5-Star Diner</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      Google Maps
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsSpinning(true);
                      setTimeout(() => {
                        setIsSpinning(false);
                        setWonReward('15% Off Food Bill');
                      }, 1000);
                    }}
                    disabled={isSpinning}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                  >
                    <RotateCw className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'Spinning...' : 'Spin Lucky Wheel'}</span>
                  </button>
                  {wonReward && (
                    <div className="text-center text-xs font-bold text-emerald-400">
                      🎉 Won: {wonReward}!
                    </div>
                  )}
                </div>

                <div className="bg-red-950/40 border border-red-500/30 p-2.5 rounded-xl text-xs space-y-0.5">
                  <span className="text-red-400 font-bold block">1–3 Star Complaint</span>
                  <p className="text-[10px] text-charcoal-300">
                    Goes straight to your phone. Never touches Google Maps!
                  </p>
                </div>
              </div>
            )}

            {/* Slide 5 Graphic: The Simple Comparison */}
            {currentSlide === 4 && (
              <div className="space-y-3 py-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal-400">Tables per day:</span>
                    <span className="text-amber-400 font-bold">{tablesPerDay}</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={tablesPerDay}
                    onChange={(e) => setTablesPerDay(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl text-xs">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">Commission Saved vs Zomato</span>
                  <span className="text-xl font-bold font-mono text-white">
                    ₹{(tablesPerDay * 30 * 1000 * 0.18).toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <Link
                  to="/admin"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
