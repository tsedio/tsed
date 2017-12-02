import {ServerSettingsProvider} from "../../../../src/config/class/ServerSettingsProvider";
import {ServerSettingsService} from "../../../../src/config/services/ServerSettingsService";
import {Env} from "../../../../src/core/interfaces";
import {expect} from "../../../tools";

describe("ServerSettingsProvider", () => {

    before(() => {
        const serverSettingsProvider = new ServerSettingsProvider();
        serverSettingsProvider.env = Env.TEST;

        serverSettingsProvider.set("ownConfig", "test");
        serverSettingsProvider.set({"ownConfig2": "test"});
        serverSettingsProvider.version = "1.0.0";
        serverSettingsProvider.httpsOptions = {test: "/rest"} as any;
        serverSettingsProvider.acceptMimes = ["application/json"];
        serverSettingsProvider.serveStatic = {"/": "/publics"};
        serverSettingsProvider.routers = {mergeParams: true};

        this.serverSettingsService = serverSettingsProvider.$get();
        this.serverSettingsProvider = serverSettingsProvider;
    });

    it("should return rootDir", () => {
        expect(this.serverSettingsService.rootDir).to.equal(process.cwd());
    });
    it("should return rootDir", () => {
        expect(this.serverSettingsProvider.rootDir).to.equal(process.cwd());
    });

    it("should return custom keys", () => {
        expect(this.serverSettingsService.get("ownConfig")).to.equal("test");
    });

    it("should return env", () => {
        expect(this.serverSettingsService.env).to.equal(Env.TEST);
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

    it("should return validationModelStrict", () => {
        expect(this.serverSettingsService.validationModelStrict).to.equal(true);
        expect(this.serverSettingsProvider.validationModelStrict).to.equal(true);

        this.serverSettingsProvider.validationModelStrict = false;
        expect(this.serverSettingsProvider.validationModelStrict).to.equal(false);
    });

    describe("forEach()", () => {
        before(() => {
            this.result = [];
            this.serverSettingsService.forEach((o: any) => this.result.push(o));
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

    describe("resolve()", () => {
        it("should replace rootDir", () => {
            expect(this.serverSettingsService.resolve("${rootDir}")).to.eq(process.cwd());
        });

        it("should replace rootDir", () => {
            expect(this.serverSettingsService.resolve({other: 808, resolve: "${rootDir}"})).to.deep.eq({
                other: 808,
                resolve: process.cwd()
            });
        });
    });
});
