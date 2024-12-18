import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { UserProtectedRoute } from './ProtectedRoute';
import OrderProtectedRoute from './OrderProtectedRoute';
import UserLayout from '../Components/Layouts/UserLayout';

// User Pages
const Home = lazy(() => import('../Pages/Users/Home'));
const EditUser = lazy(() => import('../Pages/Users/EditUser'));
const RoleManagement = lazy(() => import('../Pages/Users/RoleManagement'));
const Profile = lazy(() => import('../Pages/Users/Profile'));
const EditId = lazy(() => import('../Pages/Users/EditId'));
const ResetPassword = lazy(() => import('../Pages/Users/ResetPassword'));
const RequestVendorPage = lazy(() => import('../Pages/Users/RequestVendor'));
const Favourites = lazy(() => import('../Pages/Users/Favourites'));
const UserOrderPage = lazy(() => import('../Pages/Users/Orders'));
const Coins = lazy(() => import('../Pages/Users/Coins'));
const ShareSupplies = lazy(() => import('../Pages/Users/ShareSupplies'));
const GetSupplies = lazy(() => import('../Pages/Users/GetSupplies'));
const AddressMng = lazy(() => import('../Pages/Users/AddressMng'));
const Menu = lazy(() => import('../Pages/Users/Menu'));
const Cart = lazy(() => import('../Pages/Users/Cart'));
const Report = lazy(() => import('../Pages/Users/Report'));
const OrderSuccess = lazy(() => import('../Pages/Users/OrderSuccess'));

const UserRoutes = [
    <Route key="user" element={<UserProtectedRoute />}>
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
];

export default UserRoutes;