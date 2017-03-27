import {assert, expect} from "chai";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {Metadata} from "../../../../src/core/class/Metadata";

class Test {

}
class Test2 {
}

describe("EndpointMetadata", () => {

    before(() => {
        this.endpointMetadata = new EndpointMetadata(Test, "method");

        this.endpointMetadata.path = "/";
        this.endpointMetadata.httpMethod = "get";
        this.endpointMetadata.beforeMiddlewares = [() => {
        }];
        this.endpointMetadata.middlewares = [() => {
        }];
        this.endpointMetadata.afterMiddlewares = [() => {
        }];
        this.endpointMetadata.before([() => {
        }]);
        this.endpointMetadata.after([() => {
        }]);

        Metadata.set("test", "value", Test, "method");
        Metadata.set("design:returntype", Object, Test, "method");
    });

    it("should get path", () =>
        expect(this.endpointMetadata.path).to.equal("/")
    );

    it("should get httpMethod", () =>
        expect(this.endpointMetadata.httpMethod).to.equal("get")
    );

    it("should get path", () =>
        expect(this.endpointMetadata.path).to.equal("/")
    );

    it("should get beforeMiddlewares", () => {
        expect(this.endpointMetadata.beforeMiddlewares).to.be.an("array").and.have.length(2);
    });

    it("should get middlewares", () => {
        expect(this.endpointMetadata.middlewares).to.be.an("array").and.have.length(1);
    });

    it("should get afterMiddlewares", () => {
        expect(this.endpointMetadata.beforeMiddlewares).to.be.an("array").and.have.length(2);
    });

    it("should has method", () => {
        expect(this.endpointMetadata.hasHttpMethod()).to.be.true;
    });

    it("should get className", () =>
        expect(this.endpointMetadata.className).to.equal("Test")
    );

    it("should get provide", () =>
        expect(this.endpointMetadata.provide).to.equal(Test)
    );

    it("should get targetClass", () =>
        expect(this.endpointMetadata.targetClass).to.equal(Test)
    );

    it("should get methodClassName", () =>
        expect(this.endpointMetadata.methodClassName).to.equal("method")
    );

    it("should get metadata", () =>
        expect(this.endpointMetadata.getMetadata("test")).to.equal("value")
    );

    it("should return function type", () => {
        expect(this.endpointMetadata.returnType).to.equal(Object);
    });
});