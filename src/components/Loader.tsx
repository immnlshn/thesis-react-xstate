import React, {useEffect, useState} from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { fetchQuizSession, fetchQuizResult, resetQuizError } from '../slices/QuizSlice';
import { setLoaderVisibility } from '../slices/LoaderSlice';

const loaderTextMap: Record<string, string> = {
  init: 'Lade Quiz...',
  questions: 'Lade Fragen...',
  result: 'Lade Ergebnis...'
};

const Loader: React.FC = () => {
  const dispatch = useAppDispatch();
  const loaderVisible = useAppSelector((state) => state.loader.visible);
  const loaderPhase = useAppSelector((state) => state.loader.phase);
  const error = useAppSelector((state) => state.loader.error);
  const session = useAppSelector((state) => state.quiz.session);
  const isError = !!error;

  const [text, setText] = useState("");

  useEffect(() => {
    let timeout: number | null = null;
    if (loaderPhase || isError) {
      setText(loaderTextMap[loaderPhase || 'init'] || 'Lade...');
      dispatch(setLoaderVisibility(true));
    } else {
      timeout = setTimeout(() => {
        setText("");
        dispatch(setLoaderVisibility(false));
      }, 500);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loaderPhase, isError, dispatch]);


  const handleRetry = () => {
    dispatch(resetQuizError());
    dispatch(setLoaderVisibility(false));
    if (loaderPhase === 'result' && session) {
      dispatch(fetchQuizResult(session.sessionId));
    } else {
      dispatch(fetchQuizSession());
    }
  };

  if (!loaderVisible) return null;

  return (
    <div className="quiz-loader">
      <div className={`loader-bar${isError ? ' error' : ''}`}>
        <div className={`loader-progress${isError ? ' error static' : ''}`} />
      </div>
      <div className="loader-text">
        {isError ? (
          <span className="loader-error">
            Fehler: {error}
            <br />
            <button className="quiz-retry-btn" onClick={handleRetry}>Erneut versuchen</button>
          </span>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
};

export default Loader;
