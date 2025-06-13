import { useState } from 'react';
import api from '../api/axios';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!nombre || !email || !password || !repeatPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await api.post('/register', {
        name: nombre,
        email,
        password,
      });
      setSuccess('¡Registro exitoso!');
      setNombre('');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <h2>Registro</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="floating-label-group">
              <input
                type="text"
                id="register-nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                className={nombre ? 'has-value' : ''}
                autoComplete="name"
              />
              <label htmlFor="register-nombre">Nombre</label>
            </div>
            <div className="floating-label-group">
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={email ? 'has-value' : ''}
                autoComplete="email"
              />
              <label htmlFor="register-email">Correo electrónico</label>
            </div>
            <div className="floating-label-group">
              <input
                type="password"
                id="register-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={password ? 'has-value' : ''}
                autoComplete="new-password"
              />
              <label htmlFor="register-password">Contraseña</label>
            </div>
            <div className="floating-label-group">
              <input
                type="password"
                id="register-repeat-password"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                required
                className={repeatPassword ? 'has-value' : ''}
                autoComplete="new-password"
              />
              <label htmlFor="register-repeat-password">Repetir contraseña</label>
            </div>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
            <button type="submit">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
}
