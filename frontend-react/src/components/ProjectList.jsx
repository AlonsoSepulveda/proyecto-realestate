import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
    estado: '',
  });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/proyectos');
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

const deleteProject = async (id) => {
  try {
    await api.delete(`/proyectos/${id}`);
    fetchProjects();
  } catch (error) {
    const mensaje = error.response?.data?.message || "Error desconocido al eliminar proyecto.";
    alert(mensaje);
    console.error("Error al eliminar proyecto:", mensaje);
  }
};


  const handleEdit = (project) => {
    setEditProject(project);
    setFormData({
      nombre: project.nombre || '',
      descripcion: project.descripcion || '',
      ubicacion: project.ubicacion || '',
      fecha_inicio: project.fecha_inicio || '',
      fecha_finalizacion: project.fecha_finalizacion || '',
      estado: project.estado || '',
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/proyectos/${editProject.id}`, formData);
      setEditProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Proyectos</h2>

      <ul className="mt-4 space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="flex justify-between items-center border p-2 rounded shadow-sm">
            <span>{p.nombre}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="text-sm text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="text-sm text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de edición */}
      {editProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-4">Editar Proyecto</h3>

            <div className="space-y-3">
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="ubicacion"
                type="text"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ubicación"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="fecha_finalizacion"
                type="date"
                value={formData.fecha_finalizacion}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Seleccionar estado</option>
                <option value="En planificación">En planificación</option>
                <option value="En construcción">En construcción</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditProject(null)}
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
