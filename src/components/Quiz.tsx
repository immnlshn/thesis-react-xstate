import { useEffect } from 'react'
import * as stylex from '@stylexjs/stylex'
import Question from './Question'
import QuizResult from './QuizResult'
import { useAppDispatch, useAppSelector } from '../utils/hooks'
import {
  startQuiz,
  submitAnswer,
  fetchResult,
} from '../features/quiz/quizSlice'
import type { Question as QuestionType } from '../types/quiz'

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  heading: { fontSize: '2rem' },
  finishButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#646cff',
    color: '#fff',
  },
})

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
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>Quiz</h1>
      {status === 'loading' && <p>Loading...</p>}
      {questions.map((q: QuestionType) => (
        <Question key={q.id} question={q} onAnswer={handleAnswer} />
      ))}
      {sessionId && !result && (
        <button {...stylex.props(styles.finishButton)} onClick={handleFinish}>
          Finish Quiz
        </button>
      )}
      {result && <QuizResult result={result} />}
    </div>
  )
}
