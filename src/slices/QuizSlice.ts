import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { QuizSession } from '../models/QuizSession';
import type { AnswerInput } from '../models/AnswerInput';
import type { QuizResult } from '../models/QuizResult';
import type { QuizState } from '../state/QuizState';
import {resetLoaderState, setLoaderState} from './LoaderSlice';

const initialState: QuizState = {
  session: null,
  result: null,
  error: null,
  currentIndex: 0,
  selectedAnswerId: undefined,
  showToast: false,
  lastAnswerCorrect: null,
  userAnswers: [],
};

// Quiz starten
export const fetchQuizSession = createAsyncThunk<QuizSession>(
  'quiz/fetchQuizSession',
  async (_, { dispatch }) => {
    dispatch(setLoaderState({ phase: 'init', error: null }));
    try {
      const response = await fetch('/api/quiz/start');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to start quiz session');
      }
      const data = await response.json();
      dispatch(setLoaderState({ phase: null, error: null }));
      return data as QuizSession;
    } catch (e: any) {
      dispatch(setLoaderState({ phase: null, error: e.message || 'Fehler' }));
      throw e;
    }
  }
);

export const submitAnswer = createAsyncThunk<
  { correct: boolean },
  { sessionId: string; answer: AnswerInput }
>(
  'quiz/submitAnswer',
  async ({ sessionId, answer }, { dispatch }) => {
    dispatch(setLoaderState({ phase: 'questions', error: null }));
    try {
      const response = await fetch(`/api/quiz/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to start quiz session');
      }
      const data = await response.json();
      dispatch(setLoaderState({ phase: null, error: null }));
      return data;
    } catch (e: any) {
      dispatch(setLoaderState({ phase: null, error: e.message || 'Fehler' }));
      throw e;
    }
  }
);

export const fetchQuizResult = createAsyncThunk<
  QuizResult,
  string
>(
  'quiz/fetchQuizResult',
  async (sessionId, { dispatch }) => {
    dispatch(setLoaderState({ phase: 'result', error: null }));
    try {
      const response = await fetch(`/api/quiz/${sessionId}/result`);
      if (!response.ok) throw new Error('Failed to fetch result');
      const data = await response.json();
      dispatch(setLoaderState({ phase: null, error: null }));
      return data as QuizResult;
    } catch (e: any) {
      dispatch(setLoaderState({ phase: null, error: e.message || 'Fehler' }));
      throw e;
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetQuizStore: (state) => {
      state.session = null;
      state.result = null;
      state.error = null;
      state.currentIndex = 0;
      state.selectedAnswerId = undefined;
      state.userAnswers = [];
      state.showToast = false;
      state.lastAnswerCorrect = null;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    setSelectedAnswerId: (state, action) => {
      state.selectedAnswerId = action.payload;
    },
    resetQuizError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Loader/Fehler-Status für fetchQuizSession
      .addCase(fetchQuizSession.pending, () => {
        setLoaderState({ phase: 'init', error: null });
      })
      .addCase(fetchQuizSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.error = null;
        state.currentIndex = 0;
        state.selectedAnswerId = undefined;
        state.userAnswers = [];
        state.showToast = false;
        state.lastAnswerCorrect = null;
        setLoaderState({ phase: null, error: null });
      })
      .addCase(fetchQuizSession.rejected, (state, action) => {
        state.error = action.error.message || 'Fehler';
        state.session = null;
        state.result = null;
        setLoaderState({ phase: "init", error: state.error });
      })
      // Loader/Fehler-Status für submitAnswer
      .addCase(submitAnswer.pending, (state) => {
        state.error = null;
        setLoaderState({ phase: 'questions', error: null });
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.error = null;
        state.lastAnswerCorrect = action.payload.correct;
        state.selectedAnswerId = undefined;
        if (state.session) {
          const questionId = action.meta.arg.answer.questionId;
          const answerId = action.meta.arg.answer.answerId;
          // Prüfen, ob schon eine Antwort für diese Frage existiert (z.B. bei zurückspringen)
          const existingIdx = state.userAnswers.findIndex(a => a.questionId === questionId);
          const answerInput = { questionId, answerId };
          if (existingIdx >= 0) {
            state.userAnswers[existingIdx] = answerInput;
          } else {
            state.userAnswers.push(answerInput);
          }
          if (state.currentIndex < state.session.questions.length - 1) {
            state.currentIndex++;
          }
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.error = action.error.message || 'Fehler';
        state.lastAnswerCorrect = null;
        setLoaderState({ phase: "questions", error: state.error });
      })
      .addCase(fetchQuizResult.pending, (state) => {
        state.error = null;
        setLoaderState({ phase: 'result', error: null });
      })
      .addCase(fetchQuizResult.fulfilled, (state, action) => {
        state.result = action.payload;
        state.error = null;
        resetLoaderState();
      })
      .addCase(fetchQuizResult.rejected, (state, action) => {
        state.error = action.error.message || 'Fehler';
        setLoaderState({ phase: "result", error: state.error });
      });
  },
});

export const { resetQuizStore, setCurrentIndex, setSelectedAnswerId, resetQuizError} = quizSlice.actions;

export default quizSlice.reducer;