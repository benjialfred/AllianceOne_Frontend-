import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, User, Building2, Send, ShieldCheck, 
  ExternalLink, CheckCircle2, ChevronRight, Moon, Sun, 
  Key, Globe, Bell, Save, Upload, FileText, Image as ImageIcon, Camera, FolderOpen,
  X,
  Package,
  FileBadge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../core/stores/authStore';
import { usePlatformStore } from '../../core/stores/platformStore';
import { API_HOST_URL } from '../../core/api/client';
import { useNavigate } from 'react-router-dom';
import './SettingsHub.css';

interface SettingsHubPageProps {
  onOpenTelegram: () => void;
}

export const SettingsHubPage: React.FC<SettingsHubPageProps> = ({ onOpenTelegram }) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const token = useAuthStore((s) => s.accessToken);
  
  const currentOrg = usePlatformStore((s) => s.currentOrganization);
  const theme = usePlatformStore((s) => s.theme);
  const toggleTheme = usePlatformStore((s) => s.toggleTheme);

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'integrations' | 'preferences'>('profile');

  const [tgLinked, setTgLinked] = useState<boolean | null>(null);
  const [tgUsername, setTgUsername] = useState<string>('');

  // Form states
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
  
  const [orgName, setOrgName] = useState(currentOrg?.name || '');
  const [orgType, setOrgType] = useState('Établissement Scolaire');
  const [orgRegistration, setOrgRegistration] = useState('RC/YAO/2023/B/1234');
  const [orgAddress, setOrgAddress] = useState('BP 1234, Yaoundé, Cameroun');
  const [orgLogoPreview, setOrgLogoPreview] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState<'profile' | 'organization'>('profile');

  // Hidden file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const orgLogoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, first_name: firstName, last_name: lastName, email: email, avatar_url: avatarPreview || undefined });
      }
      setIsSaving(false);
      setSuccessType('profile');
      setShowSuccessModal(true);
    }, 800);
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessType('organization');
      setShowSuccessModal(true);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="sh-root">
      
      <div className="sh-header-banner">
        <h1 className="sh-title">Paramètres Généraux</h1>
        <p className="sh-subtitle">
          Contrôlez les informations de votre compte et la configuration de l'espace de travail.
        </p>

        {/* Top Tabs */}
        <div className="sh-tabs">
          {[
            { id: 'profile', label: 'Profil Utilisateur', icon: User },
            { id: 'organization', label: 'Organisation', icon: Building2 },
            { id: 'integrations', label: 'Intégrations', icon: Send },
            { id: 'preferences', label: 'Préférences', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`sh-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sh-content-area">
        <AnimatePresence mode="wait">
          
          {/* ─── PROFIL ─── */}
          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sh-form-panel"
            >
              <h2 className="sh-section-title">Informations Personnelles</h2>
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Avatar Upload */}
                <div className="sh-avatar-upload">
                  <div 
                    className="sh-avatar-circle"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>
                        {firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="avatar-hover-overlay">
                      <Camera color="white" size={20} />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#0f172a' }}>Photo de profil</h4>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Formats acceptés: JPG, PNG. Taille max: 2MB.</p>
                    <button type="button" onClick={() => avatarInputRef.current?.click()} className="sh-btn-outline">
                      Changer la photo
                    </button>
                    <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, setAvatarPreview)} />
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="sh-input-group">
                    <label className="sh-input-label">Prénom</label>
                    <input type="text" className="sh-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div className="sh-input-group">
                    <label className="sh-input-label">Nom</label>
                    <input type="text" className="sh-input" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="sh-input-group">
                    <label className="sh-input-label">Adresse Email</label>
                    <input type="email" className="sh-input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="sh-input-group">
                    <label className="sh-input-label">Rôle & Autorisations</label>
                    <input type="text" className="sh-input" value="Administrateur Système" disabled />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="submit" className="sh-btn-primary" disabled={isSaving}>
                    <Save size={18} />
                    {isSaving ? 'Enregistrement...' : 'Mettre à jour le profil'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ─── ORGANISATION ─── */}
          {activeTab === 'organization' && (
            <motion.div 
              key="organization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {/* General Info Panel */}
              <div className="sh-form-panel">
                <h2 className="sh-section-title">Identité de l'Organisation</h2>
                <form onSubmit={handleSaveOrg} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Org Logo Upload */}
                  <div className="sh-avatar-upload">
                    <div 
                      className="sh-avatar-circle"
                      onClick={() => orgLogoInputRef.current?.click()}
                      style={{ cursor: 'pointer', borderRadius: '16px' }}
                    >
                      {orgLogoPreview ? (
                        <img src={orgLogoPreview} alt="Org Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Building2 size={32} color="#94a3b8" />
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#0f172a' }}>Logo de l'Entité</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>Ce logo sera visible sur le Hub et les documents générés.</p>
                      <button type="button" onClick={() => orgLogoInputRef.current?.click()} className="sh-btn-outline">
                        Uploader le logo
                      </button>
                      <input type="file" ref={orgLogoInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, setOrgLogoPreview)} />
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: 0 }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div className="sh-input-group">
                      <label className="sh-input-label">Nom officiel</label>
                      <input type="text" className="sh-input" value={orgName} onChange={e => setOrgName(e.target.value)} />
                    </div>
                    <div className="sh-input-group">
                      <label className="sh-input-label">Type d'organisation</label>
                      <select className="sh-input" value={orgType} onChange={e => setOrgType(e.target.value)}>
                        <option>Établissement Scolaire</option>
                        <option>Entreprise Commerciale</option>
                        <option>ONG / Association</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="sh-input-group">
                      <label className="sh-input-label">Immatriculation (RCCM/NIU/SIRET)</label>
                      <input type="text" className="sh-input" value={orgRegistration} onChange={e => setOrgRegistration(e.target.value)} />
                    </div>
                    <div className="sh-input-group">
                      <label className="sh-input-label">Adresse Principale</label>
                      <input type="text" className="sh-input" value={orgAddress} onChange={e => setOrgAddress(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button type="submit" className="sh-btn-primary" disabled={isSaving}>
                      <Save size={18} />
                      {isSaving ? 'Enregistrement...' : 'Mettre à jour l\'organisation'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Legal Documents Panel */}
              <div className="sh-form-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 className="sh-section-title" style={{ margin: 0 }}>Documents Légaux & Conformité</h2>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#059669', background: '#d1fae5', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}>
                    <ShieldCheck size={16} /> Vérifié
                  </span>
                </div>
                
                <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>
                  Les documents soumis lors de l'onboarding pour valider votre compte. Ajoutez ou mettez à jour les pièces justificatives.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Doc Item */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                      <FileText size={24} color="#0f172a" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a' }}>Registre du Commerce (RCCM)</h4>
                      <span style={{ fontSize: '13px', color: '#059669', fontWeight: 500 }}>Approuvé le 12 Sept 2026</span>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }} title="Remplacer">
                      <Upload size={18} />
                    </button>
                  </div>

                  {/* Doc Item */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                      <FileBadge size={24} color="#0f172a" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#0f172a' }}>Carte de Contribuable (NIU)</h4>
                      <span style={{ fontSize: '13px', color: '#059669', fontWeight: 500 }}>Approuvé le 12 Sept 2026</span>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }} title="Remplacer">
                      <Upload size={18} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => docInputRef.current?.click()}
                  style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '16px', background: 'transparent', color: '#0f172a', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginTop: '24px', transition: 'all 0.2s' }}
                >
                  <FolderOpen size={20} />
                  Ajouter un nouveau document juridique
                </button>
                <input type="file" ref={docInputRef} style={{ display: 'none' }} accept=".pdf,.jpg,.png" />

              </div>
            </motion.div>
          )}

          {/* ─── INTEGRATIONS ─── */}
          {activeTab === 'integrations' && (
            <motion.div 
              key="integrations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sh-form-panel"
            >
              <h2 className="sh-section-title">Services Externes</h2>
              
              {/* Telegram */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '16px', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #229ED9 0%, #0088cc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 8px 16px rgba(0, 136, 204, 0.2)' }}>
                    <Send size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Telegram Bot API</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                      {tgLinked 
                        ? `Compte actif : @${tgUsername || 'Utilisateur'}`
                        : 'Recevez des notifications et commandez l\'IA via Telegram.'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenTelegram}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0088cc', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0, 136, 204, 0.2)'
                  }}
                >
                  <span>{tgLinked ? 'Gérer la connexion' : 'Connecter Telegram'}</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── PREFERENCES ─── */}
          {activeTab === 'preferences' && (
            <motion.div 
              key="preferences"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sh-form-panel"
            >
              <h2 className="sh-section-title">Interface & Système</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0f172a' }}>Thème de l'Application</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Basculer entre le mode clair (Prestige) et sombre.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="sh-btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === 'dark' ? 'Activer Mode Clair' : 'Activer Mode Sombre'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0f172a' }}>Langue par défaut</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Langue utilisée dans toute la plateforme.</p>
                </div>
                <select className="sh-input" style={{ width: '200px' }}>
                  <option>Français (FR)</option>
                  <option>English (US)</option>
                </select>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      {/* SUCCESS MODAL IN-APP */}
      {showSuccessModal && (
        <div className="sh-modal-backdrop">
          <div className="sh-modal-content">
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={24} />
            </button>
            <div className="sh-modal-icon-wrapper">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="sh-modal-title">Action Réussie !</h3>
            <p className="sh-modal-subtitle">
              {successType === 'profile' 
                ? 'Votre profil a été mis à jour avec succès.' 
                : 'Les informations de votre organisation ont été enregistrées.'}
              <br/>Que souhaitez-vous configurer ensuite ?
            </p>

            <div className="sh-suggestion-list">
              {successType === 'profile' && (
                <div className="sh-suggestion-item" onClick={() => { setShowSuccessModal(false); setActiveTab('organization'); }}>
                  <div className="sh-suggestion-icon"><Building2 size={20} /></div>
                  <div className="sh-suggestion-text">
                    <h4>Configurer l'Organisation</h4>
                    <p>Définissez le nom, le type et l'adresse de votre entité.</p>
                  </div>
                  <ChevronRight size={20} color="#94a3b8" />
                </div>
              )}
              {successType === 'organization' && (
                <div className="sh-suggestion-item" onClick={() => { setShowSuccessModal(false); setActiveTab('integrations'); }}>
                  <div className="sh-suggestion-icon"><Send size={20} /></div>
                  <div className="sh-suggestion-text">
                    <h4>Connecter Telegram</h4>
                    <p>Reliez votre compte pour piloter l'IA depuis votre smartphone.</p>
                  </div>
                  <ChevronRight size={20} color="#94a3b8" />
                </div>
              )}
              
              <div className="sh-suggestion-item" onClick={() => { setShowSuccessModal(false); navigate('/app/marketplace'); }}>
                <div className="sh-suggestion-icon"><Package size={20} /></div>
                <div className="sh-suggestion-text">
                  <h4>Explorer le Catalogue</h4>
                  <p>Découvrez et installez des applications métiers pour votre espace.</p>
                </div>
                <ChevronRight size={20} color="#94a3b8" />
              </div>
            </div>

            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{ width: '100%', padding: '14px', marginTop: '32px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for Avatar Hover effect */}
      <style>{`
        .avatar-hover-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
