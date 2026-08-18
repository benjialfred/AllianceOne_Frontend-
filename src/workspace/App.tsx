import React, { useEffect, useState } from 'react';
import { Button } from '../design-system/components/Button';
import { 
  Moon, 
  Sun, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Book, 
  FileText, 
  Calendar, 
  CreditCard, 
  Edit3, 
  Settings, 
  Library, 
  Package, 
  Warehouse as WarehouseIcon, 
  History, 
  ClipboardList, 
  Truck, 
  ShoppingCart, 
  Factory, 
  FolderKanban, 
  ListTodo, 
  CheckSquare, 
  Layers, 
  Landmark, 
  PieChart, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Workspace } from '../core/workspace-sdk';
import { ManifestService } from '../core/services/ManifestService';
import { GlobalNavbar } from './components/GlobalNavbar';
import { UniversalCommandPalette } from './components/UniversalCommandPalette';
import { UniversalCreateModal } from './components/UniversalCreateModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AllianceHub } from './hub/AllianceHub';
import { MarketplacePage } from './pages/MarketplacePage';
import { DevelopersPage } from './pages/DevelopersPage';
import { ServicesPage } from './pages/ServicesPage';
import { CommunityPage } from './pages/CommunityPage';
import { UnifiedHelpPage } from './pages/UnifiedHelpPage';
import { usePlatformStore } from '../core/stores/platformStore';
import { identityApi } from '../core/api/identity';
import { Routes, Route, useNavigate, useLocation, NavLink } from 'react-router-dom';
import EducationModuleRoutes from '../modules/education/App';
import InventoryModuleRoutes from '../modules/inventory/App';
import FinanceModuleRoutes from '../modules/finance/App';
import LibraryModuleRoutes from '../modules/library/App';
import TasksModuleRoutes from '../modules/tasks/App';
import './Workspace.css';

// Navigation configurations for specialized module sidebars
const educationNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/app/education", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'ACADÉMIQUE', items: [
    { label: "Élèves", path: "/app/education/students", icon: Users, shortcut: '⌘ 2' },
    { label: "Enseignants", path: "/app/education/teachers", icon: GraduationCap },
    { label: "Classes", path: "/app/education/classes", icon: BookOpen },
    { label: "Matières", path: "/app/education/subjects", icon: Book },
  ]},
  { section: 'ÉVALUATION & DOCS', items: [
    { label: "Notes", path: "/app/education/grades", icon: Edit3, badge: '3' },
    { label: "Présences", path: "/app/education/presences", icon: Users },
    { label: "Bulletins & Rapports", path: "/app/education/reports", icon: Library },
    { label: "Cartes Scolaires", path: "/app/education/cards", icon: Users },
  ]},
  { section: 'GESTION', items: [
    { label: "Revenus & Finances", path: "/app/education/finance", icon: CreditCard, badge: 'Nouv.' },
    { label: "Années scolaires", path: "/app/education/academic-years", icon: Calendar },
  ]},
  { section: 'SYSTÈME', items: [
    { label: "Paramètres", path: "/app/education/settings", icon: Settings },
  ]}
];

const inventoryNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/app/inventory", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'CATALOGUE & STOCKS', items: [
    { label: "Articles & Stocks", path: "/app/inventory/products", icon: Package, shortcut: '⌘ 2' },
    { label: "Entrepôts & Dépôts", path: "/app/inventory/warehouses", icon: WarehouseIcon },
  ]},
  { section: 'TRAÇABILITÉ & AUDITS', items: [
    { label: "Mouvements de stock", path: "/app/inventory/stock-movements", icon: History },
    { label: "Inventaires Physiques", path: "/app/inventory/audits", icon: ClipboardList },
  ]},
  { section: 'APPROVISIONNEMENT', items: [
    { label: "Fournisseurs", path: "/app/inventory/suppliers", icon: Truck },
    { label: "Bons de Commande", path: "/app/inventory/purchase-orders", icon: ShoppingCart, badge: 'Flux' },
  ]},
  { section: 'PRODUCTION & FABRICATION', items: [
    { label: "Ordres de Fabrication", path: "/app/inventory/manufacturing", icon: Factory },
  ]},
  { section: 'CONFIGURATION', items: [
    { label: "Paramètres & Unités", path: "/app/inventory/settings", icon: Settings },
  ]}
];

const financeNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/app/finance", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'TRÉSORERIE & COMPTES', items: [
    { label: "Comptes & Caisses", path: "/app/finance/accounts", icon: Landmark, shortcut: '⌘ 2' },
    { label: "Journal des Opérations", path: "/app/finance/transactions", icon: History, badge: 'Flux' },
  ]},
  { section: 'PILOTAGE BUDGÉTAIRE', items: [
    { label: "Enveloppes & Budgets", path: "/app/finance/budgets", icon: PieChart },
  ]},
  { section: 'FACTURATION & TIERS', items: [
    { label: "Factures & Devis", path: "/app/finance/invoices", icon: FileText, badge: 'TVA' },
  ]},
  { section: 'CONFIGURATION', items: [
    { label: "Plan Analytique", path: "/app/finance/categories", icon: Settings },
  ]}
];

const libraryNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/app/library", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'CATALOGUE', items: [
    { label: "Ouvrages & Fonds", path: "/app/library/books", icon: Book },
  ]}
];

const tasksNavigation: any[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/app/tasks", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'ESPACE TRAVAIL', items: [
    { label: "Tableau Kanban", path: "/app/tasks/board", icon: Layers, shortcut: '⌘ 2' },
    { label: "Liste des Tâches", path: "/app/tasks/list", icon: ListTodo },
    { label: "Mes Tâches", path: "/app/tasks/my-tasks", icon: CheckSquare, badge: 'Moi' },
  ]},
  { section: 'PROJETS & JALONS', items: [
    { label: "Portefeuille Projets", path: "/app/tasks/projects", icon: FolderKanban },
  ]}
];

