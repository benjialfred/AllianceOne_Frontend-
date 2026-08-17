import React, { useEffect } from 'react';
import { Button } from '../design-system/components/Button';
import { Moon, Sun, LayoutDashboard, Users, GraduationCap, BookOpen, Book, FileText, Calendar, BarChart, CreditCard, Edit3, Settings, Library, Search, Package, Warehouse as WarehouseIcon, History, ClipboardList, Truck, ShoppingCart, SlidersHorizontal, Landmark, PieChart, ArrowRightLeft, Factory, FolderKanban, ListTodo, CheckSquare, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Workspace } from '../core/workspace-sdk';
import { ManifestService } from '../core/services/ManifestService';
import { CommandPalette } from './CommandPalette';
import { ModuleSelector } from './ModuleSelector';
import { usePlatformStore } from '../core/stores/platformStore';
import { identityApi } from '../core/api/identity';
import { Logo } from '../design-system/components/Logo';
import { DynamicDashboard } from '../dashboard-engine/DynamicDashboard';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import EducationModuleRoutes from '../modules/education/App';
import InventoryModuleRoutes from '../modules/inventory/App';
import FinanceModuleRoutes from '../modules/finance/App';
import LibraryModuleRoutes from '../modules/library/App';
import TasksModuleRoutes from '../modules/tasks/App';
import { GlobalMenu } from './components/GlobalMenu';
import './Workspace.css';

const educationNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/education", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'ACADÉMIQUE', items: [
    { label: "Élèves", path: "/education/students", icon: Users, shortcut: '⌘ 2' },
    { label: "Enseignants", path: "/education/teachers", icon: GraduationCap },
    { label: "Classes", path: "/education/classes", icon: BookOpen },
    { label: "Matières", path: "/education/subjects", icon: Book },
  ]},
  { section: 'ÉVALUATION & DOCS', items: [
    { label: "Notes", path: "/education/grades", icon: Edit3, badge: '3' },
    { label: "Présences", path: "/education/presences", icon: Users },
    { label: "Bulletins & Rapports", path: "/education/reports", icon: Library },
    { label: "Cartes Scolaires", path: "/education/cards", icon: Users },
  ]},
  { section: 'GESTION', items: [
    { label: "Revenus & Finances", path: "/education/finance", icon: CreditCard, badge: 'Nouv.' },
    { label: "Années scolaires", path: "/education/academic-years", icon: Calendar },
  ]},
  { section: 'SYSTÈME', items: [
    { label: "Paramètres", path: "/education/settings", icon: Settings },
  ]}
];

const inventoryNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/inventory", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'CATALOGUE & STOCKS', items: [
    { label: "Articles & Stocks", path: "/inventory/products", icon: Package, shortcut: '⌘ 2' },
    { label: "Entrepôts & Dépôts", path: "/inventory/warehouses", icon: WarehouseIcon },
  ]},
  { section: 'TRAÇABILITÉ & AUDITS', items: [
    { label: "Mouvements de stock", path: "/inventory/stock-movements", icon: History },
    { label: "Inventaires Physiques", path: "/inventory/audits", icon: ClipboardList },
  ]},
  { section: 'APPROVISIONNEMENT', items: [
    { label: "Fournisseurs", path: "/inventory/suppliers", icon: Truck },
    { label: "Bons de Commande", path: "/inventory/purchase-orders", icon: ShoppingCart, badge: 'Flux' },
  ]},
  { section: 'PRODUCTION & FABRICATION', items: [
    { label: "Ordres de Fabrication", path: "/inventory/manufacturing", icon: Factory },
  ]},
  { section: 'CONFIGURATION', items: [
    { label: "Paramètres & Unités", path: "/inventory/settings", icon: Settings },
  ]}
];

const financeNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/finance", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'TRÉSORERIE & COMPTES', items: [
    { label: "Comptes & Caisses", path: "/finance/accounts", icon: Landmark, shortcut: '⌘ 2' },
    { label: "Journal des Opérations", path: "/finance/transactions", icon: History, badge: 'Flux' },
  ]},
  { section: 'PILOTAGE BUDGÉTAIRE', items: [
    { label: "Enveloppes & Budgets", path: "/finance/budgets", icon: PieChart },
  ]},
  { section: 'FACTURATION & TIERS', items: [
    { label: "Factures & Devis", path: "/finance/invoices", icon: FileText, badge: 'TVA' },
  ]},
  { section: 'CONFIGURATION', items: [
    { label: "Plan Analytique", path: "/finance/categories", icon: Settings },
  ]}
];

const libraryNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/library", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'CATALOGUE', items: [
    { label: "Ouvrages", path: "/library/books", icon: Book },
  ]}
];

const tasksNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/tasks", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'ESPACE TRAVAIL', items: [
    { label: "Tableau Kanban", path: "/tasks/board", icon: Layers, shortcut: '⌘ 2' },
    { label: "Liste des Tâches", path: "/tasks/list", icon: ListTodo },
    { label: "Mes Tâches", path: "/tasks/my-tasks", icon: CheckSquare, badge: 'Moi' },
  ]},
  { section: 'PROJETS & JALONS', items: [
    { label: "Portefeuille Projets", path: "/tasks/projects", icon: FolderKanban },
  ]}
];

export const WorkspaceShell: React.FC = () => {
  const currentModule = usePlatformStore((s) => s.currentModule);
  const currentOrganization = usePlatformStore((s) => s.currentOrganization);
  const setWorkspaces = usePlatformStore((s) => s.setWorkspaces);
  const theme = usePlatformStore((s) => s.theme);
  const toggleTheme = usePlatformStore((s) => s.toggleTheme);
  const sidebarCollapsed = usePlatformStore((s) => s.sidebarCollapsed);
  const toggleSidebar = usePlatformStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentOrganization) return;
    identityApi
      .getWorkspaces()
      .then((data) => setWorkspaces(data))
      .catch((err) => console.error('Failed to load workspaces:', err));
  }, [currentOrganization, setWorkspaces]);

  useEffect(() => {
    ManifestService.loadModule({
      id: 'education',
      name: 'Education',
      version: '1.0.0',
      routes: [{ path: '/students', component: 'pages/Students' }],
      commands: [
        {
          id: 'new_student',
          title: 'Nouveau dossier Étudiant',
          shortcut: ['⌘', 'N'],
          action_event: 'Education:OpenNewStudentModal',
        },
      ],
    });

    const unsubscribeEdu = Workspace.events.subscribe(
      'Education:OpenNewStudentModal',
      () => {
        alert("Le module Education a reçu l'événement via l'EventBus !");
      }
    );

    return () => {
      unsubscribeEdu();
    };
  }, []);

  if (!currentModule || !currentOrganization) {
    return <ModuleSelector />;
  }

  return (
    <div className="workspace-container">
      {/* Sidebar Ultra Thin */}
      <motion.aside
        className={`workspace-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
        initial={{ x: -260 }}
        animate={{ x: 0, width: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        <div className="sidebar-logo">
          {!sidebarCollapsed ? (
            <>
              <Logo size={28} />
              <h2 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Alliance One</h2>
            </>
          ) : (
            <Logo size={28} />
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-org-badge">
            <span className="sidebar-org-name">{currentOrganization.name}</span>
            <span className="sidebar-org-label">Espace Actif</span>
          </div>
        )}

        <nav className="sidebar-nav" style={{ padding: '0 12px', flex: 1, overflowY: 'auto' }}>
          {currentModule === 'education' && educationNavigation.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '16px' }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '4px' }}>
                  {section.section}
                </div>
              )}
              <ul style={{ gap: '2px', display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((navItem: any) => {
                  const Icon = navItem.icon;
                  const isActive = location.pathname === navItem.path || (navItem.path !== '/education' && location.pathname.startsWith(navItem.path));
                  return (
                    <li 
                      key={navItem.path} 
                      className={`nav-item ${isActive ? 'active' : ''}`} 
                      onClick={() => navigate(navItem.path)}
                      style={{ padding: '6px 12px', margin: 0, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <Icon size={14} style={{ flexShrink: 0 }} />
                      {!sidebarCollapsed && (
                         <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>{navItem.label}</span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {navItem.shortcut && (
                              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', background: 'var(--color-surface-bg)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--color-surface-border)' }}>
                                {navItem.shortcut}
                              </span>
                            )}
                            {navItem.badge && (
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', background: 'var(--color-accent-600)', padding: '2px 6px', borderRadius: '10px' }}>
                                {navItem.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {currentModule === 'inventory' && inventoryNavigation.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '16px' }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '4px' }}>
                  {section.section}
                </div>
              )}
              <ul style={{ gap: '2px', display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((navItem: any) => {
                  const Icon = navItem.icon;
                  const isActive = location.pathname === navItem.path || (navItem.path !== '/inventory' && location.pathname.startsWith(navItem.path));
                  return (
                    <li 
                      key={navItem.path} 
                      className={`nav-item ${isActive ? 'active' : ''}`} 
                      onClick={() => navigate(navItem.path)}
                      style={{ padding: '6px 12px', margin: 0, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <Icon size={14} style={{ flexShrink: 0 }} />
                      {!sidebarCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>{navItem.label}</span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {navItem.shortcut && (
                              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', background: 'var(--color-surface-bg)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--color-surface-border)' }}>
                                {navItem.shortcut}
                              </span>
                            )}
                            {navItem.badge && (
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', background: '#f59e0b', padding: '2px 6px', borderRadius: '10px' }}>
                                {navItem.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {currentModule === 'finance' && financeNavigation.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '16px' }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '4px' }}>
                  {section.section}
                </div>
              )}
              <ul style={{ gap: '2px', display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((navItem: any) => {
                  const Icon = navItem.icon;
                  const isActive = location.pathname === navItem.path || (navItem.path !== '/finance' && location.pathname.startsWith(navItem.path));
                  return (
                    <li 
                      key={navItem.path} 
                      className={`nav-item ${isActive ? 'active' : ''}`} 
                      onClick={() => navigate(navItem.path)}
                      style={{ padding: '6px 12px', margin: 0, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <Icon size={14} style={{ flexShrink: 0 }} />
                      {!sidebarCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>{navItem.label}</span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {navItem.shortcut && (
                              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', background: 'var(--color-surface-bg)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--color-surface-border)' }}>
                                {navItem.shortcut}
                              </span>
                            )}
                            {navItem.badge && (
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', background: '#059669', padding: '2px 6px', borderRadius: '10px' }}>
                                {navItem.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {currentModule === 'library' && libraryNavigation.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '16px' }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '4px' }}>
                  {section.section}
                </div>
              )}
              <ul style={{ gap: '2px', display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((navItem: any) => {
                  const Icon = navItem.icon;
                  const isActive = location.pathname === navItem.path || (navItem.path !== '/library' && location.pathname.startsWith(navItem.path));
                  return (
                    <li 
                      key={navItem.path} 
                      className={`nav-item ${isActive ? 'active' : ''}`} 
                      onClick={() => navigate(navItem.path)}
                      style={{ padding: '6px 12px', margin: 0, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <Icon size={14} style={{ flexShrink: 0 }} />
                      {!sidebarCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>{navItem.label}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {currentModule === 'tasks' && tasksNavigation.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '16px' }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px', marginBottom: '4px' }}>
                  {section.section}
                </div>
              )}
              <ul style={{ gap: '2px', display: 'flex', flexDirection: 'column', listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map((navItem: any) => {
                  const Icon = navItem.icon;
                  const isActive = location.pathname === navItem.path || (navItem.path !== '/tasks' && location.pathname.startsWith(navItem.path));
                  return (
                    <li 
                      key={navItem.path} 
                      className={`nav-item ${isActive ? 'active' : ''}`} 
                      onClick={() => navigate(navItem.path)}
                      style={{ padding: '6px 12px', margin: 0, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <Icon size={14} style={{ flexShrink: 0 }} />
                      {!sidebarCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>{navItem.label}</span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {navItem.shortcut && (
                              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', background: 'var(--color-surface-bg)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--color-surface-border)' }}>
                                {navItem.shortcut}
                              </span>
                            )}
                            {navItem.badge && (
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', background: '#4f46e5', padding: '2px 6px', borderRadius: '10px' }}>
                                {navItem.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--color-surface-border)', background: 'var(--color-surface-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 2px #d1fae5' }}></span>
              Système Opérationnel
            </div>
            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Alliance OS v2.0.1</div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="workspace-main">
        {/* Floating Header */}
        <header className="workspace-header">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <GlobalMenu />
            
            <div className="search-bar-mock">
              <Search size={14} />
              <span>Appuyez sur ⌘K pour rechercher...</span>
            </div>
          </div>
          <div className="header-actions">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
          </div>
        </header>

        <section className="workspace-content" style={{ padding: 0 }}>
          <Routes>
            <Route path="/" element={<DynamicDashboard />} />
            <Route path="/education/*" element={<EducationModuleRoutes />} />
            <Route path="/inventory/*" element={<InventoryModuleRoutes />} />
            <Route path="/finance/*" element={<FinanceModuleRoutes />} />
            <Route path="/library/*" element={<LibraryModuleRoutes />} />
            <Route path="/tasks/*" element={<TasksModuleRoutes />} />
            <Route path="/settings" element={
              <div style={{ padding: '2rem' }}>
                <h2>Paramètres de l'Organisation</h2>
                <p>Configuration du Dashboard, des accès et facturation.</p>
                <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                  <h3>Gestion du Layout</h3>
                  <p>Depuis le dashboard, vous pouvez cliquer sur "Personnaliser" pour ajuster la position des widgets.</p>
                </div>
              </div>
            } />
          </Routes>
        </section>
      </main>

      <CommandPalette />
    </div>
  );
};
