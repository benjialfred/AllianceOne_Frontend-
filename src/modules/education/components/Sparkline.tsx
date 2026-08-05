import React from 'react';

interface SparklineProps {
    data: number[]; // Array of grades/averages
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
}

export function Sparkline({ 
    data, 
    width = 100, 
    height = 30, 
    color = 'var(--color-primary)', 
    strokeWidth = 2 
}: SparklineProps) {
    if (!data || data.length < 2) return null;

    // Filter out zeros if they represent "not yet taken" (optional, but good for progression)
    const validData = data.filter(d => d > 0);
    if (validData.length < 2) return null;

    const min = Math.min(...validData);
    const max = Math.max(...validData);
    
    // Add a little padding to the top and bottom (10% of the range)
    const padding = (max - min) * 0.1 || 1; 
    const minD = min - padding;
    const maxD = max + padding;
    const range = maxD - minD;

    const points = validData.map((d, i) => {
        const x = (i / (validData.length - 1)) * width;
        const y = height - ((d - minD) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const lastY = height - ((validData[validData.length - 1] - minD) / range) * height;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Draw a dot at the end */}
            <circle 
                cx={width} 
                cy={lastY} 
                r={strokeWidth * 1.5} 
                fill={color} 
            />
        </svg>
    );
}
