import {ExpressApplication, InjectorService, ServerSettingsService} from "@tsed/common";
import {Store} from "@tsed/core";
import {inject} from "@tsed/testing";
import * as Express from "express";
import * as Fs from "fs";
import {SwaggerService} from "../../../../src/swagger";
import {expect, Sinon} from "../../../tools";

class Test {

}

describe("SwaggerService", () => {
    before(inject([InjectorService, ServerSettingsService], (injectorService: InjectorService, settingsService: ServerSettingsService) => {
        this.routerInstance = {
            use: Sinon.stub(), get: Sinon.stub()
        };

        this.routerStub = Sinon.stub(Express, "Router").returns(this.routerInstance);
        this.expressApplication = {use: Sinon.stub(), get: Sinon.stub()};
        this.settingsService = settingsService;

        const locals = new Map();
        locals.set(ExpressApplication, this.expressApplication);

        this.swaggerService = injectorService.invoke(SwaggerService, locals);
    }));

    after(() => {
        this.routerStub.restore();
    });

    describe("$afterRoutesInit()", () => {

        describe("when cssPath is given", () => {
            before(() => {
                this.writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");
                this.readFileSyncStub = Sinon.stub(Fs, "readFileSync").returns(".cssContent");
                this.getStub = Sinon.stub(this.settingsService, "get").returns({cssPath: "/path/to/css"});
                this.getOpenAPISpecStub = Sinon.stub(this.swaggerService, "getOpenAPISpec");
                this.middlewareStub = {
                    setup: Sinon.stub().returns({setup: "setup"}),
                    serve: Sinon.stub()
                };

                Sinon.stub(this.swaggerService, "middleware").returns(this.middlewareStub);
                this.getOpenAPISpecStub.returns({spec: "test"});

                return this.swaggerService.$afterRoutesInit();
            });

            after(() => {
                this.writeFileSyncStub.restore();
                this.readFileSyncStub.restore();
                this.getStub.restore();
                this.getOpenAPISpecStub.restore();
                this.swaggerService.middleware.restore();
            });

            it("should read cssFile", () => {
                this.readFileSyncStub.should.be.calledWithExactly("/path/to/css", {encoding: "utf8"});
            });
            it("should call swagger-middleware.setup with the right parameters", () => {
                this.middlewareStub.setup.should.be.calledWithExactly({spec: "test"}, undefined, {}, ".cssContent");
            });
            it("should call Express.Router.get", () => {
                this.routerInstance.get.should.be.calledWithExactly("/swagger.json", Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly(Sinon.match.func);
                this.routerInstance.get.should.be.calledWithExactly("/", {setup: "setup"});
            });
        });

        describe("when path and options is given", () => {
            before(() => {
                this.writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");
                this.readFileSyncStub = Sinon.stub(Fs, "readFileSync").returns(".cssContent");
                this.getStub = Sinon.stub(this.settingsService, "get").returns({
                    path: "/path",
                    showExplorer: true,
                    options: {options: "true"}
                });
                this.getOpenAPISpecStub = Sinon.stub(this.swaggerService, "getOpenAPISpec");
                this.middlewareStub = {
                    setup: Sinon.stub().returns({setup: "setup"}),
                    serve: Sinon.stub()
                };

                Sinon.stub(this.swaggerService, "middleware").returns(this.middlewareStub);
                this.getOpenAPISpecStub.returns({spec: "test"});

                return this.swaggerService.$afterRoutesInit();
            });

            after(() => {
                this.writeFileSyncStub.restore();
                this.readFileSyncStub.restore();
                this.getStub.restore();
                this.getOpenAPISpecStub.restore();
                this.swaggerService.middleware.restore();
            });

            it("should not read cssFile", () => {
                this.readFileSyncStub.should.not.be.called;
            });
            it("should call swagger-middleware.setup with the right parameters", () => {
                this.middlewareStub.setup.should.be.calledWithExactly({spec: "test"}, true, {options: "true"}, undefined);
            });
            it("should call Express.Router.get", () => {
                this.routerInstance.get.should.be.calledWithExactly("/swagger.json", Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly(Sinon.match.func);
                this.routerInstance.get.should.be.calledWithExactly("/", {setup: "setup"});
            });

            it("should not write spec.json", () => {
                this.writeFileSyncStub.should.not.be.called;
            });
        });

        describe("when specPath is given", () => {
            before(() => {
                this.writeFileSyncStub = Sinon.stub(Fs, "writeFileSync");
                this.readFileSyncStub = Sinon.stub(Fs, "readFileSync").returns(".cssContent");
                this.getStub = Sinon.stub(this.settingsService, "get").returns({
                    path: "/path",
                    specPath: "/path/to/spec",
                    outFile: "/path/to/specOut",
                    showExplorer: true,
                    options: {options: "true"}
                });
                this.getOpenAPISpecStub = Sinon.stub(this.swaggerService, "getOpenAPISpec");
                this.middlewareStub = {
                    setup: Sinon.stub().returns({setup: "setup"}),
                    serve: Sinon.stub()
                };

                Sinon.stub(this.swaggerService, "middleware").returns(this.middlewareStub);
                this.getOpenAPISpecStub.returns({spec: "test"});

                return this.swaggerService.$afterRoutesInit();
            });

            after(() => {
                this.writeFileSyncStub.restore();
                this.readFileSyncStub.restore();
                this.getStub.restore();
                this.getOpenAPISpecStub.restore();
                this.swaggerService.middleware.restore();
            });

            it("should not read cssFile", () => {
                this.readFileSyncStub.should.not.be.called;
            });
            it("should call swagger-middleware.setup with the right parameters", () => {
                this.middlewareStub.setup.should.be.calledWithExactly({spec: "test"}, true, {options: "true"}, undefined);
            });
            it("should call Express.Router.use", () => {
                this.routerInstance.get.should.be.calledWithExactly("/swagger.json", Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly(Sinon.match.func);
                this.routerInstance.get.should.be.calledWithExactly("/", {setup: "setup"});
            });
            it("should write spec.json", () => {
                this.writeFileSyncStub.should.be.calledOnce;
                this.writeFileSyncStub.should.be.calledWithExactly("/path/to/specOut", JSON.stringify({spec: "test"}, null, 2));
            });
        });

    });

    describe("getDefaultSpec()", () => {

        describe("when specPath is given", () => {
            before(() => {
                return this.result = this.swaggerService.getDefaultSpec({specPath: __dirname + "/data/spec.json"});
            });

            it("should return default spec", () => {
                this.result.should.be.deep.equals(require("./data/spec.expected.json"));
            });
        });

        describe("when nothing is given", () => {
            before(() => {
                return this.result = this.swaggerService.getDefaultSpec({});
            });

            it("should return default spec", () => {
                this.result.should.be.deep.equals({
                    "consumes": [
                        "application/json"
                    ],
                    "info": {
                        "contact": undefined,
                        "description": "",
                        "license": undefined,
                        "termsOfService": "",
                        "title": "Api documentation",
                        "version": "1.0.0"
                    },
                    "produces": [
                        "application/json"
                    ],
                    "securityDefinitions": {},
                    "swagger": "2.0"
                });
            });
        });

        describe("when some info is given", () => {
            before(() => {
                return this.result = this.swaggerService.getDefaultSpec({spec: {info: {}}});
            });

            it("should return default spec", () => {
                this.result.should.be.deep.equals({
                    "consumes": [
                        "application/json"
                    ],
                    "info": {
                        "contact": undefined,
                        "description": "",
                        "license": undefined,
                        "termsOfService": "",
                        "title": "Api documentation",
                        "version": "1.0.0"
                    },
                    "produces": [
                        "application/json"
                    ],
                    "securityDefinitions": {},
                    "swagger": "2.0"
                });
            });
        });

    });

    describe("buildTags()", () => {
        describe("when name is undefined", () => {
            before(() => {
                this.storeFromStub = Sinon.stub(Store, "from");
                const store = {
                    get: Sinon.stub()
                };
                this.storeFromStub.returns(store);
                store.get.withArgs("description").returns("description");
                store.get.withArgs("name").returns(undefined);
                store.get.withArgs("tag").returns({test: "tag"});

                this.result = this.swaggerService.buildTags({useClass: Test});
            });
            after(() => {
                this.storeFromStub.restore();
            });

            it("should return an array with tags", () => {
                this.result.should.deep.eq({description: "description", name: "Test", test: "tag"});
            });
        });
        describe("when name is defined", () => {
            before(() => {
                this.storeFromStub = Sinon.stub(Store, "from");
                const store = {
                    get: Sinon.stub()
                };
                this.storeFromStub.returns(store);
                store.get.withArgs("description").returns("description");
                store.get.withArgs("name").returns("name");
                store.get.withArgs("tag").returns({test: "tag"});

                this.result = this.swaggerService.buildTags({useClass: Test});
            });
            after(() => {
                this.storeFromStub.restore();
            });

            it("should return an array with tags", () => {
                this.result.should.deep.eq({description: "description", name: "name", test: "tag"});
            });
        });
    });

    describe("readSpecPath", () => {
        it("should return an empty object", () => {
            expect(this.swaggerService.readSpecPath("/swa.json")).to.deep.eq({});
        });
    });

    describe("getOperationId()", () => {
        it("should return the right id", () => {
            expect(this.swaggerService.getOperationId("operation")).to.deep.eq("operation");
        });

        it("should return the right id with increment", () => {
            expect(this.swaggerService.getOperationId("operation")).to.deep.eq("operation_1");
        });
    });
});