import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/auth",
    credentials: "include",
  }),
  endpoints: (build) => ({
    signup: build.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApi;

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/ai",
    credentials: "include",
  }),
  endpoints: (build) => ({
    sendMessage: build.mutation({
      query: (message) => ({
        url: "/chat",
        method: "POST",
        body: { message },
      }),
    }),
    getHistory: build.query({
      query: () => "/history",
    }),
  }),
});
export const { useSendMessageMutation, useGetHistoryQuery } = chatApi;
