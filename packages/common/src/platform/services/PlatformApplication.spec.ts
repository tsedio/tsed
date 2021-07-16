import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {PlatformApplication} from "./PlatformApplication";

const sandbox = Sinon.createSandbox();

async function getPlatformApp() {
  const platformApp = await PlatformTest.invoke<PlatformApplication>(PlatformApplication);

  return {platformApp};
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
    it("should return router", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      // WHEN
      expect(platformApp.getRouter()).to.eq(platformApp.raw);
    });
  });

  describe("use()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.use("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          method: "use",
          path: "/"
        }
      ]);
    });
  });
  describe("get()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.get("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "get",
          path: "/"
        }
      ]);
    });
  });
  describe("all()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.all("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "all",
          path: "/"
        }
      ]);
    });
  });
  describe("post()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.post("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "post",
          path: "/"
        }
      ]);
    });
  });
  describe("put()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.put("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "put",
          path: "/"
        }
      ]);
    });
  });
  describe("patch()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.patch("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "patch",
          path: "/"
        }
      ]);
    });
  });
  describe("head()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.head("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "head",
          path: "/"
        }
      ]);
    });
  });
  describe("delete()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.delete("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "delete",
          path: "/"
        }
      ]);
    });
  });
  describe("options()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();
      const handler = sandbox.stub();

      // WHEN
      platformApp.options("/", handler);

      // THEN
      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          isFinal: true,
          method: "options",
          path: "/"
        }
      ]);
    });
  });
  describe("statics()", () => {
    it("should add statics route configuration", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      // WHEN
      platformApp.statics("/", {root: "/root"});

      expect(platformApp.getStacks()).to.deep.eq([
        {
          handlers: [],
          method: "statics",
          options: {
            root: "/root"
          },
          path: "/"
        }
      ]);
    });
  });
});
