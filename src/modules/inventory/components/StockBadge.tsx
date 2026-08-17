import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StockBadgeProps {
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | string;
  quantity?: number;
  unitSymbol?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status, quantity, unitSymbol = 'u' }) => {
  if (status === 'OUT_OF_STOCK' || (quantity !== undefined && quantity <= 0)) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fecaca',
      }}>
        <AlertCircle size={13} />
        Rupture {quantity !== undefined ? `(0 ${unitSymbol})` : ''}
      </span>
    );
  }

  if (status === 'LOW_STOCK') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: '#fef3c7',
        color: '#d97706',
        border: '1px solid #fde68a',
      }}>
        <AlertTriangle size={13} />
        Stock Faible {quantity !== undefined ? `(${quantity} ${unitSymbol})` : ''}
      </span>
    );
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: '#ecfdf5',
      color: '#059669',
      border: '1px solid #a7f3d0',
    }}>
      <CheckCircle2 size={13} />
      En Stock {quantity !== undefined ? `(${quantity} ${unitSymbol})` : ''}
    </span>
  );
};
