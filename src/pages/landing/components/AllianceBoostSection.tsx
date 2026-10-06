import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Smartphone } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTiktok, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const AllianceBoostSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-[#0a0a0a] overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold text-sm mb-6">
              <TrendingUp size={16} />
              Nouveau Module
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Alliance <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Boost</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Propulsez votre visibilité digitale à un niveau supérieur. Que vous soyez une marque, un créateur de contenu ou une entreprise, Alliance Boost vous donne accès à des services d'engagement social immédiats. Des milliers de likes, d'abonnés et de vues à portée de clic.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-purple-400">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Croissance Éclair</h4>
                  <p className="text-sm text-gray-500">Augmentez vos statistiques instantanément.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-blue-400">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Multi-Plateformes</h4>
                  <p className="text-sm text-gray-500">TikTok, Instagram, YouTube et plus.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/boost')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-300 flex items-center gap-2"
            >
              Explorer le Catalogue
              <TrendingUp size={20} />
            </button>
          </motion.div>

          {/* Right Visual Elements */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              
              {/* CSS Animated Floating elements */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[20%] left-[20%] w-24 h-24 bg-purple-500/20 rounded-2xl border border-purple-500/30 animate-[spin_10s_linear_infinite] backdrop-blur-xl"></div>
                <div className="absolute bottom-[20%] right-[20%] w-32 h-32 bg-blue-500/20 rounded-full border border-blue-500/30 animate-[pulse_4s_ease-in-out_infinite] backdrop-blur-xl"></div>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Engagements Disponibles</h3>
                <p className="text-gray-400 mb-8">Plus de 200 services pour dominer les réseaux sociaux.</p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { icon: FaInstagram, name: 'Instagram', color: '#E1306C' },
                    { icon: FaYoutube, name: 'YouTube', color: '#FF0000' },
                    { icon: FaTiktok, name: 'TikTok', color: '#00F2FE' },
                    { icon: FaTwitter, name: 'X / Twitter', color: '#1DA1F2' },
                    { icon: FaFacebook, name: 'Facebook', color: '#1877F2' },
                  ].map((platform, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="flex flex-col items-center gap-2 bg-gray-800/80 p-4 rounded-2xl border border-gray-700/50 backdrop-blur-md"
                    >
                      <platform.icon size={32} style={{ color: platform.color }} />
                      <span className="text-xs font-semibold text-gray-300">{platform.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
