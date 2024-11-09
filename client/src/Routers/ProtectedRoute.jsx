// ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

// User protected route, checking for authenticated user
export function UserProtectedRoute({ children }) {
  const isUserAuthenticated = useSelector((state) => state.authUser.isAuthenticated);

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
UserProtectedRoute.propTypes = {
  children: PropTypes.node,
};

// User role protected route, checking for specific roles
export function UserRoleProtectedRoute({ allowedRoles }) {
  const isUserAuthenticated = useSelector((state) => state.authUser.isAuthenticated);
  const isVendor = useSelector((state) => state.authUser.isVendor) || Cookies.get('is_vendor')

  const userRole = isVendor ? 'vendor' : 'user';

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isUserAuthenticated && allowedRoles.includes(userRole)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}
UserRoleProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// Admin role protected route, checking for authenticated admin
export function AdminRoleProtectedRoute() {
  const isAdminAuthenticated = useSelector((state) => state.authAdmin.isAuthenticated);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}