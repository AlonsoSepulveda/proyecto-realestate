// src/components/ProjectForm.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import SuccessNotification from "./SuccessNotification";

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
  const [popup, setPopup] = useState({ open: false, message: "", onConfirm: null });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopup({
      open: true,
      message: "¿Deseas guardar este proyecto?",
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
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
      },
    });
  };

  // Renderiza el popup tipo dashboard
  useEffect(() => {
    if (popup.open && popup.onConfirm == null) {
      const timer = setTimeout(() => setPopup({ ...popup, open: false }), 2500);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  return (
    <div className="project-form-wrapper">
      <SuccessNotification
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: "" })}
      />
      {popup.open && popup.onConfirm && (
        <div className="success-notification-fixed">
          <div className="success-notification-content" style={{ background: "#2563eb" }}>
            <span className="success-notification-icon">?</span>
            <span className="success-notification-message">{popup.message}</span>
            <button
              style={{
                marginLeft: 16,
                background: "#e5e7eb",
                color: "#222",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => setPopup({ ...popup, open: false })}
            >
              Cancelar
            </button>
            <button
              style={{
                marginLeft: 8,
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={popup.onConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
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
