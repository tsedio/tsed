"use strict";
var LogIncomingRequestMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const mvc_1 = require("../../mvc");
/**
 * @middleware
 */
let LogIncomingRequestMiddleware = LogIncomingRequestMiddleware_1 = class LogIncomingRequestMiddleware {
    // tslint:disable-next-line: no-unused-variable
    constructor(injector) {
        this.settings = injector.settings.logger || {};
        this.settings.requestFields = this.settings.requestFields || LogIncomingRequestMiddleware_1.DEFAULT_FIELDS;
        if (this.settings.level !== "off") {
            this.$onResponse = this.onLogEnd;
        }
    }
    /**
     * Handle the request.
     * @param {e.Request} request
     */
    use(request) {
        this.configureRequest(request);
        this.onLogStart(request);
    }
    /**
     * The separate onLogStart() function will allow developer to overwrite the initial request log.
     * @param {e.Request} request
     */
    onLogStart(request) {
        const { debug, logRequest, logStart } = this.settings;
        if (logStart !== false) {
            if (debug) {
                request.ctx.logger.debug({
                    event: "request.start"
                });
            }
            else if (logRequest) {
                request.ctx.logger.info({
                    event: "request.start"
                });
            }
        }
    }
    /**
     * Called when the `$onResponse` is called by Ts.ED (through Express.end).
     * @param request
     * @param response
     */
    onLogEnd(request, response) {
        const { debug, logRequest, logEnd } = this.settings;
        if (logEnd !== false) {
            if (debug) {
                request.ctx.logger.debug({
                    event: "request.end",
                    status: response.statusCode,
                    data: request.ctx.data
                });
            }
            else if (logRequest) {
                request.ctx.logger.info({
                    event: "request.end",
                    status: response.statusCode
                });
            }
        }
        request.ctx.logger.flush();
    }
    /**
     * Attach all information that will be necessary to log the request. Attach a new `request.log` object.
     * @param request
     */
    configureRequest(request) {
        const minimalInfo = this.minimalRequestPicker(request);
        const requestObj = this.requestToObject(request);
        request.ctx.logger.minimalRequestPicker = (obj) => (Object.assign(Object.assign({}, minimalInfo), obj));
        request.ctx.logger.completeRequestPicker = (obj) => (Object.assign(Object.assign({}, requestObj), obj));
    }
    /**
     * Return complete request info.
     * @param request
     * @returns {Object}
     */
    requestToObject(request) {
        return {
            method: request.method,
            url: request.originalUrl || request.url,
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params
        };
    }
    /**
     * Return a filtered request from global configuration.
     * @param request
     * @returns {Object}
     */
    minimalRequestPicker(request) {
        const { requestFields } = this.settings;
        const info = this.requestToObject(request);
        return requestFields.reduce((acc, key) => {
            acc[key] = info[key];
            return acc;
        }, {});
    }
};
LogIncomingRequestMiddleware.DEFAULT_FIELDS = ["reqId", "method", "url", "duration"];
tslib_1.__decorate([
    tslib_1.__param(0, mvc_1.Req()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LogIncomingRequestMiddleware.prototype, "use", null);
LogIncomingRequestMiddleware = LogIncomingRequestMiddleware_1 = tslib_1.__decorate([
    mvc_1.Middleware(),
    tslib_1.__metadata("design:paramtypes", [di_1.InjectorService])
], LogIncomingRequestMiddleware);
exports.LogIncomingRequestMiddleware = LogIncomingRequestMiddleware;
//# sourceMappingURL=LogIncomingRequestMiddleware.js.map