import {TestContainersRedis} from "./TestContainersRedis.js";

export async function setup() {
  await TestContainersRedis.startContainer();
}

export async function teardown() {
  await TestContainersRedis.stopContainer();
}
