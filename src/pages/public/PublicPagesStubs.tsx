import React from 'react';
import { GenericPublicPage } from './GenericPublicPage';

export const PlatformPage: React.FC = () => (
  <GenericPublicPage title="Architecture Core" subtitle="La fondation technique de l'écosystème Alliance One.">
    <p>La page Platform sera bientôt disponible. Elle décrira l'architecture en micro-services, la scalabilité et les performances du noyau d'Alliance One.</p>
  </GenericPublicPage>
);

export const ModulesPage: React.FC = () => (
  <GenericPublicPage title="Modules Métier" subtitle="Découvrez la suite complète des modules d'Alliance One.">
    <p>Cette page détaillera les modules Education, Inventory, Finance, Library, et Tasks, et comment ils interagissent.</p>
  </GenericPublicPage>
);

export const AIPage: React.FC = () => (
  <GenericPublicPage title="Alliance AI" subtitle="L'intelligence distribuée au cœur de votre organisation.">
    <p>Découvrez comment Alliance AI agit comme le système nerveux de vos opérations, fournissant des analyses prédictives et une assistance contextuelle.</p>
  </GenericPublicPage>
);

export const SecurityPage: React.FC = () => (
  <GenericPublicPage title="Sécurité & Trust" subtitle="Une infrastructure sécurisée by design.">
    <p>La sécurité n'est pas une option. Découvrez nos protocoles de chiffrement, nos normes de conformité et notre gestion des accès.</p>
  </GenericPublicPage>
);



export const MarketplacePage: React.FC = () => (
  <GenericPublicPage title="Marketplace" subtitle="Étendez les capacités d'Alliance One.">
    <p>Découvrez les plugins, les intégrations tierces et les extensions développées par notre communauté de partenaires.</p>
  </GenericPublicPage>
);

export const AboutPage: React.FC = () => (
  <GenericPublicPage title="À propos d'Alliance One" subtitle="Notre mission, notre vision, notre histoire.">
    <p>Alliance One a été conçue pour redéfinir les standards mondiaux de l'ingénierie logicielle d'entreprise. Apprenez-en plus sur notre parcours.</p>
  </GenericPublicPage>
);

export const CareersPage: React.FC = () => (
  <GenericPublicPage title="Carrières" subtitle="Rejoignez la mission.">
    <p>Nous recherchons des ingénieurs, designers, et penseurs exceptionnels pour nous aider à bâtir le futur du logiciel d'entreprise.</p>
  </GenericPublicPage>
);

export const ContactPage: React.FC = () => (
  <GenericPublicPage title="Contact" subtitle="Parlons de vos défis opérationnels.">
    <p>Prenez contact avec nos équipes commerciales, notre support technique, ou notre département partenariats.</p>
  </GenericPublicPage>
);

export const LegalPage: React.FC = () => (
  <GenericPublicPage title="Mentions légales" subtitle="Informations juridiques.">
    <p>Directeur de la publication, hébergement, et informations sur l'entité légale derrière Alliance One.</p>
  </GenericPublicPage>
);
