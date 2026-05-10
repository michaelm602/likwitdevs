import { useEffect, useRef } from 'react';

const ANGLE_RAD = (43 * Math.PI) / 180;

function CanvasBeams() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const ctx = canvas.getContext('2d');

    const beamCount = isTouchDevice ? 4 : 10;
    let diagonal = 0;
    let resizeTimeout = null;

    function buildBeams(w) {
      return Array.from({ length: beamCount }, (_, i) => ({
        x: -w * 0.6 + (i / Math.max(beamCount - 1, 1)) * w * 1.2,
        phase: (i / beamCount) * Math.PI * 2,
        period: 3 + (i % 3) * 1.5,
        width: 50 + (i % 4) * 40,
        baseOpacity: 0.04 + (i % 3) * 0.02,
        gradient: null,
      }));
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      diagonal = Math.hypot(canvas.width, canvas.height);
    }
    resize();

    let beams = buildBeams(canvas.width);

    function draw(elapsed) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(ANGLE_RAD);

      for (const beam of beams) {
        if (!beam.gradient) {
          const g = ctx.createLinearGradient(
            beam.x - beam.width / 2, 0,
            beam.x + beam.width / 2, 0,
          );
          g.addColorStop(0, 'rgba(255,255,255,0)');
          g.addColorStop(0.5, 'rgba(255,255,255,1)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          beam.gradient = g;
        }

        const t =
          prefersReducedMotion || isTouchDevice
            ? 0
            : (elapsed / beam.period) * Math.PI * 2;
        const opacity =
          beam.baseOpacity * (0.2 + 0.8 * ((Math.sin(t + beam.phase) + 1) / 2));

        ctx.globalAlpha = opacity;
        ctx.fillStyle = beam.gradient;
        ctx.fillRect(beam.x - beam.width / 2, -diagonal, beam.width, diagonal * 2);
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function handleResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        beams = buildBeams(canvas.width);
        if (prefersReducedMotion || isTouchDevice) draw(0);
        resizeTimeout = null;
      }, 100);
    }
    window.addEventListener('resize', handleResize);

    if (prefersReducedMotion || isTouchDevice) {
      draw(0);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (resizeTimeout) clearTimeout(resizeTimeout);
      };
    }

    let rafId;
    let startTime = null;

    function animate(ts) {
      if (startTime === null) startTime = ts;
      draw((ts - startTime) / 1000);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -25,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}

export default function SiteBackground() {
  return (
    <>
      {/* Graphite base — fills all pages */}
      <div
        aria-hidden
        className="fixed inset-0 -z-30 pointer-events-none select-none"
        style={{ background: 'var(--bg)' }}
      />
      {/* Animated light beams — diagonal shafts at 43°, breathing opacity */}
      <CanvasBeams />
      {/* Hero ambient glow — very subtle, only visible at top of page */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20 pointer-events-none select-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 100%)',
        }}
      />
    </>
  );
}
