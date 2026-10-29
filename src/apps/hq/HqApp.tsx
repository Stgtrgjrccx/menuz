import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MasterAdminDashboard } from '../../pages/MasterAdminDashboard';
import { ManagerDashboard } from '../../pages/ManagerDashboard';
import { PitchDeckPage } from '../../pages/PitchDeckPage';
import { GoogleReviewGeneratorPage } from '../../pages/GoogleReviewGeneratorPage';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { HqNavbar } from './HqNavbar';
import { cloudSyncManager } from '../../lib/cloudSyncManager';

const HqRouteSEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = 'Menuz HQ | Master Platform Command Center';
    let metaDesc = 'Centralized command center for Menuz platform operations, Pune restaurant ecosystem registry, live table QR management, and multi-tenant governance.';

    if (path === '/pitch') {
      pageTitle = 'Menuz Pitch Deck | Executive Presentation & Product Strategy';
      metaDesc = 'Explore the Menuz executive pitch deck: transparent plans, multiplayer table ordering, thermal KOT printing, and reputation floor shield.';
    } else if (path.startsWith('/r/') || path.startsWith('/manage/')) {
      pageTitle = 'Restaurant Venue Operations & Floor Control | Menuz HQ';
      metaDesc = 'HQ Venue Operations inspection: live table sessions, kitchen thermal KOT printing, and Google review shield.';
    } else if (path.includes('/review')) {
      pageTitle = 'Google 5-Star Review Generator | Menuz HQ';
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
              {/* Primary Master Admin HQ Routes */}
              <Route path="/" element={<MasterAdminDashboard />} />
              <Route path="/admin" element={<MasterAdminDashboard />} />
              <Route path="/hq" element={<MasterAdminDashboard />} />

              {/* Restaurant Venue Management & Inspection from HQ */}
              <Route path="/r/:restaurantSlug/*" element={<ManagerDashboard />} />
              <Route path="/r/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/restaurant/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/manage/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/manage" element={<ManagerDashboard />} />
              <Route path="/dashboard/:restaurantSlug" element={<ManagerDashboard />} />
              <Route path="/dashboard" element={<ManagerDashboard />} />

              {/* Executive & Tool Pages */}
              <Route path="/review" element={<GoogleReviewGeneratorPage />} />
              <Route path="/review/:restaurantSlug" element={<GoogleReviewGeneratorPage />} />
              <Route path="/reviews" element={<GoogleReviewGeneratorPage />} />
              <Route path="/google-review" element={<GoogleReviewGeneratorPage />} />
              <Route path="/pitch" element={<PitchDeckPage />} />

              {/* Fallback cleanly to HQ Home */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </HashRouter>
  );
};

export default HqApp;
