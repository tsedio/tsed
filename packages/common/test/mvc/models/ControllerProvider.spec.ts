import {getKeys} from "@tsed/core";
import {expect} from "chai";
import {ProviderScope} from "../../../../di/src/interfaces";
import {ControllerProvider} from "../../../src/mvc";

class Test {
}

class Test2 {
}

describe("ControllerProvider", () => {
  let controllerProvider: ControllerProvider;

  before(() => {
    controllerProvider = new ControllerProvider(Test);
    controllerProvider.path = "/";
    controllerProvider.children = [Test2];
    controllerProvider.scope = ProviderScope.REQUEST;
    controllerProvider.routerOptions = {};
    controllerProvider.middlewares = {
      useBefore: [new Function()],
      use: [new Function()],
      useAfter: [new Function()]
    };
  });

  it("should return all keys available for serialisation", () => {
    expect(getKeys(controllerProvider)).to.deep.equal([
      "root",
      "type",
      "injectable",
      "path",
      "children",
      "useClass",
      "scope",
      "configuration",
      "instance",
      "deps",
      "imports",
      "useFactory",
      "useAsyncFactory",
      "useValue"
    ]);
  });

  it("should have type field to equals to controller", () => {
    expect(controllerProvider.type).to.equal("controller");
  });

  it("should get path", () => {
    expect(controllerProvider.path).to.equal("/");
  });

  it("should get endpoints", () => {
    expect(controllerProvider.endpoints)
      .to.be.an("array")
      .and.have.length(0);
  });

  it("should get children", () => {
    expect(controllerProvider.children)
      .to.be.an("array")
      .and.have.length(1);
  });

  it("should have a dependency witch have $parentCtrl attributs", () => {
    expect(controllerProvider.children[0])
      .to.equals(Test2)
      .and.have.property("$parentCtrl");
  });

  it("should get a scope", () => {
    expect(controllerProvider.scope).to.eq("request");
  });

  it("should get routerOptions", () => {
    expect(controllerProvider.routerOptions).to.be.an("object");
  });

  it("should get endpoint Url without parameters", () => {
    expect(controllerProvider.getEndpointUrl()).to.eq("/");
  });

  it("should get endpoint Url with parameters", () => {
    expect(controllerProvider.getEndpointUrl("/")).to.eq("/");
  });

  it("should get endpoint Url with parameters", () => {
    expect(controllerProvider.getEndpointUrl("/rest/")).to.eq("/rest/");
  });

  it("should have endpoint url", () => {
    expect(controllerProvider.hasEndpointUrl()).to.eq(true);
  });
  it("should have children", () => {
    expect(controllerProvider.hasChildren()).to.eq(true);
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
