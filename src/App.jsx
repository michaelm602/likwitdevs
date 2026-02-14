// App.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteBackground from "./components/SiteBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function ScrollToHash({ offset = 0 }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    // Wait a tick so layout is stable (especially on route changes)
    requestAnimationFrame(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  }, [location.pathname, location.hash, offset]);

  return null;
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // If we're navigating to a hash, let ScrollToHash handle it
    if (location.hash) return;

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  return (
    <>
      <SiteBackground />
      <Navbar />
      {/* Offset should match your navbar height (try 80–96 if needed) */}
      <ScrollToHash offset={96} />
      <main className="min-h-screen pb-safe">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
