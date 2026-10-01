import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../utils/i18n';
import { useRestaurantStore } from '../store/restaurantStore';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'pill' | 'dropdown' | 'compact';
}

const LANGUAGES: Array<{ code: Language; label: string; nativeName: string; flag?: string }> = [
  { code: 'en', label: 'English', nativeName: 'EN' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'हिन्दी' },
  { code: 'mr', label: 'मराठी', nativeName: 'मराठी' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'pill'
}) => {
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useRestaurantStore((state) => state.setSelectedLanguage);

  return (
    <div
      className={`inline-flex items-center bg-[#090D16]/[0.04] border border-white/[0.08] p-0.5 rounded-full ${className}`}
      title="Language: English (Default) | हिन्दी | मराठी"
    >
      <div className="pl-1.5 pr-1 text-slate-400 flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <div className="flex items-center space-x-0.5">
        {LANGUAGES.map((lang) => {
          const isActive = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
