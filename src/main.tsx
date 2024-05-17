import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '~bootstrap/dist/css/bootstrap.css';
import '~bootstrap-icons/font/bootstrap-icons.css';
import { SuspenseFallback } from './components/SuspenseFallback/index.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<SuspenseFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>,
);

if (import.meta.env.PROD) {
  import('./service-worker-register.ts');
}
