import {expect} from "chai";
import {InjectionError} from "../../src/errors/InjectionError";

describe("InjectionError", () => {
  it("should create new instance of InjectionError (1)", () => {
    const error = new InjectionError(class Target {}, "SERVICE");

    expect(error.message).to.equal("Injection failed on Target\nOrigin: SERVICE");
    expect(error.name).to.equal("INJECTION_ERROR");
  });

  it("should create new instance of InjectionError (2)", () => {
    const error = new InjectionError(class Target {}, new Error("test"));

    expect(error.message).to.equal("Injection failed on Target\nOrigin: test");
    expect(error.name).to.equal("INJECTION_ERROR");
  });
});
