import { apiWrapper, hardThrow } from './api'

const fakeData = [{ name: 'brekk', score: 100, clicks: 1 }]

test('hardThrow', () => {
  expect(() => hardThrow('yes')).toThrow()
  expect(() => hardThrow(new Error('yes'))).toThrow()
})

test('apiWrapper - fetch all scores', done => {
  const api = apiWrapper(() =>
    Promise.resolve({ data: { data: fakeData } })
  )
  api
    .fetchAllScores()
    .catch(done)
    .then(x => {
      expect(x).toEqual(fakeData)
      done()
    })
})

test('apiWrapper - add a score', done => {
  const api = apiWrapper(right => {
    expect(right).toEqual({ method: 'POST', data: 'whatever' })
    return Promise.resolve(right)
  })
  api
    .addAScore('whatever')
    .catch(done)
    .then(() => {
      done()
    })
})
