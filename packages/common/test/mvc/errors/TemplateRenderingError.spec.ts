import {expect} from "chai";
import {TemplateRenderingError} from "../../../src/mvc";

describe("TemplateRenderingError", () => {
  before(() => {
    this.errorInstance = new TemplateRenderingError(class Target {
    }, "method", new Error("test"));
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Template rendering error : Target.method()\nError: test");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("INTERNAL_SERVER_ERROR");
  });
});
