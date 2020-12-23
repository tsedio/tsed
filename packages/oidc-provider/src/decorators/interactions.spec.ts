import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import "../../test/app/controllers/oidc/InteractionsCtrl";

describe("@Interactions", () => {
  beforeEach(() =>
    PlatformTest.create({
      oidc: {
        options: {
          claims: {}
        }
      }
    })
  );
  afterEach(() => PlatformTest.create());
  it("should create interactions", () => {
    PlatformTest.injector.resolveConfiguration();

    const oidc = PlatformTest.injector.settings.get("oidc");

    expect(oidc.options.claims).to.deep.equal({});
  });
});
