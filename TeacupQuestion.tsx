import React from 'react';
import { Question } from '../types/quiz';
import { HelpCircle } from 'lucide-react';

interface TeacupQuestionProps {
  question: Question;
  isDipping: boolean;
}

export const TeacupQuestion: React.FC<TeacupQuestionProps> = ({ question, isDipping }) => {
  return (
    <div className="teacup-container">
      {/* Steam Animation */}
      <div className="steam-wrapper">
        <div className="steam-particle" />
        <div className="steam-particle" />
        <div className="steam-particle" />
      </div>

      {/* Main Ceramic Teacup Body */}
      <div className="teacup-glassbody">

        {/* Liquid Surface */}
        <div className="tea-liquid-surface">
          {/* Active Liquid Ripple effect when a biscuit dips */}
          {isDipping && <div className="tea-ripple" />}
        </div>

        {/* Question Details */}
        <div className="question-badge">
          English Dunk Challenge
        </div>

        <h2 className="question-text">{question.question}</h2>

        )}
      </div>
    </div>
  );
};
