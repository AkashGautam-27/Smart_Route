import api from "../lib/axios";
import { setToken, removeToken } from "../lib/auth";

export const authService = {
  login: async (credentials: any) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const data = response.data;

      if (data.success && data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: "Login failed" };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      return error.response?.data || { success: false, message: "Failed to get user" };
    }
  },

  logout: () => {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};
