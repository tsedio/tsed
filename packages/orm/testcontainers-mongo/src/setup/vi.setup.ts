import {startMongoServer, stopMongoServer} from "../services/ContainerUtils.js";

export async function setup() {
  await startMongoServer();
}

export async function teardown() {
  await stopMongoServer();
}
