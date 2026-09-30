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
  // A sleek, unified geometric nexus representing 'Alliance' and 'One'. No letters.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="ao-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" /> {/* Bright Blue */}
          <stop offset="100%" stopColor="#0EA5E9" /> {/* Light Blue */}
        </linearGradient>
        <linearGradient id="ao-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" /> {/* Emerald */}
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>

      {/* The Unified Nexus - A beautiful intersecting 3D-like rhombus/diamond */}
      <path
        d="M50 10 L85 50 L50 90 L15 50 Z"
        fill="url(#ao-grad-main)"
        fillOpacity="0.8"
      />
      <path
        d="M50 10 L85 50 L50 60 L15 50 Z"
        fill="url(#ao-grad-accent)"
        fillOpacity="0.9"
      />
      
      {/* Central 'One' Core - A glowing inner element */}
      <circle
        cx="50"
        cy="40"
        r="6"
        fill="#ffffff"
      />
      <path
        d="M50 40 L50 80"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};
