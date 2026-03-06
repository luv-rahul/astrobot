import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { appStore } from "./store/appstore";
import { ToastContainer } from "react-toastify";
import appRouter from "./routes/route";

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
