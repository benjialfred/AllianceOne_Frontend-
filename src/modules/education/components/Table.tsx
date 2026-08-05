import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Input } from './Input';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
  width?: string | number;
  sortable?: boolean;
}

export interface TableAction<T> {
  label: string;
  icon?: any;
  onClick: (selectedItems: T[]) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  selectable?: boolean;
  actions?: TableAction<T>[];
  pageSize?: number;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  searchable = true,
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucune donnée disponible",
  loading = false,
  selectable = true,
  actions = [],
  pageSize = 10
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Search Filter
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(item => {
      return columns.some(col => {
        const val = col.accessor && (item as any)[col.accessor];
        return val && String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, searchQuery, columns]);

  // 2. Sort
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = new Set(paginatedData.map(keyExtractor));
      setSelectedKeys(newSelected);
    } else {
      setSelectedKeys(new Set());
    }
  };

  const handleSelectRow = (key: string | number) => {
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedKeys(newSelected);
  };

  const selectedItems = useMemo(() => {
    return data.filter(item => selectedKeys.has(keyExtractor(item)));
  }, [data, selectedKeys, keyExtractor]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', width: '100%' }}>
      {/* Top Bar: Search & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        {searchable && (
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-4) var(--spacing-2) 2.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-surface-border)',
                outline: 'none',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-primary)',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-xs)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-accent-500)';
                e.target.style.boxShadow = '0 0 0 3px var(--color-accent-100)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-surface-border)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
              }}
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          <AnimatePresence>
            {selectedKeys.size > 0 && actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button 
                  variant={action.variant || 'primary'} 
                  size="sm" 
                  icon={action.icon}
                  onClick={() => action.onClick(selectedItems)}
                >
                  {action.label} ({selectedKeys.size})
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button variant="outline" size="sm" icon={Filter}>Filtres avancés</Button>
          <Button variant="outline" size="sm" icon={Download}>Exporter</Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-surface-bg)' }}>
              <tr>
                {selectable && (
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', width: '40px', borderBottom: '1px solid var(--color-surface-border)' }}>
                    <div className="checkbox-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={paginatedData.length > 0 && selectedKeys.size === paginatedData.length}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-accent-500)' }}
                      />
                    </div>
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    onClick={() => col.sortable !== false && handleSort(col.accessor as string)}
                    style={{ 
                      padding: 'var(--spacing-3) var(--spacing-4)', 
                      borderBottom: '1px solid var(--color-surface-border)',
                      fontWeight: 'var(--font-weight-semibold)', 
                      fontSize: '0.75rem', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--color-text-muted)',
                      width: col.width || 'auto',
                      cursor: col.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseOver={(e) => {
                       if (col.sortable !== false) e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                    onMouseOut={(e) => {
                       if (col.sortable !== false) e.currentTarget.style.color = 'var(--color-text-muted)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                      {col.header}
                      {sortConfig?.key === col.accessor && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} color="var(--color-accent-500)" /> : <ChevronDown size={14} color="var(--color-accent-500)" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: 'var(--spacing-10)', textAlign: 'center' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      style={{ width: 24, height: 24, border: '2px solid var(--color-accent-500)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}
                    />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} style={{ padding: 'var(--spacing-10)' }}>
                    <EmptyState 
                      title="Aucune donnée" 
                      description={searchQuery ? "Aucun résultat ne correspond à votre recherche." : emptyMessage}
                      icon={Search}
                    />
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {paginatedData.map((item, rowIdx) => {
                    const key = keyExtractor(item);
                    const isSelected = selectedKeys.has(key);
                    return (
                      <motion.tr 
                        key={key} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: rowIdx * 0.02 }}
                        onClick={() => onRowClick && onRowClick(item)}
                        style={{ 
                          borderBottom: rowIdx === paginatedData.length - 1 ? 'none' : '1px solid var(--color-surface-border)',
                          cursor: onRowClick ? 'pointer' : 'default',
                          backgroundColor: isSelected ? 'var(--color-accent-50)' : 'transparent',
                        }}
                        onMouseOver={(e: any) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                        }}
                        onMouseOut={(e: any) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {selectable && (
                          <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }} onClick={(e) => e.stopPropagation()}>
                            <div className="checkbox-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleSelectRow(key)}
                                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-accent-500)' }}
                              />
                            </div>
                          </td>
                        )}
                        {columns.map((col, colIdx) => (
                          <td key={colIdx} style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                            {col.render ? col.render(item) : (item as any)[col.accessor as string]}
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderTop: '1px solid var(--color-surface-border)',
            backgroundColor: 'var(--color-surface-bg)'
          }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Affichage <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{((currentPage - 1) * pageSize) + 1}</span> à <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{Math.min(currentPage * pageSize, sortedData.length)}</span> sur <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{sortedData.length}</span> résultats
            </span>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                icon={ChevronLeft}
              >
                Précédent
              </Button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                {currentPage} / {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Suivant <ChevronRight size={14} style={{ marginLeft: '4px' }} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
