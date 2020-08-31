import {inject} from "@tsed/testing";
import {expect} from "chai";
import {ParseService} from "../../../src";

describe("ParseService :", () => {
  it("should clone object", () => {
    const source = {};

    expect(ParseService.clone(source)).not.to.be.equal(source);
  });

  it("should not clone object", inject([ParseService], (parserService: ParseService) => {
    const source = {test: {}};

    expect(parserService.eval(undefined!, source, false)).to.equal(source);
    expect(parserService.eval("test", source, false)).to.equal(source.test);
  }));

  it("should eval expression with a scope and return value", inject([ParseService], (parserService: ParseService) => {
    expect(
      parserService.eval(undefined!, {
        test: "yes"
      }).test
    ).to.equal("yes");

    expect(parserService.eval(undefined!, "test")).to.equal("test");
  }));

  it("should eval expression with a scope and return value", inject([ParseService], (parserService: ParseService) => {
    expect(
      parserService.eval("test", {
        test: "yes"
      })
    ).to.equal("yes");
  }));

  it("should eval expression with a scope and return value", inject([ParseService], (parserService: ParseService) => {
    expect(
      parserService.eval("test.foo", {
        test: "yes"
      })
    ).to.equal(undefined);
  }));

  it("should eval expression with a scope and return a new object", inject([ParseService], (parserService: ParseService) => {
    const scope = {
      test: {
        foo: "yes"
      }
    };

    const value = parserService.eval("test", scope);

    expect(value.foo).to.equal("yes");

    value.foo = "test";

    expect(value.foo).to.not.equal(scope.test.foo); // New instance
  }));
});
