import type {Question} from "./Question.ts";

export type QuizSession = {
  sessionId: string;
  questions: Question[];
}