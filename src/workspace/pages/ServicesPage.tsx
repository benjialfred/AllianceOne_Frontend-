/**
 * ALLIANCE ONE — ALLIANCE IA & SERVICES
 * Catalogue exhaustif des services de la plateforme.
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Server,
  Database,
  GraduationCap,
  Store,
  LineChart,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../../core/components/SEO';
import { AllianceLogo } from '../../design-system/components/AllianceLogo';
import './EcosystemPages.css';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const servicesList = [
    {
      id: 'infrastructure',
      icon: <Server size={32} />,
      title: 'Infrastructure Cloud Core',
      category: 'Fondation technique',
      desc: 'Hébergement cloud souverain, bases de données répliquées et API Gateway ultra-rapide garantissant 99.99% de disponibilité pour vos opérations critiques.',
      features: ['Stockage SSD NVMe', 'Scalabilité automatique', 'Sauvegardes quotidiennes cryptées'],
      color: '#3b82f6',
      link: '/platform'
    },
    {
      id: 'ai',
      icon: <Cpu size={32} />,
      title: 'Alliance IA & Copilotes',
      category: 'Intelligence Artificielle',
      desc: 'Agents intelligents intégrés capables d\'analyser vos données en temps réel, d\'automatiser la lecture de factures (OCR) et de prédire vos flux de trésorerie.',
      features: ['OCR Comptable', 'Génération de rapports', 'Prédictions analytiques'],
      color: '#8b5cf6',
      link: '/ai'
    },
    {
      id: 'education',
      icon: <GraduationCap size={32} />,
      title: 'Système Éducatif (EdTech)',
      category: 'Module Métier',
      desc: 'Gestion complète des établissements scolaires : inscriptions, scolarité, emplois du temps dynamiques, portails parents et suivi pédagogique dématérialisé.',
      features: ['Portail Parents/Élèves', 'Génération des bulletins', 'Paiements intégrés'],
      color: '#10b981',
      link: '/modules/education'
    },
    {
      id: 'retail',
      icon: <Store size={32} />,
      title: 'Logistique & Retail',
      category: 'Module Métier',
      desc: 'Optimisez votre chaîne d\'approvisionnement avec notre module de gestion de stocks multi-dépôts, point de vente (POS) et valorisation PMP en temps réel.',
      features: ['Inventaire Multi-dépôts', 'Alertes de réassort', 'Caisse enregistreuse (POS)'],
      color: '#f59e0b',
      link: '/modules/retail'
    },
    {
      id: 'finance',
      icon: <LineChart size={32} />,
      title: 'Finances & Trésorerie',
      category: 'Module Métier',
      desc: 'Contrôlez la santé financière de votre organisation. Rapprochement bancaire, facturation automatisée, gestion budgétaire et tableaux de bord analytiques.',
      features: ['Facturation électronique', 'Tableaux de bord financiers', 'Gestion des créances'],
      color: '#ef4444',
      link: '/modules/finance'
    },
    {
      id: 'boost',
      icon: <Zap size={32} />,
      title: 'Alliance Boost',
      category: 'Croissance & Marketing',
      desc: 'Propulsez votre visibilité en ligne. Des services de croissance algorithmique automatisés pour dominer les réseaux sociaux et attirer plus de clients.',
      features: ['Croissance Instagram/TikTok', 'Acquisition ciblée', 'Engagement automatisé'],
      color: '#ec4899',
      link: '/boost'
    }
  ];

  return (
    <div className="ecosystem-page-root" style={{ background: '#030712' }}>
      <SEO 
        title="Nos Services & IA" 
        description="Découvrez l'ensemble des modules, services et infrastructures intelligentes propulsés par Alliance One." 
      />

      {/* Trust Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-8">
            <Sparkles size={16} /> Écosystème Unifié
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Le futur de votre organisation,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              propulsé par l'IA.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            De l'infrastructure cloud ultra-sécurisée aux modules métiers spécifiques, découvrez tous les services conçus pour faire passer votre structure à la dimension supérieure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-white font-medium"><ShieldCheck size={20} className="text-emerald-400" /> Sécurité Bancaire</div>
            <div className="flex items-center gap-2 text-white font-medium"><Server size={20} className="text-blue-400" /> Disponibilité 99.99%</div>
            <div className="flex items-center gap-2 text-white font-medium"><Database size={20} className="text-purple-400" /> Données Souveraines</div>
          </div>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate(service.link)}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 cursor-pointer group hover:bg-white/[0.06] transition-colors"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: `${service.color}20`, color: service.color, border: `1px solid ${service.color}40` }}
              >
                {service.icon}
              </div>
              
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: service.color }}>
                {service.category}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                {service.desc}
              </p>
              
              <div className="space-y-3 mb-8">
                {service.features.map(f => (
                  <div key={f} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="mt-0.5" style={{ color: service.color }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-bold mt-auto group-hover:gap-4 transition-all" style={{ color: service.color }}>
                Découvrir le module <ArrowRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Banner */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-r from-indigo-900/40 to-emerald-900/40 border border-white/10 rounded-3xl p-12 backdrop-blur-md">
          <AllianceLogo size={48} color="#fff" className="mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à transformer votre organisation ?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Rejoignez l'élite des entreprises et institutions qui font confiance à Alliance One pour propulser leurs opérations.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Déployer votre espace gratuit
          </button>
        </div>
      </div>
    </div>
  );
};
