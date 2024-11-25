import api from './api'
import cloudinaryInstance from './cloudnaryApi'

//authentication
export const loginUser = (data) => api.post('/auth/login',data)
export const registerUser = (data) => api.post('/auth/register',data)
export const verifyOTP = (data) => api.post('/auth/verify-otp',data)
export const resendOTP = (data) => api.post('/auth/resend-otp',data)
export const logout = (role) => api.post('/auth/logout', { role });

//for uploading image to cloudnairy
export const uploadToCloud = (data) => cloudinaryInstance.post(`/image/upload`,data)

//admin routes
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

//user routes
export const getUser = () => api.get(`/user`)
export const updateUser = (data) => api.put('/user/update-profile',data)
export const deleteUserImage = (data) => api.post('/user/delete-image',data)
export const submitVendorReq = (data) => api.post('/user/req-vendor',data)
export const addAddress = (data) => api.post('/user/address/new',data)
export const getAddresses = () => api.get('/user/addresses')
export const deleteAddress = (addressId) => api.delete(`/user/address/${addressId}/delete`)
export const getRestaurantsForUser = (lat,lon)=> api.get(`/user/nearby-restaurants?lat=${lat}&lon=${lon}`)
export const getMenuForUser = (id,lat,lon)=> api.get(`/user/${id}/menu?lat=${lat}&lon=${lon}`)
export const getFoodCategories = () => api.get('/user/food-categories')

//vendor routes - restaruant management
export const getRestaurant = () => api.get(`vendor/restaurant`)
export const updateRestaurantDetails = (data) => api.put(`vendor/restaurant/details`, data);
export const openOrCloseShop = (isActive) => api.patch(`vendor/restaurant/status`, { isActive });
export const updateRestaurantPic = (data) => api.patch(`vendor/restaurant/image`,data);
export const setLocation = (locationData) => api.patch(`vendor/restaurant/location`, locationData);

//vendor routes - products management
export const addProduct = (data) => api.post('vendor/product',data)
export const getProducts = () => api.get('/vendor/products')
export const listOrUnlistProduct = (id,isActive) => api.patch(`/vendor/product/${id}/list-or-unlist`,{isActive})
export const deleteProduct = (id) => api.delete(`/vendor/product/${id}/delete`)
export const updateProduct = (data) => api.put(`/vendor/product/update`,data)
export const updateProductOffer = (data) => api.patch(`/vendor/product/offer/update`,data)

//vendor routes - categories management
export const addCategory = (data) => api.post('vendor/category/add',data)
export const addSubCategory = (data) => api.post('vendor/subcategory/add',data)
export const getCategories = ()=> api.get('/vendor/categories')
export const getSubCategories = ()=> api.get('/vendor/subCategories')

//vendor routes - offers management
export const getOffers = ()=> api.get(`/vendor/offer/`)
export const addOffer = (data)=> api.post('/vendor/offer/add',data)
export const deleteOffer = (offerId) => api.delete(`/vendor/offer/delete/${offerId}`)