/**
 * ALLIANCE ONE — HYPERADMIN MAIN COCKPIT
 * Central governance and multi-tenant telemetry for Alliance One.
 * Strictly connects to live database APIs — ZERO MOCK DATA.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Building2,
  Users,
  TrendingUp,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Shield,
  Server,
  Database,
  Sliders,
  X,
  UserCheck,
  ChevronRight,
  BookOpen,
  Package,
  FolderKanban,
  Landmark,
  GraduationCap
} from 'lucide-react';
import { hyperAdminApi } from '../../../core/api/hyperadmin';
import type {
  HyperAdminMetrics,
  ModuleStat,
  TenantItem,
  PlatformUserItem,
  AuditTrailItem,
  TelemetryData,
  CreateOrgPayload,
  CreateUserPayload
} from '../../../core/api/hyperadmin';
import './HyperAdminDashboard.css';

export const HyperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Data from Django ORM API
  const [metrics, setMetrics] = useState<HyperAdminMetrics | null>(null);
  const [moduleStats, setModuleStats] = useState<Record<string, ModuleStat>>({});
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [users, setUsers] = useState<PlatformUserItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditTrailItem[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  // Filters & Search
  const [tenantSearch, setTenantSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Modals
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Form states
  const [newOrg, setNewOrg] = useState<CreateOrgPayload>({
    name: '',
    legal_name: '',
    sector: 'Enseignement & Formation',
    city: 'Douala',
    country: 'CM',
    active_modules: ['education_core', 'finance', 'inventory'],
  });

  const [newUser, setNewUser] = useState<CreateUserPayload>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_hyperadmin: false,
    organization_id: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [togglingModule, setTogglingModule] = useState<string | null>(null);

  // Fetch full live platform data
  const fetchData = async () => {
    try {
      setError(null);
      const data = await hyperAdminApi.getOverview();
      setMetrics(data.metrics);
      setModuleStats(data.moduleStats);
      setTenants(data.tenants);
      setUsers(data.users);
      setAuditTrail(data.auditTrail);
      setTelemetry(data.telemetry);
    } catch (err: any) {
      console.error('Failed to load hyperadmin data:', err);
      setError(err.message || 'Erreur lors de la récupération des données de la plateforme.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Toggle Module for a Tenant directly
  const handleToggleModule = async (orgId: string, moduleKey: string, currentActive: boolean) => {
    const toggleKey = `${orgId}-${moduleKey}`;
    try {
      setTogglingModule(toggleKey);
      const res = await hyperAdminApi.toggleModule(orgId, moduleKey, !currentActive);
      // Update tenant in local state
      setTenants((prev) =>
        prev.map((t) => (t.id === orgId ? { ...t, activeModules: res.activeModules } : t))
      );
    } catch (err: any) {
      alert(`Erreur lors du changement de module: ${err.message}`);
    } finally {
      setTogglingModule(null);
    }
  };

  // Submit Create Org
  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name.trim()) return;
    try {
      setFormSubmitting(true);
      await hyperAdminApi.createOrganization(newOrg);
      setIsOrgModalOpen(false);
      setNewOrg({
        name: '',
        legal_name: '',
        sector: 'Enseignement & Formation',
        city: 'Douala',
        country: 'CM',
        active_modules: ['education_core', 'finance', 'inventory'],
      });
      await fetchData();
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Create User
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email.trim() || !newUser.password) return;
    try {
      setFormSubmitting(true);
      await hyperAdminApi.createUser(newUser);
      setIsUserModalOpen(false);
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        is_hyperadmin: false,
        organization_id: '',
      });
      await fetchData();
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered tenants
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        t.legalName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
        t.city.toLowerCase().includes(tenantSearch.toLowerCase());

      if (!matchSearch) return false;
      if (statusFilter === 'ACTIVE') return t.onboardingCompleted;
      if (statusFilter === 'PENDING') return !t.onboardingCompleted;
      return true;
    });
  }, [tenants, tenantSearch, statusFilter]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.name.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  if (loading) {
    return (
      <div className="hyperadmin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6366f1', fontWeight: 600 }}>
          <RefreshCw className="animate-spin" size={24} />
          Chargement de l'espace HyperAdmin...
        </div>
      </div>
    );
  }

  const moduleDefinitions = [
    { key: 'education_core', name: 'Éducation Pro', icon: GraduationCap, color: '#4f46e5' },
    { key: 'finance', name: 'Finances & Trésorerie', icon: Landmark, color: '#059669' },
    { key: 'inventory', name: 'Stocks & Logistique', icon: Package, color: '#0ea5e9' },
    { key: 'library', name: 'Bibliothèque & CDI', icon: BookOpen, color: '#8b5cf6' },
    { key: 'tasks', name: 'Tâches & Projets', icon: FolderKanban, color: '#6366f1' },
    { key: 'founder', name: 'Alliance AI & Copilot', icon: Sparkles, color: '#f59e0b' },
  ];

  return (
    <div className="hyperadmin-root">
      <div className="hyperadmin-container">
        {/* ─── 1. TOP HEADER & TELEMETRY BADGE ─── */}
        <header className="hyperadmin-header">
          <div className="hyperadmin-header-title-area">
            <div className="hyperadmin-icon-shield">
              <Shield size={28} />
            </div>
            <div>
              <h1>
                Espace HyperAdmin
                <span className="hyperadmin-badge-pro">Administration Générale</span>
              </h1>
              <p>Supervision et gouvernance du parc d'organisations Alliance One</p>
            </div>
          </div>

          <div className="hyperadmin-header-actions">
            <div className="hyperadmin-status-pill">
              <span className="status-dot-pulse" />
              Services en ligne
            </div>

            <button
              className="hyperadmin-btn btn-secondary"
              onClick={handleRefresh}
              title="Rafraîchir les métriques"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>Rafraîchir</span>
            </button>

            <button
              className="hyperadmin-btn btn-primary"
              onClick={() => setIsOrgModalOpen(true)}
            >
              <Plus size={16} />
              <span>Nouvelle Organisation</span>
            </button>
          </div>
        </header>

        {error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              color: '#ef4444',
            }}
          >
            {error}
          </div>
        )}

        {/* ─── 2. PRIMARY LIVE METRIC CARDS ─── */}
        {metrics && (
          <div className="hyperadmin-kpi-grid">
            {/* Card 1: Tenants */}
            <motion.div className="hyperadmin-kpi-card" whileHover={{ y: -2 }}>
              <div className="kpi-card-top">
                <span className="kpi-card-label">Organisations / Tenants</span>
                <div className="kpi-card-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                  <Building2 size={20} />
                </div>
              </div>
              <div className="kpi-card-value">{metrics.totalOrganizations}</div>
              <div className="kpi-card-footer">
                <CheckCircle2 size={14} color="#10b981" />
                <span>{metrics.activeOrganizations} actives • {metrics.pendingOrganizations} en attente</span>
              </div>
            </motion.div>

            {/* Card 2: Users */}
            <motion.div className="hyperadmin-kpi-card" whileHover={{ y: -2 }}>
              <div className="kpi-card-top">
                <span className="kpi-card-label">Utilisateurs Globaux</span>
                <div className="kpi-card-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <Users size={20} />
                </div>
              </div>
              <div className="kpi-card-value">{metrics.totalUsers}</div>
              <div className="kpi-card-footer">
                <UserCheck size={14} color="#8b5cf6" />
                <span>{metrics.staffUsers} administrateurs système & staff</span>
              </div>
            </motion.div>

            {/* Card 3: Finance Volume */}
            <motion.div className="hyperadmin-kpi-card" whileHover={{ y: -2 }}>
              <div className="kpi-card-top">
                <span className="kpi-card-label">Volume Financier Enregistré</span>
                <div className="kpi-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="kpi-card-value">
                {metrics.totalRevenueVolume.toLocaleString('fr-FR')} <span style={{ fontSize: '1.1rem' }}>XAF</span>
              </div>
              <div className="kpi-card-footer">
                <span>{metrics.totalTransactions} transactions • {metrics.totalInvoices} factures émises</span>
              </div>
            </motion.div>

            {/* Card 4: Entities */}
            <motion.div className="hyperadmin-kpi-card" whileHover={{ y: -2 }}>
              <div className="kpi-card-top">
                <span className="kpi-card-label">Entités Métier Déployées</span>
                <div className="kpi-card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Layers size={20} />
                </div>
              </div>
              <div className="kpi-card-value">
                {metrics.totalStudents + metrics.totalProducts + metrics.totalProjects + metrics.totalBooks}
              </div>
              <div className="kpi-card-footer">
                <span>{metrics.totalStudents} élèves • {metrics.totalProducts} articles • {metrics.totalProjects} projets</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ─── 3. MODULES ADOPTION MATRIX ─── */}
        <section className="hyperadmin-section">
          <div className="section-header-title">
            <div>
              <h2>
                <Sliders size={18} color="#6366f1" />
                Matrice d'Adoption des Modules Métier
              </h2>
              <p>Taux de déploiement et état des licences sur le parc d'organisations</p>
            </div>
          </div>

          <div className="modules-matrix-grid">
            {moduleDefinitions.map((mod) => {
              const stat = moduleStats[mod.key] || { activeTenants: 0, adoptionRate: 0 };
              const Icon = mod.icon;
              return (
                <div key={mod.key} className="module-matrix-card">
                  <div className="module-matrix-top">
                    <div
                      className="module-matrix-icon"
                      style={{ background: `${mod.color}18`, color: mod.color }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="module-matrix-name">{mod.name}</div>
                  </div>

                  <div className="module-progress-bar">
                    <div
                      className="module-progress-fill"
                      style={{ width: `${stat.adoptionRate}%`, backgroundColor: mod.color }}
                    />
                  </div>

                  <div className="module-matrix-footer">
                    <span>{stat.activeTenants} organisations</span>
                    <strong>{stat.adoptionRate}%</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. MULTI-TENANT FLEET MANAGEMENT TABLE ─── */}
        <section className="hyperadmin-section">
          <div className="section-header-title">
            <div>
              <h2>
                <Building2 size={18} color="#6366f1" />
                Gestion de la Flotte Multi-Tenant ({tenants.length} Organisations)
              </h2>
              <p>Supervision des instances, rattachements, et activation de modules en direct</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className={`hyperadmin-btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setStatusFilter('ALL')}
              >
                Toutes ({tenants.length})
              </button>
              <button
                className={`hyperadmin-btn ${statusFilter === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setStatusFilter('ACTIVE')}
              >
                Actives ({metrics?.activeOrganizations || 0})
              </button>
              <button
                className={`hyperadmin-btn ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setStatusFilter('PENDING')}
              >
                En Attente ({metrics?.pendingOrganizations || 0})
              </button>
            </div>
          </div>

          <div className="fleet-toolbar">
            <div className="fleet-search-box">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Rechercher une organisation, ville, immatriculation..."
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="fleet-table-wrapper">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Organisation</th>
                  <th>Localisation & Secteur</th>
                  <th>Modules Déployés (Clic pour basculer)</th>
                  <th>Élèves / Membres</th>
                  <th>Création</th>
                  <th>Statut Onboarding</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Aucune organisation trouvée correspondant aux critères.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>{t.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {t.legalName} • Réf: {t.registrationNumber}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.sector}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {t.city}, {t.country} • {t.employeeCount} employés
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {['education_core', 'finance', 'inventory', 'library', 'tasks'].map((modKey) => {
                            const isModActive =
                              t.activeModules.includes(modKey) ||
                              (modKey === 'education_core' && t.activeModules.includes('education'));
                            const isToggling = togglingModule === `${t.id}-${modKey}`;
                            const label =
                              modKey === 'education_core'
                                ? 'Éducation'
                                : modKey === 'finance'
                                ? 'Finance'
                                : modKey === 'inventory'
                                ? 'Stocks'
                                : modKey === 'library'
                                ? 'Biblio'
                                : 'Tâches';

                            return (
                              <button
                                key={modKey}
                                className={`module-pill-tag ${isModActive ? 'active' : 'inactive'}`}
                                disabled={isToggling}
                                onClick={() => handleToggleModule(t.id, modKey, isModActive)}
                                title={`Cliquer pour ${isModActive ? 'désactiver' : 'activer'} ce module`}
                              >
                                {isToggling ? '...' : label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <div><strong>{t.studentCount}</strong> élèves</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.userCount} comptes liés</div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {t.createdAt}
                      </td>
                      <td>
                        {t.onboardingCompleted ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                            }}
                          >
                            <CheckCircle2 size={12} />
                            Opérationnel
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
                            }}
                          >
                            <Clock size={12} />
                            En attente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── 5. TWO COLUMNS: USERS DIRECTORY & PLATFORM TELEMETRY ─── */}
        <div className="hyperadmin-two-cols">
          {/* LEFT: GLOBAL USERS DIRECTORY */}
          <section className="hyperadmin-section">
            <div className="section-header-title">
              <div>
                <h2>
                  <Users size={18} color="#8b5cf6" />
                  Annuaire des Utilisateurs Globaux ({users.length})
                </h2>
                <p>Gestion des privilèges, rôles et comptes maîtres</p>
              </div>

              <button
                className="hyperadmin-btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setIsUserModalOpen(true)}
              >
                <Plus size={14} />
                <span>Créer Compte</span>
              </button>
            </div>

            <div className="fleet-toolbar">
              <div className="fleet-search-box" style={{ width: '100%' }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Filtrer par email ou nom..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="fleet-table-wrapper" style={{ maxHeight: '360px', overflowY: 'auto' }}>
              <table className="fleet-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Rôles & Privilèges</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {u.roles.map((r, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.675rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                background: r.includes('HYPERADMIN')
                                  ? 'rgba(236, 72, 153, 0.2)'
                                  : 'rgba(99, 102, 241, 0.1)',
                                color: r.includes('HYPERADMIN') ? '#ec4899' : '#6366f1',
                                fontWeight: 700,
                              }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {u.isActive ? (
                          <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>Actif</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>Suspendu</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* RIGHT: PLATFORM HEALTH & MICROSERVICES */}
          <section className="hyperadmin-section">
            <div className="section-header-title">
              <div>
                <h2>
                  <Server size={18} color="#10b981" />
                  État des Services Plateforme
                </h2>
                <p>Base de données active • Tous les services sont connectés</p>
              </div>
            </div>

            <div className="telemetry-list">
              {telemetry?.services.map((svc, idx) => (
                <div key={idx} className="telemetry-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: svc.color,
                        boxShadow: `0 0 8px ${svc.color}`,
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>{svc.name}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                      }}
                    >
                      {svc.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ─── 6. AUDIT TRAIL STREAM ─── */}
        <section className="hyperadmin-section">
          <div className="section-header-title">
            <div>
              <h2>
                <Clock size={18} color="#f59e0b" />
                Journal d'Audit Global & Activités Réelles de la Plateforme
              </h2>
              <p>Historique des événements consignés dans la table AuditTrail</p>
            </div>
          </div>

          <div className="fleet-table-wrapper" style={{ maxHeight: '280px', overflowY: 'auto' }}>
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Opérateur</th>
                  <th>Action</th>
                  <th>Entité Cible</th>
                  <th>Motif / Contexte</th>
                </tr>
              </thead>
              <tbody>
                {auditTrail.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                      Aucun événement d'audit récent répertorié.
                    </td>
                  </tr>
                ) : (
                  auditTrail.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontSize: '0.775rem', color: '#64748b' }}>{a.timestamp}</td>
                      <td><strong>{a.user}</strong></td>
                      <td><span style={{ fontWeight: 600, color: '#6366f1' }}>{a.action}</span></td>
                      <td>{a.entityType} ({a.entityId})</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.reason || 'Opération standard'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── MODAL: CREATE ORGANIZATION ─── */}
        <AnimatePresence>
          {isOrgModalOpen && (
            <div className="hyperadmin-modal-overlay">
              <motion.div
                className="hyperadmin-modal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <form onSubmit={handleCreateOrgSubmit}>
                  <div className="modal-header">
                    <h3>Créer une Organisation / Tenant</h3>
                    <button
                      type="button"
                      onClick={() => setIsOrgModalOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="form-group">
                      <label>Nom de l'Organisation *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: École Supérieure d'Ingénierie"
                        value={newOrg.name}
                        onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Raison Sociale / Nom Légal</label>
                      <input
                        type="text"
                        placeholder="Ex: ESI SARL"
                        value={newOrg.legal_name}
                        onChange={(e) => setNewOrg({ ...newOrg, legal_name: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label>Secteur</label>
                        <select
                          value={newOrg.sector}
                          onChange={(e) => setNewOrg({ ...newOrg, sector: e.target.value })}
                        >
                          <option value="Enseignement & Formation">Enseignement & Formation</option>
                          <option value="Distribution & Commerce">Distribution & Commerce</option>
                          <option value="Services & Conseil">Services & Conseil</option>
                          <option value="Industrie & BTP">Industrie & BTP</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Ville</label>
                        <input
                          type="text"
                          value={newOrg.city}
                          onChange={(e) => setNewOrg({ ...newOrg, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Modules à Déployer Initialement</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {[
                          { id: 'education_core', label: 'Éducation Pro' },
                          { id: 'finance', label: 'Finances & Trésorerie' },
                          { id: 'inventory', label: 'Stocks & Logistique' },
                          { id: 'library', label: 'Bibliothèque' },
                          { id: 'tasks', label: 'Tâches & Projets' },
                        ].map((m) => (
                          <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={newOrg.active_modules?.includes(m.id)}
                              onChange={(e) => {
                                const current = newOrg.active_modules || [];
                                if (e.target.checked) {
                                  setNewOrg({ ...newOrg, active_modules: [...current, m.id] });
                                } else {
                                  setNewOrg({
                                    ...newOrg,
                                    active_modules: current.filter((k) => k !== m.id),
                                  });
                                }
                              }}
                            />
                            {m.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="hyperadmin-btn btn-secondary"
                      onClick={() => setIsOrgModalOpen(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="hyperadmin-btn btn-primary"
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? 'Création en cours...' : 'Créer l\'Organisation'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── MODAL: CREATE USER ─── */}
        <AnimatePresence>
          {isUserModalOpen && (
            <div className="hyperadmin-modal-overlay">
              <motion.div
                className="hyperadmin-modal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <form onSubmit={handleCreateUserSubmit}>
                  <div className="modal-header">
                    <h3>Créer un Utilisateur Plateforme</h3>
                    <button
                      type="button"
                      onClick={() => setIsUserModalOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="form-group">
                      <label>Adresse Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="nom@domaine.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Mot de Passe *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label>Prénom</label>
                        <input
                          type="text"
                          placeholder="Jean"
                          value={newUser.first_name}
                          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Nom</label>
                        <input
                          type="text"
                          placeholder="Dupont"
                          value={newUser.last_name}
                          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Rattachement Organisation</label>
                      <select
                        value={newUser.organization_id}
                        onChange={(e) => setNewUser({ ...newUser, organization_id: e.target.value })}
                      >
                        <option value="">Aucune (Utilisateur Système Global)</option>
                        {tenants.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginTop: '0.5rem', background: 'rgba(99, 102, 241, 0.08)', padding: '0.75rem', borderRadius: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={newUser.is_hyperadmin}
                          onChange={(e) => setNewUser({ ...newUser, is_hyperadmin: e.target.checked })}
                        />
                        <span style={{ color: '#6366f1' }}>Accorder le Rôle HyperAdmin (Superuser & Staff)</span>
                      </label>
                      <p style={{ margin: '0.25rem 0 0 1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                        Donne les pleins pouvoirs de gestion sur l'ensemble des tenants et de la plateforme.
                      </p>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="hyperadmin-btn btn-secondary"
                      onClick={() => setIsUserModalOpen(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="hyperadmin-btn btn-primary"
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? 'Création...' : 'Créer l\'Utilisateur'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
