import React from 'react';
import Question from './Question';
import Result from './Result';
import QuizHeader from './QuizHeader';
import QuizActions from './QuizActions';
import QuizToast from './QuizToast';
import QuizMachineContext from "../QuizMachineContext.ts";
import Loader from "./Loader.tsx";

const Quiz: React.FC = () => {
  const state = QuizMachineContext.useSelector((state) => state.value);
  const quizMachineRef = QuizMachineContext.useActorRef();

  return (
      <div className="quiz-container">
        <QuizToast/>
        {(() => {
          switch (state) {
            case 'loadingSession':
              return null;
            case 'waitForAnswer':
            case 'selectedAnswer':
              return (<>
                <QuizHeader/>
                <Question/>
                <QuizActions/>
              </>);
            case 'submittingAnswer':
              return (<>
                <QuizHeader/>
                <Loader/>
              </>);
            case 'fetchingResult':
              return (<Loader/>);
            case 'result':
              return (<Result/>);
            case 'failure':
              return (<>
                <div className="quiz-error">
                  <h2>Fehler</h2>
                  <p>Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.</p>
                  <button onClick={() => quizMachineRef.send({type: "restart"})}>
                    Quiz neu starten
                  </button>
                </div>
              </>);
            default:
              return null;
          }
        })()}
      </div>
  );
};

export default Quiz;