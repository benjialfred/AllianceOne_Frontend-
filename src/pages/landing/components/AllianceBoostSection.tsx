import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { TrendingUp, Smartphone, PlayCircle, Camera, MessageCircle, Wifi, Battery, Terminal, Activity, Globe } from 'lucide-react';
import { FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import instaLogo from '../../../assets/insta.jfif';
import youtubeLogo from '../../../assets/youtube.png';
import tiktokLogo from '../../../assets/tiktok.png';
import xLogo from '../../../assets/X.jfif';
import telegramLogo from '../../../assets/télégram.jfif';
import patternBg from '../../../assets/social_pattern.jpg';
import './AllianceBoostSection.css';

export const AllianceBoostSection: React.FC = () => {
  const navigate = useNavigate();
  
  const [liveViews, setLiveViews] = useState(1204500);
  const [liveFollowers, setLiveFollowers] = useState(32100);
  const [liveInteractions, setLiveInteractions] = useState(84500);

  const terminalLogs = [
    "[SYSTEM] Connexion réseau sécurisée établie.",
    "[API] Hook Instagram activé (Latence: 12ms)",
    "[BOOST] Injection de followers en cours...",
    "[NODE] Routage optimal via Francfort",
    "[SUCCESS] Batch 1/5 livré avec succès.",
    "[API] Hook TikTok activé (Latence: 8ms)",
    "[BOOST] Distribution de vues démarrée...",
    "[SYSTEM] Auto-scaling des serveurs: OK",
    "[DATA] Mise à jour des analytics en direct..."
  ];
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [isBurstMode, setIsBurstMode] = useState(false);

  useEffect(() => {
    const speed = isBurstMode ? 50 : 1500;
    const interval = setInterval(() => {
      setLiveViews(v => v + Math.floor(Math.random() * (isBurstMode ? 5000 : 50)));
      setLiveFollowers(f => f + Math.floor(Math.random() * (isBurstMode ? 500 : 5)));
      setLiveInteractions(i => i + Math.floor(Math.random() * (isBurstMode ? 1500 : 15)));
    }, speed);
    
    return () => clearInterval(interval);
  }, [isBurstMode]);

  useEffect(() => {
    const tInterval = setInterval(() => {
      setTerminalIndex(i => (i + 1) % terminalLogs.length);
    }, isBurstMode ? 500 : 2000);
    
    return () => clearInterval(tInterval);
  }, [terminalLogs.length, isBurstMode]);

  // 3D Parallax State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate between -15 and 15 degrees
    mouseX.set(((x - centerX) / centerX) * 15);
    mouseY.set(-((y - centerY) / centerY) * 15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="ab-landing-section" style={{ position: 'relative' }}>
      {/* Social Pattern Background */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${patternBg})`,
          backgroundSize: '800px',
          backgroundRepeat: 'repeat',
          opacity: 0.15,
          mixBlendMode: 'multiply',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      
      <div className="ab-landing-glow" style={{ zIndex: 1 }}></div>
      
      <div className="ab-landing-container" style={{ zIndex: 2, position: 'relative' }}>
        
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="ab-landing-content"
        >
          <div className="ab-landing-badge">
            <TrendingUp size={16} />
            <span>Nouveau Module</span>
          </div>
          
          <h2 className="ab-landing-title">
            Alliance <span>Boost</span>
          </h2>
          
          <p className="ab-landing-desc">
            Propulsez votre visibilité digitale à un niveau supérieur. Que vous soyez une marque, un créateur de contenu ou une entreprise, Alliance Boost vous donne accès à des services d'engagement social immédiats. Des milliers de likes, d'abonnés et de vues à portée de clic.
          </p>
          
          <div className="ab-landing-features">
            <div className="ab-landing-feature">
              <div className="ab-landing-icon" style={{ color: '#c084fc' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <h4>Croissance Éclair</h4>
                <p>Augmentez vos statistiques instantanément.</p>
              </div>
            </div>
            <div className="ab-landing-feature">
              <div className="ab-landing-icon" style={{ color: '#60a5fa' }}>
                <Smartphone size={24} />
              </div>
              <div>
                <h4>Multi-Plateformes</h4>
                <p>TikTok, Instagram, YouTube et plus.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/boost')}
            className="ab-landing-cta"
          >
            Explorer le Catalogue
            <TrendingUp size={18} />
          </button>
        </motion.div>

        {/* Right Visual Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="ab-right-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200, position: 'relative' }}
        >
          {/* Matrix Data Streams Background */}
          <div style={{ position: 'absolute', inset: -150, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                style={{ position: 'absolute', left: `${Math.random() * 100}%`, top: '-20%', width: '2px', height: '150px', background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.6), transparent)', filter: 'blur(1px)' }}
                animate={{ y: ['0vh', '120vh'] }}
                transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, delay: Math.random() * 3, ease: "linear" }}
              />
            ))}
          </div>

          <motion.div 
            className="ab-landing-visual-mockups"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseEnter={() => setIsBurstMode(true)}
            onMouseLeave={() => setIsBurstMode(false)}
          >
            {/* Floating Burst Particles */}
            {isBurstMode && [...Array(10)].map((_, i) => (
              <motion.div 
                key={`p-${i}`}
                style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', pointerEvents: 'none', zIndex: 100 }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, scale: 0 }}
                transition={{ duration: 1, ease: "easeOut", repeat: Infinity, delay: Math.random() }}
              />
            ))}

            {/* The Laptop */}
            <motion.div 
              className="ab-mockup-laptop"
              style={{ transform: 'translateZ(50px)' }}
            >
              <div className="ab-laptop-screen" style={{ position: 'relative' }}>
                {/* Screen Glare Effect */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.01) 35%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', zIndex: 50 }}></div>
                
                <div className="ab-laptop-ui">
                  <div className="ab-lui-sidebar" style={{ background: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(10px)', justifyContent: 'flex-start', paddingTop: '15%' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '30%', justifyContent: 'center', width: '100%' }}>
                      <div className="ab-lui-dot" style={{ background: '#ef4444' }}></div>
                      <div className="ab-lui-dot" style={{ background: '#eab308' }}></div>
                      <div className="ab-lui-dot" style={{ background: '#22c55e' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#71717a', alignItems: 'center' }}>
                      <Activity size={12} color="#10b981" />
                      <Globe size={12} />
                      <Terminal size={12} />
                    </div>
                  </div>
                  <div className="ab-lui-main" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 80%)', position: 'relative' }}>
                    {/* Radar Background */}
                    <div style={{ position: 'absolute', right: '4%', top: '4%', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.2)', overflow: 'hidden', opacity: 0.5 }}>
                       <motion.div 
                         style={{ width: '50%', height: '50%', borderRight: '1px solid #10b981', transformOrigin: 'bottom right', background: 'linear-gradient(45deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.4) 100%)' }}
                         animate={{ rotate: 360 }}
                         transition={{ duration: isBurstMode ? 0.5 : 3, repeat: Infinity, ease: "linear" }}
                       />
                    </div>

                    <div className="ab-lui-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}></div>
                        <h4 style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>Alliance Operations Center</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginRight: '45px' }}>
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: isBurstMode ? 0.2 : 2 }} style={{ fontSize: '0.45rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 'bold' }}>● SYSTEM SECURE</motion.span>
                      </div>
                    </div>

                    <div className="ab-lui-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5%' }}>
                      <motion.div className="ab-lui-stat" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #3b82f6, transparent)' }}></div>
                        <div style={{ fontSize: '0.45rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vues Globales</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff', textShadow: '0 0 15px rgba(59,130,246,0.4)' }}>{liveViews.toLocaleString()}</div>
                        <div style={{ fontSize: '0.45rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={8}/> +45.2%</div>
                      </motion.div>
                      <motion.div className="ab-lui-stat" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #8b5cf6, transparent)' }}></div>
                        <div style={{ fontSize: '0.45rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interactions</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff' }}>{liveInteractions.toLocaleString()}</div>
                        <div style={{ fontSize: '0.45rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={8}/> +12.8%</div>
                      </motion.div>
                      <motion.div className="ab-lui-stat" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #ec4899, transparent)' }}></div>
                        <div style={{ fontSize: '0.45rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Followers</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff' }}>{liveFollowers.toLocaleString()}</div>
                        <div style={{ fontSize: '0.45rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={8}/> +8.4%</div>
                      </motion.div>
                    </div>

                    <div className="ab-lui-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '5%', flex: 1, marginTop: '8%' }}>
                       <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '4%', display: 'flex', flexDirection: 'column', gap: '5%', position: 'relative', overflow: 'hidden' }}>
                         <div style={{ fontSize: '0.45rem', color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 600 }}>Trafic Réseau (Live)</div>
                         <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '2px' }}>
                           {[...Array(24)].map((_, i) => (
                             <motion.div 
                               key={i}
                               style={{ width: '100%', background: `linear-gradient(0deg, ${i % 4 === 0 ? '#8b5cf6' : '#3b82f6'} 0%, #60a5fa 100%)`, borderRadius: '2px 2px 0 0', boxShadow: '0 0 5px rgba(59,130,246,0.5)' }}
                               animate={{ height: ['15%', `${Math.random() * 70 + 30}%`, '15%'] }}
                               transition={{ duration: Math.random() * 1 + 0.5, repeat: Infinity, ease: "easeInOut" }}
                             />
                           ))}
                         </div>
                       </div>
                       
                       {/* Terminal Log Window */}
                       <div style={{ background: '#09090b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '5%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                          <div style={{ fontSize: '0.4rem', color: '#a1a1aa', borderBottom: '1px solid #27272a', paddingBottom: '2px', marginBottom: '4px' }}>TERMINAL // ROOT</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: '"Fira Code", monospace', fontSize: '0.4rem', color: '#10b981' }}>
                            {terminalLogs.slice(Math.max(0, terminalIndex - 3), terminalIndex + 1).map((log, idx) => (
                              <motion.div key={terminalIndex - idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                {log}
                              </motion.div>
                            ))}
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>_</motion.div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ab-laptop-base">
                <div className="ab-laptop-trackpad"></div>
              </div>
            </motion.div>

            {/* The Smartphone */}
            <motion.div 
              className="ab-mockup-phone"
              style={{ transform: 'translateZ(100px)' }}
            >
              <div className="ab-phone-notch"></div>
              {/* Screen Glare */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)', pointerEvents: 'none', zIndex: 50 }}></div>
              
              <div className="ab-phone-ui" style={{ background: '#09090b', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 60%)', position: 'relative', overflow: 'hidden' }}>
                
                {/* Phone Biometric Laser Scanner */}
                <motion.div 
                  style={{ position: 'absolute', left: 0, right: 0, height: '30px', background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.2) 90%, rgba(16,185,129,0.8) 100%)', borderBottom: '1px solid #10b981', boxShadow: '0 5px 15px rgba(16,185,129,0.4)', zIndex: 60, pointerEvents: 'none' }}
                  animate={{ top: ['-10%', '110%', '-10%'] }}
                  transition={{ duration: isBurstMode ? 1 : 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Status Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '0.4rem', color: '#fff', fontWeight: 600 }}>
                  <span>9:41</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Wifi size={8} />
                    <Battery size={8} />
                  </div>
                </div>

                <div className="ab-pui-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.5px', color: '#fff', margin: 0, textTransform: 'uppercase' }}>Notifications Push</h3>
                  <div style={{ position: 'absolute', right: 12 }}>
                    <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </div>
                </div>
                
                <div className="ab-pui-feed" style={{ padding: '8px', gap: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {[
                    { name: "Instagram", desc: "+250 Followers ajoutés", icon: instaLogo, color: "#e1306c" },
                    { name: "TikTok", desc: "10K Vues en distribution", icon: tiktokLogo, color: "#00f2fe" },
                    { name: "YouTube", desc: "+50 Likes organiques validés", icon: youtubeLogo, color: "#ff0000" },
                    { name: "X / Twitter", desc: "+100 Retweets programmés", icon: xLogo, color: "#1da1f2" },
                    { name: "Telegram", desc: "Nouveau membre VIP", icon: telegramLogo, color: "#0088cc" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="ab-pui-item"
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.8, repeat: Infinity, repeatDelay: 6 }}
                      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                    >
                      <div style={{ position: 'relative' }}>
                        <img src={item.icon} alt={item.name} style={{ width: 20, height: 20, borderRadius: '6px', objectFit: 'cover', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }} />
                        <div style={{ position: 'absolute', bottom: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: '#10b981', border: '2px solid #18181b' }}></div>
                      </div>
                      <div className="ab-pui-text" style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#fff' }}>{item.name}</span>
                        <span style={{ fontSize: '0.45rem', color: item.color, fontWeight: 500 }}>{item.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Platforms around the mockups */}
            <div className="ab-visual-platforms-floating" style={{ transformStyle: 'preserve-3d', zIndex: 100 }}>
              {[
                { img: instaLogo, name: 'Instagram', x: '-5%', y: '15%', z: 120, dur: 3 },
                { img: youtubeLogo, name: 'YouTube', x: '80%', y: '10%', z: 80, dur: 3.5 },
                { img: tiktokLogo, name: 'TikTok', x: '5%', y: '75%', z: 150, dur: 4 },
                { img: xLogo, name: 'X / Twitter', x: '75%', y: '65%', z: 100, dur: 3.2 },
                { img: telegramLogo, name: 'Telegram', x: '45%', y: '-5%', z: 180, dur: 4.5 },
              ].map((platform, idx) => (
                <motion.div 
                  key={idx}
                  className="ab-platform-pill-floating"
                  style={{ left: platform.x, top: platform.y, z: platform.z }}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ 
                    y: { duration: platform.dur, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }
                  }}
                  whileHover={{ scale: 1.15, zIndex: 300 }}
                >
                  <img src={platform.img} alt={platform.name} style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{platform.name}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Ambient Background Glow */}
            <div className="ab-mockups-glow"></div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
};
