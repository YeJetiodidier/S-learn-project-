import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/dashboard";
import Login from "./components/login";
import Schedule from "./components/schedule";
import SmartSubjects from "./pages/SmartSubjects";
import ScienceLab from "./pages/ScienceLab";
import Settings from "./pages/Settings";
import LoadingScreen from "./pages/LoadingScreen";

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/smartsubjects" element={<SmartSubjects />} />
        <Route path="/sciencelab" element={<ScienceLab />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/loading" element={<LoadingScreen />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
