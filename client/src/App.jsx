import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import React, { lazy, Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

// Layouts
import UserLayout from './Components/Layouts/UserLayout';
import AdminLayout from './Components/Layouts/AdminLayout';
import VendorLayout from './Components/Layouts/VendorLayout';

// Auth Components
import AuthChecker from './Components/Common/AuthChecker';
import AdminAuthChecker from './Components/Common/AdminAuthChecker';
import { UserProtectedRoute } from './Routers/ProtectedRoute';
import { AdminNoAuthRoute, UserNoAuthRoute } from './Routers/NoAuthRouter';
import { AdminRoleProtectedRoute, UserRoleProtectedRoute } from './Routers/ProtectedRoute';
import OrderProtectedRoute from './Routers/OrderProtectedRoute';

// Lazy loaded components
const Home = lazy(() => import('./Pages/Users/Home'));
const Login = lazy(() => import('./Pages/Users/Login'));
const Register = lazy(() => import('./Pages/Users/Register'));
const Otp = lazy(() => import('./Pages/Users/Otp'));
const EditUser = lazy(() => import('./Pages/Users/EditUser'));
const RoleManagement = lazy(() => import('./Pages/Users/RoleManagement'));
const Profile = lazy(() => import('./Pages/Users/Profile'));
const RequestVendorPage = lazy(() => import('./Pages/Users/RequestVendor'));
const UserOrderPage = lazy(() => import('./Pages/Users/Orders'));
const AddressMng = lazy(() => import('./Pages/Users/AddressMng'));
const Menu = lazy(() => import('./Pages/Users/Menu'));
const EditId = lazy(() => import('./Pages/Users/EditId'));
const ResetPassword = lazy(() => import('./Pages/Users/ResetPassword'));
const Favourites = lazy(() => import('./Pages/Users/Favourites'));
const Coins = lazy(() => import('./Pages/Users/Coins'));
const ShareSupplies = lazy(() => import('./Pages/Users/ShareSupplies'));
const GetSupplies = lazy(() => import('./Pages/Users/GetSupplies'));
const Cart = lazy(() => import('./Pages/Users/Cart'));
const OrderSuccess = lazy(() => import('./Pages/Users/OrderSuccess'));
const Report = lazy(() => import('./Pages/Users/Report'));
const ForgotPassword = lazy(() => import('./Pages/Users/ForgotPassword'));

// Admin Pages
const AdminLogin = lazy(() => import('./Pages/Admins/Login'));
const Dashboard = lazy(() => import('./Pages/Admins/Dashboard'));
const Requests = lazy(() => import('./Pages/Admins/Requests'));
const UserManagement = lazy(() => import('./Pages/Admins/UserManagement'));
const SellerManagement = lazy(() => import('./Pages/Admins/SellerManagement'));
const CategoryMng = lazy(() => import('./Pages/Admins/CategoryMng'));
const CouponMng = lazy(() => import('./Pages/Admins/CouponMng'));
const SendMail = lazy(() => import('./Pages/Admins/SendMail'));
const UserIssues = lazy(() => import('./Pages/Admins/UserIssues'));

// Vendor Pages
const AddItem = lazy(() => import('./Pages/Seller/AddItem'));
const VendorHome = lazy(() => import('./Pages/Seller/VendorHome'));
const ManageRestaurant = lazy(() => import('./Pages/Seller/ManageRestaurant'));
const MenuManagement = lazy(() => import('./Pages/Seller/Menu'));
const Orders = lazy(() => import('./Pages/Seller/Orders'));

const GoogleResponse = lazy(() => import('./Routers/GoogleResponse'));

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
                  {/* Public User Routes */}
                  <Route element={<UserNoAuthRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="otp" element={<Otp />} />
                    <Route path="google-response" element={<GoogleResponse />} />
                    <Route path='forgot-password' element={<ForgotPassword />} />
                  </Route>

                  {/* Public Admin Routes */}
                  <Route element={<AdminNoAuthRoute />}>
                    <Route path="/admin/login" element={<AdminLogin />} />
                  </Route>

                  {/* User Routes */}
                  <Route element={<UserProtectedRoute />}>
                    <Route path="/role-select" element={<RoleManagement />} />
                    <Route path="/" element={<UserLayout />}>
                      <Route index element={<Home />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="edit-user" element={<EditUser />} />
                      <Route path="change-id" element={<EditId />} />
                      <Route path="reset-password" element={<ResetPassword />} />
                      <Route path="request-vendor" element={<RequestVendorPage />} />
                      <Route path='favourites' element={<Favourites />} />
                      <Route path='orders' element={<UserOrderPage />} />
                      <Route path='coins' element={<Coins />} />
                      <Route path='share-supplies' element={<ShareSupplies />} />
                      <Route path='get-supplies' element={<GetSupplies />} />
                      <Route path='address-manage' element={<AddressMng />} />
                      <Route path='/restaurant/:id/menu' element={<Menu />} />
                      <Route path='cart' element={<Cart />} />
                      <Route path='report' element={<Report />} />
                      <Route element={<OrderProtectedRoute />}>
                        <Route path='order-success' element={<OrderSuccess />} />
                      </Route>
                    </Route>
                  </Route>

                  {/* Vendor Routes */}
                  <Route element={<UserRoleProtectedRoute allowedRoles={['vendor']} />}>
                    <Route path="/vendor" element={<VendorLayout />}>
                      <Route index element={<VendorHome />} />
                      <Route path="add-items" element={<AddItem />} />
                      <Route path='manage-restaurant' element={<ManageRestaurant />} />
                      <Route path='menu' element={<MenuManagement />} />
                      <Route path='orders' element={<Orders />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminRoleProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="user-manage" element={<UserManagement />} />
                      <Route path="vendor-manage" element={<SellerManagement />} />
                      <Route path="requests" element={<Requests />} />
                      <Route path='category-manage' element={<CategoryMng />} />
                      <Route path='coupon-manage' element={<CouponMng />} />
                      <Route path="send-mail" element={<SendMail />} />
                      <Route path='user-issues' element={<UserIssues />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </QueryClientProvider>
        </GoogleOAuthProvider>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;