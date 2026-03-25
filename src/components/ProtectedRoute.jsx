// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // wrong role → block access
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}