export type LoaderState = {
  visible: boolean;
  phase: 'init' | 'questions' | 'result' | null;
  error: string | null;
};

