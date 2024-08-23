import {MongoDBContainer, StartedMongoDBContainer} from "@testcontainers/mongodb";
import type {ConnectOptions} from "mongoose";
import type {ConnectionOptions} from "node:tls";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      TEST_CONTAINER_MONGO: StartedMongoDBContainer | null;
    }
  }
}

const KEY = "TEST_CONTAINER_MONGO";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global[KEY] = null;

function getEnvironment<T>(key: string): T | null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return global[key];
}

function setEnvironment(key: string, environment: unknown) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global[key] = environment;
}

function createMongoContainer(image = "mongo:6.0.1") {
  return new MongoDBContainer(image).start();
}

export async function startMongoServer(image?: string) {
  // await stopMockServer()
  const container = getEnvironment<StartedMongoDBContainer>(KEY) || (await createMongoContainer(image));

  setEnvironment(KEY, container);

  process.env.MONGO_URL = container.getConnectionString();

  return {
    container,
    url: process.env.MONGO_URL
  };
}

export async function stopMongoServer() {
  const container = getEnvironment<StartedMongoDBContainer>(KEY);

  process.stdout.write("Stopping mongo server\n");
  if (container) {
    await container.stop();
  }
}

export function getMongoUrl(): string {
  return process.env.MONGO_URL as string;
}

export function getMongoConnectionOptions(
  id: string,
  opts: ConnectOptions = {}
): {
  id: string;
  url: string;
  connectionOptions: ConnectOptions;
} {
  const seed = Math.floor(Math.random() * 10000);
  const {dbName = "db-test", ...otherOpts} = opts;
  const url = `${getMongoUrl()}/${dbName}-${seed}`;

  return {
    id,
    url,
    connectionOptions: {
      directConnection: true,
      ...otherOpts
    } satisfies ConnectOptions
  };
}

export function getMongoConnectionsOptions(opts: ConnectionOptions = {}) {
  return [getMongoConnectionOptions("default", opts)];
}
