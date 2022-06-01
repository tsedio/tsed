import {TemplateRenderError} from "./TemplateRenderError";

describe("TemplateRenderingError", () => {
  it("should have a message", () => {
    const errorInstance = new TemplateRenderError(class Target {}, "method", new Error("test"));
    expect(errorInstance.message).toEqual("Template rendering error: Target.method()\nError: test");
    expect(errorInstance.name).toEqual("TEMPLATE_RENDER_ERROR");
  });
});
