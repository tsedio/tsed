import {PlatformTest} from "@tsed/common";
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
