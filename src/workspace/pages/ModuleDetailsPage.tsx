import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Zap, 
  Download, Star, Server, Activity, Users, Layers
} from 'lucide-react';
import { ModulesApi } from '../../core/api/modules';
import type { ModuleManifest } from '../../core/api/modules';
import './EcosystemPages.css';

export const ModuleDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState<ModuleManifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        setIsLoading(true);
        // Since we don't have a getModule(slug) in the mock API exposed directly yet,
        // we fetch all and find the one.
        const mods = await ModulesApi.getRegistry();
        const found = mods.find(m => m.slug === slug);
        if (found) {
          setModuleData(found);
        } else {
          setError("Module introuvable.");
        }
      } catch (err: any) {
        setError("Erreur lors de la récupération des détails.");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchModule();
  }, [slug]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Chargement...</div>;
  }

  if (error || !moduleData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>{error || "Une erreur est survenue"}</h2>
        <button onClick={() => navigate('/app/marketplace')} style={{ padding: '10px', marginTop: '1rem', cursor: 'pointer' }}>
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="ecosystem-page-root" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* Header / Hero */}
      <div style={{ background: 'white', padding: '40px 40px 0 40px', borderBottom: '1px solid #e2e8f0' }}>
        <button 
          onClick={() => navigate('/app/marketplace')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', marginBottom: '24px' }}
        >
          <ArrowLeft size={16} /> Retour à la Marketplace
        </button>

        <div style={{ display: 'flex', gap: '32px', paddingBottom: '40px', alignItems: 'flex-start' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '24px', background: `${moduleData.accent_color}15`, color: moduleData.accent_color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={48} />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#0f172a' }}>{moduleData.name}</h1>
              {moduleData.is_verified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e0e7ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> Développeur Vérifié
                </div>
              )}
            </div>
            
            <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 16px 0' }}>{moduleData.tagline}</p>
            
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={16} color="#f59e0b" fill="#f59e0b" /> 4.8/5 Avis clients</span>
              <span>Version {moduleData.version}</span>
              <span>Par {moduleData.developer_name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
            <button style={{ width: '100%', padding: '14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Download size={18} /> Installer maintenant
            </button>
            <button style={{ width: '100%', padding: '14px', background: '#ecfdf5', color: '#059669', border: '1px solid #10b981', borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} /> Demander à l'IA
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '40px auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', padding: '0 40px' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>Que fait ce module ?</h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              {moduleData.description}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>Les avantages clés (Ce que vous y gagnez)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {moduleData.features.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ background: '#d1fae5', color: '#059669', padding: '8px', borderRadius: '50%' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#0f172a' }}>{feat}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} color="#4f46e5" /> Connectivité Alliance One
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              En installant ce module, vous n'ajoutez pas juste un logiciel. Vous connectez un nouveau département à votre écosystème global.
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Synchronisation en temps réel.</li>
              <li>Partage des données RH et financières.</li>
              <li>Supervision via le Tableau de bord central.</li>
            </ul>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>Détails techniques</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Catégorie</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{moduleData.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Permissions</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{moduleData.permissions.length} requises</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Dernière mise à jour</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Il y a 2 jours</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
