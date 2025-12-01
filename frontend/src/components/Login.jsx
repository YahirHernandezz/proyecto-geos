import React, { useState } from 'react';
import { MapPin, Eye, EyeOff, Loader2, Shield, Activity, AlertCircle } from 'lucide-react';
import './Login.css';

const API_AUTH_URL = 'http://localhost:3000/api/auth';

/**
 * Componente de Login para la Plataforma de Gestión Epidemiológica GeoSalud
 * Sistema de visualización y delimitación de zonas sanitarias
 */
export default function App({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
        return;
      }
      
      // Login exitoso
      localStorage.setItem('token', data.token);
      onLogin && onLogin(data);
      
    } catch (err) {
      console.error("Error de conexión:", err);
      setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        
        {/* Header */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-wrapper">
              <div className="logo-gradient">
                <MapPin className="logo-icon" />
              </div>
              <div className="status-indicator"></div>
            </div>
          </div>
          <h1 className="login-title">
            GeoSalud
          </h1>
          <p className="login-subtitle">
            Accede al sistema de gestión de zonas sanitarias
          </p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Mensaje de Error */}
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            
            {/* Campo de Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@salud.gob.mx"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo de Contraseña */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="form-input password-input"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="eye-icon" />
                  ) : (
                    <Eye className="eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de Submit */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <Loader2 className="spinner-icon" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Link para ir al registro */}
            <div className="register-link">
              <p className="register-text">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={onGoToRegister}
                  className="link-button"
                  disabled={loading}
                >
                  Crear cuenta nueva
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            Sistema restringido para personal de salud pública autorizado
          </p>
        </div>
      </div>
    </div>
  );
}