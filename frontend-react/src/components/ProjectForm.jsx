// src/components/ProjectForm.jsx
import { useState } from "react";
import api from "../api/axios";
import SuccessModal from "./SuccessModal";

export default function ProjectForm({ onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    estado: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ open: false, message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setSuccess({ open: true, message: "Proyecto creado correctamente." });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-wrapper">
      <SuccessModal
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: "" })}
      />
      <form onSubmit={handleSubmit} className="project-form">
        <h2>Crear Proyecto</h2>

        <div className="form-group">
          <label htmlFor="nombre">Nombre del proyecto</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del proyecto"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            id="ubicacion"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha_inicio">Fecha de inicio</label>
          <input
            id="fecha_inicio"
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha_finalizacion">Fecha de finalización</label>
          <input
            id="fecha_finalizacion"
            type="date"
            name="fecha_finalizacion"
            value={form.fecha_finalizacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un estado</option>
            <option value="En planificación">En planificación</option>
            <option value="En construcción">En construcción</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : "Crear Proyecto"}
        </button>
      </form>
    </div>
  );
}
