// src/Components/AuthChecker.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserAuth, setAdminAuth } from '../Redux/slices/authSlice';

const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const userToken = Cookies.get('user_token');
        const adminToken = Cookies.get('admin_token');
        console.log(adminToken)

        if (userToken) {
            dispatch(setUserAuth({ token: userToken }));
        } else if (adminToken) {
            dispatch(setAdminAuth({ token: adminToken }));
        }
    }, [dispatch]);

    return null;
};

export default AuthChecker;