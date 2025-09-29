import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@app/routes/AppRoutes';
import MainLayout from '@layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}
