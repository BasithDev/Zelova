import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ isAuthenticated , forAdmin }) => {
    if (forAdmin) {
        return isAuthenticated ? <Navigate to="/admin" /> : <Outlet />;
    }else{
        return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
    }
};

export default AuthRoute;