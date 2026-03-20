import { useNavigate } from "react-router-dom";
import "../dashboard.css";
import "../App.css";

const subjectData = [
  {
    level: "Advanced Level",
    icon: "🎓",
    color: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    topics: ["Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History"],
  },
  {
    level: "Ordinary Level",
    icon: "📘",
    color: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    topics: ["English", "Maths", "Biology", "Physics", "History", "Religious Studies"],
  },
  {
    level: "Technical Level",
    icon: "🔧",
    color: "linear-gradient(135deg, #f59e0b, #ef4444)",
    topics: ["Electrical", "Mechanical", "Building", "Plumbing", "Civil Works"],
  },
  {
    level: "Commercial Level",
    icon: "💼",
    color: "linear-gradient(135deg, #10b981, #059669)",
    topics: ["Accounting", "Economics", "Commerce", "Business Studies"],
  },
];

function Subjects() {
  const navigate = useNavigate();

  const navItems = [
    { icon: "🏠", label: "Dashboard", action: () => navigate("/dashboard") },
    { icon: "🔍", label: "Explore", action: () => navigate("/explore") },
    { icon: "📚", label: "Subjects", active: true },
    { icon: "📅", label: "Schedule", action: () => navigate("/schedule") },
    { icon: "⚙️", label: "Settings" },
    { icon: "🚪", label: "Log Out", action: () => navigate("/register") },
  ];

  return (
    <div className="db-layout">

      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <span className="db-logo-icon">🔎</span>
          <span className="db-logo-text">S-Learn</span>
        </div>
        <nav className="db-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`db-nav-item ${item.active ? "active" : ""}`}
              onClick={item.action}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="db-main">
        <div className="db-topbar">
          <div className="db-search-wrap">
            <span className="search-icon">🔍</span>
            <input type="text" className="db-search" placeholder="Search subjects..." />
          </div>
          <div className="db-topbar-actions">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">👤</button>
          </div>
        </div>

        <div className="db-section">
          <div className="db-section-header">
            <h2 className="db-section-title">All Subjects by Level</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {subjectData.map((group) => (
              <div key={group.level} style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{
                    fontSize: "1.6rem", width: "48px", height: "48px",
                    background: group.color, borderRadius: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{group.icon}</span>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>{group.level}</h3>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {group.topics.map((topic) => (
                    <span key={topic} style={{
                      padding: "6px 16px", borderRadius: "30px", fontSize: "0.82rem",
                      fontWeight: 600, color: "white", background: group.color,
                      cursor: "pointer", transition: "opacity 0.2s"
                    }}
                      onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
                      onMouseOut={e => e.currentTarget.style.opacity = "1"}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="db-right">
        <div className="db-profile-card">
          <div className="db-avatar">📚</div>
          <h3 className="db-profile-name">My Subjects</h3>
          <p className="db-profile-sub">4 levels available</p>
          <div className="db-profile-stats">
            <div className="db-profile-stat">
              <span className="db-stat-val">4</span>
              <span className="db-stat-label">Levels</span>
            </div>
            <div className="db-profile-stat">
              <span className="db-stat-val">22</span>
              <span className="db-stat-label">Topics</span>
            </div>
          </div>
        </div>

        <div className="db-quickstart">
          <h3 className="db-qs-title">Quick Access</h3>
          {subjectData.map((g) => (
            <div key={g.level} className="db-qs-item">
              <span className="db-qs-icon">{g.icon}</span>
              <div>
                <p className="db-qs-label">{g.level}</p>
                <p className="db-qs-sub">{g.topics.length} topics</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}

export default Subjects;
