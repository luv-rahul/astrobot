import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    signup: build.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApi;

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    sendMessage: build.mutation({
      query: (query) => ({
        url: "/ai/chat",
        method: "POST",
        body: { query },
      }),
    }),
    getHistory: build.query({
      query: () => "/ai/history",
    }),
  }),
});
export const { useSendMessageMutation, useGetHistoryQuery } = chatApi;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    updateProfile: build.mutation({
      query: (userData) => ({
        url: "/user/profile",
        method: "PATCH",
        body: userData,
      }),
    }),
    getProfile: build.query({
      query: () => "/user/profile",
    }),
  }),
});
export const { useUpdateProfileMutation, useGetProfileQuery } = userApi;
