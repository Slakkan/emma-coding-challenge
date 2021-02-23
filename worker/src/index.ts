
import { RedisManager } from './redis/redis-manager';

const redisManager = new RedisManager();

redisManager.subscriber.subscribe("POST_CLIENTS");
redisManager.subscriber.subscribe("GET_CLIENTS");
redisManager.subscriber.subscribe("PUT_CLIENTS");
redisManager.subscriber.subscribe("DELETE_CLIENTS");

redisManager.subscriber.on("message", (channel, message) => {
  switch (channel) {
    case "POST_CLIENTS":
      handlePostClients(message);
      break;
    case "GET_CLIENTS":
      handleGetClients(message);
      break;
    case "PUT_CLIENTS":
      handlePutClients(message);
      break;
    case "DELETE_CLIENTS":
      handleDeleteClients(message);
      break;
    default:
      break;
  }
});

function handlePostClients(message: string) {
  const { uid, key, client } = JSON.parse(message);
  redisManager.addClient(uid, key, client).subscribe();
}

function handlePutClients(message: string) {
  const { client } = JSON.parse(message);
  redisManager.putClient(client).subscribe();
}

function handleGetClients(message: string) {
  const { uid, operationId } = JSON.parse(message);
  redisManager.getClients(uid).subscribe(clients => {
    const data = JSON.stringify({
      operationId,
      clients
    });
    redisManager.publisher.publish(operationId, data);
  });
}

function handleDeleteClients(message: string) {
  const { uid, key } = JSON.parse(message);
  redisManager.deleteClient(uid, key).subscribe();
}