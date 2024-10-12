import "../components/AlterAudit.js";

import {PlatformTest} from "@tsed/platform-http/testing";

import {AlterAudit} from "../components/AlterAudit.js";
import {FormioHooksService} from "./FormioHooksService.js";
import {FormioService} from "./FormioService.js";

async function createFormioFixture(routerOpts: any = {}) {
  const service = await PlatformTest.invoke<FormioService>(FormioService, []);
  const router = {
    init: vi.fn().mockReturnThis(),
    ...routerOpts,
    formio: {
      ...(routerOpts.formio || {}),
      util: {
        log: vi.fn(),
        error: vi.fn()
      }
    }
  };
  const config: any = {
    baseUrl: "/projects",
    jwt: {
      secret: "secret"
    },
    root: {
      email: "email@email.com",
      password: "password"
    }
  };

  PlatformTest.injector.settings.set("mongoose", [
    {
      id: "default",
      url: "mongoose://url",
      connectionOptions: {
        useNewUrlParser: true
      }
    }
  ]);

  vi.spyOn(service, "createRouter").mockReturnValue(router);

  return {router, config, service};
}

describe("FormioService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should create the new service", async () => {
    const {router, service, config} = await createFormioFixture();

    const result = await service.init(config);

    expect(service.createRouter).toHaveBeenCalledWith(config);
    expect(result).toEqual(router);
    expect(config.mongo).toEqual("mongoose://url");
    expect(config.mongoConfig).toEqual('{"useNewUrlParser":true}');
  });
  it("should call hook", async () => {
    const {router, service, config} = await createFormioFixture();

    await service.init(config, PlatformTest.get<FormioHooksService>(FormioHooksService).getHooks());

    // hooks
    const ctx = PlatformTest.createRequestContext();
    const hooks = router.init.mock.calls[0][0];

    vi.spyOn(AlterAudit.prototype, "transform").mockReturnValue(false);

    hooks.alter.audit({$ctx: ctx}, "test");

    expect(AlterAudit.prototype.transform).toHaveBeenCalledWith(ctx, "test");
  });

  describe("isInit()", () => {
    it("should return true", async () => {
      const {service, config} = await createFormioFixture();

      await service.init(config);
      expect(service.isInit()).toEqual(true);
    });

    it("should return false", async () => {
      const {service} = await createFormioFixture();

      await service.init({} as any);

      expect(service.isInit()).toEqual(false);
    });
  });
  describe("encrypt()", () => {
    it("should encrypt password", async () => {
      const routeOpts = {
        formio: {
          encrypt: vi.fn().mockImplementation((text, cb) => {
            cb(null, "hash");
          })
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      const result = await service.encrypt("text");

      expect(result).toEqual("hash");
    });
    it("should throw error", async () => {
      const routeOpts = {
        formio: {
          encrypt: vi.fn().mockImplementation((text, cb) => {
            cb(new Error("error"));
          })
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      let actualError: any;
      try {
        await service.encrypt("text");
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).toEqual("error");
    });
  });
  describe("Action", () => {
    it("should return Action", async () => {
      const routeOpts = {
        formio: {
          Action: class {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.Action).toEqual(routeOpts.formio.Action);
    });
  });
  describe("util", () => {
    it("should return util", async () => {
      const routeOpts = {
        formio: {
          util: {}
        }
      };
      const {service, config, router} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.util).toEqual(router.formio.util);
    });
  });
  describe("hook", () => {
    it("should return hook", async () => {
      const routeOpts = {
        formio: {
          hook: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.hook).toEqual(routeOpts.formio.hook);
    });
  });
  describe("auth", () => {
    it("should return auth", async () => {
      const routeOpts = {
        formio: {
          auth: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.auth).toEqual(routeOpts.formio.auth);
    });
  });
  describe("audit", () => {
    it("should return audit", async () => {
      const routeOpts = {
        formio: {
          audit: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.audit).toEqual(routeOpts.formio.audit);
    });
    it("should return empty fn", async () => {
      const routeOpts = {
        formio: {}
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(typeof service.audit).toEqual("function");
      expect(service.audit("test")).toEqual(undefined);
    });
  });
  describe("formio", () => {
    it("should return formio", async () => {
      const routeOpts = {
        formio: {
          hook: {}
        }
      };
      const {service, config, router} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.formio).toEqual(router.formio);
    });
  });
  describe("schemas", () => {
    it("should return schemas", async () => {
      const routeOpts = {
        formio: {
          schemas: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.schemas).toEqual(routeOpts.formio.schemas);
    });
  });
  describe("middleware", () => {
    it("should return middleware", async () => {
      const routeOpts = {
        formio: {
          middleware: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.middleware).toEqual(routeOpts.formio.middleware);
    });
  });
  describe("mongoose", () => {
    it("should return mongoose", async () => {
      const routeOpts = {
        formio: {
          mongoose: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.mongoose).toEqual(routeOpts.formio.mongoose);
    });
  });
  describe("resources", () => {
    it("should return resources", async () => {
      const routeOpts = {
        formio: {
          resources: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.resources).toEqual(routeOpts.formio.resources);
    });
  });
  describe("db", () => {
    it("should return db", async () => {
      const routeOpts = {
        formio: {
          db: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.db).toEqual(routeOpts.formio.db);
    });
  });
  describe("config", () => {
    it("should return config", async () => {
      const routeOpts = {
        formio: {
          config: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.config).toEqual(routeOpts.formio.config);
    });
  });
  describe("exportTemplate()", () => {
    it("should return template", async () => {
      const routeOpts = {
        formio: {
          template: {
            export(_: any, cb: any) {
              cb(null, "ok");
            }
          }
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      const result = await service.exportTemplate(config);

      expect(result).toEqual("ok");
    });
  });
  describe("importTemplate()", () => {
    it("should return template", async () => {
      const routeOpts = {
        formio: {
          template: {
            import: {
              template(_: any, cb: any) {
                cb(null, "ok");
              }
            }
          }
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      const result = await service.importTemplate(config);

      expect(result).toEqual("ok");
    });
  });
  describe("template", () => {
    it("should return template", async () => {
      const routeOpts = {
        formio: {
          template: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.template).toEqual(routeOpts.formio.template);
    });
  });
});
