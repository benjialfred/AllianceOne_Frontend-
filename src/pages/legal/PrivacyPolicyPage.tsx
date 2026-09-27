import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AllianceLogo } from '../../design-system/components/AllianceLogo';

export const PrivacyPolicyPage: React.FC = () => {
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
          <Shield size={40} color="#60a5fa" />
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 700, margin: '0 0 16px 0', fontFamily: "var(--ao-font-serif, 'Playfair Display', serif)" }}>
          Politique de Confidentialité
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Chez Alliance One, la protection de vos données et le respect de votre vie privée sont au cœur de notre engagement vers l'excellence.
        </p>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '32px' }}>
          Dernière mise à jour : 26 Septembre 2026
        </p>
      </div>

      {/* CONTENT */}
      <main style={{ maxWidth: '800px', margin: '-40px auto 0', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', padding: '60px', position: 'relative' }}>
        
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6', marginBottom: '40px', padding: '16px', backgroundColor: '#f8fafc', borderLeft: '3px solid #cbd5e1' }}>
          <strong>Avertissement Légal :</strong> Ce document a été rédigé à des fins de conformité réglementaire exhaustive. Veuillez lire attentivement l'intégralité de ces dispositions avant toute utilisation des services d'Alliance One.
        </div>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <FileText size={18} color="#4f46e5" />
            1. Introduction et Champ d'Application
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            La présente Politique de Confidentialité régit la manière dont Alliance One (« nous », « notre », ou « nos ») recueille, utilise, conserve et divulgue les informations collectées auprès des utilisateurs (chacun, un « Utilisateur ») de la plateforme Alliance One et de ses services associés. Ce document s'applique à l'ensemble du site, de l'application web, des API fournies, ainsi qu'à tous les produits et services proposés par Alliance One, ses filiales et ses partenaires de traitement de données affiliés.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            En accédant, naviguant ou utilisant les services d'Alliance One, l'Utilisateur reconnaît avoir lu, compris et expressément consenti aux pratiques de collecte, de traitement, de transfert international et d'utilisation de ses données personnelles et professionnelles, telles que décrites de manière exhaustive dans le présent document. Si un Utilisateur n'accepte pas la présente Politique de Confidentialité dans son intégralité, il doit immédiatement cesser toute utilisation de nos services et procéder à la suppression de son compte via les mécanismes prévus à cet effet.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            Cette politique a été élaborée en stricte conformité avec le Règlement Général sur la Protection des Données (RGPD) (Règlement (UE) 2016/679), la California Consumer Privacy Act (CCPA), et les législations nationales relatives à la protection des données applicables dans les juridictions où Alliance One opère commercialement.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <Eye size={18} color="#4f46e5" />
            2. Collecte Exhaustive des Données
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Dans le cadre exclusif de la fourniture de nos services, nous procédons à la collecte systématique de plusieurs catégories de données, de manière directe (fournies par l'Utilisateur) ou indirecte (collectées automatiquement) :
          </p>
          <ul style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', paddingLeft: '24px', textAlign: 'justify' }}>
            <li style={{ marginBottom: '6px' }}><strong>Données d'Identité et de Contact :</strong> Incluant, sans s'y limiter, le nom complet, le prénom, les adresses électroniques (personnelles et/ou professionnelles), les numéros de téléphone, les adresses postales de facturation, les titres de fonction, et les identifiants de profils sociaux liés.</li>
            <li style={{ marginBottom: '6px' }}><strong>Données Organisationnelles :</strong> Structure de l'entreprise, organigrammes internes téléchargés, matrices de droits, habilitations, rôles assignés au sein des espaces de travail Alliance One, et métadonnées associées aux projets gérés.</li>
            <li style={{ marginBottom: '6px' }}><strong>Données d'Authentification et de Sécurité :</strong> Informations de connexion cryptées, empreintes d'appareils, jetons de session (OAuth, JWT), clés de vérification à double facteur (2FA), historique détaillé des tentatives de connexion, et horodatage des sessions actives.</li>
            <li style={{ marginBottom: '6px' }}><strong>Données Télémétriques et Techniques :</strong> Adresses IP (IPv4 et IPv6), types et versions des navigateurs, systèmes d'exploitation, identifiants de terminaux uniques, résolutions d'écran, préférences de langue, temps de réponse des pages, erreurs de téléchargement, et comportement de défilement ou clics (via des outils d'analyse de l'expérience utilisateur).</li>
            <li style={{ marginBottom: '6px' }}><strong>Données de Tiers :</strong> Si l'Utilisateur s'authentifie via des fournisseurs d'identité tiers (Single Sign-On, Google Workspace, Microsoft Entra ID, LinkedIn), nous collectons le jeton d'autorisation ainsi que les informations de profil de base approuvées lors du consentement initial.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <Lock size={18} color="#4f46e5" />
            3. Finalités de Traitement et Base Légale
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Le traitement de ces données est strictement encadré par les finalités légitimes suivantes, reposant systématiquement sur une base légale définie (consentement, exécution d'un contrat, ou intérêt légitime) :
          </p>
          <ul style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', paddingLeft: '24px', textAlign: 'justify' }}>
            <li style={{ marginBottom: '6px' }}><strong>Exécution du Contrat de Service :</strong> Fourniture ininterrompue de l'infrastructure logicielle, hébergement des données utilisateurs, traitement des requêtes applicatives, et maintien de l'intégrité des espaces de travail (Base légale : exécution contractuelle).</li>
            <li style={{ marginBottom: '6px' }}><strong>Sécurité et Prévention des Fraudes :</strong> Analyse heuristique des comportements de connexion, détection proactive des intrusions, prévention des attaques par déni de service (DDoS), et audit de conformité de l'infrastructure (Base légale : intérêt légitime).</li>
            <li style={{ marginBottom: '6px' }}><strong>Amélioration Continue et Recherche :</strong> Agrégation de données statistiques anonymisées pour optimiser le rendu de l'interface utilisateur, résoudre des bugs de performance, et entraîner nos modèles d'apprentissage automatique de manière éthique et sécurisée (Base légale : intérêt légitime).</li>
            <li style={{ marginBottom: '6px' }}><strong>Communications Transactionnelles et Administratives :</strong> Envoi de liens d'authentification (Magic Links), de notifications de sécurité critiques, d'avis de mise à jour des conditions générales, et de factures (Base légale : obligation légale et exécution contractuelle).</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            4. Sous-traitance, Transferts Internationaux et Divulgation
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Alliance One s'engage formellement à ne jamais procéder à la vente, la location ou l'échange commercial des informations personnelles identifiables de ses Utilisateurs. Toutefois, l'exploitation d'une infrastructure SaaS mondiale requiert l'engagement de sous-traitants ultérieurs dûment audités :
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            <strong>Sous-traitants techniques (Sub-processors) :</strong> Nous faisons appel à des prestataires de services d'hébergement cloud, des fournisseurs de réseaux de diffusion de contenu (CDN), et des services d'envoi d'e-mails (SMTP). Tous ces sous-traitants sont liés par des Accords de Traitement des Données (DPA) stricts qui interdisent catégoriquement l'utilisation des données à d'autres fins que celles mandatées par Alliance One.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            <strong>Transferts hors Espace Économique Européen (EEE) :</strong> Lorsque les données sont transférées vers des serveurs situés en dehors de l'EEE, Alliance One met en œuvre les Clauses Contractuelles Types (CCT) approuvées par la Commission Européenne, ou s'assure que le pays destinataire bénéficie d'une décision d'adéquation, garantissant un niveau de protection substantiellement équivalent.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            <strong>Divulgations Légales :</strong> Nous nous réservons le droit de divulguer toute information si la loi l'exige, en réponse à une injonction d'un tribunal compétent, ou pour protéger nos droits légaux, défendre contre des réclamations juridiques, ou prévenir des activités frauduleuses ou illégales imminentes.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            5. Durée de Conservation des Données (Data Retention)
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Nous conservons les données de l'Utilisateur uniquement pendant la durée strictement nécessaire à la réalisation des finalités détaillées ci-dessus, et pour satisfaire à toute exigence légale, comptable ou de reporting. La durée de conservation par défaut pour un compte actif est continue.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            En cas de résiliation ou de suppression du compte, les données de profil et les métadonnées de l'espace de travail sont purgées des systèmes de production dans un délai maximal de trente (30) jours. Des sauvegardes chiffrées immuables (backups d'archivage) peuvent conserver des traces résiduelles pendant une période supplémentaire pouvant aller jusqu'à quatre-vingt-dix (90) jours avant destruction irréversible programmée, sauf obligation de conservation légale prolongée (ex: journaux financiers conservés jusqu'à 10 ans).
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            6. Sécurité Cryptographique et Physique
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            La sécurité de vos données n'est pas qu'une simple exigence réglementaire pour Alliance One, c'est le socle de notre architecture. Nous appliquons un modèle de "Zero Trust".
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            Toutes les données en transit sont systématiquement chiffrées via TLS 1.3 avec un chiffrement AES-256 GCM. Les données au repos au sein de nos bases de données sont chiffrées au niveau du volume de stockage. L'accès physique à nos centres de données est strictement restreint, gardé par du personnel de sécurité 24/7, et protégé par une authentification biométrique multifacteur. Au niveau applicatif, l'authentification des requêtes empêche rigoureusement l'accès non autorisé via des mécanismes de validation stricts des jetons de session en rotation périodique.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            7. Droits des Personnes Concernées (Conformité RGPD)
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Les Utilisateurs disposent de droits absolus et inaliénables sur leurs données :
          </p>
          <ul style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', paddingLeft: '24px', textAlign: 'justify' }}>
            <li style={{ marginBottom: '6px' }}><strong>Droit d'Accès (Article 15) :</strong> Vous avez le droit d'obtenir la confirmation que des données vous concernant sont traitées, et le cas échéant, d'y accéder et d'en obtenir une copie complète.</li>
            <li style={{ marginBottom: '6px' }}><strong>Droit de Rectification (Article 16) :</strong> Vous pouvez exiger que vos données inexactes soient rectifiées, ou que des données incomplètes soient complétées sans délai injustifié.</li>
            <li style={{ marginBottom: '6px' }}><strong>Droit à l'Effacement (Article 17) :</strong> Également appelé "droit à l'oubli", vous pouvez exiger la suppression pure et simple de vos données si celles-ci ne sont plus nécessaires, ou si vous retirez votre consentement (sous réserve d'obligations légales contraires).</li>
            <li style={{ marginBottom: '6px' }}><strong>Droit à la Limitation du Traitement (Article 18) :</strong> Vous pouvez demander le gel temporaire de l'utilisation de vos données lors de contestations d'exactitude.</li>
            <li style={{ marginBottom: '6px' }}><strong>Droit à la Portabilité des Données (Article 20) :</strong> Vous pouvez demander à recevoir l'ensemble de vos données dans un format structuré, couramment utilisé et lisible par machine, pour les transmettre à un autre responsable du traitement.</li>
            <li style={{ marginBottom: '6px' }}><strong>Droit d'Opposition (Article 21) :</strong> Vous pouvez vous opposer à tout moment au traitement de vos données à des fins de prospection commerciale ou de profilage.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            8. Gestion Fine des Cookies et Traceurs Technologiques
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            Alliance One utilise des cookies, des balises web, des pixels invisibles et des technologies de stockage local similaires. Nous distinguons strictement :
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            - <strong>Les Cookies Strictement Nécessaires :</strong> Indispensables au maintien de la session sécurisée (cookies JWT de session), à la prévention des attaques CSRF, et à l'équilibrage de charge des serveurs. Ils ne peuvent être désactivés.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', marginBottom: '12px', textAlign: 'justify' }}>
            - <strong>Les Cookies Analytiques et de Performance :</strong> Ils permettent de comptabiliser les visites et les sources de trafic, d'identifier les pages les plus ou moins populaires et d'évaluer de manière anonymisée la fluidité de la navigation, via des outils tiers limités dans leur capacité d'identification.
          </p>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            La gestion du consentement aux cookies optionnels est assurée par notre gestionnaire de préférences, accessible de manière permanente depuis le pied de page de l'application.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            9. Révisions, Amendements et Entrée en Vigueur
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', textAlign: 'justify' }}>
            Alliance One se réserve le droit unilatéral, à sa seule et entière discrétion, de modifier, amender ou réviser la présente Politique de Confidentialité à tout moment pour se conformer aux évolutions législatives ou à l'intégration de nouvelles fonctionnalités applicatives. Toute révision substantielle fera l'objet d'une notification préalable claire aux Utilisateurs actifs par voie électronique ou via une notification in-app, avec une période de préavis de quinze (15) jours précédant l'entrée en vigueur. L'utilisation continue de la plateforme après l'entrée en vigueur de la politique révisée constitue une acceptation formelle et irrévocable des nouvelles conditions par l'Utilisateur.
          </p>
        </section>

        <section style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '12px', marginTop: '64px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Mail size={16} color="#4f46e5" />
            Correspondance Juridique et DPO
          </h2>
          <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '13px', margin: 0, textAlign: 'justify' }}>
            Toutes les correspondances juridiques, demandes d'exercice de droits relatifs au RGPD, signalements de failles de sécurité, ou requêtes formelles de conformité doivent être impérativement adressées à notre Délégué à la Protection des Données (DPO) dédié, qui agira avec la diligence requise dans les délais impartis par les lois applicables :<br/>
            <strong style={{ color: '#0f172a', display: 'block', marginTop: '12px', fontSize: '14px' }}>privacy@alliance-one.com</strong>
          </p>
        </section>

      </main>
    </div>
  );
};
