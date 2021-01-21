import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import "../components/AlterAudit";
import {AlterAudit} from "../components/AlterAudit";
import {FormioService} from "./FormioService";

const sandbox = Sinon.createSandbox();

async function createFormioFixture(routerOpts: any = {}) {
  const service = await PlatformTest.invoke<FormioService>(FormioService, []);
  const router = {
    init: sandbox.stub().returnsThis(),
    ...routerOpts
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

  sandbox.stub(service, "createRouter").returns(router);

  return {router, config, service};
}

describe("FormioService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  it("should create the new service", async () => {
    const {router, service, config} = await createFormioFixture();

    const result = await service.init(config);

    expect(service.createRouter).to.have.been.calledWithExactly(config);
    expect(result).to.deep.eq(router);
    expect(config.mongo).to.deep.eq("mongoose://url");
    expect(config.mongoConfig).to.deep.eq('{"useNewUrlParser":true}');
  });
  it("should call hook", async () => {
    const {router, service, config} = await createFormioFixture();

    await service.init(config);
    // hooks
    const ctx = PlatformTest.createRequestContext();
    const hooks = router.init.getCall(0).args[0];

    sandbox.stub(AlterAudit.prototype, "transform").returns(false);

    hooks.alter.audit({$ctx: ctx}, "test");

    expect(AlterAudit.prototype.transform).to.have.been.calledWithExactly(ctx, "test");
  });

  describe("isInit()", () => {
    it("should return true", async () => {
      const {service, config} = await createFormioFixture();

      await service.init(config);
      expect(service.isInit()).to.eq(true);
    });

    it("should return true", async () => {
      const {service} = await createFormioFixture();

      await service.init({} as any);

      expect(service.isInit()).to.eq(false);
    });
  });
  describe("encrypt()", () => {
    it("should encrypt password", async () => {
      const routeOpts = {
        formio: {
          encrypt: sandbox.stub().callsFake((text, cb) => {
            cb(null, "hash");
          })
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      const result = await service.encrypt("text");

      expect(result).to.eq("hash");
    });
    it("should throw error", async () => {
      const routeOpts = {
        formio: {
          encrypt: sandbox.stub().callsFake((text, cb) => {
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

      expect(actualError.message).to.eq("error");
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

      expect(service.Action).to.eq(routeOpts.formio.Action);
    });
  });
  describe("util", () => {
    it("should return util", async () => {
      const routeOpts = {
        formio: {
          util: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.util).to.eq(routeOpts.formio.util);
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

      expect(service.hook).to.eq(routeOpts.formio.hook);
    });
  });
  describe("formio", () => {
    it("should return formio", async () => {
      const routeOpts = {
        formio: {
          hook: {}
        }
      };
      const {service, config} = await createFormioFixture(routeOpts);

      await service.init(config);

      expect(service.formio).to.eq(routeOpts.formio);
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

      expect(service.schemas).to.eq(routeOpts.formio.schemas);
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

      expect(service.middleware).to.eq(routeOpts.formio.middleware);
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

      expect(service.mongoose).to.eq(routeOpts.formio.mongoose);
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

      expect(service.resources).to.eq(routeOpts.formio.resources);
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

      expect(service.db).to.eq(routeOpts.formio.db);
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

      expect(service.config).to.eq(routeOpts.formio.config);
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

      expect(result).to.eq("ok");
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

      expect(result).to.eq("ok");
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

      expect(service.template).to.eq(routeOpts.formio.template);
    });
  });
});
