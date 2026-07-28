import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { TeacupQuestion } from './components/TeacupQuestion';
import { BiscuitOption } from './components/BiscuitOption';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ResultsSummary } from './components/ResultsSummary';
import { QuestionEditorModal } from './components/QuestionEditorModal';

import { Question, UserAnswer } from './types/quiz';
import defaultQuestions from './data/questions.json';
import { soundFx } from './utils/soundEffects';

export const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions as Question[]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // Interaction Lock and Selected Answer state
  const [activeDippingIndex, setActiveDippingIndex] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Sound & Modal State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelected = (index: number, isCorrect: boolean) => {
    setActiveDippingIndex(null);
    setSelectedAnswer({ index, isCorrect });

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: index,
        correctIndex: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setActiveDippingIndex(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setActiveDippingIndex(null);
    setIsQuizCompleted(false);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
  };

  const handleSaveCustomQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    handleRestartQuiz();
  };

  return (
    <div className="app-container">
      {/* Top Navigation Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenEditor={() => setIsEditorOpen(true)}
        onResetQuiz={handleRestartQuiz}
      />

      {/* Main Quiz Stage */}
      {!isQuizCompleted ? (
        <main className="quiz-stage">
          {/* Progress Tracker */}
          <ProgressBar
            currentQuestion={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
          />

          {/* Central Teacup Question Display */}
          <TeacupQuestion
            question={currentQuestion}
            isDipping={activeDippingIndex !== null}
          />

          {/* 4 Biscuit Options Grid */}
          <div className="biscuits-grid">
            {currentQuestion.options.map((optionText, idx) => {
              const isCorrectOption = idx === currentQuestion.correctAnswer;

              return (
                <BiscuitOption
                  key={`${currentIndex}-${idx}`}
                  index={idx}
                  optionText={optionText}
                  isCorrect={isCorrectOption}
                  disabled={selectedAnswer !== null}
                  activeDippingIndex={activeDippingIndex}
                  onOptionSelected={(selIdx, correct) => {
                    setActiveDippingIndex(selIdx);
                    handleOptionSelected(selIdx, correct);
                  }}
                />
              );
            })}
          </div>

          {/* Feedback Banner after reveal */}
          {selectedAnswer !== null && (
            <FeedbackBanner
              isCorrect={selectedAnswer.isCorrect}
              question={currentQuestion}
              isLastQuestion={currentIndex + 1 === questions.length}
              onNext={handleNextQuestion}
            />
          )}
        </main>
      ) : (
        /* End Game Results Summary */
        <ResultsSummary
          questions={questions}
          userAnswers={userAnswers}
          onRestart={handleRestartQuiz}
          onOpenEditor={() => setIsEditorOpen(true)}
        />
      )}

      {/* JSON Editor Drawer Modal */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveQuestions={handleSaveCustomQuestions}
      />
    </div>
  );
};
