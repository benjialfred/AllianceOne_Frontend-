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
  // A beautiful abstract logo representing a glowing node / alliance connection
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
        <filter id="ao-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Abstract 'A' geometry */}
      <path
        d="M50 15 L85 80 H60 L50 60 L40 80 H15 Z"
        fill="url(#ao-grad-main)"
        filter="url(#ao-glow)"
      />
      
      {/* Interlocking 'O' / Core Ring */}
      <circle
        cx="50"
        cy="55"
        r="16"
        fill="none"
        stroke="url(#ao-grad-accent)"
        strokeWidth="8"
      />
      
      {/* Central Node Dot */}
      <circle
        cx="50"
        cy="55"
        r="4"
        fill="#ffffff"
      />
    </svg>
  );
};
