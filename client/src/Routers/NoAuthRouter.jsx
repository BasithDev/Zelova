// AdminNoAuthRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Admin route for unauthenticated access only
export function AdminNoAuthRoute({ children }) {
  const isAdminAuthenticated = useSelector((state) => state.authAdmin.isAuthenticated);

  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
AdminNoAuthRoute.propTypes = {
  children: PropTypes.node,
};

// User route for unauthenticated access only
export function UserNoAuthRoute({ children }) {
  const isUserAuthenticated = useSelector((state) => state.authUser.isAuthenticated);
  const isVendor = useSelector((state) => state.authUser.isVendor);

  const userRole = isVendor ? 'vendor' : 'user';

  if (isUserAuthenticated) {
    if (userRole === 'vendor') {
      return <Navigate to="/role-select" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
UserNoAuthRoute.propTypes = {
  children: PropTypes.node,
};