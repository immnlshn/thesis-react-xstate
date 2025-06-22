import type { QuizResult } from '../types/quiz'

interface Props {
  result: QuizResult
}

export default function QuizResult({ result }: Props) {
  return (
    <p>
      Score: {result.score} / {result.total}
    </p>
  )
}
