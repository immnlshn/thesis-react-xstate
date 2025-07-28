import React from 'react';

import QuizMachineContext from "../QuizMachineContext.ts";

const QuizHeader: React.FC = () => {
  const currentIndex = QuizMachineContext.useSelector(state => state.context.currentIndex);
  const questionsLength = QuizMachineContext.useSelector(state => state.context.session?.questions.length || null);

  if (questionsLength === null) {
    return null;
  }

  return (
      <div className="quiz-header">
        <h2>Quiz</h2>
        <div>
          Frage {currentIndex + 1} von {questionsLength}
        </div>
      </div>
  );
}
export default QuizHeader;
