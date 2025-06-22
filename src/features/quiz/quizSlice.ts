import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../../utils/api'
import type {
  QuizResult,
  StartQuizResponse,
  SubmitAnswerPayload,
  QuizState,
} from '../../types/quiz'

const initialState: QuizState = {
  questions: [],
  answers: {},
  status: 'idle',
}

export const startQuiz = createAsyncThunk<StartQuizResponse>(
  'quiz/start',
  async () => {
    const { data } = await api.get<StartQuizResponse>('/quiz/start')
    return data
  },
)

export const submitAnswer = createAsyncThunk<
  { correct: boolean },
  SubmitAnswerPayload
>('quiz/answer', async ({ sessionId, questionId, answerId }) => {
  const { data } = await api.post<{ correct: boolean }>(
    `/quiz/${sessionId}/answer`,
    {
      questionId,
      answerId,
    },
  )
  return data
})

export const fetchResult = createAsyncThunk<QuizResult, string>(
  'quiz/result',
  async (sessionId) => {
    const { data } = await api.get<QuizResult>(`/quiz/${sessionId}/result`)
    return data
  },
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startQuiz.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.status = 'idle'
        state.sessionId = action.payload.sessionId
        state.questions = action.payload.questions
        state.answers = {}
        state.result = undefined
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message
      })
      .addCase(submitAnswer.fulfilled, () => {
        // nothing to store from response except maybe correctness
      })
      .addCase(fetchResult.fulfilled, (state, action: PayloadAction<QuizResult>) => {
        state.result = action.payload
      })
  },
})

export default quizSlice.reducer
