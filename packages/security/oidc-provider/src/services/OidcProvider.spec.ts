import {PlatformTest, runInContext} from "@tsed/common";
import {Env} from "@tsed/core";
import {OidcProvider} from "@tsed/oidc-provider";
import "../../test/app/controllers/oidc/InteractionsCtrl";

describe("OidcProvider", () => {
  describe("Production", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD,
        oidc: {
          issuer: "http://localhost:8081",
          secureKey: ["secureKey"]
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should create oidc instance", () => {
      const oidcProvider = PlatformTest.get<OidcProvider>(OidcProvider);

      // @ts-ignore
      expect(oidcProvider.getInteractionsUrl()({}, {uid: "uid"})).toEqual("/interaction/uid");
    });
  });
  describe("createErrorHandler()", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD,
        oidc: {
          issuer: "http://localhost:8081",
          secureKey: ["secureKey"]
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should intercept all oidc errors", () => {
      const oidcProvider = PlatformTest.get<OidcProvider>(OidcProvider);
      jest.spyOn((oidcProvider as any).injector.logger, "error");

      const fn = (oidcProvider as any).createErrorHandler("event");
      fn(
        {
          headers: {
            origin: "origin"
          },
          oidc: {
            params: {
              client_id: "client_id"
            }
          }
        },
        {error: "error", error_description: "error_description", error_detail: "error_detail"},
        "account_id",
        "sid"
      );

      expect((oidcProvider as any).injector.logger.error).toHaveBeenCalledWith({
        account_id: "account_id",
        error: {error_description: "error_description", error_detail: "error_detail", error_name: "error"},
        event: "OIDC_ERROR",
        headers: {
          origin: "origin"
        },
        params: {client_id: "client_id"},
        sid: "sid",
        type: "event"
      });
    });
    it("should intercept all oidc errors (in request context)", async () => {
      const oidcProvider = PlatformTest.get<OidcProvider>(OidcProvider);
      const ctx = PlatformTest.createRequestContext();

      jest.spyOn(ctx.logger, "error");

      const fn = (oidcProvider as any).createErrorHandler("event");

      await runInContext(ctx, () => {
        fn(
          {
            headers: {
              origin: "origin"
            },
            oidc: {
              params: {
                client_id: "client_id"
              }
            }
          },
          {error: "error", error_description: "error_description", error_detail: "error_detail"},
          "account_id",
          "sid"
        );
      });

      expect(ctx.logger.error).toHaveBeenCalledWith({
        account_id: "account_id",
        error: {error_description: "error_description", error_detail: "error_detail", error_name: "error"},
        event: "OIDC_ERROR",
        headers: {
          origin: "origin"
        },
        params: {client_id: "client_id"},
        sid: "sid",
        type: "event"
      });
    });
  });
  describe("createPrompt()", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD,
        oidc: {
          issuer: "http://localhost:8081",
          secureKey: ["secureKey"]
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should bind options to prompt instance", () => {
      const oidcProvider = PlatformTest.get<OidcProvider>(OidcProvider);
      const instance = {};
      const options = {
        name: "name",
        requestable: true,
        details: jest.fn(),
        checks: []
      };

      const prompt = oidcProvider.createPrompt(instance, options);

      expect(prompt.details).toEqual(options.details);
      expect(prompt.name).toEqual(options.name);
      expect(prompt.requestable).toEqual(options.requestable);
    });

    it("should bind methods from instance to prompt instance", () => {
      const oidcProvider = PlatformTest.get<OidcProvider>(OidcProvider);
      const instance = {
        details: jest.fn(),
        checks: jest.fn().mockReturnValue([])
      };
      const options = {
        name: "name",
        requestable: true
      };

      const prompt = oidcProvider.createPrompt(instance, options);

      expect(prompt.details).toBeDefined();
      expect(prompt.name).toEqual(options.name);
      expect(prompt.requestable).toEqual(options.requestable);
    });
  });
});
