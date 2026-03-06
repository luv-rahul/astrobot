import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
});

let isLoggingOut = false;

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !isLoggingOut) {
    isLoggingOut = true;

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      toast.error("Session expired. Please login again.");

      setTimeout(() => {
        window.location.href = "/auth";
      }, 1200);
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/auth";
    }
  }

  return result;
};
