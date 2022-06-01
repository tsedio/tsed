import faker from "@faker-js/faker";
import {PlatformApplication, PlatformRouteDetails, PlatformTest} from "@tsed/common";
import {FormioModule} from "./FormioModule";
import {FormioInstaller} from "./services/FormioInstaller";
import {FormioService} from "./services/FormioService";

async function createFormioModuleFixture() {
  const formio = {
    swagger: jest.fn(),
    router: jest.fn(),
    middleware: {
      restrictRequestTypes: jest.fn()
    },
    isInit: jest.fn().mockReturnValue(true),
    init: jest.fn()
  };

  const installer = {
    hasForms: jest.fn().mockReturnValue(false),
    install: jest.fn()
  };

  const app = {
    use: jest.fn(),
    getRouter: jest.fn().mockReturnThis()
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

      installer.install.mockResolvedValue((service as any).template);

      await service.$onRoutesInit();

      expect(app.getRouter).toHaveBeenCalledWith();
      expect(app.use).toHaveBeenCalledWith("/", formio.middleware.restrictRequestTypes, formio.router);
      expect(installer.install).toHaveBeenCalledWith(template, root);
    });
    it("should skip install", async () => {
      const {service, installer} = await createFormioModuleFixture();
      PlatformTest.injector.settings.set("formio.template", {});

      await service.$onRoutesInit();

      expect(installer.install).toHaveBeenCalled();
    });
  });
  describe("$logRoutes()", () => {
    it("should add formio routes", async () => {
      const {service, formio} = await createFormioModuleFixture();
      const routes: PlatformRouteDetails[] = [];

      PlatformTest.injector.settings.set("formio.baseUrl", "/projects");
      PlatformTest.injector.settings.set("formio.root");

      formio.swagger.mockReturnValue({
        paths: {
          "/path/to": {
            get: {
              operationId: "operationId"
            }
          }
        }
      });

      const results = await service.$logRoutes(routes);

      expect(results.map((o) => o.toJSON())).toEqual([
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
