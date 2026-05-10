export default function SiteBackground() {
  return (
    <>
      {/* Graphite base — fills all pages */}
      <div
        aria-hidden
        className="fixed inset-0 -z-30 pointer-events-none select-none"
        style={{ background: 'var(--bg)' }}
      />
      {/* Hero ambient glow — very subtle, only visible at top of page */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.035) 0%, transparent 100%)',
        }}
      />
    </>
  );
}
