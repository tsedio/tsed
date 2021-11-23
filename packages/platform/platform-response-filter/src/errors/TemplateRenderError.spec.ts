import {expect} from "chai";
import {TemplateRenderError} from "./TemplateRenderError";

describe("TemplateRenderingError", () => {
  it("should have a message", () => {
    const errorInstance = new TemplateRenderError(class Target {}, "method", new Error("test"));
    expect(errorInstance.message).to.equal("Template rendering error: Target.method()\nError: test");
    expect(errorInstance.name).to.equal("TEMPLATE_RENDER_ERROR");
  });
});
