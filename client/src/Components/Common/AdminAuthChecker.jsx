// src/Components/AuthChecker.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { setAdminAuth, logoutAdmin } from '../../Redux/slices/admin/authAdminSlice';

const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const adminToken = Cookies.get('admin_token');

        if (adminToken) {
            try {
                const decodedToken = jwtDecode(adminToken);
                const adminId = decodedToken.userId;
                dispatch(setAdminAuth({ adminId,token: adminToken }));
            } catch (error) {
                console.error("Failed to decode token:", error);
                dispatch(logoutAdmin());
            }
        } else {
            dispatch(logoutAdmin());
        }
    }, [dispatch]);

    return null;
};

export default AuthChecker;