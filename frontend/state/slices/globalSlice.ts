import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const initialToken = getInitialToken();

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  currentUser: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    setTokens: (
      state,
      action: PayloadAction<{ token: string }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (action.payload) {
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setIsDarkMode,
  setCredentials,
  setTokens,
  setCurrentUser,
  logout,
} = globalSlice.actions;

export default globalSlice.reducer;
