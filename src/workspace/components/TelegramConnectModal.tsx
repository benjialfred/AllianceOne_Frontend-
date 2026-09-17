import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, ExternalLink, Copy, Check, 
  Clock, ShieldCheck, RefreshCw, Unlink, AlertCircle
} from 'lucide-react';
import { API_HOST_URL } from '../../core/api/client';
import { useAuthStore } from '../../core/stores/authStore';
import './TelegramConnectModal.css';

interface TelegramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TelegramStatus {
  is_linked: boolean;
  telegram_user_id?: number;
  telegram_username?: string;
  first_name?: string;
  active_organization?: string;
  verified_at?: string;
}

interface LinkCodeResponse {
  code: string;
  expires_in_seconds: number;
  deep_link: string;
  bot_username: string;
}

export const TelegramConnectModal: React.FC<TelegramConnectModalProps> = ({ isOpen, onClose }) => {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TelegramStatus | null>(null);
  const [linkData, setLinkData] = useState<LinkCodeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (user?.email) {
      headers['X-User-Email'] = user.email;
    }
    return headers;
  };

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_HOST_URL}/api/integrations/telegram/status/`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (!data.is_linked) {
          generateCode();
        }
      } else {
        // Fallback: generate code
        generateCode();
      }
    } catch (err: any) {
      console.warn('Could not fetch telegram status, generating code directly', err);
      generateCode();
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_HOST_URL}/api/integrations/telegram/link-code/`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: Impossible de générer le code de liaison.`);
      }
      const data: LinkCodeResponse = await res.json();
      setLinkData(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du code.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!window.confirm('Voulez-vous vraiment dissocier votre compte Telegram ?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_HOST_URL}/api/integrations/telegram/unlink/`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        setStatus({ is_linked: false });
        generateCode();
      }
    } catch (err: any) {
      setError('Erreur lors de la déconnexion.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!linkData?.code) return;
    navigator.clipboard.writeText(linkData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="tg-modal-overlay" onClick={onClose}>
        <motion.div 
          className="tg-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="tg-modal-header">
            <div className="tg-header-icon-wrapper">
              <Send size={24} className="tg-header-icon" />
            </div>
            <div className="tg-header-text">
              <h3>Connecter Telegram à Alliance One</h3>
              <p>Pilotez votre organisation et échangez avec Alliance AI sur Telegram</p>
            </div>
            <button className="tg-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="tg-modal-body">
            {error && (
              <div className="tg-alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {status?.is_linked ? (
              /* State: Already Connected */
              <div className="tg-linked-container">
                <div className="tg-success-badge">
                  <ShieldCheck size={20} className="tg-success-icon" />
                  <span>Compte Telegram Vérifié & Connecté</span>
                </div>

                <div className="tg-details-box">
                  <div className="tg-detail-row">
                    <span className="tg-label">Utilisateur Telegram</span>
                    <strong className="tg-val">{status.first_name || status.telegram_username || 'Utilisateur vérifié'}</strong>
                  </div>
                  {status.telegram_username && (
                    <div className="tg-detail-row">
                      <span className="tg-label">Identifiant (@)</span>
                      <strong className="tg-val">@{status.telegram_username}</strong>
                    </div>
                  )}
                  <div className="tg-detail-row">
                    <span className="tg-label">Organisation Active</span>
                    <strong className="tg-val">{status.active_organization || 'Alliance One'}</strong>
                  </div>
                </div>

                <div className="tg-actions-row">
                  <a 
                    href="https://t.me/AllianceOneAIBot" 
                    target="_blank" 
                    rel="noreferrer"
                    className="tg-primary-btn"
                  >
                    <Send size={16} />
                    <span>Ouvrir @AllianceOneAIBot</span>
                    <ExternalLink size={14} />
                  </a>

                  <button 
                    className="tg-danger-btn" 
                    onClick={handleUnlink}
                    disabled={loading}
                  >
                    <Unlink size={16} />
                    <span>Dissocier</span>
                  </button>
                </div>
              </div>
            ) : (
              /* State: Not Connected (Display Code & 1-Click Link) */
              <div className="tg-connect-container">
                <div className="tg-steps-guide">
                  <div className="tg-step-item">
                    <span className="tg-step-number">1</span>
                    <div className="tg-step-desc">
                      <strong>Option 1 : Connexion en 1 clic (Recommandé)</strong>
                      <p>Cliquez sur le bouton bleu ci-dessous pour ouvrir automatiquement le bot Telegram officiel avec votre code sécurisé déjà injecté.</p>
                    </div>
                  </div>
                </div>

                {linkData && (
                  <div className="tg-direct-link-box">
                    <a 
                      href={linkData.deep_link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="tg-big-cta-btn"
                    >
                      <Send size={18} />
                      <span>Ouvrir Telegram & Associer Mon Compte</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}

                <div className="tg-divider-or">
                  <span>OU SAISIE MANUELLE</span>
                </div>

                <div className="tg-step-item">
                  <span className="tg-step-number">2</span>
                  <div className="tg-step-desc">
                    <strong>Option 2 : Code personnel à usage unique</strong>
                    <p>Ouvrez <code>@AllianceOneAIBot</code> dans Telegram et envoyez la commande :</p>
                  </div>
                </div>

                {linkData ? (
                  <div className="tg-code-card">
                    <div className="tg-code-display">
                      <code>{linkData.code}</code>
                    </div>
                    <button className="tg-copy-btn" onClick={copyCode}>
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      <span>{copied ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="tg-loading-box">
                    <RefreshCw size={20} className="tg-spin" />
                    <span>Génération de votre code sécurisé...</span>
                  </div>
                )}

                <div className="tg-footer-note">
                  <Clock size={14} />
                  <span>Ce code est à usage unique et expire dans 10 minutes pour votre sécurité.</span>
                  <button className="tg-refresh-link" onClick={generateCode} disabled={loading}>
                    Actualiser le code
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
