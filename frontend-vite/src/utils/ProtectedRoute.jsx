import { Navigate, Outlet } from "react-router-dom";

const isTokenValid = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (!token) return { valid: false, hasToken: false };

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
    const isExpired = payload.exp * 1000 < Date.now();
    return { valid: !isExpired, hasToken: true };
  } catch (err) {
    return { valid: false, hasToken: true };
  }
};

export default function ProtectedRoute() {
  const tokenStatus = isTokenValid();
  
  // If no token existsredirect to landing page
  if (!tokenStatus.hasToken) {
    return <Navigate to="/" replace />;
  }
  
  // If token exists but is invalid/expired redirect to signin
  if (!tokenStatus.valid) {
    return <Navigate to="/signin" replace />;
  }
  
  // Token is valid render protected content
  return <Outlet />;
}
