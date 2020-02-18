"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
const Https = require("https");
const expressApplication_1 = require("../decorators/expressApplication");
const httpsServer_1 = require("../decorators/httpsServer");
function createHttpsServer(injector) {
    injector.forkProvider(httpsServer_1.HttpsServer);
}
exports.createHttpsServer = createHttpsServer;
di_1.registerProvider({
    provide: httpsServer_1.HttpsServer,
    deps: [expressApplication_1.ExpressApplication, di_1.Configuration],
    scope: di_1.ProviderScope.SINGLETON,
    global: true,
    useFactory(expressApplication, settings) {
        const options = settings.httpsOptions;
        return Https.createServer(options, expressApplication);
    }
});
//# sourceMappingURL=createHttpsServer.js.map