import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

import UserLayout from './Components/Layouts/UserLayout';
import AdminLayout from './Components/Layouts/AdminLayout';
import VendorLayout from './Components/Layouts/VendorLayout';
import AuthChecker from './Components/AuthChecker';
import { UserProtectedRoute} from './Routers/ProtectedRoute';
import { AdminNoAuthRoute , UserNoAuthRoute} from './Routers/NoAuthRouter';
import {AdminRoleProtectedRoute , UserRoleProtectedRoute} from './Routers/ProtectedRoute'

import Home from './Pages/Users/Home';
import Login from './Pages/Users/Login';
import Register from './Pages/Users/Register';
import Otp from './Pages/Users/Otp';
import RoleManagement from './Pages/Users/RoleManagement';
import Profile from './Pages/Users/Profile';
import RequestVendorPage from './Pages/Users/RequestVendor';

import AdminLogin from './Pages/Admins/Login';
import Dashboard from './Pages/Admins/Dashboard';
import Requests from './Pages/Admins/Requests';
import UserManagement from './Pages/Admins/UserManagement';
import SellerManagement from './Pages/Admins/SellerManagement';
import AdminProfile from './Pages/Admins/Profile';

import AddItem from './Pages/Seller/AddItem';

const queryClient = new QueryClient();

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthChecker />
          <Routes>
            {/* Public User Routes */}
            <Route element={<UserNoAuthRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/otp" element={<Otp />} />
              <Route path="/role-select" element={<RoleManagement />} />
            </Route>

            {/* Public Admin Routes */}
            <Route element={<AdminNoAuthRoute />}>
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            {/* User Routes */}
            <Route element={<UserProtectedRoute />}>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="request-vendor" element={<RequestVendorPage />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoleProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="user-manage" element={<UserManagement />} />
                <Route path="vendor-manage" element={<SellerManagement />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="requests" element={<Requests />} />
              </Route>
            </Route>

            {/* Vendor Routes */}
            <Route element={<UserRoleProtectedRoute allowedRoles={['vendor']} />}>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route path="additem" element={<AddItem />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;