import {PlatformRequest, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {FakeRequest} from "../../../../test/helper";
import {GlobalAcceptMimesMiddleware} from "./GlobalAcceptMimesMiddleware";

describe("GlobalAcceptMimesMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("accept", () => {
    it("should return nothing", () => {
      const request: any = new FakeRequest({
        headers: {
          accept: "application/json"
        }
      });

      const context = PlatformTest.createRequestContext({
        request: new PlatformRequest(request)
      });

      const middleware = new GlobalAcceptMimesMiddleware();

      expect(middleware.use(context)).to.eq(undefined);
    });
  });
});
