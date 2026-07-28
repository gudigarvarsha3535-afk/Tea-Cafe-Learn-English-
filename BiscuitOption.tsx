import React, { useState, useEffect } from 'react';
import { DipState } from '../types/quiz';
import { soundFx } from '../utils/soundEffects';

interface BiscuitOptionProps {
  index: number;
  optionText: string;
  isCorrect: boolean;
  disabled: boolean;
  activeDippingIndex: number | null;
  onOptionSelected: (index: number, isCorrect: boolean) => void;
}

export const BiscuitOption: React.FC<BiscuitOptionProps> = ({
  index,
  optionText,
  isCorrect,
  disabled,
  activeDippingIndex,
  onOptionSelected,
}) => {
  const [dipState, setDipState] = useState<DipState>('idle');
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Reset state when option index or text changes for a new question
  useEffect(() => {
    setDipState('idle');
  }, [optionText, index]);

  const handleClick = () => {
    if (disabled || dipState !== 'idle' || activeDippingIndex !== null) return;

    // Phase 1: Start Dipping (3 seconds total dunking)
    setDipState('dipping');
    soundFx.playDip();

    // Trigger intermittent bubbling sound during 3s soak
    const bubbleTimer = setInterval(() => {
      soundFx.playBubbling();
    }, 900);

    // Phase 2: Exactly 3 seconds (3000ms) dipping before reveal!
    setTimeout(() => {
      clearInterval(bubbleTimer);
      
      if (isCorrect) {
        setDipState('revealing-correct');
        soundFx.playSuccess();
      } else {
        setDipState('revealing-incorrect');
        soundFx.playCrumble();
      }

      // Notify parent component with outcome
      onOptionSelected(index, isCorrect);
    }, 3000);
  };

  // Generate random crumb particles for crumbled state
  const renderCrumbs = () => {
    if (dipState !== 'revealing-incorrect') return null;

    return Array.from({ length: 12 }).map((_, i) => {
      const dx = `${(Math.random() - 0.5) * 160}px`;
      const dy = `${40 + Math.random() * 80}px`;
      const style = {
        '--dx': dx,
        '--dy': dy,
        left: `${20 + Math.random() * 60}%`,
        top: `${30 + Math.random() * 40}%`,
        animationDelay: `${Math.random() * 0.3}s`,
      } as React.CSSProperties;

      return <div key={i} className="crumb-particle" style={style} />;
    });
  };

  let buttonClassName = `biscuit-button state-${dipState}`;
  if (activeDippingIndex !== null && activeDippingIndex !== index) {
    buttonClassName += ' dimmed';
  }

  return (
    <div className={`biscuit-wrapper state-${dipState}`}>
      <button
        className={buttonClassName}
        onClick={handleClick}
        disabled={disabled || (activeDippingIndex !== null && activeDippingIndex !== index)}
      >
        <div className="biscuit-lines" />

        <div className="biscuit-label">{optionLetters[index]}</div>
        
        <span className="biscuit-content-text">{optionText}</span>

        {/* Intact sheen animation overlay for correct reveal */}
        {dipState === 'revealing-correct' && <div className="intact-shine" />}
      </button>

      {/* Crumb particle effects for incorrect reveal */}
      {renderCrumbs()}
    </div>
  );
};
