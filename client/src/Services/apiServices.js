import api from './api'
import cloudinaryInstance from './cloudnaryApi'

export const loginUser = (data) => api.post('/auth/login',data)
export const registerUser = (data) => api.post('/auth/register',data)
export const verifyOTP = (data) => api.post('/auth/verify-otp',data)
export const resendOTP = (data) => api.post('/auth/resend-otp',data)
export const logout = (role) => api.post('/auth/logout', { role });

export const uploadToCloud = (data) => cloudinaryInstance.post(`/image/upload`,data)

export const getAdmin = (adminId) => api.get(`/admin/${adminId}`)
export const deleteImage = (data) => api.post('/admin/manage/delete-image',data)
export const fetchVendorRequests = () => api.get('/admin/manage/requests')
export const acceptVenodrRequests = (requestId) => api.post(`/admin/manage/accept-vendor/${requestId}`)
export const denyVenodrRequests = (applicationId) => api.post(`/admin/manage/deny-vendor/${applicationId}`)

export const getUser = (userId) => api.get(`/user/${userId}`)
export const updateUser = (data) => api.put('/user/update-profile',data)
export const deleteUserImage = (data) => api.post('/user/delete-image',data)
export const submitVendorReq = (data) => api.post('/user/req-vendor',data)