import type {AnswerInput} from "../models/AnswerInput.ts";

export type QuizMachineEvents =
    { type: 'select', answer: AnswerInput } |
    { type: 'submit' } |
    { type: 'result '} |
    { type: 'restart' }

