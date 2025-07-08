import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { decryptAESBase64Url, parseInterviewData } from "../../../util/crypto";
import InterviewLayout from "../../../components/interview/InterviewLayout";
import { ErrorModal } from "../../../components/message/ErrorModal";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();
  const data = query.get("data");

  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUrl = `${location.pathname}${location.search}`;

  useEffect(() => {
  if (!data) {
    setErrorMessage("Enlace inválido: falta parámetro de datos");
    setErrorOpen(true);
    return;
  }

  (async () => {
    try {
      const decrypted = await decryptAESBase64Url(data);
      const parsed = parseInterviewData(decrypted);

      const fechaISO = new Date(parsed.fecha);
      if (isNaN(fechaISO.getTime())) throw new Error("Formato de fecha inválido");
      if (fechaISO > new Date()) throw new Error("El enlace aún no está activo");

      const token = Cookies.get("accessToken");
      const userEmail = Cookies.get("userEmail");

      if (!token || !userEmail) {
        navigate(`/login?next=${encodeURIComponent(currentUrl)}`);
        return;
      }

      if (parsed.email.toLowerCase() !== userEmail.toLowerCase()) {
        throw new Error("Este enlace no le pertenece a este usuairo.");
      }

      const url = `http://localhost:8280/services/be/user-service/users/role/email/${parsed.email}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      if (res.status === 401) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("userRole");
        Cookies.remove("userEmail");
        Cookies.remove("id");
        navigate(`/login?next=${encodeURIComponent(currentUrl)}`);
        return;
      }

      if (!res.ok) throw new Error(`Error al validar rol (${res.status})`);

      let raw = await res.text();
      raw = raw.replace(/"/g, "").trim().toUpperCase();
      setIsAdmin(raw === "ADMIN");

      setEmail(parsed.email);
      setInterviewId(parsed.interviewId);
      setParticipants(parsed.participants || []);
      setValid(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Error procesando el enlace");
      setErrorOpen(true);
    }
  })();
}, [data, currentUrl, navigate]);


  if (!valid) {
    return <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />;
  }

  return (
    <InterviewLayout
      email={email}
      participants={participants}
      interviewId={interviewId}
      isAdmin={isAdmin}
    />
  );
}
