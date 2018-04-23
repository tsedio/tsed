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
        this.settingsService.host;

        const locals = new Map();
        locals.set(ExpressApplication, this.expressApplication);

        this.swaggerService = injectorService.invoke(SwaggerService, locals);
    }));

    after(() => {
        this.routerStub.restore();
    });

    describe("buildSwaggerOptions()", () => {
        describe("when requested url is /swagger-ui-init.js", () => {
            before(() => {

                this.next = Sinon.stub();
                this.res = {
                    set: Sinon.stub(),
                    send: Sinon.stub()
                };

                this.req = {
                    url: "/swagger-ui-init.js",
                    protocol: "http"
                };

                this.readFileSyncStub = Sinon.stub(Fs, "readFileSync").returns("<% swaggerOptions %>");

                const mdlw = this.swaggerService
                    .buildSwaggerOptions(
                        "/path",
                        {address: "0.0.0.0", port: 8080},
                        {options: "options"}
                    );

                mdlw(this.req, this.res, this.next);
            });

            after(() => {
                this.readFileSyncStub.restore();
            });

            it("should call fs.readFileSync", () => {
                this.readFileSyncStub.should.have.been.calledWithExactly(require.resolve("swagger-ui-express/swagger-ui-init.js"), {encoding: "utf8"});
            });
            it("should set content-type", () => {
                this.res.set.should.have.been.calledWithExactly("Content-Type", "application/javascript");
            });

            it("should send javascript file content", () => {
                this.res.send.should.have.been.calledWithExactly("var options = {\"customOptions\":{\"options\":\"options\"},\"swaggerUrl\":\"http://0.0.0.0:8080/path/swagger.json\"}");
            });
        });

        describe("when requested url is not /swagger-ui-init.js", () => {
            before(() => {
                this.next = Sinon.stub();
                this.res = {
                    set: Sinon.stub(),
                    send: Sinon.stub()
                };

                this.req = {
                    url: "",
                    protocol: "http"
                };

                this.readFileSyncStub = Sinon.stub(Fs, "readFileSync").returns("<% swaggerOptions %>");
                const mdlw = this.swaggerService
                    .buildSwaggerOptions(
                        "/path",
                        {address: "0.0.0.0", port: 8080},
                        {options: "options"}
                    );

                mdlw(this.req, this.res, this.next);
            });

            after(() => {
                this.readFileSyncStub.restore();
            });

            it("should call fs.readFileSync", () => {
                this.readFileSyncStub.should.have.been.calledWithExactly(require.resolve("swagger-ui-express/swagger-ui-init.js"), {encoding: "utf8"});
            });
            it("should set content-type", () => {
                return this.res.set.should.not.have.been.called;
            });

            it("should send javascript file content", () => {
                return this.res.send.should.not.have.been.called;
            });
        });
    });

    describe("$afterRoutesInit()", () => {
        before(() => {
            this.getHttpPortStub = Sinon.stub(this.settingsService, "getHttpPort").returns({
                address: "0.0.0.0",
                port: 8080
            });
        });
        after(() => {
            this.getHttpPortStub.restore();
        });
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
                Sinon.stub(this.swaggerService, "buildSwaggerOptions").returns({
                    swaggerOptions: "swaggerOptions"
                });

                this.getOpenAPISpecStub.returns({spec: "test"});

                return this.swaggerService.$afterRoutesInit();
            });

            after(() => {
                this.writeFileSyncStub.restore();
                this.readFileSyncStub.restore();
                this.getStub.restore();
                this.getOpenAPISpecStub.restore();
                this.swaggerService.middleware.restore();
                this.swaggerService.buildSwaggerOptions.restore();
            });

            it("should read cssFile", () => {
                this.readFileSyncStub.should.be.calledWithExactly("/path/to/css", {encoding: "utf8"});
            });

            it("should call buildSwaggerOptions", () => {
                this.swaggerService.buildSwaggerOptions.should.have.been.calledWithExactly(
                    "/",
                    {
                        address: "0.0.0.0",
                        port: 8080
                    },
                    {}
                );
            });

            it("should call swagger-middleware.setup with the right parameters", () => {
                this.middlewareStub.setup.should.be.calledWithExactly(null, {
                    customCss: ".cssContent",
                    explorer: undefined,
                    swaggerOptions: {}
                });
            });
            it("should call Express.Router.get", () => {
                this.routerInstance.get.should.be.calledWithExactly("/swagger.json", Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly(Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly({
                    swaggerOptions: "swaggerOptions"
                });
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
                Sinon.stub(this.swaggerService, "buildSwaggerOptions").returns({
                    swaggerOptions: "swaggerOptions"
                });

                this.getOpenAPISpecStub.returns({spec: "test"});

                return this.swaggerService.$afterRoutesInit();
            });

            after(() => {
                this.writeFileSyncStub.restore();
                this.readFileSyncStub.restore();
                this.swaggerService.buildSwaggerOptions.restore();
                this.getStub.restore();
                this.getOpenAPISpecStub.restore();
                this.swaggerService.middleware.restore();
            });

            it("should not read cssFile", () => {
                this.readFileSyncStub.should.not.be.called;
            });

            it("should call buildSwaggerOptions", () => {
                this.swaggerService.buildSwaggerOptions.should.have.been.calledWithExactly(
                    "/path",
                    {
                        address: "0.0.0.0",
                        port: 8080
                    },
                    {options: "true"}
                );
            });

            it("should call swagger-middleware.setup with the right parameters", () => {
                this.middlewareStub.setup.should.be.calledWithExactly(null, {
                    customCss: undefined,
                    explorer: true,
                    swaggerOptions: {options: "true"}
                });
            });
            it("should call Express.Router.get", () => {
                this.routerInstance.get.should.be.calledWithExactly("/swagger.json", Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly(Sinon.match.func);
                this.routerInstance.get.should.be.calledWithExactly("/", {setup: "setup"});
                this.routerInstance.use.should.be.calledWithExactly({
                    swaggerOptions: "swaggerOptions"
                });
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
                Sinon.stub(this.swaggerService, "buildSwaggerOptions").returns({
                    swaggerOptions: "swaggerOptions"
                });

                this.getOpenAPISpecStub.returns({spec: "test"});

                return this.swaggerService.$afterRoutesInit();
            });

            after(() => {
                this.writeFileSyncStub.restore();
                this.readFileSyncStub.restore();
                this.getStub.restore();
                this.getOpenAPISpecStub.restore();
                this.swaggerService.middleware.restore();
                this.swaggerService.buildSwaggerOptions.restore();
            });

            it("should not read cssFile", () => {
                this.readFileSyncStub.should.not.be.called;
            });

            it("should call buildSwaggerOptions", () => {
                this.swaggerService.buildSwaggerOptions.should.have.been.calledWithExactly(
                    "/path",
                    {
                        address: "0.0.0.0",
                        port: 8080
                    },
                    {options: "true"}
                );
            });

            it("should call swagger-middleware.setup with the right parameters", () => {
                this.middlewareStub.setup.should.be.calledWithExactly(null, {
                    customCss: undefined,
                    explorer: true,
                    swaggerOptions: {options: "true"}
                });
            });
            it("should call Express.Router.use", () => {
                this.routerInstance.get.should.be.calledWithExactly("/swagger.json", Sinon.match.func);
                this.routerInstance.use.should.be.calledWithExactly(Sinon.match.func);
                this.routerInstance.get.should.be.calledWithExactly("/", {setup: "setup"});
            });
            it("should write spec.json", () => {
                this.writeFileSyncStub.should.be.calledOnce;
                this.writeFileSyncStub.should.be.calledWithExactly("/path/to/specOut", JSON.stringify({spec: "test"}, null, 2));
                this.routerInstance.use.should.be.calledWithExactly({
                    swaggerOptions: "swaggerOptions"
                });
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