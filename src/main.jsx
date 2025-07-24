import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import AppV3 from './AppV3.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './App.css';
import './theme.css';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
