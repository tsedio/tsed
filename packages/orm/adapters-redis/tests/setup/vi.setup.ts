import {TestContainersRedis} from "./TestContainersRedis.js";

export async function setup() {
  try {
    await TestContainersRedis.startContainer();
  } catch (er) {
    process.stderr.write(`Redis Testcontainers disabled: ${(er as Error).message}\n`);
    process.env.REDIS_URL = "";
  }
}

export async function teardown() {
  await TestContainersRedis.stopContainer();
}
