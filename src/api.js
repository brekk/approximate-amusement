import { defaultTo, pathOr, pipe, curry, merge } from 'ramda'
import { trace } from 'xtrace'
import axios from 'axios'
import { sortByScore } from './utils'

const config = { BACKEND: { DOMAIN: 'localhost', PORT: '3001' } }

const BACKEND =
  'http://' + config.BACKEND.DOMAIN + ':' + config.BACKEND.PORT
const askServer = pipe(merge({ url: BACKEND, method: 'get' }), axios)

const then = curry((fn, thenable) => thenable.then(fn))
const snag = curry((fn, thenable) => thenable.catch(fn))

export const hardThrow = e => {
  if (e instanceof Error) throw e
  throw new Error('General problem in the computer unit.')
}

export const apiWrapper = phone => ({
  fetchAllScores: () =>
    pipe(
      defaultTo({}),
      phone,
      snag(hardThrow),
      then(pipe(pathOr([], ['data', 'data']), sortByScore))
    )(),
  addAScore: data =>
    pipe(
      phone,
      trace('raw'),
      snag(hardThrow),
      then(console.log)
    )({ method: 'POST', data })
})

export const api = apiWrapper(askServer)
export default api
