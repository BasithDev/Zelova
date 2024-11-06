// src/Components/AuthChecker.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserAuth, setAdminAuth, logoutAdmin , logoutUser } from '../Redux/slices/authSlice';

const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const userToken = Cookies.get('user_token');
        const adminToken = Cookies.get('admin_token');

        if (userToken) {
            dispatch(setUserAuth({ token: userToken }));
        } else {
            dispatch(logoutUser('user'));  // Clear user auth state if no user token
        }

        if (adminToken) {
            dispatch(setAdminAuth({ token: adminToken }));
        } else {
            dispatch(logoutAdmin('admin'));  // Clear admin auth state if no admin token
        }
    }, [dispatch]);

    return null;
};

export default AuthChecker;
