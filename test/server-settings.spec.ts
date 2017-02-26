
import {expect} from "chai";
import {ServerSettingsProvider, EnvTypes} from "../src/services/server-settings";

describe("ServerSettingsProvider()", () => {

    it("should set values", () => {

        const serverSettingsProvider = new ServerSettingsProvider();
        serverSettingsProvider.env = EnvTypes.TEST;

        serverSettingsProvider.set("ownConfig", "test");
        serverSettingsProvider.set({"ownConfig2": "test"});

        serverSettingsProvider.endpoint = "/rest";
        serverSettingsProvider.httpsOptions = {test: "/rest"} as any;

        const serverSettingsService = serverSettingsProvider.$get();

        expect(serverSettingsService.endpoint).to.equal("/rest");
        expect(serverSettingsService.endpointUrl).to.equal("/rest");
        expect(serverSettingsService.get("ownConfig")).to.equal("test");
        expect(serverSettingsService.env).to.equal(EnvTypes.TEST);
        expect(serverSettingsService.httpsPort).to.equal(8000);
        expect(serverSettingsService.httpPort).to.equal(8080);
        expect(serverSettingsService.componentsScan).to.be.an("array");
        expect(serverSettingsService.uploadDir).to.contains("uploads");
        expect(serverSettingsService.mount['/rest']).to.be.a("string");
        expect((serverSettingsService.httpsOptions as any).test).to.equal('/rest');
    });


});
