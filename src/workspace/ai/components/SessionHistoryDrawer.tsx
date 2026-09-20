import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, MessageSquare, Pin, Trash2, Edit2, Check, 
  Search, Clock, Sparkles, RefreshCw, AlertCircle, ChevronRight
} from 'lucide-react';
import { API_HOST_URL } from '../../../core/api/client';
import { useAuthStore } from '../../../core/stores/authStore';
import './SessionHistoryDrawer.css';

export interface ConversationSummary {
  id: string;
  title: string;
  organization_id: string;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: {
    content: string;
    sender: string;
    created_at: string;
  } | null;
}

interface SessionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewSession: () => void;
}

export const SessionHistoryDrawer: React.FC<SessionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  activeConversationId,
  onSelectConversation,
  onNewSession
}) => {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (user?.email) {
      headers['X-User-Email'] = user.email;
    }
    return headers;
  }, [token, user]);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let res: Response;
      const url = `${API_HOST_URL}/api/core/ai/conversations/`;
      try {
        res = await fetch(url, { headers: getHeaders() });
      } catch {
        res = await fetch(`http://127.0.0.1:8000/api/core/ai/conversations/`, { headers: getHeaders() });
      }

      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      } else {
        throw new Error(`Erreur ${res.status}: Impossible de charger les sessions.`);
      }
    } catch (err: any) {
      console.warn('Failed to load conversation history:', err);
      setError(err.message || 'Erreur lors du chargement de l\'historique.');
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  const handleTogglePin = async (e: React.MouseEvent, conv: ConversationSummary) => {
    e.stopPropagation();
    const nextPinned = !conv.is_pinned;
    setConversations((prev) => 
      prev.map((c) => (c.id === conv.id ? { ...c, is_pinned: nextPinned } : c))
    );

    try {
      const url = `${API_HOST_URL}/api/core/ai/conversations/${conv.id}/`;
      let res: Response;
      try {
        res = await fetch(url, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ is_pinned: nextPinned })
        });
      } catch {
        res = await fetch(`http://127.0.0.1:8000/api/core/ai/conversations/${conv.id}/`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ is_pinned: nextPinned })
        });
      }
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setConversations((prev) => 
        prev.map((c) => (c.id === conv.id ? { ...c, is_pinned: conv.is_pinned } : c))
      );
    }
  };

  const handleDelete = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    if (!window.confirm('Voulez-vous supprimer définitivement cette session ?')) return;

    setConversations((prev) => prev.filter((c) => c.id !== convId));

    try {
      const url = `${API_HOST_URL}/api/core/ai/conversations/${convId}/`;
      try {
        await fetch(url, { method: 'DELETE', headers: getHeaders() });
      } catch {
        await fetch(`http://127.0.0.1:8000/api/core/ai/conversations/${convId}/`, { method: 'DELETE', headers: getHeaders() });
      }
      if (activeConversationId === convId) {
        onNewSession();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      fetchConversations();
    }
  };

  const handleStartRename = (e: React.MouseEvent, conv: ConversationSummary) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = async (e: React.MouseEvent | React.FormEvent, convId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!editingTitle.trim()) return;

    const newTitle = editingTitle.trim();
    setConversations((prev) => 
      prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c))
    );
    setEditingId(null);

    try {
      const url = `${API_HOST_URL}/api/core/ai/conversations/${convId}/`;
      try {
        await fetch(url, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ title: newTitle })
        });
      } catch {
        await fetch(`http://127.0.0.1:8000/api/core/ai/conversations/${convId}/`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ title: newTitle })
        });
      }
    } catch (err) {
      console.error('Failed to update title:', err);
      fetchConversations();
    }
  };

  // Filtered & Grouped
  const filtered = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.last_message?.content && c.last_message.content.toLowerCase().includes(q))
    );
  });

  const pinnedList = filtered.filter((c) => c.is_pinned);
  const unpinnedList = filtered.filter((c) => !c.is_pinned);

  // Group unpinned by time
  const now = new Date().getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const todayList: ConversationSummary[] = [];
  const yesterdayList: ConversationSummary[] = [];
  const pastWeekList: ConversationSummary[] = [];
  const olderList: ConversationSummary[] = [];

  unpinnedList.forEach((c) => {
    const updated = new Date(c.updated_at).getTime();
    const diff = now - updated;
    if (diff < ONE_DAY) {
      todayList.push(c);
    } else if (diff < 2 * ONE_DAY) {
      yesterdayList.push(c);
    } else if (diff < 7 * ONE_DAY) {
      pastWeekList.push(c);
    } else {
      olderList.push(c);
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="ao-history-drawer-overlay" onClick={onClose}>
        <motion.div 
          className="ao-history-drawer"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="ao-drawer-header">
            <div className="ao-drawer-title-row">
              <div className="ao-drawer-title-wrap">
                <MessageSquare size={18} className="ao-drawer-title-icon" />
                <h3>Historique des Sessions</h3>
              </div>
              <button className="ao-drawer-close-btn" onClick={onClose} aria-label="Fermer le tiroir">
                <X size={18} />
              </button>
            </div>

            {/* New Session CTA */}
            <button 
              className="ao-new-session-cta"
              onClick={() => {
                onNewSession();
                onClose();
              }}
            >
              <Plus size={16} />
              <span>Nouvelle session</span>
              <Sparkles size={14} className="ao-sparkle-icon" />
            </button>

            {/* Search Input */}
            <div className="ao-drawer-search-box">
              <Search size={14} className="ao-search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher une discussion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="ao-clear-search" onClick={() => setSearchQuery('')}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Drawer Body / List */}
          <div className="ao-drawer-body">
            {loading && conversations.length === 0 ? (
              <div className="ao-drawer-loading">
                <RefreshCw size={20} className="ao-spin" />
                <span>Chargement de vos conversations...</span>
              </div>
            ) : error ? (
              <div className="ao-drawer-error">
                <AlertCircle size={16} />
                <span>{error}</span>
                <button onClick={fetchConversations}>Réessayer</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="ao-drawer-empty">
                <Clock size={28} />
                <p>Aucune session trouvée</p>
                <small>Vos échanges passés avec Alliance AI apparaîtront ici.</small>
              </div>
            ) : (
              <div className="ao-conversation-groups">
                {/* Pinned Group */}
                {pinnedList.length > 0 && (
                  <div className="ao-group-section">
                    <span className="ao-group-label">📌 Épinglées</span>
                    {pinnedList.map((conv) => (
                      <ConversationItem 
                        key={conv.id}
                        conv={conv}
                        isActive={conv.id === activeConversationId}
                        isEditing={editingId === conv.id}
                        editingTitle={editingTitle}
                        onSetEditingTitle={setEditingTitle}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose();
                        }}
                        onTogglePin={(e) => handleTogglePin(e, conv)}
                        onStartRename={(e) => handleStartRename(e, conv)}
                        onSaveRename={(e) => handleSaveRename(e, conv.id)}
                        onDelete={(e) => handleDelete(e, conv.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Today */}
                {todayList.length > 0 && (
                  <div className="ao-group-section">
                    <span className="ao-group-label">Aujourd'hui</span>
                    {todayList.map((conv) => (
                      <ConversationItem 
                        key={conv.id}
                        conv={conv}
                        isActive={conv.id === activeConversationId}
                        isEditing={editingId === conv.id}
                        editingTitle={editingTitle}
                        onSetEditingTitle={setEditingTitle}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose();
                        }}
                        onTogglePin={(e) => handleTogglePin(e, conv)}
                        onStartRename={(e) => handleStartRename(e, conv)}
                        onSaveRename={(e) => handleSaveRename(e, conv.id)}
                        onDelete={(e) => handleDelete(e, conv.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Yesterday */}
                {yesterdayList.length > 0 && (
                  <div className="ao-group-section">
                    <span className="ao-group-label">Hier</span>
                    {yesterdayList.map((conv) => (
                      <ConversationItem 
                        key={conv.id}
                        conv={conv}
                        isActive={conv.id === activeConversationId}
                        isEditing={editingId === conv.id}
                        editingTitle={editingTitle}
                        onSetEditingTitle={setEditingTitle}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose();
                        }}
                        onTogglePin={(e) => handleTogglePin(e, conv)}
                        onStartRename={(e) => handleStartRename(e, conv)}
                        onSaveRename={(e) => handleSaveRename(e, conv.id)}
                        onDelete={(e) => handleDelete(e, conv.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Past 7 days */}
                {pastWeekList.length > 0 && (
                  <div className="ao-group-section">
                    <span className="ao-group-label">7 derniers jours</span>
                    {pastWeekList.map((conv) => (
                      <ConversationItem 
                        key={conv.id}
                        conv={conv}
                        isActive={conv.id === activeConversationId}
                        isEditing={editingId === conv.id}
                        editingTitle={editingTitle}
                        onSetEditingTitle={setEditingTitle}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose();
                        }}
                        onTogglePin={(e) => handleTogglePin(e, conv)}
                        onStartRename={(e) => handleStartRename(e, conv)}
                        onSaveRename={(e) => handleSaveRename(e, conv.id)}
                        onDelete={(e) => handleDelete(e, conv.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Older */}
                {olderList.length > 0 && (
                  <div className="ao-group-section">
                    <span className="ao-group-label">Plus anciennes</span>
                    {olderList.map((conv) => (
                      <ConversationItem 
                        key={conv.id}
                        conv={conv}
                        isActive={conv.id === activeConversationId}
                        isEditing={editingId === conv.id}
                        editingTitle={editingTitle}
                        onSetEditingTitle={setEditingTitle}
                        onSelect={() => {
                          onSelectConversation(conv.id);
                          onClose();
                        }}
                        onTogglePin={(e) => handleTogglePin(e, conv)}
                        onStartRename={(e) => handleStartRename(e, conv)}
                        onSaveRename={(e) => handleSaveRename(e, conv.id)}
                        onDelete={(e) => handleDelete(e, conv.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="ao-drawer-footer">
            <div className="ao-footer-info">
              <span>{conversations.length} sessions synchronisées</span>
              <button className="ao-refresh-btn" onClick={fetchConversations} title="Actualiser la liste">
                <RefreshCw size={13} className={loading ? 'ao-spin' : ''} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ConversationItemProps {
  conv: ConversationSummary;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  onSetEditingTitle: (t: string) => void;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onStartRename: (e: React.MouseEvent) => void;
  onSaveRename: (e: React.MouseEvent | React.FormEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conv,
  isActive,
  isEditing,
  editingTitle,
  onSetEditingTitle,
  onSelect,
  onTogglePin,
  onStartRename,
  onSaveRename,
  onDelete
}) => {
  return (
    <div 
      className={`ao-conv-item ${isActive ? 'active' : ''}`}
      onClick={onSelect}
    >
      <div className="ao-conv-main">
        {isEditing ? (
          <form className="ao-rename-form" onSubmit={onSaveRename}>
            <input 
              type="text"
              value={editingTitle}
              autoFocus
              onChange={(e) => onSetEditingTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="submit" className="ao-save-rename-btn" onClick={onSaveRename}>
              <Check size={13} />
            </button>
          </form>
        ) : (
          <div className="ao-conv-title-wrap">
            <span className="ao-conv-title">{conv.title}</span>
            {isActive && <span className="ao-active-pill">En cours</span>}
          </div>
        )}

        {conv.last_message?.content && !isEditing && (
          <p className="ao-conv-preview">{conv.last_message.content}</p>
        )}
      </div>

      <div className="ao-conv-actions">
        <button 
          className={`ao-action-icon-btn pin ${conv.is_pinned ? 'pinned' : ''}`}
          onClick={onTogglePin}
          title={conv.is_pinned ? 'Détacher' : 'Épingler'}
        >
          <Pin size={13} />
        </button>
        <button 
          className="ao-action-icon-btn rename"
          onClick={onStartRename}
          title="Renommer"
        >
          <Edit2 size={13} />
        </button>
        <button 
          className="ao-action-icon-btn delete"
          onClick={onDelete}
          title="Supprimer"
        >
          <Trash2 size={13} />
        </button>
        <ChevronRight size={14} className="ao-conv-arrow" />
      </div>
    </div>
  );
};
