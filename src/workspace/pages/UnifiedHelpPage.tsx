import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  LifeBuoy, 
  ArrowRight, 
  Activity, 
  GraduationCap,
  Package,
  Landmark,
  FolderKanban,
  Book,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Blocks,
  Cpu
} from 'lucide-react';
import { usePlatformStore } from '../../core/stores/platformStore';
import './EcosystemPages.css';

export const UnifiedHelpPage: React.FC = () => {
  const isDark = usePlatformStore((s) => s.theme === 'dark');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="eco-page-root" style={{ background: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', paddingBottom: '64px' }}>
      
      {/* 1. HERO BANNER */}
      <div style={{ 
        background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', 
        padding: '80px 32px', 
        textAlign: 'center',
        color: '#ffffff',
        borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '24px' }}>
          <HelpCircle size={14} /> CENTRE D'EXCELLENCE
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 24px 0', fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", lineHeight: 1.2 }}>
          L'écosystème Alliance One<br/>expliqué en détail.
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto', opacity: 0.9, lineHeight: 1.6 }}>
          Bienvenue dans le guide complet de votre plateforme. Découvrez comment Alliance One unifie tous les aspects de votre organisation, de l'éducation à la finance, sous l'égide de l'intelligence artificielle.
        </p>

        {/* Search Input */}
        <div style={{ maxWidth: '600px', margin: '40px auto 0', position: 'relative' }}>
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Rechercher une fonctionnalité, un module, un concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '16px 16px 16px 48px', 
              borderRadius: '12px', 
              border: 'none', 
              fontSize: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* 2. VISION & ARCHITECTURE */}
        <section style={{ marginTop: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '16px' }}>La Philosophie Alliance One</h2>
            <p style={{ fontSize: '16px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto' }}>
              Fini les logiciels fragmentés. Alliance One est un <strong>Système d'Exploitation Organisationnel (OS)</strong>. 
              Il vous permet d'installer uniquement les modules dont vous avez besoin, tout en garantissant que toutes les données communiquent entre elles en temps réel.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Blocks size={32} color="#3b82f6" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '12px' }}>Architecture Modulaire</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
                Via notre Marketplace intégrée, installez des modules métiers en un clic. Chaque module ajoute de nouvelles capacités à votre espace sans alourdir l'interface.
              </p>
            </div>
            <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Cpu size={32} color="#8b5cf6" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '12px' }}>Données Unifiées</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
                Un étudiant dans le module Éducation est instantanément lié au module Finance pour le paiement de ses frais, et au module Bibliothèque pour ses prêts. Aucune double saisie.
              </p>
            </div>
          </div>
        </section>

        {/* 3. COMPREHENSIVE MODULE BREAKDOWN */}
        <section style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '40px', textAlign: 'center' }}>Le Catalogue des Puissances</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Education */}
            <div style={{ display: 'flex', gap: '24px', background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #4f46e5' }}>
              <div style={{ background: '#4f46e520', padding: '16px', borderRadius: '12px', height: 'fit-content' }}>
                <GraduationCap size={32} color="#4f46e5" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>Éducation Pro</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Conçu pour les écoles, universités et centres de formation. Ce module gère le cycle de vie complet de l'étudiant.
                </p>
                <ul style={{ paddingLeft: '20px', color: isDark ? '#e2e8f0' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                  <li><strong>Gestion académique :</strong> Classes, matières, coefficients, emplois du temps.</li>
                  <li><strong>Suivi des notes :</strong> Saisie des évaluations, calcul automatique des moyennes.</li>
                  <li><strong>Génération de documents :</strong> Bulletins scolaires officiels, certificats de scolarité, cartes d'étudiant avec QR code.</li>
                </ul>
              </div>
            </div>

            {/* Finance */}
            <div style={{ display: 'flex', gap: '24px', background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #059669' }}>
              <div style={{ background: '#05966920', padding: '16px', borderRadius: '12px', height: 'fit-content' }}>
                <Landmark size={32} color="#059669" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>Finances & Trésorerie</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Le cœur financier de votre organisation. Suivez chaque centime qui entre et qui sort en temps réel.
                </p>
                <ul style={{ paddingLeft: '20px', color: isDark ? '#e2e8f0' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                  <li><strong>Multi-caisses :</strong> Gestion de plusieurs comptes bancaires et caisses physiques.</li>
                  <li><strong>Recettes & Dépenses :</strong> Encaissement des frais de scolarité/services, paiement des fournisseurs.</li>
                  <li><strong>Rapports analytiques :</strong> Compte de résultat, bilan, prévisions de trésorerie.</li>
                </ul>
              </div>
            </div>

            {/* Inventory */}
            <div style={{ display: 'flex', gap: '24px', background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #0e121b' }}>
              <div style={{ background: '#0e121b20', padding: '16px', borderRadius: '12px', height: 'fit-content' }}>
                <Package size={32} color={isDark ? '#e2e8f0' : '#0e121b'} />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>Stocks & Logistique (WMS)</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Contrôlez vos marchandises, équipements et fournitures avec une précision d'horloger.
                </p>
                <ul style={{ paddingLeft: '20px', color: isDark ? '#e2e8f0' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                  <li><strong>Multi-entrepôts :</strong> Gérez des stocks répartis sur plusieurs sites physiques.</li>
                  <li><strong>Mouvements WMS :</strong> Bons de réception, bons de sortie, transferts inter-dépôts.</li>
                  <li><strong>Alertes :</strong> Seuils d'approvisionnement critiques et valorisation PMP (Prix Moyen Pondéré).</li>
                </ul>
              </div>
            </div>

            {/* Tasks & Projects */}
            <div style={{ display: 'flex', gap: '24px', background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ background: '#8b5cf620', padding: '16px', borderRadius: '12px', height: 'fit-content' }}>
                <FolderKanban size={32} color="#8b5cf6" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>Tâches & Projets</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Alignez vos équipes sur les mêmes objectifs avec notre système de gestion de projets intégré.
                </p>
                <ul style={{ paddingLeft: '20px', color: isDark ? '#e2e8f0' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                  <li><strong>Vues Multiples :</strong> Tableaux Kanban, Listes, Calendriers.</li>
                  <li><strong>Assignations :</strong> Déléguez le travail, fixez des deadlines et suivez la progression.</li>
                  <li><strong>Liaison contextuelle :</strong> Liez une tâche à une facture spécifique ou à un dossier patient.</li>
                </ul>
              </div>
            </div>

            {/* Healthcare */}
            <div style={{ display: 'flex', gap: '24px', background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
              <div style={{ background: '#10b98120', padding: '16px', borderRadius: '12px', height: 'fit-content' }}>
                <Stethoscope size={32} color="#10b981" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>Santé & Dossiers Patients</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Pour les cliniques, infirmeries scolaires ou cabinets médicaux. Un suivi confidentiel et sécurisé.
                </p>
                <ul style={{ paddingLeft: '20px', color: isDark ? '#e2e8f0' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                  <li><strong>Dossier Médical Électronique (DME) :</strong> Antécédents, allergies, constantes vitales.</li>
                  <li><strong>Consultations :</strong> Historique des visites, prescriptions et recommandations.</li>
                </ul>
              </div>
            </div>

            {/* Library */}
            <div style={{ display: 'flex', gap: '24px', background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ background: '#f59e0b20', padding: '16px', borderRadius: '12px', height: 'fit-content' }}>
                <Book size={32} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 12px 0' }}>Bibliothèque & CDI</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  Numérisez votre centre de documentation et facilitez l'accès au savoir.
                </p>
                <ul style={{ paddingLeft: '20px', color: isDark ? '#e2e8f0' : '#334155', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                  <li><strong>Catalogue numérique :</strong> Indexation ISBN, gestion des auteurs et catégories.</li>
                  <li><strong>Circulation :</strong> Gestion des emprunts, retours et pénalités de retard.</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ALLIANCE AI */}
        <section style={{ marginTop: '80px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '48px', borderRadius: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <Sparkles size={120} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', right: '-20px', top: '-20px' }} />
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles color="#818cf8" /> Alliance AI : Votre Copilote
            </h2>
            <p style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '700px', opacity: 0.9, marginBottom: '24px' }}>
              La véritable force d'Alliance One réside dans son intelligence artificielle intégrée. 
              Fini les rapports manuels interminables. Demandez à votre Agent IA (disponible dans la barre latérale) de :
            </p>
            <ul style={{ fontSize: '16px', lineHeight: 1.8, opacity: 0.9, marginLeft: '20px' }}>
              <li><em>"Résume-moi l'activité financière de ce mois par rapport au mois dernier."</em></li>
              <li><em>"Quels sont les élèves ayant une moyenne inférieure à 10 ?"</em></li>
              <li><em>"Installe et configure le module de gestion des Tâches pour l'équipe marketing."</em></li>
            </ul>
          </div>
        </section>

        {/* 5. SYSTEM HEALTH & CONTACT */}
        <section style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Activity size={24} color="#10b981" />
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: isDark ? '#f8fafc' : '#0f172a' }}>Statut des Systèmes</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Core Infrastructure (ERP)', status: 'Opérationnel', uptime: '99.99%' },
                { name: 'Alliance AI Engines', status: 'Opérationnel', uptime: '100%' },
                { name: 'Chiffrement WAF & Sécurité', status: 'Opérationnel', uptime: '100%' }
              ].map((srv, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#e2e8f0' : '#334155' }}>{srv.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{srv.uptime}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      {srv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: isDark ? '#1e293b' : '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <LifeBuoy size={48} color="#4f46e5" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 16px 0', color: isDark ? '#f8fafc' : '#0f172a' }}>Besoin d'un humain ?</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Notre équipe d'ingénieurs et de conseillers est prête à vous accompagner dans la modélisation de vos processus métier complexes sur Alliance One.
            </p>
            <button className="ao-btn-primary" style={{ padding: '12px 32px', fontSize: '16px' }}>
              Contacter le support Premium
            </button>
          </div>

        </section>

      </div>
    </div>
  );
};
