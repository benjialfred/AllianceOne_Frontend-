import React from 'react';
import { NewUsersWidget } from './widgets/NewUsersWidget';
import { RecentActivityWidget } from './widgets/RecentActivityWidget';
import { OrgsToCertifyWidget } from './widgets/OrgsToCertifyWidget';

export const WIDGET_REGISTRY: Record<string, {
  name: string;
  component: React.FC<any>;
  defaultW: number;
  defaultH: number;
}> = {
  'users_stats': {
    name: 'Statistiques Nouveaux Utilisateurs',
    component: NewUsersWidget,
    defaultW: 6,
    defaultH: 3
  },
  'recent_activities': {
    name: 'Activités Récentes',
    component: RecentActivityWidget,
    defaultW: 4,
    defaultH: 4
  },
  'orgs_to_certify': {
    name: 'Organisations à Certifier',
    component: OrgsToCertifyWidget,
    defaultW: 6,
    defaultH: 3
  }
};
