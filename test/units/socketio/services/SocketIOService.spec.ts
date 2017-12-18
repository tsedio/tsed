import {ProviderRegistry} from "../../../../src/di/registries/ProviderRegistry";
import {HttpServer} from "../../../../src/server/decorators/httpServer";
import {HttpsServer} from "../../../../src/server/decorators/httpsServer";
import {SocketIOServer, SocketIOService} from "../../../../src/socketio";
import {invoke} from "../../../../src/testing";
import {expect, Sinon} from "../../../tools";

describe("SocketIOService", () => {
    describe("$onServerReady()", () => {
        describe("with http server", () => {
            let socketIOService: any;

            before(() => {
                this.socketIOServer = {attach: Sinon.stub()};
                this.httpServer = {get: Sinon.stub().returns("httpServer")};
                this.httpsServer = {get: Sinon.stub().returns("httpsServer")};

                socketIOService = invoke(SocketIOService, [
                    {provide: HttpServer, use: this.httpServer},
                    {provide: HttpsServer, use: this.httpsServer},
                    {provide: SocketIOServer, use: this.socketIOServer}
                ]);

                this.getWebsocketServicesStub = Sinon.stub(socketIOService, "getWebsocketServices");
                this.bindProviderStub = Sinon.stub(socketIOService, "bindProvider");
                this.printSocketEventsStub = Sinon.stub(socketIOService, "printSocketEvents");

                this.getWebsocketServicesStub.returns([{provider: "provider"}]);

                socketIOService.serverSettingsService.set("socketIO", {config: "config"});
                socketIOService.$onServerReady();
            });

            after(() => {
                this.getWebsocketServicesStub.restore();
                this.bindProviderStub.restore();
                this.printSocketEventsStub.restore();
            });

            it("should call attach method", () => {
                this.socketIOServer.attach.should.have.been.calledWithExactly("httpServer", {config: "config"});
                this.socketIOServer.attach.should.have.been.calledWithExactly("httpsServer", {config: "config"});
            });

            it("should call getWebsocketServices method", () => {
                this.getWebsocketServicesStub.should.have.been.calledWithExactly();
            });

            it("should call bind provider method", () => {
                this.bindProviderStub.should.have.been.calledWithExactly({provider: "provider"});
            });
        });
        describe("with https server", () => {
            let socketIOService: any;

            before(() => {
                this.socketIOServer = {attach: Sinon.stub()};
                this.httpServer = {get: Sinon.stub().returns("httpServer")};
                this.httpsServer = {get: Sinon.stub().returns("httpsServer")};

                socketIOService = invoke(SocketIOService, [
                    {provide: HttpServer, use: this.httpServer},
                    {provide: HttpsServer, use: this.httpsServer},
                    {provide: SocketIOServer, use: this.socketIOServer}
                ]);

                socketIOService.serverSettingsService.httpPort = false;

                this.getWebsocketServicesStub = Sinon.stub(socketIOService, "getWebsocketServices");
                this.bindProviderStub = Sinon.stub(socketIOService, "bindProvider");
                this.printSocketEventsStub = Sinon.stub(socketIOService, "printSocketEvents");

                this.getWebsocketServicesStub.returns([{provider: "provider"}]);

                socketIOService.serverSettingsService.set("socketIO", {config: "config"});
                socketIOService.$onServerReady();
            });

            after(() => {
                this.getWebsocketServicesStub.restore();
                this.bindProviderStub.restore();
                this.printSocketEventsStub.restore();
            });

            it("should call attach method", () => {
                this.socketIOServer.attach.should.have.been.calledWithExactly("httpsServer", {config: "config"});
            });

            it("should call getWebsocketServices method", () => {
                this.getWebsocketServicesStub.should.have.been.calledWithExactly();
            });

            it("should call bind provider method", () => {
                this.bindProviderStub.should.have.been.calledWithExactly({provider: "provider"});
            });
        });
    });

    describe("getWebsocketServices()", () => {
        before(() => {
            const service = new SocketIOService({} as any, {} as any, {} as any, {} as any);
            this.forEachStub = Sinon.stub(ProviderRegistry, "forEach");
            this.providerStub = {
                store: {
                    has: Sinon.stub().returns(true)
                }
            };

            this.result = service.getWebsocketServices();
            this.forEachStub.getCall(0).args[0](this.providerStub);
        });

        after(() => {
            this.forEachStub.restore();
        });

        it("should returns a list of socket provider", () => {
            expect(this.result).to.deep.eq([this.providerStub]);
        });
    });
});