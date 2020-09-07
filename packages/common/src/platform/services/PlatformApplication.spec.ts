import {PlatformContext, PlatformRouter, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../../test/helper";
import {stub} from "../../../../../test/helper/tools";
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
  const platformApp = await PlatformTest.invoke<PlatformApplication>(PlatformApplication, [
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
  describe("useContext()", () => {
    beforeEach(() => {
      // @ts-ignore
      sandbox.stub(PlatformRouter, "createRawRouter").returns(createDriver() as any);
    });
    afterEach(() => {
      sandbox.restore();
    });
    it("should create context", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const request: any = new FakeRequest(sandbox);
      const response: any = new FakeResponse();
      const next = sandbox.stub();

      // WHEN
      platformApp.useContext();

      // THEN
      expect(platformApp.raw.use).to.have.been.calledWithExactly(Sinon.match.func);

      await stub(platformApp.raw.use).getCall(0).args[0](request, response, next);

      expect(request.$ctx).to.be.instanceof(PlatformContext);
      expect(next).to.have.been.calledWithExactly();
    });
  });
  describe("use()", () => {
    beforeEach(() => {
      // @ts-ignore
      sandbox.stub(PlatformRouter, "createRawRouter").returns(createDriver() as any);
    });
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
      expect(platformApp.rawRouter.use).to.have.been.calledWithExactly("/", handler);
    });
    it("should add router to app", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();

      // @ts-ignore
      const handler = new PlatformRouter(platformHandler as any);

      // WHEN
      platformApp.use("/", handler);

      // THEN
      // @ts-ignore
      expect(PlatformRouter.createRawRouter).to.have.been.calledWithExactly();
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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
      expect(platformHandler.createHandler).to.have.been.calledWithExactly(handler);
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

      // THEN
      expect(console.warn).to.have.been.calledWithExactly("Statics methods aren't implemented on this platform");
    });
  });
});
