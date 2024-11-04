import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Initialize state based on cookies
const userToken = Cookies.get('user_token');
const adminToken = Cookies.get('admin_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      isAuthenticated: !!userToken,
      token: userToken || null,
    },
    admin: {
      isAuthenticated: !!adminToken,
      token: adminToken || null,
    },
    userRole: userToken ? 'user' : adminToken ? 'admin' : null,
  },
  reducers: {
    setUserAuth(state, action) {
      state.user.isAuthenticated = true;
      state.user.token = action.payload.token;
      state.userRole = 'user';
      Cookies.set('user_token', action.payload.token);
    },
    setAdminAuth(state, action) {
      state.admin.isAuthenticated = true;
      state.admin.token = action.payload.token;
      state.userRole = 'admin';
      Cookies.set('admin_token', action.payload.token);
    },
    logout(state) {
      state.user.isAuthenticated = false;
      state.user.token = null;
      state.admin.isAuthenticated = false;
      state.admin.token = null;
      state.userRole = null;
      Cookies.remove('user_token');
      Cookies.remove('admin_token');
    },
  },
});

export const { setUserAuth, setAdminAuth, logout } = authSlice.actions;
export default authSlice.reducer;