/**
 * ALLIANCE ONE — ONBOARDING FLOW (V2 REBUILT)
 * Wizard multi-étapes exécutif & immersif (Obsidian, Titane & Or).
 * 5 étapes : Bienvenue → Organisation → Secteur → Modules → Récapitulatif
 * Garantie de persistance : une fois validé ou passé, l'onboarding ne réapparaît plus jamais.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  MapPin,
  Users,
  Globe,
  Phone,
  FileText,
  Rocket,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Sprout,
  Briefcase,
  Heart,
  Factory,
  Cpu,
  LogOut,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/authStore';
import { usePlatformStore } from '../../core/stores/platformStore';
import { onboardingApi, type OnboardingSubmitPayload } from '../../core/api/onboarding';
import { ALLIANCE_MODULES } from '../../core/modules/registry';
import logoSrc from '../../assets/logo.png';
import './OnboardingFlow.css';

/* ─── Interfaces ─── */
interface OnboardingData {
  organization_name: string;
  legal_name: string;
  registration_number: string;
  country: string;
  city: string;
  employee_count: string;
  phone: string;
  sector: string;
  sub_sector: string;
  selected_modules: string[];
}

const TOTAL_STEPS = 5;

/* ─── Secteurs d'activité ─── */
const SECTORS = [
  {
    id: 'education',
    name: 'Éducation & Formation',
    desc: 'Écoles, universités, centres de formation',
    icon: GraduationCap,
    color: '#818cf8',
    bg: 'rgba(99, 102, 241, 0.15)',
    defaultModules: ['education_core', 'finance', 'library', 'tasks'],
  },
  {
    id: 'commerce',
    name: 'Commerce & Distribution',
    desc: 'Retail, e-commerce, grossistes, points de vente',
    icon: ShoppingBag,
    color: '#38bdf8',
    bg: 'rgba(14, 165, 233, 0.15)',
    defaultModules: ['inventory', 'finance', 'tasks'],
  },
  {
    id: 'sante',
    name: 'Santé & Médical',
    desc: 'Hôpitaux, cliniques, pharmacies, cabinets',
    icon: Stethoscope,
    color: '#34d399',
    bg: 'rgba(16, 185, 129, 0.15)',
    defaultModules: ['healthcare', 'inventory', 'tasks'],
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Élevage',
    desc: 'Exploitations agricoles, coopératives, agro-business',
    icon: Sprout,
    color: '#a3e635',
    bg: 'rgba(163, 230, 53, 0.15)',
    defaultModules: ['inventory', 'finance', 'tasks'],
  },
  {
    id: 'services',
    name: 'Services & Conseil',
    desc: 'Cabinets juridiques, agences, conseil d’entreprise',
    icon: Briefcase,
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.15)',
    defaultModules: ['tasks', 'finance'],
  },
  {
    id: 'ong',
    name: 'ONG & Associations',
    desc: 'Organisations humanitaires, associations loi 1901',
    icon: Heart,
    color: '#fb7185',
    bg: 'rgba(251, 113, 133, 0.15)',
    defaultModules: ['tasks', 'finance'],
  },
  {
    id: 'industrie',
    name: 'Industrie & BTP',
    desc: 'Manufacture, chantiers, génie civil, usines',
    icon: Factory,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.15)',
    defaultModules: ['inventory', 'tasks', 'finance'],
  },
  {
    id: 'technologie',
    name: 'Technologie & IT',
    desc: 'Startups numériques, éditeurs logiciels, intégrateurs',
    icon: Cpu,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.15)',
    defaultModules: ['tasks', 'finance'],
  },
];

