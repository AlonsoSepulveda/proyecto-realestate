import { useEffect, useState } from 'react';
import api from '../api/axios';
import SuccessNotification from './SuccessNotification';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState({ open: false, message: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [popup, setPopup] = useState({ open: false, message: '', onConfirm: null });

  const fetchClients = async (pageValue = page) => {
    try {
      const params = {
        per_page: 10,
        page: pageValue,
      };
      const res = await api.get('/clientes', { params });
      setClients(res.data.data);
      setTotalPages(res.data.last_page || 1);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Filtro local en la grilla para búsqueda por cualquier palabra en cualquier columna
  const filteredClients = clients.filter((c) => {
    const values = Object.values(c);
    return values.some(v => v && v.toString().toLowerCase().includes(search.toLowerCase()));
  });

  // Cuando cambia el search, traer todos los clientes (sin paginación) para buscar en todas las páginas
  useEffect(() => {
    const fetchAllClients = async () => {
      if (search.trim() === '') {
        fetchClients(page); // paginado normal
        return;
      }
      try {
        // Traer todos los clientes para búsqueda global
        const res = await api.get('/clientes', { params: { per_page: 10000 } });
        setClients(res.data.data);
        setTotalPages(1);
        setPage(1);
      } catch (error) {
        console.error('Error al buscar clientes:', error);
      }
    };
    fetchAllClients();
    // eslint-disable-next-line
  }, [search]);

  const handleEdit = (client) => {
    setEditRowId(client.id);
    setEditData({ ...client });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // GUARDAR
  const handleEditSave = (id) => {
    setPopup({
      open: true,
      message: '¿Deseas guardar los cambios de este cliente?',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        try {
          await api.put(`/clientes/${id}`, editData);
          setEditRowId(null);
          setSuccess({ open: true, message: 'Cliente editado correctamente.' });
          fetchClients();
        } catch (error) {
          console.error('Error al actualizar cliente:', error);
        }
      }
    });
  };

  // ELIMINAR
  const deleteClient = (id) => {
    setPopup({
      open: true,
      message: '¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        try {
          await api.delete(`/clientes/${id}`);
          setSuccess({ open: true, message: 'Cliente eliminado correctamente.' });
          fetchClients();
        } catch (error) {
          console.error('Error al eliminar Cliente:', error);
        }
      }
    });
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  // Renderiza el popup tipo dashboard
  useEffect(() => {
    if (popup.open && popup.onConfirm == null) {
      // Si es solo informativo, autocierra
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
      {/* Popup tipo dashboard para confirmación */}
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
      <h2 className="text-xl font-bold mb-4">Lista de Clientes</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-full max-w-xs"
        />
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-3 py-2 border-r border-gray-300">N°</th>
              <th className="px-3 py-2 border-r border-gray-300">RUT</th>
              <th className="px-3 py-2 border-r border-gray-300">Nombre</th>
              <th className="px-3 py-2 border-r border-gray-300">Apellido</th>
              <th className="px-3 py-2 border-r border-gray-300">Correo</th>
              <th className="px-3 py-2 border-r border-gray-300">Teléfono</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c, idx) => (
              <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="border-r border-gray-200 px-2 py-1">{idx + 1}</td>
                {editRowId === c.id ? (
                  <>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="rut" value={editData.rut} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="nombre" value={editData.nombre} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="apellido" value={editData.apellido} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="email" value={editData.email} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="telefono" value={editData.telefono} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="flex gap-1 px-2 py-1">
                      <button onClick={() => handleEditSave(c.id)} className="bg-green-600 text-white px-2 py-1 rounded">Guardar</button>
                      <button onClick={handleEditCancel} className="bg-gray-400 text-white px-2 py-1 rounded">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border-r border-gray-200 px-2 py-1">{c.rut}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{c.nombre}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{c.apellido}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{c.email}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{c.telefono}</td>
                    <td className="flex gap-1 px-2 py-1">
                      <button onClick={() => handleEdit(c)} className="bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                      <button onClick={() => deleteClient(c.id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
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
