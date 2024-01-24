import {PlatformTest} from "@tsed/common";
import {Env} from "@tsed/core";
import sirv from "sirv";
import {VIKE_SERVER} from "./VikeServer";

jest.mock("sirv", () => {
  return jest.fn().mockReturnValue("sirv");
});
jest.mock("vite", () => {
  return {
    createServer: jest.fn().mockResolvedValue({
      middlewares: "middlewares",
      close: jest.fn()
    })
  };
});

async function createTestFixture() {
  const mod = await import("vite");

  return {
    createServer: mod.createServer
  };
}

describe("ViteServer", () => {
  describe("with default options - dev mode", () => {
    beforeEach(() =>
      PlatformTest.create({
        vike: {}
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load vike dev server", async () => {
      const {createServer} = await createTestFixture();
      const vikeDevServer = PlatformTest.get<VIKE_SERVER>(VIKE_SERVER);

      expect(vikeDevServer.middlewares).toEqual("middlewares");
      expect(createServer).toHaveBeenCalledWith({
        logLevel: "off",
        server: {
          middlewareMode: true
        }
      });
    });
    it("should load and close server", async () => {
      const {createServer} = await createTestFixture();
      const vikeDevServer = PlatformTest.get<VIKE_SERVER>(VIKE_SERVER);
      vikeDevServer.close = jest.fn();

      expect(vikeDevServer.middlewares).toEqual("middlewares");
      expect(createServer).toHaveBeenCalledWith({
        logLevel: "off",
        server: {
          middlewareMode: true
        }
      });

      await PlatformTest.injector.destroy();

      expect(vikeDevServer.close).toHaveBeenCalledWith();
    });
  });
  describe("with defined options - dev mode", () => {
    beforeEach(() =>
      PlatformTest.create({
        vike: {
          logLevel: "error",
          root: "/root",
          server: {
            middlewareMode: false
          }
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load vike dev server", async () => {
      const {createServer} = await createTestFixture();
      const vikeDevServer = PlatformTest.get<VIKE_SERVER>(VIKE_SERVER);

      expect(vikeDevServer.middlewares).toEqual("middlewares");
      expect(createServer).toHaveBeenCalledWith({
        logLevel: "error",
        root: "/root",
        server: {
          middlewareMode: true
        }
      });
    });
  });
  describe("with default options - prod mode", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD,
        vite: {},
        logger: {
          level: "off"
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load sirv to expose statics files", async () => {
      await createTestFixture();
      const vikeDevServer = PlatformTest.get<VIKE_SERVER>(VIKE_SERVER);

      expect(vikeDevServer.middlewares).toEqual("sirv");
      expect(sirv).toHaveBeenCalledWith("/dist/client", {
        dev: false,
        dotfiles: false
      });
    });
  });
  describe("with defined options - prod mode", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD,
        logger: {
          level: "off"
        },
        vike: {
          root: "/root"
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load sirv to expose statics files", () => {
      const vikeDevServer = PlatformTest.get<VIKE_SERVER>(VIKE_SERVER);

      expect(vikeDevServer.middlewares).toEqual("sirv");
      expect(sirv).toHaveBeenCalledWith("/root/dist/client", {dev: false, dotfiles: false});
    });
  });
});
