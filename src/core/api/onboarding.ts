/**
 * ALLIANCE ONE — ONBOARDING API CLIENT
 * Endpoints pour le flow d'onboarding organisationnel.
 */
import { apiClient } from './client';

export interface OnboardingStatusResponse {
  onboarding_completed: boolean;
  profile?: {
    sector: string;
    sub_sector: string;
    country: string;
    city: string;
    employee_count: string;
    selected_modules: string[];
  };
}

export interface OnboardingSubmitPayload {
  organization_name: string;
  legal_name?: string;
  registration_number?: string;
  sector: string;
  sub_sector?: string;
  country: string;
  city?: string;
  employee_count?: string;
  phone?: string;
  website?: string;
  selected_modules: string[];
}

export interface OnboardingSubmitResponse {
  status: string;
  organization_id: string;
  onboarding_completed: boolean;
}

export const onboardingApi = {
  /** Vérifie si l'onboarding a été complété pour l'organisation actuelle. */
  checkStatus: () =>
    apiClient.get<OnboardingStatusResponse>('/core/identity/onboarding/status/'),

  /** Soumet les données du wizard d'onboarding. */
  submit: (data: OnboardingSubmitPayload) =>
    apiClient.post<OnboardingSubmitResponse>('/core/identity/onboarding/', data),
};
