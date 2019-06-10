import {InjectionError} from "../../src/errors/InjectionError";

describe("InjectionError", () => {
  it("should create new instance of InjectionError (1)", () => {
    const error = new InjectionError(class Target {
    }, "SERVICE");

    error.message.should.equal("Injection failed on Target\nOrigin: SERVICE");
    error.name.should.equal("INJECTION_ERROR");
  });

  it("should create new instance of InjectionError (2)", () => {
    const error = new InjectionError(class Target {
    }, new Error("test"));

    error.message.should.equal("Injection failed on Target\nOrigin: test");
    error.name.should.equal("INJECTION_ERROR");
  });
});
