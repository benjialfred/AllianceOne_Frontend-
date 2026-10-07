import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Users, Briefcase, Layout, BrainCircuit, Box, Send } from 'lucide-react';
import { AllianceLogo } from '../../../design-system/components/AllianceLogo';
import { LivingMotionBackground } from './motion-background/LivingMotionBackground';
import './HeroInfrastructure.css';

export const HeroInfrastructure: React.FC = () => {
  const navigate = useNavigate();

  // Mouse parallax interaction (subtle)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20; 
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  // Satellite nodes data
  const satellites = [
    { id: 'data', label: 'DATA', icon: <Database size={20}/>, angle: -45, distance: 200 },
    { id: 'people', label: 'PEOPLE', icon: <Users size={20}/>, angle: 15, distance: 220 },
    { id: 'apps', label: 'APPS', icon: <Layout size={20}/>, angle: 75, distance: 180 },
    { id: 'ops', label: 'OPERATIONS', icon: <Briefcase size={20}/>, angle: 135, distance: 210 },
    { id: 'ai', label: 'INTELLIGENCE', icon: <BrainCircuit size={20}/>, angle: 210, distance: 190 },
  ];

  return (
    <section className="ao-dark-hero" onMouseMove={handleMouseMove}>
      <LivingMotionBackground />
      
      <div className="ao-hero-container">
        
        {/* TEXT CONTENT */}
        <div className="ao-hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="ao-hero-badge">
              <span className="badge-dot"></span> ALLIANCE ONE OPERATING SYSTEM
            </div>
            
            <h1 className="ao-hero-title">
              Le système nerveux<br />
              de votre organisation.<br />
              <span className="ao-hero-title-gradient">Unifié et intelligent.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="ao-hero-subtitle"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Une infrastructure cloud unique qui connecte vos données, vos équipes et vos opérations. 
            Déployez des modules métiers ultra-performants et laissez l'IA orchestrer le reste.
          </motion.p>
          
          <motion.div 
            className="ao-hero-cta"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}
          >
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="ao-btn-primary-large" onClick={() => navigate('/register')}>
                Déployer maintenant <ArrowRight size={18} />
              </button>
              <button className="ao-btn-secondary-large" onClick={() => navigate('/platform')}>
                Explorer l'architecture
              </button>
            </div>
            
            <a 
              href="https://t.me/AllianceOneAIBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="telegram-hero-cta"
            >
              <Send size={18} />
              Essayer l'Assistant Telegram
            </a>
          </motion.div>
        </div>

        {/* VISUALIZATION */}
        <motion.div 
          className="ao-hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        >
          {/* Central Core */}
          <div className="core-system">
            <div className="core-pulse"></div>
            <div style={{ color: '#fff' }}>
              <AllianceLogo size={48} />
            </div>
          </div>

          {/* Satellites */}
          {satellites.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * node.distance;
            const y = Math.sin(rad) * node.distance;

            return (
              <React.Fragment key={node.id}>
                <motion.div
                  className="connection-line"
                  style={{
                    width: node.distance,
                    transform: `rotate(${node.angle}deg)`
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                />
                
                <motion.div 
                  className="satellite-node"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    marginLeft: '-55px', // half of width
                    marginTop: '-45px'
                  }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1 + i * 0.1, 
                    type: "spring", 
                    stiffness: 200,
                    y: {
                      duration: 4 + (i * 0.5),
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 2 + i * 0.3
                    }
                  }}
                >
                  <div className="satellite-icon">{node.icon}</div>
                  <span>{node.label}</span>
                </motion.div>
              </React.Fragment>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
