import React from 'react';
import type { CurrencyCode } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: '€',
  USD: '$',
  XOF: 'F.CFA',
  GBP: '£',
  CAD: '$ CA',
  CHF: 'CHF'
};

export const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; label: string; bg: string; color: string }> = {
  EUR: { symbol: '€', label: 'EUR (€)', bg: '#eff6ff', color: '#1d4ed8' },
  USD: { symbol: '$', label: 'USD ($)', bg: '#ecfdf5', color: '#047857' },
  XOF: { symbol: 'F.CFA', label: 'XOF (CFA)', bg: '#fffbeb', color: '#b45309' },
  GBP: { symbol: '£', label: 'GBP (£)', bg: '#fdf2f8', color: '#be185d' },
  CAD: { symbol: '$ CA', label: 'CAD ($)', bg: '#fef2f2', color: '#b91c1c' },
  CHF: { symbol: 'CHF', label: 'CHF', bg: '#f5f3ff', color: '#6d28d9' },
};

export const formatMoney = (amount: number | string, currency: CurrencyCode = 'EUR'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  
  if (currency === 'XOF') {
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(num)} F.CFA`;
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency === 'CAD' ? 'CAD' : (currency === 'CHF' ? 'CHF' : currency),
    maximumFractionDigits: 2
  }).format(num);
};

export const CurrencyBadge: React.FC<{ currency: CurrencyCode; size?: 'sm' | 'md' }> = ({ currency, size = 'sm' }) => {
  const config = CURRENCY_CONFIG[currency] || { symbol: currency, label: currency, bg: '#f1f5f9', color: '#475569' };
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: 700,
      padding: size === 'sm' ? '2px 6px' : '3px 8px',
      borderRadius: '6px',
      backgroundColor: config.bg,
      color: config.color,
      border: `1px solid ${config.color}30`,
      letterSpacing: '0.02em'
    }}>
      {config.symbol} {currency}
    </span>
  );
};
