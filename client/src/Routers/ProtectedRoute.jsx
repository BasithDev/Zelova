import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, forAdmin }) => {
    if (forAdmin) {
        return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
    } else {
        return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
    }
};

// Define prop types
ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    forAdmin: PropTypes.bool.isRequired,
};

export default ProtectedRoute;