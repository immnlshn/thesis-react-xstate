import type {QuizSession} from "../models/QuizSession.ts";
import type {QuizResult} from "../models/QuizResult.ts";
import type {AnswerInput} from "../models/AnswerInput.ts";

export type QuizMachineContext = {
  session: QuizSession | null;
  result: QuizResult | null,
  currentIndex: number,
  userAnswers: AnswerInput[],
  selectedAnswer: AnswerInput | null,
  lastQuestionCorrect: boolean | null
}