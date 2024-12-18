import axios from 'axios';

const cloudinaryInstance = axios.create({
  baseURL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`, 
  headers: {
    'Content-Type': 'multipart/form-data'
  },
});

export default cloudinaryInstance;