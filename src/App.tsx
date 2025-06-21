import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/login/LoginPage";
import InterviewPage from "./pages/interview/InterviewPage";
import LandingPage from "./pages/Landing/LandingPage";
import RegisterPage from "./pages/Register/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/room" element={<InterviewPage />} />
      <Route path="/" element={<LandingPage/>} />
    </Routes>
  );
}

export default App;
