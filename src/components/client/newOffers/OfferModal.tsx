import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../../message/ErrorModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  offerId: string;
}

export default function OfferModal({ visible, onClose, offerId }: Props) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  if (!visible) return null;

  const handleApply = async () => {
    const intervieweeId = Cookies.get("id");
    const token = Cookies.get("accessToken");

    if (!intervieweeId) {
      setErrorMessage("No se encontró tu ID en las cookies.");
      setErrorOpen(true);
      return;
    }


    setLoading(true);
    try {
      const res = await fetch(
        `https://codemirrorback-f9hub9hxd4aecwfz.canadacentral-01.azurewebsites.net/services/be/offer-service/offers/${offerId}/participants?intervieweeId=${intervieweeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        setErrorMessage("Debes tener iniciada sesión.");
        setErrorOpen(true);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("userRole");
        Cookies.remove("userEmail");
        Cookies.remove("id");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      if (!res.ok) throw new Error();

      setApplied(true);
    } catch {
      setErrorMessage("Ocurrió un error al postularte. Inténtalo de nuevo.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-lightmode-card dark:bg-card-dark text-lightmode-text dark:text-light p-6 rounded-xl max-w-md w-full shadow-lg">
          {applied ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">¡Postulación enviada!</h2>
              <p className="text-sm text-center">Te avisaremos cuando tu hoja de vida sea evaluada.</p>
              <div className="flex justify-center mt-6">
                <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Cerrar</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">¿Te quieres postular?</h2>
              <p className="text-sm text-center">Debes subir tu hoja de vida. Una vez calificada, te avisaremos si puedes aplicar.</p>
              <div className="flex justify-center mt-6 gap-4">
                <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded" disabled={loading}>Cancelar</button>
                <button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" disabled={loading}>{loading ? "Enviando…" : "Postularme"}</button>
              </div>
            </>
          )}
        </div>
      </div>

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}
