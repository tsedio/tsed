import {InjectionError} from "../../src/errors/InjectionError";

describe("InjectionError", () => {
  it("should create new instance of InjectionError", () => {
    const error = new InjectionError(class Target {
    }, "SERVICE");

    error.message.should.equal("Injection failed on Target\nOrigin: SERVICE");
    error.name.should.equal("INJECTION_ERROR");
  });
});
