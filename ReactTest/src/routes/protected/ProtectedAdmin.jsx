import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />; // belum login
  if (role !== "admin") return <Navigate to="/login" replace />; // bukan admin

  return children;
};

export default ProtectedAdmin;
