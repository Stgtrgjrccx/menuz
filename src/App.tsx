import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DinerMenu } from './pages/DinerMenu';
import { KitchenKDS } from './pages/KitchenKDS';
import { ManagerDashboard } from './pages/ManagerDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-900 font-sans">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/r/saffron-house/menu?t=table-token-01-saffron" replace />}
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
              path="*"
              element={<Navigate to="/r/saffron-house/menu?t=table-token-01-saffron" replace />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
