"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function listenServer(http, settings) {
    const { address, port, https } = settings;
    const promise = new Promise((resolve, reject) => {
        http.on("listening", resolve).on("error", reject);
    }).then(() => {
        const port = http.address().port;
        return { address: settings.address, port, https };
    });
    http.listen(port, address);
    return promise;
}
exports.listenServer = listenServer;
//# sourceMappingURL=listenServer.js.map