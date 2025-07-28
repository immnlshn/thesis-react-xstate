export type QuizMachineEmitEvents =
    {
      type: 'question-result',
      correct: boolean
    } |
    {
      type: 'error',
      errorType:
          "FetchQuizSessionError" |
          "SubmitAnswerError" |
          "FetchQuizResultError"
    }