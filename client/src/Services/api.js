import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true
})

api.interceptors.response.use(
    (response)=>response,
    (error)=> {
      toast.error(error.response?.data?.message || 'Server error');
      return Promise.reject(error)
    }
)

api.interceptors.request.use(
    (config) => {
      const token = Cookies.get('user_token'); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    (error) => Promise.reject(error)
  );

  export default api