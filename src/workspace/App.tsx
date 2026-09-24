import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, Book, FileText, 
  Calendar, CreditCard, Edit3, Settings, Library, Package, 
  Warehouse as WarehouseIcon, History, ClipboardList, Truck, 
  ShoppingCart, Factory, FolderKanban, ListTodo, CheckSquare, 
  Layers, Landmark, PieChart 
} from 'lucide-react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';

import { usePlatformStore } from '../core/stores/platformStore';
import { useAuthStore } from '../core/stores/authStore';
import { identityApi } from '../core/api/identity';

import { AllianceShell } from '../design-system/navigation/AllianceShell';
import type { NavSection } from '../design-system/navigation/ModuleSidebar';

// Modals
import { UniversalCommandPalette } from './components/UniversalCommandPalette';
import { UniversalCreateModal } from './components/UniversalCreateModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AllianceAICopilot } from './ai/AllianceAICopilot';
import { TelegramConnectModal } from './components/TelegramConnectModal';

// Pages
import { AllianceHub } from './hub/AllianceHub';
import { MarketplacePage } from './pages/MarketplacePage';
import { MarketplaceCallback } from './pages/MarketplaceCallback';
import { DevelopersPage } from './pages/DevelopersPage';
import { ServicesPage } from './pages/ServicesPage';
import { CommunityPage } from './pages/CommunityPage';
import { UnifiedHelpPage } from './pages/UnifiedHelpPage';
import { SettingsHubPage } from './pages/SettingsHubPage';
import { HyperAdminDashboard } from './pages/hyperadmin/HyperAdminDashboard';

// Module Routes
import EducationModuleRoutes from '../modules/education/App';
import InventoryModuleRoutes from '../modules/inventory/App';
import FinanceModuleRoutes from '../modules/finance/App';
import LibraryModuleRoutes from '../modules/library/App';
import TasksModuleRoutes from '../modules/tasks/App';

// Legacy CSS (kept for any remaining dependencies, though AllianceShell.css is now dominant)
import './Workspace.css';

// Navigation configurations for specialized module sidebars
const educationNavigation: NavSection[] = [
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

const inventoryNavigation: NavSection[] = [
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

const financeNavigation: NavSection[] = [
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

const libraryNavigation: NavSection[] = [
  { section: 'APERÇU', items: [
    { label: "Tableau de bord", path: "/app/library", icon: LayoutDashboard, shortcut: '⌘ 1' },
  ]},
  { section: 'CATALOGUE', items: [
    { label: "Ouvrages & Fonds", path: "/app/library/books", icon: Book },
  ]}
];

const tasksNavigation: NavSection[] = [
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

// Global Navigation for the Hub
const globalNavigation: NavSection[] = [
  { section: 'PLATEFORME', items: [
    { label: "Accueil", path: "/app", icon: LayoutDashboard, shortcut: '⌘ H' },
    { label: "Marketplace", path: "/app/marketplace", icon: Package },
    { label: "Réseau AO", path: "/app/community", icon: Users },
  ]},
  { section: 'ADMINISTRATION', items: [
    { label: "Paramètres", path: "/app/settings", icon: Settings },
  ]}
];

export const WorkspaceShell: React.FC = () => {
  const currentOrganization = usePlatformStore((s) => s.currentOrganization);
  const setOrganization = usePlatformStore((s) => s.setOrganization);
  const setOrganizations = usePlatformStore((s) => s.setOrganizations);
  const location = useLocation();
  const navigate = useNavigate();

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);

  // Auto-open Telegram Connect Modal if URL parameter ?telegram=connect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('telegram') === 'connect' || params.get('connect') === 'telegram' || params.get('telegram') === 'true') {
      setIsTelegramOpen(true);
    }
  }, [location.search]);

  // Onboarding check
  useEffect(() => {
    const checkOnboarding = async () => {
      if (location.pathname.includes('/onboarding')) return;

      const user = useAuthStore.getState().user;
      if (!user) return;

      const userOnboardingDone =
        user.onboarding_completed === true ||
        (!!user.email && localStorage.getItem(`alliance-onboarding-completed_${user.email}`) === 'true');

      if (userOnboardingDone) return;

      try {
        const { onboardingApi } = await import('../core/api/onboarding');
        const status = await onboardingApi.checkStatus();
        if (status.onboarding_completed) {
          useAuthStore.getState().setOnboardingCompleted(true);
        } else {
          navigate('/app/onboarding', { replace: true });
        }
      } catch (err) {
        if (!userOnboardingDone) {
          navigate('/app/onboarding', { replace: true });
        }
      }
    };
    checkOnboarding();
  }, [location.pathname, navigate]);

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
          // Default fallback organization
          setOrganization({
            id: 'b7e52a92-628b-4b14-8f19-35a22d4f820c',
            name: 'Collège & Lycée Bilingue Émergence',
            slug: 'emergence-school'
          });
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAIOpen((prev) => !prev);
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

  let activeNav = globalNavigation;
  let activeModuleName = 'Espace Général';
  let activeModuleColor = 'var(--ao-color-alliance-blue)';

  if (isEdu) {
    activeNav = educationNavigation;
    activeModuleName = 'Éducation Pro';
    activeModuleColor = 'var(--ao-color-alliance-blue)';
  } else if (isInv) {
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
    <AllianceShell
      onOpenSearch={() => setIsSearchOpen(true)}
      onOpenCreate={() => setIsCreateOpen(true)}
      onOpenNotifications={() => setIsNotifOpen(true)}
      onOpenAI={() => setIsAIOpen(true)}
      activeModuleNav={activeNav}
      activeModuleName={activeModuleName}
      activeModuleColor={activeModuleColor}
    >
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
        <Route path="/marketplace/callback" element={<MarketplaceCallback />} />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/help" element={<UnifiedHelpPage />} />
        <Route path="/settings" element={<SettingsHubPage onOpenTelegram={() => setIsTelegramOpen(true)} />} />

        {/* HyperAdmin Central Cockpit */}
        <Route path="/hyperadmin" element={<HyperAdminDashboard />} />

        {/* Business Modules */}
        <Route path="/education/*" element={<EducationModuleRoutes />} />
        <Route path="/inventory/*" element={<InventoryModuleRoutes />} />
        <Route path="/finance/*" element={<FinanceModuleRoutes />} />
        <Route path="/library/*" element={<LibraryModuleRoutes />} />
        <Route path="/tasks/*" element={<TasksModuleRoutes />} />
      </Routes>

      {/* 3. UNIVERSAL MODALS & DRAWERS */}
      <UniversalCommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <AllianceAICopilot 
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      <UniversalCreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />

      <NotificationsDrawer 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

      <TelegramConnectModal 
        isOpen={isTelegramOpen} 
        onClose={() => setIsTelegramOpen(false)} 
      />
    </AllianceShell>
  );
};
