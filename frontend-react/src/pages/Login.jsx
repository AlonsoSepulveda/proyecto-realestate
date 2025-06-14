// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import '../css/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={email ? 'has-value' : ''}
                autoComplete="username"
              />
              <label htmlFor="login-email">Correo electrónico</label>
            </div>
            <div className="floating-label-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={password ? 'has-value' : ''}
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
              />
              <label htmlFor="login-password">Contraseña</label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12C3.2 7.2 7.8 4 12 4C16.2 4 20.8 7.2 23 12C20.8 16.8 16.2 20 12 20C7.8 20 3.2 16.8 1 12Z" stroke="#555" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="#555" strokeWidth="2"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12C3.2 7.2 7.8 4 12 4C16.2 4 20.8 7.2 23 12C20.8 16.8 16.2 20 12 20C7.8 20 3.2 16.8 1 12Z" stroke="#555" strokeWidth="2"/><path d="M4 4L20 20" stroke="#555" strokeWidth="2"/></svg>
                )}
              </button>
            </div>
            <button type="submit">Ingresar</button>
            <button
              type="button"
              style={{
                marginTop: 12,
                width: '100%',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = '/register'}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
