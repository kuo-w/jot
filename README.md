# Jot

Text entry for recording thoughts.

Data can be kept offline or synced to cloud where it's stored in NoSQL database Firestore.

Only authenticating Google users and guests for current use case.

## Built With

- TypeScript
- Redux + Redux Toolkit
- React Navigation
- Firebase
- Expo

## Getting started

### Configure credentials

See `credential.default.js` and `app.json.example`.

Copy the files without the `.default` or `.example` and fill in the details.

### Development

- `npm install`
- `npm start`
- open app using Expo options in phone or emulator

## Tests

Currently only performs tests on APIs and Redux state.

Tests are saved in the same folder as the file being tested.

Run them using `npm run test`.

## Deployment

Not published on any app store.

APKs can be created with `npm run build`.

Expo creates a standalone build and makes it available to download.

