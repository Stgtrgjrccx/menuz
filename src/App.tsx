import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DinerMenu } from './pages/DinerMenu';
import { KitchenKDS } from './pages/KitchenKDS';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { MasterAdminDashboard } from './pages/MasterAdminDashboard';
import { CustomerHomePage } from './pages/CustomerHomePage';
import { PitchDeckPage } from './pages/PitchDeckPage';
import { AiBotOnboardingStudioPage } from './pages/AiBotOnboardingStudioPage';

// Yoast-style Dynamic Route SEO Metadata Manager
const RouteSEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = 'Menuz | Autonomous Restaurant OS, QR Ordering & Google Review Engine';
    let metaDesc = 'Elevate dine-in revenue with Menuz: zero-app multiplayer QR ordering, instant ESC/POS KOT printing, 1-click Google 5-star review builder, and 0% food commission in Pune, India.';

    if (path === '/pitch') {
      pageTitle = 'Menuz Pitch Deck | 19-Slide Executive Presentation & Product Strategy';
      metaDesc = 'Explore the Menuz 19-slide executive pitch deck: transparent ₹5,000 & ₹10,000 plans, multiplayer table ordering, thermal KOT printing, and reputation floor shield.';
    } else if (path === '/admin') {
      pageTitle = 'Master Admin HQ | Pune Restaurant Ecosystem Control | Menuz';
      metaDesc = 'Centralized command center for Menuz demo operations, Pune restaurant registry, live table QR management, and multi-outlet governance.';
    } else if (path.startsWith('/manage') || path.startsWith('/manager') || path.startsWith('/dashboard')) {
      pageTitle = 'Active Venue Hub | Floor Operations, KOT & Review Shield | Menuz';
      metaDesc = 'Real-time restaurant manager dashboard: active QR table sessions, kitchen thermal KOT printing, Google review SEO, and POS bridge integration.';
    } else if (path.startsWith('/r/')) {
      pageTitle = 'Digital Table Menu & Multiplayer Cart | Menuz';
      metaDesc = 'Interactive, app-free dining menu with real-time multiplayer table sync, dietary filters, and direct kitchen KOT ordering.';
    } else if (path === '/kitchen') {
      pageTitle = 'Kitchen Display System (KDS) | Real-Time Ticket Routing | Menuz';
      metaDesc = 'Hardware-free digital kitchen display system for live order prep, course pacing, and 1-second auto thermal KOT printing.';
    } else if (path === '/ai-studio') {
      pageTitle = 'Chef & Owner AI Studio | 5-Minute Menu Onboarding | Menuz';
      metaDesc = 'Instant AI menu digitizer, dietary tagging, wine pairing assistant, and culinary knowledge base for restaurant owners.';
    }

    document.title = pageTitle;

    // Update meta description tag dynamically for search engine bots
    let descElement = document.querySelector('meta[name="description"]');
    if (!descElement) {
      descElement = document.createElement('meta');
      descElement.setAttribute('name', 'description');
      document.head.appendChild(descElement);
    }
    descElement.setAttribute('content', metaDesc);

    // Update OpenGraph Title dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    // Update Twitter Title dynamically
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <RouteSEOManager />
      <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 font-sans">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Customer Home Page: Search database, scan table QR, explore restaurants */}
            <Route
              path="/"
              element={<CustomerHomePage />}
            />
            <Route
              path="/r/:restaurantSlug/menu"
              element={<DinerMenu />}
            />
            <Route
              path="/kitchen"
              element={<KitchenKDS />}
            />
            <Route
              path="/dashboard"
              element={<ManagerDashboard />}
            />
            <Route
              path="/manager"
              element={<ManagerDashboard />}
            />
            <Route
              path="/manager/:restaurantSlug"
              element={<ManagerDashboard />}
            />
            <Route
              path="/manage/:restaurantSlug"
              element={<ManagerDashboard />}
            />
            <Route
              path="/dashboard/:restaurantSlug"
              element={<ManagerDashboard />}
            />
            <Route
              path="/admin"
              element={<MasterAdminDashboard />}
            />
            <Route
              path="/ai-studio"
              element={<AiBotOnboardingStudioPage />}
            />
            <Route
              path="/pitch"
              element={<PitchDeckPage />}
            />
            <Route
              path="/qr"
              element={<Navigate to="/admin" replace />}
            />
            <Route
              path="*"
              element={<Navigate to="/admin" replace />}
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
