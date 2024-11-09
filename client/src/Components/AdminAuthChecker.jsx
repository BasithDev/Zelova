// src/Components/AuthChecker.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { setAdminAuth, logoutAdmin } from '../Redux/slices/authAdminSlice';

const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const adminToken = Cookies.get('admin_token');

        if (adminToken) {
            try {
                const decodedToken = jwtDecode(adminToken);
                const adminId = decodedToken.userId; // assuming `userId` is in the token payload
                dispatch(setAdminAuth({ adminId,token: adminToken }));
            } catch (error) {
                console.error("Failed to decode token:", error);
                dispatch(logoutAdmin()); // Log out if decoding fails
            }
        } else {
            dispatch(logoutAdmin());  // Clear user auth state if no user token
        }
    }, [dispatch]);

    return null;
};

export default AuthChecker;