export const WorkspaceShell: React.FC = () => {
  const currentOrganization = usePlatformStore((s) => s.currentOrganization);
  const setOrganization = usePlatformStore((s) => s.setOrganization);
  const setOrganizations = usePlatformStore((s) => s.setOrganizations);
  const setWorkspaces = usePlatformStore((s) => s.setWorkspaces);
  const sidebarCollapsed = usePlatformStore((s) => s.sidebarCollapsed);
  const toggleSidebar = usePlatformStore((s) => s.toggleSidebar);
  const location = useLocation();

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Load organizations on start
  useEffect(() => {
    identityApi
      .getOrganizations()
      .then((orgs) => {
        if (orgs && orgs.length > 0) {
          setOrganizations(orgs);
          if (!currentOrganization) {
            setOrganization(orgs[0]);
          }
        } else if (!currentOrganization) {
          // Default fallback organization for seamless experience
          const defaultOrg = {
            id: 'b7e52a92-628b-4b14-8f19-35a22d4f820c',
            name: 'Collège & Lycée Bilingue Émergence',
            slug: 'emergence-school'
          };
          setOrganization(defaultOrg);
        }
      })
      .catch((err) => {
        console.warn('Backend identity offline, using default organization fallback:', err);
        if (!currentOrganization) {
          setOrganization({
            id: 'b7e52a92-628b-4b14-8f19-35a22d4f820c',
            name: 'Collège & Lycée Bilingue Émergence',
            slug: 'emergence-school'
          });
        }
      });
  }, [currentOrganization, setOrganization, setOrganizations]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active module from URL
  const isEdu = location.pathname.startsWith('/app/education');
  const isInv = location.pathname.startsWith('/app/inventory');
  const isFin = location.pathname.startsWith('/app/finance');
  const isLib = location.pathname.startsWith('/app/library');
  const isTsk = location.pathname.startsWith('/app/tasks');

  const isModuleView = isEdu || isInv || isFin || isLib || isTsk;

  let activeNav = educationNavigation;
  let activeModuleName = 'Éducation Pro';
  let activeModuleColor = '#4f46e5';

  if (isInv) {
    activeNav = inventoryNavigation;
    activeModuleName = 'Stocks & Logistique';
    activeModuleColor = '#0ea5e9';
  } else if (isFin) {
    activeNav = financeNavigation;
    activeModuleName = 'Finances & Trésorerie';
    activeModuleColor = '#059669';
  } else if (isLib) {
    activeNav = libraryNavigation;
    activeModuleName = 'Bibliothèque & CDI';
    activeModuleColor = '#3b82f6';
  } else if (isTsk) {
    activeNav = tasksNavigation;
    activeModuleName = 'Tâches & Projets';
    activeModuleColor = '#8b5cf6';
  }

  return (
    <div className="alliance-os-app-shell">
      {/* 1. GLOBAL OS NAVBAR */}
      <GlobalNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        unreadNotificationsCount={3}
      />

      {/* 2. MAIN BODY AREA */}
      <div className="os-body-layout">
        {/* Module Sidebar (Visible only when inside a business module) */}
        {isModuleView && (
          <motion.aside 
            className={`workspace-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
            initial={{ width: 260 }}
            animate={{ width: sidebarCollapsed ? 68 : 260 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="sidebar-module-header">
              {!sidebarCollapsed ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span 
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: activeModuleColor 
                      }}
                    ></span>
                    <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      {activeModuleName}
                    </strong>
                  </div>
                  <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
                    <ChevronLeft size={16} />
                  </button>
                </div>
              ) : (
                <button className="sidebar-collapse-btn" onClick={toggleSidebar}>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

            <nav className="sidebar-nav">
              {activeNav.map((sec, idx) => (
                <div key={idx} className="sidebar-section">
                  {!sidebarCollapsed && <div className="sidebar-section-title">{sec.section}</div>}
                  <ul className="sidebar-nav-list">
                    {sec.items.map((item: any) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            end={item.path === '/app/education' || item.path === '/app/inventory' || item.path === '/app/finance' || item.path === '/app/library' || item.path === '/app/tasks'}
                            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                          >
                            <Icon size={16} className="nav-link-icon" />
                            {!sidebarCollapsed && (
                              <span className="nav-link-label">{item.label}</span>
                            )}
                            {!sidebarCollapsed && item.badge && (
                              <span className="nav-link-badge">{item.badge}</span>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </motion.aside>
        )}

        {/* Dynamic Route Content */}
        <main className={`os-content-main ${isModuleView ? 'with-sidebar' : 'full-width'}`}>
          <Routes>
            {/* Primary Entry Point: Alliance Hub */}
            <Route 
              path="/" 
              element={
                <AllianceHub 
                  onOpenCreate={() => setIsCreateOpen(true)} 
                  onOpenSearch={() => setIsSearchOpen(true)} 
                />
              } 
            />

            {/* Ecosystem Pages */}
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/help" element={<UnifiedHelpPage />} />

            {/* Business Modules */}
            <Route path="/education/*" element={<EducationModuleRoutes />} />
            <Route path="/inventory/*" element={<InventoryModuleRoutes />} />
            <Route path="/finance/*" element={<FinanceModuleRoutes />} />
            <Route path="/library/*" element={<LibraryModuleRoutes />} />
            <Route path="/tasks/*" element={<TasksModuleRoutes />} />
          </Routes>
        </main>
      </div>

      {/* 3. UNIVERSAL MODALS & DRAWERS */}
      <UniversalCommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <UniversalCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <NotificationsDrawer 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />
    </div>
  );
};
