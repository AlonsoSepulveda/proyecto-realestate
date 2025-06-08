import { useEffect, useState } from 'react';
import api from '../api/axios';
import SuccessModal from './SuccessModal';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [success, setSuccess] = useState({ open: false, message: '' });
  const [editClient, setEditClient] = useState(null);
  const [formData, setFormData] = useState({ rut: '', nombre: '', apellido: '', email: '', telefono: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/clientes');
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const deleteClient = async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      setSuccess({ open: true, message: 'Cliente eliminado correctamente.' });
      fetchProjects();
    } catch (error) {
      console.error("Error al eliminar Cliente:", error);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setFormData({
      rut: client.rut || '',
      nombre: client.nombre || '',
      apellido: client.apellido || '',
      email: client.email || '',
      telefono: client.telefono || '',
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/clientes/${editClient.id}`, formData);
      setEditClient(null);
      setSuccess({ open: true, message: 'Cliente editado correctamente.' });
      fetchProjects();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4">
      <SuccessModal
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: '' })}
      />
      <h2 className="text-xl font-bold mb-4">Lista de clientes</h2>

      <ul className="mt-4 space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="flex justify-between items-center border p-2 rounded shadow-sm">
            <span>{p.rut}</span>&nbsp;
            <span>{p.nombre}</span>&nbsp;
            <span>{p.apellido}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="text-sm text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => deleteClient(p.id)}
                className="text-sm text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de edición */}
      {editClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-4">Editar Cliente</h3>
            <div className="space-y-3">
              <input
                name="rut"
                type="text"
                value={formData.rut}
                onChange={handleChange}
                placeholder="RUT"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="telefono"
                type="text"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditClient(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
