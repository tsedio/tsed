import {PlatformRouter, PlatformTest} from "@tsed/common";
import Fs from "fs";
import {SwaggerModule} from "./index";

describe("SwaggerModule", () => {
  beforeEach(() =>
    PlatformTest.create({
      httpPort: 8080,
      httpsPort: 8081,
      swagger: [
        {
          path: "/doc",
          cssPath: "/cssPath",
          jsPath: "/jsPath",
          viewPath: "/viewsPath",
          outFile: "/spec.json"
        }
      ]
    })
  );
  afterEach(PlatformTest.reset);

  describe("$onRoutesInit", () => {
    it("should add middlewares", async () => {
      const mod = await PlatformTest.invoke<SwaggerModule>(SwaggerModule);

      jest.spyOn(mod.app as any, "get").mockReturnValue(undefined);
      jest.spyOn(mod.app as any, "use").mockReturnValue(undefined);
      jest.spyOn(PlatformRouter.prototype as any, "get").mockReturnValue(undefined);
      jest.spyOn(PlatformRouter.prototype as any, "statics").mockReturnValue(undefined);

      mod.$onRoutesInit();
      mod.$onRoutesInit();

      expect(mod.app.get).toHaveBeenCalledWith("/doc", expect.any(Function));
      expect(mod.app.use).toHaveBeenCalledWith("/doc", expect.any(PlatformRouter));
      expect(PlatformRouter.prototype.get).toHaveBeenCalledWith("/swagger.json", expect.any(Function));
      expect(PlatformRouter.prototype.get).toHaveBeenCalledWith("/main.css", expect.any(Function));
      expect(PlatformRouter.prototype.get).toHaveBeenCalledWith("/", expect.any(Function));
      expect(PlatformRouter.prototype.statics).toHaveBeenCalledWith("/", {
        root: require("swagger-ui-dist").absolutePath()
      });
    });
  });

  describe("$onReady", () => {
    it("should display the right log", async () => {
      const mod = await PlatformTest.invoke<SwaggerModule>(SwaggerModule);

      jest.spyOn(Fs, "writeFile");
      jest.spyOn(mod.injector.logger, "info");

      mod.$onReady();

      expect(mod.injector.logger.info).toHaveBeenCalledWith("[default] Swagger JSON is available on https://0.0.0.0:8081/doc/swagger.json");
      expect(mod.injector.logger.info).toHaveBeenCalledWith("[default] Swagger UI is available on https://0.0.0.0:8081/doc/");
    });
  });
});
