// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import '../css/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-image">
        <img src="../public/LogoProyectoRealEstate.png" alt="Logo sistema" />
      </div>

      <div className="login-container">
        <div className="login-box">
          <img src="../public/logo_cotizacion.png" alt="Logo" className="login-logo" />
          <form onSubmit={handleLogin} className="login-form">
            <h2>Inicio de Sesión</h2>
            <div className="floating-label-group">
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={email ? 'has-value' : ''}
                autoComplete="username"
              />
              <label htmlFor="login-email">Correo electrónico</label>
            </div>
            <div className="floating-label-group">
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={password ? 'has-value' : ''}
                autoComplete="current-password"
              />
              <label htmlFor="login-password">Contraseña</label>
            </div>
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
