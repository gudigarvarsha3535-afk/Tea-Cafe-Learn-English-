import React from 'react';
import { Coffee, Volume2, VolumeX, Edit3, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenEditor: () => void;
  onResetQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenEditor,
  onResetQuiz,
}) => {
  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-icon">
          <Coffee size={24} />
        </div>
        <div>
          <h1 className="brand-title">Cafe Quiz</h1>
          <p className="brand-subtitle">English Dunk & Learn</p>
        </div>
      </div>

      <div className="header-controls">
        <button
          className="btn-icon"
          onClick={() => {
            soundFx.playClick();
            onToggleMute();
          }}
          title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>

        <button
          className="btn-icon"
          onClick={() => {
            soundFx.playClick();
            onOpenEditor();
          }}
          title="Edit or load custom questions JSON"
        >
          <Edit3 size={18} />
          <span>JSON Editor</span>
        </button>

        <button
          className="btn-icon"
          onClick={() => {
            soundFx.playClick();
            onResetQuiz();
          }}
          title="Restart Quiz"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
};
