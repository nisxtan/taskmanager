import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {
    id: null,
    username: null,
    email: null,
    isAdmin: false,
    permissions: [],
    role: null,
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log("🔍 setCredentials payload:", action.payload);
      const { token, id, username, email, isAdmin, permissions, role } =
        action.payload;

      state.token = token;
      state.user = {
        id,
        username,
        email,
        isAdmin: isAdmin || false,
        permissions: permissions || [],
        role: role || null,
      };
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = {
        id: null,
        username: null,
        email: null,
        isAdmin: false,
        permissions: [],
        role: null,
      };
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectPermissions = (state) => state.auth.user.permissions;
export const selectRole = (state) => state.auth.user.role;
