import { useState } from "react";
import api from "../api/axios";

export default function ProjectForm({ onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    estado: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/proyectos", form);
      setForm({
        nombre: "",
        descripcion: "",
        ubicacion: "",
        fecha_inicio: "",
        fecha_finalizacion: "",
        estado: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Crear Proyecto</h2>

      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del proyecto"
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="ubicacion"
        value={form.ubicacion}
        onChange={handleChange}
        placeholder="Ubicación"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="date"
        name="fecha_inicio"
        value={form.fecha_inicio}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="date"
        name="fecha_finalizacion"
        value={form.fecha_finalizacion}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <select
        name="estado"
        value={form.estado}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Selecciona un estado</option>
        <option value="En planificación">En planificación</option>
        <option value="En construcción">En construcción</option>
        <option value="Finalizado">Finalizado</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Proyecto
      </button>
    </form>
  );
}
