import { useState, useEffect } from 'react'
import blem from 'blem'
import { css } from '@emotion/css'
import {
  sortBy,
  slice,
  last,
  prop,
  curry,
  range,
  map,
  pipe
} from 'ramda'
// import { Button } from 'rebass'
import { Label, Input, Radio } from '@rebass/forms'
import {
  Game,
  AttemptButton,
  TryAgain,
  SubmitScore,
  Message,
  Button,
  Options,
  Option,
  SendScore,
  UserLabel,
  UserName
} from './App.styled'
import logo from './logo.svg'

import api from './api'
import { enthusiasm, randoNum } from './utils'
import { UNSET, LIMIT } from './constants'

const bem = blem('GuessApp')
const sortByScore = sortBy(pipe(prop('score'), z => z * -1))

const Leaderboard = ({ scores, givenName }) =>
  console.log('SCORES', scores) || (
    <table>
      <thead>
        <tr>
          <th colspan="3">
            <strong>Leaderboard</strong>
          </th>
        </tr>
        <tr>
          <th>Name</th>
          <th>Clicks</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {pipe(
          sortByScore,
          slice(0, 10),
          map(({ name, fake, clicks, score }) => (
            <tr key={name} className={fake ? 'fake' : ''}>
              <td>{fake ? givenName : name}</td>
              <td>{clicks}</td>
              <td>{score}</td>
            </tr>
          ))
        )(scores)}
      </tbody>
    </table>
  )

const isTopValue = curry((knownValues, x) =>
  pipe(
    sortByScore,
    slice(0, 10),
    last,
    prop('score'),
    lowestTopScore => x > lowestTopScore
  )(knownValues)
)

const App = ({ debug }) => {
  // convention for easier scanning: $-prefixed values come from `useState`
  const [$status, setStatus] = useState('loading')
  const [$tryAgain, setTryAgain] = useState(true)
  const [$saved, setSaved] = useState([])
  const [$msg, setMessage] = useState(
    'Try to generate the highest score possible, best score of 10 wins!'
  )
  const [$score, setScore] = useState(UNSET)
  const [$name, setName] = useState('???')
  const [$count, setCount] = useState(0)
  const [$serverScores, setServerScores] = useState([])
  const [$requestCount, setRequestCount] = useState(0)
  // sendScoreWithContext :: Event -> Void
  const sendScore = e => {
    e.preventDefault()
    if (!$score || !$name) {
      if (!$score) setMessage('You must try your luck first!')
      if (!$name) setMessage('You must write your name.')
      return
    }
    api
      .addAScore({ name: $name, score: $score, clicks: $count })
      .catch(err => setMessage(err.toString()))
      .then(x => {
        setMessage('Saved!')
        api
          .fetchAllScores()
          .catch(z => {
            console.error('error on request', z)
            setMessage(
              'Unable to access server, is the backend running?'
            )
            setStatus('error')
          })
          .then(data => {
            if (data) {
              setServerScores(data)
              setName('???')
              setTryAgain(true)
              setScore(UNSET)
              setCount(0)
            }
          })
      })
  }

  // attemptWithContext :: Event -> Void
  const attempt = e => {
    e.preventDefault()
    if ($count <= LIMIT) {
      const newCount = $count + 1
      const newVal = randoNum()
      const isGoodScore =
        $serverScores.length > 0 && isTopValue($serverScores, newVal)
      if (isGoodScore) {
        setServerScores(
          $serverScores.concat({
            name: $name || '???',
            clicks: newCount,
            score: newVal,
            fake: true
          })
        )
      }
      const tellTheUserWhatToDo = isGoodScore
        ? `You should submit this!`
        : `Rating: ${enthusiasm(newVal)}`
      setCount(newCount)
      setScore(newVal)
      setMessage(
        $count < LIMIT
          ? `${tellTheUserWhatToDo} You've guessed ${newCount} / 10 times! Submit or try your luck again?`
          : `${tellTheUserWhatToDo} You've guessed 10 times! You can only submit this score!`
      )
      setSaved(
        $saved.concat([[newVal, enthusiasm(newVal), newCount]])
      )
    }
  }
  const allowAnotherAttempt = $count <= LIMIT
  const attemptButton = allowAnotherAttempt ? (
    <AttemptButton
      className={bem('button', 'attempt')}
      name="score"
      onClick={attempt}
    >
      Generate!
    </AttemptButton>
  ) : null
  const submitName =
    $saved.length > 0 ? (
      <SendScore>
        <UserLabel className={bem('label', 'name')} htmlFor="name">
          Your Name
        </UserLabel>
        <UserName
          className={bem('input', 'name')}
          defaultValue={$name}
          name="name"
          onChange={e => setName(e.target.value)}
        />
        <Button
          name="submit"
          onClick={sendScore}
          className={bem('button', 'submit')}
        >
          Submit
        </Button>
      </SendScore>
    ) : null
  useEffect(() => {
    if ($serverScores.length === 0 && $requestCount < 3) {
      api
        .fetchAllScores()
        .catch(z => {
          console.error('error on request', z)
          // setMessage(z.toString())
          setMessage(
            'Unable to access server, is the backend running?'
          )
          setStatus('error')
        })
        .then(data => {
          console.log('RAW DATA', data)
          if (data) {
            setServerScores(data)
          }
        })
      setRequestCount($requestCount + 1)
    }
  }, [$serverScores, $requestCount])
  return (
    <Game>
      <h1>Guessing Game</h1>
      {$score !== UNSET && <h2>Score: {$score}</h2>}
      {$msg && <Message>{$msg}</Message>}
      {$status !== 'error' ? (
        <>
          {$tryAgain ? attemptButton : null}
          {$count ? (
            <Options>
              <Option>
                <TryAgain
                  htmlFor="try-again-or-submit"
                  active={$tryAgain}
                >
                  {$count ? 'Try again!' : 'Try your luck!'}
                  <Radio
                    id="try-again-or-submit"
                    name="try-again-or-submit"
                    value={$tryAgain}
                    checked={$tryAgain}
                    onClick={e => setTryAgain(!$tryAgain)}
                  />
                </TryAgain>
              </Option>
              {$count ? (
                <Option>
                  <SubmitScore
                    htmlFor="try-again-or-submit"
                    active={!$tryAgain}
                  >
                    <Radio
                      id="try-again-or-submit"
                      name="try-again-or-submit"
                      value={!$tryAgain}
                      checked={!$tryAgain}
                      onClick={e => setTryAgain(!$tryAgain)}
                    />
                    Submit
                  </SubmitScore>
                </Option>
              ) : null}
            </Options>
          ) : null}
          {!$tryAgain ? submitName : null}
          {$serverScores.length ? (
            <Leaderboard scores={$serverScores} givenName={$name} />
          ) : null}
        </>
      ) : null}
    </Game>
  )
}

export default App
