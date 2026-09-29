import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { AllianceLogo } from '../../design-system/components/AllianceLogo';
import { AllianceLoader } from '../../design-system/components/AllianceLoader';
import './AuthPage.css';

const GOOGLE_CLIENT_ID = '596917773675-hdbgpl1ftu0hok87imssjndmt9vtvdqs.apps.googleusercontent.com';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, loginWithGithub, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'login' | '2fa' | 'welcome'>('login');
  const [isTokenVerifying, setIsTokenVerifying] = useState(false);
  const [searchParams] = useSearchParams();

  // Vérification 2FA via URL token (Magic Link)
  useEffect(() => {
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    if (token) {
      verify2FA(token);
    } else if (code) {
      handleGithubCallback(code);
    }
  }, [searchParams]);

  const handleGithubCallback = async (code: string) => {
    setIsTokenVerifying(true);
    try {
      const success = await loginWithGithub(code);
      if (success) {
        redirectAfterAuth();
      } else {
        setStep('login');
      }
    } finally {
      setIsTokenVerifying(false);
    }
  };

  const verify2FA = async (token: string) => {
    setIsTokenVerifying(true);
    try {
      const response = await fetch('http://localhost:8000/api/core/auth/verify-2fa/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      
      if (response.ok) {
        useAuthStore.setState({ 
          user: data.user, 
          accessToken: data.access, 
          isAuthenticated: true,
          error: null 
        });
        
        if (data.user?.onboarding_completed) {
           if (data.user.email) {
             localStorage.setItem(`alliance-onboarding-completed_${data.user.email}`, 'true');
           }
           localStorage.setItem('alliance-onboarding-completed', 'true');
        }

        setStep('welcome'); // Show welcome animation
        setTimeout(() => {
          navigate(data.user.onboarding_completed ? '/app' : '/app/onboarding', { replace: true });
        }, 3000);
      } else {
        // Set an error if needed
        setStep('login');
      }
    } catch (e) {
      setStep('login');
    } finally {
      setIsTokenVerifying(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [mode]);

  useEffect(() => {
    const initializeGoogle = () => {
      try {
        const mountNode = document.getElementById('google-signin-mount');
        if ((window as any).google?.accounts?.id && mountNode) {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
          });
          (window as any).google.accounts.id.renderButton(
            mountNode,
            { 
              theme: 'outline', 
              size: 'large', 
              type: 'icon',
              shape: 'circle'
            }
          );
        }
      } catch (err) {
        console.warn('Google GSI initialization notice:', err);
      }
    };

    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
      return () => { script.remove(); };
    } else {
      initializeGoogle();
    }
  }, [mode, step, isTokenVerifying]);

  const redirectAfterAuth = () => {
    const currentUser = useAuthStore.getState().user;
    const isCompleted = currentUser?.onboarding_completed ||
      (currentUser?.email && localStorage.getItem(`alliance-onboarding-completed_${currentUser.email}`) === 'true');

    if (isCompleted) {
      navigate('/app', { replace: true });
    } else {
      navigate('/app/onboarding', { replace: true });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    if (response.credential) {
      const success = await loginWithGoogle(response.credential);
      if (success) {
        redirectAfterAuth();
      }
    }
  };

  const handleGithubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23lia1vLDgsnmCaQOY&scope=user:email`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    useAuthStore.setState({ error: null });
    const endpoint = mode === 'login' ? '/api/core/auth/login/' : '/api/core/auth/register/';

    try {
      useAuthStore.setState({ isLoading: true });
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.requires_2fa) {
          setStep('2fa');
        } else {
          // Fallback if not 2fa
          useAuthStore.setState({ user: data.user, accessToken: data.access, isAuthenticated: true });
          redirectAfterAuth();
        }
      } else {
        useAuthStore.setState({ error: data.detail || 'Identifiants incorrects' });
      }
    } catch (err) {
      console.error(err);
      useAuthStore.setState({ error: 'Erreur de connexion au serveur.' });
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  };

  return (
    <div className="gh-auth-page">
      {/* LEFT SIDE - VISUAL */}
      <div className="gh-auth-left">
        <div className="gh-leaf-wrapper">
          {/* Decorative background lines */}
          <svg className="gh-leaf-deco" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 100 Q 50 10 100 100 T 190 100" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
            <path d="M10 120 Q 60 30 100 120 T 190 120" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
            <path d="M10 140 Q 70 50 100 140 T 190 140" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
            <path d="M10 160 Q 80 70 100 160 T 190 160" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
            <path d="M10 180 Q 90 90 100 180 T 190 180" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
          </svg>
          
          <div className="gh-leaf-shape">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
              alt="Professional" 
              className="gh-leaf-img"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="gh-auth-right">
        {isTokenVerifying ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
            <AllianceLoader />
            <h2 style={{ color: '#0f172a', fontWeight: 600 }}>Vérification sécurisée...</h2>
          </div>
        ) : step === 'welcome' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', textAlign: 'center' }}
          >
            <div style={{ background: '#d1fae5', padding: '24px', borderRadius: '50%', color: '#10b981' }}>
              <Sparkles size={48} />
            </div>
            <h1 style={{ color: '#0f172a', fontWeight: 800, fontSize: '32px', fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)" }}>
              Bienvenue dans l'ère de l'intelligence.
            </h1>
            <p style={{ color: '#64748b' }}>Préparation de votre espace d'excellence...</p>
          </motion.div>
        ) : step === '2fa' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gh-auth-container"
          >
            <div className="gh-brand" style={{ marginBottom: '32px' }}>
              <AllianceLogo size={32} color="var(--ao-elegant-primary, #0f172a)" />
              <span className="gh-brand-text">Alliance One</span>
            </div>
            <div style={{ background: '#e0e7ff', padding: '16px', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Mail size={32} color="#4f46e5" />
            </div>
            <h1 className="gh-heading" style={{ fontSize: '28px' }}>
              Vérifiez votre boîte mail
            </h1>
            <p className="gh-subheading" style={{ marginBottom: '32px' }}>
              Pour des raisons de sécurité (2FA), nous vous avons envoyé un lien de confirmation à l'adresse <strong>{email}</strong>. Cliquez dessus pour accéder à votre espace.
            </p>
            <button onClick={() => setStep('login')} className="gh-submit-btn" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}>
              Retour à la connexion
            </button>
          </motion.div>
        ) : (
          <div className="gh-auth-container">
            <div className="gh-brand">
              <AllianceLogo size={32} color="var(--ao-elegant-primary, #0f172a)" />
              <span className="gh-brand-text">Alliance One</span>
            </div>

            <h1 className="gh-heading">
              <span className="gh-heading-italic">{mode === 'login' ? 'Accédez' : 'Rejoignez'}</span> à<br/>
              votre espace.
            </h1>

            <p className="gh-subheading">
              Travaillez plus intelligemment, collaborez plus rapidement et prenez le contrôle de votre organisation avec Alliance One.
            </p>

          <form className="gh-form" onSubmit={handleSubmit}>
            <div className="gh-input-group">
              <input
                type="email"
                className="gh-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="gh-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="gh-submit-btn" disabled={isLoading}>
              {isLoading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
            </button>
          </form>

          <div className="gh-social-section">
            <span className="gh-social-text">Ou continuer avec</span>
            <div className="gh-social-buttons">
              <div id="google-signin-mount" className="gh-social-btn-google"></div>
              <button type="button" className="gh-social-btn" onClick={handleGithubLogin}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className="gh-social-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
            </div>
          </div>

          <p className="gh-legal">
            En continuant, vous acceptez la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a> et les <a href="/terms" target="_blank" rel="noopener noreferrer">Conditions d'utilisation</a> d'Alliance One.
          </p>

          <div className="gh-toggle-mode">
            {mode === 'login' ? (
              <p>Pas de compte ? <a onClick={() => navigate('/register')}>Rejoignez-nous</a></p>
            ) : (
              <p>Déjà membre ? <a onClick={() => navigate('/login')}>Connectez-vous</a></p>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
