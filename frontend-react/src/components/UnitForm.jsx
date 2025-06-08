import { useState, useEffect } from 'react';
import api from '../api/axios';
import SuccessModal from './SuccessModal';

const UnitForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    numero_unidad: '',
    tipo_unidad: '',
    metraje_cuadrado: '',
    precio_venta: '',
    estado: '',
    proyecto_id: '',
  });
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/proyectos');
        setProjects(res.data.data || []);
      } catch (err) {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Convert metraje_cuadrado and precio_venta to numbers
      const payload = {
        ...form,
        metraje_cuadrado: parseFloat(form.metraje_cuadrado),
        precio_venta: parseFloat(form.precio_venta),
      };
      await api.post('/unidades', payload);
      setForm({
        numero_unidad: '',
        tipo_unidad: '',
        metraje_cuadrado: '',
        precio_venta: '',
        estado: '',
        proyecto_id: '',
      });
      setSuccess({ open: true, message: 'Unidad creada correctamente.' });
      onSuccess?.();
    } catch (err) {
      setError('Error al crear la unidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-wrapper">
      <SuccessModal
        open={success.open}
        message={success.message}
        onClose={() => setSuccess({ open: false, message: '' })}
      />
      <form onSubmit={handleSubmit} className="project-form">
        <h2>Crear Unidad</h2>
        {error && <p className="text-red-600">{error}</p>}
        <div className="form-group">
          <label htmlFor="numero_unidad">Número de Unidad</label>
          <input
            id="numero_unidad"
            name="numero_unidad"
            type="text"
            value={form.numero_unidad}
            onChange={handleChange}
            placeholder="Ej: 101"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipo_unidad">Tipo de Unidad</label>
          <input
            id="tipo_unidad"
            name="tipo_unidad"
            type="text"
            value={form.tipo_unidad}
            onChange={handleChange}
            placeholder="Ej: Departamento, Casa, etc."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="metraje_cuadrado">Metraje Cuadrado</label>
          <input
            id="metraje_cuadrado"
            name="metraje_cuadrado"
            type="number"
            min="0"
            step="0.01"
            value={form.metraje_cuadrado}
            onChange={handleChange}
            placeholder="Ej: 75.5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio_venta">Precio de Venta</label>
          <input
            id="precio_venta"
            name="precio_venta"
            type="number"
            min="0"
            step="0.01"
            value={form.precio_venta}
            onChange={handleChange}
            placeholder="Ej: 120000000"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un estado</option>
            <option value="Disponible">Disponible</option>
            <option value="Vendido">Vendido</option>
            <option value="Reservado">Reservado</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="proyecto_id">Proyecto</label>
          <select
            id="proyecto_id"
            name="proyecto_id"
            value={form.proyecto_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <span className="loader"></span> : "Guardar Unidad"}
        </button>
      </form>
    </div>
  );
};

export default UnitForm;
