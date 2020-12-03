const { fork, chain } = require('fluture')
const { writeFile } = require('torpor')
const { merge, pipe, __ } = require('ramda')

const md = require('half-baked')

const jj = nn => xx => JSON.stringify(xx, null, nn)
const j0 = jj(0)
// const j2 = jj(2)

const slugify = x => x.toLowerCase().replace(/\W/g, '-')

const CONFIG = {
  PORT: 3001,
  STORAGE: {
    BRAIN: 'data.json',
    BACKUP: 'data.json.bak'
  },
  logging: false,
  onPostRoot: ({ updateBrain }) => (req, res, next) => {
    const { body } = req
    const update = raw =>
      merge(raw, { data: (raw.data || []).concat(body) })
    pipe(fork(next)(() => res.json({ saved: true })))(
      updateBrain(update)
    )
  }
}

fork(console.warn)(({ config }) => {
  const storage = `(${config.STORAGE.BRAIN})`
  const accessPath = config.STORAGE.ACCESS_PATH
  const accessString = accessPath.slice(0, -1).join('.') + '[id]'
  const host = `http://localhost:${config.PORT}`
  console.log(`
        .       .  .
,-. ,-. |-. ,-. |  |-
|   | | | | ,-| |  |
\`-' \`-' \`-' \`-^ \`' \`'.IO
======== ${host} =======================================
    HEAD ${host}/    ~ 204
    GET  ${host}/    ~ 200 + ${storage}
    POST ${host}/    ~ {data, meta: {modified}}
`)
})(md(CONFIG))
