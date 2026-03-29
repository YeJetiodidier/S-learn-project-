import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/registerpage";
import Dashboard from "./pages/dashboard";
import Login from "./components/login";
import Schedule from "./components/schedule";
import Explore from "./pages/explore";
import Subjects from "./pages/Subjects";

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/subjects/*" element={<Subjects />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
