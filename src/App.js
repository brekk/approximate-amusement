import { useState, useEffect } from 'react'
import blem from 'blem'
import { Radio } from '@rebass/forms'
import { Leaderboard } from './Leaderboard'
import {
  Instructions,
  Score,
  Title,
  Header,
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

import api from './api'
import {
  enthusiasm,
  randoNum,
  realScoresOnly,
  isTopValue
} from './utils'
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

const App = ({ autofetch = true }) => {
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
    if (
      autofetch &&
      $serverScores.length === 0 &&
      $requestCount < 3
    ) {
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
  }, [autofetch, $serverScores, $requestCount])
  return (
    <Game>
      <Header>
        <Title>Approximate Amusement</Title>
        {$score === UNSET_SCORE ? (
          <Instructions>
            See if you can generate the highest number (-100 &ndash;
            100) and make it onto the Leaderboard!
          </Instructions>
        ) : (
          <Score>{$score}</Score>
        )}
        {$msg && <Message>{$msg}</Message>}
      </Header>
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
