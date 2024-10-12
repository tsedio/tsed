import {PlatformTest} from "@tsed/platform-http/testing";
import expressRewrite from "express-urlrewrite";
import koaMount from "koa-mount";
// @ts-ignore
import koaRewrite from "koa-rewrite";

import {OidcModule} from "./OidcModule.js";
import {OidcProvider} from "./services/OidcProvider.js";

vi.mock("express-urlrewrite", () => {
  return {default: vi.fn().mockReturnValue(vi.fn())};
});
vi.mock("koa-rewrite", () => {
  return {default: vi.fn().mockReturnValue(vi.fn())};
});
vi.mock("koa-mount", () => {
  return {default: vi.fn().mockReturnValue(vi.fn())};
});

describe("OidcModule", () => {
  describe("with express", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "express",
        oidc: {
          path: "/oidc"
        }
      })
    );

    afterEach(() => PlatformTest.reset());
    describe('when path "/oidc"', () => {
      it("should register the appropriate rewrite middleware", async () => {
        const mdl = await PlatformTest.invoke<any>(OidcModule);

        vi.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$onRoutesInit();

        expect(expressRewrite).toHaveBeenCalledWith("/.well-known/*", "/oidc/.well-known/$1");
        expect(mdl.app.use).toHaveBeenCalledWith(expect.any(Function));
      });
      it("should mount the oidc provider server to application", async () => {
        const provider = {
          app: "app",
          callback: vi.fn().mockReturnValue("callback")
        };
        const oidcProvider = {
          hasConfiguration: vi.fn().mockReturnValue(true),
          get: vi.fn().mockReturnValue(provider),
          create: vi.fn()
        };
        const mdl = await PlatformTest.invoke<any>(OidcModule, [
          {
            token: OidcProvider,
            use: oidcProvider
          }
        ]);

        vi.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$afterRoutesInit();

        expect(mdl.app.use).toHaveBeenCalledWith("/oidc", "callback");
      });
    });
  });
  describe("with koa", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "koa",
        oidc: {
          path: "/oidc"
        }
      })
    );

    afterEach(() => PlatformTest.reset());
    describe('when path "/oidc"', () => {
      it("should register the appropriate rewrite middleware", async () => {
        const mdl = await PlatformTest.invoke<any>(OidcModule);

        vi.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$onRoutesInit();

        expect(koaRewrite).toHaveBeenCalledWith("/.well-known/(.*)", "/oidc/.well-known/$1");
        expect(mdl.app.use).toHaveBeenCalledWith(expect.any(Function));
      });
      it("should mount the oidc provider server to application", async () => {
        const provider = {
          app: "app",
          callback: vi.fn().mockReturnValue("callback")
        };
        const oidcProvider = {
          hasConfiguration: vi.fn().mockReturnValue(true),
          get: vi.fn().mockReturnValue(provider),
          create: vi.fn()
        };
        const mdl = await PlatformTest.invoke<any>(OidcModule, [
          {
            token: OidcProvider,
            use: oidcProvider
          }
        ]);

        vi.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$afterRoutesInit();

        expect(koaMount).toHaveBeenCalledWith("/oidc", "app");
        expect(mdl.app.use).toHaveBeenCalledWith(expect.any(Function));
      });
    });
  });
});
