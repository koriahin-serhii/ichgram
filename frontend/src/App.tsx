import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@app/providers/ThemeProvider';
import AppRoutes from '@app/routes/AppRoutes';
import MainLayout from '@layouts/MainLayout';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
