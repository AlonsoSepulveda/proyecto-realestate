import { useState } from 'react';
import api from '../api/axios';

const ClientForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/clients', form);
      setForm({ name: '', email: '' });
      onSuccess?.();
    } catch (err) {
      setError('Error al crear cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Nuevo Cliente</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
};

export default ClientForm;
