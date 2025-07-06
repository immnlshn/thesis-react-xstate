import type {Question} from "./Question.ts";
import type {AnswerInput} from "./AnswerInput.ts";

export type QuizSession = {
  sessionId: string;
  questions: Question[];
  answerInputs: AnswerInput[];
}