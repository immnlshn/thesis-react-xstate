import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import QuizMachineContext from './QuizMachineContext.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuizMachineContext.Provider>
      <App />
    </QuizMachineContext.Provider>
  </StrictMode>
)
