import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import React, { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

// Auth Components
import AuthChecker from './Components/Common/AuthChecker';
import AdminAuthChecker from './Components/Common/AdminAuthChecker';

//Routes
import PublicRoutes from './Routers/PublicRoutes';
import AdminRoutes from './Routers/AdminRoutes';
import UserRoutes from './Routers/UserRoutes';
import VendorRoutes from './Routers/VendorRoutes';


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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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