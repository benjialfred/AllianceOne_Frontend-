/**
 * ALLIANCE ONE — ROOT APPLICATION ROUTER
 * Separates public routes (/, /login, /register) from the authenticated workspace (/app/*).
 * The WorkspaceShell is only mounted under /app/* and requires authentication.
 */
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './core/stores/authStore';
import { AuthPage } from './pages/auth/AuthPage';

// Lazy load heavy components
const WorkspaceShell = React.lazy(() =>
  import('./workspace/App').then((m) => ({ default: m.WorkspaceShell }))
);

const LandingPage = React.lazy(() =>
  import('./pages/landing/LandingPage').then((m) => ({ default: m.LandingPage }))
);

const FounderAppRoutes = React.lazy(() =>
  import('./workspace/pages/founder/FounderApp').then((m) => ({ default: m.default }))
);

const OnboardingFlow = React.lazy(() =>
  import('./pages/onboarding/OnboardingFlow').then((m) => ({ default: m.OnboardingFlow }))
);

const PrivacyPolicyPage = React.lazy(() =>
  import('./pages/legal/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);

const TermsOfServicePage = React.lazy(() =>
  import('./pages/legal/TermsOfServicePage').then((m) => ({ default: m.TermsOfServicePage }))
);

/**
 * Auth guard: redirects to /login if not authenticated.
 */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * Guest guard: redirects to /app if already authenticated.
 */
const RequireGuest: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
};

import { AllianceLoader } from './design-system/components/AllianceLoader';

/**
 * Loading fallback for Suspense boundaries
 */
const LoadingScreen: React.FC = () => (
  <AllianceLoader text="Chargement d'Alliance One..." />
);

export const RootApp: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* ─── PUBLIC ROUTES ─── */}
        <Route
          path="/"
          element={
            <RequireGuest>
              <LandingPage />
            </RequireGuest>
          }
        />

        <Route
          path="/login"
          element={
            <RequireGuest>
              <AuthPage mode="login" />
            </RequireGuest>
          }
        />

        <Route
          path="/register"
          element={
            <RequireGuest>
              <AuthPage mode="register" />
            </RequireGuest>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <PrivacyPolicyPage />
          }
        />

        <Route
          path="/terms"
          element={
            <TermsOfServicePage />
          }
        />

        {/* Founder Experience is fully public */}
        <Route
          path="/founder/*"
          element={
            <FounderAppRoutes />
          }
        />

        {/* ─── ONBOARDING (Authenticated) ─── */}
        <Route
          path="/app/onboarding"
          element={
            <RequireAuth>
              <OnboardingFlow />
            </RequireAuth>
          }
        />

        {/* ─── AUTHENTICATED WORKSPACE ─── */}
        <Route
          path="/app/*"
          element={
            <RequireAuth>
              <WorkspaceShell />
            </RequireAuth>
          }
        />

        {/* ─── FALLBACK ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

