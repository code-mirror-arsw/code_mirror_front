import { useState } from 'react';
import Cookies from 'js-cookie';

interface Props {
  visible: boolean;
  onClose: () => void;
  offerId: string;
}

export default function OfferModal({ visible, onClose, offerId }: Props) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  if (!visible) return null;

  const handleApply = async () => {
    const intervieweeId = Cookies.get('id');
    if (!intervieweeId) {
      setError('No se encontró tu ID en las cookies.');
      return;
    }

    if (!confirm('¿Estás seguro de postularte a esta oferta?')) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `http://192.168.1.34:8080/services/be/offer-service/offers/${offerId}/participants?intervieweeId=${intervieweeId}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setApplied(true);
    } catch (err) {
      setError('Ocurrió un error al postularte. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-card-dark text-gray-900 dark:text-light p-6 rounded-xl max-w-md w-full shadow-lg">
        {applied ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">
              ¡Postulación enviada!
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              Te avisaremos cuando tu hoja de vida sea evaluada.
            </p>
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">
              ¿Te quieres postular?
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              Debes subir tu hoja de vida. Una vez calificada, te avisaremos si puedes aplicar.
            </p>

            {error && (
              <p className="text-center text-red-600 mt-4 text-sm">{error}</p>
            )}

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Enviando…' : 'Postularme'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
