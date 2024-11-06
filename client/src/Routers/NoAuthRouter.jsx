// AdminNoAuthRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export function AdminNoAuthRoute({ children }) {
  const isAdminAuthenticated = useSelector((state) => state.auth.admin.isAuthenticated);
  const adminRole = useSelector((state) => state.auth.adminRole);

  if (isAdminAuthenticated && adminRole) {
    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}

AdminNoAuthRoute.propTypes = {
  children: PropTypes.node,
};

export function UserNoAuthRoute({ children }) {
  const isUserAuthenticated = useSelector((state) => state.auth.user.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);

  if (isUserAuthenticated) {
    if (userRole === 'vendor') {
      return <Navigate to="/vendor" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

UserNoAuthRoute.propTypes = {
  children: PropTypes.node,
};