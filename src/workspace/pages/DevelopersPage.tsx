/**
 * ALLIANCE ONE — DEVELOPER HUB & PLATFORM
 * Documentation API, SDK TypeScript/Python, gestion des clés API, Webhooks et bac à sable REST.
 */
import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Key, 
  Layers, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Send, 
  Sparkles, 
  FileCode,
  ShieldCheck,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import './EcosystemPages.css';

export const DevelopersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'webhooks' | 'sandbox'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Production Backend Server', prefix: 'ao_live_9f82...3a19', created: '12 Août 2026', lastUsed: 'Il y a 4 min' },
    { id: 'key-2', name: 'Mobile App Sync', prefix: 'ao_live_4e71...bc88', created: '01 Août 2026', lastUsed: 'Il y a 1h' }
  ]);

  const [webhooks, setWebhooks] = useState([
    { id: 'wh-1', url: 'https://api.mon-ecole.com/webhooks/alliance', events: ['students.created', 'payments.received'], status: 'active' }
  ]);

  const [sandboxEndpoint, setSandboxEndpoint] = useState('/api/education/students/');
  const [sandboxMethod, setSandboxMethod] = useState('GET');
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: `Clé API Service #${apiKeys.length + 1}`,
      prefix: `ao_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      created: "Aujourd'hui",
      lastUsed: 'Jamais'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleRunSandbox = () => {
    setSandboxLoading(true);
    setTimeout(() => {
      setSandboxResponse(JSON.stringify({
        status: 200,
        count: 482,
        next: null,
        previous: null,
        results: [
          { id: 'stu-001', first_name: 'Marc Aurèle', last_name: 'Ndomo', class_name: '1ère S1', matricule: 'AO-2026-081', status: 'ACTIVE' },
          { id: 'stu-002', first_name: 'Christian', last_name: 'Biya', class_name: 'Tle D', matricule: 'AO-2026-042', status: 'ACTIVE' }
        ]
      }, null, 2));
      setSandboxLoading(false);
    }, 400);
  };

  return (
    <div className="ecosystem-page-root">
      {/* Header Banner */}
      <div className="ecosystem-header-banner">
        <div className="ecosystem-badge">
          <Code2 size={14} />
          <span>ALLIANCE DEVELOPER PLATFORM</span>
        </div>
        <h1 className="ecosystem-title">Developer Hub & API Reference</h1>
        <p className="ecosystem-subtitle">
          Intégrez l'écosystème Alliance One à vos applications grâce au SDK officiel, aux clés REST et aux événements EventBus.
        </p>

        {/* Tab Navigation */}
        <div className="developer-tab-nav">
          <button 
            className={`dev-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen size={15} />
            <span>Vue d'ensemble & SDK</span>
          </button>
          <button 
            className={`dev-nav-btn ${activeTab === 'api-keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('api-keys')}
          >
            <Key size={15} />
            <span>Clés d'API ({apiKeys.length})</span>
          </button>
          <button 
            className={`dev-nav-btn ${activeTab === 'webhooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('webhooks')}
          >
            <Layers size={15} />
            <span>Webhooks</span>
          </button>
          <button 
            className={`dev-nav-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Terminal size={15} />
            <span>Sandbox REST</span>
          </button>
        </div>
      </div>

      <div className="developer-body-container">
        {/* TAB 1: OVERVIEW & SDK */}
        {activeTab === 'overview' && (
          <div className="dev-overview-grid">
            <div className="dev-card">
              <h3 className="dev-card-title">Installation du SDK & CLI</h3>
              <p className="dev-card-desc">
                Installez la CLI Alliance pour générer des modules types et gérer vos clés d'environnement localement.
              </p>
              <div className="terminal-codeblock">
                <code>npm install -g @alliance/cli</code>
                <button className="copy-code-btn" onClick={() => handleCopy('npm install -g @alliance/cli', 'cli-inst')}>
                  {copiedKey === 'cli-inst' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <h4 style={{ fontSize: '13px', margin: '0 0 6px' }}>Initialiser un nouveau module</h4>
                <div className="terminal-codeblock">
                  <code>agy init mon-extension-metier</code>
                </div>
              </div>
            </div>

            <div className="dev-card">
              <h3 className="dev-card-title">Authentification & Headers</h3>
              <p className="dev-card-desc">
                Toutes les requêtes vers l'API REST doivent être authentifiées et préciser l'identifiant du Tenant actif.
              </p>
              <div className="terminal-codeblock">
                <code>{`Authorization: Bearer <VOTRE_CLE_API>
X-Tenant-ID: <ORG_ID>`}</code>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API KEYS */}
        {activeTab === 'api-keys' && (
          <div className="dev-card">
            <div className="dev-card-header-row">
              <div>
                <h3 className="dev-card-title">Clés d'API Actives</h3>
                <p className="dev-card-desc">Gérez vos jetons d'accès pour les environnements de production et de test.</p>
              </div>
              <button className="dev-create-action-btn" onClick={handleCreateKey}>
                <Plus size={14} /> <span>Générer une clé</span>
              </button>
            </div>

            <div className="api-keys-table">
              {apiKeys.map((key) => (
                <div key={key.id} className="api-key-row">
                  <div className="key-info">
                    <strong className="key-name">{key.name}</strong>
                    <code className="key-prefix">{key.prefix}</code>
                  </div>
                  <div className="key-meta">
                    <span>Créée le {key.created}</span>
                    <span>Dernier usage : {key.lastUsed}</span>
                  </div>
                  <div className="key-actions">
                    <button className="key-action-btn" onClick={() => handleCopy(key.prefix, key.id)}>
                      {copiedKey === key.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                    <button 
                      className="key-action-btn danger" 
                      onClick={() => setApiKeys(apiKeys.filter((k) => k.id !== key.id))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WEBHOOKS */}
        {activeTab === 'webhooks' && (
          <div className="dev-card">
            <h3 className="dev-card-title">Webhooks en Direct</h3>
            <p className="dev-card-desc">Recevez des notifications HTTP dès qu'un événement survient (inscription, paiement, alerte stock).</p>
            
            <div className="api-keys-table">
              {webhooks.map((wh) => (
                <div key={wh.id} className="api-key-row">
                  <div className="key-info">
                    <strong className="key-name">{wh.url}</strong>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      {wh.events.map((evt) => (
                        <span key={evt} className="webhook-event-tag">{evt}</span>
                      ))}
                    </div>
                  </div>
                  <div className="key-actions">
                    <span className="webhook-status-active">Actif</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SANDBOX REST */}
        {activeTab === 'sandbox' && (
          <div className="dev-card">
            <h3 className="dev-card-title">Bac à Sable REST</h3>
            <p className="dev-card-desc">Testez vos requêtes API directement depuis votre navigateur.</p>

            <div className="sandbox-request-bar">
              <select 
                className="sandbox-method-select"
                value={sandboxMethod} 
                onChange={(e) => setSandboxMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
              </select>

              <input
                type="text"
                className="sandbox-url-input"
                value={sandboxEndpoint}
                onChange={(e) => setSandboxEndpoint(e.target.value)}
              />

              <button className="sandbox-send-btn" onClick={handleRunSandbox} disabled={sandboxLoading}>
                <Send size={14} />
                <span>{sandboxLoading ? 'Envoi...' : 'Exécuter'}</span>
              </button>
            </div>

            {sandboxResponse && (
              <div className="sandbox-response-box">
                <div className="response-header">
                  <span>Réponse HTTP 200 OK</span>
                  <span style={{ color: '#10b981' }}>Temps : 42ms</span>
                </div>
                <pre className="response-body">
                  <code>{sandboxResponse}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
