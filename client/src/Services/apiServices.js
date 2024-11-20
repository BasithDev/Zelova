import api from './api'
import cloudinaryInstance from './cloudnaryApi'

export const loginUser = (data) => api.post('/auth/login',data)
export const registerUser = (data) => api.post('/auth/register',data)
export const verifyOTP = (data) => api.post('/auth/verify-otp',data)
export const resendOTP = (data) => api.post('/auth/resend-otp',data)
export const logout = (role) => api.post('/auth/logout', { role });

export const uploadToCloud = (data) => cloudinaryInstance.post(`/image/upload`,data)

export const getAdmin = () => api.get(`/admin`)
export const deleteImage = (data) => api.post('/admin/manage/delete-image',data)
export const fetchVendorRequests = () => api.get('/admin/manage/requests')
export const acceptVenodrRequests = (requestId) => api.post(`/admin/manage/accept-vendor/${requestId}`)
export const denyVenodrRequests = (applicationId) => api.post(`/admin/manage/deny-vendor/${applicationId}`)
export const blockUnblockUser = (userId,status) => api.patch(`/admin/manage/block-unblock-user/${userId}`,status)
export const blockUnblockVendor = (vendorId,status) => api.patch(`/admin/manage/block-unblock-user/${vendorId}`,status)
export const getCategoriesToMng = ()=>api.get('/admin/manage/categories')
export const getSubCategoriesToMng = ()=>api.get('/admin/manage/subcategories')
export const deleteCategory = (id)=>api.delete(`/admin/manage/category/delete/${id}`)
export const deleteSubCategory = (id)=>api.delete(`/admin/manage/subcategory/delete/${id}`)

export const getUser = () => api.get(`/user`)
export const updateUser = (data) => api.put('/user/update-profile',data)
export const deleteUserImage = (data) => api.post('/user/delete-image',data)
export const submitVendorReq = (data) => api.post('/user/req-vendor',data)

export const getRestaurant = () => api.get(`vendor/restaurant`)
export const updateRestaurantDetails = (data) => api.put(`vendor/restaurant/details`, data);
export const openOrCloseShop = (isActive) => api.patch(`vendor/restaurant/status`, { isActive });
export const updateRestaurantPic = (data) => api.patch(`vendor/restaurant/image`,data);
export const setLocation = (locationData) => api.patch(`vendor/restaurant/location`, locationData);

export const addProduct = (data) => api.post('vendor/product',data)

export const addCategory = (data) => api.post('vendor/category/add',data)
export const addSubCategory = (data) => api.post('vendor/subcategory/add',data)
export const getCategories = ()=> api.get('/vendor/categories')
export const getSubCategories = ()=> api.get('/vendor/subCategories')

export const getOffers = ()=> api.get(`/vendor/offer/`)
export const addOffer = (data)=> api.post('/vendor/offer/add',data)
export const deleteOffer = (offerId) => api.delete(`/vendor/offer/delete/${offerId}`)