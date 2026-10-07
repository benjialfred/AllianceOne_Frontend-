import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Search, X, MessageCircle, Send,
  TrendingUp, Heart, Share2, Eye, ArrowUpRight, Activity, Layers, CheckCircle2, Sparkles, UserPlus
} from 'lucide-react';
import { FaTwitter } from 'react-icons/fa';
import { apiClient } from '../../core/api/client';
import { Skeleton } from '../../design-system/components/Skeleton';
import { useAuthStore } from '../../core/stores/authStore';
import { useNavigate } from 'react-router-dom';
import './BoostPage.css';

// Import logos
import instaLogo from '../../assets/insta.jfif';
import tiktokLogo from '../../assets/tiktok.png';
import youtubeLogo from '../../assets/youtube.png';
import xLogo from '../../assets/X.jfif';
import telegramLogo from '../../assets/télégram.jfif';
import snapchatLogo from '../../assets/snapshat.jfif';
import pinterestLogo from '../../assets/pinterest.jfif';
import discordLogo from '../../assets/discord.png';
import twitchLogo from '../../assets/twitch.png';
import linkedinLogo from '../../assets/In.png';
import { FaSpotify, FaSoundcloud, FaWhatsapp, FaMusic, FaGamepad, FaPinterest, FaSnapchatGhost, FaTelegramPlane, FaFacebook } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

// Platform icon helper
const getPlatformIcon = (category: string) => {
  const cat = category.toLowerCase();
  const iconStyle = { width: 20, height: 20, borderRadius: '4px', objectFit: 'contain' as const };
  
  if (cat.includes('instagram')) return <img src={instaLogo} alt="Instagram" style={iconStyle} />;
  if (cat.includes('tiktok')) return <img src={tiktokLogo} alt="TikTok" style={iconStyle} />;
  if (cat.includes('youtube')) return <img src={youtubeLogo} alt="YouTube" style={iconStyle} />;
  if (cat.includes('facebook')) return <FaFacebook size={24} color="#1877F2" />;
  if (cat.includes('telegram')) return <FaTelegramPlane size={24} color="#0088cc" />;
  if (cat.includes('twitter') || cat.includes(' x ')) return <img src={xLogo} alt="X" style={iconStyle} />;
  if (cat.includes('snapchat')) return <FaSnapchatGhost size={24} color="#FFFC00" />;
  if (cat.includes('pinterest')) return <FaPinterest size={24} color="#E60023" />;
  if (cat.includes('discord')) return <img src={discordLogo} alt="Discord" style={iconStyle} />;
  if (cat.includes('twitch')) return <img src={twitchLogo} alt="Twitch" style={iconStyle} />;
  if (cat.includes('whatsapp')) return <FaWhatsapp size={24} color="#25D366" />;
  if (cat.includes('threads')) return <SiThreads size={24} color="#ffffff" />;
  if (cat.includes('linkedin')) return <img src={linkedinLogo} alt="LinkedIn" style={iconStyle} />;
  if (cat.includes('spotify')) return <FaSpotify size={24} color="#1DB954" />;
  if (cat.includes('soundcloud')) return <FaSoundcloud size={24} color="#ff5500" />;
  if (cat.includes('deezer')) return <FaMusic size={24} color="#00C7F2" />;
  if (cat.includes('audiomack')) return <FaMusic size={24} color="#FFA500" />;
  if (cat.includes('kick')) return <FaGamepad size={24} color="#53FC18" />;
  
  return <Layers size={24} />;
};