/* ─── Pays (Afrique & Monde) ─── */
const COUNTRIES = [
  { code: 'CM', name: 'Cameroun (+237)' },
  { code: 'CI', name: "Côte d'Ivoire (+225)" },
  { code: 'SN', name: 'Sénégal (+221)' },
  { code: 'CD', name: 'RD Congo (+243)' },
  { code: 'CG', name: 'Congo (+242)' },
  { code: 'GA', name: 'Gabon (+241)' },
  { code: 'BF', name: 'Burkina Faso (+226)' },
  { code: 'ML', name: 'Mali (+223)' },
  { code: 'BJ', name: 'Bénin (+229)' },
  { code: 'TG', name: 'Togo (+228)' },
  { code: 'GN', name: 'Guinée (+224)' },
  { code: 'TD', name: 'Tchad (+235)' },
  { code: 'FR', name: 'France (+33)' },
  { code: 'BE', name: 'Belgique (+32)' },
  { code: 'CA', name: 'Canada (+1)' },
  { code: 'US', name: 'États-Unis (+1)' },
];

/* ─── Tailles d'équipe ─── */
const EMPLOYEE_SIZES = [
  { value: '1-5', label: '1 à 5 collaborateurs' },
  { value: '6-20', label: '6 à 20 collaborateurs' },
  { value: '21-50', label: '21 à 50 collaborateurs' },
  { value: '51-200', label: '51 à 200 collaborateurs' },
  { value: '200+', label: 'Plus de 200 collaborateurs' },
];

/* ─── Modules actifs configurables ─── */
const SELECTABLE_MODULES = ALLIANCE_MODULES.filter(
  (m) => m.status === 'active' || m.status === 'beta'
);

