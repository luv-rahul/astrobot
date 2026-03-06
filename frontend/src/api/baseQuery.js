import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000",
  credentials: "include",
});

let isLoggingOut = false;

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !isLoggingOut) {
    isLoggingOut = true;

    try {
      await fetch("http://localhost:4000/auth/logout", {
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
