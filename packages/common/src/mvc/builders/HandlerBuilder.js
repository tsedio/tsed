"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const HandlerType_1 = require("../interfaces/HandlerType");
const EndpointMetadata_1 = require("../models/EndpointMetadata");
const HandlerMetadata_1 = require("../models/HandlerMetadata");
const ParamBuilder_1 = require("./ParamBuilder");
/**
 * @stable
 */
class HandlerBuilder {
    constructor(handlerMetadata) {
        this.handlerMetadata = handlerMetadata;
    }
    /**
     *
     * @param obj
     * @returns {HandlerBuilder}
     */
    static from(obj) {
        return {
            build(injector) {
                const handlerMetadata = HandlerBuilder.resolve(obj, injector);
                if (handlerMetadata.type === HandlerType_1.HandlerType.FUNCTION) {
                    // injector.logger.debug("Return handler as function", handlerMetadata.handler.name);
                    return handlerMetadata.handler;
                }
                // injector.logger.trace("Build handler", `${nameOf(handlerMetadata.target)}.${handlerMetadata.method}()`);
                return new HandlerBuilder(handlerMetadata).build(injector);
            }
        };
    }
    static resolve(obj, injector) {
        let options;
        if (obj instanceof EndpointMetadata_1.EndpointMetadata) {
            const provider = injector.getProvider(obj.target);
            options = {
                token: provider.provide,
                target: provider.useClass,
                type: HandlerType_1.HandlerType.CONTROLLER,
                propertyKey: obj.propertyKey
            };
        }
        else {
            const provider = injector.getProvider(obj);
            if (provider) {
                options = {
                    token: provider.provide,
                    target: provider.useClass,
                    type: HandlerType_1.HandlerType.MIDDLEWARE,
                    propertyKey: "use"
                };
            }
            else {
                options = {
                    target: obj,
                    type: HandlerType_1.HandlerType.FUNCTION
                };
            }
        }
        return new HandlerMetadata_1.HandlerMetadata(options);
    }
    static handle(process, context) {
        const { handler: { hasNextFunction }, request, response, next } = context;
        const done = (error, result) => {
            if (error) {
                return next(error);
            }
            if (!hasNextFunction) {
                // @ts-ignore
                if (!next.isCalled && result !== undefined) {
                    request.ctx.data = result;
                }
                next();
            }
        };
        if (process) {
            if (process === context.response) {
                return;
            }
            if (rxjs_1.isObservable(process)) {
                process = process.toPromise();
            }
            if (core_1.isStream(process) || Buffer.isBuffer(process)) {
                return done(null, process);
            }
            if (core_1.isFunction(process)) {
                // when process return a middleware
                return process(request, response, next);
            }
            if (core_1.isPromise(process)) {
                return process.then((result) => this.handle(result, context)).catch((error) => done(error));
            }
        }
        if (!hasNextFunction) {
            // no next function and empty response
            done(null, process);
        }
    }
    /**
     *
     * @returns {any}
     */
    build(injector) {
        const { hasErrorParam } = this.handlerMetadata;
        this.debug = injector.settings.debug;
        const dispatch = this.createDispatcher(injector);
        if (hasErrorParam) {
            return (err, request, response, next) => dispatch({
                request,
                response,
                next,
                err,
                handler: this.handlerMetadata,
                args: []
            });
        }
        else {
            return (request, response, next) => dispatch({
                request,
                response,
                next,
                handler: this.handlerMetadata,
                args: []
            });
        }
    }
    createDispatcher(injector) {
        const { handlerMetadata: { parameters } } = this;
        const requestSubject = new rxjs_1.Subject();
        const sources = [requestSubject];
        const observables = [requestSubject];
        // Build parameters
        parameters.forEach((param) => {
            const { subject, observable } = new ParamBuilder_1.ParamBuilder(param).build(injector);
            sources.push(subject);
            observables.push(observable);
        });
        const mapContext = operators_1.map(([context, ...args]) => {
            context.args = args;
            context.next = this.buildNext(context);
            return context;
        });
        rxjs_1.zip(...observables)
            .pipe(mapContext)
            .subscribe(context => this.invoke(injector, context));
        // Return dispatcher
        return (context) => {
            this.log(context, { event: "invoke.start" });
            sources.forEach(source => {
                source.next(context);
            });
        };
    }
    /**
     *
     * @returns {Promise<any>}
     * @param injector
     * @param context
     */
    invoke(injector, context) {
        try {
            /* istanbul ignore next */
            if (context.response.headersSent) {
                return;
            }
            const { token, method } = this.handlerMetadata;
            this.checkContext(context);
            const instance = injector.invoke(token, context.request.ctx.container);
            const handler = instance[method].bind(instance);
            const process = handler(...context.args);
            HandlerBuilder.handle(process, context);
        }
        catch (error) {
            context.next(error);
        }
    }
    /**
     *
     * @param context
     * @param o
     * @returns {string}
     */
    log(context, o = {}) {
        const { request } = context;
        if (request.log && this.debug) {
            const { target, injectable, method } = this.handlerMetadata;
            request.log.debug(Object.assign({ type: this.handlerMetadata.type, target: (target ? core_1.nameOf(target) : target.name) || "anonymous", methodName: method, injectable, data: request.ctx.data }, o), false);
        }
    }
    checkContext(context) {
        const error = context.args.find(arg => arg instanceof Error && arg !== context.err);
        if (error) {
            throw error;
        }
    }
    /**
     *
     * @returns {any}
     * @param context
     */
    buildNext(context) {
        // @ts-ignore
        const next = context.next;
        const dateTime = Date.now();
        next.isCalled = false;
        return (error) => {
            next.isCalled = true;
            if (context.response.headersSent) {
                return;
            }
            /* istanbul ignore else */
            this.log(context, { event: "invoke.end", error, execTime: Date.now() - dateTime });
            return next(error);
        };
    }
}
exports.HandlerBuilder = HandlerBuilder;
//# sourceMappingURL=HandlerBuilder.js.map