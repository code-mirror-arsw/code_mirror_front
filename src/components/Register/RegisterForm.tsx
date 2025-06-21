import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterInput from "../Register/RegisterInput";
import { Button } from "@heroui/button";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    identification: "",
    role: "CLIENT",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        identification: form.identification,
        role: form.role,
      };

      const params = new URLSearchParams({ password: form.password });

      const response = await fetch(`http://localhost:8280/auth/register?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      alert("Registro exitoso, ahora inicia sesión.");
      navigate("/login");
    } catch (error) {
      alert("Error al registrar usuario.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white dark:bg-card p-8 rounded-xl shadow-md space-y-4"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Registro</h1>

      <RegisterInput name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
      <RegisterInput name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} />
      <RegisterInput type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
      <RegisterInput name="identification" placeholder="Identificación" value={form.identification} onChange={handleChange} />
      <RegisterInput type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />

      <Button
        type="submit"
        className="w-full bg-primary text-white hover:bg-secondary transition-colors duration-300"
      >
        Registrarse
      </Button>
    </form>
  );
}
