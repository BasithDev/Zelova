import { lazy } from 'react';
import { Route } from 'react-router-dom';

const NotFound = lazy(() => import('../Components/ErrorHandling/NotFound'));

const ErrorRoutes = [
    <Route key="admin-not-found" path="/admin/*" element={<NotFound isAdmin={true} />} />,
    <Route key="general-not-found" path="*" element={<NotFound isAdmin={false} />} />
];

export default ErrorRoutes;
