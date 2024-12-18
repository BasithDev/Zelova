import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderProtectedRoute = () => {
    const isAuthenticated = useSelector((state) => state.authUser.isAuthenticated);
    const hasCompletedOrder = useSelector((state) => state.order.hasCompletedOrder);

    if (!isAuthenticated || !hasCompletedOrder) {
        return <Navigate to="/" />; // Redirect to home or another appropriate page
    }

    return <Outlet />;
};

export default OrderProtectedRoute;
