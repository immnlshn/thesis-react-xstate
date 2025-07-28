import React from 'react';
import type { Answer } from '../models/Answer';

import QuizMachineContext from '../QuizMachineContext';


const QuestionComponent: React.FC = () => {
  const quizMachineRef = QuizMachineContext.useActorRef()
  const question = QuizMachineContext.useSelector(state => state.context.session?.questions[state.context.currentIndex]);
  const selectedAnswerId = QuizMachineContext.useSelector(state =>
    state.context.selectedAnswer || null)?.answerId;

  if (!question) {
    return null;
  }

  return (
    <div className="question">
      <h3 className="question-title">{question.text}</h3>
      <div className="answer-list">
        {question.answers.map((answer: Answer) => (
          <button
            key={answer.id}
            onClick={() => quizMachineRef.send({ type: 'select', answer: { questionId: question.id, answerId: answer.id }})}
            className={`answer-btn${selectedAnswerId === answer.id ? ' selected' : ''}`}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionComponent;