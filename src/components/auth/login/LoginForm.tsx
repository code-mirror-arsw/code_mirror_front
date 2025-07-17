import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { SuccessModal } from "../../../components/message/SuccessModal";
import { ErrorModal } from "../../../components/message/ErrorModal";

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const search = new URLSearchParams(location.search);
  const rawNext = search.get("next");
  const nextPath = rawNext && decodeURIComponent(rawNext).startsWith("/") ? decodeURIComponent(rawNext) : "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const parseErrorMessage = (raw: string): string => {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let msg = raw;
    if (jsonMatch) {
      try {
        const obj = JSON.parse(jsonMatch[0]);
        if (obj && obj.message) msg = obj.message;
      } catch {}
    } else {
      const m = raw.match(/"message"\s*:\s*"([^\"]+)"/);
      if (m) msg = m[1];
    }
    if (/user not found/i.test(msg)) msg = "Usuario no encontrado";
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8280/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(parseErrorMessage(text));
      }

      const data = await res.json();

      Cookies.set("accessToken", data.accessToken, { expires: 1, path: "/" });
      Cookies.set("refreshToken", data.refreshToken, { expires: 1, path: "/" });
      Cookies.set("userRole", data.role, { expires: 1, path: "/" });
      Cookies.set("userEmail", data.email, { expires: 1, path: "/" });
      Cookies.set("id", data.id, { expires: 1, path: "/" });

      setModalMsg("✅ Sesión iniciada correctamente");
      setSuccessOpen(true);

      setTimeout(() => {
        navigate(nextPath, { replace: true }); // Redirección segura
      }, 1200);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      setModalMsg(message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl shadow-lg bg-lightmode-card dark:bg-card transition-colors duration-300">
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
            className="w-full rounded-md border px-4 py-3 text-gray-900 dark:text-gray-100"
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
            className="w-full rounded-md border px-4 py-3 text-gray-900 dark:text-gray-100"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition-colors duration-300 ${
            loading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>

      <SuccessModal open={successOpen} message={modalMsg} onClose={() => setSuccessOpen(false)} />
      <ErrorModal open={errorOpen} message={modalMsg} onClose={() => setErrorOpen(false)} />
    </>
  );
};
