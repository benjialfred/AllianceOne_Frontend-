/**
 * ALLIANCE ONE — NOTIFICATIONS DRAWER
 * Centre de notifications et d'alertes unifié temps réel.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  DollarSign, 
  GraduationCap, 
  Package, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import './UniversalModals.css';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  module: 'Éducation' | 'Finance' | 'Stock' | 'Système';
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  isRead: boolean;
  actionPath?: string;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Seuil de sécurité atteint',
      message: 'Le stock de "Cahiers 200p" est tombé sous le seuil minimal (3 unités restantes au Dépôt Principal).',
      module: 'Stock',
      type: 'critical',
      timestamp: 'Il y a 10 min',
      isRead: false,
      actionPath: '/inventory/products'
    },
    {
      id: 'notif-2',
      title: 'Paiement de scolarité reçu',
      message: 'Règlement de 75 000 FCFA validé pour l\'élève Kamga Junior (Classe Terminale C).',
      module: 'Éducation',
      type: 'success',
      timestamp: 'Il y a 28 min',
      isRead: false,
      actionPath: '/finance/transactions'
    },
    {
      id: 'notif-3',
      title: 'Clôture de période d’évaluations',
      message: 'Rappel : La saisie des notes du 2e Trimestre se termine vendredi à 18h00.',
      module: 'Éducation',
      type: 'warning',
      timestamp: 'Il y a 2h',
      isRead: false,
      actionPath: '/education/grades'
    },
    {
      id: 'notif-4',
      title: 'Synchronisation Cloud effectuée',
      message: 'Sauvegarde automatique de la base de données réalisée avec succès sur le serveur sécurisé.',
      module: 'Système',
      type: 'info',
      timestamp: 'Il y a 5h',
      isRead: true,
      actionPath: '/help'
    }
  ]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    if (notif.actionPath) {
      onClose();
      navigate(notif.actionPath);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'critical') return n.type === 'critical' || n.type === 'warning';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notif-drawer-backdrop" onClick={onClose}>
      <motion.div 
        className="notif-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      >
        {/* Header */}
        <div className="notif-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="notif-header-icon">
              <Bell size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Notifications</h3>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {unreadCount > 0 && (
              <button className="notif-mark-read-btn" onClick={handleMarkAllRead} title="Tout marquer comme lu">
                <CheckCheck size={14} />
                <span>Tout lire</span>
              </button>
            )}
            <button className="notif-drawer-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="notif-filter-row">
          <button 
            className={`notif-filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({notifications.length})
          </button>
          <button 
            className={`notif-filter-pill ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Non lues ({unreadCount})
          </button>
          <button 
            className={`notif-filter-pill ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            Alertes
          </button>
        </div>

        {/* List */}
        <div className="notif-list-container">
          {filteredNotifs.length === 0 ? (
            <div className="notif-empty-state">
              <Sparkles size={28} color="#94a3b8" />
              <p>Aucune notification</p>
              <span>Vous êtes complètement à jour !</span>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div 
                key={item.id}
                className={`notif-item-card ${!item.isRead ? 'unread' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                <div className="notif-item-header">
                  <span className={`notif-module-tag ${item.type}`}>
                    {item.module}
                  </span>
                  <span className="notif-timestamp">
                    <Clock size={11} /> {item.timestamp}
                  </span>
                </div>

                <div className="notif-item-title">{item.title}</div>
                <div className="notif-item-message">{item.message}</div>

                <div className="notif-item-footer">
                  <span className="notif-action-hint">Ouvrir le module</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
