import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Prevent legacy PWA shortcuts or stale bookmarks from hijacking the customer site into Admin HQ
if (typeof window !== 'undefined' && !window.location.pathname.includes('/hq')) {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#/admin' || hash.startsWith('#/admin/') || hash === '#/hq' || hash.startsWith('#/hq/')) {
    window.location.hash = '#/';
  }
}

// Register PWA Service Worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
