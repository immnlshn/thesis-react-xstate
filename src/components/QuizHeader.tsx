import React from 'react';

interface QuizHeaderProps {
  current: number;
  total: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ current, total }) => (
  <div className="quiz-header">
    <h2>Quiz</h2>
    <div>
      Frage {current + 1} von {total}
    </div>
  </div>
);

export default QuizHeader;
