import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Card } from './Card';

export interface WizardStep {
  id: string;
  label: string;
  content: React.ReactNode;
  isValid?: boolean; // Can be used to disable "Next"
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  onCancel?: () => void;
  initialStep?: number;
}

export const Wizard: React.FC<WizardProps> = ({ steps, onComplete, onCancel, initialStep = 0 }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);

  const isLastStep = currentStepIndex === steps.length - 1;
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      {/* Progress Bar & Steps Header */}
      <Card noPadding style={{ overflow: 'visible', paddingBottom: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-6)', position: 'relative' }}>
          {/* Connecting Line Base */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 'var(--spacing-8)',
            right: 'var(--spacing-8)',
            height: '2px',
            backgroundColor: 'var(--color-surface-border)',
            transform: 'translateY(-50%)',
            zIndex: 0
          }} />
          
          {/* Connecting Line Active */}
          <motion.div 
            initial={false}
            animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '50%',
              left: 'var(--spacing-8)',
              height: '2px',
              backgroundColor: 'var(--color-accent-500)',
              transform: 'translateY(-50%)',
              zIndex: 0,
              transformOrigin: 'left center'
            }} 
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <motion.div 
                  initial={false}
                  animate={{ 
                    backgroundColor: isCompleted || isCurrent ? 'var(--color-accent-500)' : 'var(--color-surface-card)',
                    borderColor: isCompleted || isCurrent ? 'var(--color-accent-500)' : 'var(--color-surface-border)',
                    color: isCompleted || isCurrent ? '#ffffff' : 'var(--color-text-muted)',
                    scale: isCurrent ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid`,
                    fontWeight: 'var(--font-weight-bold)',
                    fontSize: 'var(--font-size-sm)',
                    boxShadow: isCurrent ? '0 0 0 4px var(--color-accent-100)' : 'none'
                  }}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : (idx + 1)}
                </motion.div>
                <div style={{
                  marginTop: 'var(--spacing-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: isCurrent ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                  color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-surface-card)',
                  padding: '0 var(--spacing-2)'
                }}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Content */}
      <Card hoverable={false}>
        <div style={{ minHeight: '300px', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentStep.content}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 'var(--spacing-8)',
          paddingTop: 'var(--spacing-6)',
          borderTop: '1px solid var(--color-surface-border)'
        }}>
          <div>
            {onCancel && <Button variant="ghost" onClick={onCancel}>Annuler</Button>}
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Button 
              variant="secondary" 
              onClick={handlePrev} 
              disabled={currentStepIndex === 0}
              icon={ChevronLeft}
            >
              Précédent
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNext}
              disabled={currentStep.isValid === false}
            >
              {isLastStep ? 'Terminer' : 'Suivant'}
              {!isLastStep && <ChevronRight size={16} style={{ marginLeft: '4px' }} />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
