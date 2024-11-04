import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    userRole: null, // 'user', 'admin'
    token: null,
  },
  reducers: {
    setUserAuth(state, action) {
      state.isAuthenticated = true;
      state.userRole = 'user';
      state.token = action.payload.token;
      Cookies.set('user_token', action.payload.token);
    },
    setAdminAuth(state, action) {
      state.isAuthenticated = true;
      state.userRole = 'admin';
      state.token = action.payload.token;
      Cookies.set('admin_token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      state.token = null;
      Cookies.remove('user_token');
      Cookies.remove('admin_token');
    },
  },
});

export const { setUserAuth, setAdminAuth, logout } = authSlice.actions;
export default authSlice.reducer;