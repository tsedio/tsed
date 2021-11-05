import {getEnumerableKeys} from "@tsed/core";
import {ProviderScope} from "@tsed/di";
import {expect} from "chai";
import {ControllerProvider} from "./ControllerProvider";

class Test {}

describe("ControllerProvider", () => {
  let controllerProvider: ControllerProvider;

  before(() => {
    controllerProvider = new ControllerProvider(Test);
    controllerProvider.path = "/";
    controllerProvider.scope = ProviderScope.REQUEST;
    controllerProvider.routerOptions = {};
    controllerProvider.middlewares = {
      useBefore: [new Function()],
      use: [new Function()],
      useAfter: [new Function()]
    };
  });

  it("should have type field to equals to controller", () => {
    expect(controllerProvider.type).to.equal("controller");
  });

  it("should get path", () => {
    expect(controllerProvider.path).to.equal("/");
  });

  it("should get children", () => {
    expect(controllerProvider.children).to.be.an("array").and.have.length(0);
  });

  it("should get a scope", () => {
    expect(controllerProvider.scope).to.eq("request");
  });

  it("should get routerOptions", () => {
    expect(controllerProvider.routerOptions).to.be.an("object");
  });

  it("should have children", () => {
    expect(controllerProvider.hasChildren()).to.eq(false);
  });
  it("should get parent", () => {
    expect(!!controllerProvider.parent).to.be.false;
  });

  it("should have parent", () => {
    expect(!!controllerProvider.hasParent()).to.be.false;
  });

  it("should have a middlewares", () => {
    expect(controllerProvider.middlewares.use).to.be.an("array");
    expect(controllerProvider.middlewares.use[0]).to.be.an("function");
    expect(controllerProvider.middlewares.useAfter).to.be.an("array");
    expect(controllerProvider.middlewares.useAfter[0]).to.be.an("function");
    expect(controllerProvider.middlewares.useBefore).to.be.an("array");
    expect(controllerProvider.middlewares.useBefore[0]).to.be.an("function");
  });
});
