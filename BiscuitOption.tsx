import React, { useState, useEffect } from 'react';
import { DipState } from '../types/quiz';
import { soundFx } from '../utils/soundEffects';
import { Sparkles } from 'lucide-react';

interface BiscuitOptionProps {
  index: number;
  optionText: string;
  isCorrect: boolean;
  disabled: boolean;
  isSelected: boolean;
  activeDippingIndex: number | null;
  onOptionSelected: (index: number, isCorrect: boolean) => void;
}

export const BiscuitOption: React.FC<BiscuitOptionProps> = ({
  index,
  optionText,
  isCorrect,
  disabled,
  isSelected,
  activeDippingIndex,
  onOptionSelected,
}) => {
  const [dipState, setDipState] = useState<DipState>('idle');
  const optionLetters = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    setDipState('idle');
  }, [optionText, index]);

  const handleClick = () => {
    if (disabled || dipState !== 'idle' || activeDippingIndex !== null) return;

    // 1. Immediately disable all other options & set dipping state
    setDipState('dipping');
    soundFx.playDip();

    // 2. Play tea bubble sound during dipping animation
    const bubbleTimer = setInterval(() => {
      soundFx.playBubbling();
    }, 900);

    // 3. Exactly ~3 seconds dipping into Indian chai glass
    setTimeout(() => {
      clearInterval(bubbleTimer);

      if (isCorrect) {
        setDipState('revealing-correct');
        soundFx.playSuccess();
      } else {
        setDipState('revealing-incorrect');
        soundFx.playCrumble();
      }

      onOptionSelected(index, isCorrect);
    }, 3000);
  };

  let wrapperClassName = `biscuit-wrapper glucose-wrapper state-${dipState}`;
  if (isSelected) wrapperClassName += ' selected-biscuit';
  if (activeDippingIndex !== null && activeDippingIndex !== index) {
    wrapperClassName += ' disabled-other-biscuit';
  }

  let buttonClassName = `biscuit-button glucose-biscuit state-${dipState}`;
  if (isSelected) buttonClassName += ' highlighted';

  return (
    <div className={wrapperClassName}>
      <button
        className={buttonClassName}
        onClick={handleClick}
        disabled={disabled || (activeDippingIndex !== null && activeDippingIndex !== index)}
      >
        {/* Glucose Biscuit Embossed Frame & Perforation Details */}
        <div className="glucose-border-frame" />
        <div className="glucose-perforations" />

        {/* Option Letter Stamp Badge */}
        <div className="biscuit-label glucose-stamp">{optionLetters[index]}</div>
        
        {/* Option Content Text */}
        <span className="biscuit-content-text glucose-text">{optionText}</span>

        {/* Intact Sheen & Sparkles for Correct Answer */}
        {dipState === 'revealing-correct' && (
          <>
            <div className="intact-shine" />
            <div className="success-sparkle-badge">
              <Sparkles size={20} color="#FFF" />
            </div>
          </>
        )}

        {/* Visual Crack Overlay for Broken Biscuit (Incorrect) */}
        {dipState === 'revealing-incorrect' && (
          <svg className="biscuit-crack-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 10 20 Q 30 45 45 40 T 60 70 T 90 85"
              stroke="#3A1C04"
              strokeWidth="4.5"
              fill="none"
              strokeDasharray="4,2"
            />
            <path
              d="M 45 40 Q 65 30 80 50"
              stroke="#2B1402"
              strokeWidth="3.8"
              fill="none"
            />
          </svg>
        )}
      </button>

      {/* Crumb particle effects for incorrect reveal */}
      {dipState === 'revealing-incorrect' &&
        Array.from({ length: 12 }).map((_, i) => {
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
        })}
    </div>
  );
};
