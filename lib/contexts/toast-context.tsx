"use client";

import React, { createContext, useContext } from "react";
import { toast as sonnerToast } from "sonner";

// Toast Context Interface
interface ToastContextType {
  addToast: (toast: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    duration?: number;
  }) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Add toast using Sonner
  const addToast = (toast: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    duration?: number;
  }) => {
    const { type, title, description, duration = 5000 } = toast;

    switch (type) {
      case "success":
        sonnerToast.success(title, {
          description,
          duration,
        });
        break;
      case "error":
        sonnerToast.error(title, {
          description,
          duration,
        });
        break;
      case "warning":
        sonnerToast.warning(title, {
          description,
          duration,
        });
        break;
      case "info":
        sonnerToast.info(title, {
          description,
          duration,
        });
        break;
    }
  };

  // Remove toast (Sonner handles this automatically)
  const removeToast = (id: string) => {
    sonnerToast.dismiss(id);
  };

  // Clear all toasts
  const clearAllToasts = () => {
    sonnerToast.dismiss();
  };

  const value: ToastContextType = {
    addToast,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

// Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast helper functions
export const toastHelpers = {
  success: (title: string, description?: string) => ({
    type: "success" as const,
    title,
    description,
  }),
  error: (title: string, description?: string) => ({
    type: "error" as const,
    title,
    description,
  }),
  warning: (title: string, description?: string) => ({
    type: "warning" as const,
    title,
    description,
  }),
  info: (title: string, description?: string) => ({
    type: "info" as const,
    title,
    description,
  }),
};