export const BoostPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<any | null>(null);
  
  // Custom Phone Animation State
  const [followersCount, setFollowersCount] = useState(12400);
  const [likesCount, setLikesCount] = useState(4820);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFollowersCount(prev => prev + Math.floor(Math.random() * 5) + 1);
      setLikesCount(prev => prev + Math.floor(Math.random() * 15) + 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Checkout Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [targetLink, setTargetLink] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { ref: containerRef } = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiClient.get<any>('/boost/services/');
      
      // apiClient.get returns res.json() directly. It's not an Axios response wrapper.
      // So 'response' is the data itself.
      const data = response;
      console.log("BOOST SERVICES API RESPONSE:", data);

      if (Array.isArray(data)) {
        setServices(data);
      } else if (data && Array.isArray(data.services)) {
        setServices(data.services);
      } else if (data && Array.isArray(data.results)) {
        setServices(data.results);
      } else if (data && Array.isArray(data.data)) {
        setServices(data.data);
      } else if (data && data.data && Array.isArray(data.data.services)) {
        setServices(data.data.services);
      } else {
        setServices([]);
      }
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setErrorMsg(err.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    services.forEach(s => {
      const cat = s.category || 'Autre';
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesFilter = !selectedCategory || s.category === selectedCategory;
      const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (s.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Drawer handlers
  const openDrawer = (service: any) => {
    setSelectedService(service);
    setQuantity(service.min || 100);
    setTargetLink('');
    setOrderSuccess(false);
    setIsDrawerOpen(true);
  };

  const handleOrder = async () => {
    if (!selectedService || quantity < selectedService.min || !targetLink) return;
    setIsOrdering(true);
    try {
      const svcId = selectedService.service_id || selectedService.service || selectedService.id;
      await apiClient.post('/boost/orders/', {
        service_id: svcId,
        target_link: targetLink,
        quantity: quantity
      });
      setOrderSuccess(true);
      setTimeout(() => {
        setIsDrawerOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Order error', err);
    } finally {
      setIsOrdering(false);
    }
  };

  const currentPrice = selectedService ? (selectedService.rate / 1000) * quantity : 0;

  return (
    <div className="ab-social-universe" ref={containerRef}>
      
      {/* Background Depth */}
      <div className="ab-su-bg-depth"></div>

      {/* HERO SECTION */}
      <section className="ab-su-hero">
        <div className="ab-su-container ab-su-hero-grid">
          
          <motion.div 
            className="ab-su-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
          >
            <motion.div className="ab-su-label">✦ Alliance Boost</motion.div>
            
            <motion.h1 className="ab-su-title">
              Faites grandir <br/>
              <span className="highlight">votre présence sociale.</span>
            </motion.h1>
            
            <motion.p className="ab-su-subtitle">
              Développez votre audience, votre engagement et votre visibilité sur les plateformes que votre communauté utilise déjà.
            </motion.p>
            
            <motion.button 
              className="ab-su-cta"
              onClick={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explorer les services
              <ArrowUpRight size={20} />
            </motion.button>
          </motion.div>

          <div className="ab-su-hero-visual">
            
            {/* Phantom Feed Background */}
            <div className="ab-su-phantom-feed">
              <motion.div 
                className="ab-su-phantom-post"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="ab-su-phantom-post"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Custom Smartphone UI Animation */}
            <motion.div 
              className="ab-su-phone-wrapper"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="ab-su-phone-notch"></div>
              
              <div style={{ width: '100%', height: '100%', padding: '3rem 1.5rem 2rem', background: '#0a0a0a', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Profile Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                    <div style={{ width: 74, height: 74, borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justify: 'center' }}>
                      <Activity size={32} color="#fff" />
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>@studio_alliance</h3>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Croissance Continue</p>
                  </div>
                </div>

                {/* Animated Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <motion.div 
                      style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}
                      key={followersCount}
                      initial={{ scale: 1.1, color: '#34d399' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                    >
                      {(followersCount / 1000).toFixed(1)}K
                    </motion.div>
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Followers</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                    <motion.div 
                      style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}
                      key={likesCount}
                      initial={{ scale: 1.1, color: '#ef4444' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                    >
                      {(likesCount / 1000).toFixed(1)}K
                    </motion.div>
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Likes</div>
                  </div>
                </div>

                {/* Animated Feed Elements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                  <AnimatePresence>
                    {[1, 2, 3].map((item, i) => (
                      <motion.div 
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '12px' }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 6, width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '0.375rem' }}></div>
                          <div style={{ height: 6, width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                        </div>
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 2, delay: i }}
                        >
                          <Heart size={14} color="#ef4444" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Floating Data Objects */}
            <motion.div 
              className="ab-su-float-card ab-su-fc-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="ab-su-fc-icon"><TrendingUp size={16} color="#34d399"/></div>
              <div className="ab-su-fc-text">
                <span className="ab-su-fc-val">12.5K Followers</span>
                <span className="ab-su-fc-lbl">Nouveau palier</span>
              </div>
            </motion.div>

            <motion.div 
              className="ab-su-float-card ab-su-fc-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className="ab-su-fc-icon"><Heart size={16} color="#ef4444"/></div>
              <div className="ab-su-fc-text">
                <span className="ab-su-fc-val">+ 1,204 Likes</span>
                <span className="ab-su-fc-lbl">Activité récente</span>
              </div>
            </motion.div>

            <motion.div 
              className="ab-su-float-card ab-su-fc-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>🔥 Tendance</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PLATFORMS ECOSYSTEM SECTION */}
      <section className="ab-su-section">
        <div className="ab-su-container">
          <div className="ab-su-section-header">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ab-su-section-title"
            >
              Votre audience est partout.<br/>Alliance Boost aussi.
            </motion.h2>
          </div>

          <div className="ab-su-ecosystem">
            <div className="ab-su-eco-center">Alliance Boost</div>
            <div className="ab-su-eco-node node-1">{getPlatformIcon('instagram')} <span>Instagram</span></div>
            <div className="ab-su-eco-node node-2">{getPlatformIcon('tiktok')} <span>TikTok</span></div>
            <div className="ab-su-eco-node node-3">{getPlatformIcon('youtube')} <span>YouTube</span></div>
            <div className="ab-su-eco-node node-4">{getPlatformIcon('x')} <span>X / Twitter</span></div>
            <div className="ab-su-eco-node node-5">{getPlatformIcon('facebook')} <span>Facebook</span></div>
            <div className="ab-su-eco-node node-6">{getPlatformIcon('telegram')} <span>Telegram</span></div>
          </div>
        </div>
      </section>

      {/* ANALYTICS / SOCIAL PROOF SECTION */}
      <section className="ab-su-section">
        <div className="ab-su-container">
          <div className="ab-su-section-header">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ab-su-section-title"
            >
              Voyez votre croissance prendre forme.
            </motion.h2>
          </div>

          <div className="ab-su-analytics-grid">
            <motion.div 
              className="ab-su-ana-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="ab-su-ana-header">
                <div className="ab-su-ana-platform">{getPlatformIcon('instagram')} Instagram</div>
                <div className="ab-su-ana-growth"><TrendingUp size={12}/> +48.5%</div>
              </div>
              <div className="ab-su-ana-metric">12.5K</div>
              <div className="ab-su-ana-label">Nouveaux followers</div>
              <div className="ab-su-ana-visual">
                <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    d="M0,40 L10,30 L20,35 L30,20 L40,25 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0 V40 H0 Z" 
                    fill="url(#grad1)" 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.path 
                    d="M0,40 L10,30 L20,35 L30,20 L40,25 L50,10 L60,15 L70,5 L80,10 L90,2 L100,0" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
              </div>
            </motion.div>

            <motion.div 
              className="ab-su-ana-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="ab-su-ana-header">
                <div className="ab-su-ana-platform">{getPlatformIcon('tiktok')} TikTok</div>
                <div className="ab-su-ana-growth"><TrendingUp size={12}/> +82.4%</div>
              </div>
              <div className="ab-su-ana-metric">84.2K</div>
              <div className="ab-su-ana-label">Vues cumulées</div>
              <div className="ab-su-ana-visual">
                <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    d="M0,40 L10,35 L20,38 L30,25 L40,28 L50,15 L60,18 L70,8 L80,15 L90,5 L100,5 V40 H0 Z" 
                    fill="url(#grad2)" 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                  <motion.path 
                    d="M0,40 L10,35 L20,38 L30,25 L40,28 L50,15 L60,18 L70,8 L80,15 L90,5 L100,5" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
              </div>
            </motion.div>

            <motion.div 
              className="ab-su-ana-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="ab-su-ana-header">
                <div className="ab-su-ana-platform">{getPlatformIcon('youtube')} YouTube</div>
                <div className="ab-su-ana-growth"><TrendingUp size={12}/> +21.4%</div>
              </div>
              <div className="ab-su-ana-metric">4.6K</div>
              <div className="ab-su-ana-label">Likes organiques</div>
              <div className="ab-su-ana-visual">
                <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path 
                    d="M0,40 L15,38 L30,30 L45,35 L60,10 L75,15 L90,5 L100,2 V40 H0 Z" 
                    fill="url(#grad3)" 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                  <motion.path 
                    d="M0,40 L15,38 L30,30 L45,35 L60,10 L75,15 L90,5 L100,2" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section className="ab-su-section" id="catalog-section">
        <div className="ab-su-container">
          <div className="ab-su-section-header">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="ab-su-section-title"
            >
              Passez à l'action.
            </motion.h2>
            <p className="ab-su-section-subtitle">Sélectionnez le service idéal pour booster votre réseau.</p>
          </div>

          {!selectedCategory && !isLoading && !errorMsg ? (
            <div className="ab-su-categories-grid">
              {categoryStats.map(([cat, count], i) => (
                <motion.div 
                  key={i} 
                  className="ab-su-cat-card"
                  onClick={() => setSelectedCategory(cat)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="ab-su-cat-icon">
                    {getPlatformIcon(cat)}
                  </div>
                  <div className="ab-su-cat-info">
                    <h3>{cat.split(' - ')[0]}</h3>
                    <p>{count} services disponibles</p>
                  </div>
                  <div className="ab-su-cat-arrow">
                    <ArrowUpRight size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              {selectedCategory && (
                <div className="ab-su-back-header">
                  <button className="ab-su-back-nav" onClick={() => setSelectedCategory(null)}>
                    <ArrowUpRight size={18} style={{ transform: 'rotate(225deg)' }} />
                    Retour aux plateformes
                  </button>
                  <h3 className="ab-su-selected-cat-title">
                    <span style={{ marginRight: '1rem', display: 'inline-flex' }}>{getPlatformIcon(selectedCategory)}</span> 
                    {selectedCategory.split(' - ')[0]}
                  </h3>
                </div>
              )}

              <div className="ab-su-services-grid">
                {errorMsg && (
                  <div style={{ gridColumn: '1 / -1', padding: '2rem', background: '#ef444420', color: '#ef4444', borderRadius: '12px' }}>
                    Erreur de chargement: {errorMsg}
                  </div>
                )}
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={`skel-${i}`} style={{ height: '240px' }}>
                      <Skeleton width="100%" height="100%" />
                    </div>
                  ))
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service, i) => {
                    const svcId = service.service_id || service.service || service.id || `srv-${i}`;
                    return (
                    <motion.div 
                      key={svcId}
                      className="ab-su-srv-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => openDrawer(service)}
                    >
                      <div className="ab-su-srv-header">
                        <div className="ab-su-srv-avatar">
                          {getPlatformIcon(service.category || '')}
                        </div>
                        <div className="ab-su-srv-badge">ID: {svcId}</div>
                      </div>
                      
                      <div className="ab-su-srv-title">{service.name}</div>
                      <div className="ab-su-srv-desc">
                        Livraison instantanée • Haute qualité
                      </div>

                      <div className="ab-su-srv-stats">
                        <div className="ab-su-srv-stat">
                          <span className="ab-su-srv-stat-val">{service.min}</span>
                          <span className="ab-su-srv-stat-lbl">Minimum</span>
                        </div>
                        <div className="ab-su-srv-stat">
                          <span className="ab-su-srv-stat-val">{service.max}</span>
                          <span className="ab-su-srv-stat-lbl">Maximum</span>
                        </div>
                      </div>

                      <div className="ab-su-srv-footer">
                        <div className="ab-su-srv-price">
                          {Math.round(service.rate)} <span>XAF / 1000</span>
                        </div>
                        <div className="ab-su-srv-action">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </motion.div>
                    );
                  })
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#a1a1aa' }}>
                    Aucun service trouvé pour cette recherche.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DRAWER CHECKOUT */}
      <AnimatePresence>
        {isDrawerOpen && selectedService && (
          <motion.div 
            className="ab-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsDrawerOpen(false);
            }}
          >
            <motion.div 
              className="ab-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="ab-drawer-header">
                <div className="ab-drawer-title">Configurer l'engagement</div>
                <button className="ab-drawer-close" onClick={() => setIsDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              {orderSuccess ? (
                <div className="ab-drawer-content" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <CheckCircle2 size={64} color="#34d399" style={{ marginBottom: '1rem' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Croissance lancée !</h3>
                  <p style={{ color: '#a1a1aa' }}>Votre commande est en cours de traitement.</p>
                </div>
              ) : (
                <>
                  <div className="ab-drawer-content">
                    <div className="ab-drawer-service-info">
                      <h3>{selectedService.name}</h3>
                      <p>{selectedService.category}</p>
                    </div>

                    <div className="ab-form-group">
                      <label className="ab-label">Lien du compte / publication</label>
                      <input 
                        type="url" 
                        className="ab-input"
                        placeholder="https://..."
                        value={targetLink}
                        onChange={(e) => setTargetLink(e.target.value)}
                      />
                    </div>

                    <div className="ab-form-group">
                      <label className="ab-label">
                        Quantité souhaitée
                        <span className="ab-label-hint">Min: {selectedService.min} - Max: {selectedService.max}</span>
                      </label>
                      <input 
                        type="number" 
                        className="ab-input"
                        min={selectedService.min}
                        max={selectedService.max}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="ab-drawer-footer">
                    <div className="ab-summary">
                      <div className="ab-summary-row">
                        <span>Coût par 1000</span>
                        <span>{selectedService.rate} XAF</span>
                      </div>
                      <div className="ab-summary-row total">
                        <span>Total estimé</span>
                        <span className="ab-total-price">{Math.round(currentPrice)} XAF</span>
                      </div>
                    </div>

                    <button 
                      className="ab-btn-primary"
                      disabled={isOrdering || quantity < selectedService.min || !targetLink}
                      onClick={handleOrder}
                    >
                      {isOrdering ? 'Traitement...' : 'Lancer la croissance'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
