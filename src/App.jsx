// App.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteBackground from "./components/SiteBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.pathname, location.hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return (
    <>
      <SiteBackground />
      <Navbar />
      <ScrollToHash offset={100} />
      <main className="min-h-screen pb-safe">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
