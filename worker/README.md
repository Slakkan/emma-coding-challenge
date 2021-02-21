# FEATURE: CLIENTS PAGE
**version:** 1.01

### Index
- Created a handler for putClients

### redis-manager.ts
- Created addClientList method to store a user list of clients
- fixed bug in addClient method that made it override previous information

### firebase-manager.ts
- Created a getAllUsers method which somehow I didn't end up using but will leave it as it seems useful
- Modified several methods to transform the firebase data into arrays as it seems firebase stores arrays as objects of type { [index]:value }

### firebase-utils
- Created the arrayFromFirebaseObject function

---
# INITIAL COMMIT
**version:** 1.00

### Global
- Configured docker for development
- Created gitignore
- Configured redis
- Created mockClient
- Created Client model
- Set redis environment variables

### Index
- Created a handler for postClients
- Created a handler for getClients

### redis-manager.ts
- Created addClient method
- Created getClient method

### redis-utils.ts
- Added methods to transform redis hset and hget callbacks into Observables