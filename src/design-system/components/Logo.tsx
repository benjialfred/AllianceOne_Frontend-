import React from 'react';
import { AllianceLogo } from './AllianceLogo';

export interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showMotto?: boolean;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 36, 
  className = '', 
  showText = false, 
  showMotto = false,
  style 
}) => {
  return (
    <div 
      className={`brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
        ...style
      }}
    >
      <AllianceLogo size={size} color="var(--ao-elegant-primary, #4f46e5)" />
      {(showText || showMotto) && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, justifyContent: 'center' }}>
          {showText && (
            <span style={{ 
              fontWeight: 800, 
              fontSize: `${Math.max(13, size * 0.42)}px`, 
              letterSpacing: '0.04em', 
              color: 'var(--color-text-primary, #0f172a)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              ALLIANCE ONE
            </span>
          )}
          {showMotto && (
            <span style={{ 
              fontSize: `${Math.max(9, size * 0.26)}px`, 
              fontWeight: 700, 
              letterSpacing: '0.12em', 
              color: '#d97706', 
              textTransform: 'uppercase',
              marginTop: '1px'
            }}>
              Unis pour exceller
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
