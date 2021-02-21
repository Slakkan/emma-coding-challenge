// CONFIGURE EXPRESS
import express from "express";
import redis from "redis";

import { FirebaseManager } from "./firebase/firebase-manager";
import { isDataAppClient } from './utils/type.utils';

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// COFIGURE REDIS
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT!,
  retry_strategy: () => 1000,
};

const redisSubscriber = redis.createClient(redisConfig);
const redisPublisher = redis.createClient(redisConfig);

// FIREBASE CONFIG IS INSIDE FIREBASE MANAGER

const fbManager = new FirebaseManager();
app.use(fbManager.validateFirebaseToken);

// ENDPOINTS
app.post("/clients", async (req, res) => {
  let isDataCorrect, isDataSaved = false;
  try {
    const uid = req.body.uid;
    // check if the object in the body has all the correct data
    const client = await isDataAppClient(req.body.client);
    isDataCorrect = true;
    // save client data on firebase. If it doesn't save correctly throws and error
    const key = await fbManager.addClient(client);
    client.key = key
    // save clientKey into firebase userdata
    await fbManager.addClientToUser(uid, key);
    isDataSaved = true;

    const payload = { uid, key, client };
    redisPublisher.publish("POST_CLIENTS", JSON.stringify(payload));
    res.status(200);
    res.send({ message: "Client successfully added to the database" });
  } catch {
    // Handle errors
    if (!isDataCorrect) {
      res.status(400);
      res.send("Incorrect data");
    }
    else if (!isDataSaved) {
      res.status(500);
      res.send("Could not save data to firebase");
    }
  }
});

app.put('/clients', async (req, res) => {
  let isDataCorrect, isDataSaved = false;
  try {
    // check if the object in the body has all the correct data
    const client = await isDataAppClient(req.body.client);
    isDataCorrect = true;
    // replace data in firebase with the updated values
    await fbManager.putClient(client);
    isDataSaved = true;

    const payload = { client };
    redisPublisher.publish("PUT_CLIENTS", JSON.stringify(payload));
    res.status(200);
    res.send({ message: "Client updated successfully" });
  } catch {
    // Handle errors
    if (!isDataCorrect) {
      res.status(400);
      res.send("Incorrect data");
    }
    else if (!isDataSaved) {
      res.status(500);
      res.send("Could not save data to firebase");
    }
  }
});

app.get("/clients", async (req, res) => {
  // create and send the payload to the worker
  const uid = req.body.uid;
  const operationId = req.body.operationId;
  const payload = { operationId, uid };
  redisPublisher.publish("GET_CLIENTS", JSON.stringify(payload));

  // wait for the worker to respond
  redisSubscriber.subscribe(operationId);
  redisSubscriber.on("message", (channel, message) => {
    const data = JSON.parse(message);
    if (data.operationId === operationId) {
      redisSubscriber.unsubscribe(operationId);
      // Note that there is no error handling because if the worker
      // does not find any record it will respond with an empty array
      res.status(200);
      res.send(data);
    }
  });
});

app.listen(5000, () => console.log("Express server listening on port 5000"));
