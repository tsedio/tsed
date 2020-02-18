"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
const Http = require("http");
const expressApplication_1 = require("../decorators/expressApplication");
const httpServer_1 = require("../decorators/httpServer");
function createHttpServer(injector) {
    injector.forkProvider(httpServer_1.HttpServer);
}
exports.createHttpServer = createHttpServer;
di_1.registerProvider({
    provide: httpServer_1.HttpServer,
    deps: [expressApplication_1.ExpressApplication],
    scope: di_1.ProviderScope.SINGLETON,
    global: true,
    useFactory(expressApplication) {
        return Http.createServer(expressApplication);
    }
});
//# sourceMappingURL=createHttpServer.js.map