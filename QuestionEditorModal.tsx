import React, { useState } from 'react';
import { X, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { Question } from '../types/quiz';
import defaultQuestions from '../data/questions.json';
import { soundFx } from '../utils/soundEffects';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuestions: (questions: Question[]) => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveQuestions,
}) => {
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(defaultQuestions, null, 2)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON must be a non-empty array of questions.');
      }

      // Basic validation of fields
      parsed.forEach((q, i) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
          throw new Error(`Question at index ${i} is missing required fields (question, 4 options, correctAnswer).`);
        }
      });

      setErrorMsg(null);
      soundFx.playSuccess();
      onSaveQuestions(parsed);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
      setErrorMsg(msg);
      soundFx.playCrumble();
    }
  };

  const handleResetDefault = () => {
    setJsonText(JSON.stringify(defaultQuestions, null, 2));
    setErrorMsg(null);
    soundFx.playClick();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Custom Question JSON Editor</h3>
          <button className="btn-icon" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Paste or customize your English quiz JSON dataset below. Each question requires a <code>question</code> string, 4 <code>options</code>, <code>correctAnswer</code> (0-3), and an <code>explanation</code>.
          </p>

          <textarea
            className="json-textarea"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setErrorMsg(null);
            }}
          />

          {errorMsg && (
            <div className="json-error">
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {errorMsg}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-icon" onClick={handleResetDefault}>
            <RotateCcw size={16} />
            <span>Load Default</span>
          </button>

          <button className="btn-primary" onClick={handleSave}>
            <CheckCircle size={18} />
            <span>Apply Custom Questions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
