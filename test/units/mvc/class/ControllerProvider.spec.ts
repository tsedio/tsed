import {expect} from "chai";
import {ControllerProvider} from "../../../../src/common/mvc/class/ControllerProvider";

class Test {

}

class Test2 {
}

describe("ControllerProvider", () => {

    before(() => {
        this.ControllerProvider = new ControllerProvider(Test);
        this.ControllerProvider.path = "/";
        this.ControllerProvider.pushRouterPath("/");
        this.ControllerProvider.dependencies = [Test2];
        this.ControllerProvider.scope = "request";
        this.ControllerProvider.routerOptions = {};
        this.ControllerProvider.middlewares = {
            useBefore: new Function,
            use: new Function,
            useAfter: new Function
        };
    });

    it("should have type field to equals to controller", () =>
        expect(this.ControllerProvider.type).to.equal("controller")
    );

    it("should get path", () =>
        expect(this.ControllerProvider.path).to.equal("/")
    );

    it("should get routerPaths", () =>
        expect(this.ControllerProvider.routerPaths).to.be.an("array").and.have.length(1)
    );

    it("should get endpoints", () =>
        expect(this.ControllerProvider.endpoints).to.be.an("array").and.have.length(0)
    );

    it("should get dependencies", () =>
        expect(this.ControllerProvider.dependencies).to.be.an("array").and.have.length(1)
    );

    it("should have a dependency witch have $parentCtrl attributs", () =>
        expect(this.ControllerProvider.dependencies[0])
            .to.equals(Test2)
            .and.have.property("$parentCtrl")
    );

    it("should get a scope", () => {
        expect(this.ControllerProvider.scope).to.eq("request");
    });

    it("should get routerOptions", () => {
        expect(this.ControllerProvider.routerOptions).to.be.an("object");
    });

    it("should get endpoint Url without parameters", () => {
        expect(this.ControllerProvider.getEndpointUrl()).to.eq("/");
    });

    it("should get endpoint Url with parameters", () => {
        expect(this.ControllerProvider.getEndpointUrl("/")).to.eq("/");
    });

    it("should get endpoint Url with parameters", () => {
        expect(this.ControllerProvider.getEndpointUrl("/rest/")).to.eq("/rest/");
    });

    it("should have endpoint url", () => {
        expect(this.ControllerProvider.hasEndpointUrl()).to.eq(true);
    });

    it("should have dependencies", () => {
        expect(this.ControllerProvider.hasDependencies()).to.eq(true);
    });

    it("should get parent", () => {
        expect(!!this.ControllerProvider.parent).to.be.false;
    });

    it("should have parent", () => {
        expect(!!this.ControllerProvider.hasParent()).to.be.false;
    });

    it("should have a middlewares", () => {
        expect(this.ControllerProvider.middlewares.use).to.be.an("array");
        expect(this.ControllerProvider.middlewares.use[0]).to.be.an("function");
        expect(this.ControllerProvider.middlewares.useAfter).to.be.an("array");
        expect(this.ControllerProvider.middlewares.useAfter[0]).to.be.an("function");
        expect(this.ControllerProvider.middlewares.useBefore).to.be.an("array");
        expect(this.ControllerProvider.middlewares.useBefore[0]).to.be.an("function");
    });
});
