import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

import UserLayout from './Components/Layouts/UserLayout';
import AdminLayout from './Components/Layouts/AdminLayout';
import VendorLayout from './Components/Layouts/VendorLayout';
import AuthChecker from './Components/AuthChecker';
import AdminAuthChecker from './Components/AdminAuthChecker'
import { UserProtectedRoute} from './Routers/ProtectedRoute';
import { AdminNoAuthRoute , UserNoAuthRoute} from './Routers/NoAuthRouter';
import {AdminRoleProtectedRoute , UserRoleProtectedRoute} from './Routers/ProtectedRoute'

import Home from './Pages/Users/Home';
import Login from './Pages/Users/Login';
import Register from './Pages/Users/Register';
import Otp from './Pages/Users/Otp';
import EditUser from './Pages/Users/EditUser'
import RoleManagement from './Pages/Users/RoleManagement';
import Profile from './Pages/Users/Profile';
import RequestVendorPage from './Pages/Users/RequestVendor';
import UserOrderPage from './Pages/Users/Orders'
import AddressMng from './Pages/Users/AddressMng';
import Menu from './Pages/Users/Menu';

import AdminLogin from './Pages/Admins/Login';
import Dashboard from './Pages/Admins/Dashboard';
import Requests from './Pages/Admins/Requests';
import UserManagement from './Pages/Admins/UserManagement';
import SellerManagement from './Pages/Admins/SellerManagement';
import ItemsAndCategoryMng from './Pages/Admins/ItemsAndCategoryMng'

import AddItem from './Pages/Seller/AddItem';
import VendorHome from './Pages/Seller/VendorHome';
import EditId from './Pages/Users/EditId';
import ResetPassword from './Pages/Users/ResetPassword';
import ManageRestaurant from './Pages/Seller/ManageRestaurant';
import MenuManagement from './Pages/Seller/Menu';
import Orders from './Pages/Seller/Orders';
import Favourites from './Pages/Users/Favourites';
import Coins from './Pages/Users/Coins'
import ShareSupplies from './Pages/Users/ShareSupplies';
import GetSupplies from './Pages/Users/GetSupplies';
import GoogleResponse from './Routers/GoogleResponse';
import CouponMng from './Pages/Admins/CouponMng';
import Cart from './Pages/Users/Cart';

const queryClient = new QueryClient();




function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthChecker />
          <AdminAuthChecker/>
            <Routes>
              {/* Public User Routes */}
              <Route element={<UserNoAuthRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/otp" element={<Otp />} />
                <Route path="/google-response" element={<GoogleResponse />} />
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
                  <Route path="edit-user" element={<EditUser/>} />
                  <Route path="change-id" element={<EditId/>} />
                  <Route path="reset-password" element={<ResetPassword/>}/>
                  <Route path="request-vendor" element={<RequestVendorPage />} />
                  <Route path='favourites' element={<Favourites/>} />
                  <Route path='orders' element={<UserOrderPage/>} />
                  <Route path='coins' element={<Coins/>} />
                  <Route path='share-supplies' element={<ShareSupplies/>} />
                  <Route path='get-supplies' element={<GetSupplies/>}/>
                  <Route path='address-manage' element={<AddressMng/>}/>
                  <Route path='/restaurant/:id/menu' element={<Menu/>}/>
                  <Route path='cart' element={<Cart/>} />
                </Route>
              </Route>

              {/* Vendor Routes */}
              <Route element={<UserRoleProtectedRoute allowedRoles={['vendor']} />}>
                <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorHome/>} />
                  <Route path="add-items" element={<AddItem />} />
                  <Route path='manage-restaurant' element={<ManageRestaurant/>}/>
                  <Route path='menu' element={<MenuManagement/>}/> 
                  <Route path='orders' element={<Orders/>}/> 
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoleProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="user-manage" element={<UserManagement />} />
                  <Route path="vendor-manage" element={<SellerManagement />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path='items' element={<ItemsAndCategoryMng/>}/>
                  <Route path='coupon-manage' element={<CouponMng/>}/> 
                </Route>
              </Route>
              
            </Routes>
          
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;