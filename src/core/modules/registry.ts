/**
 * ALLIANCE ONE — MODULE REGISTRY & MANIFEST CONTRACT
 * Source de vérité unique pour les modules du Business Operating System.
 */
import { 
  GraduationCap, 
  Package, 
  Landmark, 
  BookOpen, 
  FolderKanban, 
  Stethoscope, 
  Users2, 
  Share2, 
  Cpu, 
  ShieldCheck, 
  Bot,
  Zap
} from 'lucide-react';
import React from 'react';

export interface ModuleManifest {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'core' | 'operations' | 'finance' | 'productivity' | 'vertical' | 'ai';
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  accentColor: string;
  routePath: string;
  version: string;
  developer: {
    name: string;
    verified: boolean;
    avatar?: string;
  };
  isInstalled: boolean;
  isNative: boolean;
  status: 'active' | 'beta' | 'coming_soon' | 'maintenance';
  rating: number;
  installCount: string;
  lastUpdated: string;
  permissions: string[];
  features: string[];
  metrics?: {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
}

export const ALLIANCE_MODULES: ModuleManifest[] = [
  {
    id: 'education',
    name: 'Éducation Pro',
    tagline: "Gestion complète d'établissement scolaire & académique",
    description: "Inscriptions, gestion des classes, relevés & bulletins PDF conformes, suivi financier des scolarités et cartes scolaires d'élèves.",
    category: 'vertical',
    icon: GraduationCap,
    accentColor: '#4f46e5',
    routePath: '/education',
    version: '2.4.0',
    developer: {
      name: 'Alliance Core Team',
      verified: true
    },
    isInstalled: true,
    isNative: true,
    status: 'active',
    rating: 4.9,
    installCount: '12 400',
    lastUpdated: '16 Août 2026',
    permissions: ['students:read_write', 'grades:publish', 'finances:read_write'],
    features: [
      'Gestion centralisée des élèves & enseignants',
      'Calcul automatique des moyennes et classements',
      'Génération de bulletins et relevés PDF officiels',
      'Cartes scolaires biométriques & QR Code'
    ],
    metrics: [
      { label: 'Élèves Inscrits', value: '482', change: '+12%', trend: 'up' },
      { label: 'Taux de Recouvrement', value: '88.4%', change: '+4.1%', trend: 'up' }
    ]
  },
  {
    id: 'inventory',
    name: 'Stocks & Logistique WMS',
    tagline: 'Valorisation PMP, traçabilité multi-dépôts & approvisionnement',
    description: 'Contrôle des stocks en temps réel, alertes intelligentes de réapprovisionnement, gestion des lots, fabrication (BOM) et inventaires physiques.',
    category: 'operations',
    icon: Package,
    accentColor: '#0ea5e9',
    routePath: '/inventory',
    version: '2.1.0',
    developer: {
      name: 'Alliance Core Team',
      verified: true
    },
    isInstalled: true,
    isNative: true,
    status: 'active',
    rating: 4.8,
    installCount: '8 900',
    lastUpdated: '16 Août 2026',
    permissions: ['products:read_write', 'stock:adjust', 'orders:create'],
    features: [
      'Multi-entrepôts & traçabilité par emplacement',
      'Méthode PMP & valorisation temps réel',
      'Bons de commande & réassort automatique',
      'Ordres de fabrication & nomenclatures (BOM)'
    ],
    metrics: [
      { label: 'Valeur de Stock', value: '42.8M FCFA', change: '+2.4%', trend: 'up' },
      { label: 'Alertes Réassort', value: '3 articles', change: 'Priorité', trend: 'down' }
    ]
  },
  {
    id: 'finance',
    name: 'Finances & Trésorerie',
    tagline: 'Comptes, journaux, devis/facturation & pilotage budgétaire',
    description: 'Vision consolidée des liquidités, gestion multi-devises, rapprochement bancaire, facturation électronique et enveloppes budgétaires analytiques.',
    category: 'finance',
    icon: Landmark,
    accentColor: '#059669',
    routePath: '/finance',
    version: '2.3.1',
    developer: {
      name: 'Alliance Core Team',
      verified: true
    },
    isInstalled: true,
    isNative: true,
    status: 'active',
    rating: 4.9,
    installCount: '15 200',
    lastUpdated: '15 Août 2026',
    permissions: ['accounts:read_write', 'transactions:execute', 'invoices:issue'],
    features: [
      'Comptes & caisses multi-devises (XAF, EUR, USD)',
      'Facturation certifiée avec suivi des paiements',
      'Budgets prévisionnels vs réalisés',
      'Tontines & micro-épargne d’entreprise'
    ],
    metrics: [
      { label: 'Trésorerie Nette', value: '18.4M FCFA', change: '+8.2%', trend: 'up' },
      { label: 'Factures en Attente', value: '4', change: '3.1M FCFA', trend: 'neutral' }
    ]
  },
  {
    id: 'tasks',
    name: 'Tâches & Projets',
    tagline: 'Tableaux Kanban, suivi du temps & collaboration d’équipe',
    description: 'Pilotage de projets agiles, attribution des responsabilités, gestion des jalons, priorités et notifications en direct.',
    category: 'productivity',
    icon: FolderKanban,
    accentColor: '#8b5cf6',
    routePath: '/tasks',
    version: '1.9.0',
    developer: {
      name: 'Alliance Core Team',
      verified: true
    },
    isInstalled: true,
    isNative: true,
    status: 'active',
    rating: 4.7,
    installCount: '9 400',
    lastUpdated: '14 Août 2026',
    permissions: ['projects:manage', 'tasks:assign'],
    features: [
      'Tableaux Kanban fluides avec drag-and-drop',
      'Filtres par priorité, membre et échéance',
      'Checklists & sous-tâches interactives',
      'Timeline visuelle des projets'
    ],
    metrics: [
      { label: 'Tâches Actives', value: '24', change: '6 urgentes', trend: 'neutral' },
      { label: 'Vélocité', value: '92%', change: '+5%', trend: 'up' }
    ]
  },
  {
    id: 'library',
    name: 'Bibliothèque & CDI',
    tagline: 'Fonds documentaire, gestion des prêts & relances',
    description: 'Indexation des ouvrages, gestion des emprunteurs, suivi des retards, alertes par email/SMS et inventaire du fonds.',
    category: 'operations',
    icon: BookOpen,
    accentColor: '#3b82f6',
    routePath: '/library',
    version: '1.4.0',
    developer: {
      name: 'Alliance Core Team',
      verified: true
    },
    isInstalled: true,
    isNative: true,
    status: 'active',
    rating: 4.6,
    installCount: '4 100',
    lastUpdated: '12 Août 2026',
    permissions: ['books:catalog', 'loans:manage'],
    features: [
      'Catalogue avec code-barres et ISBN',
      'Enregistrement instantané des emprunts et retours',
      'Calcul automatique des pénalités de retard'
    ],
    metrics: [
      { label: 'Ouvrages Référencés', value: '1 240', change: '+32 ce mois', trend: 'up' },
      { label: 'Prêts en cours', value: '38', change: '2 retards', trend: 'neutral' }
    ]
  },
  {
    id: 'healthcare',
    name: 'Santé & Clinique',
    tagline: 'Dossiers patients, consultations, ordonnances & pharmacie',
    description: 'Système d’information hospitalier et de cabinet médical adapté aux contextes connectés et déconnectés.',
    category: 'vertical',
    icon: Stethoscope,
    accentColor: '#10b981',
    routePath: '/healthcare',
    version: '0.9.0',
    developer: {
      name: 'Alliance Health Labs',
      verified: true
    },
    isInstalled: false,
    isNative: true,
    status: 'coming_soon',
    rating: 4.9,
    installCount: '2 800 (Bêta)',
    lastUpdated: '10 Août 2026',
    permissions: ['patients:records', 'prescriptions:write'],
    features: [
      'Dossier médical électronique universel',
      'Facturation des actes médicaux & mutuelles',
      'Gestion de l’officine & dispensaire'
    ]
  },
  {
    id: 'crm',
    name: 'Alliance CRM & Relations',
    tagline: 'Pipeline commercial, contacts & omnicanal WhatsApp',
    description: 'Suivi des prospects, synchronisation des échanges WhatsApp & Email, rappels automatiques et reporting commercial.',
    category: 'productivity',
    icon: Users2,
    accentColor: '#f59e0b',
    routePath: '/crm',
    version: '1.0.0-rc',
    developer: {
      name: 'Alliance Studio',
      verified: true
    },
    isInstalled: false,
    isNative: false,
    status: 'beta',
    rating: 4.8,
    installCount: '1 400',
    lastUpdated: '11 Août 2026',
    permissions: ['contacts:manage', 'deals:read_write'],
    features: [
      'Pipeline visuel en étapes configurables',
      'Intégration WhatsApp Business API',
      'Relances programmées & historique complet'
    ]
  },
  {
    id: 'ai-assistant',
    name: 'Alliance AI Intelligence',
    tagline: 'Copilote d’automatisation & synthèse décisionnelle',
    description: 'Analyse prédictive de vos chiffres, génération de synthèses instantanées, alertes intelligentes et recherche sémantique.',
    category: 'ai',
    icon: Bot,
    accentColor: '#ec4899',
    routePath: '/ai-assistant',
    version: '1.2.0',
    developer: {
      name: 'Alliance AI Lab',
      verified: true
    },
    isInstalled: true,
    isNative: true,
    status: 'active',
    rating: 5.0,
    installCount: '18 000',
    lastUpdated: '15 Août 2026',
    permissions: ['analytics:query', 'automation:trigger'],
    features: [
      'Détection précoce des anomalies de caisse',
      'Prévision de trésorerie à 30 jours',
      'Questions en langage naturel sur vos données'
    ]
  }
];

export class ModuleRegistry {
  static getAll(): ModuleManifest[] {
    return ALLIANCE_MODULES;
  }

  static getInstalled(): ModuleManifest[] {
    return ALLIANCE_MODULES.filter((m) => m.isInstalled);
  }

  static getDiscoverable(): ModuleManifest[] {
    return ALLIANCE_MODULES.filter((m) => !m.isInstalled || m.status === 'beta' || m.status === 'coming_soon');
  }

  static getById(id: string): ModuleManifest | undefined {
    return ALLIANCE_MODULES.find((m) => m.id === id);
  }

  static getByCategory(category: ModuleManifest['category']): ModuleManifest[] {
    return ALLIANCE_MODULES.filter((m) => m.category === category);
  }
}
