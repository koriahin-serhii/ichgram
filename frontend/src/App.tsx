import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@app/routes/AppRoutes';
import MainLayout from '@layouts/MainLayout';
import AuthProvider from '@app/providers/AuthProvider';
import SplashScreen from '@components/SplashScreen/SplashScreen';
import { queryClient } from '@app/config/queryClient';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} duration={3000} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
