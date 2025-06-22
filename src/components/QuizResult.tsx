import * as stylex from '@stylexjs/stylex'
import type { QuizResult } from '../types/quiz'

const styles = stylex.create({
  container: {
    marginTop: '1rem',
    backgroundColor: '#e2e8f0',
    padding: '1rem',
    borderRadius: '4px',
  },
})

interface Props {
  result: QuizResult
}

export default function QuizResult({ result }: Props) {
  return (
    <div {...stylex.props(styles.container)}>
      Score: {result.score} / {result.total}
    </div>
  )
}
