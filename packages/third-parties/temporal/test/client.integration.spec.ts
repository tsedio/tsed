import {TestWorkflowEnvironment} from "@temporalio/testing";
import {Temporal, Activity, bootstrapWorker, TemporalClient} from "../src";
import {Server} from "./helpers/Server";
import {Runtime} from "@temporalio/worker";
import {getEphemeralServerTarget} from "@temporalio/core-bridge";
import {PlatformTest} from "@tsed/common";

describe("Temporal Client", () => {
  let server: any;
  let client: TemporalClient;

  beforeEach(async () => {
    server = await Runtime.instance().createEphemeralServer({type: "time-skipping"});
  });

  afterEach(async () => {
    if (client) {
      await client.connection.close();
    }
    await Runtime.instance().shutdownEphemeralServer(server);
  });

  it("should provide TemporalClient", async () => {
    const server = await Runtime.instance().createEphemeralServer({type: "time-skipping"});
    const address = getEphemeralServerTarget(server);

    await PlatformTest.bootstrap(Server, {
      temporal: {
        enabled: true,
        connection: {
          address
        }
      }
    })();

    client = PlatformTest.get<TemporalClient>(TemporalClient);
    expect(client).toBeInstanceOf(TemporalClient);
  });
});
