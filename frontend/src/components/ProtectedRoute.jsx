import { Navigate } from "react-router-dom";

const getTokenFromCookie = () => {
  return document.cookie.includes("token=");
};

const ProtectedRoute = ({ children }) => {
  const storedToken = getTokenFromCookie();

  if (!storedToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
