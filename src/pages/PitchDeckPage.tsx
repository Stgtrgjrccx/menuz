import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';

export const PitchDeckPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);

  // Interactive ROI Calculator State
  const [dailyTables, setDailyTables] = useState<number>(60);
  const [avgBill, setAvgBill] = useState<number>(1200);

  // Computed projections
  const monthlyTables = dailyTables * 30;
  const monthlyVolume = monthlyTables * avgBill;
  const estimatedReviewsPerMonth = Math.round(monthlyTables * 0.10); // 10% review conversion on lucky wheel
  const zomatoCommissionLost = Math.round(monthlyVolume * 0.18); // 18% avg commission on Zomato Gold / Dineout
  const estimatedExtraRevenue = Math.round(monthlyVolume * 0.14); // 14% lift from higher Google Maps discovery
  const staffHoursSaved = Math.round((monthlyTables * 1.5) / 60); // 1.5 mins per table saved on manual punching

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      {/* Top Navbar */}
      <header className="bg-charcoal-950 text-white sticky top-0 z-40 border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-2xl font-black tracking-tight text-white">
              MENU<span className="text-saffron-500">Z</span>
            </span>
            <span className="bg-saffron-500/20 text-saffron-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-saffron-400/30">
              Restaurant Partner Pitch
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="text-xs text-charcoal-300 hover:text-white transition-colors"
            >
              Master Admin
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-3.5 py-2 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Test Live Diner Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-ivory-50 text-white pt-16 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs text-amber-300 font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The #1 Contactless Loyalty & Review Multiplier for Indian Restaurants</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Turn Every Diner Into a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-saffron-400 to-amber-500">
              5-Star Google Review
            </span>
          </h1>

          <p className="text-base sm:text-lg text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
            Menuz empowers your guests to scan, order, and spin the wheel for a Google review reward — while orders print directly to your existing <strong>Petpooja kitchen printer</strong> with <strong>0% commission</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#calculator"
              className="px-6 py-3.5 bg-gradient-to-r from-saffron-600 to-amber-600 hover:brightness-110 text-white font-bold text-sm rounded-xl shadow-float transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Calculate Your Restaurant's ROI</span>
            </a>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-saffron-400" />
              <span>Experience Diner Flow (30s)</span>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-2xl font-serif font-black text-amber-400">10x</span>
              <p className="text-xs text-charcoal-300 font-medium mt-0.5">More Google Reviews monthly</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-2xl font-serif font-black text-emerald-400">0%</span>
              <p className="text-xs text-charcoal-300 font-medium mt-0.5">Commission on food bills</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-2xl font-serif font-black text-blue-400">0s</span>
              <p className="text-xs text-charcoal-300 font-medium mt-0.5">Staff re-typing (Petpooja KOT)</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="text-2xl font-serif font-black text-purple-400">100%</span>
              <p className="text-xs text-charcoal-300 font-medium mt-0.5">Customer phones owned by you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-6 -mt-10 space-y-16">
        {/* ========================================================================= */}
        {/* INTERACTIVE ROI & REVIEW CALCULATOR                                      */}
        {/* ========================================================================= */}
        <section id="calculator" className="bg-white rounded-3xl border border-ivory-300 p-8 shadow-float space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
              Interactive Revenue Model
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              What Menuz Will Do for Your Outlet in 30 Days
            </h2>
            <p className="text-xs text-charcoal-600 mt-1">
              Adjust the sliders below to match your restaurant's typical daily operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders (Left) */}
            <div className="lg:col-span-6 space-y-6 bg-ivory-50/70 p-6 rounded-2xl border border-ivory-200">
              {/* Slider 1: Daily Tables */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-charcoal-900">Average Daily Tables Occupied</label>
                  <span className="font-serif font-black text-base text-saffron-700 bg-saffron-100 px-3 py-0.5 rounded-full">
                    {dailyTables} tables / day
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={200}
                  step={5}
                  value={dailyTables}
                  onChange={(e) => setDailyTables(Number(e.target.value))}
                  className="w-full accent-saffron-600 cursor-pointer h-2 bg-ivory-300 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-charcoal-500">
                  <span>15 tables (Small Cafe)</span>
                  <span>100 tables (Casual Dining)</span>
                  <span>200 tables (Large Pub)</span>
                </div>
              </div>

              {/* Slider 2: Average Bill Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-charcoal-900">Average Spend per Table</label>
                  <span className="font-serif font-black text-base text-saffron-700 bg-saffron-100 px-3 py-0.5 rounded-full">
                    ₹{avgBill.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={3500}
                  step={100}
                  value={avgBill}
                  onChange={(e) => setAvgBill(Number(e.target.value))}
                  className="w-full accent-saffron-600 cursor-pointer h-2 bg-ivory-300 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-charcoal-500">
                  <span>₹300 (Chai/Snacks)</span>
                  <span>₹1,200 (Family Dinner)</span>
                  <span>₹3,500 (Fine Dining / Bar)</span>
                </div>
              </div>

              {/* Total Monthly Volume Note */}
              <div className="pt-2 border-t border-ivory-200 text-xs flex justify-between text-charcoal-600">
                <span>Estimated Monthly Dining Volume:</span>
                <span className="font-bold text-charcoal-900">₹{monthlyVolume.toLocaleString('en-IN')} / mo</span>
              </div>
            </div>

            {/* Projected Impact Cards (Right) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {/* Metric 1: Google Reviews */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-subtle space-y-1">
                <div className="flex items-center space-x-1.5 opacity-90">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">New 5★ Reviews</span>
                </div>
                <div className="text-3xl font-serif font-black">+{estimatedReviewsPerMonth}</div>
                <p className="text-[11px] text-amber-100 leading-tight">
                  Every single month, powered by the gamified review wheel.
                </p>
              </div>

              {/* Metric 2: Extra Monthly Revenue */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-subtle space-y-1">
                <div className="flex items-center space-x-1.5 opacity-90">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Revenue Lift</span>
                </div>
                <div className="text-3xl font-serif font-black">+₹{estimatedExtraRevenue.toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-emerald-100 leading-tight">
                  From higher Google Maps discovery & top-ranking local pack.
                </p>
              </div>

              {/* Metric 3: Commission Saved vs Zomato */}
              <div className="bg-charcoal-900 text-white p-5 rounded-2xl border border-charcoal-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-charcoal-400">
                  <DollarSign className="w-4 h-4 text-saffron-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-300">Zomato Gold Cut Avoided</span>
                </div>
                <div className="text-2xl font-serif font-black text-white">₹{zomatoCommissionLost.toLocaleString('en-IN')}</div>
                <p className="text-[10px] text-charcoal-400 leading-tight">
                  What aggregators would take from you at 18% dine-in cut.
                </p>
              </div>

              {/* Metric 4: Staff Hours Saved */}
              <div className="bg-charcoal-900 text-white p-5 rounded-2xl border border-charcoal-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-charcoal-400">
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Staff Time Saved</span>
                </div>
                <div className="text-2xl font-serif font-black text-white">{staffHoursSaved} Hours</div>
                <p className="text-[10px] text-charcoal-400 leading-tight">
                  Eliminated manual re-punching via direct Petpooja KOT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE BRUTAL COMPARISON: MENUZ VS AGGREGATORS                              */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
              The Restaurant Owner's Dilemma
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              Why Pune Restaurants Are Switching Away from Aggregators
            </h2>
            <p className="text-xs text-charcoal-600 mt-1">
              Compare Menuz side-by-side with Zomato Gold / Swiggy Dineout.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-charcoal-950 text-white border-b border-charcoal-800">
                    <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Feature / Commercials</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-[11px] bg-red-950/60 text-red-300">
                      Zomato Gold & Swiggy Dineout
                    </th>
                    <th className="p-4 font-bold uppercase tracking-wider text-[11px] bg-emerald-950/60 text-emerald-300">
                      MENUZ Smart QR Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  <tr>
                    <td className="p-4 font-bold text-charcoal-900">Per-Order Commission</td>
                    <td className="p-4 text-red-700 bg-red-50/40 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      15% to 25% taken on total bill
                    </td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/40 font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        0% Commission (Flat software subscription)
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-charcoal-900">Who Owns the Customer Data?</td>
                    <td className="p-4 text-red-700 bg-red-50/40 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      Zomato keeps phone numbers hidden
                    </td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/40 font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        100% Restaurant Ownership (Export anytime)
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-charcoal-900">Google Maps Reviews Multiplier</td>
                    <td className="p-4 text-red-700 bg-red-50/40 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      Zero reviews for your Google profile
                    </td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/40 font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Pumps 100–200 authentic 5★ reviews monthly
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-charcoal-900">Kitchen POS & Printer Integration</td>
                    <td className="p-4 text-red-700 bg-red-50/40 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      Extra tablet, staff must re-type tickets
                    </td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/40 font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Prints directly to your Petpooja KOT printer
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-bold text-charcoal-900">Anti-Cheat Voucher Security</td>
                    <td className="p-4 text-charcoal-600 bg-red-50/40">Basic static voucher codes</td>
                    <td className="p-4 text-emerald-800 bg-emerald-50/40 font-bold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        15-min countdown + live clock + Waiter PIN void
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS: THE 3-STEP ONBOARDING                                      */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
              Zero Headache Deployment
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              Up and Running in 24 Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-saffron-100 text-saffron-700 font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Custom Acrylic Table Stands</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                We print premium A6 acrylic / wooden QR table stands customized with your logo, colors, and Wi-Fi code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">1-Click Petpooja Sync</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                We link your Petpooja RestID. Your categories, dishes, prices, and taxes import automatically in 60 seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Watch Reviews 5x on Autopilot</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Guests scan, order, review, and win. Your staff doesn't lift a finger — kitchen tickets print automatically!
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CLOSING CTA FOR RESTAURANT OWNER                                         */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-charcoal-950 via-gray-900 to-charcoal-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-float border border-white/10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 block">
            Exclusive Pune Pilot Offer
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">
            Ready to Dominate Google Reviews in Your Locality?
          </h2>
          <p className="text-sm text-charcoal-300 max-w-xl mx-auto leading-relaxed">
            Get started with a 14-day free trial on your first outlet. No setup fees, no lock-in contract.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/admin"
              className="px-8 py-3.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm rounded-xl shadow-subtle transition-all"
            >
              Enter Master Admin Console
            </Link>
            <Link
              to={`/r/${restaurant.slug}/menu?t=table-token-01-saffron`}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
            >
              Launch Live Diner Demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
