import type { AnswerInput } from '../models/AnswerInput';

/**
 * Input for submitting an answer via service or actor
 */
export type SubmitAnswerInput = {
  sessionId: string;
  answer: AnswerInput;
};

