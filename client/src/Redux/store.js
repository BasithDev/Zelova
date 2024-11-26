import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/user/authUserSlice';
import authAdminReducer from './slices/admin/authAdminSlice';
import userDataReducer from './slices/user/userDataSlice';
import adminDataReducer from './slices/admin/adminDataSlice'
import restaurantReducer from './slices/seller/restaurantDataSlice'
import userLocationReducer from './slices/user/userLocationSlice'
import cartReducer from './slices/user/cartSlice';

export const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    authAdmin: authAdminReducer,
    userData: userDataReducer,
    adminData: adminDataReducer,
    restaurantData: restaurantReducer,
    userLocation: userLocationReducer,
    cart: cartReducer,
  },
});

export default store;