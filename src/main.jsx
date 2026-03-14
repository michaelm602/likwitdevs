import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminProjects from "./pages/AdminProjects";
import RequireAdmin from "./routes/RequireAdmin";
import FreeAudit from "./pages/FreeAudit";
import TapLanding from "./pages/TapLanding";
import Services from "./pages/Services";
import WebDesignPortland from "./pages/seo/WebDesignPortland";
import WebDesignSalons from "./pages/seo/WebDesignSalons";
import WebDesignRestaurants from "./pages/seo/WebDesignRestaurants";
import WebDesignHomeServices from "./pages/seo/WebDesignHomeServices";
import SmallBusinessWebDesign from "./pages/seo/SmallBusinessWebDesign";
import WebDesignTattooShops from "./pages/seo/WebDesignTattooShops";
import WebDesignTattooArtists from "./pages/seo/WebDesignTattooArtists";

function NotFound() {
  return <div style={{ padding: 24, color: "#fff" }}>Page not found.</div>;
}

// Use HashRouter ONLY on GitHub Pages
const isGitHubPages = window.location.hostname.includes("github.io");
const Router = isGitHubPages ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="web-design-portland" element={<WebDesignPortland />} />
          <Route path="web-design-for-salons" element={<WebDesignSalons />} />
          <Route path="web-design-for-restaurants" element={<WebDesignRestaurants />} />
          <Route path="web-design-for-home-services" element={<WebDesignHomeServices />} />
          <Route path="small-business-website-design" element={<SmallBusinessWebDesign />} />
          <Route path="web-design-for-tattoo-shops" element={<WebDesignTattooShops />} />
          <Route path="website-design-for-tattoo-artists" element={<WebDesignTattooArtists />} />
          <Route path="free-audit" element={<FreeAudit mode="qr" />} />
          <Route path="free-review" element={<FreeAudit mode="cta" />} />
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

        {/* Standalone — no Navbar/Footer/SiteBackground */}
        <Route path="tap" element={<TapLanding />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
