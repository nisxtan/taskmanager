import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {
    id: null,
    username: null,
    email: null,
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, id, username, email } = action.payload;
      state.token = token;
      state.user = { id, username, email };
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = { id: null, username: null, email: null };
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

//selectors

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