/* ─── Variantes d'animation ─── */
const stepAnimationVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
  }),
};

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const setOrganization = usePlatformStore((s) => s.setOrganization);

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    organization_name: '',
    legal_name: '',
    registration_number: '',
    country: 'CM',
    city: '',
    employee_count: '6-20',
    phone: '',
    sector: 'education',
    sub_sector: '',
    selected_modules: ['education_core', 'finance', 'library', 'tasks'],
  });

  const updateField = useCallback(<K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const selectSector = useCallback((sectorId: string) => {
    const found = SECTORS.find((s) => s.id === sectorId);
    setData((prev) => ({
      ...prev,
      sector: sectorId,
      selected_modules: found?.defaultModules || prev.selected_modules,
    }));
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setData((prev) => {
      const exists = prev.selected_modules.includes(moduleId);
      const next = exists
        ? prev.selected_modules.filter((id) => id !== moduleId)
        : [...prev.selected_modules, moduleId];
      return { ...prev, selected_modules: next };
    });
  }, []);

  /* ─── Navigation entre étapes ─── */
  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const canProceed = useMemo((): boolean => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return data.organization_name.trim().length >= 2;
      case 3:
        return !!data.sector;
      case 4:
        return data.selected_modules.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  /* ─── Passer l'onboarding (Skip) ─── */
  const handleSkip = () => {
    setOnboardingCompleted(true);
    if (user?.email) {
      localStorage.setItem(`alliance-onboarding-completed_${user.email}`, 'true');
    }
    localStorage.setItem('alliance-onboarding-completed', 'true');
    navigate('/app', { replace: true });
  };

  /* ─── Soumission Finale ─── */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: OnboardingSubmitPayload = {
        organization_name: data.organization_name || 'Mon Organisation',
        legal_name: data.legal_name || undefined,
        registration_number: data.registration_number || undefined,
        sector: data.sector,
        country: data.country,
        city: data.city || undefined,
        employee_count: data.employee_count,
        phone: data.phone || undefined,
        selected_modules: data.selected_modules,
      };

      const result = await onboardingApi.submit(payload);

      if (result.organization_id) {
        setOrganization({
          id: result.organization_id,
          name: data.organization_name || 'Mon Organisation',
          legal_name: data.legal_name,
          registration_number: data.registration_number,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Marquer comme définitivement complété
      setOnboardingCompleted(true);
      if (user?.email) {
        localStorage.setItem(`alliance-onboarding-completed_${user.email}`, 'true');
      }
      localStorage.setItem('alliance-onboarding-completed', 'true');
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/app', { replace: true });
      }, 1400);
    } catch (err) {
      console.warn('Backend sync warning, persisting local state:', err);
      // Mode Offline-First : persister localement et rediriger
      setOnboardingCompleted(true);
      if (user?.email) {
        localStorage.setItem(`alliance-onboarding-completed_${user.email}`, 'true');
      }
      localStorage.setItem('alliance-onboarding-completed', 'true');
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/app', { replace: true });
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;
  const userGreeting = user?.first_name || 'Bienvenue';
  const userInitial = userGreeting[0]?.toUpperCase() || 'A';

  const stepLabels = ['Accueil', 'Organisation', 'Secteur', 'Modules', 'Lancement'];

  return (
    <div className="onboarding-root">
      <div className="onboarding-card">
        {/* ─── HEADER ─── */}
        <header className="onb-header">
          <div className="onb-logo-wrap">
            <img src={logoSrc} alt="Alliance One" className="onb-logo-img" />
            <span className="onb-brand-name">Alliance One</span>
          </div>

          <div className="onb-progress-pill">
            <span>Étape</span>
            <strong>{currentStep}</strong>
            <span>/ {TOTAL_STEPS}</span>
          </div>

          <button className="onb-skip-btn" onClick={handleSkip} title="Accéder directement au tableau de bord">
            <LogOut size={14} />
            <span>Passer</span>
          </button>
        </header>

        {/* ─── PROGRESS BAR ─── */}
        <div className="onb-progress-bar-track">
          <div
            className="onb-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* ─── TRACKER INDICATORS ─── */}
        <div className="onb-step-tracker">
          {stepLabels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (
              <div
                key={lbl}
                className={`onb-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="onb-step-number">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : stepNum}
                </div>
                <span>{lbl}</span>
              </div>
            );
          })}
        </div>

        {/* ─── SCROLLABLE BODY ─── */}
        <div className="onb-body">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepAnimationVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ÉTAPE 1 : BIENVENUE */}
              {currentStep === 1 && (
                <div className="onb-welcome-wrap">
                  <div className="onb-avatar-halo">
                    <div className="onb-avatar-core">{userInitial}</div>
                  </div>

                  <h1 className="onb-title">Bienvenue, {userGreeting} 👋</h1>
                  <p className="onb-subtitle">
                    Configurons votre environnement professionnel en quelques instants. Alliance One s'adapte précisément à votre structure.
                  </p>

                  <div className="onb-highlights-grid">
                    <div className="onb-highlight-card">
                      <div className="onb-highlight-icon">
                        <Building2 size={18} />
                      </div>
                      <h4>Espace Entreprise</h4>
                      <p>Données et identité propre à votre structure</p>
                    </div>

                    <div className="onb-highlight-card">
                      <div className="onb-highlight-icon" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#fbbf24' }}>
                        <Zap size={18} />
                      </div>
                      <h4>Modules Sur-Mesure</h4>
                      <p>Activez uniquement les outils pertinents pour votre métier</p>
                    </div>

                    <div className="onb-highlight-card">
                      <div className="onb-highlight-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                        <ShieldCheck size={18} />
                      </div>
                      <h4>Isolation Totale</h4>
                      <p>Sécurité multi-tenant et gouvernance stricte</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : ORGANISATION */}
              {currentStep === 2 && (
                <div>
                  <h1 className="onb-title">Votre organisation</h1>
                  <p className="onb-subtitle">
                    Renseignez les coordonnées principales pour vos documents et devises d'affaires.
                  </p>

                  <div className="onb-form-grid">
                    <div className="onb-form-group onb-form-full">
                      <label className="onb-label">
                        <span>Nom de l'organisation</span>
                        <span className="onb-label-req">* Obligatoire</span>
                      </label>
                      <div className="onb-input-shell">
                        <Building2 size={16} className="onb-input-icon" />
                        <input
                          type="text"
                          className="onb-input"
                          placeholder="Ex : Groupe Scolaire Émergence, Sarl Apex..."
                          value={data.organization_name}
                          onChange={(e) => updateField('organization_name', e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="onb-form-group">
                      <label className="onb-label">
                        <span>Raison sociale</span>
                        <span className="onb-label-opt">Optionnel</span>
                      </label>
                      <div className="onb-input-shell">
                        <FileText size={16} className="onb-input-icon" />
                        <input
                          type="text"
                          className="onb-input"
                          placeholder="SARL, SAS, SA, Association..."
                          value={data.legal_name}
                          onChange={(e) => updateField('legal_name', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="onb-form-group">
                      <label className="onb-label">
                        <span>N° Contribuable / RCCM</span>
                        <span className="onb-label-opt">Optionnel</span>
                      </label>
                      <div className="onb-input-shell">
                        <FileText size={16} className="onb-input-icon" />
                        <input
                          type="text"
                          className="onb-input"
                          placeholder="Ex: M012345678901A"
                          value={data.registration_number}
                          onChange={(e) => updateField('registration_number', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="onb-form-group">
                      <label className="onb-label">
                        <span>Pays</span>
                      </label>
                      <div className="onb-input-shell">
                        <Globe size={16} className="onb-input-icon" />
                        <select
                          className="onb-select"
                          value={data.country}
                          onChange={(e) => updateField('country', e.target.value)}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="onb-form-group">
                      <label className="onb-label">
                        <span>Ville</span>
                        <span className="onb-label-opt">Optionnel</span>
                      </label>
                      <div className="onb-input-shell">
                        <MapPin size={16} className="onb-input-icon" />
                        <input
                          type="text"
                          className="onb-input"
                          placeholder="Ex : Douala, Yaoundé, Abidjan..."
                          value={data.city}
                          onChange={(e) => updateField('city', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="onb-form-group">
                      <label className="onb-label">
                        <span>Taille de l'équipe</span>
                      </label>
                      <div className="onb-input-shell">
                        <Users size={16} className="onb-input-icon" />
                        <select
                          className="onb-select"
                          value={data.employee_count}
                          onChange={(e) => updateField('employee_count', e.target.value)}
                        >
                          {EMPLOYEE_SIZES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="onb-form-group">
                      <label className="onb-label">
                        <span>Téléphone de contact</span>
                        <span className="onb-label-opt">Optionnel</span>
                      </label>
                      <div className="onb-input-shell">
                        <Phone size={16} className="onb-input-icon" />
                        <input
                          type="tel"
                          className="onb-input"
                          placeholder="Ex : +237 6XX XXX XXX"
                          value={data.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : SECTEUR */}
              {currentStep === 3 && (
                <div>
                  <h1 className="onb-title">Secteur d'activité</h1>
                  <p className="onb-subtitle">
                    Sélectionnez votre domaine afin d'activer les flux et modèles adaptés à vos processus.
                  </p>

                  <div className="onb-sector-grid">
                    {SECTORS.map((sec) => {
                      const Icon = sec.icon;
                      const isSelected = data.sector === sec.id;
                      return (
                        <div
                          key={sec.id}
                          className={`onb-sector-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => selectSector(sec.id)}
                        >
                          <div
                            className="onb-sector-icon-box"
                            style={{ background: sec.bg, color: sec.color }}
                          >
                            <Icon size={20} />
                          </div>
                          <div className="onb-sector-details">
                            <div className="onb-sector-name">{sec.name}</div>
                            <div className="onb-sector-desc">{sec.desc}</div>
                          </div>
                          <div className="onb-sector-check">
                            {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : MODULES */}
              {currentStep === 4 && (
                <div>
                  <h1 className="onb-title">Applications & Modules</h1>
                  <p className="onb-subtitle">
                    Modules recommandés pour votre secteur. Vous pourrez en installer d'autres à tout moment.
                  </p>

                  <div className="onb-module-grid">
                    {SELECTABLE_MODULES.map((mod) => {
                      const Icon = mod.icon;
                      const isSelected = data.selected_modules.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          className={`onb-module-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleModule(mod.id)}
                        >
                          <div className="onb-checkbox-box">
                            {isSelected && <Check size={13} color="#ffffff" strokeWidth={3} />}
                          </div>
                          <div className="onb-module-body">
                            <div className="onb-module-header">
                              <div
                                className="onb-module-icon-sm"
                                style={{
                                  background: `${mod.accentColor}20`,
                                  color: mod.accentColor,
                                }}
                              >
                                <Icon size={14} />
                              </div>
                              <span className="onb-module-title">{mod.name}</span>
                            </div>
                            <div className="onb-module-desc">{mod.tagline}</div>
                            <span
                              className={`onb-module-badge ${
                                mod.status === 'active' ? 'native' : 'beta'
                              }`}
                            >
                              {mod.status === 'active' ? '✓ Prêt à l\'emploi' : 'Bêta'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ÉTAPE 5 : RÉCAPITULATIF */}
              {currentStep === 5 && (
                <div>
                  {isSuccess ? (
                    <div className="onb-success-banner">
                      <div className="onb-success-check-ring">
                        <Check size={32} strokeWidth={3} />
                      </div>
                      <h1 className="onb-title">Organisation configurée avec succès !</h1>
                      <p className="onb-subtitle">
                        Initialisation de votre Business OS en cours... Redirection automatique.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h1 className="onb-title">Tout est prêt ! 🚀</h1>
                      <p className="onb-subtitle">
                        Vérifiez vos paramètres avant de déployer votre espace de travail Alliance One.
                      </p>

                      <div className="onb-recap-box">
                        <div className="onb-recap-row">
                          <span className="onb-recap-label">Organisation</span>
                          <span className="onb-recap-org-name">
                            {data.organization_name || 'Mon Organisation'}
                          </span>
                          <div className="onb-recap-meta-list">
                            {data.legal_name && (
                              <span className="onb-recap-meta-item">
                                <FileText size={13} />
                                {data.legal_name}
                              </span>
                            )}
                            <span className="onb-recap-meta-item">
                              <MapPin size={13} />
                              {data.city ? `${data.city}, ` : ''}
                              {COUNTRIES.find((c) => c.code === data.country)?.name.split(' ')[0] || data.country}
                            </span>
                            <span className="onb-recap-meta-item">
                              <Users size={13} />
                              {EMPLOYEE_SIZES.find((s) => s.value === data.employee_count)?.label || data.employee_count}
                            </span>
                          </div>
                        </div>

                        <div className="onb-recap-divider" />

                        <div className="onb-recap-row">
                          <span className="onb-recap-label">Secteur d'activité</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '14px' }}>
                              {SECTORS.find((s) => s.id === data.sector)?.name || data.sector}
                            </span>
                          </div>
                        </div>

                        <div className="onb-recap-divider" />

                        <div className="onb-recap-row">
                          <span className="onb-recap-label">
                            Applications activées ({data.selected_modules.length})
                          </span>
                          <div className="onb-recap-chips">
                            {SELECTABLE_MODULES.filter((m) =>
                              data.selected_modules.includes(m.id)
                            ).map((mod) => (
                              <span key={mod.id} className="onb-chip">
                                <span
                                  className="onb-chip-dot"
                                  style={{ background: mod.accentColor }}
                                />
                                {mod.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── STICKY FOOTER NAVIGATION ─── */}
        {!isSuccess && (
          <footer className="onb-footer">
            <div>
              {currentStep > 1 && (
                <button className="onb-btn-back" onClick={goBack}>
                  <ArrowLeft size={16} />
                  <span>Retour</span>
                </button>
              )}
            </div>

            <div>
              {currentStep === TOTAL_STEPS ? (
                <button
                  className="onb-btn-primary launch"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="onb-spinner" />
                      <span>Configuration...</span>
                    </>
                  ) : (
                    <>
                      <Rocket size={16} />
                      <span>Lancer mon espace</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="onb-btn-primary"
                  onClick={goNext}
                  disabled={!canProceed}
                >
                  <span>Continuer</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
