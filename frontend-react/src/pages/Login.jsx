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
            <h2>Iniciar Sesión</h2>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
