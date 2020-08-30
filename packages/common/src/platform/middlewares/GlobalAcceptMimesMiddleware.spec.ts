import {PlatformRequest, PlatformTest} from "@tsed/common";
import {catchError} from "@tsed/core";
import {expect} from "chai";
import {FakeRequest} from "../../../../../test/helper";
import {ServerSettingsService} from "../../config";
import {GlobalAcceptMimesMiddleware} from "./GlobalAcceptMimesMiddleware";

describe("GlobalAcceptMimesMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("accept", () => {
    it("should return nothing", () => {
      const request: any = new FakeRequest({
        headers: {
          accept: "application/json",
        },
      });

      const context = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
      });

      const settings = new ServerSettingsService();
      settings.acceptMimes = ["application/json"];

      const middleware = new GlobalAcceptMimesMiddleware(settings as any);

      expect(middleware.use(context)).to.eq(undefined);
    });
  });

  describe("not accept", () => {
    it("should throws NotAcceptable", () => {
      const request: any = new FakeRequest({
        headers: {
          accept: "text/html",
        },
      });

      const context = PlatformTest.createRequestContext({
        request: new PlatformRequest(request),
      });

      const settings = new ServerSettingsService();
      settings.acceptMimes = ["application/json"];

      const middleware = new GlobalAcceptMimesMiddleware(settings as any);

      const error: any = catchError(() => middleware.use(context));

      expect(error.message).to.eq("You must accept content-type application/json");
    });
  });
});
