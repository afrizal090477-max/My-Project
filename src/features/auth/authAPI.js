import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function untuk deteksi role dari email (temporary)
// Nanti bisa diganti dengan decode JWT dari backend
const getRoleFromEmail = (email) => {
  if (email.includes('admin')) {
    return 'admin';
  }
  return 'user';
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        {
          email: username,
          password: password
        }
      );
      
      if (data?.access_token) {
        // Deteksi role dari email
        const role = getRoleFromEmail(username);
        
        // Simpan ke localStorage
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify({ username, email: username, role }));
        
        return {
          token: data.access_token,
          user: { 
            username,
            email: username,
            role: role  // TAMBAHAN: field role
          }
        };
      }
      return rejectWithValue("Login failed: token not found");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      return rejectWithValue(message);
    }
  }
);
