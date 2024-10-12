import "../../test/app/controllers/oidc/InteractionsCtrl.js";

import {PlatformTest} from "@tsed/platform-http/testing";

describe("@Interactions", () => {
  beforeEach(() =>
    PlatformTest.create({
      oidc: {
        options: {
          claims: {}
        }
      } as any
    })
  );
  afterEach(() => PlatformTest.create());
  it("should create interactions", () => {
    PlatformTest.injector.resolveConfiguration();

    const oidc = PlatformTest.injector.settings.get("oidc");

    expect(oidc.options.claims).toEqual({});
  });
});
