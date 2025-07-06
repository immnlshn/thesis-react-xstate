import React from 'react';

interface QuizActionsProps {
  onSubmit: () => void;
  disabled: boolean;
  children?: React.ReactNode;
}

const QuizActions: React.FC<QuizActionsProps> = ({ onSubmit, disabled, children }) => (
  <div className="quiz-actions">
    <button onClick={onSubmit} disabled={disabled}>
      Antwort absenden
    </button>
    {children}
  </div>
);

export default QuizActions;
