import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Building2, Send, ShieldCheck, 
  ExternalLink, CheckCircle2, ChevronRight, Moon, Sun, 
  Key, Globe, Bell
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { usePlatformStore } from '../../core/stores/platformStore';
import { API_HOST_URL } from '../../core/api/client';
import './EcosystemPages.css';

interface SettingsHubPageProps {
  onOpenTelegram: () => void;
}

export const SettingsHubPage: React.FC<SettingsHubPageProps> = ({ onOpenTelegram }) => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const theme = usePlatformStore((s) => s.theme);
  const toggleTheme = usePlatformStore((s) => s.toggleTheme);

  const [tgLinked, setTgLinked] = useState<boolean | null>(null);
  const [tgUsername, setTgUsername] = useState<string>('');

  useEffect(() => {
    const checkTelegramStatus = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (user?.email) headers['X-User-Email'] = user.email;

        const res = await fetch(`${API_HOST_URL}/api/integrations/telegram/status/`, { headers });
        if (res.ok) {
          const data = await res.json();
          setTgLinked(data.is_linked);
          if (data.telegram_username) setTgUsername(data.telegram_username);
        }
      } catch (err) {
        console.debug('Failed to fetch telegram status:', err);
      }
    };
    checkTelegramStatus();
  }, [token, user]);

  return (
    <div className="ecosystem-page-container">
      {/* Header */}
      <div className="eco-header-banner">
        <div className="eco-header-content">
          <div className="eco-badge-pill">
            <Settings size={14} />
            <span>Paramètres Généraux & Intégrations</span>
          </div>
          <h1>Configuration de votre Compte & Services</h1>
          <p>
            Gérez vos identifiants, vos intégrations externes et votre accès sécurisé à Alliance AI.
          </p>
        </div>
      </div>

      <div className="eco-main-content">
        {/* Profile & Organization Overview */}
        <div className="eco-cards-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="eco-feature-card">
            <div className="eco-card-header">
              <div className="eco-icon-wrap" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                <User size={22} />
              </div>
              <div>
                <h3>Profil Utilisateur</h3>
                <p>Vos informations de connexion</p>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div><strong>Email :</strong> {user?.email || 'benjaminadzessa@gmail.com'}</div>
              <div><strong>Nom :</strong> {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Benjamin Adzessa'}</div>
              <div><strong>Rôle :</strong> Administrateur</div>
            </div>
          </div>

          <div className="eco-feature-card">
            <div className="eco-card-header">
              <div className="eco-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                <Building2 size={22} />
              </div>
              <div>
                <h3>Organisation Active</h3>
                <p>Espace de travail et données associées</p>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div><strong>Organisation :</strong> {currentOrg?.name || 'Collège & Lycée Bilingue Émergence'}</div>
              <div><strong>Identifiant Tenant :</strong> <code style={{ fontSize: '12px' }}>{currentOrg?.id || 'default'}</code></div>
              <div><strong>Statut :</strong> Opérationnel & Sécurisé ✅</div>
            </div>
          </div>
        </div>

        {/* Telegram & AI Integration Spotlight */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Send size={22} color="#0088cc" />
            <span>Intégration Officielle Telegram & Alliance AI</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary, #64748b)', fontSize: '14px', marginBottom: '20px' }}>
            Connectez votre compte personnel Telegram pour interagir avec le bot officiel <strong>@AllianceOneAIBot</strong>, poser vos questions en langage naturel et valider des actions sécurisées.
          </p>

          <div 
            className="eco-feature-card" 
            style={{ 
              border: tgLinked ? '2px solid #10b981' : '2px solid #0088cc',
              background: tgLinked ? 'rgba(16, 185, 129, 0.03)' : 'rgba(0, 136, 204, 0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(0, 136, 204, 0.35)'
                  }}
                >
                  <Send size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Bot Telegram Alliance One</h3>
                    {tgLinked ? (
                      <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                        Connecté ✅
                      </span>
                    ) : (
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #bfdbfe' }}>
                        Non associé
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '6px 0 0 0', color: 'var(--color-text-secondary, #64748b)', fontSize: '13.5px' }}>
                    {tgLinked 
                      ? `Votre compte Telegram (${tgUsername ? `@${tgUsername}` : 'Connecté'}) est relié à votre profil Alliance One.`
                      : 'Associez votre compte en 1 clic pour activer les fonctionnalités IA sur votre smartphone ou desktop.'
                    }
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={onOpenTelegram}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    background: 'linear-gradient(135deg, #0088cc 0%, #0077b5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)'
                  }}
                >
                  <Send size={16} />
                  <span>{tgLinked ? 'Gérer la connexion Telegram' : 'Connecter Telegram Maintenant'}</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border, #e2e8f0)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary, #64748b)' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Questions et réponses sans délai</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary, #64748b)' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Changement d'organisation instantané</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary, #64748b)' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Validation par empreinte cryptographique</span>
              </div>
            </div>
          </div>
        </div>

        {/* System & Interface Settings */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            Préférences de l'Interface
          </h2>

          <div className="eco-feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>Apparence du Système</h4>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary, #64748b)', fontSize: '13px' }}>
                  Basculez entre le mode clair et le mode sombre selon votre confort visuel.
                </p>
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border, #e2e8f0)',
                  background: 'var(--color-bg-secondary, #f8fafc)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--color-text-primary, #0f172a)'
                }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
