"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mvc_1 = require("../../mvc");
const onFinished = require("on-finished");
const uuidv4 = require("uuid/v4");
const defaultReqIdBuilder = () => uuidv4().replace(/-/gi, "");
class ContextMiddleware {
    constructor(injector) {
        this.injector = injector;
        const { level, maxStackSize, ignoreUrlPatterns = [], reqIdBuilder = defaultReqIdBuilder } = injector.settings.logger || {};
        this.level = level;
        this.maxStackSize = maxStackSize;
        this.ignoreUrlPatterns = ignoreUrlPatterns;
        this.reqIdBuilder = reqIdBuilder;
    }
    use(request, response, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { level, ignoreUrlPatterns, maxStackSize } = this;
            const id = this.reqIdBuilder();
            request.ctx = new mvc_1.RequestContext({
                id,
                logger: this.injector.logger,
                url: request.originalUrl || request.url,
                ignoreUrlPatterns,
                level,
                maxStackSize,
                injector: this.injector
            });
            // deprecated
            request.log = request.ctx.logger;
            onFinished(response, ContextMiddleware.onClose);
            yield this.injector.emit("$onRequest", request, response);
            next();
        });
    }
    static onClose(err, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { req: request } = response;
            try {
                yield request.ctx.emit("$onResponse", request, response);
                yield request.ctx.destroy();
            }
            catch (er) { }
            delete request.ctx;
            delete request.log;
        });
    }
}
exports.ContextMiddleware = ContextMiddleware;
/**
 * Bind request and create a new context to store information during the request lifecycle. See @@RequestContext@@ for more details.
 *
 * @param injector
 */
function contextMiddleware(injector) {
    const middleware = new ContextMiddleware(injector);
    return middleware.use.bind(middleware);
}
exports.contextMiddleware = contextMiddleware;
//# sourceMappingURL=contextMiddleware.js.map