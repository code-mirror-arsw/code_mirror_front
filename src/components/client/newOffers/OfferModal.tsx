
interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function OfferModal({ visible, onClose }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-card-dark text-gray-900 dark:text-light p-6 rounded-xl max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">¿Te quieres postular?</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          Recuerda que debes subir tu hoja de vida. Esta será calificada y se te avisará si puedes aplicar a este trabajo.
        </p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
