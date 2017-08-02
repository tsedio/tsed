import {EnvTypes} from "../../../../src";
import {ServerSettingsProvider} from "../../../../src/server/class/ServerSettingsProvider";
import {ServerSettingsService} from "../../../../src/server/services/ServerSettingsService";
import {expect} from "../../../tools";

describe("ServerSettingsProvider", () => {

    before(() => {
        const serverSettingsProvider = new ServerSettingsProvider();
        serverSettingsProvider.env = EnvTypes.TEST;

        serverSettingsProvider.set("ownConfig", "test");
        serverSettingsProvider.set({"ownConfig2": "test"});

        serverSettingsProvider.endpoint = "/rest";
        serverSettingsProvider.version = "1.0.0";
        serverSettingsProvider.httpsOptions = {test: "/rest"} as any;
        serverSettingsProvider.acceptMimes = ["application/json"];
        serverSettingsProvider.serveStatic = {"/": "/publics"};
        serverSettingsProvider.routers = {mergeParams: true};

        this.serverSettingsService = serverSettingsProvider.$get();
        this.serverSettingsProvider = serverSettingsProvider;
    });

    it("should return endpoint", () => {
        expect(this.serverSettingsService.endpoint).to.equal("/rest");
    });

    it("should return endpointUrl", () => {
        expect(this.serverSettingsService.endpointUrl).to.equal("/rest");
    });

    it("should return custom keys", () => {
        expect(this.serverSettingsService.get("ownConfig")).to.equal("test");
    });

    it("should return env", () => {
        expect(this.serverSettingsService.env).to.equal(EnvTypes.TEST);
    });

    it("should return httpsPort", () => {
        expect(this.serverSettingsService.httpsPort).to.equal(8000);
    });

    it("should return httpPort", () => {
        expect(this.serverSettingsService.httpPort).to.equal(8080);
    });

    it("should return httpsPort", () => {
        expect(this.serverSettingsService.getHttpsPort()).to.deep.equal({address: "0.0.0.0", port: 8000});
    });

    it("should return httpPort", () => {
        expect(this.serverSettingsService.getHttpPort()).to.deep.equal({address: "0.0.0.0", port: 8080});
    });

    it("should return componentsScan", () => {
        expect(this.serverSettingsService.componentsScan).to.be.an("array");
    });

    it("should return uploadDir", () => {
        expect(this.serverSettingsService.uploadDir).to.contains("uploads");
    });

    it("should return mount", () => {
        expect(this.serverSettingsService.mount["/rest"]).to.be.a("string");
    });

    it("should return httpsOptions", () => {
        expect((this.serverSettingsService.httpsOptions as any).test).to.equal("/rest");
    });

    it("should return acceptMimes", () => {
        expect(this.serverSettingsService.acceptMimes[0]).to.equal("application/json");
    });

    it("should return serveStatic", () => {
        expect(this.serverSettingsService.serveStatic).to.deep.equal({"/": "/publics"});
    });

    it("should return authentification", () => {
        expect(this.serverSettingsService.authentification).to.be.a("function");
    });

    it("should return debug", () => {
        expect(this.serverSettingsService.debug).to.equal(false);
    });

    it("should return debug (2)", () => {
        expect(this.serverSettingsProvider.debug).to.equal(false);
    });

    it("should return env", () => {
        expect(this.serverSettingsProvider.env).to.equal("test");
    });

    it("should return env", () => {
        expect(this.serverSettingsService.version).to.equal("1.0.0");
    });

    it("should return env", () => {
        expect(this.serverSettingsService.routers).to.deep.equal({mergeParams: true});
    });

    describe("forEach()", () => {
        before(() => {
            this.result = [];
            this.serverSettingsService.forEach(o => this.result.push(o));
        });

        it("should loop on items", () => {
            expect(!!this.result.length).to.eq(true);
        });
    });

    describe("buildAddressAndPort()", () => {
        it("should return address and port from a concatened address and port", () => {
            expect((ServerSettingsService as any).buildAddressAndPort("0.0.0.0:9000")).to.deep.eq({
                address: "0.0.0.0",
                port: 9000
            });
        });

        it("should return address and port from a port number", () => {
            expect((ServerSettingsService as any).buildAddressAndPort(9000)).to.deep.eq({
                address: "0.0.0.0",
                port: 9000
            });
        });
    });
});
