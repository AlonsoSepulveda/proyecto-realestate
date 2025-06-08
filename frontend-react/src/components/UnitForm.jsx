import { useState } from 'react';
import api from '../api/axios';

const UnitForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', address: '', client_id: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/units', form);
      setForm({ name: '', address: '', client_id: '' });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError('Error al crear la unidad');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Crear Unidad</h2>
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
        type="text"
        name="address"
        placeholder="Dirección"
        value={form.address}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="client_id"
        placeholder="ID del Cliente"
        value={form.client_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar Unidad
      </button>
    </form>
  );
};

export default UnitForm;
