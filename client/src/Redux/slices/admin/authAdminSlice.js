import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const adminToken = Cookies.get('admin_token');

const authAdminSlice = createSlice({
  name: 'authAdmin',
  initialState: {
    adminId:null,
    isAuthenticated: !!adminToken,
    token: adminToken || null,
  },
  reducers: {
    setAdminAuth(state,action) {
      state.adminId = action.payload.adminId
      state.isAuthenticated = true;
    },
    logoutAdmin(state) {
      state.adminId = null
      state.isAuthenticated = false;
      Cookies.remove('admin_token');
    },
  },
});

export const { setAdminAuth, logoutAdmin } = authAdminSlice.actions;
export default authAdminSlice.reducer;