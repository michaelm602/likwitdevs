import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import SiteBackground from "./components/SiteBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();
  const firstMount = useRef(true);

  // Hide the bar on the very first page load
  useEffect(() => { firstMount.current = false; }, []);

  return (
    <>
      <SiteBackground />
      <Navbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* Route-change progress bar */}
      {!firstMount.current && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="fixed left-0 top-0 z-[100] h-0.5 w-full pointer-events-none"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { duration: 0.35, ease: "easeInOut" } }}
            exit={{ scaleX: 0, transition: { duration: 0.20, ease: "easeInOut" } }}
            style={{
              transformOrigin: "0 50%",
              // pick ONE of these bg styles ↓
              background: "rgba(255,255,255,0.4)", // simple
              // background: "linear-gradient(90deg, rgba(255,255,255,.9), rgba(255,255,255,.3))", // gradient
              // boxShadow: "0 0 16px rgba(255,255,255,0.25)", // subtle glow (optional)
            }}
          />
        </AnimatePresence>
      )}

      <Footer />
    </>
  );
}
