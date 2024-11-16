// src/Components/AuthChecker.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { setUserAuth, logoutUser } from '../Redux/slices/user/authUserSlice';

const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const userToken = Cookies.get('user_token');
        const isVendor = Cookies.get('is_vendor') === 'true';
        if (userToken) {
            try {
                const decodedToken = jwtDecode(userToken);
                const userId = decodedToken.userId;

                dispatch(setUserAuth({ token: userToken, isVendor, userId }));
            } catch (error) {
                console.error("Failed to decode token:", error);
                dispatch(logoutUser());
            }
        } else {
            dispatch(logoutUser());
        }
    }, [dispatch]);
    return null;
};
export default AuthChecker;