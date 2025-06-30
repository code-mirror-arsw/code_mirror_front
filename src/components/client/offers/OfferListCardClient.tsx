import { ReactNode } from "react";
import logo from "../../auth/login/logo.png";

interface OfferCardProps {
  children: ReactNode;
}

export  const OfferListCardClient = ({ children }: OfferCardProps) => {
  return (
    <div className="w-full max-w-6xl p-10 rounded-3xl shadow-2xl bg-lightmode-card dark:bg-card transition-colors duration-300 border border-gray-200 dark:border-gray-700 mx-auto mt-10">
      <div className="flex flex-col items-center mb-6">
        <img
          src={logo}
          alt="Logo"
          className="h-20 w-20 object-cover rounded-full border-4 border-blue-500 shadow-lg"
        />
        <h2 className="mt-4 text-2xl font-bold text-center text-gray-800 dark:text-white">

            Ofertas a las que te haz postulado
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Estas son todas las ofertas a las que haz aplicado
        </p>
      </div>
      {children}
    </div>
  );
};
