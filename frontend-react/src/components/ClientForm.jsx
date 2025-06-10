import { useState, useEffect } from 'react';
import api from '../api/axios';
import SuccessNotification from './SuccessNotification';

const ClientForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState({ open: false, message: '' });
  const [popup, setPopup] = useState({ open: false, message: '', onConfirm: null });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopup({
      open: true,
      message: '¿Deseas guardar este cliente?',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        setError('');
        try {
          await api.post('/clientes', form);
          setForm({ rut: '', nombre: '', apellido: '', email: '', telefono: '' });
          setSuccess({ open: true, message: 'Cliente creado correctamente.' });
          onSuccess?.();
        } catch (err) {
          setError('Error al crear cliente');
        }
      }
    });
  };

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
        onClose={() => setSuccess({ open: false, message: '' })}
      />
      {popup.open && popup.onConfirm && (
        <div className="success-notification-fixed">
          <div className="success-notification-content" style={{ background: '#2563eb' }}>
            <span className="success-notification-icon">?</span>
            <span className="success-notification-message">{popup.message}</span>
            <button
              style={{ marginLeft: 16, background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setPopup({ ...popup, open: false })}
            >Cancelar</button>
            <button
              style={{ marginLeft: 8, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}
              onClick={popup.onConfirm}
            >Confirmar</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="project-form">
        <h2 className="text-lg font-semibold">Nuevo Cliente</h2>
        {error && <p className="text-red-600">{error}</p>}
        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input
            id="rut"
            name="rut"
            type="text"
            placeholder="RUT"
            value={form.rut}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="text"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ClientForm;
