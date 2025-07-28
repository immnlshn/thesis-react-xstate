import React from 'react';
import QuizMachineContext from '../QuizMachineContext.ts';

const loaderTextMap: Record<string, string> = {
  loadingSession: 'Lade Quiz...',
  submittingAnswer: 'Antwort wird verarbeitet...',
  fetchingResult: 'Ergebnis wird geladen...'
};

const Loader: React.FC = () => {
  const state = QuizMachineContext.useSelector(s => s.value as string);
  const text = loaderTextMap[state] || '';
  if (!text) return null;
  return (
    <div className="quiz-loader">
      <div className="loader-bar">
        <div className="loader-progress" />
      </div>
      <div className="loader-text">{text}</div>
    </div>
  );
};

export default Loader;
