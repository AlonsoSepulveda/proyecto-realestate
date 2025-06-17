import { useEffect, useState } from 'react';
import api from '../api/axios';
import SuccessNotification from './SuccessNotification';

export default function UnitList() {
  const [units, setUnits] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState({ open: false, message: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [popup, setPopup] = useState({ open: false, message: '', onConfirm: null });

  const fetchUnits = async (pageValue = page) => {
    try {
      const params = {
        per_page: 10,
        page: pageValue,
      };
      const res = await api.get('/unidades', { params });
      setUnits(res.data.data);
      setTotalPages(res.data.last_page || 1);
    } catch (error) {
      console.error('Error al obtener unidades:', error);
    }
  };

  useEffect(() => {
    fetchUnits();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Filtro local en la grilla
  const filteredUnits = units.filter((u) => {
    const values = [u.numero_unidad, u.tipo_unidad, u.metraje_cuadrado, u.precio_venta, u.estado];
    return values.some(v => v && v.toString().toLowerCase().includes(search.toLowerCase()));
  });

  const handleEdit = (unit) => {
    setEditRowId(unit.id);
    setEditData({ ...unit });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = (id) => {
    setPopup({
      open: true,
      message: '¿Deseas guardar los cambios de esta unidad?',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        try {
          await api.put(`/unidades/${id}`, {
            ...editData,
            metraje_cuadrado: parseFloat(editData.metraje_cuadrado),
            precio_venta: parseFloat(editData.precio_venta),
          });
          setEditRowId(null);
          setSuccess({ open: true, message: 'Unidad editada correctamente.' });
          fetchUnits();
        } catch (error) {
          console.error('Error al actualizar unidad:', error);
        }
      }
    });
  };

  const deleteUnit = (id) => {
    setPopup({
      open: true,
      message: '¿Estás seguro de que deseas eliminar esta unidad? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setPopup({ ...popup, open: false });
        try {
          await api.delete(`/unidades/${id}`);
          setSuccess({ open: true, message: 'Unidad eliminada correctamente.' });
          fetchUnits();
        } catch (error) {
          console.error('Error al eliminar Unidad:', error);
        }
      }
    });
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditData({});
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
      <h2 className="text-xl font-bold mb-4">Lista de Unidades</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar unidad..."
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
              <th className="px-3 py-2 border-r border-gray-300">N° Unidad</th>
              <th className="px-3 py-2 border-r border-gray-300">Proyecto</th>
              <th className="px-3 py-2 border-r border-gray-300">Tipo</th>
              <th className="px-3 py-2 border-r border-gray-300">Metraje (m²)</th>
              <th className="px-3 py-2 border-r border-gray-300">Precio Venta</th>
              <th className="px-3 py-2 border-r border-gray-300">Estado</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map((u, idx) => (
              <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="border-r border-gray-200 px-2 py-1">{idx + 1}</td>
                {editRowId === u.id ? (
                  <>
                    <td className="border-r border-gray-200 px-2 py-1">{u.numero_unidad}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{u.proyecto?.nombre || u.proyecto_id}</td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="tipo_unidad" value={editData.tipo_unidad} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="metraje_cuadrado" type="number" min="0" step="0.01" value={editData.metraje_cuadrado} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1"><input name="precio_venta" type="number" min="0" step="0.01" value={editData.precio_venta} onChange={handleEditChange} className="w-full border rounded px-2 py-1" /></td>
                    <td className="border-r border-gray-200 px-2 py-1">
                      <select name="estado" value={editData.estado} onChange={handleEditChange} className="w-full border rounded px-2 py-1">
                        <option value="">Selecciona un estado</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Vendido">Vendido</option>
                        <option value="Reservado">Reservado</option>
                      </select>
                    </td>
                    <td className="flex gap-1 px-2 py-1">
                      <button onClick={() => handleEditSave(u.id)} className="bg-green-600 text-white px-2 py-1 rounded">Guardar</button>
                      <button onClick={handleEditCancel} className="bg-gray-400 text-white px-2 py-1 rounded">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border-r border-gray-200 px-2 py-1">{u.numero_unidad}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{u.proyecto?.nombre || u.proyecto_id}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{u.tipo_unidad}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{u.metraje_cuadrado}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{u.precio_venta}</td>
                    <td className="border-r border-gray-200 px-2 py-1">{u.estado}</td>
                    <td className="flex gap-1 px-2 py-1">
                      <button onClick={() => handleEdit(u)} className="bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                      <button onClick={() => deleteUnit(u.id)} className="bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
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
