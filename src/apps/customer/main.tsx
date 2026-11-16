import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import CustomerApp from './CustomerApp';

// Unregister any stale Service Worker & clear cache to guarantee instant freshness across mobile devices
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().catch(() => {});
    }
  });
  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        caches.delete(key).catch(() => {});
      }
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomerApp />
  </StrictMode>
);
