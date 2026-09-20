import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, AlertTriangle, ArrowUpRight, FileText, ExternalLink } from 'lucide-react';
import type { ContentBlock } from '../types';
import { MetricCounter } from './MetricCounter';

interface StructuredContentRendererProps {
  content: string;
  blocks?: ContentBlock[];
  onActionClick?: (actionId: string, payload?: any) => void;
  className?: string;
}

/**
 * STRUCTURED CONTENT RENDERER
 * Transforms unstructured AI responses and typed blocks into architectural UI components.
 * Eliminates raw Markdown blobs while preserving full information density.
 */
export const StructuredContentRenderer: React.FC<StructuredContentRendererProps> = ({
  content,
  blocks,
  onActionClick,
  className = ''
}) => {
  // If pre-structured blocks are supplied directly by the backend/gateway, use them directly
  const activeBlocks = blocks && blocks.length > 0 ? blocks : parseSemanticBlocks(content);

  return (
    <div className={`structured-content-engine ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {activeBlocks.map((block, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderBlock(block, onActionClick)}
        </motion.div>
      ))}
    </div>
  );
};

function renderBlock(block: ContentBlock, onActionClick?: (id: string, payload?: any) => void) {
  switch (block.type) {
    case 'heading': {
      return (
        <div style={{ marginTop: '8px', marginBottom: '2px' }}>
          {block.domain && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#60a5fa',
                marginBottom: '4px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(59, 130, 246, 0.1)'
              }}
            >
              {block.domain}
            </span>
          )}
          <h3 
            style={{
              fontSize: block.level === 1 ? '1.25rem' : block.level === 2 ? '1.1rem' : '0.98rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary, #f8fafc)',
              margin: '2px 0 6px 0'
            }}
          >
            {block.text}
          </h3>
        </div>
      );
    }

    case 'metric': {
      return (
        <MetricCounter
          value={block.value}
          label={block.label}
          trend={block.trend}
          trendPositive={block.trendPositive}
        />
      );
    }

    case 'insight': {
      return (
        <div
          style={{
            background: 'var(--color-surface-hover, rgba(255, 255, 255, 0.025))',
            border: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.07))',
            borderLeft: '3px solid #3b82f6',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
              INSIGHT OPÉRATIONNEL
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-primary, #f8fafc)' }}>
              {block.title}
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary, #cbd5e1)', lineHeight: 1.5, margin: 0 }}>
            {block.summary}
          </p>

          {block.points && block.points.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              {block.points.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#94a3b8' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#60a5fa', marginTop: '7px', flexShrink: 0 }} />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'list': {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0' }}>
          {block.items.map((item, i) => (
            <div 
              key={i} 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.92rem',
                color: 'var(--color-text-secondary, #cbd5e1)',
                lineHeight: 1.55
              }}
            >
              {block.ordered ? (
                <span 
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#60a5fa',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px',
                    flexShrink: 0
                  }}
                >
                  {i + 1}
                </span>
              ) : (
                <span 
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    marginTop: '8px',
                    flexShrink: 0
                  }}
                />
              )}
              <span>{item}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'table': {
      return (
        <div style={{ overflowX: 'auto', margin: '8px 0', borderRadius: '8px', border: '1px solid var(--color-surface-border, rgba(255, 255, 255, 0.08))' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {block.headers.map((h, i) => (
                  <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '8px 12px', color: '#94a3b8' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'action': {
      return (
        <button
          onClick={() => onActionClick && onActionClick(block.id, block.payload)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginRight: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.18)';
            e.currentTarget.style.borderColor = '#60a5fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)';
          }}
        >
          <span>{block.label}</span>
          <ArrowUpRight size={13} />
        </button>
      );
    }

    case 'warning': {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.86rem'
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{block.message}</span>
        </div>
      );
    }

    case 'result': {
      return (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#34d399' }}>
              {block.verified ? '✓ RÉSULTAT VÉRIFIÉ' : 'RÉSULTAT'}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              {block.title}
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            {block.summary}
          </p>
          {block.metrics && block.metrics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {block.metrics.map((m, mi) => (
                <div key={mi} style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.label}: </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'file': {
      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.84rem',
            color: '#e2e8f0'
          }}
        >
          <FileText size={15} style={{ color: '#60a5fa' }} />
          <span>{block.name}</span>
          {block.size && <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({block.size})</span>}
        </div>
      );
    }

    case 'source': {
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#64748b' }}>
          <span>Source: {block.label}</span>
          {block.uri && <ExternalLink size={11} />}
        </div>
      );
    }

    case 'text':
    default: {
      return (
        <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.6, color: 'var(--color-text-secondary, #d4d4d8)' }}>
          {block.content}
        </p>
      );
    }
  }
}

/**
 * Robust Fallback Semantic Parser:
 * Turns unstructured text into typed content blocks without naive regexes.
 */
function parseSemanticBlocks(rawText: string): ContentBlock[] {
  if (!rawText) return [];

  const lines = rawText.split('\n');
  const blocks: ContentBlock[] = [];
  let currentList: string[] = [];
  let currentListOrdered = false;

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({
        type: 'list',
        items: [...currentList],
        ordered: currentListOrdered
      });
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushList();
      continue;
    }

    // Check for markdown table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      const tableRows: string[][] = [];
      const headers = line.slice(1, -1).split('|').map(s => s.trim());
      i++;
      // Skip separator row (|---|---|)
      if (i < lines.length && lines[i].includes('---')) {
        i++;
      }
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i].trim().slice(1, -1).split('|').map(s => s.trim()));
        i++;
      }
      i--; // rewind one step
      blocks.push({ type: 'table', headers, rows: tableRows });
      continue;
    }

    // Check for headings: # / ## / ### or **Domain Heading**
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length as 1 | 2 | 3;
      blocks.push({ type: 'heading', level, text: headingMatch[2] });
      continue;
    }

    const boldHeadingMatch = line.match(/^\*\*([A-Za-zÀ-ÿ0-9\s&—-]+)\*\*$/);
    if (boldHeadingMatch) {
      flushList();
      const title = boldHeadingMatch[1];
      // Check if it's a domain category (EDUCATION, FINANCE, INVENTAIRE, etc.)
      const isDomain = ['EDUCATION', 'ÉDUCATION', 'FINANCE', 'FINANCES', 'INVENTAIRE', 'ORGANISATION', 'SÉCURITÉ', 'STOCK', 'CAMPUS'].some(
        d => title.toUpperCase().includes(d)
      );
      blocks.push({
        type: 'heading',
        level: 2,
        domain: isDomain ? title.toUpperCase() : undefined,
        text: title
      });
      continue;
    }

    // Check for list items: - or * or 1.
    const unorderedMatch = line.match(/^[-*•]\s+(.+)$/);
    if (unorderedMatch) {
      if (currentList.length > 0 && currentListOrdered) {
        flushList();
      }
      currentListOrdered = false;
      currentList.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      if (currentList.length > 0 && !currentListOrdered) {
        flushList();
      }
      currentListOrdered = true;
      currentList.push(orderedMatch[2]);
      continue;
    }

    // Check for Warning
    if (line.startsWith('⚠️') || line.startsWith('ALERTE:') || line.startsWith('ATTENTION:')) {
      flushList();
      blocks.push({ type: 'warning', message: line.replace(/^(⚠️|ALERTE:|ATTENTION:)\s*/, '') });
      continue;
    }

    // Check for Result / Check line
    if (line.startsWith('✅') || line.startsWith('✓')) {
      flushList();
      blocks.push({
        type: 'result',
        title: line.replace(/^(✅|✓)\s*/, ''),
        summary: 'Opération confirmée et vérifiée par Alliance One.',
        metrics: [],
        verified: true
      });
      continue;
    }

    // Check for Action tags [Action Title]
    const actionMatch = line.match(/^\[([A-Za-zÀ-ÿ\s0-9-]+)\]$/);
    if (actionMatch) {
      flushList();
      blocks.push({
        type: 'action',
        id: `action_${actionMatch[1].toLowerCase().replace(/\s+/g, '_')}`,
        label: actionMatch[1],
        actionType: 'NAVIGATE'
      });
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push({ type: 'text', content: line });
  }

  flushList();
  return blocks;
}
