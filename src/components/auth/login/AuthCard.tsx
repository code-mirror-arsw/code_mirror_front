import { ReactNode } from "react";
import logo from "./logo.png";

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-lightmode-card dark:bg-card transition-colors duration-300">
      <div className="flex justify-center mb-8">
        <img
          src={logo}
          alt="Logo"
          className="h-16 w-16 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600 shadow"
        />
      </div>
      {children}
    </div>
  );
};
