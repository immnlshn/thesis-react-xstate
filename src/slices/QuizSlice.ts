import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { QuizSession } from '../models/QuizSession';
import type { AnswerInput } from '../models/AnswerInput';
import type { QuizResult } from '../models/QuizResult';

// Quiz starten
export const fetchQuizSession = createAsyncThunk<QuizSession>(
    'quiz/fetchQuizSession',
    async (_, { dispatch }) => {
      const response = await fetch('/api/quiz/start');
      if (!response.ok) throw new Error('Failed to start quiz session');
      const data = (await response.json()) as QuizSession;
      // Mindestens 200ms Loader anzeigen
      await new Promise((resolve) => setTimeout(resolve, 200));
      dispatch(setLoaderVisible(false));
      return data;
    }
);

// Antwort absenden
export const submitAnswer = createAsyncThunk<
    { correct: boolean },
    { sessionId: string; answer: AnswerInput }
>(
    'quiz/submitAnswer',
    async ({ sessionId, answer }, { dispatch }) => {
      const response = await fetch(`/api/quiz/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
      });
      if (!response.ok) throw new Error('Failed to submit answer');
      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 200));
      dispatch(setLoaderVisible(false));
      return data;
    }
);

// Ergebnis holen
export const fetchQuizResult = createAsyncThunk<
    QuizResult,
    string // sessionId
>(
    'quiz/fetchQuizResult',
    async (sessionId, { dispatch }) => {
      const response = await fetch(`/api/quiz/${sessionId}/result`);
      if (!response.ok) throw new Error('Failed to fetch result');
      const data = (await response.json()) as QuizResult;
      await new Promise((resolve) => setTimeout(resolve, 200));
      dispatch(setLoaderVisible(false));
      return data;
    }
);

interface QuizState {
  session: QuizSession | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastAnswerCorrect: boolean | null;
  result: QuizResult | null;
  currentIndex: number;
  selectedAnswerId?: string;
  loaderPhase: 'init' | 'questions' | 'result' | null;
  loaderVisible: boolean;
  loaderMinDuration: number;
}

const initialState: QuizState = {
  session: null,
  status: 'idle',
  error: null,
  lastAnswerCorrect: null,
  result: null,
  currentIndex: 0,
  selectedAnswerId: undefined,
  loaderPhase: 'init',
  loaderVisible: false,
  loaderMinDuration: 500,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetQuizStore: (state) => {
      state.session = null;
      state.status = 'idle';
      state.error = null;
      state.lastAnswerCorrect = null;
      state.result = null;
      state.currentIndex = 0;
      state.selectedAnswerId = undefined;
      state.loaderPhase = 'init';
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    setSelectedAnswerId: (state, action) => {
      state.selectedAnswerId = action.payload;
    },
    setLoaderPhase: (state, action) => {
      state.loaderPhase = action.payload;
    },
    setLoaderVisible: (state, action) => {
      state.loaderVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchQuizSession.pending, (state) => {
      state.status = 'loading';
      state.error = null;
      state.session = null;
      state.result = null;
      state.loaderVisible = true;
      state.loaderPhase = 'init';
    })
    .addCase(fetchQuizSession.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.session = action.payload;
      state.loaderPhase = null;
      // Loader bleibt sichtbar, wird aber erst nach Delay ausgeblendet (siehe Thunk)
    })
    .addCase(fetchQuizSession.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Fehler';
      state.loaderPhase = null;
      // Loader bleibt sichtbar, wird aber erst nach Delay ausgeblendet (siehe Thunk)
    })
    // Antwort absenden
    .addCase(submitAnswer.pending, (state) => {
      state.status = 'loading';
      state.error = null;
      state.lastAnswerCorrect = null;
      state.loaderVisible = true;
      state.loaderPhase = 'questions';
    })
    .addCase(submitAnswer.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.lastAnswerCorrect = action.payload.correct;
      state.loaderPhase = null;
      // Loader bleibt sichtbar, wird aber erst nach Delay ausgeblendet (siehe Thunk)
    })
    .addCase(submitAnswer.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Fehler';
      state.loaderPhase = null;
      // Loader bleibt sichtbar, wird aber erst nach Delay ausgeblendet (siehe Thunk)
    })
    // Ergebnis holen
    .addCase(fetchQuizResult.pending, (state) => {
      state.status = 'loading';
      state.error = null;
      state.loaderVisible = true;
      state.loaderPhase = 'result';
    })
    .addCase(fetchQuizResult.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.result = action.payload;
      state.loaderPhase = null;
      // Loader bleibt sichtbar, wird aber erst nach Delay ausgeblendet (siehe Thunk)
    })
    .addCase(fetchQuizResult.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Fehler';
      state.loaderPhase = null;
      // Loader bleibt sichtbar, wird aber erst nach Delay ausgeblendet (siehe Thunk)
    });
  },
});

export const { resetQuizStore, setCurrentIndex, setSelectedAnswerId, setLoaderPhase, setLoaderVisible } = quizSlice.actions;

export default quizSlice.reducer;