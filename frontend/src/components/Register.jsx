import React, { useState } from 'react';
import { MapPin, Eye, EyeOff, Loader2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import './Register.css';

const API_AUTH_URL = 'http://localhost:3000/api/auth';

/**
 * Componente de Registro para la Plataforma de Gestión Epidemiológica GeoSalud
 * Permite crear una nueva cuenta antes de ingresar al sistema
 */
export default function Register({ onRegisterSuccess, onBackToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validatePassword = (pwd) => {
        if (pwd.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }
        return null;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Validaciones
        if (!email || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_AUTH_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Error al crear la cuenta. Intenta nuevamente.');
                return;
            }

            // Registro exitoso
            setSuccess(true);
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Llamar callback si existe
            if (onRegisterSuccess) {
                setTimeout(() => {
                    onRegisterSuccess(data);
                }, 2000);
            }

        } catch (err) {
            console.error("Error de conexión:", err);
            setError('No se pudo conectar con el servidor. Verifica tu conexión.');

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-container">
            <div className="register-wrapper">

                {/* Header */}
                <div className="register-header">
                    <div className="logo-container">
                        <div className="logo-wrapper">
                            <div className="logo-gradient">
                                <MapPin className="logo-icon" />
                            </div>
                            <div className="status-indicator"></div>
                        </div>
                    </div>
                    <h1 className="register-title">
                        Crear Cuenta Nueva
                    </h1>
                    <p className="register-subtitle">
                        Regístrate para acceder al sistema de gestión de zonas sanitarias
                    </p>
                </div>

                {/* Register Card */}
                <div className="register-card">
                    {/* Mensaje de Error */}
                    {error && (
                        <div className="error-message">
                            <AlertCircle className="error-icon" />
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    {/* Mensaje de Éxito */}
                    {success && (
                        <div className="success-message">
                            <CheckCircle className="success-icon" />
                            <span className="success-text">
                                ¡Cuenta creada exitosamente! Redirigiendo al login...
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form">

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
                                    disabled={loading || success}
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
                                    placeholder="Mínimo 6 caracteres"
                                    className="form-input password-input"
                                    required
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle"
                                    disabled={loading || success}
                                >
                                    {showPassword ? (
                                        <EyeOff className="eye-icon" />
                                    ) : (
                                        <Eye className="eye-icon" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Campo de Confirmar Contraseña */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmar contraseña
                            </label>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    className="form-input password-input"
                                    required
                                    disabled={loading || success}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="password-toggle"
                                    disabled={loading || success}
                                >
                                    {showConfirmPassword ? (
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
                            disabled={loading || success}
                            className="submit-button"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="spinner-icon" />
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="button-icon" />
                                    Crear Cuenta
                                </>
                            )}
                        </button>

                        {/* Link para volver al login */}
                        <div className="login-link">
                            <p className="login-text">
                                ¿Ya tienes una cuenta?{' '}
                                <button
                                    type="button"
                                    onClick={onBackToLogin}
                                    className="link-button"
                                    disabled={loading}
                                >
                                    Inicia sesión aquí
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="register-footer">
                    <p className="footer-text">
                        Sistema restringido para personal de salud pública autorizado
                    </p>
                </div>
            </div>
        </div>
    );
}
