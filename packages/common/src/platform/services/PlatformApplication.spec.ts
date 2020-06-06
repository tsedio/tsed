import {PlatformRouter, PlatformTest} from "@tsed/common";
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
    createHandler: sandbox.stub().callsFake(o => o)
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.use.should.have.been.calledWithExactly("/", handler);
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
      PlatformRouter.createRawRouter.should.have.been.calledWithExactly();
      platformApp.raw.use.should.have.been.calledWithExactly("/", handler.raw);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.get.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.all.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.post.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.put.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.patch.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.head.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.delete.should.have.been.calledWithExactly("/", handler);
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
      platformHandler.createHandler.should.have.been.calledWithExactly(handler);
      platformApp.raw.options.should.have.been.calledWithExactly("/", handler);
    });
  });
});
