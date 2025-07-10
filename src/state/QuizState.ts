import type {QuizSession} from '../models/QuizSession';
import type {QuizResult} from '../models/QuizResult';
import type {AnswerInput} from '../models/AnswerInput';

export type QuizState = {
  session: QuizSession | null;
  result: QuizResult | null;
  error: string | null;
  currentIndex: number;
  selectedAnswerId?: string;
  showToast?: boolean;
  lastAnswerCorrect?: boolean | null;
  userAnswers: AnswerInput[];
};
