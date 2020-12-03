export const SENTIMENTS = [
  'Abysmal!', // -100          | 0
  'Terrible!', // -90          | 1
  'Bad!', // -80               | 2
  'Poor!', // -70              | 3
  'Weak.', // -60              | 4
  'Pedestrian.', // -50        | 5
  'Pretty poor.', // -40       | 6
  'You can do better.', // -30 | 7
  'Not good.', // -20          | 8
  'Do better.', // -10         | 9
  'Meh.', // 0                 | 10
  'Alright.', // 10            | 11
  'Keep trying.', // 20        | 12
  'Okay.', // 30               | 13
  'Decent.', // 40             | 14
  'Good.', // 50               | 15
  'Nice.', // 60               | 16
  'Great!', // 70              | 17
  'Awesome!', // 80            | 18
  'Fantastic!' // 90           | 19
]
export const SENTIMENTAL_COLORS = [
  '#ff0000',
  '#ff4444',
  '#ff5555',
  '#ff6666',
  '#ff7777',
  '#ff8888',
  '#ffaaaa',
  '#ffbbbb',
  '#ffdddd',
  '#ffcccc',
  '#ffffff', // <-- middle
  '#ccffcc',
  '#ddffdd',
  '#bbffbb',
  '#aaffaa',
  '#88ff88',
  '#77ff77',
  '#66ff66',
  '#44ff44',
  '#00ff00'
]
export const ATTEMPT_LIMIT = 9
export const UNSET_SCORE = -1000

export const STRINGS = Object.freeze({
  NAME_DEFAULT: '???',
  MESSAGE_DEFAULT:
    'Try to generate the highest score possible, best score of 10 wins!',
  MESSAGE_SAVED: 'Saved!',
  OPTION_AGAIN: 'Try again!',
  OPTION_CTA: 'Try your luck!',
  ERROR_USER_SCORE: 'You must try your luck first!',
  ERROR_USER_NAME: 'You must write your name.',
  ERROR_SYSTEM_BACKEND:
    'Unable to access server, is the backend running?',
  ENTREAT_USER_TO_SUBMIT: `Wow! You should submit this.`
})

export const STATUS_ERROR = `Something weird is happening. Maybe \`node backend.js\`?`
export const STATUS_LOADING = `default loading state`
