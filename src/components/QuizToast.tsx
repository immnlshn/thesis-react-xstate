import React, { useEffect, useRef, useState } from 'react';

interface QuizToastProps {
  correct: boolean | null;
}

const QuizToast: React.FC<QuizToastProps> = ({ correct }) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const prevCorrect = useRef<boolean | null>(null);

  useEffect(() => {
    if (correct !== null && correct !== prevCorrect.current) {
      setShow(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setShow(false), 1500);
    }
    prevCorrect.current = correct;
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [correct]);

  if (!show || correct === null) return null;
  return (
    <div className={`quiz-toast ${correct ? 'toast-correct' : 'toast-wrong'}`} role="status">
      {correct ? 'Richtig!' : 'Leider falsch.'}
    </div>
  );
};

export default QuizToast;
