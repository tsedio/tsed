import faker from "@faker-js/faker";
import {PlatformApplication, PlatformRouteDetails, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {FormioModule} from "./FormioModule";
import {FormioInstaller} from "./services/FormioInstaller";
import {FormioService} from "./services/FormioService";

const sandbox = Sinon.createSandbox();

async function createFormioModuleFixture() {
  const formio = {
    swagger: sandbox.stub(),
    router: sandbox.stub(),
    middleware: {
      restrictRequestTypes: sandbox.stub()
    },
    isInit: sandbox.stub().returns(true),
    init: sandbox.stub()
  };

  const installer = {
    hasForms: sandbox.stub().returns(false),
    install: sandbox.stub()
  };

  const app = {
    use: sandbox.stub(),
    getRouter: sandbox.stub().returnsThis()
  };

  const service = await PlatformTest.invoke<FormioModule>(FormioModule, [
    {
      token: FormioInstaller,
      use: installer
    },
    {
      token: FormioService,
      use: formio
    },
    {
      token: PlatformApplication,
      use: app
    }
  ]);

  return {service, app, installer, formio};
}

describe("FormioModule", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  describe("$onRoutesInit()", () => {
    it("should run install template", async () => {
      const {service, app, installer, formio} = await createFormioModuleFixture();

      const template = {
        forms: {}
      };
      const root = {
        email: faker.internet.email()
      };

      PlatformTest.injector.settings.set("formio.template", template);
      PlatformTest.injector.settings.set("formio.root", root);

      installer.install.resolves((service as any).template);

      await service.$onRoutesInit();

      expect(app.getRouter).to.have.been.calledWithExactly();
      expect(app.use).to.have.been.calledWithExactly("/", formio.middleware.restrictRequestTypes, formio.router);
      expect(installer.install).to.have.been.calledWithExactly(template, root);
    });
    it("should skip install", async () => {
      const {service, installer} = await createFormioModuleFixture();

      await service.$onRoutesInit();

      expect(installer.install).to.not.have.been.called;
    });
  });
  describe("$logRoutes()", () => {
    it("should add formio routes", async () => {
      const {service, formio} = await createFormioModuleFixture();
      const routes: PlatformRouteDetails[] = [];

      PlatformTest.injector.settings.set("formio.baseUrl", "/projects");
      PlatformTest.injector.settings.set("formio.root");

      formio.swagger.returns({
        paths: {
          "/path/to": {
            get: {
              operationId: "operationId"
            }
          }
        }
      });

      const results = await service.$logRoutes(routes);

      expect(results.map((o) => o.toJSON())).to.deep.eq([
        {
          className: "formio",
          method: "get",
          methodClassName: "operationId",
          name: "operationId",
          parameters: [],
          rawBody: false,
          url: "/projects/path/to"
        }
      ]);
    });
  });
});
