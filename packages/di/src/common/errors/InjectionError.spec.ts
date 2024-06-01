import {InjectionError} from "./InjectionError.js";

describe("InjectionError", () => {
  it("should create new instance of InjectionError (1)", () => {
    const error = new InjectionError(class Target {}, "SERVICE");

    expect(error.message).toEqual("Injection failed on Target\nOrigin: SERVICE");
    expect(error.name).toEqual("INJECTION_ERROR");
  });

  it("should create new instance of InjectionError (2)", () => {
    const error = new InjectionError(class Target {}, new Error("test"));

    expect(error.message).toEqual("Injection failed on Target\nOrigin: test");
    expect(error.name).toEqual("INJECTION_ERROR");
  });
});
