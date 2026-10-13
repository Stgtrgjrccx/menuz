import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CustomerHomePage } from '../../pages/CustomerHomePage';
import { DinerMenu } from '../../pages/DinerMenu';
import { GoogleReviewGeneratorPage } from '../../pages/GoogleReviewGeneratorPage';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { PwaInstallModal } from '../../components/PwaInstallModal';
import { CustomerNavbar } from './CustomerNavbar';
import { cloudSyncManager } from '../../lib/cloudSyncManager';

const CustomerRouteSEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = 'Menuz | Autonomous Dine-In Experience, Digital Menus & Reviews';
    let metaDesc = 'Elevate dine-in revenue with Menuz: zero-app multiplayer QR ordering, instant ESC/POS KOT printing, 1-click Google 5-star review builder, and 0% food commission in Pune, India.';

    if (path.includes('/menu')) {
      pageTitle = 'Digital Table Menu & Multiplayer Cart | Menuz';
      metaDesc = 'Interactive, app-free dining menu with real-time multiplayer table sync, dietary filters, and direct kitchen KOT ordering.';
    } else if (path.includes('/review')) {
      pageTitle = 'Google 5-Star Review Generator | 1-Tap AI Drafts & Table Rewards | Menuz';
      metaDesc = 'Generate authentic 5-star Google review drafts in 1 tap, private floor escalation, and spin the lucky reward wheel for instant table treats.';
    }

    document.title = pageTitle;
    let descElement = document.querySelector('meta[name="description"]');
    if (descElement) {
      descElement.setAttribute('content', metaDesc);
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export const CustomerApp: React.FC = () => {
  useEffect(() => {
    cloudSyncManager.init();
  }, []);

  return (
    <HashRouter>
      <CustomerRouteSEOManager />
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200">
        <CustomerNavbar />
        <div className="flex-1">
          <ErrorBoundary>
            <Routes>
              {/* Primary Customer Landing Page */}
              <Route path="/" element={<CustomerHomePage />} />
              <Route path="/customer" element={<CustomerHomePage />} />

              {/* Table QR Menu & Dining Routes */}
              <Route path="/r/:restaurantSlug/menu" element={<DinerMenu />} />
              <Route path="/menu/:restaurantSlug/:tableId" element={<DinerMenu />} />
              <Route path="/menu/:restaurantSlug" element={<DinerMenu />} />
              <Route path="/menu" element={<DinerMenu />} />

              {/* Customer Google Review System */}
              <Route path="/review" element={<GoogleReviewGeneratorPage />} />
              <Route path="/review/:restaurantSlug" element={<GoogleReviewGeneratorPage />} />
              <Route path="/reviews" element={<GoogleReviewGeneratorPage />} />
              <Route path="/google-review" element={<GoogleReviewGeneratorPage />} />

              {/* Any admin or unknown route redirects cleanly to Customer Home */}
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="/hq" element={<Navigate to="/" replace />} />
              <Route path="/hq/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
        <PwaInstallModal />
      </div>
    </HashRouter>
  );
};

export default CustomerApp;
