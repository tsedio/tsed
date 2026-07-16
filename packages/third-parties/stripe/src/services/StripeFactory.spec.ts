import "../index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Stripe} from "stripe";

describe("StripeFactory", () => {
  describe("when there is configuration", () => {
    beforeEach(() =>
      PlatformTest.create({
        stripe: {
          apiKey: "the_api_key",
          apiVersion: "2025-02-24.acacia"
        }
      })
    );
    afterEach(PlatformTest.reset);

    it("should inject the strip instance", () => {
      const stripe = PlatformTest.get<Stripe>(Stripe);

      expect(stripe).toBeInstanceOf(Stripe);
    });
  });
  describe("when there is no configuration", () => {
    beforeEach(() => PlatformTest.create({}));
    afterEach(PlatformTest.reset);

    it("should inject the strip instance", () => {
      const stripe = PlatformTest.get<Stripe>(Stripe);

      expect(stripe).not.toBeInstanceOf(Stripe);
    });
  });
});
