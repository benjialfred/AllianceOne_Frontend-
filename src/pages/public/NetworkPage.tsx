import React from 'react';
import { GenericPublicPage } from './GenericPublicPage';
import { Network, Globe, Building, Users } from 'lucide-react';

export const NetworkPage: React.FC = () => {
  return (
    <GenericPublicPage 
      title="Réseau Alliance" 
      subtitle="Rejoignez un écosystème mondial d'organisations connectées et interconnectées via l'infrastructure Alliance One."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
        <div>
          <h2>Un maillage mondial</h2>
          <p>
            Le Réseau Alliance est plus qu'une simple liste de clients. C'est un écosystème interconnecté où les entreprises, les institutions éducatives, et les acteurs de la finance peuvent échanger de la valeur de manière fluide et sécurisée grâce aux protocoles standardisés d'Alliance One.
          </p>
          <p>
            En rejoignant le réseau, vous ne déployez pas seulement un logiciel, vous connectez votre système nerveux à l'économie globale.
          </p>
        </div>
        <div style={{ background: 'var(--ao-ivory)', padding: '40px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ao-alliance-blue)' }}>
              <Building size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--ao-font-display)', color: 'var(--ao-graphite)' }}>+500 Entreprises</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>Opérant quotidiennement</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ao-alliance-blue)' }}>
              <Globe size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--ao-font-display)', color: 'var(--ao-graphite)' }}>Déploiement Continental</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>Présence forte en Afrique et Europe</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ao-alliance-blue)' }}>
              <Users size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontFamily: 'var(--ao-font-display)', color: 'var(--ao-graphite)' }}>10M+ Utilisateurs</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>Dans l'écosystème global</p>
            </div>
          </div>
        </div>
      </div>

      <h2>Devenir Partenaire</h2>
      <p>
        Vous souhaitez intégrer vos services à l'écosystème Alliance One ou certifier votre organisation comme partenaire intégrateur ?
      </p>
      <ul>
        <li><strong>Partenaires Technologiques :</strong> Intégrez vos API et services au cœur du système nerveux.</li>
        <li><strong>Intégrateurs :</strong> Accompagnez le déploiement d'Alliance One chez vos clients.</li>
        <li><strong>Académique :</strong> Formez la prochaine génération sur les standards de l'ingénierie Alliance.</li>
      </ul>

      <div style={{ marginTop: '40px' }}>
        <button className="ao-btn-primary" style={{ background: 'var(--ao-graphite)', color: 'white', padding: '16px 32px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Contacter le programme Partenaires
        </button>
      </div>
    </GenericPublicPage>
  );
};
