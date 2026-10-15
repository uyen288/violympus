import * as React from 'react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './ErrorBoundary';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import '@/lib/i18n/config'; // Ensure i18n is initialized

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              className: 'font-sans text-sm',
            }}
          />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
