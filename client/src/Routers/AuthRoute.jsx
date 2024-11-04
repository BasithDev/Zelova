import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthRoute = ({ forAdmin }) => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  if (forAdmin) {
    // Redirect to admin dashboard if admin is authenticated
    return isAuthenticated && userRole === 'admin' ? <Navigate to="/admin" /> : <Outlet />;
  } else {
    // Redirect to home if user is authenticated
    return isAuthenticated && userRole === 'user' ? <Navigate to="/" /> : <Outlet />;
  }
};

// Define prop types
AuthRoute.propTypes = {
  forAdmin: PropTypes.bool.isRequired,
};

export default AuthRoute;