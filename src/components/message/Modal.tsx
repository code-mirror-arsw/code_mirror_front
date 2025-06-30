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

  const colorStyles =
    color === "success"
      ? "bg-green-100 text-green-800 border-green-400"
      : "bg-red-100 text-red-800 border-red-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className={`max-w-md w-full p-6 rounded-lg border shadow-lg ${colorStyles}`}>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className="bg-white text-sm px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
