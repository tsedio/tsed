import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {PlatformRouter} from "./PlatformRouter";

const sandbox = Sinon.createSandbox();

async function getPlatformRouter() {
  const router = await PlatformTest.invoke<PlatformRouter>(PlatformRouter);

  return {router};
}

describe("PlatformRouter", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  describe("use()", () => {
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.use("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          method: "use",
          path: "/"
        }
      ]);
    });
    it("should inheritance with another router", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const {router: router2} = await getPlatformRouter();
      const handler = sandbox.stub();
      const handler2 = sandbox.stub();

      // WHEN
      router.use("/", handler);
      router.use(handler);
      router.use("/children", router2);

      router2.get("/:id", handler2);

      // THEN
      expect(router.getStacks()).to.deep.eq([
        {
          handlers: [handler],
          method: "use",
          path: "/"
        },
        {
          handlers: [handler],
          method: "use"
        },
        {
          handlers: [handler2],
          isFinal: true,
          method: "get",
          path: "/children/:id"
        }
      ]);
    });
  });
  describe("get()", () => {
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.get("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.all("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.post("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.put("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.patch("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.head("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.delete("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
    it("should create a PlatformRouter and add handler", async () => {
      // GIVEN
      const {router} = await getPlatformRouter();
      const handler = sandbox.stub();

      // WHEN
      router.options("/", handler);

      // THEN
      expect(router.getStacks()).to.deep.eq([
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
      const {router} = await getPlatformRouter();

      // WHEN
      router.statics("/", {root: "/root"});

      expect(router.getStacks()).to.deep.eq([
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
