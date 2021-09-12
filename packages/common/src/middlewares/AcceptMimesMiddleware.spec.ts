import {AcceptMimesMiddleware, PlatformTest} from "@tsed/common";

describe("AcceptMimesMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should accept type", async () => {
    const ctx = PlatformTest.createRequestContext();

    const middleware = await PlatformTest.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);
    middleware.use(ctx);
  });
});
