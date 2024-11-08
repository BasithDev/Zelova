// ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';


export function UserProtectedRoute({ children }) {
  const isUserAuthenticated = useSelector((state) => state.auth.user.isAuthenticated);

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

UserProtectedRoute.propTypes = {
  children: PropTypes.node
};


export function UserRoleProtectedRoute({ allowedRoles }) {
  const isUserAuthenticated = useSelector((state) => state.auth.user.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);

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

export function AdminRoleProtectedRoute() {
  const isAdminAuthenticated = useSelector((state) => state.auth.admin.isAuthenticated);
  const adminRole = useSelector((state) => state.auth.adminRole);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isAdminAuthenticated && adminRole) {
    return <Outlet />;
  }

  return <Navigate to="/admin" replace />;
}
