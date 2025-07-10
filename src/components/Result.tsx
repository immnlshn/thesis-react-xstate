import React from 'react';
import { useAppSelector } from '../store';

interface ResultProps {
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ onRestart }) => {
  const { session, userAnswers, result } = useAppSelector((state) => state.quiz);
  const questions = session?.questions || [];

  if (!result || !session) {
    return (
      <div className="result">
        <h2 className="result-title">Ergebnis</h2>
        <p className="result-details">Keine Ergebnisse verfügbar.</p>
        <button onClick={onRestart}>Quiz neu starten</button>
      </div>
    );
  }

  return (
    <div className="result">
      <h2 className="result-title">Ergebnis</h2>
      <p className="result-details">
        Richtige Antworten: {result.score} / {result.total}
      </p>
      <ul className="result-list">
        {questions.map((q) => {
          const userAnswer = userAnswers.find(a => a.questionId === q.id);
          const userAnswerObj = userAnswer ? q.answers.find(a => a.id === userAnswer.answerId) : null;
          const correctAnswer = result.correctAnswers.find(a => a.questionId === q.id);

          if (!correctAnswer) {
            return (
              <li key={q.id}>
                <strong>{q.text}</strong>
                <div>Keine Antwort verfügbar</div>
              </li>
            );
          }

          const isCorrect = userAnswerObj && userAnswerObj.id === correctAnswer.answerId;

          return (
            <li key={q.id}>
              <strong>{q.text}</strong>
              <div className="result-answer">
                <p>
                  Deine Antwort: {userAnswerObj ? userAnswerObj.text : <em>Keine Antwort</em>}
                </p>
                <span className={isCorrect ? 'correct' : 'wrong'}>
                  {isCorrect ? '✓' : '❌'}
                </span>
              </div>
                {!isCorrect && (
                  <div>Richtig wäre: <strong>{q.answers.find(a => a.id === correctAnswer.answerId)?.text || 'Unbekannt'}</strong></div>
                )}
            </li>
          );
        })}
      </ul>
      <button onClick={onRestart}>
        Quiz neu starten
      </button>
    </div>
  );
};

export default Result;