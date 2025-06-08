import { useEffect, useState } from 'react';
import api from '../api/axios';
import SuccessModal from './SuccessModal';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [success, setSuccess] = useState({ open: false, message: '' });

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
      setSuccess({ open: true, message: 'Unidad eliminada correctamente.' });
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
      <SuccessModal
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: '' })}
      />
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
