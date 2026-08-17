import React from 'react';
import logoImg from '../../assets/logo.png';

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
      <img 
        src={logoImg} 
        alt="Alliance One" 
        width={size} 
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          borderRadius: '8px',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))',
          display: 'block'
        }}
      />
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
