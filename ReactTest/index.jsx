import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster richColors position="top-center" />
    <AppRouter />
  </React.StrictMode>
);
