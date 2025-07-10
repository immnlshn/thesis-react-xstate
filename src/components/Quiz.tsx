import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store.ts';
import { fetchQuizSession, submitAnswer, fetchQuizResult, resetQuizStore, setCurrentIndex, setSelectedAnswerId } from '../slices/QuizSlice';
import Question from './Question';
import Result from './Result';
import QuizHeader from './QuizHeader';
import QuizActions from './QuizActions';
import { getProgress } from '../utils/quizUtils';
import Loader from './Loader';
import QuizToast from './QuizToast';

const Quiz: React.FC = () => {
  const dispatch = useAppDispatch();
  const { session, result, currentIndex, selectedAnswerId} = useAppSelector((state) => state.quiz);
  const loaderVisible = useAppSelector((state) => state.loader.visible);
  useRef<number | null>(null);

  useEffect(() => {
    dispatch(fetchQuizSession());
    return () => { dispatch(resetQuizStore()); };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setCurrentIndex(0));
    dispatch(setSelectedAnswerId(undefined));
  }, [session, dispatch]);


  // Hilfsfunktionen
  const questions = session?.questions ?? [];

  function handleSelect(answerId: string) {
    dispatch(setSelectedAnswerId(answerId));
  }

  async function handleSubmit() {
    if (!selectedAnswerId || !session) return;
    await dispatch(submitAnswer({ sessionId: session.sessionId, answer: {
      questionId: questions[currentIndex].id,
      answerId: selectedAnswerId
    }}));
    // Nach dem letzten submit: Ergebnis laden
    if (currentIndex === questions.length - 1) {
      dispatch(fetchQuizResult(session.sessionId));
    }
  }

  function handleRestart() {
    dispatch(resetQuizStore());
    dispatch(fetchQuizSession());
  }

  return (
    <>
      <Loader />
      {!loaderVisible && (
        <>
          {session && !result && (
            <div className="quiz-container">
              <QuizHeader current={currentIndex} total={questions.length} />
              <QuizToast/>
              <Question
                question={questions[currentIndex]}
                onSelect={handleSelect}
                selectedAnswerId={selectedAnswerId}
              />
              <QuizActions
                onSubmit={handleSubmit}
                disabled={!selectedAnswerId}
              >
                <div className="quiz-progress">
                  Fortschritt: {getProgress(currentIndex, questions.length)}
                </div>
              </QuizActions>
            </div>
          )}
          {result && session && (
            <Result onRestart={handleRestart} />
          )}
        </>
      )}
    </>
  );
};

export default Quiz;