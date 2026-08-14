import { create } from "zustand";
import * as authApi from "../api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true, // Tracks hydration state

  // Login & Signup: save token to localStorage and update store
  login: async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem("token", data.token);
    set({ user: data, token: data.token, loading: false });
    return data;
  },

  signup: async (credentials) => {
    const { data } = await authApi.signup(credentials);
    localStorage.setItem("token", data.token);
    set({ user: data, token: data.token, loading: false });
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // Hydrate: run on app startup to validate existing token
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false });
      return;
    }
    
    try {
      const { data } = await authApi.getMe();
      set({ user: data, token, loading: false });
    } catch (error) {
      // If token is invalid/expired, clear it. 
      // (The axios interceptor might also trigger a redirect here on 401)
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
      console.error("Auth check failed:", error);
    }
  },
}));