import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedUser = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role !== "pelanggan") return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedUser;
