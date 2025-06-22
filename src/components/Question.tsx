import * as stylex from '@stylexjs/stylex'
import type { Question } from '../types/quiz'

const styles = stylex.create({
  container: { marginBottom: '1rem' },
  button: {
    marginRight: '0.5rem',
    padding: '0.25rem 0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
