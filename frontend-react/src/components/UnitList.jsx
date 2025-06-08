import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/unidades');
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error al obtener unidades:", error);
    }
  };

  const deleteUnit = async (id) => {
    try {
      await api.delete(`/unidades/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Error al eliminar Unidad:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de unidades</h2>

      <ul className="mt-4 space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="flex justify-between items-center border p-2 rounded shadow-sm">
            <span>{p.numero_unidad}</span>
            <button
              onClick={() => deleteUnit(p.id)}
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
