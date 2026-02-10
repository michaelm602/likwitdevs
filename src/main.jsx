import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminProjects from "./pages/AdminProjects";
import RequireAdmin from "./routes/RequireAdmin";

function NotFound() {
  return <div style={{ padding: 24, color: "#fff" }}>Page not found.</div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <AdminProjects />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
