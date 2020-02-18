"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const Express = require("express");
const expressApplication_1 = require("../decorators/expressApplication");
let ServeStaticService = class ServeStaticService {
    constructor(expressApp) {
        this.expressApp = expressApp;
    }
    statics(statics) {
        /* istanbul ignore else */
        Object.keys(statics).forEach(path => {
            [].concat(statics[path]).forEach((directory) => this.mount(path, directory));
        });
    }
    mount(path, directory) {
        const middleware = Express.static(directory);
        this.expressApp.use(path, (request, response, next) => {
            if (!response.headersSent) {
                middleware(request, response, next);
            }
            else {
                next();
            }
        });
    }
};
ServeStaticService = tslib_1.__decorate([
    di_1.Service(),
    tslib_1.__param(0, expressApplication_1.ExpressApplication),
    tslib_1.__metadata("design:paramtypes", [Function])
], ServeStaticService);
exports.ServeStaticService = ServeStaticService;
//# sourceMappingURL=ServeStaticService.js.map