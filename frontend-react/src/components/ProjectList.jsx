import { useEffect, useState } from 'react';
import api from '../api/axios';
import SuccessNotification from './SuccessNotification';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState({ open: false, message: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [popup, setPopup] = useState({ open: false, message: '', onConfirm: null });
  const [allProjects, setAllProjects] = useState([]);

  const fetchProjects = async (searchValue = search, pageValue = page) => {
    try {
      const params = {
        per_page: 10,
        page: pageValue,
        ...(searchValue ? { search: searchValue } : {}),
      };
      const res = await api.get('/proyectos', { params });
      setProjects(res.data.data);
      setTotalPages(res.data.last_page || 1);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [page]);

  // Cuando cambia el search, traer todos los proyectos (sin paginación) para buscar en todas las páginas
  useEffect(() => {
    let ignore = false;
    const fetchAllProjects = async () => {
      if (search.trim() === '') {
        fetchProjects(page); // paginado normal
        return;
      }
      try {
        const res = await api.get('/proyectos', { params: { per_page: 10000 } });
        if (!ignore) {
          setProjects(res.data.data);
          setTotalPages(1);
          setPage(1);
        }
      } catch (error) {
        if (!ignore) console.error('Error al buscar proyectos:', error);
      }
    };
    fetchAllProjects();
    return () => { ignore = true; };
    // eslint-disable-next-line
  }, [search]);

  // Cargar todos los proyectos una sola vez
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/proyectos', { params: { per_page: 10000 } });
        setAllProjects(res.data.data);
      } catch (error) {
        setAllProjects([]);
      }
    };
    fetchAll();
  }, []);

  // Filtrar sobre todos los proyectos
  const filteredProjects = allProjects.filter((p) => {
    const values = Object.values(p);
    return values.some(v => v && v.toString().toLowerCase().includes(search.toLowerCase()));
  });

  // Paginación sobre los filtrados
  const perPage = 10;
  const paginatedProjects = filteredProjects.slice((page - 1) * perPage, page * perPage);
  const totalPagesFiltered = Math.ceil(filteredProjects.length / perPage) || 1;

  useEffect(() => {
    setTotalPages(totalPagesFiltered);
    if (page > totalPagesFiltered) setPage(1);
  }, [filteredProjects, totalPagesFiltered]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleEdit = (project) => {
    setEditRowId(project.id);
    setEditData({ ...project });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Recargar todos los proyectos después de editar o eliminar
  const reloadAllProjects = async () => {
    try {
      const res = await api.get('/proyectos', { params: { per_page: 10000 } });
      setAllProjects(res.data.data);
    } catch (error) {
      setAllProjects([]);
    }
  };

  const handleEditSave = (id) => {
    setPopup({
      open: true,
      message: '¿Deseas guardar los cambios de este proyecto?',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        try {
          await api.put(`/proyectos/${id}`, editData);
          setEditRowId(null);
          setSuccess({ open: true, message: 'Proyecto editado correctamente.' });
          reloadAllProjects();
        } catch (error) {
          console.error('Error al actualizar proyecto:', error);
        }
      }
    });
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const deleteProject = (id) => {
    setPopup({
      open: true,
      message: '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        try {
          await api.delete(`/proyectos/${id}`);
          setSuccess({ open: true, message: 'Proyecto eliminado correctamente.' });
          reloadAllProjects();
        } catch (error) {
          const mensaje = error.response?.data?.message || 'Error desconocido al eliminar proyecto.';
          alert(mensaje);
          console.error('Error al eliminar proyecto:', mensaje);
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
    <div className="p-4">
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
      <h2 className="text-xl font-bold mb-4">Lista de Proyectos</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={search}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-full max-w-xs"
        />
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-3 py-2 border-r border-red-300">N°</th>
              <th className="px-3 py-2 border-r border-red-300">Nombre</th>
              <th className="px-3 py-2 border-r border-red-300">Descripción</th>
              <th className="px-3 py-2 border-r border-red-300">Ubicación</th>
              <th className="px-3 py-2 border-r border-red-300">Fecha Inicio</th>
              <th className="px-3 py-2 border-r border-red-300">Fecha Finalización</th>
              <th className="px-3 py-2 border-r border-red-300">Estado</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((p, idx) => (
              <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="border-r border-gray-200 px-2 py-1">{(page - 1) * perPage + idx + 1}</td>
                {editRowId === p.id ? (
                  <>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="nombre" value={editData.nombre} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="descripcion" value={editData.descripcion} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="ubicacion" value={editData.ubicacion} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="fecha_inicio" type="date" value={editData.fecha_inicio} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="fecha_finalizacion" type="date" value={editData.fecha_finalizacion} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1">
                      <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border rounded px-2 py-1">
                        <option value="">Seleccionar estado</option>
                        <option value="En planificación">En planificación</option>
                        <option value="En construcción">En construcción</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </td>
                    <td className="flex gap-1 px-2 py-1">
                      <button onClick={() => handleEditSave(p.id)} className="bg-green-600 text-white px-2 py-1 rounded">Guardar</button>
                      <button onClick={handleEditCancel} className="bg-gray-400 text-white px-2 py-1 rounded">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border-r border-gray-200 px-2 py-1">{p.nombre}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{p.descripcion}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{p.ubicacion}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{p.fecha_inicio}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{p.fecha_finalizacion}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{p.estado}</td>
                    <td className="flex gap-1 px-2 py-1">
                      <button onClick={() => handleEdit(p)} className="bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                      <button onClick={() => deleteProject(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
