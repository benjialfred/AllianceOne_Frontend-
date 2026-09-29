import React from 'react';
import { GenericPublicPage } from './GenericPublicPage';

export const SecurityPage: React.FC = () => (
  <GenericPublicPage title="Sécurité & Trust" subtitle="Une infrastructure sécurisée by design.">
    <p>La sécurité n'est pas une option. Découvrez nos protocoles de chiffrement, nos normes de conformité et notre gestion des accès.</p>
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
