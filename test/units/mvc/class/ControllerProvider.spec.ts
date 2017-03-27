import {assert, expect} from "chai";
import {ControllerProvider} from "../../../../src/mvc/class/ControllerProvider";

class Test {

}
class Test2 {
}

describe("ControllerProvider", () => {

    before(() => {
        this.controllerMetadata = new ControllerProvider(Test);
        this.controllerMetadata.path = "/";
        this.controllerMetadata.pushRouterPath("/");
        this.controllerMetadata.dependencies = [Test2];
        this.controllerMetadata.scope = "request";
        this.controllerMetadata.routerOptions = {};
    });

    it("should have type field to equals to controller", () =>
        expect(this.controllerMetadata.type).to.equal("controller")
    );

    it("should get path", () =>
        expect(this.controllerMetadata.path).to.equal("/")
    );

    it("should get routerPaths", () =>
        expect(this.controllerMetadata.routerPaths).to.be.an("array").and.have.length(1)
    );

    it("should get endpoints", () =>
        expect(this.controllerMetadata.endpoints).to.be.an("array").and.have.length(0)
    );

    it("should get dependencies", () =>
        expect(this.controllerMetadata.dependencies).to.be.an("array").and.have.length(1)
    );

    it("should have a dependency witch have $parentCtrl attributs", () =>
        expect(this.controllerMetadata.dependencies[0])
            .to.equals(Test2)
            .and.have.property("$parentCtrl")
    );

    it("should get a scope", () => {
        expect(this.controllerMetadata.scope).to.eq("request");
    });

    it("should get routerOptions", () => {
        expect(this.controllerMetadata.routerOptions).to.be.an("object");
    });

    it("should get endpoint Url without parameters", () => {
        expect(this.controllerMetadata.getEndpointUrl()).to.eq("/");
    });

    it("should get endpoint Url with parameters", () => {
        expect(this.controllerMetadata.getEndpointUrl("/")).to.eq("/");
    });

    it("should get endpoint Url with parameters", () => {
        expect(this.controllerMetadata.getEndpointUrl("/rest/")).to.eq("/rest/");
    });

    it("should has endpoint url", () => {
        expect(this.controllerMetadata.hasEndpointUrl()).to.eq(true);
    });

    it("should has dependencies", () => {
        expect(this.controllerMetadata.hasDependencies()).to.eq(true);
    });

    it("should get parent", () => {
        expect(!!this.controllerMetadata.parent).to.be.false;
    });

    it("should has parent", () => {
        expect(!!this.controllerMetadata.hasParent()).to.be.false;
    });
});
