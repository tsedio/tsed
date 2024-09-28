import {join} from "node:path";

import {TestWorkflowEnvironment} from "@temporalio/testing";

import {Activity, bootstrapWorker, Temporal} from "../src/index.js";
import {Server} from "./helpers/Server.js";

describe("Temporal Worker", () => {
  @Temporal()
  class Activities {
    @Activity()
    greet(name: string) {
      return `Hello, ${name}!`;
    }
  }

  let testEnv: TestWorkflowEnvironment;

  beforeAll(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  }, 10000);

  afterAll(async () => {
    await testEnv.teardown();
  }, 10000);

  it("should start a worker and execute decorated activities", async () => {
    const worker = await bootstrapWorker(Server, {
      worker: {
        workflowsPath: join(import.meta.dirname, "workflows"),
        taskQueue: "test"
      },
      connection: testEnv.nativeConnection
    });

    expect((worker.options.activities as any).greet).toBeDefined();

    const {client} = testEnv;

    await worker.runUntil(async () => {
      const handle = await client.workflow.start("example", {
        taskQueue: "test",
        args: ["world"],
        workflowId: "greet-world"
      });
      const result = await handle.result();
      expect(result).toEqual("Hello, world!");
    });
  }, 10000);
});
