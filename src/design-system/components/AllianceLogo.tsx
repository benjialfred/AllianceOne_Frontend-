import React from 'react';

export interface AllianceLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AllianceLogo: React.FC<AllianceLogoProps> = ({ 
  size = 48, 
  color = 'currentColor', 
  className 
}) => {
  return (
    <img
      src="/logo-ao.png" 
      alt="Alliance One Logo"
      className={className}
      style={{ width: size, height: 'auto', objectFit: 'contain' }}
    />
  );
};
