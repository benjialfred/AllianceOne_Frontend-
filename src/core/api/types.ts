/**
 * Types partagés représentant les objets du Core backend.
 */

export interface Organization {
  id: string;
  name: string;
  legal_name: string;
  registration_number: string;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string;
  full_name: string;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  person: Person | null;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}
