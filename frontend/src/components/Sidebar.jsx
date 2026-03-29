import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: "🏠", label: "Dashboard", action: () => navigate("/dashboard"), active: location.pathname === "/dashboard" },
    { icon: "🔍", label: "Explore", action: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: "📚", label: "Subjects", action: () => navigate("/subjects"), active: location.pathname.startsWith("/subjects") },
    { icon: "📅", label: "Schedule", action: () => navigate("/schedule"), active: location.pathname === "/schedule" },
    { icon: "⚙️", label: "Settings" },
    { icon: "🚪", label: "Log Out", action: () => navigate("/register") },
  ];

  return (
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
  );
};

export default Sidebar;
