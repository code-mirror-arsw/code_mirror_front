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

      </Routes>
    </>
  );
}

export default App;
