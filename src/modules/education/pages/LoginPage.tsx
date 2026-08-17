import React, { useState } from 'react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import logoUrl from '../assets/LOGO.bmp';
import './LoginPage.css';

export const LoginPage = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');
        try {
            const response = await api.post('/auth/token/', formData);
            if (response.access) {
                await login(response.access, response.refresh);
            }
        } catch (error: any) {
            console.error(error);
            setErrorMsg("Identifiants invalides. Veuillez réessayer.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <img src={logoUrl} alt="Alliance One Logo" style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '12px' }} />
                    </div>
                    <h2 className="login-title" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0.5rem 0 0.2rem' }}>Alliance One</h2>
                    <p className="login-subtitle" style={{ color: '#d97706', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.8rem', margin: 0 }}>Unis pour exceller</p>
                    <p className="login-subtitle" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>Espace Institutionnel Sécurisé</p>
                </div>
                
                {errorMsg && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="username">Identifiant</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input 
                                id="username"
                                type="text"
                                className="login-input"
                                placeholder="Entrez votre identifiant"
                                name="username" 
                                value={formData.username} 
                                onChange={e => setFormData({ ...formData, username: e.target.value })} 
                                required 
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Mot de passe</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                id="password"
                                type="password"
                                className="login-input"
                                placeholder="Entrez votre mot de passe"
                                name="password" 
                                value={formData.password} 
                                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                                required 
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="login-button" disabled={submitting}>
                        {submitting ? (
                            <>
                                <div className="loader"></div>
                                <span>Authentification...</span>
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
