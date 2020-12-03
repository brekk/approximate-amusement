# approximate-amusement

guessing game built with react

# installing

```
git clone https://github.com/brekk/approximate-amusement.git
cd approximate-amusement
yarn
```

# running locally

This project uses [nps](https://www.npmjs.com/package/nps) for managing scripts.

If you do not want to run the `nps` commands, these examples are followed with how to run the command without `nps` as well.

# running the backend

This project uses [half-baked](https://www.npmjs.com/package/half-baked) to generate a simple and easy to manage backend which uses static files.

```
nps backend
node backend.js
```

# generating dummy data

This project _should_ work fine without dummy data (and thus, the dummy data has not been committed to the repo), but it makes the project much more interesting if you add it.

```
nps regen.data
node make-dummy-data.js && cp dummy.json data.json
```

NB: this command can be run while the server and the local frontend are running, though the page must be refreshed.

# running the frontend

This spins up the CRA-based application locally.

```
nps start
yarn start
npm run start
```

If you run the frontend without the backend running, it will yell at (maybe, gently chide) you to run the backend.

# choices

This project uses a number of different packages:

- `emotion` for styling with CSS-in-JS using the `styled-components` approach
- `rebass` for building blocks
- `blem` for BEM notation (my library)
- `half-baked` for a backend-server solution (my library)
- `ramda` for function utilities - if the syntax used is unfamiliar or if currying is new to you, I highly recommend [this book](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/content/) or [this post by this big nerd I know](https://codepen.io/brekk/post/functional-workaholism).

# shortcomings

With more time I would have spent it on:
- improving the appearance of things
- improving the test quality for React components
- making more things unequivocal - some things are moved up and out into constants, but there's a lot of free strings littered about the place

