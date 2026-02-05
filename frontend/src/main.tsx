import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { QueryProvider } from '@utils/query-provider';
import { ErrorBoundary } from '@utils/error-boundary';
import '@styles/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
