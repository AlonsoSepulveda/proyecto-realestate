import { useState, useEffect } from 'react';
import api from '../api/axios';

const ClientUnitForm = () => {
  const [clients, setClients] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, unitsRes] = await Promise.all([
          api.get('/clients'),
          api.get('/units?estado=disponible'), // Solo unidades disponibles
        ]);
        setClients(clientsRes.data);
        setUnits(unitsRes.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedUnit) return;
    try {
      await api.post(`/clients/${selectedClient}/units`, { unidad_id: selectedUnit });
      setSuccess(true);
      setSelectedClient('');
      setSelectedUnit('');
    } catch (err) {
      console.error('Error al asociar unidad:', err);
    }
  };

  if (loading) return <div className="project-form-wrapper"><div className="project-form"><span>Cargando...</span></div></div>;

  return (
    <div className="project-form-wrapper">
      <form onSubmit={handleSubmit} className="project-form" style={{ minWidth: 320 }}>
        <h2>Asociar Unidad a Cliente</h2>
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
                {u.numero_unidad} - {u.tipo_unidad} | Proyecto: {u.proyecto_nombre ? u.proyecto_nombre : u.proyecto_id}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          Asociar
        </button>
        {success && (
          <div style={{ gridColumn: '1 / -1', background: '#d1fae5', color: '#065f46', borderRadius: 8, padding: '0.7rem', textAlign: 'center', fontWeight: 600, marginTop: 8 }}>
            Unidad asociada correctamente
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientUnitForm;
