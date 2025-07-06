import type {Answer} from "./Answer.ts";

export type Question = {
  id: string;
  text: string;
  answers: Answer[];
}