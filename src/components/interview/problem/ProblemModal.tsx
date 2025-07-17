import React from "react";

interface ProblemModalProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export const ProblemModal: React.FC<ProblemModalProps> = ({ open, title, description, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 text-gray-900 dark:text-white relative">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <pre className="whitespace-pre-wrap">{description}</pre>
        <button
          className="absolute top-2 right-3 text-gray-600 dark:text-gray-200 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
