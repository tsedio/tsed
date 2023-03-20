import {PlatformTest} from "@tsed/common";
import "../index";
import {Stripe} from "stripe";

describe("StripeFactory", () => {
  beforeEach(() =>
    PlatformTest.create({
      stripe: {
        apiKey: "the_api_key",
        apiVersion: "2020-08-27"
      }
    })
  );
  afterEach(PlatformTest.reset);

  it("should inject the strip instance", () => {
    const stripe = PlatformTest.get<Stripe>(Stripe);

    expect(stripe).toBeInstanceOf(Stripe);
  });
});
