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
});
