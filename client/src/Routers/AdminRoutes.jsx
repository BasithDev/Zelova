import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { AdminRoleProtectedRoute } from './ProtectedRoute';
import { AdminNoAuthRoute } from './NoAuthRouter';
import AdminLayout from '../Components/Layouts/AdminLayout';

// Admin Pages
const AdminLogin = lazy(() => import('../Pages/Admins/Login'));
const Dashboard = lazy(() => import('../Pages/Admins/Dashboard'));
const Requests = lazy(() => import('../Pages/Admins/Requests'));
const UserManagement = lazy(() => import('../Pages/Admins/UserManagement'));
const VendorManagement = lazy(() => import('../Pages/Admins/VendorManagement'));
const CategoryMng = lazy(() => import('../Pages/Admins/CategoryMng'));
const CouponMng = lazy(() => import('../Pages/Admins/CouponMng'));
const SendMail = lazy(() => import('../Pages/Admins/SendMail'));
const UserIssues = lazy(() => import('../Pages/Admins/UserIssues'));
const Announcement = lazy(() => import('../Pages/Admins/Announcement'));

const AdminRoutes = [
    // Public Admin Routes (Login)
    <Route key="admin-public" element={<AdminNoAuthRoute />}>
        <Route path="/admin/login" element={<AdminLogin />} />
    </Route>,

    // Protected Admin Routes
    <Route key="admin-protected" element={<AdminRoleProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="user-manage" element={<UserManagement />} />
            <Route path="vendor-manage" element={<VendorManagement />} />
            <Route path="requests" element={<Requests />} />
            <Route path='category-manage' element={<CategoryMng />} />
            <Route path='coupon-manage' element={<CouponMng />} />
            <Route path="send-mail" element={<SendMail />} />
            <Route path='user-issues' element={<UserIssues />} />
            <Route path='announcement' element={<Announcement />} />
        </Route>
    </Route>
];

export default AdminRoutes;