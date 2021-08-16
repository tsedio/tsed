import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import proxyquire from "proxyquire";
import Sinon from "sinon";
import {OidcProvider} from "./services/OidcProvider";

const expressRewrite = Sinon.spy(require("express-urlrewrite"));
const koaRewrite = Sinon.spy(require("koa-rewrite"));
const koaMount = Sinon.spy(require("koa-mount"));

const {OidcModule} = proxyquire.noCallThru()("./OidcModule", {
  "express-urlrewrite": expressRewrite,
  "koa-rewrite": koaRewrite,
  "koa-mount": koaMount
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

        Sinon.stub(mdl.app, "use");

        await mdl.$onRoutesInit();

        expect(expressRewrite).to.have.been.calledWithExactly("/.well-known/*", "/oidc/.well-known/$1");
        expect(mdl.app.use).to.have.been.calledWithExactly(Sinon.match.func);
      });
      it("should mount the oidc provider server to application", async () => {
        const provider = {
          app: "app",
          callback: Sinon.stub().returns("callback")
        };
        const oidcProvider = {
          hasConfiguration: Sinon.stub().returns(true),
          get: Sinon.stub().returns(provider),
          create: Sinon.stub()
        };
        const mdl = await PlatformTest.invoke(OidcModule, [
          {
            token: OidcProvider,
            use: oidcProvider
          }
        ]);

        Sinon.stub(mdl.app, "use");

        await mdl.$afterRoutesInit();

        expect(mdl.app.use).to.have.been.calledWithExactly("/oidc", "callback");
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

    afterEach(() => {
      PlatformTest.reset();
      expressRewrite.resetHistory();
      koaRewrite.resetHistory();
      koaMount.resetHistory();
    });
    describe('when path "/oidc"', () => {
      it("should register the appropriate rewrite middleware", async () => {
        const mdl = await PlatformTest.invoke(OidcModule);

        Sinon.stub(mdl.app, "use");

        await mdl.$onRoutesInit();

        expect(koaRewrite).to.have.been.calledWithExactly("/.well-known/(.*)", "/oidc/.well-known/$1");
        expect(mdl.app.use).to.have.been.calledWithExactly(Sinon.match.func);
      });
      it("should mount the oidc provider server to application", async () => {
        const provider = {
          app: "app",
          callback: Sinon.stub().returns("callback")
        };
        const oidcProvider = {
          hasConfiguration: Sinon.stub().returns(true),
          get: Sinon.stub().returns(provider),
          create: Sinon.stub()
        };
        const mdl = await PlatformTest.invoke(OidcModule, [
          {
            token: OidcProvider,
            use: oidcProvider
          }
        ]);

        Sinon.stub(mdl.app, "use");

        await mdl.$afterRoutesInit();

        expect(koaMount).to.have.been.calledWithExactly("/oidc", "app");
        expect(mdl.app.use).to.have.been.calledWithExactly(Sinon.match.func);
      });
    });
  });
});
