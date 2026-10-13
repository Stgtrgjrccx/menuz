import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../index.css';
import CustomerApp from './CustomerApp';

// Register Customer PWA Service Worker if supported
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomerApp />
  </StrictMode>
);
