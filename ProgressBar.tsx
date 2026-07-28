import React from 'react';
import { Coffee, Tag } from 'lucide-react';
import { Question } from '../types/quiz';

interface ProgressBarProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
}) => {
  const percentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="category-badge">
          <Tag size={14} />
          <span>{currentQuestion.category} • {currentQuestion.level}</span>
        </div>
        <div className="progress-stats">
          Question {currentIndex + 1} of {totalQuestions} ({percentage}%)
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="teacup-steps">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          let stepClass = 'teacup-step';
          if (idx === currentIndex) stepClass += ' active';
          else if (idx < currentIndex) stepClass += ' completed';

          return (
            <div key={idx} className={stepClass} title={`Question ${idx + 1}`}>
              <Coffee size={14} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
