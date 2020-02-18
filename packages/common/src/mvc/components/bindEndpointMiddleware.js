"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bindEndpointMiddleware(endpoint) {
    return (request, response, next) => {
        request.ctx.endpoint = endpoint;
        next();
    };
}
exports.bindEndpointMiddleware = bindEndpointMiddleware;
//# sourceMappingURL=bindEndpointMiddleware.js.map