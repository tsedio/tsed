import {PlatformRouter, PlatformTest} from "@tsed/common";
import {PlatformApplication} from "./PlatformApplication";
import {PlatformHandler} from "./PlatformHandler";

function createDriver() {
  return {
    use: jest.fn(),
    all: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    head: jest.fn(),
    options: jest.fn()
  };
}

async function getPlatformApp() {
  const platformHandler = {
    createHandler: jest.fn().mockImplementation((o) => o)
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
      expect(platformApp.getApp()).toEqual(platformApp.raw);
    });
  });
  describe("getRouter()", () => {
    it("should return app", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      // WHEN
      expect(platformApp.getRouter()).toEqual(platformApp.rawRouter);
    });
  });

  describe("use()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.use("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {isFinal: false});
      expect(platformApp.rawRouter.use).toBeCalledWith("/", handler);
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
      expect(platformApp.rawRouter.use).toBeCalledWith("/", handler.raw);
    });
  });
  describe("get()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.get("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "get",
        path: "/"
      });
      expect(platformApp.rawRouter.get).toBeCalledWith("/", handler);
    });
  });
  describe("all()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.all("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "all",
        path: "/"
      });
      expect(platformApp.rawRouter.all).toBeCalledWith("/", handler);
    });
  });
  describe("post()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.post("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "post",
        path: "/"
      });
      expect(platformApp.rawRouter.post).toBeCalledWith("/", handler);
    });
  });
  describe("put()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.put("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "put",
        path: "/"
      });
      expect(platformApp.rawRouter.put).toBeCalledWith("/", handler);
    });
  });
  describe("patch()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.patch("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "patch",
        path: "/"
      });
      expect(platformApp.rawRouter.patch).toBeCalledWith("/", handler);
    });
  });
  describe("head()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.head("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "head",
        path: "/"
      });
      expect(platformApp.rawRouter.head).toBeCalledWith("/", handler);
    });
  });
  describe("delete()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.delete("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "delete",
        path: "/"
      });
      expect(platformApp.rawRouter.delete).toBeCalledWith("/", handler);
    });
  });
  describe("options()", () => {
    it("should create a PlatformApplication and add handler", async () => {
      // GIVEN
      const {platformApp, platformHandler} = await getPlatformApp();
      const handler = jest.fn();

      // WHEN
      platformApp.options("/", handler);

      // THEN
      expect(platformHandler.createHandler).toBeCalledWith(handler, {
        isFinal: true,
        method: "options",
        path: "/"
      });
      expect(platformApp.rawRouter.options).toBeCalledWith("/", handler);
    });
  });
  describe("statics()", () => {
    it("should call statics", async () => {
      // GIVEN
      const {platformApp} = await getPlatformApp();

      jest.spyOn(console, "warn");

      // WHEN
      platformApp.statics("/", {root: "/root"});
    });
  });
});
