import React from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Bell, 
  Zap, 
  Calendar, 
  Users, 
  TrendingUp, 
  Lightbulb, 
  Code,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlatformStore } from '../../core/stores/platformStore';
import './EcosystemPages.css'; // Reuse some ecosystem styles

export const TrustCenterPage: React.FC = () => {
  const isDark = usePlatformStore((s) => s.theme === 'dark');
  
  // Dummy data representing the vibrant ecosystem
  const telegramPosts = [
    { id: 1, text: "Mise à jour majeure du module Finance déployée avec succès !", time: "Il y a 2h", author: "Équipe Dev AO" },
    { id: 2, text: "Nouvel investissement sécurisé pour l'extension de l'infrastructure Cloud.", time: "Hier", author: "Alliance One Board" },
  ];

  const events = [
    { id: 1, title: "Webinaire: Optimisation des flux logistiques", date: "24 Sept, 14:00" },
    { id: 2, title: "Rencontre des Partenaires 2026", date: "15 Oct, Paris" },
  ];

  const opportunities = [
    { id: 1, title: "Rejoindre le groupe Dev API", type: "Développement", icon: Code },
    { id: 2, title: "Formation Avancée HyperAdmin", type: "Formation", icon: GraduationCap },
  ];

  return (
    <div className="eco-page-root" style={{ background: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', padding: '32px' }}>
      {/* HEADER */}
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', color: '#10b981', marginBottom: '16px' }}>
          <ShieldCheck size={32} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>
          Réseau & Confiance
        </h1>
        <p style={{ fontSize: '16px', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          La transparence, la sécurité et la communauté sont les piliers d'Alliance One. 
          Découvrez en temps réel la vie de notre écosystème.
        </p>
      </header>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* COLUMN 1: LIVE FEEDS & NOTIFICATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Telegram Feed */}
          <section style={{ background: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <MessageSquare size={20} color="#3b82f6" />
              Réseau Telegram (Annonces Importantes)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {telegramPosts.map(post => (
                <div key={post.id} style={{ padding: '16px', borderLeft: '3px solid #3b82f6', background: isDark ? '#0f172a' : '#f1f5f9', borderRadius: '0 8px 8px 0' }}>
                  <p style={{ fontSize: '14px', color: isDark ? '#e2e8f0' : '#1e293b', margin: '0 0 8px 0', lineHeight: 1.5 }}>{post.text}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                    <span>{post.author}</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="ao-btn-primary" style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              Rejoindre le canal officiel
            </button>
          </section>

          {/* AI Agent Messages */}
          <section style={{ background: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Bell size={20} color="#f59e0b" />
              Agent IA - Messages Non Lus
            </h2>
            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <p style={{ fontSize: '14px', color: isDark ? '#fcd34d' : '#b45309', margin: 0, fontWeight: 500 }}>
                Vous avez 3 suggestions d'optimisation de vos flux de travail en attente.
              </p>
            </div>
          </section>

        </div>

        {/* COLUMN 2: COMMUNITY & OPPORTUNITIES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Events */}
          <section style={{ background: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Calendar size={20} color="#10b981" />
              Activités & Événements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.map(ev => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: isDark ? '#0f172a' : '#f8fafc', borderRadius: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}>{ev.title}</span>
                  <span style={{ fontSize: '12px', color: '#64748b', background: isDark ? '#1e293b' : '#e2e8f0', padding: '4px 8px', borderRadius: '4px' }}>{ev.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Groups & Trainings */}
          <section style={{ background: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Users size={20} color="#8b5cf6" />
              Groupes de Dév & Formations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {opportunities.map(opp => (
                <div key={opp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '8px' }}>
                  <div style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '8px' }}>
                    <opp.icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>{opp.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{opp.type}</div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer' }}>Rejoindre</button>
                </div>
              ))}
            </div>
          </section>

          {/* Ideas Suggestion */}
          <section style={{ background: isDark ? '#1e293b' : '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Lightbulb size={20} color="#ec4899" />
              Boîte à Idées
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              Vous avez une idée pour améliorer Alliance One ? Suggérez-la à la communauté et aux développeurs.
            </p>
            <textarea 
              placeholder="Votre suggestion d'amélioration..." 
              style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', border: '1px solid', borderColor: isDark ? '#334155' : '#e2e8f0', background: isDark ? '#0f172a' : '#fff', color: isDark ? '#fff' : '#000', marginBottom: '12px' }}
            />
            <button className="ao-btn-primary" style={{ width: '100%' }}>Soumettre</button>
          </section>

        </div>
      </div>
      
      {/* FOOTER: Partners & Investors */}
      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '24px' }}>
          Ils nous font confiance
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', opacity: 0.6 }}>
          {/* Logos could go here. For now, simple text representations */}
          <span style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#fff' : '#000' }}>TechVentures</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#fff' : '#000' }}>Global EduFund</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#fff' : '#000' }}>AfriLogistics</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#fff' : '#000' }}>CloudCore Partners</span>
        </div>
      </div>
    </div>
  );
};
