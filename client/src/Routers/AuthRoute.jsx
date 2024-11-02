import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ isAuthenticated, forAdmin }) => {
    if (forAdmin) {
        return isAuthenticated ? <Navigate to="/admin" /> : <Outlet />;
    } else {
        return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
    }
};

// Define prop types
AuthRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    forAdmin: PropTypes.bool.isRequired,
};

export default AuthRoute;
