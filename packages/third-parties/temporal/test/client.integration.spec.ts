import {TestWorkflowEnvironment} from "@temporalio/testing";
import {PlatformTest} from "@tsed/platform-http/testing";

import {TemporalClient} from "../src/index.js";
import {Server} from "./helpers/Server.js";

describe("Temporal Client", () => {
  let testEnv: TestWorkflowEnvironment;
  let client: TemporalClient;

  beforeEach(async () => {
    testEnv = await TestWorkflowEnvironment.createTimeSkipping();
  });

  afterEach(async () => {
    if (client) {
      await client.connection.close();
    }
    await testEnv.teardown();
  });

  it("should provide TemporalClient", async () => {
    await PlatformTest.bootstrap(Server, {
      temporal: {
        enabled: true,
        connection: {
          address: testEnv.connection.options.address
        }
      }
    })();

    client = PlatformTest.get<TemporalClient>(TemporalClient);
    expect(client).toBeInstanceOf(TemporalClient);
  });
});
