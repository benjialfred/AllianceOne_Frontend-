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
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* A - Chevron abstrait ultra-propre et gras */}
      <path 
        d="M 20 80 L 50 20 L 80 80" 
        stroke={color} 
        strokeWidth="18" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* O - Cercle gras imbriqué */}
      <circle 
        cx="50" 
        cy="60" 
        r="14" 
        stroke={color} 
        strokeWidth="18" 
      />
    </svg>
  );
};
