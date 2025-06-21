import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AppNavbar from "../../components/navigation/AppNavbar";
import { ThemeToggle } from "../../components/changeTheme/ThemeToggle";
import { FaCode, FaHeadphones, FaCheckCircle, FaBell, FaUserTie } from "react-icons/fa";

export default function LandingPage() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRole(Cookies.get("userRole") || null);
    setName(Cookies.get("userName") || null);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300">
      <AppNavbar />

      <header className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Entrevistas técnicas más rápidas, efectivas y colaborativas</h1>
        <p className="text-xl text-gray-500 dark:text-gray-300 mb-8">
          Crea ofertas, postula candidatos, programa entrevistas en grupo con código y voz en tiempo real.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition text-center">Probar gratis</button>
          <button className="bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-md hover:bg-gray-400 transition text-center">Agendar demo</button>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-800 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Crear oferta</h3>
            <p className="text-gray-600 dark:text-gray-400">Publica rápidamente una nueva vacante desde tu panel.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">2. Aceptar postulantes</h3>
            <p className="text-gray-600 dark:text-gray-400">Filtra, revisa y acepta candidatos en segundos.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">3. Entrevistar y decidir</h3>
            <p className="text-gray-600 dark:text-gray-400">Haz entrevistas técnicas con colaboración y voz en tiempo real.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Características destacadas</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaCode className="text-4xl mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Editor colaborativo</h3>
            <p className="text-gray-500 dark:text-gray-400">Escribe y revisa código junto con los candidatos.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaHeadphones className="text-4xl mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Audio en tiempo real</h3>
            <p className="text-gray-500 dark:text-gray-400">Comunicación fluida durante la entrevista técnica.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-4xl mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Evaluación automática</h3>
            <p className="text-gray-500 dark:text-gray-400">Resultados claros tras cada entrevista técnica.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaBell className="text-4xl mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Notificaciones inteligentes</h3>
            <p className="text-gray-500 dark:text-gray-400">Recordatorios y seguimiento automatizado.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaUserTie className="text-4xl mb-2 text-blue-600" />
            <h3 className="font-semibold mb-1">Perfiles técnicos integrados</h3>
            <p className="text-gray-500 dark:text-gray-400">Historial y CVs disponibles de inmediato.</p>
          </div>
        </div>
      </section>

       <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">¿Para quién es?</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-2">Startups</h3>
            <p>Encuentra rápido a tu primer equipo de ingeniería con entrevistas técnicas efectivas.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-2">Reclutadores técnicos</h3>
            <p>Centraliza tus evaluaciones y toma decisiones basadas en datos.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl mb-2">Empresas Tech</h3>
            <p>Escala tu equipo sin perder tiempo en entrevistas mal enfocadas.</p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          <details className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">¿Puedo usarlo gratis?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sí, puedes usar la plataforma totalmente gratis.</p>
          </details>
          <details className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">¿Necesito instalar algo?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-300">No. Todo corre en la web con tu navegador favorito.</p>
          </details>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonios</h2>
        <div className="overflow-hidden relative w-full max-w-3xl mx-auto">
          <div className="animate-slide-left whitespace-nowrap space-x-8">
            <div className="inline-block w-full px-4">
              <blockquote className="text-center italic text-gray-600 dark:text-gray-400">“Usar Code Mirror nos ayudó a reducir el tiempo de contratación un 40%.”<br /><span className="font-bold mt-2 block">– Carla G., Microsoft</span></blockquote>
            </div>
            <div className="inline-block w-full px-4">
              <blockquote className="text-center italic text-gray-600 dark:text-gray-400">“La evaluación automática es una locura, súper útil.”<br /><span className="font-bold mt-2 block">– David M., Amazon</span></blockquote>
            </div>
            <div className="inline-block w-full px-4">
              <blockquote className="text-center italic text-gray-600 dark:text-gray-400">“Finalmente una plataforma enfocada en lo técnico de verdad.”<br /><span className="font-bold mt-2 block">– Laura T., Google</span></blockquote>
            </div>
          </div>
        </div>
        <style>
          {`@keyframes slide-left {
            0% { transform: translateX(0); }
            33% { transform: translateX(-100%); }
            66% { transform: translateX(-200%); }
            100% { transform: translateX(0); }
          }
          .animate-slide-left {
            display: flex;
            animation: slide-left 12s infinite;
          }`}
        </style>
      </section>

    
      <footer className="bg-gray-800 text-white py-8 px-6 text-center">
        <div className="space-y-2">
          <p className="text-lg font-bold">Code Mirror</p>
          <p>Síguenos en redes sociales: Facebook | Twitter | LinkedIn</p>
          <p>Contacto: codemirror17@gmail.com</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Santiago Coronado. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
