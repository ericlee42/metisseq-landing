import '@/assets/styles/reset.css';
import NProgress from '@/components/_global/NProgress';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/assets/styles/utilities.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.Suspense fallback={<NProgress />}>
    <App />
  </React.Suspense>,
);
