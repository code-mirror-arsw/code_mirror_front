import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { SuccessModal } from "./../message/SuccessModal";
import { ErrorModal } from "./../message/ErrorModal";

export default function CreateOfferForm() {
  const [form, setForm] = useState({
    company: '',
    title: '',
    description: '',
    maxCandidates: 1
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'maxCandidates' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const adminEmail = Cookies.get('userEmail');

    if (!adminEmail) {
      setErrorMsg("No se encontró el email del administrador en las cookies");
      setErrorOpen(true);
      return;
    }

    const payload = {
      ...form,
      adminEmail,
      status: 'ACTIVE'
    };

    try {
      const response = await fetch('http://localhost:8080/services/be/offer-service/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      setSuccessOpen(true);
      setForm({ company: '', title: '', description: '', maxCandidates: 1 });
    } catch (error: any) {
      let msg = error.message;

      // Intenta parsear si es un JSON de error
      try {
        const parsed = JSON.parse(error.message);
        msg = parsed.message || msg;
      } catch (_) {}

      setErrorMsg(msg);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <SuccessModal
        open={successOpen}
        message="✅ Oferta creada exitosamente"
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorModal
        open={errorOpen}
        message={errorMsg}
        onClose={() => setErrorOpen(false)}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Empresa:</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Título:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Descripción:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded h-24 resize-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Máximo de Candidatos:</label>
          <input
            type="number"
            name="maxCandidates"
            value={form.maxCandidates}
            min="1"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Crear Oferta
          </button>
        </div>
      </form>
    </>
  );
}
