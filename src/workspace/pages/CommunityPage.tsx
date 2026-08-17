/**
 * ALLIANCE ONE — COMMUNITY PAGE
 * Fil d'actualité, showcase de réalisations, tutoriels et discussions des concepteurs.
 */
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Sparkles, 
  Flame, 
  Plus, 
  User, 
  ExternalLink, 
  CheckCircle2,
  Tag
} from 'lucide-react';
import './EcosystemPages.css';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
    verified: boolean;
  };
  title: string;
  content: string;
  category: 'Showcase' | 'Tutoriel' | 'Mise à jour' | 'Discussion';
  tags: string[];
  likes: number;
  commentsCount: number;
  timestamp: string;
  isLiked?: boolean;
}

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'post-1',
      author: {
        name: 'Benjamin Adzessa',
        role: 'Architecte Système Lead',
        avatarInitials: 'BA',
        verified: true
      },
      title: 'Déploiement officiel d’Alliance One Hub v2.4 🚀',
      content: 'Nous venons de finaliser l’architecture du Business Operating System avec la navigation globale à 7 entrées, le flux d’activité universel et l’onboarding interactif. Tous les modules natifs (Éducation, Stock, Finance, Tâches, Bibliothèque) sont désormais synchronisés en temps réel.',
      category: 'Mise à jour',
      tags: ['AllianceHub', 'Architecture', 'Release'],
      likes: 38,
      commentsCount: 7,
      timestamp: 'Il y a 2h'
    },
    {
      id: 'post-2',
      author: {
        name: 'Équipe Tech Collège Émergence',
        role: 'Responsable Pédagogique',
        avatarInitials: 'CE',
        verified: false
      },
      title: 'Retour d’expérience : 480 bulletins scolaires générés en 3 minutes',
      content: 'La transition vers le module Éducation Pro a permis à notre secrétariat d’automatiser le calcul des moyennes pondérées et d’imprimer les bulletins officiels avec les logos de l’école sans la moindre erreur.',
      category: 'Showcase',
      tags: ['ÉducationPro', 'Productivité', 'Afrique'],
      likes: 24,
      commentsCount: 4,
      timestamp: 'Il y a 5h'
    },
    {
      id: 'post-3',
      author: {
        name: 'Alliance Dev Community',
        role: 'Core Contributor',
        avatarInitials: 'AC',
        verified: true
      },
      title: 'Tutoriel : Comment créer un connecteur Mobile Money avec le SDK',
      content: 'Voici un guide étape par étape pour intercepter l’événement `Finance:PaymentInitiated` et déclencher un push USSD Orange Money / MTN MoMo via l’EventBus Alliance.',
      category: 'Tutoriel',
      tags: ['SDK', 'MobileMoney', 'Webhooks'],
      likes: 52,
      commentsCount: 12,
      timestamp: 'Hier'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
          : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostText.trim()) return;

    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'Benjamin Adzessa',
        role: 'Membre Actif',
        avatarInitials: 'BA',
        verified: true
      },
      title: newPostTitle,
      content: newPostText,
      category: 'Discussion',
      tags: ['Communauté', 'Nouveau'],
      likes: 1,
      commentsCount: 0,
      timestamp: 'À l’instant'
    };

    setPosts([post, ...posts]);
    setNewPostTitle('');
    setNewPostText('');
    setNewPostModalOpen(false);
  };

  const filtered = posts.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  return (
    <div className="ecosystem-page-root">
      {/* Header Banner */}
      <div className="ecosystem-header-banner">
        <div className="ecosystem-badge">
          <MessageSquare size={14} />
          <span>ALLIANCE COMMUNITY</span>
        </div>
        <h1 className="ecosystem-title">Communauté des Bâtisseurs & Utilisateurs</h1>
        <p className="ecosystem-subtitle">
          Partagez vos retours, découvrez les projets conçus sur Alliance One et échangez avec les créateurs.
        </p>

        {/* Action Row */}
        <div className="community-header-actions">
          <div className="community-category-pills">
            {['all', 'Showcase', 'Tutoriel', 'Mise à jour', 'Discussion'].map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat === 'all' ? 'Tous les posts' : cat}
              </button>
            ))}
          </div>

          <button className="community-share-btn" onClick={() => setNewPostModalOpen(true)}>
            <Plus size={15} />
            <span>Publier un message</span>
          </button>
        </div>
      </div>

      <div className="community-feed-container">
        {/* Posts List */}
        <div className="community-posts-list">
          {filtered.map((post) => (
            <div key={post.id} className="community-post-card">
              {/* Author Row */}
              <div className="post-author-row">
                <div className="post-avatar">{post.author.avatarInitials}</div>
                <div className="post-author-meta">
                  <div className="author-name-line">
                    <span className="author-name">{post.author.name}</span>
                    {post.author.verified && (
                      <CheckCircle2 size={13} color="#4f46e5" title="Compte Certifié" />
                    )}
                    <span className="post-category-tag">{post.category}</span>
                  </div>
                  <div className="author-sub">{post.author.role} · {post.timestamp}</div>
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.content}</p>

              {/* Tags */}
              <div className="post-tags-row">
                {post.tags.map((t) => (
                  <span key={t} className="post-tag">#{t}</span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="post-footer-actions">
                <button 
                  className={`post-action-btn ${post.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart size={15} fill={post.isLiked ? '#ef4444' : 'none'} color={post.isLiked ? '#ef4444' : 'currentColor'} />
                  <span>{post.likes}</span>
                </button>
                <button className="post-action-btn">
                  <MessageSquare size={15} />
                  <span>{post.commentsCount} commentaires</span>
                </button>
                <button className="post-action-btn" onClick={() => alert('Lien copié dans le presse-papier')}>
                  <Share2 size={15} />
                  <span>Partager</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Post Modal */}
      {newPostModalOpen && (
        <div className="universal-modal-backdrop" onClick={() => setNewPostModalOpen(false)}>
          <div className="universal-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="universal-modal-header">
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Créer une publication</h3>
            </div>
            <form onSubmit={handleCreatePost} style={{ padding: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Titre de votre sujet</label>
                <input 
                  type="text" 
                  placeholder="Ex : Retour d'expérience sur le module Finance..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Message ou description</label>
                <textarea 
                  rows={4}
                  placeholder="Partagez vos conseils, questions ou réalisations..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  className="step-action-btn" 
                  onClick={() => setNewPostModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="hub-primary-btn" style={{ padding: '6px 14px' }}>
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
