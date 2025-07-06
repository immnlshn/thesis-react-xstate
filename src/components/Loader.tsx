import { useAppSelector } from '../store';
import React from 'react';

const loaderTextMap: Record<string, string> = {
  init: 'Lade Quiz...',
  questions: 'Lade Fragen...',
  result: 'Lade Ergebnis...'
};

const Loader: React.FC = () => {
  const loaderVisible = useAppSelector((state) => state.quiz.loaderVisible);
  const loaderPhase = useAppSelector((state) => state.quiz.loaderPhase);
  const status = useAppSelector((state) => state.quiz.status);
  const error = useAppSelector((state) => state.quiz.error);
  const session = useAppSelector((state) => state.quiz.session);
  const text = loaderTextMap[loaderPhase || 'init'] || 'Lade Quiz...';
  const noQuiz = status === 'idle' && !loaderVisible && !error && !loaderPhase && !session;
  const isError = status === 'failed' && error;

  if (!loaderVisible && !noQuiz) return null;
  return (
    <div className="quiz-loader">
      <div className={`loader-bar${isError ? ' error' : ''}`}>
        <div className={`loader-progress${isError ? ' error static' : ''}`} />
      </div>
      <div className="loader-text">
        {isError ? (
          <span className="loader-error">
            Fehler: {error === 'Failed to start quiz session' ? 'Quiz konnte nicht gestartet werden.' :
                     error === 'Failed to submit answer' ? 'Antwort konnte nicht übermittelt werden.' :
                     error === 'Failed to fetch result' ? 'Ergebnis konnte nicht geladen werden.' :
                     error}
          </span>
        ) : noQuiz ? (
          <span>Kein Quiz gefunden.</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default Loader;
