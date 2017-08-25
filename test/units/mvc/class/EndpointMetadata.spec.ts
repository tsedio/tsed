import {expect} from "chai";
import {Metadata} from "../../../../src/core/class/Metadata";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {EndpointRegistry} from "../../../../src/mvc/registries/EndpointRegistry";

class Test {

}

class Test2 {

}

class Test3 extends Test2 {

}

describe("EndpointMetadata", () => {
    describe("Basic class", () => {
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

            EndpointRegistry.store(Test, "method").set("test", "value");

            Metadata.set("design:returntype", Object, Test, "method");

            this.store = {};
            this.endpointMetadata.store.forEach((v: any, k: any) => this.store[k] = v);
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

        it("should get target", () =>
            expect(this.endpointMetadata.target).to.equal(Test)
        );

        it("should get methodClassName", () =>
            expect(this.endpointMetadata.methodClassName).to.equal("method")
        );

        it("should get metadata", () =>
            expect(this.endpointMetadata.getMetadata("test")).to.equal("value")
        );

        it("should return the store", () => {
            expect(this.store).to.deep.equal({"test": "value"});
        });
    });

    describe("Inherited class", () => {
        before(() => {
            this.endpointMetadata = new EndpointMetadata(Test2, "methodInherited");
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

            EndpointRegistry.store(Test2, "methodInherited").set("test2", "value2");

            Metadata.set("design:returntype", Object, Test2, "methodInherited");

            this.endpointMetadataInherited = this.endpointMetadata.inherit(Test3);

            this.store = {};
            this.endpointMetadataInherited.store.forEach((v: any, k: any) => this.store[k] = v);
        });

        it("should get path", () =>
            expect(this.endpointMetadataInherited.path).to.equal("/")
        );

        it("should get httpMethod", () =>
            expect(this.endpointMetadataInherited.httpMethod).to.equal("get")
        );

        it("should get path", () =>
            expect(this.endpointMetadataInherited.path).to.equal("/")
        );

        it("should get beforeMiddlewares", () => {
            expect(this.endpointMetadataInherited.beforeMiddlewares).to.be.an("array").and.have.length(2);
        });

        it("should get middlewares", () => {
            expect(this.endpointMetadataInherited.middlewares).to.be.an("array").and.have.length(1);
        });

        it("should get afterMiddlewares", () => {
            expect(this.endpointMetadataInherited.beforeMiddlewares).to.be.an("array").and.have.length(2);
        });

        it("should has method", () => {
            expect(this.endpointMetadataInherited.hasHttpMethod()).to.be.true;
        });

        it("should get target", () =>
            expect(this.endpointMetadataInherited.target).to.equal(Test3)
        );

        it("should have a inherited metadata", () =>
            expect(this.endpointMetadataInherited.inheritedEndpoint.target).to.equal(Test2)
        );

        it("should get methodClassName", () =>
            expect(this.endpointMetadata.methodClassName).to.equal("methodInherited")
        );

        it("should get metadata", () =>
            expect(this.endpointMetadata.getMetadata("test2")).to.equal("value2")
        );

        it("should return the store", () => {
            expect(this.store).to.deep.equal({"test2": "value2"});
        });
    });
});