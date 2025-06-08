import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

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
      fetchProjects();
    } catch (error) {
      console.error("Error al eliminar Cliente:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de clientes</h2>

      <ul className="mt-4 space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="flex justify-between items-center border p-2 rounded shadow-sm">
            <span>{p.rut}</span>&nbsp;
            <span>{p.nombre}</span>&nbsp;
            <span>{p.apellido}</span>
            <button
              onClick={() => deleteClient(p.id)}
              className="text-sm text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
