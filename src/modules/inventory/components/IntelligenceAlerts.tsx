import React from 'react';
import { AlertCircle, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import type { IntelligenceAlert } from '../types';

interface IntelligenceAlertsProps {
  alerts: IntelligenceAlert[];
  onActionClick?: (alert: IntelligenceAlert) => void;
}

export const IntelligenceAlerts: React.FC<IntelligenceAlertsProps> = ({
  alerts,
  onActionClick
}) => {
  if (alerts.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f9f9fb',
        border: '1px solid #e2e4e9',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#525866',
        fontSize: '13px'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '4px' }}>✨</div>
        <div style={{ fontWeight: 600, color: '#0e121b' }}>Tous les voyants sont au vert</div>
        <div>Aucune rupture ni anomalie d'approvisionnement détectée.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const isWarning = alert.severity === 'warning';

        const bg = isCritical ? '#fef2f2' : isWarning ? '#fffbeb' : '#eff6ff';
        const border = isCritical ? '#fecaca' : isWarning ? '#fde68a' : '#bfdbfe';
        const text = isCritical ? '#991b1b' : isWarning ? '#92400e' : '#1e40af';
        const iconColor = isCritical ? '#dc2626' : isWarning ? '#d97706' : '#2563eb';

        return (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: bg,
              border: `1px solid ${border}`,
              gap: '12px',
              transition: 'transform 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ flexShrink: 0, color: iconColor }}>
                {isCritical ? <AlertCircle size={18} /> : isWarning ? <AlertTriangle size={18} /> : <Info size={18} />}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: text }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: '12px', color: '#525866', marginTop: '2px' }}>
                  {alert.message}
                </div>
              </div>
            </div>

            {alert.action_label && onActionClick && (
              <button
                type="button"
                onClick={() => onActionClick(alert)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  border: `1px solid ${border}`,
                  color: text,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                {alert.action_label}
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
