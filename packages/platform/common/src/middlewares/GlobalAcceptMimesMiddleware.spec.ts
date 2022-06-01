import {PlatformTest} from "@tsed/common";
import {GlobalAcceptMimesMiddleware} from "./GlobalAcceptMimesMiddleware";

describe("GlobalAcceptMimesMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("accept", () => {
    it("should return nothing", () => {
      const request: any = PlatformTest.createRequest({
        headers: {
          accept: "application/json"
        }
      });

      const context = PlatformTest.createRequestContext({
        event: {request}
      });

      const middleware = new GlobalAcceptMimesMiddleware();

      expect(middleware.use(context)).toBeUndefined();
    });
  });
});
