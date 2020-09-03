import {PlatformRouter, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
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

  platformApp.raw = createDriver() as any;

  return {platformApp, platformHandler};
}

describe("PlatformApplication", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

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
      expect(platformApp.raw.use).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.use).to.have.been.calledWithExactly("/", handler.raw);
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
      expect(platformApp.raw.get).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.all).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.post).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.put).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.patch).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.head).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.delete).to.have.been.calledWithExactly("/", handler);
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
      expect(platformApp.raw.options).to.have.been.calledWithExactly("/", handler);
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
