import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import Hero from "../pages/hero/Hero";
import Auth from "../pages/auth/Auth";
import AstrobotPage from "../pages/ai/Astrobot";
import Chat from "../pages/ai/Chat";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthRoute from "../components/AuthRoute";
import Profile from "../pages/dashboard/Profile";
import ErrorPage from "../components/ErrorPage";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Hero /> },
      {
        path: "/auth",
        element: (
          <AuthRoute>
            <Auth />
          </AuthRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ai",
        element: (
          <ProtectedRoute>
            <AstrobotPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ai/chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default appRouter;
