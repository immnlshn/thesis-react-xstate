import React from 'react';
import type { Question } from '../models/Question';
import type { Answer } from '../models/Answer';

interface QuestionProps {
  question: Question;
  onSelect: (answerId: string) => void;
  selectedAnswerId?: string;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, onSelect, selectedAnswerId }) => {
  return (
    <div className="question">
      <h3 className="question-title">{question.text}</h3>
      <div className="answer-list">
        {question.answers.map((answer: Answer) => (
          <button
            key={answer.id}
            onClick={() => onSelect(answer.id)}
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