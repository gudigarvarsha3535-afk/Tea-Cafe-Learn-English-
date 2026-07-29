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
  return (
    <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="feedback-content">
        <div className="feedback-icon">
          {isCorrect ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
        </div>
        <div>
          <h4 className="feedback-title">
            {isCorrect ? 'Correct! Great job! 🎉' : 'Not quite! Try again.'}
          </h4>
          <p className="feedback-text">
            {!isCorrect && (
              <span className="correct-answer-highlight">
                <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                <br />
              </span>
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
