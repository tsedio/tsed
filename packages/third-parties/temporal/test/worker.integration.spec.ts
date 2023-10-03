import {TestWorkflowEnvironment} from "@temporalio/testing";
import {Temporal, Activity, bootstrapWorker} from "../src";
import {Server} from "./helpers/Server";

describe("Temporal Worker", () => {
  @Temporal()
  class Activities {
    @Activity()
    greet(name: string) {
      return `Hello, ${name}!`;
    }
  }

  let testEnv: TestWorkflowEnvironment;

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterEach(async () => {
    await testEnv.teardown();
  });

  it("should start a worker and execute decorated activites", async () => {
    const worker = await bootstrapWorker(Server, {
      worker: {
        workflowsPath: require.resolve("./workflows"),
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
  });
});
