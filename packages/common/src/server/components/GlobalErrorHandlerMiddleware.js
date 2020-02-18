"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const mvc_1 = require("../../mvc");
/**
 * @middleware
 */
let GlobalErrorHandlerMiddleware = class GlobalErrorHandlerMiddleware {
    use(error, request, response) {
        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");
        if (error instanceof ts_httpexceptions_1.Exception || error.status) {
            request.log.error({
                error: {
                    message: error.message,
                    stack: error.stack,
                    status: error.status,
                    origin: error.origin
                }
            });
            this.setHeaders(response, error, error.origin);
            response.status(error.status).send(toHTML(error.message));
            return;
        }
        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return;
        }
        request.log.error({
            error: {
                status: 500,
                message: error.message,
                stack: error.stack,
                origin: error.origin
            }
        });
        this.setHeaders(response, error, error.origin);
        response.status(error.status || 500).send("Internal Error");
        return;
    }
    setHeaders(response, ...args) {
        let hErrors = [];
        args
            .filter(o => !!o)
            .forEach(({ headers, errors }) => {
            if (headers) {
                response.set(headers);
            }
            if (errors) {
                hErrors = hErrors.concat(errors);
            }
        });
        if (hErrors.length) {
            response.set(this.headerName, JSON.stringify(hErrors));
        }
    }
};
tslib_1.__decorate([
    di_1.Constant("errors.headerName", "errors"),
    tslib_1.__metadata("design:type", String)
], GlobalErrorHandlerMiddleware.prototype, "headerName", void 0);
tslib_1.__decorate([
    tslib_1.__param(0, mvc_1.Err()), tslib_1.__param(1, mvc_1.Req()), tslib_1.__param(2, mvc_1.Res()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], GlobalErrorHandlerMiddleware.prototype, "use", null);
GlobalErrorHandlerMiddleware = tslib_1.__decorate([
    mvc_1.Middleware()
], GlobalErrorHandlerMiddleware);
exports.GlobalErrorHandlerMiddleware = GlobalErrorHandlerMiddleware;
//# sourceMappingURL=GlobalErrorHandlerMiddleware.js.map