/**
 * ALLIANCE ONE — DEVELOPER & ECOSYSTEM SHOWCASE
 * Section développeurs sur le Hub avec présentation du SDK, CLI et invitation à créer.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Terminal, Key, ArrowRight, Zap, Layers, Sparkles, ExternalLink } from 'lucide-react';

export const DeveloperShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hub-section">
      <div className="hub-dev-banner">
        <div className="hub-dev-content">
          <div className="hub-dev-badge">
            <Code2 size={13} />
            <span>ALLIANCE DEVELOPER PLATFORM</span>
          </div>

          <h2 className="hub-dev-title">
            Construisez des applications sur Alliance One OS
          </h2>
          <p className="hub-dev-desc">
            Utilisez notre SDK TypeScript & Python, notre CLI officielle (`agy`) et nos Webhooks temps réel pour intégrer vos systèmes ou distribuer vos modules sur le Marketplace.
          </p>

          <div className="hub-dev-actions">
            <button className="dev-primary-btn" onClick={() => navigate('/app/developers')}>
              <span>Accéder au Developer Hub</span>
              <ArrowRight size={14} />
            </button>
            <button className="dev-secondary-btn" onClick={() => navigate('/app/developers')}>
              <Terminal size={14} />
              <span>Consulter la documentation API</span>
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="hub-dev-codebox">
          <div className="codebox-header">
            <div className="codebox-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="codebox-filename">alliance.config.ts</span>
          </div>
          <pre className="codebox-body">
            <code>{`import { defineModule } from '@alliance/sdk';

export default defineModule({
  id: 'custom-extension',
  name: 'Mon Extension Métier',
  version: '1.0.0',
  permissions: ['identity:read', 'events:subscribe'],
  onInit: async ({ workspace, eventBus }) => {
    eventBus.subscribe('Finance:PaymentReceived', (event) => {
      console.log('Nouveau paiement reçu :', event.amount);
    });
  }
});`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
