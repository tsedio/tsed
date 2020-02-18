"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const RequestLogger_1 = require("./RequestLogger");
class RequestContext extends Map {
    constructor(_a) {
        var { id, injector, logger } = _a, options = tslib_1.__rest(_a, ["id", "injector", "logger"]);
        super();
        /**
         * Date when request have been handled by the server. @@RequestLogger@@ use this date to log request duration.
         */
        this.dateStart = new Date();
        /**
         * The request container used by the Ts.ED DI. It contain all services annotated with `@Scope(ProviderScope.REQUEST)`
         */
        this.container = new di_1.LocalsContainer();
        this.id = id;
        injector && (this.injector = injector);
        this.logger = new RequestLogger_1.RequestLogger(logger, Object.assign({ id, startDate: this.dateStart }, options));
    }
    destroy() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.container.destroy();
            this.logger.destroy();
            delete this.container;
            delete this.logger;
            delete this.injector;
        });
    }
    emit(eventName, ...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.injector && this.injector.emit(eventName, args);
        });
    }
}
exports.RequestContext = RequestContext;
//# sourceMappingURL=RequestContext.js.map