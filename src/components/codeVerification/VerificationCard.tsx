import React, { ReactNode } from "react";
import logo from "../../components/auth/login/logo.png";

interface VerificationCardProps {
  children: ReactNode;
}

const VerificationCard: React.FC<VerificationCardProps> = ({ children }) => {
  return (
    <div className="w-full max-w-lg p-10 rounded-3xl shadow-2xl bg-lightmode-card dark:bg-card
                    transition-colors duration-300 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          alt="Logo"
          className="h-20 w-20 object-cover rounded-full border-4 border-blue-500 shadow-lg"
        />
        <h2 className="mt-4 text-2xl font-bold text-center text-gray-800 dark:text-white">
          ¡Estás a un paso de unirte a <span className="text-blue-600">CodeMirror</span>!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Ingresa el código que enviamos a tu correo
        </p>
      </div>

      {children}
    </div>
  );
};

export default VerificationCard;
