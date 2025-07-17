import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/login/LoginPage";
import InterviewPage from "./pages/admin/interview/InterviewPage";
import LandingPage from "./pages/Landing/LandingPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AppNavbar from "./components/navigation/AppNavbar";
import CreateOfferPage from "./pages/admin/offer/CreateOfferPage";
import OffersPage from "./pages/admin/offer/OffersPage";
import OffersPageClient from "./pages/client/OffersPage";
import NewOffers from "./pages/client/NewOffers";
import ProfilePage from "./pages/perfil/ProfilePage";
import ScheduleInterview from "./pages/admin/programedInterview/ScheduleInterview";
import VerifyOtpPage from "./pages/codeVerification/VerifyOtpPage";
import "./editor/quillModules";  
import Result from "./pages/client/Result";
import ResultAdmin from "./pages/admin/ResultAdmin";

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/room";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {!hideNavbar && <AppNavbar />}
      <Routes>
        <Route path="/verificacion" element={<VerifyOtpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/room" element={<InterviewPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/crear-oferta" element={<CreateOfferPage />} />
        <Route path="/ofertas-creadas" element={<OffersPage />} />
        <Route path="/mis-ofertas" element={<OffersPageClient />} />
        <Route path="/ofertas-nuevas" element={<NewOffers />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/entrevistas" element={<ScheduleInterview />} />
        <Route path="/resultados" element={<Result />} />
        <Route path="/resultadoAdmin" element={<ResultAdmin />} />

      </Routes>
    </>
  );
}

export default App;
