import {ControllerProvider} from "./ControllerProvider.js";
import {ProviderScope} from "./ProviderScope.js";

class Test {}

describe("ControllerProvider", () => {
  let controllerProvider: ControllerProvider;

  beforeAll(() => {
    controllerProvider = new ControllerProvider(Test);
    controllerProvider.path = "/";
    controllerProvider.scope = ProviderScope.REQUEST;
    controllerProvider.middlewares = {
      useBefore: [new Function()],
      use: [new Function()],
      useAfter: [new Function()]
    };
  });

  it("should have type field to equals to controller", () => {
    expect(controllerProvider.type).toEqual("controller");
  });

  it("should get path", () => {
    expect(controllerProvider.path).toEqual("/");
  });

  it("should get children", () => {
    expect(controllerProvider.children).toHaveLength(0);
  });

  it("should get a scope", () => {
    expect(controllerProvider.scope).toEqual("request");
  });

  it("should have children", () => {
    expect(controllerProvider.hasChildren()).toEqual(false);
  });
  it("should get parent", () => {
    expect(!!controllerProvider.parent).toBe(false);
  });

  it("should have parent", () => {
    expect(!!controllerProvider.hasParent()).toBe(false);
  });

  it("should have a middlewares", () => {
    expect(Array.isArray(controllerProvider.middlewares.use)).toBe(true);
    expect(controllerProvider.middlewares.use![0]).toBeInstanceOf(Function);
    expect(Array.isArray(controllerProvider.middlewares.useAfter)).toBe(true);
    expect(controllerProvider.middlewares.useAfter![0]).toBeInstanceOf(Function);
    expect(Array.isArray(controllerProvider.middlewares.useBefore)).toBe(true);
    expect(controllerProvider.middlewares.useBefore![0]).toBeInstanceOf(Function);
  });
});
