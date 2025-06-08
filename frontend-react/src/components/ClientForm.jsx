import { useState } from 'react';
import api from '../api/axios';
import SuccessModal from './SuccessModal';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/clientes', form);
      setForm({ rut: '', nombre: '', apellido: '', email: '', telefono: '' });
      setSuccess({ open: true, message: 'Cliente creado correctamente.' });
      onSuccess?.();
    } catch (err) {
      setError('Error al crear cliente');
    }
  };

  return (
    <>
      <SuccessModal
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: '' })}
      />
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
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
    </>
  );
};

export default ClientForm;
