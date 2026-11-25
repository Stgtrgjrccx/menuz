import React, { useState, useEffect } from 'react';
import {
  Download,
  Share,
  PlusSquare,
  X,
  Smartphone,
  CheckCircle,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

interface PwaInstallModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  showFloatingPrompt?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  showFloatingPrompt = true
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalOpen;
  const handleClose = externalOnClose || (() => setInternalOpen(false));

  useEffect(() => {
    // Check if running as installed standalone app
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt event on Android / Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if dismissed previously in session
    try {
      const dismissed = sessionStorage.getItem('menuz_pwa_banner_dismissed');
      if (dismissed) setBannerDismissed(true);
    } catch (e) {}

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        handleClose();
      }
    } else {
      // Open step-by-step modal for iOS / Safari
      setInternalOpen(true);
    }
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    try {
      sessionStorage.setItem('menuz_pwa_banner_dismissed', 'true');
    } catch (e) {}
  };

  // If already running as standalone installed app, don't show prompt
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* ── Floating Smart Install Bar at Bottom (Auto Mobile Trigger) ── */}
      {showFloatingPrompt && !bannerDismissed && !isModalOpen && (
        <aside 
          aria-label="Install App Banner"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#F5F1E8]/95 backdrop-blur-xl border border-[#F4511E]/40 p-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-center justify-between gap-3 text-[#141414]"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F4511E] to-[#F4511E] flex items-center justify-center text-[#FFFFFF] font-black text-lg shadow-md shrink-0">
              M
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-[#141414] truncate">Menuz Admin App</h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#F4511E]/20 text-[#2D4A3E] border border-[#F4511E]/30">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-[#4A4A4A] truncate">
                Install on your Home Screen for 1-tap access
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 text-[#FFFFFF] text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 text-[#141414]" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={handleDismissBanner}
              className="p-1.5 text-[#6E6E6E] hover:text-[#141414] rounded-lg hover:bg-black/[0.04] transition-colors"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* ── Interactive Installation Walkthrough Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#F5F1E8] border border-[#F4511E]/30 rounded-3xl max-w-md w-full p-6 text-[#141414] shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-[#6E6E6E] hover:text-[#141414] rounded-xl hover:bg-black/[0.04] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F4511E] to-[#F4511E] flex items-center justify-center text-[#FFFFFF] font-black text-2xl shadow-lg">
                M
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#2D4A3E] font-bold bg-[#F4511E]/10 px-2 py-0.5 rounded-full border border-[#F4511E]/20">
                  Instant PWA Install (₹0 Cost)
                </span>
                <h3 className="font-serif text-xl font-bold text-[#141414] mt-0.5">
                  Install Menuz Admin App
                </h3>
              </div>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4A4A4A]">
              <div className="flex items-center space-x-1.5 bg-black/[0.04] p-2 rounded-xl border border-black/[0.06]">
                <CheckCircle className="w-3.5 h-3.5 text-[#2F7A4F] shrink-0" />
                <span>100% Fullscreen View</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/[0.04] p-2 rounded-xl border border-black/[0.06]">
                <Zap className="w-3.5 h-3.5 text-[#2D4A3E] shrink-0" />
                <span>Instant Offline Cache</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/[0.04] p-2 rounded-xl border border-black/[0.06]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A3E] shrink-0" />
                <span>No App Store Account</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/[0.04] p-2 rounded-xl border border-black/[0.06]">
                <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E] shrink-0" />
                <span>Automatic Free Updates</span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            {isIos ? (
              <div className="bg-[#F5F1E8]/90 border border-black/[0.08] rounded-2xl p-4 space-y-3.5">
                <h4 className="text-xs font-bold text-[#2D4A3E] flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>3-Step iPhone &amp; iPad Installation:</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#F4511E]/20 text-[#2D4A3E] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="leading-snug">
                      <span>In Safari, tap the </span>
                      <strong className="text-[#141414] font-bold inline-flex items-center gap-1 bg-black/[0.04] px-1.5 py-0.5 rounded text-[11px]">
                        <Share className="w-3 h-3 text-[#2D4A3E]" /> Share button
                      </strong>
                      <span className="text-[#6E6E6E] text-[11px] block mt-0.5">
                        (located at the bottom center of Safari)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#F4511E]/20 text-[#2D4A3E] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="leading-snug">
                      <span>Scroll down and tap </span>
                      <strong className="text-[#141414] font-bold inline-flex items-center gap-1 bg-black/[0.04] px-1.5 py-0.5 rounded text-[11px]">
                        <PlusSquare className="w-3 h-3 text-[#2D4A3E]" /> Add to Home Screen
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#F4511E]/20 text-[#2D4A3E] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="leading-snug">
                      <span>Tap </span>
                      <strong className="text-white font-bold bg-[#F4511E] text-[#FFFFFF] px-2 py-0.5 rounded text-[11px]">
                        Add
                      </strong>
                      <span> in the top right corner. Done!</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {deferredPrompt ? (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-3 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 text-[#FFFFFF] font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#141414]" />
                    <span>Click Here to 1-Tap Install Now</span>
                  </button>
                ) : (
                  <div className="bg-[#F5F1E8]/90 border border-black/[0.08] rounded-2xl p-4 text-xs text-[#444444] space-y-2">
                    <p className="font-bold text-[#141414]">Android / Chrome Instructions:</p>
                    <p>
                      Tap the <strong>three dots menu $(\vdots)$</strong> in Chrome, then select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 bg-black/[0.04] hover:bg-black/[0.04] text-[#4A4A4A] hover:text-[#141414] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Got it, continue in browser
            </button>
          </div>
        </div>
      )}
    </>
  );
};
