import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DinerMenu } from './pages/DinerMenu';
import { KitchenKDS } from './pages/KitchenKDS';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { QrCodesPage } from './pages/QrCodesPage';
import { MasterAdminDashboard } from './pages/MasterAdminDashboard';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 font-sans">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Default route → Master Admin Dashboard */}
            <Route
              path="/"
              element={<Navigate to="/admin" replace />}
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
              path="/admin"
              element={<MasterAdminDashboard />}
            />
            <Route
              path="/qr"
              element={<QrCodesPage />}
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
