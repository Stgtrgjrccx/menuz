import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import HqApp from './HqApp';

// Unregister any stale root/HQ Service Worker on HQ to guarantee instant freshness
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      if (!registration.scope.includes('/customer')) {
        registration.unregister().catch(() => {});
      }
    }
  }).catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HqApp />
  </StrictMode>
);
