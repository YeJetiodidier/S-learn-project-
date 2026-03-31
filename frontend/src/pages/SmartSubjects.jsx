import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../dashboard.css";
import "../App.css";

function SmartSubjects() {

  const [level, setLevel] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [subject, setSubject] = useState("");
  const [paper, setPaper] = useState("");
  const [year, setYear] = useState("");

  const [allPapers, setAllPapers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPaper, setNewPaper] = useState({ level: '', specialty: '', subject: '', paperName: '', year: '', link: '' });

  // Fetch papers from PostgreSQL backend
  useEffect(() => {
    fetch("http://localhost:5000/api/papers")
      .then(res => res.json())
      .then(data => setAllPapers(Array.isArray(data) ? data : []))
      .catch(err => console.error("Database connection missing or failed", err));
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
        alert("Action failed! Make sure your backend node server isn't missing the DATABASE_URL.");
      }
    } catch(err) {
      alert("Network Error: Is the backend server running?");
    }
  };

  // Derive dynamic options directly from the database response
  const dynamicLevels = [...new Set(allPapers.map(p => p.level))].filter(Boolean);
  const dynamicSpecialties = [...new Set(allPapers.filter(p => p.level === level).map(p => p.specialty))].filter(Boolean);
  const dynamicSubjects = [...new Set(allPapers.filter(p => p.level === level).map(p => p.subject))].filter(Boolean);
  const dynamicPapers = [...new Set(allPapers.filter(p => p.subject === subject).map(p => p.paper_name))].filter(Boolean);
  const dynamicYears = [...new Set(allPapers.filter(p => p.paper_name === paper).map(p => p.year))].filter(Boolean);

  const selectedPaperDoc = allPapers.find(p => p.paper_name === paper && p.year === year && p.subject === subject);

  return (
    <div className="db-layout">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="db-main smart-subjects-main">
        
        <section className="db-section ss-hero">
          <h1 className="ss-title">Smart Subject Finder</h1>
          <p className="ss-subtitle">Find exact past papers from the database, or contribute by adding new ones!</p>
          <br/>
          <button className="ss-action-btn" style={{background: 'white', color: '#8b5cf6', margin: 'auto', display: 'block'}} onClick={() => setIsModalOpen(true)}>+ Upload New Paper</button>
        </section>

        <section className="db-section ss-filters-section">
          <div className="ss-glass-panel">
            <div className="ss-filters-grid">
              
              {/* LEVEL */}
              {dynamicLevels.length > 0 ? (
                <div className="ss-filter-group">
                  <label>Academic Level</label>
                  <select className="ss-select" onChange={(e) => { setLevel(e.target.value); setSpecialty(""); setSubject(""); setPaper(""); setYear(""); }}>
                    <option value="">Choose Level</option>
                    {dynamicLevels.map((l, i) => <option key={i} value={l}>{l}</option>)}
                  </select>
                </div>
              ) : <p style={{color: "#64748b", margin: "auto", gridColumn: "1/-1", textAlign:"center"}}>No papers found in database! Click the button above to add one.</p>}

              {/* SPECIALTY */}
              {level && dynamicSpecialties.length > 0 && (
              <div className="ss-filter-group">
                <label>Specialty</label>
                <select className="ss-select" onChange={(e) => setSpecialty(e.target.value)}>
                  <option value="">Choose Specialty</option>
                  {dynamicSpecialties.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              )}

              {/* SUBJECT */}
              {level && dynamicSubjects.length > 0 && (
              <div className="ss-filter-group">
                <label>Subject</label>
                <select className="ss-select" onChange={(e) => { setSubject(e.target.value); setPaper(""); setYear(""); }}>
                  <option value="">Choose Subject</option>
                  {dynamicSubjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              )}

              {/* PAPER */}
              {subject && dynamicPapers.length > 0 && (
              <div className="ss-filter-group">
                <label>Paper</label>
                <select className="ss-select" onChange={(e) => { setPaper(e.target.value); setYear(""); }}>
                  <option value="">Choose Paper</option>
                  {dynamicPapers.map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>
              )}

              {/* YEAR */}
              {paper && dynamicYears.length > 0 && (
              <div className="ss-filter-group">
                <label>Year</label>
                <select className="ss-select" onChange={(e) => setYear(e.target.value)}>
                  <option value="">Choose Year</option>
                  {dynamicYears.map((y, i) => <option key={i} value={y}>{y}</option>)}
                </select>
              </div>
              )}

            </div>
          </div>
        </section>

        {/* RESULTS */}
        {selectedPaperDoc && (
          <section className="db-section ss-result-section">
            <div className="ss-result-card pulse-anim">
              <div className="ss-result-icon">📄</div>
              <div className="ss-result-info">
                <h3>{selectedPaperDoc.subject} - {selectedPaperDoc.paper_name}</h3>
                <p>{selectedPaperDoc.level} {selectedPaperDoc.specialty ? `· ${selectedPaperDoc.specialty}` : ""}</p>
                <span className="ss-badge">Year {selectedPaperDoc.year}</span>
              </div>
              <button 
                 className="ss-action-btn"
                 onClick={() => selectedPaperDoc.link ? window.open(selectedPaperDoc.link, "_blank") : alert("No link attached to this paper")}
              >Open Paper</button>
            </div>
          </section>
        )}

      </main>

      {/* MODAL SYSTEM */}
      {isModalOpen && (
        <div className="ss-modal-overlay">
          <div className="ss-modal">
            <h2>Add New Paper to Database</h2>
            <p>Upload a new paper and it becomes instantly available for everyone.</p>

            <div className="ss-modal-grid">
              <input type="text" placeholder="Level (e.g. Advanced Level)" value={newPaper.level} onChange={e => setNewPaper({...newPaper, level: e.target.value})} />
              <input type="text" placeholder="Specialty (Optional, e.g. Science)" value={newPaper.specialty} onChange={e => setNewPaper({...newPaper, specialty: e.target.value})} />
              <input type="text" placeholder="Subject (e.g. Mathematics)" value={newPaper.subject} onChange={e => setNewPaper({...newPaper, subject: e.target.value})} />
              <input type="text" placeholder="Paper Name (e.g. Paper 1)" value={newPaper.paperName} onChange={e => setNewPaper({...newPaper, paperName: e.target.value})} />
              <input type="text" placeholder="Year (e.g. 2023)" value={newPaper.year} onChange={e => setNewPaper({...newPaper, year: e.target.value})} />
              <input type="text" placeholder="PDF Access Link URL" value={newPaper.link} onChange={e => setNewPaper({...newPaper, link: e.target.value})} />
            </div>

            <div className="ss-modal-actions">
              <button className="ss-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="ss-action-btn" onClick={handleAddPaper}>Add to Database</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SmartSubjects;