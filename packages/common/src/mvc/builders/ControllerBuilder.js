"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const bindEndpointMiddleware_1 = require("../components/bindEndpointMiddleware");
const SendResponseMiddleware_1 = require("../components/SendResponseMiddleware");
const statusAndHeadersMiddleware_1 = require("../components/statusAndHeadersMiddleware");
const HandlerBuilder_1 = require("./HandlerBuilder");
class ControllerBuilder {
    constructor(provider) {
        this.provider = provider;
    }
    /**
     *
     * @returns {any}
     */
    build(injector) {
        const { routerOptions, middlewares: { useBefore, useAfter } } = this.provider;
        // TODO Use injector create new router instance
        const defaultRoutersOptions = injector.settings.routers;
        this.provider.router = Express.Router(Object.assign({}, defaultRoutersOptions, routerOptions));
        // Controller lifecycle
        this.buildMiddlewares(injector, useBefore) // Controller before-middleware
            .buildEndpoints(injector) // All endpoints and his middlewares
            .buildMiddlewares(injector, useAfter) // Controller after-middleware
            .buildChildrenCtrls(injector); // Children controllers
        return this.provider.router;
    }
    buildEndpoints(injector) {
        const { endpoints } = this.provider;
        const pathsMethodsMap = new Map();
        const getKey = (method, path) => `${method}-${path}`;
        const updateFinalRouteState = (key) => {
            if (pathsMethodsMap.has(key)) {
                pathsMethodsMap.get(key).isFinal = false;
            }
        };
        const setFinalRoute = (key, pathMethod) => {
            pathsMethodsMap.set(key, pathMethod);
            pathMethod.isFinal = true;
        };
        endpoints.forEach(({ pathsMethods }) => {
            pathsMethods.forEach(pathMethod => {
                pathMethod.method = pathMethod.method || "use";
                if (pathMethod.method !== "use") {
                    const key = getKey(pathMethod.method, pathMethod.path);
                    updateFinalRouteState(key);
                    updateFinalRouteState(getKey("all", pathMethod.path));
                    setFinalRoute(key, pathMethod);
                }
            });
        });
        endpoints.forEach(endpoint => {
            this.buildEndpoint(injector, endpoint);
        });
        return this;
    }
    buildEndpoint(injector, endpoint) {
        const { beforeMiddlewares, middlewares: mldwrs, afterMiddlewares, pathsMethods } = endpoint;
        const { router, middlewares: { use } } = this.provider;
        // Endpoint lifecycle
        let handlers = [];
        handlers = handlers
            .concat(bindEndpointMiddleware_1.bindEndpointMiddleware(endpoint))
            .concat(use) // Controller use-middlewares
            .concat(beforeMiddlewares) // Endpoint before-middlewares
            .concat(mldwrs) // Endpoint middlewares
            .concat(endpoint) // Endpoint handler
            .concat(statusAndHeadersMiddleware_1.statusAndHeadersMiddleware)
            .concat(afterMiddlewares) // Endpoint after-middlewares
            .filter((item) => !!item)
            .map((middleware) => HandlerBuilder_1.HandlerBuilder.from(middleware).build(injector));
        const sendResponse = HandlerBuilder_1.HandlerBuilder.from(SendResponseMiddleware_1.SendResponseMiddleware).build(injector);
        // Add handlers to the router
        pathsMethods.forEach(({ path, method, isFinal }) => {
            const localHandlers = isFinal ? handlers.concat(sendResponse) : handlers;
            router[method](path, ...localHandlers);
        });
        if (!pathsMethods.length) {
            router.use(...handlers);
        }
    }
    buildChildrenCtrls(injector) {
        const { children, router } = this.provider;
        children.forEach((child) => {
            const provider = injector.getProvider(child);
            /* istanbul ignore next */
            if (!provider) {
                throw new Error("Controller component not found in the ControllerRegistry");
            }
            new ControllerBuilder(provider).build(injector);
            router.use(provider.path, provider.router);
        });
    }
    buildMiddlewares(injector, middlewares) {
        const { router } = this.provider;
        middlewares
            .filter(o => typeof o === "function")
            .forEach((middleware) => {
            router.use(HandlerBuilder_1.HandlerBuilder.from(middleware).build(injector));
        });
        return this;
    }
}
exports.ControllerBuilder = ControllerBuilder;
//# sourceMappingURL=ControllerBuilder.js.map