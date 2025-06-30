import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import Cookies from "js-cookie";
import { SuccessModal } from "../../components/message/SuccessModal";
import { ErrorModal } from "../../components/message/ErrorModal";

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8280/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json(); 
        throw new Error(errData.message || "Error al iniciar sesión");
      }

      const data = await res.json();

      Cookies.set("accessToken", data.accessToken, { expires: 1, path: "/" });
      Cookies.set("refreshToken", data.refreshToken, { expires: 1, path: "/" });
      Cookies.set("userRole", data.role, { expires: 1, path: "/" });
      Cookies.set("userEmail", data.email, { expires: 1, path: "/" });
      Cookies.set("id" , data.id, { expires: 1, path: "/" })

      setModalMsg("✅ Sesión iniciada correctamente");
      setSuccessOpen(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      let message = "Error al iniciar sesión";
      if (err instanceof Error) {
        message = err.message;
      }
  setModalMsg(message);
  setErrorOpen(true);
}
finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8 rounded-2xl shadow-lg bg-lightmode-card dark:bg-card transition-colors duration-300"
      >
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
            Correo electrónico
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
            Contraseña
          </label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition-colors duration-300
            ${loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"}`}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>

      {/* Modales */}
      <SuccessModal open={successOpen} message={modalMsg} onClose={() => setSuccessOpen(false)} />
      <ErrorModal open={errorOpen} message={modalMsg} onClose={() => setErrorOpen(false)} />
    </>
  );
};
