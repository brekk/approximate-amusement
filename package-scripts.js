module.exports = {
  scripts: {
    start: 'react-scripts start',
    build: 'react-scripts build',
    test: 'react-scripts test',
    eject: 'react-scripts eject',
    lint: 'eslint src --fix',
    backend: 'node backend.js',
    regenerate: {
      data: 'node make-dummy-data.js && cp dummy.json data.json'
    }
  }
}
