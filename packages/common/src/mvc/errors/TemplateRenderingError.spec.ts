import {expect} from "chai";
import {TemplateRenderingError} from "../../../src/mvc";

describe("TemplateRenderingError", () => {
  it("should have a message", () => {
    const errorInstance = new TemplateRenderingError(class Target {}, "method", new Error("test"));
    expect(errorInstance.message).to.equal("Template rendering error: Target.method()\nError: test");
    expect(errorInstance.name).to.equal("TEMPLATING_RENDER_ERROR");
  });
});
