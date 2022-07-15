import {PlatformTest} from "@tsed/common";
import expressRewrite from "express-urlrewrite";
import koaMount from "koa-mount";
// @ts-ignore
import koaRewrite from "koa-rewrite";
import {OidcModule} from "./OidcModule";
import {OidcProvider} from "./services/OidcProvider";

jest.mock("express-urlrewrite", () => {
  return jest.fn().mockReturnValue(jest.fn());
});
jest.mock("koa-rewrite", () => {
  return jest.fn().mockReturnValue(jest.fn());
});
jest.mock("koa-mount", () => {
  return jest.fn().mockReturnValue(jest.fn());
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
        const mdl = await PlatformTest.invoke(OidcModule);

        jest.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$onRoutesInit();

        expect(expressRewrite).toBeCalledWith("/.well-known/*", "/oidc/.well-known/$1");
        expect(mdl.app.use).toBeCalledWith(expect.any(Function));
      });
      it("should mount the oidc provider server to application", async () => {
        const provider = {
          app: "app",
          callback: jest.fn().mockReturnValue("callback")
        };
        const oidcProvider = {
          hasConfiguration: jest.fn().mockReturnValue(true),
          get: jest.fn().mockReturnValue(provider),
          create: jest.fn()
        };
        const mdl = await PlatformTest.invoke(OidcModule, [
          {
            token: OidcProvider,
            use: oidcProvider
          }
        ]);

        jest.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$afterRoutesInit();

        expect(mdl.app.use).toBeCalledWith("/oidc", "callback");
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
        const mdl = await PlatformTest.invoke(OidcModule);

        jest.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$onRoutesInit();

        expect(koaRewrite).toBeCalledWith("/.well-known/(.*)", "/oidc/.well-known/$1");
        expect(mdl.app.use).toBeCalledWith(expect.any(Function));
      });
      it("should mount the oidc provider server to application", async () => {
        const provider = {
          app: "app",
          callback: jest.fn().mockReturnValue("callback")
        };
        const oidcProvider = {
          hasConfiguration: jest.fn().mockReturnValue(true),
          get: jest.fn().mockReturnValue(provider),
          create: jest.fn()
        };
        const mdl = await PlatformTest.invoke(OidcModule, [
          {
            token: OidcProvider,
            use: oidcProvider
          }
        ]);

        jest.spyOn(mdl.app, "use").mockReturnValue(undefined);

        await mdl.$afterRoutesInit();

        expect(koaMount).toBeCalledWith("/oidc", "app");
        expect(mdl.app.use).toBeCalledWith(expect.any(Function));
      });
    });
  });
});
