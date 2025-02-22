import axios from 'axios';
import Cookies from 'js-cookie';

const appToken = import.meta.env.VITE_APP_SECRET;
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-App-Token': appToken,
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('user_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api