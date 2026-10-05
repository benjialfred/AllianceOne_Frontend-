import React from 'react';

interface WaveDividerProps {
  position: 'top' | 'bottom';
  color?: string;
  flip?: boolean;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({ 
  position, 
  color = '#050505', 
  flip = false 
}) => {
  const transform = [
    position === 'top' ? 'rotate(180deg)' : '',
    flip ? 'scaleX(-1)' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`absolute left-0 right-0 w-full overflow-hidden leading-[0] ${position === 'top' ? 'top-0' : 'bottom-0'}`} style={{ transform: transform || 'none', zIndex: 10 }}>
      <svg
        className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[120px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.22,200.5,110.3,242.42,103.74,282.72,82.49,321.39,56.44Z"
          style={{ fill: color }}
        ></path>
      </svg>
    </div>
  );
};
