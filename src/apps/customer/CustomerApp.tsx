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
    let pageTitle = 'Menuz | View the Menu in One Scan or Tap';
    let metaDesc = 'View restaurant menus in one scan or tap. Explore high-definition plating photography, dietary preferences, and prices with zero app downloads.';

    if (path.includes('/menu')) {
      pageTitle = 'Visual Menu Showroom | Menuz';
      metaDesc = 'View the complete restaurant menu with high-definition dish photos, dietary filters, and prices.';
    } else if (path.includes('/review')) {
      pageTitle = 'Google Review Generator | Menuz';
      metaDesc = 'Share your dining feedback and review in 1 tap.';
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
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#131315] text-[#e5e1e4] font-sans antialiased selection:bg-[#ff5722]/30 selection:text-white">
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
      </div>
    </HashRouter>
  );
};

export default CustomerApp;
