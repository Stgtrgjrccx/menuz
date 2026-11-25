import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';
import { getHqSiteUrl, IS_HQ_SITE } from '../config/siteMode';

export const ReturnToHqBanner: React.FC = () => {
  const location = useLocation();
  const [fromHq, setFromHq] = useState<boolean>(false);

  useEffect(() => {
    // Show if query string specifies 'from=hq' or if session was initiated from HQ
    const winSearch = typeof window !== 'undefined' ? window.location.search.toLowerCase() : '';
    const winHash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
    const locSearch = location.search.toLowerCase();
    const hasSessionHq = typeof window !== 'undefined' && sessionStorage.getItem('menuz_from_hq') === 'true';

    const searchHasHq =
      winSearch.includes('from=hq') ||
      winHash.includes('from=hq') ||
      locSearch.includes('from=hq') ||
      hasSessionHq;

    setFromHq(searchHasHq);
  }, [location]);

  const navigate = useNavigate();

  // Determine if we're on the HQ Dashboard home screen
  const isAtHqHome =
    (IS_HQ_SITE && (location.pathname === '/' || location.pathname === '/hq' || location.pathname === '/admin')) ||
    (typeof window !== 'undefined' && IS_HQ_SITE && (window.location.hash === '#/' || window.location.hash === '#/hq' || window.location.hash === '#/admin'));

  if (isAtHqHome) {
    return null;
  }

  // Don't show if not from HQ and not on HQ site
  if (!fromHq && !IS_HQ_SITE) {
    return null;
  }

  const handleReturnToHq = () => {
    try {
      sessionStorage.removeItem('menuz_from_hq');
    } catch (e) {}
    setFromHq(false);
    if (IS_HQ_SITE) {
      navigate('/');
    } else {
      window.location.href = getHqSiteUrl('');
    }
  };

  return (
    <aside aria-label="Master Admin HQ Session" className="sticky top-0 z-50 bg-gradient-to-r from-[#2D4A3E] via-[#2D4A3E] to-[#FFFFFF] border-b border-[#F4511E]/40 text-white px-3 sm:px-5 py-2 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5 truncate">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-extrabold uppercase tracking-wider text-[#2D4A3E] font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F4511E]/20 border border-[#F4511E]/40">
            HQ Live Preview
          </span>
          <span className="font-medium text-[#3A3A3A] truncate hidden sm:inline">
            Viewing from Master Admin HQ Command Center
          </span>
        </div>

        <button
          type="button"
          onClick={handleReturnToHq}
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#F4511E] hover:bg-[#F4511E] active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg border border-[#F4511E]/30 transition-all cursor-pointer hover:shadow-[#F4511E]/25"
          title="Exit preview and return to Master Platform Command Center"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2D4A3E]" />
          <span>Return to Master HQ</span>
        </button>
      </div>
    </aside>
  );
};

export default ReturnToHqBanner;
