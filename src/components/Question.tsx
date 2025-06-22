import * as stylex from '@stylexjs/stylex'
import type { Question } from '../types/quiz'

const styles = stylex.create({
  container: {
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
  },
  button: {
    marginRight: '0.5rem',
    padding: '0.25rem 0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
})

interface Props {
  question: Question
  onAnswer: (questionId: string, answerId: string) => void
}

export default function Question({ question, onAnswer }: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      <p>{question.text}</p>
      {question.answers.map((a) => (
        <button
          key={a.id}
          {...stylex.props(styles.button)}
          onClick={() => onAnswer(question.id, a.id)}
        >
          {a.text}
        </button>
      ))}
    </div>
  )
}
