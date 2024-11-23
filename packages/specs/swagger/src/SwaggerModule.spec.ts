import {logger} from "@tsed/di";
import {application} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformRouter} from "@tsed/platform-router";
import Fs from "fs";
import {absolutePath} from "swagger-ui-dist";

import {SwaggerModule} from "./SwaggerModule.js";

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

      vi.spyOn(application(), "get").mockReturnValue(undefined as never);
      vi.spyOn(application(), "use").mockReturnValue(undefined as never);
      vi.spyOn(PlatformRouter.prototype as any, "get").mockReturnValue(undefined);
      vi.spyOn(PlatformRouter.prototype as any, "statics").mockReturnValue(undefined);

      mod.$onRoutesInit();
      mod.$onRoutesInit();

      expect(application().use).toHaveBeenCalledWith("/doc", expect.any(Function));
      expect(application().use).toHaveBeenCalledWith("/doc", expect.any(PlatformRouter));
      expect(PlatformRouter.prototype.get).toHaveBeenCalledWith("/swagger.json", expect.any(Function));
      expect(PlatformRouter.prototype.get).toHaveBeenCalledWith("/main.css", expect.any(Function));
      expect(PlatformRouter.prototype.get).toHaveBeenCalledWith("/", expect.any(Function));
      expect(PlatformRouter.prototype.statics).toHaveBeenCalledWith("/", {
        root: absolutePath()
      });
    });
  });

  describe("$onReady", () => {
    it("should display the right log", async () => {
      const mod = await PlatformTest.invoke<SwaggerModule>(SwaggerModule);

      vi.spyOn(Fs, "writeFile");
      vi.spyOn(logger(), "info");

      mod.$onReady();

      expect(logger().info).toHaveBeenCalledWith("[default] Swagger JSON is available on https://0.0.0.0:8081/doc/swagger.json");
      expect(logger().info).toHaveBeenCalledWith("[default] Swagger UI is available on https://0.0.0.0:8081/doc/");
    });
  });
});
