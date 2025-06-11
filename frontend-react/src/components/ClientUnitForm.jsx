import { useState, useEffect } from 'react';
import api from '../api/axios';

const ClientUnitForm = () => {
  const [clients, setClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [showVentas, setShowVentas] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [ventasLoading, setVentasLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, unitsRes] = await Promise.all([
          api.get('/clientes', { params: { per_page: 10000 } }),
          api.get('/unidades', { params: { per_page: 10000, estado: 'Disponible' } }),
        ]);
        setClients(clientsRes.data.data || []);
        setUnits((unitsRes.data.data || []).filter(u => u.estado && u.estado.toLowerCase() === 'disponible'));
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchVentas = async () => {
    setVentasLoading(true);
    try {
      const res = await api.get('/unidades', { params: { per_page: 10000, estado: 'Vendido' } });
      setVentas((res.data.data || []).filter(u => u.cliente_id && u.cliente));
    } catch (err) {
      setVentas([]);
    } finally {
      setVentasLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedUnit) return;
    try {
      await api.put(`/unidades/${selectedUnit}`, { cliente_id: selectedClient, estado: 'Vendido' });
      setSuccess(true);
      setSelectedClient('');
      setSelectedUnit('');
      const unitsRes = await api.get('/unidades', { params: { per_page: 10000, estado: 'Disponible' } });
      setUnits((unitsRes.data.data || []).filter(u => u.estado && u.estado.toLowerCase() === 'disponible'));
    } catch (err) {
      console.error('Error al asociar unidad:', err);
    }
  };

  if (loading) return <div className="project-form-wrapper"><div className="project-form"><span>Cargando...</span></div></div>;

  return (
    <div className="project-form-wrapper">

      <form onSubmit={handleSubmit} className="project-form" style={{ minWidth: 320 }}>
              <button
        type="button"
        style={{ marginBottom: 18, width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
        onClick={() => { setShowVentas(true); fetchVentas(); }}
      >
        Listado de ventas
      </button>
      {showVentas && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 350, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 2px 16px #0002' }}>
            <h3 style={{ marginBottom: 16, textAlign: 'center' }}>Unidades Vendidas</h3>
            {ventasLoading ? (
              <div>Cargando ventas...</div>
            ) : ventas.length === 0 ? (
              <div>No hay ventas registradas.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Unidad</th>
                    <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Proyecto</th>
                    <th style={{ padding: 8, border: '1px solid #e5e7eb' }}>Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map(u => (
                    <tr key={u.id}>
                      <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{u.numero_unidad} - {u.tipo_unidad}</td>
                      <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{u.proyecto && u.proyecto.nombre ? u.proyecto.nombre : u.proyecto_id}</td>
                      <td style={{ padding: 8, border: '1px solid #e5e7eb' }}>{u.cliente ? `${u.cliente.nombre} ${u.cliente.apellido || ''} (${u.cliente.email})` : u.cliente_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setShowVentas(false)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'block', margin: '0 auto' }}>Cerrar</button>
          </div>
        </div>
      )}
        <h2>Vender Unidad a Cliente</h2>
        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} {c.apellido ? c.apellido : ''} ({c.email})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="unidad">Unidad de Propiedad</label>
          <select
            id="unidad"
            value={selectedUnit}
            onChange={e => setSelectedUnit(e.target.value)}
            required
          >
            <option value="">Seleccione una unidad</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>
                {u.numero_unidad} - {u.tipo_unidad} | Proyecto: {u.proyecto && u.proyecto.nombre ? u.proyecto.nombre : u.proyecto_id}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          Vender
        </button>
        {success && (
          <div style={{ gridColumn: '1 / -1', background: '#d1fae5', color: '#065f46', borderRadius: 8, padding: '0.7rem', textAlign: 'center', fontWeight: 600, marginTop: 8 }}>
            Unidad vendida correctamente
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientUnitForm;
