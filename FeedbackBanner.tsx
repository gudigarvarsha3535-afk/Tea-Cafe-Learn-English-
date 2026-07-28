import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Question } from '../types/quiz';
import { soundFx } from '../utils/soundEffects';

interface FeedbackBannerProps {
  isCorrect: boolean;
  question: Question;
  isLastQuestion: boolean;
  onNext: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  question,
  isLastQuestion,
  onNext,
}) => {
  const correctCopyOptions = [
    "Mmm! Perfect dunk!",
    "Yum! That biscuit emerged intact!",
    "Spot on! Freshly baked perfection!",
    "Deliciously correct!",
  ];

  const incorrectCopyOptions = [
    "Oops! It crumbled into the tea!",
    "Oh no! The biscuit dissolved!",
    "A bit too soggy! That was incorrect.",
    "Crumbled into pieces!",
  ];

  const headline = isCorrect
    ? correctCopyOptions[Math.floor(Math.random() * correctCopyOptions.length)]
    : incorrectCopyOptions[Math.floor(Math.random() * incorrectCopyOptions.length)];

  return (
    <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="feedback-content">
        <div className="feedback-icon">
          {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
        </div>
        <div>
          <h4 className="feedback-title">{headline}</h4>
          <p className="feedback-text">
            {!isCorrect && (
              <strong>
                Correct Answer: {question.options[question.correctAnswer]} —{' '}
              </strong>
            )}
            {question.explanation}
          </p>
        </div>
      </div>

      <button
        className="btn-next"
        onClick={() => {
          soundFx.playClick();
          onNext();
        }}
      >
        <span>{isLastQuestion ? 'See Final Score' : 'Next Question'}</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
