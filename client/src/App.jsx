// Imports for helpers
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserLayout from './Components/Layouts/UserLayout';
import AdminLayout from './Components/Layouts/AdminLayout';
import VendorLayout from './Components/Layouts/VendorLayout';
import AuthChecker from './Components/AuthChecker';

// Route imports
import { AdminProtectedRoute, UserProtectedRoute, AdminPublicRoute, UserPublicRoute } from './Routers/RouteComponent';

// Imports for user
import Home from './Pages/Users/Home';
import Login from './Pages/Users/Login';
import Register from './Pages/Users/Register';
import Otp from './Pages/Users/Otp';

// Imports for admin
import AdminLogin from './Pages/Admins/Login';
import Dashboard from './Pages/Admins/Dashboard';
import Requests from './Pages/Admins/Requests';
import UserManagement from './Pages/Admins/UserManagement';
import SellerManagement from './Pages/Admins/SellerManagement'

// Imports for vendor
import AddItem from './Pages/Seller/AddItem';

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <AuthChecker />
      <Routes>
        {/* Public Routes for Users (only accessible if NOT authenticated) */}
        <Route element={<UserPublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<Otp />} />
        </Route>

        {/* Public Route for Admin (only accessible if NOT authenticated) */}
        <Route element={<AdminPublicRoute />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* User Routes (only accessible if authenticated as User) */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* Admin Routes (only accessible if authenticated as Admin) */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='user-manage' element={<UserManagement/>} />
            <Route path='vendor-manage' element={<SellerManagement/>} />
            <Route path="requests" element={<Requests />} />
          </Route>
        </Route>

        {/* Vendor Routes (only accessible if authenticated as User) */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/vendor" element={<VendorLayout />}>
            <Route path="additem" element={<AddItem />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;