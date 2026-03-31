import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Show skeleton for 2.2s then go to dashboard
    const timer = setTimeout(() => navigate("/dashboard", { replace: true }), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="skel-root">

      {/* SIDEBAR SKELETON */}
      <aside className="skel-sidebar">
        <div className="skel-logo">
          <img src="/slearn_logo.png" alt="S-Learn" className="skel-logo-img" />
        </div>

        <nav className="skel-nav">
          {[100, 85, 90, 75, 80, 70].map((w, i) => (
            <div key={i} className="skel-nav-item">
              <div className="skel-block skel-round" style={{ width: 20, height: 20 }} />
              <div className="skel-block" style={{ width: `${w}%`, height: 14 }} />
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN SKELETON */}
      <main className="skel-main">

        {/* TOPBAR */}
        <div className="skel-topbar">
          <div className="skel-block" style={{ width: 280, height: 36, borderRadius: 30 }} />
          <div className="skel-block skel-round" style={{ width: 36, height: 36 }} />
          <div className="skel-block skel-round" style={{ width: 36, height: 36 }} />
        </div>

        {/* SUBJECT CARDS */}
        <div className="skel-section-title-wrap">
          <div className="skel-block" style={{ width: 130, height: 20 }} />
        </div>
        <div className="skel-cards">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skel-card">
              <div className="skel-block" style={{ width: 70, height: 70, borderRadius: 14 }} />
              <div className="skel-block" style={{ width: "80%", height: 14 }} />
              <div className="skel-block" style={{ width: "55%", height: 10 }} />
            </div>
          ))}
        </div>

        {/* STATISTICS */}
        <div className="skel-section-title-wrap">
          <div className="skel-block" style={{ width: 100, height: 20 }} />
        </div>
        <div className="skel-stat-card">
          <div className="skel-stat-lines">
            {[40, 60, 45, 75, 55, 80, 55].map((h, i) => (
              <div key={i} className="skel-stat-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

      </main>

      {/* RIGHT PANEL SKELETON */}
      <aside className="skel-right">
        <div className="skel-profile-card">
          <div className="skel-block skel-round" style={{ width: 70, height: 70 }} />
          <div className="skel-block" style={{ width: 100, height: 16 }} />
          <div className="skel-block" style={{ width: 70, height: 12 }} />
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            <div className="skel-stat-chip">
              <div className="skel-block" style={{ width: 32, height: 22 }} />
              <div className="skel-block" style={{ width: 50, height: 10 }} />
            </div>
            <div className="skel-stat-chip">
              <div className="skel-block" style={{ width: 32, height: 22 }} />
              <div className="skel-block" style={{ width: 50, height: 10 }} />
            </div>
          </div>
        </div>

        <div className="skel-quickstart-card">
          <div className="skel-block" style={{ width: 90, height: 16 }} />
          {[1, 2, 3].map(i => (
            <div key={i} className="skel-qs-item">
              <div className="skel-block skel-round" style={{ width: 40, height: 40 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="skel-block" style={{ height: 14 }} />
                <div className="skel-block" style={{ height: 10, width: "70%" }} />
              </div>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}

export default LoadingScreen;
