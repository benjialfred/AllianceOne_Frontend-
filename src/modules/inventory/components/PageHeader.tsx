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
      borderBottom: '1px solid var(--neutral-200, #f3f3f6)'
    }}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-tertiary, #868c98)',
            marginBottom: '4px'
          }}>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span style={{ color: idx === breadcrumbs.length - 1 ? 'var(--text-primary, #0e121b)' : 'inherit', fontWeight: idx === breadcrumbs.length - 1 ? 500 : 400 }}>
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
            color: 'var(--text-primary, #0e121b)',
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
              backgroundColor: 'var(--color-accent-light, #e0e7ff)',
              color: 'var(--color-accent, #6366f1)',
              border: '1px solid #c7d2fe'
            }}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #525866)',
            margin: '4px 0 0 0'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {actions}
        </div>
      )}
    </div>
  );
};
