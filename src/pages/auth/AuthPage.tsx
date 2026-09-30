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
        setStep('welcome'); // Show welcome animation
        setTimeout(() => {
          redirectAfterAuth();
        }, 3000);
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
    if (isAuthenticated && step !== 'welcome') {
      redirectAfterAuth();
    }
  }, [isAuthenticated, step]);

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

    const from = location.state?.from?.pathname || '/app';

    if (isCompleted) {
      navigate(from, { replace: true });
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
    <div className="auth-page-root">
      {/* Immersive Animated Background */}
      <div className="auth-ambient-bg">
        <div className="auth-ambient-blob-1"></div>
        <div className="auth-ambient-blob-2"></div>
      </div>

      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-brand" onClick={() => navigate('/')}>
          <AllianceLogo size={28} color="#ffffff" />
          <span className="auth-brand-text">Alliance One</span>
        </div>

        {isTokenVerifying ? (
          <div className="flex flex-col items-center justify-center py-12 gap-6 w-full">
            <AllianceLoader />
            <h2 className="text-xl font-bold text-white">Vérification sécurisée...</h2>
          </div>
        ) : step === 'welcome' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="auth-icon-circle text-green-400 border-green-400/20 bg-green-400/10">
              <Sparkles size={32} />
            </div>
            <h1 className="auth-title">Authentification réussie</h1>
            <p className="auth-subtitle">Préparation de votre espace de travail intelligent...</p>
          </motion.div>
        ) : step === '2fa' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full text-center"
          >
            <div className="auth-icon-circle text-white">
              <Mail size={28} />
            </div>
            <h1 className="auth-title">Vérifiez votre boîte mail</h1>
            <p className="auth-subtitle">
              Pour des raisons de sécurité, nous vous avons envoyé un lien de connexion magique à l'adresse <br/><strong className="text-white mt-1 block">{email}</strong>
            </p>
            <button onClick={() => setStep('login')} className="auth-btn-primary !bg-transparent !text-white border !border-white/20 hover:!bg-white/5">
              Retour
            </button>
          </motion.div>
        ) : (
          <div className="w-full">
            <h1 className="auth-title">
              {mode === 'login' ? 'Bienvenue' : 'Créer un compte'}
            </h1>
            <p className="auth-subtitle">
              {mode === 'login' 
                ? 'Connectez-vous pour accéder à votre infrastructure unifiée.'
                : 'Déployez votre espace de travail intelligent en quelques secondes.'}
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="auth-input"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="auth-error-msg">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Traitement...
                  </>
                ) : (
                  mode === 'login' ? 'Continuer avec l\'Email' : 'Continuer avec l\'Email'
                )}
              </button>
            </form>

            <div className="auth-divider">Ou continuer avec</div>

            <div className="auth-social-group">
              <div id="google-signin-mount" className="auth-google-wrapper"></div>
              <button type="button" className="auth-social-btn" onClick={handleGithubLogin}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>

            <div className="auth-footer">
              {mode === 'login' ? (
                <span>Pas encore de compte ? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Rejoignez-nous</a></span>
              ) : (
                <span>Déjà membre ? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Connectez-vous</a></span>
              )}
            </div>

            <p className="auth-legal">
              En continuant, vous acceptez notre <a href="/privacy-policy" target="_blank">Politique de confidentialité</a> et nos <a href="/terms" target="_blank">Conditions d'utilisation</a>.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
