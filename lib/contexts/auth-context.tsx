"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { apiMethods } from "@/lib/api-client";

// Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_CLEAR_ERROR" };

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "AUTH_CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Auth Context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 Auth context: Initializing auth...");
        dispatch({ type: "AUTH_START" });

        // Check for stored token in cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1];

        if (!token) {
          console.log("❌ Auth context: No token found");
          dispatch({ type: "AUTH_FAILURE", payload: "No token found" });
          return;
        }

        console.log("🍪 Auth context: Token found, verifying...");

        // Verify token and get user data using axios
        const user = await apiMethods.auth.getProfile();
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch (error) {
        console.error("❌ Auth context: Init auth failed:", error);
        dispatch({ type: "AUTH_FAILURE", payload: "Authentication failed" });
        // Clear cookie
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    };

    initAuth();
  }, []);

  // Login function using axios
  const login = async (username: string, password: string, role?: string) => {
    try {
      dispatch({ type: "AUTH_START" });

      // Use axios through apiMethods
      const data = await apiMethods.auth.login({ username, password, role });

      // Store token in cookie
      document.cookie = `auth_token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;

      // Update auth state
      dispatch({ type: "AUTH_SUCCESS", payload: data.user });
    } catch (error) {
      console.error("❌ Auth context: Login failed:", error);
      dispatch({
        type: "AUTH_FAILURE",
        payload: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  };

  // Logout function using axios
  const logout = async () => {
    try {
      // Call logout API using axios
      await apiMethods.auth.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear cookie and state
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "AUTH_CLEAR_ERROR" });
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) return;

      // Use axios through apiMethods
      const user = await apiMethods.auth.getProfile();
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const Wrapped: React.FC<P> = (props: P) => {
    const { state } = useAuth();

    if (state.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!state.isAuthenticated) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }

    return <Component {...props} />;
  };
  Wrapped.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;
  return Wrapped;
};
