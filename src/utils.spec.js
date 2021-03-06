import { objOf, pipe, map, range } from 'ramda'
// import { trace } from 'xtrace'
import {
  isTopValue,
  tackOn,
  enthusiasm,
  randoNum,
  within
} from './utils'

test('within', () => {
  expect(within(0, 10, -1)).toBeFalsy()
  expect(within(0, 10, 0)).toBeFalsy()
  expect(within(0, 10, 5)).toBeTruthy()
  expect(within(0, 10, 10)).toBeTruthy()
  expect(within(0, 10, 11)).toBeFalsy()
})

test('randoNum', () => {
  pipe(range(0), map(randoNum), ([a, b, c]) =>
    expect(a !== b && b !== c && a !== c).toBeTruthy()
  )(3)
})

test('enthusiasm', () => {
  const output = pipe(
    range(-12),
    map(z => z * 10),
    map(tackOn(enthusiasm))
  )(12)
  expect(output).toMatchSnapshot()
})

test('isTopValue', () => {
  const enoughValues = pipe(range(0), map(pipe(objOf('score'))))(12)
  expect(isTopValue(enoughValues, 100)).toBeTruthy()
  expect(isTopValue([], -1)).toBeTruthy()
})
