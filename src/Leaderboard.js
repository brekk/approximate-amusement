import { pipe, slice, map } from 'ramda'
import { sortByScore } from './utils'

export const Leaderboard = ({ scores, givenName }) => (
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
