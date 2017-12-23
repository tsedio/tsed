import {Metadata} from "../../../../src/core/class/Metadata";
import {EndpointMetadata} from "../../../../src/mvc/class/EndpointMetadata";
import {EndpointRegistry} from "../../../../src/mvc/registries/EndpointRegistry";
import {expect, Sinon} from "../../../tools";

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

        it("should return the store", () => {
            expect(this.store).to.deep.equal({"test2": "value2"});
        });
    });

    describe("statusResponse()", () => {
        describe("when haven't responses", () => {
            before(() => {
                this.endpointMetadata = new EndpointMetadata(Test, "method");
                this.storeGetStub = Sinon.stub(this.endpointMetadata.store, "get");

                this.storeGetStub.withArgs("responses").returns({});

                this.result = this.endpointMetadata.statusResponse(200);
            });

            after(() => {
                this.storeGetStub.restore();
            });

            it("should haven't type and collectionType", () => {
                expect(this.endpointMetadata.type).to.be.undefined;
                expect(this.endpointMetadata.collectionType).to.be.undefined;
            });
            it("should haven\'t headers", () => {
                expect(this.result).to.deep.eq({
                    description: undefined,
                    headers: undefined,
                    examples: undefined
                });
            });
        });

        describe("when have empty responses", () => {
            before(() => {
                this.endpointMetadata = new EndpointMetadata(Test, "method");
                this.storeGetStub = Sinon.stub(this.endpointMetadata.store, "get");

                this.storeGetStub.withArgs("responses").returns({
                    [200]: {}
                });

                this.result = this.endpointMetadata.statusResponse(200);
            });

            after(() => {
                this.storeGetStub.restore();
            });

            it("should haven't type and collectionType", () => {
                expect(this.endpointMetadata.type).to.be.undefined;
                expect(this.endpointMetadata.collectionType).to.be.undefined;
            });
            it("should haven\'t headers", () => {
                expect(this.result).to.deep.eq({
                    "description": undefined,
                    "examples": undefined,
                    "headers": undefined
                });
            });
        });

        describe("when have responses", () => {
            before(() => {
                this.endpointMetadata = new EndpointMetadata(Test, "method");
                this.storeGetStub = Sinon.stub(this.endpointMetadata.store, "get");
                this.responses = {
                    [200]: {
                        type: Test,
                        "headers": {
                            "headerName": {
                                type: "string",
                                value: "x-content"
                            }
                        }
                    }
                }
                this.storeGetStub.withArgs("responses").returns(this.responses);

                this.result = this.endpointMetadata.statusResponse(200);
            });

            after(() => {
                this.storeGetStub.restore();
            });

            it("should have type", () => {
                expect(this.endpointMetadata.type).to.eq(Test);
            });

            it("should haven't collectionType", () => {
                expect(this.endpointMetadata.collectionType).to.be.undefined;
            });
            it("should have headers", () => {
                expect(this.result).to.deep.eq({
                    "description": undefined,
                    "examples": undefined,
                    "headers": {
                        "headerName": {
                            type: "string"
                        }
                    }
                });
            });
            it("shouldn't change the original responses", () => {
                this.responses[200].headers.headerName.value.should.be.eq("x-content");
            });
        });

        describe("when the status code match with the default response", () => {
            before(() => {
                this.endpointMetadata = new EndpointMetadata(Test, "method");
                this.storeGetStub = Sinon.stub(this.endpointMetadata.store, "get");
                this.responses = {
                    [200]: {
                        type: Test,
                        description: "description"
                    }
                };
                this.response = {
                    type: Test,
                    "headers": {
                        "headerName": {
                            type: "string",
                            value: "x-content"
                        }
                    }
                };
                this.storeGetStub.withArgs("statusCode").returns(200);
                this.storeGetStub.withArgs("responses").returns(this.responses);

                this.storeGetStub.withArgs("response").returns(this.response);

                this.result = this.endpointMetadata.statusResponse(200);
            });

            after(() => {
                this.storeGetStub.restore();
            });

            it("should have type", () => {
                expect(this.endpointMetadata.type).to.eq(Test);
            });

            it("should haven't collectionType", () => {
                expect(this.endpointMetadata.collectionType).to.be.undefined;
            });
            it("should have headers", () => {
                expect(this.result).to.deep.eq({
                    "examples": undefined,
                    description: "description",
                    "headers": {
                        "headerName": {
                            "type": "string"
                        }
                    }
                });
            });
            it("shouldn't change the original response", () => {
                this.response.headers.headerName.value.should.be.eq("x-content");
            });
        });

    });
});