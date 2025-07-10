export type QuizResult = {
  score: number;
  total: number;
  correctAnswers: {
    questionId: string;
    answerId: string;
  }[];
}