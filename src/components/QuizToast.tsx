import React, { useRef, useState, useEffect } from 'react';
import QuizMachineContext from "../QuizMachineContext.ts";


const QuizToast: React.FC = () => {
  const quizMachineRef = QuizMachineContext.useActorRef();
  const visibleRef = useRef(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const listener = (event: { correct: boolean }) => {
      if (visibleRef.current) return;

      setCorrect(event.correct);
      visibleRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCorrect(null);
        visibleRef.current = false;
      }, 1500);
    };

    const subscription = quizMachineRef.on("question-result", listener);

    return () => subscription.unsubscribe();
  }, [quizMachineRef]);

  if (!visibleRef.current && correct === null) {
    return null;
  }

  return (
    <div className={`quiz-toast ${correct ? 'correct' : 'wrong'}`} role="status">
      {correct ? 'Richtig!' : 'Leider falsch.'}
    </div>
  );
};

export default QuizToast;
