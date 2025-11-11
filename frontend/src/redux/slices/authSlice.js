import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {
    id: null,
    username: null,
    email: null,
    isAdmin: false,
    permissions: [],
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // const { data } = action.payload;
      console.log(action.payload);
      const { token, id, username, email, isAdmin, permissions } =
        action.payload;
      state.token = token;
      state.user = {
        id,
        username,
        email,
        isAdmin: isAdmin || false,
        permissions: permissions || [],
      };
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
