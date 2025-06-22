import './App.css'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { startQuiz, submitAnswer, fetchResult } from './features/quiz/quizSlice'

function App() {
  const dispatch = useAppDispatch()
  const { sessionId, questions, result, status } = useAppSelector((s) => s.quiz)

  useEffect(() => {
    dispatch(startQuiz())
  }, [dispatch])

  const handleAnswer = (qId: string, aId: string) => {
    if (!sessionId) return
    dispatch(submitAnswer({ sessionId, questionId: qId, answerId: aId }))
  }

  const handleFinish = () => {
    if (sessionId) dispatch(fetchResult(sessionId))
  }

  return (
    <div>
      <h1>Quiz</h1>
      {status === 'loading' && <p>Loading...</p>}
      {questions.map((q) => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.answers.map((a) => (
            <button key={a.id} onClick={() => handleAnswer(q.id, a.id)}>
              {a.text}
            </button>
          ))}
        </div>
      ))}
      {sessionId && !result && (
        <button onClick={handleFinish}>Finish Quiz</button>
      )}
      {result && (
        <p>
          Score: {result.score} / {result.total}
        </p>
      )}
    </div>
  )
}

export default App
