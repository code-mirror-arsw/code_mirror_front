import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../changeTheme/ThemeToggle";
import logo from "/logo 1.png";

export default function AppNavbar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(Cookies.get("userRole") || null);
  }, []);

  const isLoggedIn = !!role;

  const logout = () => {
    Cookies.remove("userRole");
    Cookies.remove("userName");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-4 px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full border-3 border-gray-300 dark:border-gray-600 shadow"
          />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">Code Mirror</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-lg font-medium text-gray-700 dark:text-gray-200">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          {role === "ADMIN" && (
            <>
              <Link to="/crear-oferta" className="hover:text-blue-600 transition">Crear Oferta</Link>
              <Link to="/ofertas-creadas" className="hover:text-blue-600 transition">Ofertas Creadas</Link>
              <Link to="/entrevistas" className="hover:text-blue-600 transition">entrevistas por programar</Link>
              <Link to="/resultadoAdmin" className="hover:text-blue-600 transition">Estadisticas</Link>
              <Link to="/perfil" className="hover:text-blue-600 transition">Mi perfil</Link>


            </>
          )}
          {role === "CLIENT" && (
            <>
              <Link to="/mis-ofertas" className="hover:text-blue-600 transition">Mis Ofertas</Link>
              <Link to="/ofertas-nuevas" className="hover:text-blue-600 transition">Ofertas Nuevas</Link>
              <Link to="/resultados" className="hover:text-blue-600 transition">Mis resultados</Link>
              <Link to="/perfil" className="hover:text-blue-600 transition">Mi perfil</Link>

            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
