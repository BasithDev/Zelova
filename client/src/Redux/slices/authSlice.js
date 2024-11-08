import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const userToken = Cookies.get('user_token');
const adminToken = Cookies.get('admin_token');
const isVendor = Cookies.get('is_vendor') === true;
const userRole = userToken ? (isVendor ? 'vendor' : 'user') : null;
const adminRole = false

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      isAuthenticated: !!userToken,
      token: userToken || null,
      isVendor: isVendor,
    },
    admin: {
      isAuthenticated: !!adminToken,
      token: adminToken || null,
    },
    userRole: userRole,
    adminRole:adminRole
  },
  reducers: {
    setUserAuth(state, action) {
      state.user.isAuthenticated = true;
      state.user.token = action.payload.token;
      state.user.isVendor = action.payload.isVendor || false; 
      state.userRole = action.payload.isVendor ? 'vendor' : 'user';
      
      Cookies.set('user_token', action.payload.token);
      Cookies.set('is_vendor', action.payload.isVendor ? true : false);
    },
    setAdminAuth(state, action) {
      state.admin.isAuthenticated = true;
      state.admin.token = action.payload.token;
      state.adminRole = true
      Cookies.set('admin_token', action.payload.token);
    },
    logoutUser(state) {
      state.user.isAuthenticated = false;
      state.user.token = null;
      state.user.isVendor = false;
      state.userRole = null;
      Cookies.remove('is_vendor');
    },
    logoutAdmin(state) {
      state.admin.isAuthenticated = false;
      state.admin.token = null;
      state.adminRole = false;
    },
    setRole(state, action) {
      if (state.user.isAuthenticated) {
        state.userRole = action.payload.role;
        state.user.isVendor = action.payload.role === 'vendor';
        Cookies.set('is_vendor', state.user.isVendor ? true : false);
      }
    }
  },
});

export const { setUserAuth, setAdminAuth, logoutUser, logoutAdmin, setRole } = authSlice.actions;
export default authSlice.reducer;