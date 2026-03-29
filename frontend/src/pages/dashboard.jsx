import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import "../dashboard.css";

const subjectCards = [
  {
    title: "Books & Library",
    desc: "Explore reading materials",
    img: "/books_card.png",
    gradient: "linear-gradient(135deg, #a8c8f8, #c8b8f8)",
  },
  {
    title: "Science Lab",
    desc: "Chemistry & Physics",
    img: "/science_card.png",
    gradient: "linear-gradient(135deg, #f8b8d8, #f8d8a8)",
  },
  {
    title: "Subjects",
    desc: "Papers & Specialities",
    img: "/books_card.png",
    gradient: "linear-gradient(135deg, #4f46e5, #ec4899)",
    action: "/subjects"
  },
  {
    title: "Schedule",
    desc: "Manage your timetable",
    img: "/schedule_card.png",
    gradient: "linear-gradient(135deg, #a8f0e8, #c8c8f8)",
    action: "/schedule"
  },
];

const quickStartItems = [
  { icon: "🎓", label: "Exam", sub: "Practice papers", action: "/subjects" },
  { icon: "✍️", label: "Writing", sub: "Essay techniques" },
  { icon: "📖", label: "Reading", sub: "Comprehension" },
];

const stats = [
  { label: "Lessons Completed", value: 24 },
  { label: "Topics Studied", value: 8 },
];

function StatChart() {
  const points = [
    [0, 70], [40, 40], [80, 60], [120, 30], [160, 55], [200, 25], [240, 50],
  ];
  const points2 = [
    [0, 85], [40, 55], [80, 75], [120, 45], [160, 70], [200, 40], [240, 65],
  ];
  const toPath = (pts) => pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  return (
    <svg viewBox="0 0 250 100" className="stat-chart" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${toPath(points)} L240,100 L0,100 Z`} fill="url(#g1)" />
      <path d={`${toPath(points)} `} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`${toPath(points2)} L240,100 L0,100 Z`} fill="url(#g2)" />
      <path d={`${toPath(points2)}`} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Tooltip dot */}
      <circle cx="120" cy="30" r="5" fill="#818cf8" />
      <rect x="95" y="10" width="58" height="20" rx="6" fill="#1e293b" />
      <text x="124" y="21" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">4.5 Points</text>
    </svg>
  );
}

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const level = location.state?.level || localStorage.getItem("level") || "S-Learn";
  const specialty = location.state?.specialty || localStorage.getItem("specialty") || "";

  const navItems = [
    { icon: "🏠", label: "Dashboard", action: () => navigate("/dashboard"), active: location.pathname === "/dashboard" },
    { icon: "🔍", label: "Explore", action: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: "📚", label: "Subjects", action: () => navigate("/subjects"), active: location.pathname.startsWith("/subjects") },
    { icon: "📅", label: "Schedule", action: () => navigate("/schedule"), active: location.pathname === "/schedule" },
    { icon: "⚙️", label: "Settings" },
    { icon: "🚪", label: "Log Out", action: () => navigate("/register") },
  ];

  return (
    <div className="db-layout">

      {/* ── SIDEBAR ── */}
      <Sidebar />

      {/* ── MAIN ── */}
      <main className="db-main">

        {/* TOP BAR */}
        <div className="db-topbar">
          <div className="db-nav-arrows">
            <button className="arrow-btn" onClick={() => navigate(-1)}>‹</button>
            <button className="arrow-btn" onClick={() => navigate(1)}>›</button>
          </div>
          <div className="db-search-wrap">
            <span className="search-icon">🔍</span>
            <input type="text" className="db-search" placeholder="Search subjects, topics..." />
          </div>
          <div className="db-topbar-actions">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">👤</button>
          </div>
        </div>

        {/* SUBJECT CARDS */}
        <section className="db-section">
          <div className="db-section-header">
            <h2 className="db-section-title">Subject Sets</h2>
            <div className="db-arrows">
              <button className="arrow-sm">‹</button>
              <button className="arrow-sm">›</button>
            </div>
          </div>

          <div className="db-subject-cards">
            {subjectCards.map((card) => (
              <div 
                key={card.title} 
                className="db-subject-card" 
                style={{ background: card.gradient, cursor: card.action ? "pointer" : "default" }}
                onClick={() => card.action && navigate(card.action)}
              >
                <img src={card.img} alt={card.title} className="db-card-img" />
                <div className="db-card-label">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
                <button className="db-card-heart" onClick={(e) => e.stopPropagation()}>♡</button>
              </div>
            ))}
          </div>
        </section>

        {/* STATISTICS */}
        <section className="db-section">
          <div className="db-section-header">
            <h2 className="db-section-title">Statistics</h2>
            <div className="db-stat-year">
              <button className="arrow-sm">‹</button>
              <span>2025</span>
              <button className="arrow-sm">›</button>
            </div>
          </div>

          <div className="db-stat-card">
            <StatChart />
          </div>
        </section>

      </main>

      {/* ── RIGHT PANEL ── */}
      <aside className="db-right">

        {/* PROFILE */}
        <div className="db-profile-card">
          <div className="db-avatar">🧑‍🎓</div>
          <h3 className="db-profile-name">{level}</h3>
          <p className="db-profile-sub">{specialty || "Student"}</p>
          <div className="db-profile-stats">
            {stats.map((s) => (
              <div key={s.label} className="db-profile-stat">
                <span className="db-stat-val">{s.value}</span>
                <span className="db-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK START */}
        <div className="db-quickstart">
          <h3 className="db-qs-title">Quick Start</h3>
          {quickStartItems.map((item) => (
            <div 
              key={item.label} 
              className="db-qs-item"
              style={{ cursor: item.action ? "pointer" : "default" }}
              onClick={() => item.action && navigate(item.action)}
            >
              <span className="db-qs-icon">{item.icon}</span>
              <div>
                <p className="db-qs-label">{item.label}</p>
                <p className="db-qs-sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </aside>

    </div>
  );
}

export default Dashboard;