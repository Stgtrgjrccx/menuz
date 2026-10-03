import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, UtensilsCrossed, Presentation, Compass, ShieldCheck } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full inline-block border border-amber-500/20">
            Error 404 • Route Not Found
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Lost Your Table?
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            The link you followed doesn't exist, has expired, or was entered incorrectly. Let's get you back on track:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-2">
          <Link
            to="/admin"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm transition-all shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Open Master Admin HQ</span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#090D16]/[0.06] hover:bg-white/[0.1] active:scale-95 text-white font-medium text-xs transition-all border border-white/[0.08]"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Explore Demos</span>
          </Link>

          <Link
            to="/r/saffron-house"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#090D16]/[0.06] hover:bg-white/[0.1] active:scale-95 text-white font-medium text-xs transition-all border border-white/[0.08]"
          >
            <UtensilsCrossed className="w-4 h-4 text-cyan-400" />
            <span>View Demo Diner Menu (Saffron House)</span>
          </Link>
        </div>

        <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
          Need operational support? Contact <a href="mailto:partner@menuz.in" className="text-amber-400 hover:underline">partner@menuz.in</a>
        </div>
      </div>
    </div>
  );
};
