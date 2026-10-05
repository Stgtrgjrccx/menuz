import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Navbar } from './components/Navbar';
import { DinerMenu } from './pages/DinerMenu';
import { KitchenKDS } from './pages/KitchenKDS';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { MasterAdminDashboard } from './pages/MasterAdminDashboard';
import { CustomerHomePage } from './pages/CustomerHomePage';
import { PitchDeckPage } from './pages/PitchDeckPage';
import { AiBotOnboardingStudioPage } from './pages/AiBotOnboardingStudioPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PwaInstallModal } from './components/PwaInstallModal';
import { useRestaurantStore } from './store/restaurantStore';

// Yoast-style Dynamic Route SEO Metadata Manager
const RouteSEOManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // English is strictly the default language and resets immediately whenever leaving or changing pages
    useRestaurantStore.getState().setSelectedLanguage('en');

    const path = location.pathname;
    let pageTitle = 'Menuz | Autonomous Restaurant OS, QR Ordering & Google Review Engine';
    let metaDesc = 'Elevate dine-in revenue with Menuz: zero-app multiplayer QR ordering, instant ESC/POS KOT printing, 1-click Google 5-star review builder, and 0% food commission in Pune, India.';

    if (path === '/pitch') {
      pageTitle = 'Menuz Pitch Deck | 19-Slide Executive Presentation & Product Strategy';
      metaDesc = 'Explore the Menuz 19-slide executive pitch deck: transparent ₹5,000 & ₹10,000 plans, multiplayer table ordering, thermal KOT printing, and reputation floor shield.';
    } else if (path === '/hq' || path === '/admin') {
      pageTitle = 'Master Admin HQ | Autonomous Platform Command Center | Menuz';
      metaDesc = 'Centralized command center for Menuz demo operations, Pune restaurant ecosystem registry, live table QR management, and multi-tenant governance.';
    } else if (path === '/menu') {
      pageTitle = 'Digital Menu Hub | Scan Table QR or Browse Pune Menus | Menuz';
      metaDesc = 'App-free digital dining menus across Pune: explore legendary dining spots, scan your table QR, and order with real-time multiplayer cart sync.';
    } else if (path === '/manage' || path === '/restaurant' || path === '/operations') {
      pageTitle = 'Restaurant Partner Hub | Floor Operations & Outlet Management | Menuz';
      metaDesc = 'Centralized portal for Menuz restaurant partners: manage floor operations, live table sessions, kitchen thermal KOT printing, and Google review shield.';
    } else if (path.startsWith('/manage/') || path.startsWith('/manager/') || path.startsWith('/dashboard/')) {
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
  useEffect(() => {
    // Configure native status bar & splash screen on native devices
    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#090D16' }).catch(() => {});
      SplashScreen.hide().catch(() => {});
    } catch (e) {}
  }, []);

  return (
    <HashRouter>
      <RouteSEOManager />
      <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200">
        <Navbar />
        <div className="flex-1">
          <ErrorBoundary>
            <Routes>
              {/* Customer Home Page: Search database, scan table QR, explore restaurants */}
              <Route
                path="/"
                element={<CustomerHomePage />}
              />
              {/* Generic Customer Dining & Menu Hub */}
              <Route
                path="/menu"
                element={<DinerMenu />}
              />
              <Route
                path="/r/:restaurantSlug/menu"
                element={<DinerMenu />}
              />
              <Route
                path="/r/:restaurantSlug"
                element={<DinerMenu />}
              />
              <Route
                path="/menu/:restaurantSlug"
                element={<DinerMenu />}
              />
              <Route
                path="/menu/:restaurantSlug/:tableId"
                element={<DinerMenu />}
              />
              <Route
                path="/r/:restaurantSlug/:tableId"
                element={<DinerMenu />}
              />
              <Route
                path="/kitchen"
                element={<KitchenKDS />}
              />
              {/* Generic Restaurant Partner Portal & Hub */}
              <Route
                path="/manage"
                element={<ManagerDashboard />}
              />
              <Route
                path="/restaurant"
                element={<ManagerDashboard />}
              />
              <Route
                path="/partner"
                element={<ManagerDashboard />}
              />
              <Route
                path="/operations"
                element={<ManagerDashboard />}
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
                path="/restaurant/:restaurantSlug"
                element={<ManagerDashboard />}
              />
              <Route
                path="/dashboard/:restaurantSlug"
                element={<ManagerDashboard />}
              />
              {/* Dedicated Master Enterprise HQ Platform */}
              <Route
                path="/hq"
                element={<MasterAdminDashboard />}
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
                element={<Navigate to="/" replace />}
              />
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
          </ErrorBoundary>
        </div>
        <PwaInstallModal />
      </div>
    </HashRouter>
  );
};

export default App;
