import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './slices/authUserSlice';
import authAdminReducer from './slices/authAdminSlice';
import userDataReducer from './slices/userDataSlice';
import adminDataReducer from './slices/adminDataSlice'
const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    authAdmin: authAdminReducer,
    userData: userDataReducer,
    adminData: adminDataReducer,
  },
});

export default store;