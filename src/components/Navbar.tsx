import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, LayoutDashboard, Utensils, QrCode } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-charcoal-900 text-white text-xs py-2 px-4 border-b border-charcoal-800">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-serif font-bold text-sm tracking-wide text-saffron-500">Menuz</span>
          <span className="text-[10px] text-gray-400 bg-charcoal-800 px-2 py-0.5 rounded">Demo Navigator</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto">
          <Link
            to="/r/saffron-house/menu?t=table-token-01-saffron"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
              location.pathname.startsWith('/r/')
                ? 'bg-saffron-600 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-charcoal-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Table 1 Menu</span>
          </Link>

          <Link
            to="/kitchen"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
              location.pathname === '/kitchen'
                ? 'bg-saffron-600 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-charcoal-800'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen KDS</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-saffron-600 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-charcoal-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Manager Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
