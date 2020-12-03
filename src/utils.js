import {
  propEq,
  ifElse,
  slice,
  last,
  reject,
  memoizeWith,
  identity as I,
  curry,
  cond,
  sortBy,
  pipe,
  prop,
  T as otherwise
} from 'ramda'
import { SENTIMENTS } from './constants'

const memo = memoizeWith(I)

export const within = curry(
  (lower, upper, x) => x <= upper && x > lower
)
// scale number values from `randoNum` down to array indices
// TODO, this `cond` is unwieldy, change it if we have time
const sentimeter = x => () => SENTIMENTS[x]
export const enthusiasm = memo(
  cond([
    [within(-110, -90), sentimeter(0)],
    [within(-90, -80), sentimeter(1)],
    [within(-80, -70), sentimeter(2)],
    [within(-70, -60), sentimeter(3)],
    [within(-60, -50), sentimeter(4)],
    [within(-50, -40), sentimeter(5)],
    [within(-40, -30), sentimeter(6)],
    [within(-30, -20), sentimeter(7)],
    [within(-20, -10), sentimeter(8)],
    [within(-10, 0), sentimeter(9)],
    [within(0, 10), sentimeter(10)],
    [within(10, 20), sentimeter(11)],
    [within(20, 30), sentimeter(12)],
    [within(30, 40), sentimeter(13)],
    [within(40, 50), sentimeter(14)],
    [within(50, 60), sentimeter(15)],
    [within(60, 70), sentimeter(16)],
    [within(70, 80), sentimeter(17)],
    [within(80, 90), sentimeter(18)],
    [within(90, 110), sentimeter(19)],
    [otherwise, sentimeter(10)]
  ])
)

// generate a random number
// NB: Math.random is very non-random, but fine for these porpoises 🐬
// randoNum :: x -> Number
export const randoNum = () => {
  const x = Math.floor(Math.random() * 100)
  if (Math.round(Math.random() * 1) === 1) {
    return x * -1
  }
  return x
}

export const tackOn = curry((fn, z) => [z, fn(z)])
export const sortByScore = sortBy(pipe(prop('score'), z => z * -1))

export const isTopValue = curry((knownValues, x) =>
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

export const realScoresOnly = reject(propEq('fake', true))
