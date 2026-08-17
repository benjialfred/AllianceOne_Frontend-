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

/**
 * Loading fallback for Suspense boundaries
 */
const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#fafafa',
    fontFamily: "'Inter', system-ui, sans-serif",
    color: '#64748b',
    fontSize: '14px',
    gap: '12px',
  }}>
    <div style={{
      width: '20px',
      height: '20px',
      border: '2.5px solid #e5e7eb',
      borderTopColor: '#0B2B5C',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    }} />
    Chargement d'Alliance One...
  </div>
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
