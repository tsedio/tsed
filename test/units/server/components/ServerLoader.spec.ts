import {$logStub, expect, Sinon} from "../../../tools";
import {Metadata} from "../../../../src/core/class/Metadata";
import {SERVER_SETTINGS} from "../../../../src/server/constants/index";
import {ServerLoader} from "../../../../src/server/components/ServerLoader";

describe("ServerLoader", () => {
    before(() => {
        class TestServer extends ServerLoader {
            $onInit() {

            }

            $onReady() {

            }

            $onMountingMiddlewares() {

            }

            $afterRoutesInit() {

            }
        }

        Metadata.set(SERVER_SETTINGS, {debug: true}, TestServer);

        this.server = new TestServer();
        this.useStub = Sinon.stub(this.server._expressApp, "use");
        this.setStub = Sinon.stub(this.server._expressApp, "set");
        this.engineStub = Sinon.stub(this.server._expressApp, "engine");

    });

    after(() => {
        this.useStub.restore();
        this.setStub.restore();
        this.engineStub.restore();
    });

    describe("startServer()", () => {
        before(() => {

            this.createServerStub = {
                on: Sinon.stub(),
                listen: Sinon.stub()
            };
            this.createServerStub.on.returns(this.createServerStub);
            this.promise = this.server.startServer(this.createServerStub, {address: "0.0.0.0", port: 8080});
            this.createServerStub.on.getCall(0).args[1]();


            return this.promise;
        });

        after(() => {

        });

        it("should have been called server.listen with the correct params", () => {
            this.createServerStub.listen.should.have.been.calledWithExactly(8080, "0.0.0.0");
        });

        it("should have been called server.on with the correct params", () => {
            this.createServerStub.on.should.have.been.calledWithExactly("listening", Sinon.match.func);
            this.createServerStub.on.should.have.been.calledWithExactly("error", Sinon.match.func);
        });
    });

    describe("loadMiddlewares()", () => {

        before(() => {
            this.useStub.reset();
            this.$onMountingMiddlewares = Sinon.stub(this.server, "$onMountingMiddlewares").returns(Promise.resolve());
            this.$afterRoutesInit = Sinon.stub(this.server, "$afterRoutesInit").returns(Promise.resolve());

            this.server.loadSettingsAndInjector();

            this.emitSpy = Sinon.spy(this.server.injectorService, "emit");

            return this.server.loadMiddlewares();
        });

        after(() => {
            this.useStub.reset();
            this.$onMountingMiddlewares.restore();
            this.$afterRoutesInit.restore();
            this.emitSpy.restore();
        });

        it("should have been called $onMountingMiddlewares hook", () =>
            this.$onMountingMiddlewares.should.have.been.calledOnce
        );

        it("should have been emit $onRoutesInit event", () =>
            this.emitSpy.should.have.been.calledWithExactly("$onRoutesInit", Sinon.match.array)
        );
        it("should have been emit $onRoutesInit event", () =>
            this.emitSpy.should.have.been.calledWithExactly("$afterRoutesInit")
        );

        it("should have been called $afterRoutesInit hook", () =>
            this.$afterRoutesInit.should.have.been.calledOnce
        );
    });

    describe("scan()", () => {
        before(() => {
            this.server.scan(require("path").join(__dirname, "/data/*.js"), "/context");
        });

        it("should require components", () => {
            expect(this.server._components)
                .to.be.an("array")
                .and.length(1);
        });

        it("should have classes attributs", () => {
            expect(this.server._components[0].classes).to.be.an("object");
            expect(this.server._components[0].classes).to.have.property("FakeCtrl");
            expect(this.server._components[0].classes.FakeCtrl).to.be.a("function");
        });

        it("should have endpoint attributs", () => {
            expect(this.server._components[0].endpoint).to.eq("/context");
        });

        it("should have file attributs", () => {
            expect(this.server._components[0].file).to.eq(__dirname + "/data/FakeCtrl.js");
        });

    });

    describe("start()", () => {

        describe("when success", () => {
            before(() => {
                $logStub.$log.info.reset();
                this.startServerStub = Sinon.stub(this.server, "startServer").returns(Promise.resolve());
                this.loadSettingsAndInjectorSpy = Sinon.spy(this.server, "loadSettingsAndInjector");
                this.loadMiddlewaresSpy = Sinon.spy(this.server, "loadMiddlewares");
                this.$onInitStub = Sinon.stub(this.server, "$onInit").returns(Promise.resolve());
                this.$onReadyStub = Sinon.stub(this.server, "$onReady").returns(Promise.resolve());
                return this.server.start();
            });

            after(() => {
                $logStub.$log.info.reset();
                this.loadSettingsAndInjectorSpy.restore();
                this.loadMiddlewaresSpy.restore();
                this.$onInitStub.restore();
                this.$onReadyStub.restore();
                this.startServerStub.restore();
            });

            it("should have been called onInit hook", () =>
                this.$onInitStub.should.have.been.calledOnce
            );
            it("should have been called loadSettingsAndInjector", () =>
                this.loadSettingsAndInjectorSpy.should.have.been.calledOnce
            );

            it("should have been called loadMiddlewares", () =>
                this.loadMiddlewaresSpy.should.have.been.calledOnce
            );

            it("should have been called $onReady hook", () =>
                this.$onReadyStub.should.have.been.calledOnce
            );

            it("should have been called startServer() with the right parameters", () => {
                this.startServerStub.should.have.been.calledTwice;
                this.startServerStub.should.have.been.calledWithExactly(this.server._httpServer, {
                    address: "0.0.0.0",
                    https: false,
                    port: 8080
                });

                this.startServerStub.should.have.been.calledWithExactly(this.server._httpsServer, {
                    address: "0.0.0.0",
                    https: true,
                    port: 8000
                });
            });
        });
        describe("when error", () => {
            before(() => {
                this.error = new Error("onInit");
                this.startServerStub = Sinon.stub(this.server, "startServer").returns(Promise.resolve());
                this.loadSettingsAndInjectorSpy = Sinon.spy(this.server, "loadSettingsAndInjector");
                this.loadMiddlewaresSpy = Sinon.spy(this.server, "loadMiddlewares");
                this.$onInitStub = Sinon.stub(this.server, "$onInit").returns(Promise.reject(this.error));
                this.$onReadyStub = Sinon.stub(this.server, "$onReady").returns(Promise.resolve());

                $logStub.$log.error.reset();

                return this.server.start();
            });

            after(() => {
                this.loadSettingsAndInjectorSpy.restore();
                this.loadMiddlewaresSpy.restore();
                this.$onInitStub.restore();
                this.$onReadyStub.restore();
                this.startServerStub.restore();
                $logStub.$log.error.reset();
            });

            it("should have been called onInit hook", () =>
                this.$onInitStub.should.have.been.calledOnce
            );
            it("should have been called loadSettingsAndInjector", () =>
                this.loadSettingsAndInjectorSpy.should.not.have.been.called
            );

            it("should have been called loadMiddlewares", () =>
                this.loadMiddlewaresSpy.should.not.have.been.called
            );

            it("should have been called $onReady hook", () =>
                this.$onReadyStub.should.not.have.been.called
            );

            it("should have been called log.error", () => {
                $logStub.$log.error.should.have.been.calledOnce;
                $logStub.$log.error.should.have.been.calledWithExactly("HTTP Server error", this.error);
            });
        });

    });

    describe("set()", () => {
        before(() => {
            this.server.set("view engine", "html");
        });

        it("should call express.set() with the right parameters", () => {
            this.setStub.should.have.been.calledWithExactly("view engine", "html");
        });
    });

    describe("engine()", () => {
        before(() => {
            this.server.engine("jade", () => {
            });
        });

        it("should call express.engine() with the right parameters", () => {
            this.engineStub.should.have.been.calledWithExactly("jade", Sinon.match.func);
        });
    });

    describe("deprecated methods", () => {
        it("should have been called", () => {
            this.server.onError();
            this.server.setHttpPort(8080);
            this.server.setHttpsPort(8080);
            this.server.setEndpoint("/rest");
        });
    });
});