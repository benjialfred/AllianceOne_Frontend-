import React from 'react';
import { AllianceLogo } from './AllianceLogo';
import logoFull from '../../assets/Logo technologique Alliance One en bleu (1).png';

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
        flexDirection: showMotto ? 'column' : 'row',
        alignItems: showMotto ? 'flex-start' : 'center',
        ...style
      }}
    >
      {showText ? (
        <img 
          src={logoFull} 
          alt="Alliance One" 
          height={size} 
          style={{ height: `${size}px`, width: 'auto', objectFit: 'contain' }} 
        />
      ) : (
        <AllianceLogo size={size} />
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
  );
};

export default Logo;
