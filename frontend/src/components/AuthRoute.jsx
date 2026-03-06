import { Navigate } from "react-router-dom";

const getTokenFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

const AuthRoute = ({ children }) => {
  const token = getTokenFromCookie();

  if (token) {
    return <Navigate to="/ai" replace />;
  }

  return children;
};

export default AuthRoute;
