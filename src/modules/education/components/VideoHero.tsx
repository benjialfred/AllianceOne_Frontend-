import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoHeroProps {
    videoSrc?: string;
    fallbackImage?: string;
    title: string;
    subtitle: string;
    date: string;
    weather?: string;
    stats: {
        studentsPresent: number;
        teachersPresent: number;
        ongoingClasses: number;
        todayEvents: number;
    };
    actions: React.ReactNode;
}

export const VideoHero: React.FC<VideoHeroProps> = ({
    videoSrc,
    fallbackImage,
    title,
    subtitle,
    date,
    weather,
    stats,
    actions
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isVideoError, setIsVideoError] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [videoSrc]);

    const handleVideoLoaded = () => {
        setIsVideoLoaded(true);
    };

    const handleVideoError = () => {
        setIsVideoError(true);
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--spacing-8)',
            boxShadow: 'var(--shadow-lg)'
        }}>
            {/* Background Image / Video Fallback */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${fallbackImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
            }} />

            {/* Video Engine */}
            {!isVideoError && videoSrc && (
                <motion.video
                    ref={videoRef}
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={handleVideoLoaded}
                    onError={handleVideoError}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: isVideoLoaded ? 1 : 1.1, opacity: isVideoLoaded ? 1 : 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                    }}
                />
            )}

            {/* Dark Overlay for contrast with subtle animated gradient */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.3) 100%)',
                zIndex: 2
            }} />

            {/* Content Layout */}
            <div style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                justifyContent: 'space-between',
                height: '100%',
                padding: 'var(--spacing-8)'
            }}>
                {/* Left Side: Info & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div style={{ display: 'flex', gap: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--spacing-3)', fontWeight: 'var(--font-weight-medium)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            <span>{date}</span>
                            {weather && <span>• {weather}</span>}
                        </div>
                        <h1 style={{ 
                            fontSize: '3.5rem', 
                            fontWeight: 'var(--font-weight-bold)', 
                            letterSpacing: '-0.02em', 
                            lineHeight: 1.1, 
                            marginBottom: 'var(--spacing-3)', 
                            color: '#fff',
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            {title}
                        </h1>
                        <p style={{ 
                            fontSize: 'var(--font-size-lg)', 
                            color: 'rgba(255,255,255,0.9)', 
                            maxWidth: '600px',
                            fontWeight: 'var(--font-weight-normal)',
                            lineHeight: 1.6,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Live Stats Glassmorphism with Stagger */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1, delayChildren: 0.5 }
                            }
                        }}
                        style={{
                            display: 'flex',
                            gap: 'var(--spacing-4)',
                        }}
                    >
                        {[
                            { label: 'Élèves Présents', value: stats.studentsPresent },
                            { label: 'Ens. Présents', value: stats.teachersPresent },
                            { label: 'Cours en cours', value: stats.ongoingClasses },
                            { label: 'Événements', value: stats.todayEvents }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                                }}
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(16px)',
                                    padding: 'var(--spacing-4) var(--spacing-6)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    cursor: 'default'
                                }}
                            >
                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 'var(--font-weight-bold)', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                    {stat.value.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Side: Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-3)',
                        width: '260px',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(20px)',
                        padding: 'var(--spacing-5)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ 
                            fontSize: '0.75rem', 
                            color: 'rgba(255,255,255,0.6)', 
                            marginBottom: 'var(--spacing-4)', 
                            fontWeight: 'var(--font-weight-semibold)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            Actions Rapides
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                            {actions}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
