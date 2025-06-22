export interface AnswerOption {
  id: string
  text: string
}

export interface Question {
  id: string
  text: string
  answers: AnswerOption[]
}

export interface QuizResult {
  score: number
  total: number
  correctAnswers: Record<string, string>
}

export interface StartQuizResponse {
  sessionId: string
  questions: Question[]
}

export interface SubmitAnswerPayload {
  sessionId: string
  questionId: string
  answerId: string
}

export interface QuizState {
  sessionId?: string
  questions: Question[]
  answers: Record<string, string>
  result?: QuizResult
  status: 'idle' | 'loading' | 'error'
  error?: string
}
