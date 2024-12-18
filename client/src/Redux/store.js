import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/user/authUserSlice';
import authAdminReducer from './slices/admin/authAdminSlice';
import userDataReducer from './slices/user/userDataSlice';
import adminDataReducer from './slices/admin/adminDataSlice'
import restaurantReducer from './slices/seller/restaurantDataSlice'
import userLocationReducer from './slices/user/userLocationSlice'
import orderReducer from './slices/orderSlice'

export const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    authAdmin: authAdminReducer,
    userData: userDataReducer,
    adminData: adminDataReducer,
    restaurantData: restaurantReducer,
    userLocation: userLocationReducer,
    order: orderReducer,
  },
});

export default store;