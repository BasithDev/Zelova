import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { UserNoAuthRoute } from './NoAuthRouter';
const Login = lazy(() => import('../Pages/Users/Login'));
const Register = lazy(() => import('../Pages/Users/Register'));
const Otp = lazy(() => import('../Pages/Users/Otp'));
const ForgotPassword = lazy(() => import('../Pages/Users/ForgotPassword'));
const GoogleResponse = lazy(() => import('./GoogleResponse'));

const PublicRoutes = [
    <Route key="public" element={<UserNoAuthRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="otp" element={<Otp />} />
        <Route path="google-response" element={<GoogleResponse />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
    </Route>
];

export default PublicRoutes;