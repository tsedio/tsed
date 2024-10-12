import {faker} from "@faker-js/faker";
import {PlatformApplication, PlatformRouteDetails} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";

import {FormioModule} from "./FormioModule.js";
import {FormioInstaller} from "./services/FormioInstaller.js";
import {FormioService} from "./services/FormioService.js";

async function createFormioModuleFixture() {
  const formio = {
    swagger: vi.fn(),
    router: vi.fn(),
    middleware: {
      restrictRequestTypes: vi.fn()
    },
    isInit: vi.fn().mockReturnValue(true),
    init: vi.fn()
  };

  const installer = {
    hasForms: vi.fn().mockReturnValue(false),
    install: vi.fn()
  };

  const app = {
    use: vi.fn(),
    getRouter: vi.fn().mockReturnThis()
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

      expect(results).toEqual([
        {
          className: "formio",
          method: "get",
          methodClassName: "operationId",
          name: "operationId",
          url: "/projects/path/to"
        }
      ]);
    });
  });
});
