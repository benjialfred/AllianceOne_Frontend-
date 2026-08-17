/**
 * ALLIANCE ONE — UNIVERSAL CREATE MODAL (+)
 * Création rapide d'objets métier depuis n'importe quel écran du système.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  GraduationCap, 
  Landmark, 
  Package, 
  FolderKanban, 
  BookOpen, 
  FileText, 
  UserPlus, 
  PlusCircle, 
  ArrowRight,
  Receipt,
  ShoppingCart,
  CheckSquare
} from 'lucide-react';
import './UniversalModals.css';

interface UniversalCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalCreateModal: React.FC<UniversalCreateModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (path: string) => {
    onClose();
    navigate(path);
  };

  const createActions = [
    {
      module: 'Éducation',
      icon: GraduationCap,
      color: '#4f46e5',
      items: [
        { label: 'Inscrire un nouvel élève', desc: 'Dossier académique, classe et tuteurs', path: '/app/education/students/new', icon: UserPlus },
        { label: 'Enregistrer une note', desc: 'Saisie des évaluations trimestrielles', path: '/app/education/grades', icon: FileText },
      ]
    },
    {
      category: 'FINANCE & COMPTABILITÉ',
      items: [
        { label: 'Enregistrer un paiement / recette', desc: 'Scolarité, vente ou apport de caisse', path: '/app/finance/transactions', icon: Receipt },
        { label: 'Créer une facture client', desc: 'Facture électronique avec TVA', path: '/app/finance/invoices', icon: FileText },
      ]
    },
    {
      category: 'LOGISTIQUE & ACHATS',
      items: [
        { label: 'Créer un article au catalogue', desc: 'SKU, prix d’achat, seuils et valorisation PMP', path: '/app/inventory/products', icon: PlusCircle },
        { label: 'Émettre un bon de commande', desc: 'Commande fournisseur et approvisionnement', path: '/app/inventory/purchase-orders', icon: ShoppingCart },
      ]
    },
    {
      category: 'COLLABORATION & TÂCHES',
      items: [
        { label: 'Créer une tâche urgente', desc: 'Attribution, priorité et date limite', path: '/app/tasks/board', icon: CheckSquare },
        { label: 'Initialiser un projet', desc: 'Jalons d’équipe et enveloppe temps', path: '/app/tasks/projects', icon: FolderKanban },
      ]
    },
    {
      category: 'DOCUMENTATION',
      items: [
        { label: 'Enregistrer un prêt de livre', desc: 'Attribution d’ouvrage à un emprunteur', path: '/app/library', icon: BookOpen },
      ]
    }
  ];

  return (
    <div className="universal-modal-backdrop" onClick={onClose}>
      <motion.div 
        className="universal-modal-card create-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="universal-modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Création Rapide Universelle</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Sélectionnez l'objet métier que vous souhaitez créer instantanément
            </p>
          </div>
          <button className="universal-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="universal-create-grid">
          {createActions.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.module} className="create-group-box">
                <div className="create-group-header">
                  <div className="create-group-icon" style={{ backgroundColor: `${group.color}15`, color: group.color }}>
                    <GroupIcon size={16} />
                  </div>
                  <span className="create-group-title">{group.module}</span>
                </div>

                <div className="create-items-stack">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button 
                        key={item.label}
                        className="create-action-btn"
                        onClick={() => handleAction(item.path)}
                      >
                        <ItemIcon size={15} className="action-sub-icon" />
                        <div className="action-meta">
                          <div className="action-label">{item.label}</div>
                          <div className="action-desc">{item.desc}</div>
                        </div>
                        <ArrowRight size={13} className="action-arrow" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
