import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  CheckCircle2,
  Users,
  MessageCircle,
  Plus,
  Zap,
  TrendingUp,
  Lightbulb,
  Building,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Send,
  MessageCircleCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Community.css';

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);

  return (
    <div className="vs-community-root">
      
      {/* Header */}
      <div className="vs-comm-header">
        <div>
          <h1 className="vs-comm-title">Écosystème & Réseau</h1>
          <p className="vs-comm-subtitle">Restez connecté avec l'univers Alliance One, collaborez et grandissez ensemble.</p>
        </div>
        <div className="vs-comm-toolbar">
          <button className="vs-btn-publish" onClick={() => setNewPostModalOpen(true)}>
            <Plus size={18} /> Proposer une idée
          </button>
        </div>
      </div>

      <div className="vs-comm-grid-master">
        
        {/* Main Feed Column */}
        <div className="vs-comm-feed-col">
          
          {/* Important Alerts & AI Messages */}
          <div className="vs-alert-banner">
            <div className="vs-alert-icon">
              <Sparkles size={24} color="#f59e0b" />
            </div>
            <div className="vs-alert-content">
              <h3>2 messages non lus de votre Agent IA</h3>
              <p>Votre copilote a analysé les données de la semaine et a 3 recommandations de croissance. Cliquez pour lire.</p>
            </div>
            <button className="vs-alert-action" onClick={() => navigate('/app/ai')}>
              Voir <ArrowRight size={16} />
            </button>
          </div>

          <div className="vs-feed-tabs">
            {['À la une', 'Telegram (Officiel)', 'Mises à jour', 'Communauté'].map((tab, i) => (
              <button 
                key={tab} 
                className={`vs-feed-tab ${i === 0 ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Telegram Pinned Post */}
          <div className="vs-comm-post featured">
            <div className="vs-post-header">
              <div className="vs-post-author">
                <div className="vs-post-avatar" style={{ background: '#0088cc', color: 'white', border: 'none' }}>
                  <Send size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="vs-post-author-name">Canal Officiel Telegram</span>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span className="vs-badge-important">Épinglé</span>
                  </div>
                  <span className="vs-post-author-role">Il y a 2h</span>
                </div>
              </div>
            </div>
            <div className="vs-post-title">Déploiement de l'API de paiement Nelsius V2 ! 🚀</div>
            <div className="vs-post-body">
              Excellente nouvelle pour tous les développeurs et marchands du réseau ! L'API Nelsius V2 est désormais en ligne avec le support complet du Split Payment et des commissions automatiques. 
              <br/><br/>
              Consultez la documentation mise à jour pour intégrer cette fonctionnalité dans vos applications personnalisées.
            </div>
            <div className="vs-post-footer">
              <button className="vs-post-action liked">
                <Heart size={16} fill="currentColor" />
                <span>1.2k</span>
              </button>
              <button className="vs-post-action">
                <MessageCircle size={16} />
                <span>342</span>
              </button>
            </div>
          </div>

          {/* Normal Post */}
          <div className="vs-comm-post">
            <div className="vs-post-header">
              <div className="vs-post-author">
                <div className="vs-post-avatar">CE</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="vs-post-author-name">Collège Émergence</span>
                  </div>
                  <span className="vs-post-author-role">Recherche de partenaires · Hier</span>
                </div>
              </div>
            </div>
            <div className="vs-post-title">Recrutement Développeurs : Module de suivi de bus scolaire</div>
            <div className="vs-post-body">
              Nous cherchons à constituer un groupe de développement pour créer un module de suivi GPS des bus scolaires intégré à Alliance One. Si vous êtes un développeur spécialisé en cartographie et intéressé par le projet, rejoignez notre groupe de travail !
            </div>
            <div className="vs-post-footer">
              <button className="vs-post-action">
                <Heart size={16} />
                <span>45</span>
              </button>
              <button className="vs-post-action">
                <MessageCircle size={16} />
                <span>12</span>
              </button>
              <button className="vs-post-btn-secondary">
                <MessageCircleCode size={16} /> Rejoindre le groupe
              </button>
            </div>
          </div>

          {/* Ideas Post */}
          <div className="vs-comm-post">
            <div className="vs-post-header">
              <div className="vs-post-author">
                <div className="vs-post-avatar" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Lightbulb size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="vs-post-author-name">Boîte à idées</span>
                  </div>
                  <span className="vs-post-author-role">Proposition de la communauté</span>
                </div>
              </div>
            </div>
            <div className="vs-post-title">Ajouter un mode hors-ligne natif pour le module Éducation</div>
            <div className="vs-post-body">
              Ce serait fantastique si les enseignants pouvaient saisir les notes même sans connexion internet, avec une synchronisation automatique au retour réseau. 
            </div>
            <div className="vs-post-footer">
              <button className="vs-post-action">
                <TrendingUp size={16} />
                <span>Voter (890)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="vs-comm-sidebar-col">
          
          {/* Events & Formations */}
          <div className="vs-widget-card">
            <img src="/training.jpg" alt="Training" className="vs-widget-img" />
            <div className="vs-widget-content">
              <div className="vs-widget-badge">Formation Premium</div>
              <h3 className="vs-widget-title">Masterclass : Intelligence Artificielle pour les Décideurs</h3>
              <p className="vs-widget-desc">Apprenez à utiliser Alliance AI pour prédire vos flux de trésorerie.</p>
              <div className="vs-widget-meta">
                <CalendarDays size={14} /> 15 Novembre 2024 · En Ligne
              </div>
              <button className="vs-widget-btn">S'inscrire</button>
            </div>
          </div>

          {/* Partners & Investors */}
          <div className="vs-widget-card">
            <img src="/network.jpg" alt="Partners" className="vs-widget-img" />
            <div className="vs-widget-content">
              <div className="vs-widget-badge" style={{ background: '#10b981', color: 'white' }}>Réseau Privé</div>
              <h3 className="vs-widget-title">Fonds d'Investissement & Partenaires</h3>
              <p className="vs-widget-desc">Accédez à notre annuaire d'investisseurs et de partenaires stratégiques pour lever des fonds et développer votre activité.</p>
              <div className="vs-widget-meta">
                <Building size={14} /> 150+ Partenaires actifs
              </div>
              <button className="vs-widget-btn" style={{ background: '#0f172a', color: 'white' }}>Explorer le réseau</button>
            </div>
          </div>

          {/* Active Members */}
          <div className="vs-members-panel">
            <h2 className="vs-members-title">Membres Influents</h2>
            <div className="vs-member-list">
              <div className="vs-member-item">
                <div className="vs-member-avatar">SA</div>
                <div className="vs-member-info">
                  <span className="vs-member-name">Sarah Amadou</span>
                  <span className="vs-member-role">Directrice RH</span>
                </div>
              </div>
              <div className="vs-member-item">
                <div className="vs-member-avatar">MT</div>
                <div className="vs-member-info">
                  <span className="vs-member-name">Marc Traoré</span>
                  <span className="vs-member-role">Investisseur</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
