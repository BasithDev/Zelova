// src/Components/AuthChecker.js
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Fixed incorrect import
import { useDispatch } from 'react-redux';
import { setUserAuth, logoutUser } from '../../Redux/slices/user/authUserSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Or your API handler

const AuthChecker = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = Cookies.get('user_token');
        const isVendor = Cookies.get('is_vendor') === 'true';

        if (userToken) {
            try {
                const decodedToken = jwtDecode(userToken);
                const userId = decodedToken.userId;

                // Fetch user status
                axios
                    .get(`/api/user/status/${userId}`)
                    .then((response) => {
                        const { status } = response.data;
                        if (status === 'blocked') {
                            Cookies.remove('user_token');
                            Cookies.remove('is_vendor');
                            dispatch(logoutUser());
                            navigate('/login');
                        } else {
                            dispatch(setUserAuth({ token: userToken, isVendor, userId }));
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to fetch user status:', error);
                        dispatch(logoutUser());
                        navigate('/login');
                    });
            } catch (error) {
                console.error('Failed to decode token:', error);
                dispatch(logoutUser());
                navigate('/login');
            }
        } else {
            dispatch(logoutUser());
        }
    }, [dispatch, navigate]);

    return null;
};

export default AuthChecker;