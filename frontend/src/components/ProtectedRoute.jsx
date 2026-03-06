import { Navigate } from "react-router-dom";

const getTokenFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

const ProtectedRoute = ({ children }) => {
  const storedToken = getTokenFromCookie();

  if (!storedToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
