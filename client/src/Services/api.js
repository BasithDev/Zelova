import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 (Unauthorized) or 403 (Forbidden)
            if (error.response.status === 401 || error.response.status === 403) {
                // Redirect to login page or show auth error
                window.location.href = '/login';
            }
        }
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