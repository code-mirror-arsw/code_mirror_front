import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  FaCode,
  FaHeadphones,
  FaCheckCircle,
  FaBell,
  FaUserTie,
} from 'react-icons/fa';
import Social from '../../components/landing/soccialMedia/social';

export default function LandingPage() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Recargar automáticamente al cargar, solo una vez, sin sessionStorage
  useEffect(() => {
    if (!window.location.href.includes('reloaded')) {
      const separator = window.location.href.includes('?') ? '&' : '?';
      window.location.href = `${window.location.href}${separator}reloaded`;
    }
  }, []);

  useEffect(() => {
    setRole(Cookies.get('userRole') || null);
    setName(Cookies.get('userName') || null);
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
      <header className="text-center py-20 px-6">
        {name && (
          <p className="mb-4 text-lg font-semibold text-blue-600 dark:text-blue-400">
            ¡Hola, {name}!{' '}
            {role === 'CLIENT'
              ? 'Explora nuevas oportunidades.'
              : 'Publica tu próxima vacante.'}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Entrevistas técnicas más rápidas, efectivas y colaborativas
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-300 mb-8">
          Crea ofertas, postula candidatos, programa entrevistas en grupo con código y voz en tiempo real.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition">
            {role === 'CLIENT' ? 'Buscar ofertas' : 'Probar gratis'}
          </button>
          <button className="bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-md hover:bg-gray-400 transition">
            Agendar demo
          </button>
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

      <section className="bg-white dark:bg-gray-800 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonios</h2>
        <div className="overflow-hidden relative w-full max-w-3xl mx-auto">
          <div className="animate-slide-left whitespace-nowrap flex space-x-8">
            <blockquote className="inline-block w-full px-4 text-center italic text-gray-600 dark:text-gray-400">
              “Usar Code Mirror nos ayudó a reducir el tiempo de contratación un 40%.”
              <br />
              <span className="font-bold mt-2 block">– Carla G., Microsoft</span>
            </blockquote>
            <blockquote className="inline-block w-full px-4 text-center italic text-gray-600 dark:text-gray-400">
              “La evaluación automática es una locura, súper útil.”
              <br />
              <span className="font-bold mt-2 block">– David M., Amazon</span>
            </blockquote>
            <blockquote className="inline-block w-full px-4 text-center italic text-gray-600 dark:text-gray-400">
              “Finalmente una plataforma enfocada en lo técnico de verdad.”
              <br />
              <span className="font-bold mt-2 block">– Laura T., Google</span>
            </blockquote>
          </div>
        </div>
        <style>
          {`@keyframes slide-left {
            0% { transform: translateX(0); }
            33% { transform: translateX(-100%); }
            66% { transform: translateX(-200%); }
            100% { transform: translateX(0); }
          }
          .animate-slide-left { animation: slide-left 12s infinite; }`}
        </style>
      </section>

      <footer className="bg-gray-800 text-white py-8 px-6 text-center">
        <div className="space-y-2">
          <p className="text-lg font-bold">Code Mirror</p>
          <div className="flex justify-center">
            <Social />
          </div>
          <p>Contacto: contacto@codemirror.com</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Santiago Coronado. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
