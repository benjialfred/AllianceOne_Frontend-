import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={className}
  >
    <defs>
      <linearGradient id="smart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--color-primary-500, #6366f1)" />
        <stop offset="100%" stopColor="var(--color-primary-700, #4338ca)" />
      </linearGradient>
    </defs>
    
    {/* 
      "Intelligent Simple Art" :
      L'Okinawa Monogram. Les jambes du 'A' s'écartent pour enlacer parfaitement 
      le cercle 'O' qui fait office de barre transversale.
      Les proportions sont calculées pour que les traits fusionnent géométriquement.
    */}
    <g stroke="url(#smart-grad)" strokeWidth="12" fill="none">
      {/* Les jambes du 'A' */}
      <path 
        d="M 15 90 L 50 15 L 85 90" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Le cercle 'O' agissant comme barre centrale, fusionnant avec l'intérieur des jambes */}
      <circle 
        cx="50" 
        cy="60" 
        r="19" 
      />
    </g>
  </svg>
);
