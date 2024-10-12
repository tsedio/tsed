import {Injectable} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";

import {Health} from "./decorators/health.js";
import {TerminusModule} from "./TerminusModule.js";

@Injectable()
class MyService {
  @Health("mongo")
  mongo() {
    return Promise.resolve("OK");
  }

  @Health("/redis/health")
  redis() {
    return Promise.resolve("OK");
  }

  $beforeShutdown() {}
}

describe("TerminusModule", () => {
  beforeEach(() =>
    PlatformTest.create({
      terminus: {
        path: "/health"
      }
    })
  );
  afterEach(() => PlatformTest.reset());

  it("should load health providers", async () => {
    const terminusModule = PlatformTest.get<TerminusModule>(TerminusModule);

    const {logger, ...props} = terminusModule.getConfiguration();

    expect(props).toEqual({
      beforeShutdown: expect.any(Function),
      healthChecks: {
        "/mongo/health": expect.any(Function),
        "/redis/health": expect.any(Function),
        "/health": expect.any(Function)
      },
      onSendFailureDuringShutdown: expect.any(Function),
      onShutdown: expect.any(Function),
      onSignal: expect.any(Function)
    });

    const result = await props.healthChecks["/health"]({});

    expect(result).toEqual([
      {mongo: "OK"},
      {"/redis/health": "OK"} // legacy
    ]);

    logger("event", {message: "message"});

    expect(await terminusModule.$logRoutes([])).toEqual([
      {
        method: "GET",
        name: "TerminusModule.dispatch()",
        url: "/health"
      },
      {
        method: "GET",
        name: "MyService.mongo()",
        url: "/mongo/health"
      },
      {
        method: "GET",
        name: "MyService.redis()",
        url: "/redis/health"
      }
    ]);

    await props.onSignal();
  });

  it("should emit event", async () => {
    const terminusModule = PlatformTest.get<TerminusModule>(TerminusModule);
    const service = PlatformTest.get<MyService>(MyService);

    vi.spyOn(service, "$beforeShutdown");

    const {beforeShutdown} = terminusModule.getConfiguration();

    await beforeShutdown();

    expect(service.$beforeShutdown).toHaveBeenCalledWith();
  });
});
