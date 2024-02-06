import React from 'react';
import ReactDOM from 'react-dom/client';
import NProgress from '@/components/_global/NProgress';
import App from './App.tsx';
import 'virtual:uno.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <React.Suspense fallback={<NProgress />}>
    <App />
  </React.Suspense>,
  // </React.StrictMode>,
);
