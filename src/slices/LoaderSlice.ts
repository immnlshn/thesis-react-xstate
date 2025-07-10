import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoaderState } from '../state/LoaderState';

const initialState: LoaderState = {
  visible: false,
  phase: null,
  error: null,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoaderState(state, action: PayloadAction<{ phase: 'init' | 'questions' | 'result' | null; error: string | null }>) {
      state.phase = action.payload.phase;
      state.error = action.payload.error;
    },
    resetLoaderState(state) {
      state.phase = null;
      state.error = null;
    },
    setLoaderVisibility(state, action: PayloadAction<boolean>) {
      state.visible = action.payload;
    },
  },
});

export const { setLoaderState, resetLoaderState, setLoaderVisibility } = loaderSlice.actions;
export default loaderSlice.reducer;
