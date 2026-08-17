/**
 * ALLIANCE ONE — UNIVERSAL COMMAND PALETTE (⌘K)
 * Recherche globale, navigation instantanée et exécution de commandes.
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  GraduationCap, 
  Package, 
  Landmark, 
  FolderKanban, 
  BookOpen, 
  Store, 
  Code2, 
  HelpCircle, 
  Settings, 
  Moon, 
  Sun, 
  UserPlus, 
  Receipt, 
  ShoppingCart, 
  CheckSquare, 
  Sparkles,
  Command
} from 'lucide-react';
import { usePlatformStore } from '../../core/stores/platformStore';
import './UniversalModals.css';

interface UniversalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Modules' | 'Actions Rapides' | 'Navigation' | 'Paramètres & Système';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  accentColor?: string;
  action: () => void;
  shortcut?: string;
}

export const UniversalCommandPalette: React.FC<UniversalCommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = usePlatformStore((s) => s.toggleTheme);
  const theme = usePlatformStore((s) => s.theme);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allCommands: CommandItem[] = useMemo(() => [
    // Modules
    {
      id: 'mod-edu',
      category: 'Modules',
      title: 'Éducation Pro',
      subtitle: 'Ouvrir le tableau de bord académique et scolaire',
      icon: GraduationCap,
      accentColor: '#4f46e5',
      action: () => navigate('/app/education'),
      shortcut: '⌘ 1'
    },
    {
      id: 'mod-inv',
      category: 'Modules',
      title: 'Stocks & Logistique WMS',
      subtitle: 'Articles, dépôts, valorisation PMP et approvisionnements',
      icon: Package,
      accentColor: '#0ea5e9',
      action: () => navigate('/app/inventory'),
      shortcut: '⌘ 2'
    },
    {
      id: 'mod-fin',
      category: 'Modules',
      title: 'Finances & Trésorerie',
      subtitle: 'Comptes, factures, transactions et budgets',
      icon: Landmark,
      accentColor: '#059669',
      action: () => navigate('/app/finance'),
      shortcut: '⌘ 3'
    },
    {
      id: 'mod-tsk',
      category: 'Modules',
      title: 'Tâches & Projets',
      subtitle: 'Tableaux Kanban, jalons et gestion d’équipe',
      icon: FolderKanban,
      accentColor: '#8b5cf6',
      action: () => navigate('/app/tasks'),
      shortcut: '⌘ 4'
    },
    {
      id: 'mod-lib',
      category: 'Modules',
      title: 'Bibliothèque & CDI',
      subtitle: 'Fonds documentaire, prêts et retards',
      icon: BookOpen,
      accentColor: '#3b82f6',
      action: () => navigate('/app/library'),
      shortcut: '⌘ 5'
    },

    // Actions Rapides
    {
      id: 'act-new-student',
      category: 'Actions Rapides',
      title: 'Inscrire un nouvel élève',
      subtitle: 'Créer une fiche élève complète avec classe et tuteurs',
      icon: UserPlus,
      accentColor: '#4f46e5',
      action: () => navigate('/app/education/students/new')
    },
    {
      id: 'act-new-payment',
      category: 'Actions Rapides',
      title: 'Enregistrer une transaction / recette',
      subtitle: 'Entrée ou sortie de fonds avec reçu instantané',
      icon: Receipt,
      accentColor: '#059669',
      action: () => navigate('/app/finance/transactions')
    },
    {
      id: 'act-new-product',
      category: 'Actions Rapides',
      title: 'Ajouter un article de stock',
      subtitle: 'Référence SKU, code-barres et prix unitaire',
      icon: ShoppingCart,
      accentColor: '#0ea5e9',
      action: () => navigate('/app/inventory/products')
    },
    {
      id: 'act-new-task',
      category: 'Actions Rapides',
      title: 'Créer une nouvelle tâche',
      subtitle: 'Ajouter au tableau Kanban avec niveau de priorité',
      icon: CheckSquare,
      accentColor: '#8b5cf6',
      action: () => navigate('/app/tasks/board')
    },

    // Navigation & Écosystème
    {
      id: 'nav-hub',
      category: 'Navigation',
      title: 'Alliance Hub (Accueil Central)',
      subtitle: 'Cockpit principal et vue d’ensemble du système',
      icon: Command,
      action: () => navigate('/')
    },
    {
      id: 'nav-mkt',
      category: 'Navigation',
      title: 'Marketplace d’applications',
      subtitle: 'Découvrir et installer des connecteurs et extensions',
      icon: Store,
      action: () => navigate('/app/marketplace')
    },
    {
      id: 'nav-dev',
      category: 'Navigation',
      title: 'Developer Hub & API Keys',
      subtitle: 'Documentation technique, SDK et bac à sable REST',
      icon: Code2,
      action: () => navigate('/app/developers')
    },
    {
      id: 'nav-help',
      category: 'Navigation',
      title: 'Centre d’Aide & Documentation',
      subtitle: 'Guides interactifs, tutoriels et assistance technique',
      icon: HelpCircle,
      action: () => navigate('/app/help')
    },

    // Système
    {
      id: 'sys-theme',
      category: 'Paramètres & Système',
      title: `Basculer en ${theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}`,
      subtitle: 'Changer le thème visuel du Business OS',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme()
    }
  ], [navigate, theme, toggleTheme]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  // Handle Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="universal-modal-backdrop" onClick={onClose}>
      <motion.div 
        className="universal-modal-card palette-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
      >
        {/* Search Input */}
        <div className="palette-search-bar">
          <Search size={18} className="palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="palette-search-input"
            placeholder="Rechercher une application, une action, un élève, une commande..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="palette-esc-kbd" onClick={onClose}>ESC</kbd>
        </div>

        {/* Results List */}
        <div className="palette-results-container">
          {filteredCommands.length === 0 ? (
            <div className="palette-empty-state">
              <Sparkles size={24} color="#94a3b8" />
              <p>Aucun résultat pour "{query}"</p>
              <span>Essayez de rechercher "élève", "facture", "stock" ou "thème"</span>
            </div>
          ) : (
            <div className="palette-results-list">
              {filteredCommands.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    className={`palette-result-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div 
                      className="palette-item-icon"
                      style={{ 
                        backgroundColor: item.accentColor ? `${item.accentColor}15` : 'var(--color-surface-hover)', 
                        color: item.accentColor || 'var(--color-text-primary)' 
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="palette-item-text">
                      <div className="palette-item-title-row">
                        <span className="palette-item-title">{item.title}</span>
                        <span className="palette-item-category">{item.category}</span>
                      </div>
                      <div className="palette-item-subtitle">{item.subtitle}</div>
                    </div>

                    {item.shortcut && (
                      <kbd className="palette-item-shortcut">{item.shortcut}</kbd>
                    )}

                    <ArrowRight size={14} className="palette-item-arrow" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="palette-footer">
          <div className="palette-footer-hint">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Naviguer</span>
            <span><kbd>↵</kbd> Ouvrir</span>
            <span><kbd>ESC</kbd> Fermer</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Alliance One Omnisearch
          </div>
        </div>
      </motion.div>
    </div>
  );
};
