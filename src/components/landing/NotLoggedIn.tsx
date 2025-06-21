export default function NotLoggedIn() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-bold mb-4">¡Bienvenido a MetalPulse!</h2>
      <p className="mb-6">
        Nuestra aplicación te ofrece estas increíbles ventajas:
      </p>
      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Gestión fácil y segura de usuarios</li>
        <li>Acceso rápido a tu información personalizada</li>
        <li>Panel exclusivo para administradores</li>
        <li>Modo claro y oscuro para mayor comodidad</li>
        {/* Agrega más beneficios o CTA aquí */}
      </ul>
      <p className="mt-6 text-lg">
        Por favor, <a href="/" className="text-primary underline">inicia sesión</a> para continuar.
      </p>
    </section>
  );
}
