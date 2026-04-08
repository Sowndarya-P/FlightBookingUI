import React, { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaPlane, FaShieldAlt, FaBolt } from "react-icons/fa";

const Particle = ({ style }) => (
  <div className="absolute rounded-full bg-white/10 pointer-events-none" style={style} />
);

const Home = () => {
  const navigate = useNavigate();
  const planeRef = useRef(null);

  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;
    let pos = -120;
    let rafId;
    const animate = () => {
      pos += 0.35;
      if (pos > window.innerWidth + 120) pos = -120;
      plane.style.transform = `translateX(${pos}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Fixed: useMemo so particles don't regenerate (new random values) on every render
  const particles = useMemo(() =>
    Array.from({ length: 18 }, () => ({
      width: `${6 + Math.random() * 14}px`,
      height: `${6 + Math.random() * 14}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: 0.08 + Math.random() * 0.15,
      animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 4}s`,
    }))
  , []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{
      background: "linear-gradient(135deg, #020818 0%, #0a1628 30%, #0d2444 60%, #0a3060 100%)"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.6); opacity: 0.2; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .fade-up-1 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.3s; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.5s; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s ease forwards; animation-delay: 0.7s; opacity: 0; }
        .fade-in   { animation: fadeIn 1.2s ease forwards; animation-delay: 0.2s; opacity: 0; }

        .shimmer-text {
          background: linear-gradient(90deg, #ffffff 0%, #93c5fd 40%, #ffffff 60%, #bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .float-card { animation: floatY 5s ease-in-out infinite; }
        .float-card-2 { animation: floatY 6s ease-in-out infinite; animation-delay: 1s; }

        .cta-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(37,99,235,0.4); }
        .cta-btn:hover::before { opacity: 1; }
        .cta-btn span { position: relative; z-index: 1; }

        .stat-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px); transition: background 0.3s ease, border-color 0.3s ease;
        }
        .stat-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(99,179,255,0.3); }

        .feature-pill {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        .feature-pill:hover {
          background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.4);
          transform: translateY(-2px);
        }
        .horizon-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }
      `}</style>

      {/* Atmospheric particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => <Particle key={i} style={p} />)}
      </div>

      {/* Star grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      {/* Flying plane */}
      <div ref={planeRef} className="fixed pointer-events-none z-10" style={{ top: "18%", left: 0 }}>
        <FaPlane className="text-white/20 text-3xl" />
      </div>

      {/* HERO */}
      <main className="flex-grow flex items-center justify-center px-6 pt-28 pb-16 relative z-10">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <div className="fade-up-1 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping inline-block"></span>
              India's smartest flight search
            </div>

            <h1 className="fade-up-2 text-white leading-[1.05] mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900 }}>
              The World<br />
              <span className="shimmer-text">Awaits You.</span>
            </h1>

            <p className="fade-up-3 text-blue-200/70 mb-10 leading-relaxed max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", fontWeight: 300 }}>
              Compare fares across every major Indian carrier in seconds.
              Book in one click. Your e-ticket, instantly.
            </p>

            <div className="fade-up-3 flex flex-wrap gap-3 mb-10">
              {[
                { icon: <FaBolt className="text-yellow-400 text-xs" />, text: "Instant results" },
                { icon: <FaShieldAlt className="text-green-400 text-xs" />, text: "Secure booking" },
                { icon: <FaPlane className="text-blue-400 text-xs" />, text: "All major airlines" },
              ].map(({ icon, text }) => (
                <div key={text} className="feature-pill flex items-center gap-2 px-4 py-2 rounded-full text-white/70 text-sm cursor-default"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {icon} {text}
                </div>
              ))}
            </div>

            <div className="fade-up-4 flex items-center gap-4">
              <button onClick={() => navigate("/search")}
                className="cta-btn text-white font-semibold px-8 py-4 rounded-full flex items-center gap-3 text-base"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span>Search Flights</span>
                <span><FaArrowRight className="text-sm" /></span>
              </button>
            </div>
          </div>

          {/* RIGHT — Visual cards */}
          <div className="hidden lg:flex flex-col gap-5 items-end fade-in">
            <div className="float-card w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)"
            }}>
              <div className="relative h-44 overflow-hidden" style={{
                background: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 40%, #f97316 80%, #f59e0b 100%)"
              }}>
                <div className="absolute inset-0 flex items-center justify-around opacity-30">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-full" style={{
                      width: `${60 + i * 20}px`, height: "20px",
                      marginTop: `${i % 2 === 0 ? 30 : 60}px`, filter: "blur(8px)"
                    }} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16" style={{
                  background: "linear-gradient(to top, rgba(249,115,22,0.6), transparent)"
                }} />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-4xl drop-shadow-lg">✈</div>
                <div className="absolute top-3 right-3 bg-green-400/90 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                  LIVE FARES
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Popular Route</p>
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Chennai → Delhi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs line-through">₹6,500</p>
                    <p className="text-blue-300 font-black text-xl">₹4,800</p>
                  </div>
                </div>
                <div className="horizon-line my-4" />
                <div className="flex justify-between text-white/40 text-xs">
                  <span>06:30 · MAA</span>
                  <span className="text-white/20">——— 2h 40m ———</span>
                  <span>09:10 · DEL</span>
                </div>
              </div>
            </div>

            <div className="float-card-2 flex gap-4 w-full max-w-sm">
              {[
                { value: "4+", label: "Airlines" },
                { value: "12", label: "Cities" },
                { value: "∞", label: "Dates" },
              ].map(({ value, label }) => (
                <div key={label} className="stat-card flex-1 rounded-xl p-4 text-center">
                  <p className="text-white font-black text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
                  <p className="text-white/40 text-xs mt-1 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 px-6" style={{
        background: "linear-gradient(135deg, #020818 0%, #0a1628 30%, #0d2444 60%, #0a3060 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h2 className="text-white font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>About SkyEase</h2>
            <p className="text-white/60 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              SkyEase is a fast flight booking platform that helps you compare prices,
              search flights, and book tickets easily and quickly.
            </p>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Contact</h2>
            <p className="text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>📧 support@skyease.com</p>
            <p className="text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>📞 +91 9876543210</p>
            <p className="text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>📍 Chennai, India</p>
          </div>
          <div className="md:text-right">
            <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>SKYEASE</h2>
            <p className="text-white/50 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your trusted platform for easy and affordable flight booking.
            </p>
            <p className="text-white/40 text-xs mt-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              © 2026 SkyEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;