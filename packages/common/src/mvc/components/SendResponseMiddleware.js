"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const converters_1 = require("../../converters");
const decorators_1 = require("../decorators");
/**
 * See example to override SendResponseMiddleware [here](/docs/middlewares/override/send-response.md).
 * @middleware
 */
let SendResponseMiddleware = class SendResponseMiddleware {
    constructor(converterService) {
        this.converterService = converterService;
    }
    use(req, response) {
        const { data, endpoint } = req.ctx;
        if (data === undefined) {
            return response.send();
        }
        if (this.shouldBeStreamed(data)) {
            data.pipe(response);
            return response;
        }
        if (this.shouldBeSent(data)) {
            return response.send(data);
        }
        return response.json(this.converterService.serialize(data, { type: endpoint.type, withIgnoredProps: false }));
    }
    shouldBeSent(data) {
        return Buffer.isBuffer(data) || core_1.isBoolean(data) || core_1.isNumber(data) || core_1.isString(data) || data === null;
    }
    shouldBeStreamed(data) {
        return core_1.isStream(data);
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, decorators_1.Req()), tslib_1.__param(1, decorators_1.Res()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], SendResponseMiddleware.prototype, "use", null);
SendResponseMiddleware = tslib_1.__decorate([
    decorators_1.Middleware(),
    tslib_1.__metadata("design:paramtypes", [converters_1.ConverterService])
], SendResponseMiddleware);
exports.SendResponseMiddleware = SendResponseMiddleware;
//# sourceMappingURL=SendResponseMiddleware.js.map