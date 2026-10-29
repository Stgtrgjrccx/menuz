import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MasterAdminDashboard } from '../../pages/MasterAdminDashboard';
import { ManagerDashboard } from '../../pages/ManagerDashboard';
import { DinerMenu } from '../../pages/DinerMenu';
import { KitchenKDS } from '../../pages/KitchenKDS';
import { AiBotOnboardingStudioPage } from '../../pages/AiBotOnboardingStudioPage';
import { PitchDeckPage } from '../../pages/PitchDeckPage';
import { GoogleReviewGeneratorPage } from '../../pages/GoogleReviewGeneratorPage';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { HqNavbar } from './HqNavbar';
import { cloudSyncManager } from '../../lib/cloudSyncManager';
import { IS_OWNER_SITE } from '../../config/siteMode';

const HqRouteSEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = IS_OWNER_SITE
      ? 'Menuz Restaurant | Food Operations Hub'
      : 'Menuz HQ | Master Platform Command Center';
    let metaDesc = IS_OWNER_SITE
      ? 'Restaurant Operations: live floor seating layout, thermal KOT printer bridge, and direct digital menus in Pune, India.'
      : 'Centralized command center for Menuz platform operations, Pune restaurant ecosystem registry, live table QR management, and multi-tenant governance.';

    if (path.includes('/menu')) {
      pageTitle = 'Digital Table Menu & Ordering | Menuz';
      metaDesc = 'Interactive tableside menu with real-time multiplayer ordering.';
    } else if (path === '/kitchen') {
      pageTitle = 'Kitchen Display System (KDS) | Menuz';
      metaDesc = 'Real-time kitchen order ticket display and fulfillment.';
    } else if (path === '/pitch') {
      pageTitle = 'Menuz Pitch Deck | Executive Presentation & Product Strategy';
      metaDesc = 'Explore the Menuz executive pitch deck: transparent plans, multiplayer table ordering, thermal KOT printing, and reputation floor shield.';
    } else if (path.startsWith('/r/') || path.startsWith('/manage/')) {
      pageTitle = 'Restaurant Venue Operations & Floor Control | Menuz';
      metaDesc = 'Venue Operations: live table sessions, kitchen thermal KOT printing, and Google review shield.';
    } else if (path.includes('/review')) {
      pageTitle = 'Google 5-Star Review Generator | Menuz';
      metaDesc = 'Centralized review generator, custom tags, and table rewards management.';
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

export const HqApp: React.FC = () => {
  useEffect(() => {
    cloudSyncManager.init();
  }, []);

  return (
    <HashRouter>
      <HqRouteSEOManager />
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#FFF7E6] text-[#924E00] font-sans antialiased selection:bg-[#F9A620]/30 selection:text-[#924E00]">
        <HqNavbar />
        <div className="flex-1">
          <ErrorBoundary>
            <Routes>
              {/* Table QR Menu Routes (Must take precedence over /r/:restaurantSlug wildcard) */}
              <Route path="/r/:restaurantSlug/menu" element={<DinerMenu />} />
              <Route path="/menu/:restaurantSlug/:tableId" element={<DinerMenu />} />
              <Route path="/menu/:restaurantSlug" element={<DinerMenu />} />
              <Route path="/menu" element={<DinerMenu />} />

              {/* Primary Landing Route: Owner Site lands on ManagerDashboard; HQ lands on MasterAdminDashboard */}
              <Route
                path="/"
                element={IS_OWNER_SITE ? <ManagerDashboard /> : <MasterAdminDashboard />}
              />

              {/* Explicit Admin Routes */}
              <Route path="/admin" element={<MasterAdminDashboard />} />
              <Route path="/hq" element={<MasterAdminDashboard />} />

              {/* Restaurant Operations & Venue Management Routes */}
              <Route path="/r/:restaurantSlug/*" element={<ManagerDashboard />} />
              <Route path="/r/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/restaurant/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/restaurant" element={<ManagerDashboard />} />
              <Route path="/manage/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/manage" element={<ManagerDashboard />} />
              <Route path="/dashboard/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/operations" element={<ManagerDashboard />} />

              {/* Kitchen Display & AI Studio */}
              <Route path="/kitchen" element={<KitchenKDS />} />
              <Route path="/ai-studio" element={<AiBotOnboardingStudioPage />} />

              {/* Executive & Tool Pages */}
              <Route path="/review" element={<GoogleReviewGeneratorPage />} />
              <Route path="/review/:restaurantSlug" element={<GoogleReviewGeneratorPage />} />
              <Route path="/reviews" element={<GoogleReviewGeneratorPage />} />
              <Route path="/google-review" element={<GoogleReviewGeneratorPage />} />
              <Route path="/pitch" element={<PitchDeckPage />} />

              {/* Fallback cleanly to the appropriate home page */}
              <Route
                path="*"
                element={<Navigate to={IS_OWNER_SITE ? "/" : "/admin"} replace />}
              />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </HashRouter>
  );
};

export default HqApp;
