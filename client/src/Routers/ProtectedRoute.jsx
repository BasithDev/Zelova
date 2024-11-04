import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ forAdmin }) => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  if (forAdmin) {
    // Allow access to admin routes if authenticated as admin
    return isAuthenticated && userRole === 'admin' ? <Outlet /> : <Navigate to="/admin/login" />;
  } else {
    // Allow access to user routes if authenticated as user
    return isAuthenticated && userRole === 'user' ? <Outlet /> : <Navigate to="/login" />;
  }
};

// Define prop types
ProtectedRoute.propTypes = {
  forAdmin: PropTypes.bool.isRequired,
};

export default ProtectedRoute;