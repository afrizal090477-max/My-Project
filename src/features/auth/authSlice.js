import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authAPI";


const initialState = {
  token: null,
  user: null,
  role: null,  // TAMBAHAN: field role
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;  // TAMBAHAN: clear role
      state.error = null;
      
      // TAMBAHAN: Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    
    // TAMBAHAN: Action untuk restore session dari localStorage
    restoreSession: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      
      if (token && user && role) {
        state.token = token;
        state.user = JSON.parse(user);
        state.role = role;
      }
    },
    
    // TAMBAHAN: Action untuk clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.role = action.payload.user?.role || null;  // TAMBAHAN: set role
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.role = null;  // TAMBAHAN: clear role
        state.error = action.payload || action.error?.message || "Login failed";
      });
  },
});


export const { logout, restoreSession, clearError } = authSlice.actions;  // TAMBAHAN: export restoreSession & clearError
export default authSlice.reducer;
