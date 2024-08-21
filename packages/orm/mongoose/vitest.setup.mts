import { startMongoServer, stopMongoServer } from "./test/helpers/TestContainerMongo.js";


export async function setup() {
  await startMongoServer();
}

export async function teardown() {
  await stopMongoServer();
}
