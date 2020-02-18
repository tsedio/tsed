"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_log_debug_1 = require("ts-log-debug");
function printRoutes(routes) {
    const mapColor = {
        GET: "green",
        POST: "yellow",
        PUT: "blue",
        DELETE: "red",
        PATCH: "magenta",
        ALL: "cyan"
    };
    routes = routes.map(route => {
        const method = route.method.toUpperCase();
        route.method = {
            length: method.length,
            toString: () => {
                return ts_log_debug_1.colorize(method, mapColor[method]);
            }
        };
        return route;
    });
    const str = ts_log_debug_1.$log.drawTable(routes, {
        padding: 1,
        header: {
            method: "Method",
            url: "Endpoint",
            name: "Class method"
        }
    });
    return "\n" + str.trim();
}
exports.printRoutes = printRoutes;
//# sourceMappingURL=printRoutes.js.map