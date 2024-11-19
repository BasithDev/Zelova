import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const userToken = Cookies.get('user_token');
const isVendor = Cookies.get('is_vendor') === 'true';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    userId:null,
    isAuthenticated: !!userToken,
    isVendor: isVendor,
    status: null,
    role: isVendor ? 'vendor' : 'user',
  },
  reducers: {
    setUserAuth(state, action) {
      state.userId = action.payload.userId
      state.isAuthenticated = true;
      state.isVendor = action.payload.isVendor || false;
      state.status = action.payload.status
      Cookies.set('is_vendor', state.isVendor.toString());
    },
    logoutUser(state) {
      state.userId = null
      state.isAuthenticated = false;
      state.isVendor = false;
      state.status = null
      Cookies.remove('user_token');
      Cookies.remove('is_vendor');
    },
  },
});

export const { setUserAuth, logoutUser } = authUserSlice.actions;
export default authUserSlice.reducer;