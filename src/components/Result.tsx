import React from 'react';
import type { QuizResult } from '../models/QuizResult';
import type { Question } from '../models/QuizSession';

interface ResultProps {
  result: QuizResult;
  questions: Question[];
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ result, questions, onRestart }) => (
    <div className="result">
      <h2 className="result-title">Ergebnis</h2>
      <p className="result-details">
        Richtige Antworten: {result.score} / {result.total}
      </p>
      <ul className="result-list">
        {questions.map((q) => {
          const correctAnswer = q.answers.find(a => a.id === result.correctAnswers[q.id]);
          return (
              <li key={q.id}>
                <strong>{q.text}</strong>
                <br />
                Richtige Antwort: {correctAnswer ? correctAnswer.text : 'Unbekannt'}
              </li>
          );
        })}
      </ul>
      <button onClick={onRestart}>
        Quiz neu starten
      </button>
    </div>
);

export default Result;