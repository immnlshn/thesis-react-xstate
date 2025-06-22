import * as stylex from '@stylexjs/stylex'
import Quiz from './components/Quiz'

const styles = stylex.create({
  app: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
  },
})

export default function App() {
  return (
    <div {...stylex.props(styles.app)}>
      <Quiz />
    </div>
  )
}
