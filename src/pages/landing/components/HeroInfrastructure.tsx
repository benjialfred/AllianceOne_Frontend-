/**
 * ALLIANCE ONE — HERO INFRASTRUCTURE
 * Visualizes the infrastructure aspect of AO.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, BrainCircuit, Users, Layers, Activity } from 'lucide-react';
import './HeroInfrastructure.css';

export const HeroInfrastructure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-infra">
      <div className="hero-infra-inner">
        
        {/* TEXT CONTENT */}
        <div className="hero-text-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="hero-title">
              Une plateforme.<br />
              Tous vos métiers.<br />
              <span className="text-highlight">Un seul écosystème.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Une infrastructure conçue pour connecter les applications, les données, 
            les équipes, les processus et l'intelligence de votre organisation.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Découvrir Alliance One <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/solutions')}>
              Explorer les solutions
            </button>
          </motion.div>
        </div>

        {/* VISUAL ARCHITECTURE */}
        <div className="hero-visual">
          <div className="architecture-diagram">
            {/* Core Element (AO) */}
            <motion.div 
              className="arch-core"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, type: "spring" }}
            >
              AO
            </motion.div>

            {/* Connection Lines */}
            <svg className="arch-lines" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
              <motion.path 
                d="M200 60 L200 160" 
                stroke="var(--ao-alliance-blue)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 }}
              />
              <motion.path 
                d="M340 200 L240 200" 
                stroke="var(--ao-alliance-blue)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }}
              />
              <motion.path 
                d="M200 340 L200 240" 
                stroke="var(--ao-alliance-blue)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.4 }}
              />
              <motion.path 
                d="M60 200 L160 200" 
                stroke="var(--ao-alliance-blue)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.6 }}
              />
            </svg>

            {/* Nodes */}
            <motion.div className="arch-node node-top" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
              <Users size={20} />
              <span>Organization</span>
            </motion.div>

            <motion.div className="arch-node node-right" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.2 }}>
              <Database size={20} />
              <span>Data</span>
            </motion.div>

            <motion.div className="arch-node node-bottom" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.4 }}>
              <BrainCircuit size={20} />
              <span>Alliance AI</span>
            </motion.div>

            <motion.div className="arch-node node-left" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.6 }}>
              <Layers size={20} />
              <span>Modules</span>
            </motion.div>

            {/* Orbiting Particles */}
            <motion.div 
              className="arch-particle p1"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            >
              <div className="particle-dot"></div>
            </motion.div>
            
            <motion.div 
              className="arch-particle p2"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            >
              <div className="particle-dot"></div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
