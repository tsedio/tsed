import {Env} from "@tsed/core";
import {PlatformTest} from "@tsed/platform-http/testing";
import sirv from "sirv";

import {VITE_SERVER} from "./ViteServer.js";

vi.mock("sirv", () => {
  return {default: vi.fn().mockReturnValue("sirv")};
});
vi.mock("vite", () => {
  return {
    createServer: vi.fn().mockResolvedValue({
      middlewares: "middlewares",
      close: vi.fn()
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
        vite: {}
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load vite dev server", async () => {
      const {createServer} = await createTestFixture();
      const viteDevServer = PlatformTest.get<VITE_SERVER>(VITE_SERVER);

      expect(viteDevServer.middlewares).toEqual("middlewares");
      expect(createServer).toHaveBeenCalledWith({
        logLevel: "off",
        server: {
          middlewareMode: true
        }
      });
    });
    it("should load and close server", async () => {
      const {createServer} = await createTestFixture();
      const viteDevServer = PlatformTest.get<VITE_SERVER>(VITE_SERVER);
      viteDevServer.close = vi.fn();

      expect(viteDevServer.middlewares).toEqual("middlewares");
      expect(createServer).toHaveBeenCalledWith({
        logLevel: "off",
        server: {
          middlewareMode: true
        }
      });

      await PlatformTest.injector.destroy();

      expect(viteDevServer.close).toHaveBeenCalledWith();
    });
  });
  describe("with defined options - dev mode", () => {
    beforeEach(() =>
      PlatformTest.create({
        vite: {
          logLevel: "error",
          root: "/root",
          server: {
            middlewareMode: false
          }
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load vite dev server", async () => {
      const {createServer} = await createTestFixture();
      const viteDevServer = PlatformTest.get<VITE_SERVER>(VITE_SERVER);

      expect(viteDevServer.middlewares).toEqual("middlewares");
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
      const viteDevServer = PlatformTest.get<VITE_SERVER>(VITE_SERVER);

      expect(viteDevServer.middlewares).toEqual("sirv");
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
        vite: {
          root: "/root"
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load sirv to expose statics files", () => {
      const viteDevServer = PlatformTest.get<VITE_SERVER>(VITE_SERVER);

      expect(viteDevServer.middlewares).toEqual("sirv");
      expect(sirv).toHaveBeenCalledWith("/root/dist/client", {dev: false, dotfiles: false});
    });
  });
});
