import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Schedule() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [schedule, setSchedule] = useState([]);

  // Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("schedule"));
    if (saved) setSchedule(saved);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);

  const addTask = () => {
    if (subject && time && day) {
      setSchedule([
        ...schedule,
        { subject, time, day, done: false }
      ]);
      setSubject("");
      setTime("");
      setDay("");
    }
  };

  const deleteTask = (index) => {
    const newList = schedule.filter((_, i) => i !== index);
    setSchedule(newList);
  };

  const toggleDone = (index) => {
    const updated = [...schedule];
    updated[index].done = !updated[index].done;
    setSchedule(updated);
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">S-Learn</h2>
        <ul>
          <li onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>🏠 Dashboard</li>
          <li style={{ opacity: 1, fontWeight: "bold" }}>📅 Schedule</li>
          <li style={{ cursor: "pointer" }}>📚 Subjects</li>
          <li onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>🚪 Logout</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        <h2 className="page-title">My Study Schedule</h2>

        {/* INPUT */}
        <div className="schedule-input">

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            type="text"
            placeholder="Day (e.g Monday)"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button onClick={addTask}>Add</button>

        </div>

        {/* LIST */}
        <div className="schedule-list">

          {schedule.map((item, index) => (
            <div key={index} className={`schedule-card ${item.done ? "done" : ""}`}>

              <h3>{item.subject}</h3>
              <p>{item.day}</p>
              <p>{item.time}</p>

              <div className="actions">
                <button onClick={() => toggleDone(index)}>✔</button>
                <button onClick={() => deleteTask(index)}>🗑</button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Schedule;