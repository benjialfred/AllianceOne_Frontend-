import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from './Card';

export interface PremiumKPICardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: number; // percentage (e.g. 12.5 for +12.5%)
    trendLabel?: string; // "vs le mois dernier"
    color?: string; // Hex color or CSS variable
    data?: any[]; // For the sparkline chart
    delay?: number; // Animation delay
}

export const PremiumKPICard: React.FC<PremiumKPICardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendLabel,
    color = 'var(--color-accent-500)',
    data,
    delay = 0
}) => {
    // Generate some fake sparkline data if none provided but we want the aesthetic
    const chartData = data || Array.from({ length: 10 }).map((_) => ({ value: Math.random() * 100 }));
    
    const isPositive = trend !== undefined && trend > 0;
    const isNegative = trend !== undefined && trend < 0;
    
    // Light versions of the theme color for backgrounds (fallback for hex colors if needed, but since we use variables mostly, we will use opacity)
    const iconBgStyle = color.startsWith('var') ? { backgroundColor: color, opacity: 0.1 } : { backgroundColor: `${color}15` };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            style={{ height: '100%' }}
        >
            <Card style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header: Title + Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>
                        {title}
                    </span>
                    <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 'var(--radius-md)', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                        position: 'relative'
                    }}>
                        <div style={{ ...iconBgStyle, position: 'absolute', inset: 0, borderRadius: 'inherit' }} />
                        <Icon size={20} style={{ position: 'relative', zIndex: 1 }} />
                    </div>
                </div>

                {/* Value */}
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-3)' }}>
                    {value}
                </div>

                {/* Trend & Sparkline Layout */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
                    
                    {/* Trend Info */}
                    {trend !== undefined && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)' }}>
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: isPositive ? 'var(--color-success-text)' : isNegative ? 'var(--color-danger-text)' : 'var(--color-text-tertiary)',
                                backgroundColor: isPositive ? 'var(--color-success-bg)' : isNegative ? 'var(--color-danger-bg)' : 'var(--color-surface-hover)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                            }}>
                                {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
                                {Math.abs(trend)}%
                            </span>
                            {trendLabel && <span style={{ color: 'var(--color-text-tertiary)' }}>{trendLabel}</span>}
                        </div>
                    )}

                    {/* Micro Sparkline */}
                    <div style={{ width: '80px', height: '40px', opacity: 0.6 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke={color} 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill={`url(#gradient-${title.replace(/\s+/g, '')})`} 
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
