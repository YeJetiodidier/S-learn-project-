import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
import "../App.css";

const TABS = [
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "appearance", icon: "🎨", label: "Appearance" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "privacy", icon: "🔒", label: "Privacy" },
  { id: "account", icon: "⚙️", label: "Account" },
];

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    username: "S-Learn", role: "Student", avatar_url: "", bio: "", level: "", specialty: "",
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: "light", accentColor: "#8b5cf6", fontSize: "medium", compactMode: false,
  });

  // Notifications state
  const [notifs, setNotifs] = useState({
    scheduleReminders: true, newPapers: true, videoUploads: false, weeklyReport: true, emailDigest: false,
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisible: true, activityVisible: false, shareStats: true,
  });

  // Load all settings from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/profile")
      .then(r => r.json())
      .then(d => { if (d && !d.error) setProfile(prev => ({ ...prev, ...d })); })
      .catch(() => {});

    fetch("http://localhost:5000/api/settings")
      .then(r => r.json())
      .then(d => {
        if (!d || d.error) return;
        setAppearance({
          theme: d.theme || "light",
          accentColor: d.accent_color || "#8b5cf6",
          fontSize: d.font_size || "medium",
          compactMode: d.compact_mode ?? false,
        });
        setNotifs({
          scheduleReminders: d.notif_schedule_reminders ?? true,
          newPapers: d.notif_new_papers ?? true,
          videoUploads: d.notif_video_uploads ?? false,
          weeklyReport: d.notif_weekly_report ?? true,
          emailDigest: d.notif_email_digest ?? false,
        });
        setPrivacy({
          profileVisible: d.privacy_profile_visible ?? true,
          activityVisible: d.privacy_activity_visible ?? false,
          shareStats: d.privacy_share_stats ?? true,
        });
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    try {
      await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
    } catch {}
    flash();
  };

  const saveAppearance = async () => {
    try {
      await fetch("http://localhost:5000/api/settings/appearance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: appearance.theme,
          accent_color: appearance.accentColor,
          font_size: appearance.fontSize,
          compact_mode: appearance.compactMode,
        })
      });
    } catch {}
    flash();
  };

  const saveNotifications = async () => {
    try {
      await fetch("http://localhost:5000/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifs)
      });
    } catch {}
    flash();
  };

  const savePrivacy = async () => {
    try {
      await fetch("http://localhost:5000/api/settings/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy)
      });
    } catch {}
    flash();
  };

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="db-layout">
      <Sidebar />

      <main className="db-main">

        {/* HERO */}
        <section className="cfg-hero">
          <h1 className="cfg-title">⚙️ Settings</h1>
          <p className="cfg-sub">Manage your account, preferences, and privacy.</p>
          {saved && <div className="cfg-saved-toast">✅ Changes saved successfully!</div>}
        </section>

        <div className="cfg-layout">

          {/* TAB SIDEBAR */}
          <nav className="cfg-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`cfg-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          {/* PANEL */}
          <div className="cfg-panel">

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <section className="cfg-section">
                <h2 className="cfg-section-title">Profile Information</h2>
                <p className="cfg-section-desc">Update your display name, role, and avatar that appear on your dashboard.</p>

                <div className="cfg-avatar-row">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="cfg-avatar-img" />
                  ) : (
                    <div className="cfg-avatar-placeholder">🧑‍🎓</div>
                  )}
                  <div>
                    <p className="cfg-avatar-name">{profile.username}</p>
                    <p className="cfg-avatar-role">{profile.role}</p>
                  </div>
                </div>

                <div className="cfg-form">
                  <div className="cfg-field">
                    <label>Display Name</label>
                    <input type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} placeholder="Your name" />
                  </div>
                  <div className="cfg-field">
                    <label>Role / Title</label>
                    <input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} placeholder="e.g. Student, Teacher" />
                  </div>
                  <div className="cfg-field">
                    <label>Avatar Image URL</label>
                    <input type="text" value={profile.avatar_url} onChange={e => setProfile({...profile, avatar_url: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="cfg-field">
                    <label>Academic Level</label>
                    <select value={profile.level} onChange={e => setProfile({...profile, level: e.target.value})}>
                      <option value="">Not set</option>
                      <option>Ordinary Level</option>
                      <option>Advanced Level</option>
                      <option>Technical Level</option>
                      <option>Commercial Level</option>
                    </select>
                  </div>
                  <div className="cfg-field">
                    <label>Specialty</label>
                    <select value={profile.specialty} onChange={e => setProfile({...profile, specialty: e.target.value})}>
                      <option value="">Not set</option>
                      <option>Science</option>
                      <option>Arts</option>
                      <option>Commercial</option>
                      <option>Technical</option>
                    </select>
                  </div>
                  <div className="cfg-field" style={{gridColumn: "1/-1"}}>
                    <label>Bio</label>
                    <textarea rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="A short description about yourself..." />
                  </div>
                </div>
                <button className="cfg-save-btn" onClick={saveProfile}>Save Changes</button>
              </section>
            )}

            {/* ── APPEARANCE ── */}
            {activeTab === "appearance" && (
              <section className="cfg-section">
                <h2 className="cfg-section-title">Appearance</h2>
                <p className="cfg-section-desc">Customize how S-Learn looks and feels for you.</p>

                <div className="cfg-form">
                  <div className="cfg-field" style={{gridColumn: "1/-1"}}>
                    <label>Theme</label>
                    <div className="cfg-radio-group">
                      {["light", "dark", "system"].map(t => (
                        <button
                          key={t}
                          className={`cfg-radio-btn ${appearance.theme === t ? "active" : ""}`}
                          onClick={() => setAppearance({...appearance, theme: t})}
                        >
                          {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"} {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="cfg-field">
                    <label>Accent Color</label>
                    <div className="cfg-color-row">
                      {["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#ec4899"].map(c => (
                        <button
                          key={c}
                          className={`cfg-color-swatch ${appearance.accentColor === c ? "active" : ""}`}
                          style={{ background: c }}
                          onClick={() => setAppearance({...appearance, accentColor: c})}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="cfg-field">
                    <label>Font Size</label>
                    <select value={appearance.fontSize} onChange={e => setAppearance({...appearance, fontSize: e.target.value})}>
                      <option value="small">Small</option>
                      <option value="medium">Medium (Default)</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="cfg-field" style={{gridColumn: "1/-1"}}>
                    <label>Compact Mode</label>
                    <div className="cfg-toggle-row">
                      <span>Reduce spacing for a denser layout</span>
                      <button
                        className={`cfg-toggle ${appearance.compactMode ? "on" : ""}`}
                        onClick={() => setAppearance({...appearance, compactMode: !appearance.compactMode})}
                      >
                        <span className="cfg-toggle-knob" />
                      </button>
                    </div>
                  </div>
                </div>
                <button className="cfg-save-btn" onClick={saveAppearance}>Save Preferences</button>
              </section>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <section className="cfg-section">
                <h2 className="cfg-section-title">Notifications</h2>
                <p className="cfg-section-desc">Control which alerts and reminders you receive.</p>
                <div className="cfg-toggles-list">
                  {[
                    { key: "scheduleReminders", label: "Study Schedule Reminders", desc: "Get reminded when a study session is about to start" },
                    { key: "newPapers", label: "New Papers Added", desc: "Notify me when new past papers are uploaded to the database" },
                    { key: "videoUploads", label: "Science Lab Video Uploads", desc: "Alert when new practical videos are added" },
                    { key: "weeklyReport", label: "Weekly Progress Report", desc: "Receive a weekly summary of lessons completed and topics studied" },
                    { key: "emailDigest", label: "Email Digest", desc: "Get a weekly digest of all activity sent to your email" },
                  ].map(item => (
                    <div key={item.key} className="cfg-toggle-item">
                      <div className="cfg-toggle-info">
                        <p className="cfg-toggle-label">{item.label}</p>
                        <p className="cfg-toggle-desc">{item.desc}</p>
                      </div>
                      <button
                        className={`cfg-toggle ${notifs[item.key] ? "on" : ""}`}
                        onClick={() => setNotifs({...notifs, [item.key]: !notifs[item.key]})}
                      >
                        <span className="cfg-toggle-knob" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="cfg-save-btn" onClick={saveNotifications}>Save Preferences</button>
              </section>
            )}

            {/* ── PRIVACY ── */}
            {activeTab === "privacy" && (
              <section className="cfg-section">
                <h2 className="cfg-section-title">Privacy & Visibility</h2>
                <p className="cfg-section-desc">Control who can see your activity and profile information.</p>
                <div className="cfg-toggles-list">
                  {[
                    { key: "profileVisible", label: "Public Profile", desc: "Allow others to see your name and role" },
                    { key: "activityVisible", label: "Activity Status", desc: "Show when you are online or studying" },
                    { key: "shareStats", label: "Share Statistics", desc: "Allow your Lessons Completed and Topics Studied to be visible" },
                  ].map(item => (
                    <div key={item.key} className="cfg-toggle-item">
                      <div className="cfg-toggle-info">
                        <p className="cfg-toggle-label">{item.label}</p>
                        <p className="cfg-toggle-desc">{item.desc}</p>
                      </div>
                      <button
                        className={`cfg-toggle ${privacy[item.key] ? "on" : ""}`}
                        onClick={() => setPrivacy({...privacy, [item.key]: !privacy[item.key]})}
                      >
                        <span className="cfg-toggle-knob" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="cfg-save-btn" onClick={savePrivacy}>Save Preferences</button>
              </section>
            )}

            {/* ── ACCOUNT ── */}
            {activeTab === "account" && (
              <section className="cfg-section">
                <h2 className="cfg-section-title">Account Management</h2>
                <p className="cfg-section-desc">Manage your account security and data.</p>

                <div className="cfg-account-cards">
                  <div className="cfg-account-card">
                    <span className="cfg-account-icon">🔑</span>
                    <div>
                      <p className="cfg-account-label">Change Password</p>
                      <p className="cfg-account-sub">Update your login credentials</p>
                    </div>
                    <button className="cfg-outline-btn">Change</button>
                  </div>
                  <div className="cfg-account-card">
                    <span className="cfg-account-icon">📦</span>
                    <div>
                      <p className="cfg-account-label">Export My Data</p>
                      <p className="cfg-account-sub">Download all your schedule and study data</p>
                    </div>
                    <button className="cfg-outline-btn">Export</button>
                  </div>
                  <div className="cfg-account-card">
                    <span className="cfg-account-icon">🚪</span>
                    <div>
                      <p className="cfg-account-label">Sign Out</p>
                      <p className="cfg-account-sub">Log out of your current session</p>
                    </div>
                    <button className="cfg-outline-btn">Sign Out</button>
                  </div>
                  <div className="cfg-account-card danger">
                    <span className="cfg-account-icon">🗑️</span>
                    <div>
                      <p className="cfg-account-label">Delete Account</p>
                      <p className="cfg-account-sub">Permanently remove your account and all data</p>
                    </div>
                    <button className="cfg-danger-btn">Delete</button>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
