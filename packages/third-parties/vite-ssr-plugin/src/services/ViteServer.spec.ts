import {PlatformTest} from "@tsed/common";
import {Env} from "@tsed/core";
import sirv from "sirv";
import {createServer} from "vite";

import {VITE_SERVER} from "./ViteServer";

jest.mock("vite-plugin-ssr/server");
jest.mock("vite");
jest.mock("sirv");

describe("ViteServer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (createServer as jest.Mock).mockResolvedValue({middlewares: "middlewares"});
    (sirv as jest.Mock).mockReturnValue("sirv");
  });

  describe("with default options - dev mode", () => {
    beforeEach(() =>
      PlatformTest.create({
        vite: {}
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should load vite dev server", () => {
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
      const viteDevServer = PlatformTest.get<VITE_SERVER>(VITE_SERVER);
      viteDevServer.close = jest.fn();

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

    it("should load vite dev server", () => {
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

    it("should load sirv to expose statics files", () => {
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
