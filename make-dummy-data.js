const T = require('torpor')
const R = require('ramda')
const Chance = require('chance')
const F = require('fluture')
const { trace } = require('xtrace')

const TOTAL_PEOPLE = 100
const C = new Chance()
const name = () => C.name()

const j2 = x => JSON.stringify(x, null, 2)

const sometimes = () => Math.round(Math.random() * 1) === 0

const slugWithReplacement = R.curry((delimiter, x) =>
  x.toLowerCase().replace(/\s/g, delimiter).replace(/'/g, '')
)

const slug = slugWithReplacement('_')
const username = () =>
  R.pipe(([n, a]) => {
    const lastSpace = a.lastIndexOf(' ')
    const suffix = sometimes() ? '' : Math.round(Math.random() * 1e4)
    return (
      n.toLowerCase().slice(0, n.indexOf(' ')) +
      '_' +
      slug(lastSpace > -1 ? a.slice(lastSpace, Infinity) : a) +
      suffix
    ).replace(/__/g, '_')
  })([name(), C.animal()])

const makeNames = () =>
  R.pipe(
    R.range(0),
    R.map(name),
    // trace('NAMES'),
    R.map(z => {
      return sometimes()
        ? z
        : sometimes()
        ? slugWithReplacement(' ', z)
        : slug(z)
    })
  )(Math.round(TOTAL_PEOPLE / 2))

const makeUsernames = () =>
  R.pipe(
    R.range(0),
    R.map(username)
    // trace('USERNAMES')
  )(Math.round(TOTAL_PEOPLE / 2))

const makeScores = () =>
  R.pipe(
    makeNames,
    R.concat(makeUsernames()),
    // trace('allNames'),
    z => C.shuffle(z),
    R.map(
      R.pipe(R.objOf('name'), x =>
        R.mergeRight(x, {
          score: C.integer({ min: -100, max: 100 }),
          clicks: C.integer({ min: 1, max: 10 })
        })
      )
    ),
    R.objOf('data'),
    R.mergeRight({ meta: { generatedBy: 'half-baked' } }),
    // trace('scores'),
    j2,
    // trace('json'),
    T.writeFile(process.cwd() + '/dummy.json', R.__, 'utf8'),
    F.fork(console.error)(() =>
      console.log(
        "Generated dummy.json"
      )
    )
  )()

const SCORES = makeScores()
