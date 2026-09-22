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
  Command,
  Clock
} from 'lucide-react';
import { usePlatformStore } from '../../core/stores/platformStore';
import './UniversalCommandPalette.css';

interface UniversalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Modules' | 'Actions Rapides' | 'Navigation' | 'Paramètres & Système' | 'Récent';
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
    { id: 'mod-edu', category: 'Modules', title: 'Éducation Pro', subtitle: 'Tableau de bord académique', icon: GraduationCap, accentColor: '#4f46e5', action: () => navigate('/app/education'), shortcut: '⌘ 1' },
    { id: 'mod-inv', category: 'Modules', title: 'Stocks & Logistique', subtitle: 'Articles, dépôts, PMP', icon: Package, accentColor: '#0ea5e9', action: () => navigate('/app/inventory'), shortcut: '⌘ 2' },
    { id: 'mod-fin', category: 'Modules', title: 'Finances & Trésorerie', subtitle: 'Comptes, factures, budgets', icon: Landmark, accentColor: '#059669', action: () => navigate('/app/finance'), shortcut: '⌘ 3' },
    { id: 'mod-tsk', category: 'Modules', title: 'Tâches & Projets', subtitle: 'Kanban, jalons, équipe', icon: FolderKanban, accentColor: '#8b5cf6', action: () => navigate('/app/tasks'), shortcut: '⌘ 4' },
    { id: 'mod-lib', category: 'Modules', title: 'Bibliothèque & CDI', subtitle: 'Fonds documentaire, prêts', icon: BookOpen, accentColor: '#3b82f6', action: () => navigate('/app/library'), shortcut: '⌘ 5' },

    // Actions Rapides
    { id: 'act-new-student', category: 'Actions Rapides', title: 'Inscrire un nouvel élève', subtitle: 'Créer une fiche élève complète', icon: UserPlus, accentColor: '#4f46e5', action: () => navigate('/app/education/students/new') },
    { id: 'act-new-payment', category: 'Actions Rapides', title: 'Enregistrer une recette', subtitle: 'Entrée ou sortie de fonds', icon: Receipt, accentColor: '#059669', action: () => navigate('/app/finance/transactions') },
    { id: 'act-new-product', category: 'Actions Rapides', title: 'Ajouter un article de stock', subtitle: 'Référence SKU, prix', icon: ShoppingCart, accentColor: '#0ea5e9', action: () => navigate('/app/inventory/products') },
    { id: 'act-new-task', category: 'Actions Rapides', title: 'Créer une nouvelle tâche', subtitle: 'Ajouter au tableau Kanban', icon: CheckSquare, accentColor: '#8b5cf6', action: () => navigate('/app/tasks/board') },

    // Navigation & Écosystème
    { id: 'nav-hub', category: 'Navigation', title: 'Alliance Hub (Accueil)', subtitle: 'Vue d’ensemble de votre espace', icon: Command, action: () => navigate('/') },
    { id: 'nav-mkt', category: 'Navigation', title: 'Marketplace d’applications', subtitle: 'Connecteurs et extensions', icon: Store, action: () => navigate('/app/marketplace') },
    { id: 'nav-dev', category: 'Navigation', title: 'Developer Hub', subtitle: 'Documentation, SDK, REST', icon: Code2, action: () => navigate('/app/developers') },
    { id: 'nav-help', category: 'Navigation', title: 'Centre d’Aide', subtitle: 'Guides et assistance', icon: HelpCircle, action: () => navigate('/app/help') },

    // Système
    { id: 'sys-theme', category: 'Paramètres & Système', title: `Basculer en ${theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}`, subtitle: 'Changer le thème visuel', icon: theme === 'dark' ? Sun : Moon, action: () => toggleTheme() }
  ], [navigate, theme, toggleTheme]);

  // Idle state (no query): show recents and suggestions
  const idleCommands: CommandItem[] = useMemo(() => {
    return [
      { id: 'rec-1', category: 'Récent', title: 'Tableau de bord Éducation', subtitle: 'Consulté récemment', icon: Clock, action: () => navigate('/app/education') },
      { id: 'rec-2', category: 'Récent', title: 'Enregistrer une recette', subtitle: 'Action récente', icon: Receipt, accentColor: '#059669', action: () => navigate('/app/finance/transactions') },
      ...allCommands.filter(c => c.category === 'Modules')
    ];
  }, [allCommands, navigate]);

  const activeCommands = useMemo(() => {
    if (!query.trim()) return idleCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [allCommands, idleCommands, query]);

  // Group commands by category for display
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    activeCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [activeCommands]);

  const flatActiveList = useMemo(() => {
    return Object.values(groupedCommands).flat();
  }, [groupedCommands]);

  // Handle Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatActiveList.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatActiveList.length) % Math.max(1, flatActiveList.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatActiveList[selectedIndex]) {
          flatActiveList[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatActiveList, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ao-cmd-backdrop" onClick={onClose}>
      <motion.div 
        className="ao-cmd-surface"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -16 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="ao-cmd-input-wrapper">
          <Search size={18} className="ao-cmd-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="ao-cmd-input"
            placeholder="Que souhaitez-vous accomplir ?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button className="ao-cmd-badge" onClick={() => { setQuery(''); setSelectedIndex(0); inputRef.current?.focus(); }}>
              EFFACER
            </button>
          )}
          <kbd className="ao-cmd-badge" onClick={onClose}>ESC</kbd>
        </div>

        <div className="ao-cmd-content">
          {flatActiveList.length === 0 ? (
            <div className="ao-cmd-empty">
              <Sparkles size={28} color="var(--ao-color-text-tertiary)" />
              <div className="ao-cmd-empty-title">Aucun résultat pour "{query}"</div>
              <div className="ao-cmd-empty-subtitle">Essayez des termes comme "élève", "facture" ou "thème"</div>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="ao-cmd-section-title">{category}</div>
                {items.map(item => {
                  const globalIndex = flatActiveList.findIndex(i => i.id === item.id);
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = item.icon;
                  
                  return (
                    <div
                      key={item.id}
                      className="ao-cmd-item"
                      data-selected={isSelected}
                      onClick={() => { item.action(); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <div className="ao-cmd-item-icon" style={{ 
                        background: item.accentColor ? `${item.accentColor}1A` : 'var(--ao-color-bg-tertiary)',
                        color: item.accentColor || 'var(--ao-color-text-primary)'
                      }}>
                        <Icon size={16} />
                      </div>
                      <div className="ao-cmd-item-body">
                        <span className="ao-cmd-item-title">{item.title}</span>
                        <span className="ao-cmd-item-subtitle">{item.subtitle}</span>
                      </div>
                      {item.shortcut && (
                        <div className="ao-cmd-hint" style={{ marginRight: 8 }}>
                          <kbd>{item.shortcut}</kbd>
                        </div>
                      )}
                      <ArrowRight size={16} className="ao-cmd-item-action" />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="ao-cmd-footer">
          <div className="ao-cmd-footer-hints">
            <div className="ao-cmd-hint"><kbd>↑</kbd><kbd>↓</kbd> Naviguer</div>
            <div className="ao-cmd-hint"><kbd>↵</kbd> Ouvrir</div>
          </div>
          <div style={{ fontWeight: 600 }}>Alliance OS Omnisearch</div>
        </div>
      </motion.div>
    </div>
  );
};
