/**
 * ALLIANCE ONE — DEVICE SHOWCASE
 * Cinematic floating device mockups showing the app in action.
 * MacBook + iPhone with parallax scroll animations.
 */
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import desktopScreen from '../../../assets/screen-desktop.jpg';
import mobileScreen from '../../../assets/screen-mobile.jpg';
import './DeviceShowcase.css';

export const DeviceShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms
  const laptopY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const laptopRotate = useTransform(scrollYProgress, [0, 0.5, 1], [3, 0, -2]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [100, -60]);
  const phoneRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 2, 5]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section className="device-showcase" ref={containerRef}>
      <div className="device-showcase-bg">
        <div className="showcase-glow showcase-glow-1" />
        <div className="showcase-glow showcase-glow-2" />
        <div className="showcase-glow showcase-glow-3" />
      </div>

      <motion.div className="device-showcase-inner" style={{ scale: bgScale }}>
        {/* Section Header */}
        <motion.div 
          className="showcase-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="showcase-kicker">L'EXPÉRIENCE ALLIANCE ONE</span>
          <h2 className="showcase-heading">
            Votre organisation.<br />
            <span className="showcase-heading-glow">Au bout des doigts.</span>
          </h2>
          <p className="showcase-sub">
            Que vous soyez sur votre ordinateur au bureau ou sur votre téléphone en déplacement —
            Alliance One vous suit partout avec une expérience premium et unifiée.
          </p>
        </motion.div>

        {/* Device Stage */}
        <div className="device-stage">
          {/* === LAPTOP MOCKUP === */}
          <motion.div 
            className="device-laptop"
            style={{ y: laptopY, rotateZ: laptopRotate }}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="laptop-frame">
              {/* Screen bezel */}
              <div className="laptop-screen">
                <div className="laptop-notch">
                  <div className="laptop-camera" />
                </div>
                <div className="laptop-screen-content">
                  <img src={desktopScreen} alt="Alliance One Dashboard" className="device-screenshot" />
                  {/* Animated scan line */}
                  <div className="screen-scanline" />
                </div>
              </div>
              {/* Keyboard base */}
              <div className="laptop-base">
                <div className="laptop-trackpad" />
              </div>
              <div className="laptop-bottom-edge" />
            </div>

            {/* Floating labels */}
            <motion.div 
              className="device-float-label label-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <span className="float-label-dot" />
              <span>Dashboard complet</span>
            </motion.div>

            <motion.div 
              className="device-float-label label-top"
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0 }}
            >
              <span className="float-label-dot green" />
              <span>Données temps réel</span>
            </motion.div>
          </motion.div>

          {/* === PHONE MOCKUP === */}
          <motion.div 
            className="device-phone"
            style={{ y: phoneY, rotateZ: phoneRotate }}
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="phone-frame">
              <div className="phone-dynamic-island" />
              <div className="phone-screen-content">
                <img src={mobileScreen} alt="Alliance One Mobile" className="device-screenshot" />
                <div className="screen-scanline" />
              </div>
              <div className="phone-home-indicator" />
            </div>

            {/* Floating labels */}
            <motion.div 
              className="device-float-label label-right"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              <span className="float-label-dot amber" />
              <span>Mobile natif</span>
            </motion.div>

            <motion.div 
              className="device-float-label label-bottom-right"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
            >
              <span className="float-label-dot purple" />
              <span>Offline-first</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div 
          className="showcase-stats-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: 'Responsive', value: '100%' },
            { label: 'Temps de chargement', value: '< 1.2s' },
            { label: 'Mode sombre', value: 'Natif' },
            { label: 'PWA installable', value: 'Oui' },
          ].map((s) => (
            <div key={s.label} className="showcase-stat">
              <span className="stat-val">{s.value}</span>
              <span className="stat-lbl">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
