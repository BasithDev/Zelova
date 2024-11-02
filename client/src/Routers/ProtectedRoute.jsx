import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated , forAdmin }) => {
    if (forAdmin) {
        return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;   
    }else{
        return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;   
    }
};

export default ProtectedRoute;