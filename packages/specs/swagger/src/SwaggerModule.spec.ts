import {PlatformRouter, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Fs from "fs";
import Sinon from "sinon";
import {SwaggerModule} from "./index";

const sandbox = Sinon.createSandbox();
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
  afterEach(() => sandbox.restore());

  describe("$onRoutesInit", () => {
    it("should add middlewares", async () => {
      const mod = await PlatformTest.invoke<SwaggerModule>(SwaggerModule);

      sandbox.stub(mod.app, "get");
      sandbox.stub(mod.app, "use");
      sandbox.stub(PlatformRouter.prototype, "get");
      sandbox.stub(PlatformRouter.prototype, "statics");

      mod.$onRoutesInit();
      mod.$onRoutesInit();

      expect(mod.app.get).to.have.been.calledWithExactly("/doc", Sinon.match.func);
      expect(mod.app.use).to.have.been.calledWithExactly("/doc", Sinon.match.instanceOf(PlatformRouter));
      expect(PlatformRouter.prototype.get).to.have.been.calledWithExactly("/swagger.json", Sinon.match.func);
      expect(PlatformRouter.prototype.get).to.have.been.calledWithExactly("/main.css", Sinon.match.func);
      expect(PlatformRouter.prototype.get).to.have.been.calledWithExactly("/", Sinon.match.func);
      expect(PlatformRouter.prototype.statics).to.have.been.calledWithExactly("/", {
        root: require("swagger-ui-dist").absolutePath()
      });
    });
  });

  describe("$onReady", () => {
    it("should display the right log", async () => {
      const mod = await PlatformTest.invoke<SwaggerModule>(SwaggerModule);

      sandbox.stub(Fs, "writeFile");
      sandbox.stub(mod.injector.logger, "info");

      mod.$onReady();

      expect(mod.injector.logger.info).calledWithExactly("[default] Swagger JSON is available on https://0.0.0.0:8081/doc/swagger.json");
      expect(mod.injector.logger.info).calledWithExactly("[default] Swagger UI is available on https://0.0.0.0:8081/doc/");
    });
  });
});
