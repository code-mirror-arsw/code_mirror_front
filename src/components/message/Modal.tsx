import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  color: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, message, color }) => {
  if (!open) return null;

  const border =
    color === "success"
      ? "border-l-4 border-green-500"
      : "border-l-4 border-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`max-w-md w-full p-6 rounded-xl shadow-lg bg-lightmode-card dark:bg-card-dark text-lightmode-text dark:text-light ${border}`}
      >
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          {title}
        </h2>

        <p className="mb-6 leading-relaxed">{message}</p>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
