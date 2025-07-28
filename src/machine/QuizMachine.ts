import {assign, enqueueActions, fromPromise, setup} from 'xstate';
import type {QuizMachineContext} from '../types/QuizMachineContext';
import type {QuizMachineEvents} from "../types/QuizMachineEvents.ts";
import type {QuizSession} from '../models/QuizSession.ts';
import type {QuestionResult} from "../models/QuestionResult.ts";
import type {SubmitAnswerInput} from "../types/SubmitAnswerInput.ts";
import type {QuizResult} from "../models/QuizResult.ts";
import type {FetchQuizResultInput} from "../types/FetchQuizResultInput.ts";
import type {QuizMachineEmitEvents} from "../types/QuizMachineEmitEvents.ts";
import type {AnswerInput} from "../models/AnswerInput.ts";

const startQuiz = fromPromise<QuizSession>(async () => {
  const response = await fetch('/api/quiz/start');
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to start quiz session');
  }
  return await response.json() as QuizSession;
});

const submitAnswer = fromPromise<QuestionResult, SubmitAnswerInput>(async ({input}) => {
  const response = await fetch(`/api/quiz/${input.sessionId}/answer`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input.answer),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to submit answer');
  }
  return await response.json() as QuestionResult;
});

const getQuizResult = fromPromise<QuizResult, FetchQuizResultInput>(async ({input}) => {
  const response = await fetch(`/api/quiz/${input.sessionId}/result`);
  if (!response.ok) throw new Error('Failed to fetch result');
  return await response.json() as QuizResult;
});


export default setup({
  types: {
    context: {} as QuizMachineContext,
    events: {} as QuizMachineEvents,
    emitted: {} as QuizMachineEmitEvents,
  },
  actors: {
    startQuiz: startQuiz,
    submitAnswer: submitAnswer,
    getQuizResult: getQuizResult
  },
  actions: {
    EmitFetchQuizSessionError: enqueueActions(({enqueue}) =>
        enqueue.emit({type: 'error', errorType: 'FetchQuizSessionError'})
    ),
    EmitSubmitAnswerError: enqueueActions(({enqueue}) =>
        enqueue.emit({type: 'error', errorType: 'SubmitAnswerError'})
    ),
    EmitFetchQuizResultError: enqueueActions(({enqueue}) =>
        enqueue.emit({type: 'error', errorType: 'FetchQuizResultError'})
    ),
    EmitQuestionResult: enqueueActions(({enqueue, context}) => {
      const lastQuestionCorrect = context.lastQuestionCorrect;
      if (lastQuestionCorrect !== null) {
        enqueue.emit({type: 'question-result', correct: lastQuestionCorrect});
      }
      enqueue.assign({lastQuestionCorrect: null});
    }),
    AssignResetContext: assign({
      session: null,
      result: null,
      currentIndex: 0,
      userAnswers: [],
      selectedAnswer: null
    }),
  },
  guards: {
    isNotLastQuestion: ({context}) => context.currentIndex + 1 <= context.session!.questions.length,
  }
}).createMachine({
  id: 'quizMachine',
  initial: 'loadingSession',
  context: {
    session: null,
    result: null,
    currentIndex: 0,
    userAnswers: [],
    selectedAnswer: null,
    lastQuestionCorrect: null
  },
  states: {
    loadingSession: {
      invoke: {
        id: 'loadingSession',
        src: 'startQuiz',
        onDone: {
          target: 'waitForAnswer',
          actions: assign({
            session: ({event}) => event.output as QuizSession
          })
        },
        onError: {
          target: 'failure',
          actions: 'EmitFetchQuizSessionError'
        }
      }
    },
    waitForAnswer: {
      on: {
        select: {
          target: 'selectedAnswer',
          actions: assign({
            selectedAnswer: ({event}) => (event as { type: 'select', answer: AnswerInput }).answer
          })
        }
      }
    },
    selectedAnswer: {
      on: {
        select: {
          target: 'selectedAnswer',
          actions: assign({
            selectedAnswer: ({event}) => (event as { type: 'select', answer: AnswerInput }).answer
          })
        },
        submit: {
          target: 'submittingAnswer',
          actions: assign({
            userAnswers: ({ context }) => [
                  ...context.userAnswers,
                  context.selectedAnswer!
                ],
            currentIndex: ({context}) => context.currentIndex + 1
          })
        }
      }
    },
    submittingAnswer: {
      invoke: {
        id: 'submitAnswer',
        src: 'submitAnswer',
        input: ({context}): SubmitAnswerInput => ({
          sessionId: context.session!.sessionId,
          answer: context.selectedAnswer!
        }),
        onDone: [
          {
            guard: 'isNotLastQuestion',
            target: 'waitForAnswer',
            actions: [
              assign({
                lastQuestionCorrect: ({event}) => (event.output as QuestionResult).correct,
                selectedAnswer: null
              }),
              'EmitQuestionResult'
            ]
          },
          {
            target: 'fetchingResult',
            actions: [
              assign({
                lastQuestionCorrect: ({event}) => (event.output as QuestionResult).correct
              }),
              'EmitQuestionResult'
            ]
          }
        ],
        onError: {
          target: 'failure',
          actions: 'EmitSubmitAnswerError'
        }
      }
    },
    fetchingResult: {
      invoke: {
        id: 'getQuizResult',
        src: 'getQuizResult',
        input: ({context}) => ({
          sessionId: context.session!.sessionId
        }),
        onDone: {
          target: 'result',
          actions: assign({
            result: ({event}) => event.output as QuizResult
          })
        },
        onError: {
          target: 'failure',
          actions: 'EmitFetchQuizResultError'
        }
      }
    },
    result: {
      on: {
        restart: {
          target: 'loadingSession',
          actions: 'AssignResetContext'
        }
      }
    },
    failure: {
      on: {
        restart: {
          target: 'loadingSession',
          actions: 'AssignResetContext'
        }
      }
    }
  }
});
