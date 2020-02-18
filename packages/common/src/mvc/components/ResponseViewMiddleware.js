"use strict";
var ResponseViewMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const middleware_1 = require("../decorators/class/middleware");
const endpointInfo_1 = require("../decorators/params/endpointInfo");
const response_1 = require("../decorators/params/response");
const responseData_1 = require("../decorators/params/responseData");
const TemplateRenderingError_1 = require("../errors/TemplateRenderingError");
/**
 * See example to override ResponseViewMiddleware [here](/docs/middlewares/override/response-view.md).
 * @middleware
 */
let ResponseViewMiddleware = ResponseViewMiddleware_1 = class ResponseViewMiddleware {
    use(data, endpoint, response) {
        return new Promise((resolve, reject) => {
            const { viewPath, viewOptions } = endpoint.store.get(ResponseViewMiddleware_1);
            if (viewPath !== undefined) {
                if (viewOptions !== undefined) {
                    data = Object.assign({}, data, viewOptions);
                }
                response.render(viewPath, data, (err, html) => {
                    /* istanbul ignore next */
                    if (err) {
                        reject(new TemplateRenderingError_1.TemplateRenderingError(endpoint.target, endpoint.propertyKey, err));
                    }
                    else {
                        resolve(html);
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, responseData_1.ResponseData()), tslib_1.__param(1, endpointInfo_1.EndpointInfo()), tslib_1.__param(2, response_1.Res()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ResponseViewMiddleware.prototype, "use", null);
ResponseViewMiddleware = ResponseViewMiddleware_1 = tslib_1.__decorate([
    middleware_1.Middleware()
], ResponseViewMiddleware);
exports.ResponseViewMiddleware = ResponseViewMiddleware;
//# sourceMappingURL=ResponseViewMiddleware.js.map