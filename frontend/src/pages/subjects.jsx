import React from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Levels = () => (
  <div className="subjects-container">
    <h1>Level</h1>
    <div className="grid-container">
      <Link to="advance" className="card">Advanced Level</Link>
      <Link to="ordinary" className="card">Ordinary Level</Link>
    </div>
  </div>
);

const Specialities = ({ level }) => {
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <div className="subjects-container">
      <h1>{displayLevel} Level - Specialities</h1>
      <div className="grid-container">
        <Link to="art" className="card">Arts</Link>
        <Link to="science" className="card">Science</Link>
        <Link to="technical" className="card">Technical</Link>
        <Link to="commercial" className="card">Commercial</Link>
      </div>
    </div>
  );
};

const Papers = ({ level, speciality }) => {
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const displaySpec = speciality.charAt(0).toUpperCase() + speciality.slice(1);
  return (
    <div className="subjects-container">
      <h1>{displayLevel} Level - {displaySpec}</h1>
      <div className="grid-container">
        <Link to="paper1" className="card">Paper 1</Link>
        <Link to="paper2" className="card">Paper 2</Link>
        {level === "advance" && <Link to="paper3" className="card">Paper 3</Link>}
      </div>
    </div>
  );
};

const SubjectList = ({ level, speciality, paper }) => {
  const displayLevel = level?.charAt(0).toUpperCase() + level?.slice(1);
  const displaySpec = speciality?.charAt(0).toUpperCase() + speciality?.slice(1);
  const displayPaper = paper ? paper.toUpperCase() : "";

  return (
    <div className="subjects-container">
      <h1>{displayLevel} {displaySpec} {displayPaper}</h1>
      <div className="upload-section">
        <p>You can upload papers directly from our database (DB to Backend)</p>
        <button className="upload-btn">View All Uploads</button>
      </div>
      <div className="subjects-list">
        <h3>Available Subjects (Click to Upload):</h3>
        <ul>
          {["Mathematics", "Physics", "Chemistry", "Biology", "Philosophy", "Literature", "Geography", "History"].map((subject) => (
            <li key={subject}>
              <a 
                href={`/api/upload?subject=${subject}&level=${level}&speciality=${speciality}&paper=${paper || ""}`}
                className="subject-link"
              >
                {subject}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DynamicRoute = () => {
  const { level, speciality, paper } = useParams();
  
  if (level && speciality && (speciality === "technical" || speciality === "commercial")) {
    return <SubjectList level={level} speciality={speciality} />;
  }
  
  if (level && speciality && paper) {
    return <SubjectList level={level} speciality={speciality} paper={paper} />;
  }
  
  if (level && speciality && (speciality === "art" || speciality === "science")) {
    return <Papers level={level} speciality={speciality} />;
  }
  
  if (level) {
    return <Specialities level={level} />;
  }
  
  return <Levels />;
};

const Subjects = () => {
  return (
    <div className="db-layout">
      <Sidebar />
      <main className="db-main">
        <div className="subjects-page">
          <nav className="subjects-nav">
            <Link to="/subjects">Subjects</Link> &gt; 
            <Routes>
              <Route path=":level" element={<BreadcrumbsLevel />} />
              <Route path=":level/:speciality" element={<BreadcrumbsSpec />} />
              <Route path=":level/:speciality/:paper" element={<BreadcrumbsPaper />} />
            </Routes>
          </nav>
          
          <Routes>
            <Route index element={<Levels />} />
            <Route path=":level" element={<DynamicRoute />} />
            <Route path=":level/:speciality" element={<DynamicRoute />} />
            <Route path=":level/:speciality/:paper" element={<DynamicRoute />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const BreadcrumbsLevel = () => {
  const { level } = useParams();
  return <Link to={`/subjects/${level}`}> {level}</Link>;
};

const BreadcrumbsSpec = () => {
  const { level, speciality } = useParams();
  return (
    <>
      <Link to={`/subjects/${level}`}> {level}</Link> &gt; 
      <Link to={`/subjects/${level}/${speciality}`}> {speciality}</Link>
    </>
  );
};

const BreadcrumbsPaper = () => {
  const { level, speciality, paper } = useParams();
  return (
    <>
      <Link to={`/subjects/${level}`}> {level}</Link> &gt; 
      <Link to={`/subjects/${level}/${speciality}`}> {speciality}</Link> &gt; 
      <Link to={`/subjects/${level}/${speciality}/${paper}`}> {paper}</Link>
    </>
  );
};

export default Subjects;
