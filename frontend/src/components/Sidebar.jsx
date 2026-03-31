import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: "🏠", label: "Dashboard", action: () => navigate("/dashboard"), active: location.pathname === "/dashboard" },
    { icon: "📚", label: "Smart Subjects", action: () => navigate("/smartsubjects"), active: location.pathname.startsWith("/smartsubjects") },
    { icon: "🔬", label: "Science Lab", action: () => navigate("/sciencelab"), active: location.pathname === "/sciencelab" },
    { icon: "📅", label: "Schedule", action: () => navigate("/schedule"), active: location.pathname === "/schedule" },
    { icon: "⚙️", label: "Settings", action: () => navigate("/settings"), active: location.pathname === "/settings" },
    { icon: "🚪", label: "Log Out", action: () => navigate("/register") },
  ];

  return (
    <aside className="db-sidebar">
      <div className="db-logo">
        <img src="/slearn_logo.png" alt="S-Learn Logo" className="db-logo-img" />
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
