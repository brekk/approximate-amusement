import { useState, useEffect } from 'react'
import blem from 'blem'
import { css } from '@emotion/css'
import {
  ifElse,
  reject,
  propEq,
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
import {
  STATUS_LOADING,
  STATUS_ERROR,
  STRINGS,
  UNSET_SCORE,
  ATTEMPT_LIMIT
} from './constants'

const {
  NAME_DEFAULT,
  OPTION_AGAIN,
  OPTION_CTA,
  ERROR_SYSTEM_BACKEND,
  MESSAGE_DEFAULT,
  MESSAGE_SAVED,
  ERROR_USER_SCORE,
  ERROR_USER_NAME,
  ENTREAT_USER_TO_SUBMIT
} = STRINGS

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
  ifElse(
    z => z.length < 10,
    () => true,
    pipe(
      sortByScore,
      slice(0, 10),
      last,
      prop('score'),
      lowestTopScore => x > lowestTopScore
    )
  )(knownValues)
)

const realScoresOnly = reject(propEq('fake', true))

const App = ({ debug }) => {
  // convention for easier scanning: $-prefixed values come from `useState`
  const [$status, setStatus] = useState(STATUS_LOADING)
  const [$tryAgain, setTryAgain] = useState(true)
  const [$saved, setSaved] = useState([])
  const [$msg, setMessage] = useState(MESSAGE_DEFAULT)
  const [$score, setScore] = useState(UNSET_SCORE)
  const [$name, setName] = useState(NAME_DEFAULT)
  const [$count, setCount] = useState(0)
  const [$serverScores, setServerScores] = useState([])
  const [$requestCount, setRequestCount] = useState(0)
  // sendScoreWithContext :: Event -> Void
  const sendScore = e => {
    e.preventDefault()
    if (!$score || !$name) {
      if (!$score) setMessage(ERROR_USER_SCORE)
      if (!$name) setMessage(ERROR_USER_NAME)
      return
    }
    api
      .addAScore({ name: $name, score: $score, clicks: $count })
      .catch(err => setMessage(err.toString()))
      .then(x => {
        setMessage(MESSAGE_SAVED)
        api
          .fetchAllScores()
          .catch(z => {
            console.error('error on request', z)
            setMessage(ERROR_SYSTEM_BACKEND)
            setStatus(STATUS_ERROR)
          })
          .then(data => {
            if (data) {
              setServerScores(data)
              setName(NAME_DEFAULT)
              setTryAgain(true)
              setScore(UNSET_SCORE)
              setCount(0)
              setMessage(MESSAGE_DEFAULT)
              setStatus(STATUS_LOADING)
              setSaved([])
              setTryAgain(true)
            }
          })
      })
  }

  // attemptWithContext :: Event -> Void
  const attempt = e => {
    e.preventDefault()
    if ($count <= ATTEMPT_LIMIT) {
      const newCount = $count + 1
      const newVal = randoNum()

      const canTryAgain = $count < ATTEMPT_LIMIT
      const isGoodScore =
        $serverScores.length > 0
          ? isTopValue($serverScores, newVal)
          : true
      if (isGoodScore) {
        setServerScores(
          realScoresOnly($serverScores).concat({
            name: $name || NAME_DEFAULT,
            clicks: newCount,
            score: newVal,
            fake: true
          })
        )
      } else {
        setServerScores(realScoresOnly($serverScores))
      }
      const tellTheUserWhatToDo = isGoodScore
        ? ENTREAT_USER_TO_SUBMIT
        : `Rating: ${enthusiasm(newVal)}`
      setCount(newCount)
      setScore(newVal)
      setMessage(
        canTryAgain
          ? `${tellTheUserWhatToDo} You've guessed ${newCount} / 10 times! Submit or try your luck again?`
          : `${tellTheUserWhatToDo} You've guessed 10 times! You can only submit this score!`
      )
      setSaved(
        $saved.concat([[newVal, enthusiasm(newVal), newCount]])
      )
      if (!canTryAgain) setTryAgain(false)
    }
  }
  const allowAnotherAttempt = $count <= ATTEMPT_LIMIT
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
          setMessage(ERROR_SYSTEM_BACKEND)
          setStatus(STATUS_ERROR)
        })
        .then(data => {
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
      {$score !== UNSET_SCORE && <h2>Score: {$score}</h2>}
      {$msg && <Message>{$msg}</Message>}
      {$status !== STATUS_ERROR ? (
        <>
          {$tryAgain ? attemptButton : null}
          {$count ? (
            <Options>
              <Option>
                <TryAgain
                  htmlFor="try-again-or-submit"
                  active={$tryAgain}
                >
                  {$count ? OPTION_AGAIN : OPTION_CTA}
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
