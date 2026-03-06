import image from "./assets/image.png";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Hero from "./pages/hero/Hero";
import Auth from "./pages/auth/Auth";
import AstrobotPage from "./pages/ai/Astrobot";
import Chat from "./pages/ai/Chat";
import { Provider } from "react-redux";
import { appStore } from "./store/appstore";
import { ToastContainer } from "react-toastify";

const AppLayout = () => {
  return (
    <div
      className="text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9), #610303), url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Hero /> },
      { path: "/auth", element: <Auth /> },
      { path: "/ai", element: <AstrobotPage /> },
      { path: "/ai/chat", element: <Chat /> },
    ],
  },
]);

const App = () => {
  return (
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
};

export default App;
