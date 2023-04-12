import {PlatformTest} from "@tsed/common";
import {Env} from "@tsed/core";
import {Interaction} from "../decorators/interaction";
import {OidcInteractions} from "./OidcInteractions";
import {OidcPolicy} from "./OidcPolicy";

describe("OidcPolicy", () => {
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

  describe("createPrompt()", () => {
    it("should bind options to prompt instance", async () => {
      const oidcProvider = PlatformTest.get<OidcPolicy>(OidcPolicy);
      const instance = {};
      const options = {
        name: "name",
        requestable: true,
        details: jest.fn(),
        checks: []
      };

      const prompt = await oidcProvider.createPrompt(instance, options);

      expect(prompt.details).toEqual(options.details);
      expect(prompt.name).toEqual(options.name);
      expect(prompt.requestable).toEqual(options.requestable);
    });

    it("should bind methods from instance to prompt instance", async () => {
      const oidcProvider = PlatformTest.get<OidcPolicy>(OidcPolicy);
      const instance = {
        details: jest.fn(),
        checks: jest.fn().mockReturnValue([])
      };
      const options = {
        name: "name",
        requestable: true
      };

      const prompt = await oidcProvider.createPrompt(instance, options);

      expect(prompt.details).toBeDefined();
      expect(prompt.name).toEqual(options.name);
      expect(prompt.requestable).toEqual(options.requestable);
    });
  });
  describe("getPolicy()", () => {
    @Interaction({
      name: "test"
    })
    class TestInteraction {}

    @Interaction({
      name: "test2"
    })
    class Test2Interaction {}

    @Interaction({
      name: "login"
    })
    class LoginInteraction {}

    @Interaction({
      name: "consent"
    })
    class ConsentInteraction {}

    @Interaction({
      name: "test3",
      priority: 0
    })
    class Test3Interaction {}

    it("should load policy (without priority)", async () => {
      const oidcInteractions = {
        getInteractions: jest
          .fn()
          .mockReturnValue([
            PlatformTest.injector.getProvider(Test2Interaction),
            PlatformTest.injector.getProvider(LoginInteraction),
            PlatformTest.injector.getProvider(ConsentInteraction),
            PlatformTest.injector.getProvider(TestInteraction)
          ])
      };

      const oidcProvider = await PlatformTest.invoke<OidcPolicy>(OidcPolicy, [
        {
          token: OidcInteractions,
          use: oidcInteractions
        }
      ]);

      const policy = oidcProvider.getPolicy();

      expect(policy.map(({name}) => name)).toEqual(["test2", "login", "consent", "test"]);
    });
    it("should load policy (with priority)", async () => {
      const oidcInteractions = {
        getInteractions: jest
          .fn()
          .mockReturnValue([
            PlatformTest.injector.getProvider(Test2Interaction),
            PlatformTest.injector.getProvider(LoginInteraction),
            PlatformTest.injector.getProvider(ConsentInteraction),
            PlatformTest.injector.getProvider(TestInteraction),
            PlatformTest.injector.getProvider(Test3Interaction)
          ])
      };

      const oidcProvider = await PlatformTest.invoke<OidcPolicy>(OidcPolicy, [
        {
          token: OidcInteractions,
          use: oidcInteractions
        }
      ]);

      const policy = oidcProvider.getPolicy();

      expect(policy.map(({name}) => name)).toEqual(["test3", "login", "consent", "test2", "test"]);
    });
  });
});
