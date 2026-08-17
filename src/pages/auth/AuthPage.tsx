/**
 * ALLIANCE ONE — AUTH PAGE
 * Cinematic split-screen login/register inspired by Claude's auth UX.
 * Left: Diagonal video showcase with rotating 3D product demos.
 * Right: Pristine form with Google OAuth + email/password.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  User, 
  Building2, 
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import logoSrc from '../../assets/logo.png';
import campusVideo from '../../assets/Campus_Hero_Dashboard_prin.mp4';
import schoolVideo from '../../assets/Cour_d_ecole_Duration_s.mp4';
import corpVideo from '../../assets/Create_an_ultra_realistic_corp.mp4';
import './AuthPage.css';

const GOOGLE_CLIENT_ID = '596917773675-hdbgpl1ftu0hok87imssjndmt9vtvdqs.apps.googleusercontent.com';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Video carousel
  const videos = [campusVideo, schoolVideo, corpVideo];
  const videoLabels = [
    'Alliance Hub — Votre cockpit opérationnel',
    'Éducation — Gestion complète d\'établissement',
    'Entreprise — Infrastructure cloud moderne'
  ];
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on mode switch
  useEffect(() => {
    clearError();
  }, [mode]);

  // Video rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Google Sign-In initialization
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: true,
            itp_support: true,
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { 
              theme: 'outline', 
              size: 'large', 
              width: '100%',
              text: mode === 'login' ? 'signin_with' : 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'center'
            }
          );
        }
      } catch (err) {
        console.warn('Google GSI initialization notice:', err);
      }
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [mode]);

  const handleGoogleResponse = async (response: any) => {
    if (response.credential) {
      const success = await loginWithGoogle(response.credential);
      if (success) {
        navigate('/app', { replace: true });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'login') {
      const success = await login(email, password);
      if (success) navigate('/app', { replace: true });
    } else {
      const success = await register({ 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName,
        organization_name: orgName || undefined
      });
      if (success) navigate('/app', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      {/* ───────── LEFT: CINEMATIC VIDEO PANEL ───────── */}
      <div className="auth-showcase">
        <div className="auth-showcase-overlay" />
        
        {/* Video background with crossfade */}
        <AnimatePresence mode="wait">
          <motion.video
            key={activeVideo}
            className="auth-showcase-video"
            src={videos[activeVideo]}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Showcase content */}
        <div className="auth-showcase-content">
          <div className="auth-showcase-brand">
            <img src={logoSrc} alt="Alliance One" className="auth-showcase-logo" />
          </div>

          <div className="auth-showcase-text">
            <motion.h1
              className="auth-showcase-headline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The Operating System<br />for Organizations
            </motion.h1>
            <motion.p
              className="auth-showcase-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Un environnement unifié qui réunit vos applications,
              vos données, votre IA et vos équipes.
            </motion.p>
          </div>

          {/* Video indicator dots */}
          <div className="auth-showcase-indicators">
            {videos.map((_, idx) => (
              <button
                key={idx}
                className={`indicator-dot ${idx === activeVideo ? 'active' : ''}`}
                onClick={() => setActiveVideo(idx)}
              >
                <span className="indicator-label">{videoLabels[idx]}</span>
              </button>
            ))}
          </div>

          {/* Trust badges */}
          <div className="auth-showcase-trust">
            <div className="trust-item">
              <Shield size={14} />
              <span>Chiffrement AES-256</span>
            </div>
            <div className="trust-item">
              <Zap size={14} />
              <span>Offline First</span>
            </div>
          </div>
        </div>

        {/* Diagonal clip */}
        <div className="auth-diagonal-edge" />
      </div>

      {/* ───────── RIGHT: FORM PANEL ───────── */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          {/* Mobile logo */}
          <div className="auth-mobile-brand">
            <img src={logoSrc} alt="Alliance One" className="auth-mobile-logo" />
          </div>

          {/* Header */}
          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Bon retour.' : 'Créez votre environnement.'}
            </h2>
            <p className="auth-form-subtitle">
              {mode === 'login'
                ? 'Connectez-vous à votre espace Alliance One.'
                : 'Configurez votre organisation sur Alliance One.'}
            </p>
          </div>

          {/* Google OAuth button */}
          <div className="auth-google-wrapper">
            <div id="google-signin-btn" className="google-btn-mount"></div>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">ou par email</span>
            <span className="auth-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="auth-form-row">
                <div className="auth-input-group">
                  <label className="auth-label">Prénom</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Benjamin"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Nom</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Alfred"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Adresse email</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="vous@organisation.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">
                Mot de passe
                {mode === 'login' && (
                  <a href="#" className="auth-forgot-link">Mot de passe oublié ?</a>
                )}
              </label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="auth-input-group">
                <label className="auth-label">
                  Organisation
                  <span className="auth-label-optional">optionnel</span>
                </label>
                <div className="auth-input-wrapper">
                  <Building2 size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Nom de votre organisation"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Error display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="auth-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Se connecter' : 'Créer mon environnement'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="auth-toggle-mode">
            {mode === 'login' ? (
              <p>
                Pas encore de compte ?{' '}
                <a onClick={() => navigate('/register')} className="auth-link">
                  Créer un environnement
                  <ChevronRight size={14} />
                </a>
              </p>
            ) : (
              <p>
                Déjà membre ?{' '}
                <a onClick={() => navigate('/login')} className="auth-link">
                  Se connecter
                  <ChevronRight size={14} />
                </a>
              </p>
            )}
          </div>

          {/* Legal */}
          {mode === 'register' && (
            <p className="auth-legal">
              En créant un compte, vous acceptez les{' '}
              <a href="#">Conditions d'utilisation</a> et la{' '}
              <a href="#">Politique de confidentialité</a> d'Alliance One.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
