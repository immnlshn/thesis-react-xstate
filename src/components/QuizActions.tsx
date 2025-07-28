import React from 'react';
import {getProgress} from "../utils/quizUtils.ts";

import QuizMachineContext from "../QuizMachineContext.ts";

const QuizActions: React.FC = () => {
  const quizMachineRef = QuizMachineContext.useActorRef();
  const currentIndex = QuizMachineContext.useSelector(state => state.context.currentIndex);
  const questionsLength = QuizMachineContext.useSelector(state => state.context.session?.questions.length || 0);
  const selectedAnswer = QuizMachineContext.useSelector(state => state.context.selectedAnswer);

  return (
      <div className="quiz-actions">
        <button onClick={() => quizMachineRef.send({ type: "submit" })} disabled={selectedAnswer === null}>
          Antwort absenden
        </button>
        <div className="quiz-progress">
          Fortschritt: {getProgress(currentIndex, questionsLength)}
        </div>
      </div>
  );
}


export default QuizActions;
