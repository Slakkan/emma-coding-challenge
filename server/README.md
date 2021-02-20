
---
# INITIAL COMMIT
**version:** 1.00

### Global
- Configured docker for development
- Created gitignore
- Configured firebase
- Set firebase environment variables
- Set redis environment variables
- Configured express server
- Configured express middleware

### Utils
- Created a type checking util
- Added AppClient type checking to type.util

### Configured tsconfig.json
- To compile to commonjs
- To compile from ./src into ./dist
- Enabled strict type checking

### firebase-manager.ts
- Added validateFirebaseToken method to authenticate the Google JWT token
- Added test method to push data onto the users reference

### POST/clients endpoint
- Created the endpoint
- Checked if data is correct
- Check if data was uploaded correctly
- Save data to redis

### GET/clients endpoint
- Created the endpoint
- Send payload to the worker
- Listen for worker response