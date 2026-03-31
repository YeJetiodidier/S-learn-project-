import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
import "../App.css";

function ScienceLab() {
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", subject: "", description: "", video_url: "" });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then(res => res.json())
      .then(data => setVideos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Could not load videos:", err));
  }, []);

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.video_url) {
      return alert("Please fill in at least a Title and Video URL!");
    }
    try {
      const res = await fetch("http://localhost:5000/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        const added = await res.json();
        setVideos([added, ...videos]);
        setIsModalOpen(false);
        setNewVideo({ title: "", subject: "", description: "", video_url: "" });
      } else {
        alert("Upload failed! Is the backend server running with DATABASE_URL set?");
      }
    } catch {
      alert("Network Error: Is the backend server running?");
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Support YouTube links
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url; // Return as-is for direct video file URLs
  };

  const filtered = filter
    ? videos.filter(v => v.subject?.toLowerCase().includes(filter.toLowerCase()))
    : videos;

  return (
    <div className="db-layout">
      <Sidebar />

      <main className="db-main">

        {/* HERO */}
        <section className="sl-hero">
          <div className="sl-hero-content">
            <h1 className="sl-hero-title">🔬 Science Lab</h1>
            <p className="sl-hero-sub">Watch practical demonstrations and upload new video papers for Chemistry & Physics</p>
          </div>
          <button className="ss-action-btn sl-upload-btn" onClick={() => setIsModalOpen(true)}>
            + Upload Video
          </button>
        </section>

        {/* FILTER BAR */}
        <div className="sl-filter-bar">
          <span className="sl-filter-label">Filter by subject</span>
          <div className="sl-filter-chips">
            {["", "Chemistry", "Physics", "Biology"].map(s => (
              <button
                key={s}
                className={`sl-chip ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* VIDEO GRID */}
        {filtered.length === 0 ? (
          <div className="sl-empty">
            <span className="sl-empty-icon">🎬</span>
            <h3>No videos yet!</h3>
            <p>Click the upload button to add your first practical video.</p>
          </div>
        ) : (
          <div className="sl-video-grid">
            {filtered.map((v) => (
              <div key={v.id} className="sl-video-card">
                <div className="sl-video-player">
                  {getEmbedUrl(v.video_url) ? (
                    v.video_url.includes("youtube") || v.video_url.includes("youtu.be") ? (
                      <iframe
                        src={getEmbedUrl(v.video_url)}
                        title={v.title}
                        allowFullScreen
                        frameBorder="0"
                        className="sl-iframe"
                      />
                    ) : (
                      <video src={v.video_url} controls className="sl-video-el" />
                    )
                  ) : (
                    <div className="sl-video-placeholder">📹</div>
                  )}
                </div>
                <div className="sl-video-info">
                  {v.subject && <span className="sl-tag">{v.subject}</span>}
                  <h3 className="sl-video-title">{v.title}</h3>
                  {v.description && <p className="sl-video-desc">{v.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="ss-modal-overlay">
          <div className="ss-modal">
            <h2>Upload Practical Video</h2>
            <p>Add a new lab video — YouTube links and direct video URLs are both supported.</p>
            <div className="ss-modal-grid">
              <input type="text" placeholder="Video Title *" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
              <input type="text" placeholder="Subject (e.g. Chemistry)" value={newVideo.subject} onChange={e => setNewVideo({...newVideo, subject: e.target.value})} />
              <input type="text" placeholder="Video URL or YouTube link *" value={newVideo.video_url} onChange={e => setNewVideo({...newVideo, video_url: e.target.value})} style={{gridColumn: "1/-1"}} />
              <textarea placeholder="Brief description (optional)" value={newVideo.description} onChange={e => setNewVideo({...newVideo, description: e.target.value})} style={{gridColumn: "1/-1", padding: "14px 18px", borderRadius: "12px", border: "2px solid #e2e8f0", background: "#f8fafc", fontSize: "1rem", resize: "vertical", minHeight: "80px", boxSizing: "border-box"}} />
            </div>
            <div className="ss-modal-actions">
              <button className="ss-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="ss-action-btn" onClick={handleAddVideo}>Upload Video</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScienceLab;
