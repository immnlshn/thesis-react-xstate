import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../store';

const QuizToast: React.FC = () => {
  const correct = useAppSelector((state) => state.quiz.lastAnswerCorrect);
  const currentIndex = useAppSelector((state) => state.quiz.currentIndex);
  const [show, setShow] = useState(false);
  const prevIndex = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndex !== prevIndex.current && correct !== null) {
      setShow(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setShow(false), 1500);
    }
    prevIndex.current = currentIndex;
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, correct]);

  if (!show || correct === null) return null;
  return (
    <div className={`quiz-toast ${correct ? 'correct' : 'wrong'}`} role="status">
      {correct ? 'Richtig!' : 'Leider falsch.'}
    </div>
  );
};

export default QuizToast;
