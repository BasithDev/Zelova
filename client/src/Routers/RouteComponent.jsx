import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Admin Protected Route
export const AdminProtectedRoute = () => {
  const { admin } = useSelector((state) => state.auth);
  return admin.isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

// User Protected Route
export const UserProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Admin Public Route (only accessible if NOT authenticated)
export const AdminPublicRoute = () => {
  const { admin } = useSelector((state) => state.auth);
  return admin.isAuthenticated ? <Navigate to="/admin" /> : <Outlet />;
};

// User Public Route (only accessible if NOT authenticated)
export const UserPublicRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user.isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};