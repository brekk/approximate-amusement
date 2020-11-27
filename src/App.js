import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

// -100 - 100 sentiment-o-meter
const SENTIMENTS = [
  'Terrible!',
  'Weak!',
  'Poor!',
  'Bad!',
  'Meh.',
  'Not great.',
  'Okay.',
  'Decent.',
  'Good.',
  'Great!'
]

// scale number values from `randoNum` down to array indices
const getSentiment = n => {
  const scale = SENTIMENTS.length
  return Math.floor(Math.floor(n / scale) / 2) + Math.floor(scale / 2)
}

// scale number values from `randoNum` down to array indices, and use that index to indicate enthusiasm
const enthusiasm = n => {
  return SENTIMENTS[getSentiment(n)]
}
const CONSTANTS = Object.freeze({ LIMIT: 9, UNSET: -1000 })
const { LIMIT, UNSET } = CONSTANTS

// generate a random number
// NB: Math.random is very non-random, but fine for these porpoises 🐬
// randoNum :: x -> Number
const randoNum = () => {
  const x = Math.floor(Math.random() * 100)
  if (Math.round(Math.random() * 1) === 1) {
    return x * -1
  }
  return x
}

// sendScoreWithContext :: Context -> Event -> Void
const sendScoreWithContext = ({ score, name, setMessage }) => e => {
  e.preventDefault()
  if (!score || !name) setMessage('You must write your name.')
}

// attemptWithContext :: Context -> Event -> Void
const attemptWithContext = context => e => {
  const {
    score,
    saved,
    count,
    setCount,
    setScore,
    setMessage,
    setSaved
  } = context
  e.preventDefault()
  if (count <= LIMIT) {
    const newCount = count + 1
    const newVal = randoNum()
    setCount(newCount)
    setScore(newVal)
    setMessage(
      count < LIMIT
        ? `Rating: "${enthusiasm(
            newVal
          )}" You've guessed ${newCount} / 10 times! Submit or try your luck again?`
        : `Rating: "${enthusiasm(
            score
          )}" You've guessed 10 times! You can only submit this score!`
    )
    setSaved(saved.concat([[newVal, enthusiasm(newVal), newCount]]))
  }
}

const App = ({ debug }) => {
  const [tryAgain, toggle] = useState(true)
  const [saved, setSaved] = useState([])
  const [msg, setMessage] = useState(
    'Try to generate the highest score possible, best score of 10 wins!'
  )
  const [score, setScore] = useState(UNSET)
  const [name, setName] = useState('')
  const [count, setCount] = useState(0)
  // done this way so that we can keep the size of App down to a human-consumeable size -- easy to invert if needed
  // context :: Context
  const context = {
    count,
    setCount,
    setScore,
    setMessage,
    setSaved,
    name,
    score,
    saved
  }
  const allowAnotherAttempt = count <= LIMIT
  const attemptButton = allowAnotherAttempt ? (
    <button name="score" onClick={attemptWithContext(context)}>
      Attempt
    </button>
  ) : null
  const submitName =
    saved.length > 0 ? (
      <>
        <label htmlFor="name">Your Name</label>
        <input
          defaultValue={name}
          name="name"
          onChange={e => setName(e.target.value)}
        />
        <button name="submit" onClick={sendScoreWithContext(context)}>
          Submit
        </button>
      </>
    ) : null
  return (
    <section>
      <h1>Guessing Game</h1>
      {score !== UNSET && <h2>Score: {score}</h2>}
      {msg && <p>{msg}</p>}
      <ul>
        <li>
          <input
            type="radio"
            id="try-again-or-submit"
            name="again"
            value="again"
            checked={tryAgain}
            onClick={e => toggle(!tryAgain)}
          />
          <label htmlFor="try-again-or-submit">Again</label>
        </li>
        <li>
          <input
            type="radio"
            id="try-again-or-submit"
            name="submit"
            value="submit"
            checked={!tryAgain}
            onClick={e => toggle(!tryAgain)}
          />
          <label htmlFor="try-again-or-submit">Submit</label>
        </li>
      </ul>
      {tryAgain ? attemptButton : submitName}
      <br />
      {debug && (
        <pre>
          <code>{JSON.stringify(saved, null, 2)}</code>
        </pre>
      )}
    </section>
  )
}

export default App
