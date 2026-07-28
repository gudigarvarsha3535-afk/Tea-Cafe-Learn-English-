import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, Edit3, Check, X } from 'lucide-react';
import { Question, UserAnswer } from '../types/quiz';
import { soundFx } from '../utils/soundEffects';

interface ResultsSummaryProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
  onOpenEditor: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  questions,
  userAnswers,
  onRestart,
  onOpenEditor,
}) => {
  const total = questions.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctCount / total) * 100);

  // Determine Badge Title
  let badgeTitle = 'Biscuit Dunker Trainee';
  let badgeDescription = 'Keep dunking biscuits and practicing your English vocabulary!';

  if (percentage === 100) {
    badgeTitle = 'Master Barista 🏆';
    badgeDescription = 'Flawless performance! You serve English fluency with style!';
  } else if (percentage >= 80) {
    badgeTitle = 'Senior Tea Sommelier ☕';
    badgeDescription = 'Impressive skills! Your English tastes refined and crisp!';
  } else if (percentage >= 60) {
    badgeTitle = 'Cafe Apprentice 🥐';
    badgeDescription = 'Good effort! You know your way around the cafe menu!';
  }

  // Trigger celebration confetti if score >= 60%
  useEffect(() => {
    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B85B14', '#D29B56', '#4CAF50', '#F5E6D3', '#8B5A2B'],
      });
    }
  }, [percentage]);

  return (
    <div className="results-container">
      <div className="results-badge-icon">
        <Award size={48} />
      </div>

      <h2 className="results-title">{badgeTitle}</h2>
      <p className="results-subtitle">{badgeDescription}</p>

      <div className="score-card">
        <div className="score-stat">
          <span className="stat-value">{correctCount}/{total}</span>
          <span className="stat-label">Score</span>
        </div>
        <div className="score-stat">
          <span className="stat-value">{percentage}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="review-list">
        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
          Quiz Review
        </h3>
        {questions.map((q, idx) => {
          const ans = userAnswers.find((a) => a.questionId === q.id);
          const isCorrect = ans?.isCorrect ?? false;

          return (
            <div key={q.id} className="review-item">
              <div className={`review-status-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? <Check size={18} /> : <X size={18} />}
              </div>
              <div className="review-details">
                <p className="review-q-text">
                  {idx + 1}. {q.question}
                </p>
                <p className="review-explanation">
                  <strong>Answer:</strong> {q.options[q.correctAnswer]} — {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="results-actions">
        <button
          className="btn-primary"
          onClick={() => {
            soundFx.playClick();
            onRestart();
          }}
        >
          <RotateCcw size={18} />
          <span>Play Again</span>
        </button>

        <button
          className="btn-icon"
          style={{ padding: '0.9rem 1.6rem', fontSize: '1rem' }}
          onClick={() => {
            soundFx.playClick();
            onOpenEditor();
          }}
        >
          <Edit3 size={18} />
          <span>Custom Questions</span>
        </button>
      </div>
    </div>
  );
};
