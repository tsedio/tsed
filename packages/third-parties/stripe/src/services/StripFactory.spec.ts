import {PlatformTest} from "@tsed/common";
import "@tsed/stripe";
import {expect} from "chai";
import {Stripe} from "stripe";

describe("StripFactory", () => {
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

    expect(stripe).to.be.instanceOf(Stripe);
  });
});
