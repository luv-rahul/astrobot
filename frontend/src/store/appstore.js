import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi, chatApi, userApi } from "../api/api";

export const appStore = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(chatApi.middleware)
      .concat(authApi.middleware)
      .concat(userApi.middleware),
});

setupListeners(appStore.dispatch);
