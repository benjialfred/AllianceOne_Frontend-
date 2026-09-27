import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModulesApi, type ModuleInstallation } from '../../core/api/modules';
import { 
  Package, LayoutDashboard, Crown, Zap, ArrowRight, Loader2, CheckCircle2 
} from 'lucide-react';

// Let's redefine a quick icon mapping safely
import { 
  GraduationCap, Landmark, Stethoscope, FolderKanban, Book 
} from 'lucide-react';

const iconMap: Record<string, any> = {
  GraduationCap,
  Landmark,
  Package,
  Stethoscope,
  FolderKanban,
  Book
};

export const MyModulesPage: React.FC = () => {
  const [installations, setInstallations] = useState<ModuleInstallation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyModules = async () => {
      try {
        const data = await ModulesApi.getInstallations();
        setInstallations(data.filter(i => i.status === 'ACTIVE'));
      } catch (err) {
        console.error("Error fetching my modules:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyModules();
  }, []);

  return (
    <div className="ecosystem-page-root">
      <div className="ecosystem-header-banner">
        <div className="ecosystem-badge">
          <Package size={14} />
          <span>MON ESPACE ALLIANCE</span>
        </div>
        <h1 className="ecosystem-title">Mes Modules Installés</h1>
        <p className="ecosystem-subtitle">
          Gérez vos applications métiers et accédez rapidement à vos tableaux de bord.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="spinning" size={32} color="var(--color-primary)" />
        </div>
      ) : (
        <div className="marketplace-grid-container" style={{ marginTop: '2rem' }}>
          {installations.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
              <Package size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3>Aucun module installé</h3>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Vous n'avez pas encore installé de modules métier sur cet espace.</p>
              <button 
                onClick={() => navigate('/app/marketplace')}
                style={{
                  background: 'var(--color-primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Explorer le Marketplace
              </button>
            </div>
          ) : (
            installations.map((inst) => {
              const mod = inst.module;
              const Icon = iconMap[mod.icon_name] || Package;
              return (
                <div key={mod.slug} className="marketplace-app-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="app-card-top">
                    <div 
                      className="app-icon-box"
                      style={{ backgroundColor: `${mod.accent_color}18`, color: mod.accent_color }}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="app-top-meta">
                      <span className="app-version-tag" style={{ background: '#d1fae5', color: '#065f46' }}>
                        <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }}/>
                        Actif
                      </span>
                    </div>
                  </div>

                  <div className="app-card-body" style={{ flex: 1 }}>
                    <div className="app-title-row">
                      <h3 className="app-name" style={{ fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", fontSize: '18px' }}>
                        {mod.name}
                      </h3>
                    </div>
                    <p className="app-description" style={{ marginTop: '8px' }}>{mod.tagline}</p>
                  </div>

                  <div className="app-card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <button 
                      onClick={() => navigate(`/app/${mod.slug}`)}
                      style={{ 
                        width: '100%', padding: '12px', background: mod.accent_color, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
                      }}
                    >
                      <LayoutDashboard size={18} />
                      Ouvrir le module
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
