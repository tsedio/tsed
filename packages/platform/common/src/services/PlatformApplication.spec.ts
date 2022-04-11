import {PlatformRouter, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformHandler} from "./PlatformHandler";

const sandbox = Sinon.createSandbox();

function createDriver() {
  return {
    use: sandbox.stub(),
    all: sandbox.stub(),
    get: sandbox.stub(),
    post: sandbox.stub(),
    put: sandbox.stub(),
    delete: sandbox.stub(),
    patch: sandbox.stub(),
    head: sandbox.stub(),
    options: sandbox.stub()
  };
}

async function getPlatformApp() {
  const platformHandler = {
    createHandler: sandbox.stub().callsFake((o) => o)
  };
  const platformApp = await PlatformTest.invoke<PlatformApplication<any, any>>(PlatformApplication, [
    {
      token: PlatformHandler,
      use: platformHandler
    }
  ]);
  platformApp.injector.settings.logger = {};
  platformApp.rawRouter = createDriver() as any;
  platformApp.rawApp = platformApp.raw = createDriver() as any;

  return {platformApp, platformHandler};
}

describe("PlatformApplication", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe("getApp()", () => {
    it("should return app", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      // WHEN
      expect(platformApp.getApp()).to.eq(platformApp.raw);
    });
  });
  describe("getRouter()", () => {
    it("should return app", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      // WHEN
      expect(platformApp.getRouter()).to.eq(platformApp.rawRouter);
    });
  });

  describe("use()", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.use("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {isFinal: false});
      expect(platformApp.rawRouter.use).to.have.been.calledWithExactly("/", handler);
    });
    it("should add router to app", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const router = createDriver();
      const adapter = {
        router() {
          return {
            router,
            callback() {
              return router;
            }
          };
        }
      };

      // @ts-ignore
      const handler = new PlatformRouter(platformHandler as any, adapter);

      // WHEN
      platformApp.use("/", handler);

      // THEN
      expect(platformApp.rawRouter.use).to.have.been.calledWithExactly("/", handler.raw);
    });
  });
  describe("get()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.get("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "get",
        path: "/"
      });
      expect(platformApp.rawRouter.get).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("all()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.all("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "all",
        path: "/"
      });
      expect(platformApp.rawRouter.all).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("post()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.post("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "post",
        path: "/"
      });
      expect(platformApp.rawRouter.post).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("put()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.put("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "put",
        path: "/"
      });
      expect(platformApp.rawRouter.put).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("patch()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.patch("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "patch",
        path: "/"
      });
      expect(platformApp.rawRouter.patch).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("head()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.head("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "head",
        path: "/"
      });
      expect(platformApp.rawRouter.head).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("delete()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.delete("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "delete",
        path: "/"
      });
      expect(platformApp.rawRouter.delete).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("options()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.options("/", handler);

      // THEN
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler, {
        isFinal: true,
        method: "options",
        path: "/"
      });
      expect(platformApp.rawRouter.options).to.have.been.calledWithExactly("/", handler);
    });
  });
  describe("statics()", () => {
    it("should call statics", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      sandbox.stub(console, "warn");

      // WHEN
      platformApp.statics("/", {root: "/root"});
    });
  });
});
