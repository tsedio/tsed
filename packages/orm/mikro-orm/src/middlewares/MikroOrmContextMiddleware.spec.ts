import {PlatformTest} from "@tsed/common";
import {MikroOrmContextMiddleware} from "./MikroOrmContextMiddleware";
import {anything, reset, spy, verify} from "ts-mockito";
import {RequestContext} from "@mikro-orm/core";

describe("MikroOrmContextMiddleware", () => {
  const next = jest.fn();
  const spiedRequestContext = spy(RequestContext);

  beforeEach(() => PlatformTest.create());
  afterEach(() => {
    next.mockReset();
    reset(spiedRequestContext);

    return PlatformTest.reset();
  });

  it("should create context", async () => {
    const middleware = PlatformTest.get<MikroOrmContextMiddleware>(MikroOrmContextMiddleware);

    await middleware.use(next);

    verify(spiedRequestContext.createAsync(anything(), next)).once();
  });
});
