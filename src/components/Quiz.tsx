import { useEffect } from 'react'
import Question from './Question'
import QuizResult from './QuizResult'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import { startQuiz, submitAnswer, fetchResult } from '../features/quiz/quizSlice'
import type { Question as QuestionType } from '../types/quiz'

export default function Quiz() {
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
      {questions.map((q: QuestionType) => (
        <Question key={q.id} question={q} onAnswer={handleAnswer} />
      ))}
      {sessionId && !result && (
        <button onClick={handleFinish}>Finish Quiz</button>
      )}
      {result && <QuizResult result={result} />}
    </div>
  )
}
