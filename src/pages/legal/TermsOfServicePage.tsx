import React, { useEffect } from 'react';
import { Scale, FileWarning, ArrowLeft, Mail, AlertTriangle, Briefcase, FileBadge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AllianceLogo } from '../../design-system/components/AllianceLogo';

export const TermsOfServicePage: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER */}
      <header style={{ backgroundColor: '#0f172a', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AllianceLogo size={32} color="#ffffff" />
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)", letterSpacing: '0.5px' }}>
            Alliance One
          </span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: '8px 16px', borderRadius: '6px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </header>

      {/* HERO SECTION */}
      <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%', marginBottom: '24px' }}>
          <Scale size={40} color="#60a5fa" />
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 700, margin: '0 0 16px 0', fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)" }}>
          Conditions d'Utilisation
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Document contractuel liant l'Utilisateur à Alliance One. Veuillez lire attentivement l'intégralité des termes avant toute utilisation de la plateforme.
        </p>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '32px' }}>
          Dernière mise à jour : 26 Septembre 2026
        </p>
      </div>

      {/* CONTENT */}
      <main style={{ maxWidth: '800px', margin: '-40px auto 0', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', padding: '60px', position: 'relative' }}>
        
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', marginBottom: '40px', padding: '16px', backgroundColor: '#f8fafc', borderLeft: '3px solid #cbd5e1' }}>
          <strong>Avertissement Légal :</strong> L'acceptation des présentes Conditions d'Utilisation constitue un accord juridiquement contraignant entre vous et Alliance One Inc. En cochant la case d'acceptation lors de la création de votre compte, ou en continuant d'utiliser la plateforme, vous acceptez l'intégralité de ces termes sans réserve.
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <FileBadge size={18} color="#4f46e5" />
            1. Objet et Acceptation des Conditions
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Les présentes Conditions Générales d'Utilisation (ci-après désignées "CGU" ou "Conditions") ont pour objet de définir les modalités et conditions dans lesquelles Alliance One met à la disposition de ses utilisateurs la plateforme logicielle en tant que service (SaaS) et les services qui y sont attachés, ainsi que la manière dont l'Utilisateur accède à la plateforme et utilise ses services.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Toute connexion à la plateforme est subordonnée au respect des présentes conditions. Pour l'Utilisateur, le simple accès à la plateforme de l'Éditeur à l'adresse URL d'Alliance One ou via une application tierce mandatée implique l'acceptation de l'ensemble des conditions décrites ci-après.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            Si vous utilisez la plateforme pour le compte d'une société, d'une entreprise ou de toute autre entité légale, vous déclarez et garantissez que vous avez l'autorité légale d'engager cette entité à ces conditions, auquel cas les termes "vous" ou "votre" ou "Utilisateur" feront référence à cette entité.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <Briefcase size={18} color="#4f46e5" />
            2. Accès au Service et Inscription
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            L'accès aux fonctionnalités complètes du service requiert l'inscription préalable de l'Utilisateur et la création d'un compte. Lors de l'inscription, l'Utilisateur s'engage à fournir des informations exactes, à jour et complètes sur son identité et ses coordonnées professionnelles.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            La sécurité du compte incombe entièrement à l'Utilisateur. Alliance One emploie des méthodes d'authentification sans mot de passe ("Magic Links") ou des délégations d'authentification tierces (OAuth via LinkedIn, Google, etc.). L'Utilisateur est seul responsable du maintien de la sécurité de sa boîte de réception e-mail liée au compte ou de son fournisseur d'identité tiers. Alliance One ne pourra être tenue responsable de toute perte ou dommage découlant de l'échec de l'Utilisateur à sécuriser ses propres méthodes d'accès. En cas de détection d'utilisation non autorisée, l'Utilisateur doit en informer immédiatement l'équipe de sécurité d'Alliance One.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <AlertTriangle size={18} color="#4f46e5" />
            3. Obligations et Conduite de l'Utilisateur
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            L'Utilisateur s'engage expressément, sous peine de voir son accès immédiatement suspendu ou résilié, à NE PAS s'engager dans les activités suivantes :
          </p>
          <ul style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', paddingLeft: '24px', textAlign: 'justify' }}>
            <li style={{ marginBottom: '6px' }}><strong>Utilisation Abusive :</strong> Utiliser la plateforme pour générer, distribuer, publier ou faciliter l'envoi de courriels de masse non sollicités (Spam), ou de logiciels malveillants.</li>
            <li style={{ marginBottom: '6px' }}><strong>Ingénierie Inverse (Reverse Engineering) :</strong> Tenter de décompiler, désassembler, ou découvrir le code source ou l'architecture sous-jacente de tout ou partie de la plateforme Alliance One.</li>
            <li style={{ marginBottom: '6px' }}><strong>Atteinte à la Sécurité :</strong> Tenter de sonder, scanner, ou tester la vulnérabilité des systèmes ou réseaux d'Alliance One sans autorisation écrite préalable (Pentesting non autorisé).</li>
            <li style={{ marginBottom: '6px' }}><strong>Usurpation d'Identité :</strong> Falsifier son identité ou son affiliation à une organisation dans le but de tromper ou d'obtenir un accès frauduleux à des espaces de travail tiers.</li>
            <li style={{ marginBottom: '6px' }}><strong>Exploitation Commerciale Non Autorisée :</strong> Revendre, sous-louer, ou mettre la plateforme à disposition de tiers en tant que service (marques blanches non officielles) sans accord commercial explicite préalable d'Alliance One.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            4. Propriété Intellectuelle
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            La structure générale de la plateforme Alliance One, ainsi que les textes, graphiques, images, sons, bases de données, interfaces utilisateurs, éléments visuels, logos et vidéos la composant, sont la propriété exclusive de l'Éditeur (Alliance One Inc.) ou de ses partenaires. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale des contenus et services proposés par la plateforme, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de l'Éditeur est strictement interdite et serait susceptible de constituer une contrefaçon.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            <strong>Données de l'Utilisateur :</strong> Vous conservez l'intégralité des droits de propriété intellectuelle sur le contenu que vous téléchargez, soumettez ou stockez sur Alliance One (vos "Données Utilisateur"). Vous accordez à Alliance One une licence mondiale, non exclusive, exempte de redevances et limitée, lui permettant de stocker, copier, transmettre et afficher vos Données Utilisateur, uniquement dans la mesure nécessaire à la fourniture de nos services.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            5. Limitation de Responsabilité
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            <strong>Exclusion de garanties :</strong> La plateforme et les services sont fournis "en l'état" (AS IS) et "selon disponibilité" (AS AVAILABLE), sans aucune garantie expresse ou implicite de quelque nature que ce soit, y compris, mais sans s'y limiter, les garanties implicites de qualité marchande, d'adéquation à un usage particulier, ou d'absence de contrefaçon.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            <strong>Limitation pécuniaire :</strong> En aucun cas, Alliance One, ses directeurs, employés, partenaires, agents ou fournisseurs ne pourront être tenus responsables envers l'Utilisateur pour des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, sans s'y limiter, la perte de profits, de données, d'usage, de clientèle, ou d'autres pertes intangibles, résultant de (i) votre accès ou de votre utilisation ou de votre incapacité à accéder à ou à utiliser les services ; (ii) de toute conduite ou de tout contenu d'un tiers sur le service ; (iii) de tout contenu obtenu via les services ; et (iv) d'un accès, d'une utilisation ou d'une altération non autorisés de vos transmissions ou de votre contenu. En tout état de cause, la responsabilité totale cumulée d'Alliance One, pour toutes réclamations liées aux services, est strictement limitée au montant que vous avez payé à Alliance One au cours des douze (12) derniers mois d'utilisation.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            6. Résiliation et Suspension
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Nous pouvons résilier ou suspendre votre compte et bloquer l'accès à la plateforme immédiatement, sans préavis ni responsabilité, à notre seule discrétion, pour quelque raison que ce soit et sans limitation, y compris, mais non exclusivement, en cas de violation avérée des présentes Conditions d'Utilisation.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            En cas de résiliation, votre droit d'utiliser la plateforme cessera immédiatement. Si vous souhaitez résilier votre compte, vous pouvez simplement cesser d'utiliser la plateforme et effectuer une demande de suppression définitive de vos données conformément à notre Politique de Confidentialité.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            7. Droit Applicable et Résolution des Litiges
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Les présentes Conditions d'Utilisation seront régies et interprétées conformément aux lois en vigueur, sans tenir compte des dispositions relatives aux conflits de lois. Notre incapacité à appliquer un droit ou une disposition de ces Conditions ne sera pas considérée comme une renonciation à ces droits.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            En cas de litige entre Alliance One et l'Utilisateur, les deux parties s'engagent à rechercher prioritairement une solution amiable. À défaut de résolution amiable dans un délai de trente (30) jours suivant la notification formelle du litige, celui-ci sera soumis à la compétence exclusive des tribunaux compétents du siège social d'Alliance One.
          </p>
        </section>

        <section style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '12px', marginTop: '64px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileWarning size={16} color="#4f46e5" />
            Contact Légal
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', margin: 0, textAlign: 'justify' }}>
            Pour toute question formelle concernant l'interprétation des présentes conditions d'utilisation, ou pour formuler une demande de nature juridique, veuillez vous adresser au service des Affaires Juridiques :<br/>
            <strong style={{ color: '#0f172a', display: 'block', marginTop: '12px', fontSize: '14px' }}>legal@alliance-one.com</strong>
          </p>
        </section>

      </main>
    </div>
  );
};
