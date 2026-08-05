import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command as CmdIcon } from 'lucide-react';
import { Workspace } from '../core/workspace-sdk';
import type { Command } from '../core/services/CommandService';
import './CommandPalette.css';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const unsubscribe = Workspace.commands.subscribe(() => {
      setCommands(Workspace.commands.getAllCommands());
    });
    setCommands(Workspace.commands.getAllCommands());
    return unsubscribe;
  }, []);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const lowerSearch = search.toLowerCase();
    return commands.filter(c => 
      c.title.toLowerCase().includes(lowerSearch) || 
      c.module.toLowerCase().includes(lowerSearch)
    );
  }, [commands, search]);

  // Group by module
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach(cmd => {
      const mod = cmd.module || 'Général';
      if (!groups[mod]) groups[mod] = [];
      groups[mod].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Flatten for keyboard navigation
  const flatCommands = useMemo(() => {
    return Object.values(groupedCommands).flat();
  }, [groupedCommands]);

  // Reset selection on search change
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle keyboard navigation within the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatCommands.length) % flatCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          flatCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isOpen, flatCommands, selectedIndex]);

  // Scroll into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('.command-item[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="command-overlay" onClick={() => setIsOpen(false)}>
          <motion.div 
            className="command-dialog glass-panel"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-header">
              <Search className="command-icon" size={20} />
              <input 
                autoFocus
                placeholder="Rechercher une action, un étudiant, un produit..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="command-input"
              />
              <div className="command-shortcut-hint">
                <kbd>ESC</kbd> pour annuler
              </div>
            </div>
            
            <div className="command-list" ref={listRef}>
              {flatCommands.length === 0 ? (
                <div className="command-empty">
                  <CmdIcon size={32} />
                  <span>Aucun résultat trouvé pour "{search}".</span>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([moduleName, cmds], groupIndex) => {
                  // Calculate absolute index offset for this group
                  const prevGroupsCount = Object.values(groupedCommands)
                    .slice(0, groupIndex)
                    .flat().length;

                  return (
                    <div key={moduleName} className="command-group">
                      <div className="command-group-title">{moduleName}</div>
                      {cmds.map((cmd, localIndex) => {
                        const absoluteIndex = prevGroupsCount + localIndex;
                        const isSelected = absoluteIndex === selectedIndex;
                        
                        return (
                          <div 
                            key={cmd.id} 
                            className={`command-item ${isSelected ? 'selected' : ''}`}
                            data-selected={isSelected}
                            onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                            }}
                          >
                            <div className="command-item-left">
                              <span>{cmd.title}</span>
                            </div>
                            {cmd.shortcut && (
                              <div className="command-shortcuts">
                                {cmd.shortcut.map(key => <kbd key={key}>{key}</kbd>)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
