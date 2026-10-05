import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../utils/i18n';
import { useRestaurantStore } from '../store/restaurantStore';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'pill' | 'dropdown' | 'compact';
}

const LANGUAGES: Array<{ code: Language; label: string; nativeName: string; flag: string }> = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🚩' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ko', label: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'dropdown'
}) => {
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useRestaurantStore((state) => state.setSelectedLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 py-1 px-2.5 rounded-full bg-[#0D1322] border border-white/[0.12] hover:border-amber-500/40 text-slate-200 hover:text-white transition-all text-xs font-semibold shadow-sm cursor-pointer active:scale-95"
        title="Select Menu Translation Language"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-bold text-amber-300">{activeLang.flag} {activeLang.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-[#0D1322] border border-white/[0.12] shadow-2xl z-50 p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 max-h-72 overflow-y-auto scrollbar-thin">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-white/[0.08] mb-1">
            Choose Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSel = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="text-xs">{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({lang.label})</span>
                </div>
                {isSel && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
