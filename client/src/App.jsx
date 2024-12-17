import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';

// Auth Components
import AuthChecker from './Components/Common/AuthChecker';
import AdminAuthChecker from './Components/Common/AdminAuthChecker';

//Routes
import PublicRoutes from './Routers/PublicRoutes';
import AdminRoutes from './Routers/AdminRoutes';
import UserRoutes from './Routers/UserRoutes';
import VendorRoutes from './Routers/VendorRoutes';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const GoogleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <GoogleOAuthProvider clientId={GoogleClientID}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <AuthChecker />
              <AdminAuthChecker />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {PublicRoutes}
                  {AdminRoutes}
                  {UserRoutes}
                  {VendorRoutes}
                </Routes>
              </Suspense>
            </Router>
          </QueryClientProvider>
        </GoogleOAuthProvider>
        <ToastContainer position='top-right'/>
      </div>
    </ErrorBoundary>
  );
}

export default App; 