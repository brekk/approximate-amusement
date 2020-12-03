import { pipe, map, range } from 'ramda'
// import { trace } from 'xtrace'
import { tackOn, enthusiasm, randoNum, within } from './utils'

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
    range(-10),
    map(z => z * 10),
    map(tackOn(enthusiasm))
  )(11)
  expect(output).toEqual([
    [-100, 'Abysmal!'],
    [-90, 'Abysmal!'],
    [-80, 'Terrible!'],
    [-70, 'Bad!'],
    [-60, 'Poor!'],
    [-50, 'Weak.'],
    [-40, 'Pedestrian.'],
    [-30, 'Pretty poor.'],
    [-20, 'You can do better.'],
    [-10, 'Not good.'],
    [0, '😕'],
    [10, 'Meh.'],
    [20, '🙂'],
    [30, 'Alright.'],
    [40, 'Okay.'],
    [50, 'Decent.'],
    [60, 'Good.'],
    [70, 'Nice.'],
    [80, 'Great!'],
    [90, 'Awesome!'],
    [100, 'Fantastic!']
  ])
})
