/**
 * ALLIANCE ONE — ROOT APPLICATION ROUTER
 * Separates public routes (/, /login, /register) from the authenticated workspace (/app/*).
 * The WorkspaceShell is only mounted under /app/* and requires authentication.
 */
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
const NetworkPage = React.lazy(() => import('./pages/public/NetworkPage').then(m => ({ default: m.NetworkPage })));
const PlatformPage = React.lazy(() => import('./pages/public/PlatformPage').then(m => ({ default: m.PlatformPage })));
const ModulesPage = React.lazy(() => import('./pages/public/ModulesPage').then(m => ({ default: m.ModulesPage })));
const AIPage = React.lazy(() => import('./pages/public/AIPage').then(m => ({ default: m.AIPage })));
const HelpCenterPage = React.lazy(() => import('./pages/public/HelpCenterPage').then(m => ({ default: m.HelpCenterPage })));
const SecurityPage = React.lazy(() => import('./pages/public/PublicPagesStubs').then(m => ({ default: m.SecurityPage })));
const PricingPage = React.lazy(() => import('./pages/public/PricingPage').then(m => ({ default: m.PricingPage })));
const MarketplacePage = React.lazy(() => import('./pages/public/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const IntegrationsPage = React.lazy(() => import('./pages/public/IntegrationsPage').then(m => ({ default: m.IntegrationsPage })));
const DevelopersPage = React.lazy(() => import('./pages/public/DevelopersPage').then(m => ({ default: m.DevelopersPage })));
const DocsPage = React.lazy(() => import('./pages/public/GuidesPage').then(m => ({ default: m.GuidesPage })));
const AboutPage = React.lazy(() => import('./pages/public/PublicPagesStubs').then(m => ({ default: m.AboutPage })));
const NewsPage = React.lazy(() => import('./pages/public/NewsPage').then(m => ({ default: m.NewsPage })));
const InsightsPage = React.lazy(() => import('./pages/public/InsightsPage').then(m => ({ default: m.InsightsPage })));
const CareersPage = React.lazy(() => import('./pages/public/PublicPagesStubs').then(m => ({ default: m.CareersPage })));
const ContactPage = React.lazy(() => import('./pages/contact/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPage = React.lazy(() => import('./pages/public/PublicPagesStubs').then(m => ({ default: m.LegalPage })));
const PublicSettingsPage = React.lazy(() => import('./pages/public/PublicSettingsPage').then(m => ({ default: m.PublicSettingsPage })));

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
import { PremiumPreloader } from './pages/landing/components/PremiumPreloader';

const CheckoutPage = React.lazy(() => import('./pages/cart/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
import { CartDrawer } from './pages/cart/CartDrawer';
import { MarketingModal } from './design-system/components/MarketingModal';

const BoostPage = React.lazy(() => import('./workspace/pages/BoostPage').then(m => ({ default: m.BoostPage })));

const LoadingScreen: React.FC = () => (
  <AllianceLoader text="Chargement d'Alliance One..." />
);

import { usePlatformStore } from './core/stores/platformStore';

export const RootApp: React.FC = () => {
  const theme = usePlatformStore(s => s.theme);
  
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <PremiumPreloader />
      <CartDrawer />
      <MarketingModal />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* ─── PUBLIC ROUTES ─── */}
        <Route
          path="/"
          element={
            <LandingPage />
          }
        />

        <Route
          path="/login"
          element={<AuthPage mode="login" />}
        />

        <Route
          path="/register"
          element={<AuthPage mode="register" />}
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

        <Route path="/platform" element={<PlatformPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/*" element={<ModulesPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/boost" element={<BoostPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/developer-center" element={<DevelopersPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/guides" element={<DocsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/settings" element={<PublicSettingsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/legal" element={<LegalPage />} />

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
    </>
  );
};

