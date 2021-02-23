
# FEATURE: QUERIES AND DELETE CLIENT
**version:** 1.02

## Features
- **Search**: you can now search a client by name
- **View Active**: you can now filter out inactive clients
- **App style redesing**: app nows looks better ;)
- **Delete clients:** click on the trashcan to delete a client

---
# FEATURE: CLIENTS PAGE
**version:** 1.01

## Features
- **clients table:** a table with a list of your clients
- **Create clients:** you can now add data to the database in a user friendly way
- **Edit clients:** added functionallity to edit clients
- **Pagination:** you can choose how many clients to see per page
- **Sorting:** for now you can only sort by client name ascending or descending

---
# INITIAL COMMIT
**version:** 1.00

## Features
- **Google authentication:** the user can now login with classic google pop up.
- **Mock Requests:** On login the user posts a clients data to our cloud servers and saves
same data on redis cache. Also does a request to getClients to get all previously saved ones.

### Initial considerations
- I decided to use firebase to have a quick and well done JWT tokens implementation.
- Requesting data to the server and then from firebase is slow, the solution I came up
with was to cache the data inside a redis in memory database so each firebase
request only needs to be called once. (Also I'd like to stay in the free tier)
- The app is going to have to handle some ammount of processing (ordering lists, pagination, etc)and I don't want the server to be slowed down with heavy computations so I created a worker container to handle such cases. This is also a nice setup for scaling the app later on, 
as the only thing I need to do is instance more worker containers and balance their loads.

### Global Architecture
Configured docker to run the different containers with a configuration that helps 
the development team in having a fast workflow that will work independently of the developer's operating system of choice. 
Main setup benefits:
- Hot reloading
- Starts entire enviroment with one command
- Works in every operating system
- Will be easier to scale the app in the future

### Frontend Architecture
In the frontend I chose angular because it comes pre-packaged with many handy
functionalities I wanna make use of. Naming a few: route guards for security,
HTML sanitization to protect against corss site scripting and fast routing. Among 
many others...Also the setup is really quick thanks to the angular-cli.

### Backend Architecture
The endpoints inside the API need only to do two things:
- Give the worker the correct uid so it retreives only data the user has access to
- Allow only superusers to access worker superuser methods
Basically the backend only does authorization and acts as a middleware for the worker.

### Worker Architecture
The worker has two main functions:
- Route the requests from the server to redis if the information was cached before or get it from the permanent database in firebase and cache it when it comes back.
- <span style="color:red;text-decoration: line-through;">Do heavy intensive processes like paginating the data and sorting.</span>. After reading the requirements more carefully I realized this is asked to be done in the frontend. Still the worker is going to be useful for the queries.

### Database Architecture
Firebase requests are more efficient with plain data structures as stated in their
docs so I decided to mirror this pattern for the redis in memory database aswell.

There are two main persistent data structures, users and clients.
- The users stores data as:

  **uid:** { **clientKeys:** string[ ] }

  Where clientKeys are the keys firebase generates once you push Client object.
  I will store more data in this object as the app grows.

  <br />
- The clients hash stores data as:

  **clientKey:** Client

  Where Client is an object with all of the clients information.
  This data structure will always be flat, it is meant to be accessed with a foreign
  key inside of the users data.