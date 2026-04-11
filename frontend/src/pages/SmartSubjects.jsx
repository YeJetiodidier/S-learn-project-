import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
import "../App.css";

function SmartSubjects() {
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [paper, setPaper] = useState("");
  const [year, setYear] = useState("");

  const [allPapers, setAllPapers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPaper, setNewPaper] = useState({ level: '', specialty: '', subject: '', paperName: '', year: '', link: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch papers from PostgreSQL backend
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/api/papers")
      .then(res => res.json())
      .then(data => {
        setAllPapers(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Database connection missing or failed", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddPaper = async () => {
    if (!newPaper.level || !newPaper.subject || !newPaper.paperName || !newPaper.year) {
      return alert("Please fill all required fields!");
    }
    try {
      const res = await fetch("http://localhost:5000/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPaper)
      });
      if (res.ok) {
        const added = await res.json();
        setAllPapers([added, ...allPapers]);
        setIsModalOpen(false);
        setNewPaper({ level: '', specialty: '', subject: '', paperName: '', year: '', link: '' });
      } else {
        alert("Action failed! Make sure your backend node server is running.");
      }
    } catch(err) {
      alert("Network Error: Is the backend server running?");
    }
  };

  // Dynamic options
  const dynamicLevels = [...new Set(allPapers.map(p => p.level))].filter(Boolean);
  const dynamicSubjects = [...new Set(allPapers.filter(p => !level || p.level === level).map(p => p.subject))].filter(Boolean);
  const dynamicPapers = [...new Set(allPapers.filter(p => !subject || p.subject === subject).map(p => p.paper_name))].filter(Boolean);
  const dynamicYears = [...new Set(allPapers.filter(p => !paper || p.paper_name === paper).map(p => p.year))].filter(Boolean);

  // Results Filter
  const filteredPapers = allPapers.filter(p => {
    return (!level || p.level === level) &&
           (!subject || p.subject === subject) &&
           (!paper || p.paper_name === paper) &&
           (!year || p.year === year);
  });

  return (
    <div className="db-layout">
      <Sidebar />

      <main className="db-main">
        
        {/* TOPBAR / HEADER */}
        <div className="db-topbar">
          <div className="db-section-header" style={{ width: '100%' }}>
            <div>
              <h1 className="db-section-title" style={{ fontSize: '1.8rem', margin: 0 }}>Smart Subjects</h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Find and access your past papers from the database.</p>
            </div>
            <button 
              className="upload-btn" 
              style={{ width: 'auto', padding: '10px 24px', fontSize: '0.9rem' }}
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Paper
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS PANEL */}
        <section className="db-section">
          <div className="db-stat-card" style={{ 
            padding: '24px', 
            borderLeft: '4px solid #4f46e5',
            background: 'linear-gradient(to right, #ffffff, #f8faff)' 
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div className="db-profile-stat" style={{ alignItems: 'flex-start' }}>
                <label className="db-stat-label" style={{ marginBottom: '8px', fontWeight: '700' }}>Academic Level</label>
                <select className="db-search" style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '10px', width: '100%' }} value={level} onChange={(e) => { setLevel(e.target.value); setSubject(""); setPaper(""); setYear(""); }}>
                  <option value="">All Levels</option>
                  {dynamicLevels.sort().map((l, i) => <option key={i} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="db-profile-stat" style={{ alignItems: 'flex-start' }}>
                <label className="db-stat-label" style={{ marginBottom: '8px', fontWeight: '700' }}>Subject</label>
                <select className="db-search" style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '10px', width: '100%' }} value={subject} onChange={(e) => { setSubject(e.target.value); setPaper(""); setYear(""); }}>
                  <option value="">All Subjects</option>
                  {dynamicSubjects.sort().map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="db-profile-stat" style={{ alignItems: 'flex-start' }}>
                <label className="db-stat-label" style={{ marginBottom: '8px', fontWeight: '700' }}>Paper No.</label>
                <select className="db-search" style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '10px', width: '100%' }} value={paper} onChange={(e) => { setPaper(e.target.value); setYear(""); }}>
                  <option value="">All Papers</option>
                  {dynamicPapers.sort().map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="db-profile-stat" style={{ alignItems: 'flex-start' }}>
                <label className="db-stat-label" style={{ marginBottom: '8px', fontWeight: '700' }}>Year</label>
                <select className="db-search" style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '10px', width: '100%' }} value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">All Years</option>
                  {dynamicYears.sort((a,b) => b - a).map((y, i) => <option key={i} value={y}>{y}</option>)}
                </select>
              </div>

            </div>
          </div>
        </section>

        {/* RESULTS GRID */}
        <section className="db-section">
          <div className="db-section-header">
             <h2 className="db-section-title" style={{ color: '#4f46e5' }}>Database Results ({filteredPapers.length})</h2>
             {isLoading && <span className="db-stat-label">Updating from vault...</span>}
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
               <p>Searching for documents...</p>
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="db-subject-cards" style={{ flexWrap: 'wrap', gap: '24px' }}>
              {filteredPapers.map((p, i) => (
                <div 
                  key={i} 
                  className="db-subject-card" 
                  style={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  <div className="db-avatar" style={{ 
                    fontSize: '1.8rem', 
                    borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                    color: 'white',
                    width: '60px',
                    height: '60px'
                  }}>📄</div>
                  <div className="db-card-label" style={{ marginTop: '16px', flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#1e293b' }}>{p.subject}</h3>
                    <p style={{ color: '#64748b', fontWeight: '500' }}>{p.paper_name} • {p.year}</p>
                    <div style={{ 
                      marginTop: '8px', 
                      background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0)', 
                      padding: '4px 10px', 
                      borderRadius: '100px', 
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: '#475569',
                      display: 'inline-block'
                    }}>{p.level}</div>
                  </div>
                  
                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '16px' }}>
                    <button 
                      style={{ flex: 1, padding: '8px', fontSize: '0.8rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      onClick={() => p.link ? window.open(p.link, "_blank") : alert("No link")}
                    >
                      View
                    </button>
                    <a 
                      href={p.link} 
                      download 
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.8rem', 
                        background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', 
                        color: 'white', 
                        borderRadius: '8px', 
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Download 📥
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="db-stat-card" style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: '#64748b' }}>No papers found matching your filters.</p>
              <button 
                className="arrow-btn" 
                style={{ width: 'auto', margin: '20px auto 0', padding: '0 20px', borderRadius: '12px', fontSize: '0.85rem' }} 
                onClick={() => { setLevel(""); setSubject(""); setPaper(""); setYear(""); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

      </main>

      {/* MODAL SYSTEM (Styled to match the S-Learn vibe) */}
      {isModalOpen && (
        <div className="ss-modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000 }}>
          <div className="db-stat-card" style={{ padding: '32px', maxWidth: '500px', width: '90%', background: 'white', borderRadius: '24px' }}>
            <h2 className="db-section-title" style={{ marginBottom: '20px' }}>Submit New Paper</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <input type="text" className="db-search" style={{ border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '10px' }} placeholder="Academic Level" value={newPaper.level} onChange={e => setNewPaper({...newPaper, level: e.target.value})} />
              <input type="text" className="db-search" style={{ border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '10px' }} placeholder="Subject" value={newPaper.subject} onChange={e => setNewPaper({...newPaper, subject: e.target.value})} />
              <input type="text" className="db-search" style={{ border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '10px' }} placeholder="Paper Name (e.g. Paper 1)" value={newPaper.paperName} onChange={e => setNewPaper({...newPaper, paperName: e.target.value})} />
              <input type="text" className="db-search" style={{ border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '10px' }} placeholder="Year" value={newPaper.year} onChange={e => setNewPaper({...newPaper, year: e.target.value})} />
              <input type="text" className="db-search" style={{ border: '1.5px solid #e2e8f0', padding: '12px', borderRadius: '10px' }} placeholder="External URL Link" value={newPaper.link} onChange={e => setNewPaper({...newPaper, link: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="db-nav-item" style={{ flex: 1, color: '#64748b', textAlign: 'center', background: '#f1f5f9' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="upload-btn" style={{ flex: 1, padding: '12px' }} onClick={handleAddPaper}>Add Paper</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SmartSubjects;