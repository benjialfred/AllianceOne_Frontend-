import React from 'react';

export interface AllianceLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AllianceLogo: React.FC<AllianceLogoProps> = ({ 
  size = 48, 
  className 
}) => {
  return (
    <img
      src="/logo-icon.png"
      alt="Alliance One Logo"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', objectFit: 'contain' }}
    />
  );
};
