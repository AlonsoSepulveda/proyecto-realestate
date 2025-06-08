import { useState, useEffect } from 'react';
import api from '../api/axios';

const ClientUnitForm = ({ clientId }) => {
  const [unit, setUnit] = useState({ name: '', address: '' });

  const handleChange = (e) => {
    setUnit({ ...unit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/clients/${clientId}/units`, unit);
      setUnit({ name: '', address: '' });
      alert('Unidad asociada correctamente');
    } catch (err) {
      console.error('Error al asociar unidad:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Agregar Unidad</h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre de la unidad"
        value={unit.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Dirección"
        value={unit.address}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Asociar
      </button>
    </form>
  );
};

export default ClientUnitForm;
