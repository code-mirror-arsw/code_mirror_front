import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando login", form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-lightmode-card dark:bg-card p-6 rounded-lg shadow-md transition-colors duration-300"
    >
      <div>
        <label
          htmlFor="email"
          className="block mb-1 text-lightmode-text dark:text-light"
        >
          Correo electrónico
        </label>
        <Input
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-1 text-lightmode-text dark:text-light"
        >
          Contraseña
        </label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-white hover:bg-secondary transition-colors duration-300"
      >
        Iniciar sesión
      </Button>
    </form>
  );
};
