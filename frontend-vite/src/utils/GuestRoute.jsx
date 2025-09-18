import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        // Token is valid -> redirect based on userType
        if (decoded.userType === "PWD") {
          return <Navigate to="/jobseeker/dashboard" replace />;
        } else if (decoded.userType === "Employer") {
          return <Navigate to="/employer/dashboard" replace />;
        }
      } else {
        // Token expired -> clear it
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("authToken");
    }
  }

  // No token -> allow access to Signin page
  return children;
}