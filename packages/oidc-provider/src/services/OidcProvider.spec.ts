import {Injectable, PlatformTest} from "@tsed/common";
import {Env} from "@tsed/core";
import {OidcProvider} from "@tsed/oidc-provider";
import {expect} from "chai";
import "../../test/app/controllers/oidc/InteractionsCtrl";

@Injectable()
class Clients {
  find(clientId: string) {
    return clientId;
  }
}

describe("OidcProvider", () => {
  describe("Production", () => {
    beforeEach(() =>
      PlatformTest.create({
        env: Env.PROD,
        oidc: {
          issuer: "http://localhost:8081",
          Clients: Clients as any,
          secureKey: ["secureKey"]
        }
      })
    );
    afterEach(() => PlatformTest.reset());

    it("should create oidc instance", () => {
      const oidcProvider = PlatformTest.get<OidcProvider>(OidcProvider);

      expect(oidcProvider.get().Client.find("client_id")).to.deep.eq("client_id");
      // @ts-ignore
      expect(oidcProvider.getInteractionsUrl()({oidc: {uid: "uid"}})).to.deep.eq("/interaction/uid");
    });
  });
});
