import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MetricCounterProps {
  value: string | number;
  label?: string;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

/**
 * METRIC COUNTER — ARCHITECTURAL DATA TELEMETRY
 * Smoothly increments significant metrics without jarring flashes.
 */
export const MetricCounter: React.FC<MetricCounterProps> = ({
  value,
  label,
  trend,
  trendPositive = true,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<string | number>(shouldReduceMotion ? value : 0);

  // Parse if numeric
  const numericMatch = typeof value === 'string' ? value.replace(/\s/g, '').match(/^([+-]?\d+(?:\.\d+)?)(.*)$/) : null;
  const targetNum = numericMatch ? parseFloat(numericMatch[1]) : typeof value === 'number' ? value : null;
  const suffix = numericMatch ? numericMatch[2] : '';

  useEffect(() => {
    if (shouldReduceMotion || targetNum === null || isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const durationMs = 800;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // EaseOutCubic: 1 - Math.pow(1 - progress, 3)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (targetNum - start) * easedProgress);

      const formattedNumber = currentVal.toLocaleString('fr-FR');
      setDisplayValue(`${formattedNumber}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        const finalFormatted = targetNum.toLocaleString('fr-FR');
        setDisplayValue(`${finalFormatted}${suffix}`);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, shouldReduceMotion]);

  return (
    <div 
      className={`ao-metric-card ${className}`}
      style={{
        background: 'var(--color-surface-hover, rgba(255, 255, 255, 0.03))',
        border: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.08))',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: '140px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span 
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary, #f8fafc)',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {displayValue}
        </span>

        {trend && (
          <span 
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
              background: trendPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: trendPositive ? '#34d399' : '#f87171'
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {label && (
        <span 
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-muted, #94a3b8)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
