import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store.ts';
import { fetchQuizSession, submitAnswer, fetchQuizResult, resetQuizStore, setCurrentIndex, setSelectedAnswerId, setLoaderPhase } from '../slices/QuizSlice';
import Question from './Question';
import Result from './Result';
import QuizHeader from './QuizHeader';
import QuizActions from './QuizActions';
import { getProgress } from '../utils/quizUtils';
import type { AnswerInput } from '../models/AnswerInput';
import QuizToast from './QuizToast';
import Loader from './Loader';

const Quiz: React.FC = () => {
  const dispatch = useAppDispatch();
  const { session, status, lastAnswerCorrect, result, currentIndex, selectedAnswerId } = useAppSelector((state) => state.quiz);
  const loaderVisible = useAppSelector((state) => state.quiz.loaderVisible);
  const toastTimeout = useRef<number | null>(null);

  useEffect(() => {
    dispatch(setLoaderPhase('questions'));
    dispatch(fetchQuizSession());
    return () => { dispatch(resetQuizStore()); };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setCurrentIndex(0));
    dispatch(setSelectedAnswerId(undefined));
  }, [session, dispatch]);

  useEffect(() => {
    if (lastAnswerCorrect !== null) {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = window.setTimeout(() => {}, 1500);
    }
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [lastAnswerCorrect]);

  // Hilfsfunktionen
  const questions = session?.questions ?? [];

  function handleSelect(answerId: string) {
    dispatch(setSelectedAnswerId(answerId));
  }

  async function handleSubmit() {
    if (!selectedAnswerId || !session) return;
    const answerInput: AnswerInput = {
      questionId: questions[currentIndex].id,
      answerId: selectedAnswerId
    };
    dispatch(setLoaderPhase(currentIndex < questions.length - 1 ? 'questions' : 'result'));
    await dispatch(submitAnswer({ sessionId: session.sessionId, answer: answerInput }));
    dispatch(setSelectedAnswerId(undefined));
    if (currentIndex < questions.length - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
      dispatch(setLoaderPhase(null));
    } else {
      await dispatch(fetchQuizResult(session.sessionId));
      dispatch(setLoaderPhase(null));
    }
  }

  function handleRestart() {
    dispatch(resetQuizStore());
    dispatch(setLoaderPhase('questions'));
    dispatch(fetchQuizSession()).finally(() => {
      dispatch(setLoaderPhase(null));
    });
  }

  return (
    <>
      <Loader />
      {loaderVisible ? null : (
        <>
          {session && !result && (
            <div className="quiz-container">
              <QuizHeader current={currentIndex} total={questions.length} />
              <QuizToast correct={lastAnswerCorrect} />
              <Question
                question={questions[currentIndex]}
                onSelect={handleSelect}
                selectedAnswerId={selectedAnswerId}
              />
              <QuizActions
                onSubmit={handleSubmit}
                disabled={!selectedAnswerId || status === 'loading'}
              >
                <div className="quiz-progress">
                  Fortschritt: {getProgress(currentIndex, questions.length)}
                </div>
              </QuizActions>
            </div>
          )}
          {result && session && (
            <Result result={result} questions={session.questions} onRestart={handleRestart} />
          )}
        </>
      )}
    </>
  );
};

export default Quiz;