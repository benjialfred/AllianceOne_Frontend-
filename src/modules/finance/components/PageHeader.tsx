import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--color-surface-border, #e2e8f0)'
    }}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--color-text-muted, #94a3b8)',
            marginBottom: '4px'
          }}>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--color-text-primary, #0f172a)' : 'inherit', fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400 }}>
                  {b.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary, #0f172a)',
            margin: 0
          }}>
            {title}
          </h1>
          {badge && (
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0'
            }}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary, #64748b)',
            margin: '4px 0 0 0'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
};
