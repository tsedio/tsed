import {catchError} from "@tsed/core";
import {expect} from "chai";
import {FakeRequest} from "../../../../../test/helper";
import {ServerSettingsService} from "../../config";
import {GlobalAcceptMimesMiddleware} from "./GlobalAcceptMimesMiddleware";

describe("GlobalAcceptMimesMiddleware", () => {
  describe("accept", () => {
    it("should return nothing", () => {
      const request = new FakeRequest();
      request.mime = "application/json";

      const settings = new ServerSettingsService();
      settings.acceptMimes = ["application/json"];

      const middleware = new GlobalAcceptMimesMiddleware(settings as any);

      expect(middleware.use(request as any)).to.eq(undefined);
    });
  });

  describe("not accept", () => {
    it("should throws NotAcceptable", () => {
      const request = new FakeRequest();
      request.mime = "text/html";

      const settings = new ServerSettingsService();
      settings.acceptMimes = ["application/json"];

      const middleware = new GlobalAcceptMimesMiddleware(settings as any);

      const error: any = catchError(() => middleware.use(request as any));

      expect(error.message).to.eq("You must accept content-type application/json");
    });
  });
});
