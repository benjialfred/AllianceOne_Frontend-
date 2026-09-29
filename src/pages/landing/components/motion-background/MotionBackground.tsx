import React, { useState, useEffect } from 'react';
import './MotionBackground.css';
import { WaveField } from './layers/WaveField';
import { FlowLines } from './layers/FlowLines';
import { ParticleField } from './layers/ParticleField';
import { AbstractGeometry } from './layers/AbstractGeometry';

interface MotionBackgroundProps {
  disableParallax?: boolean;
}

export const MotionBackground: React.FC<MotionBackgroundProps> = ({ disableParallax = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || disableParallax) return;
    // Extremely subtle parallax (max 10px movement)
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div 
      className="living-motion-background" 
      onMouseMove={handleMouseMove}
    >
      {/* Background layer: geometry and waves */}
      <div 
        className="lmb-parallax-layer" 
        style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`, transition: 'transform 0.5s ease-out', width: '100%', height: '100%', position: 'absolute' }}
      >
        <AbstractGeometry />
        <WaveField />
      </div>

      {/* Midground layer: flow lines */}
      <div 
        className="lmb-parallax-layer" 
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`, transition: 'transform 0.5s ease-out', width: '100%', height: '100%', position: 'absolute' }}
      >
        <FlowLines />
      </div>

      {/* Foreground layer: particles */}
      {!isMobile && (
        <div 
          className="lmb-parallax-layer" 
          style={{ transform: `translate(${mousePos.x * 1}px, ${mousePos.y * 1}px)`, transition: 'transform 0.5s ease-out', width: '100%', height: '100%', position: 'absolute' }}
        >
          <ParticleField />
        </div>
      )}
    </div>
  );
};
