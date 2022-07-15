import {PlatformApplication, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import Express from "express";

describe("PlatformExpressApplication", () => {
  class TestServer {}

  beforeEach(
    PlatformTest.bootstrap(TestServer, {
      platform: PlatformExpress
    })
  );
  afterEach(() => PlatformTest.reset());

  describe("statics()", () => {
    it("should create a PlatformApplication", async () => {
      const middlewareServeStatic = jest.fn();
      jest.spyOn(Express, "static").mockReturnValue(middlewareServeStatic);

      const app = await PlatformTest.invoke<PlatformApplication>(PlatformApplication);

      jest.spyOn(app, "use").mockReturnThis();

      app.statics("/path", {
        root: "/publics",
        options: "options"
      });

      expect(Express.static).toBeCalledWith(expect.stringContaining("/publics"), {options: "options"});
      expect(app.use).toBeCalledWith("/path", expect.any(Function));
    });
  });
});
