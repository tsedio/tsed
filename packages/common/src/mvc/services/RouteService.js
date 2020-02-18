"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const di_1 = require("@tsed/di");
const expressApplication_1 = require("../../server/decorators/expressApplication");
/**
 * `RouteService` is used to provide all routes collected by annotation `@Controller`.
 */
let RouteService = class RouteService {
    constructor(injector, expressApplication) {
        this.injector = injector;
        this.expressApplication = expressApplication;
        this._routes = [];
    }
    get routes() {
        return this._routes || [];
    }
    addRoutes(routes) {
        routes.forEach(routeSettings => {
            this.addRoute(routeSettings.route, routeSettings.token);
        });
    }
    /**
     * Add a new route in the route registry
     * @param endpoint
     * @param token
     */
    addRoute(endpoint, token) {
        if (this.injector.hasProvider(token)) {
            const provider = this.injector.getProvider(token);
            const route = provider.getEndpointUrl(endpoint);
            if (!provider.hasParent()) {
                this._routes.push({
                    route,
                    provider
                });
                this.expressApplication.use(route, provider.router);
            }
        }
        return this;
    }
    /**
     * Get all routes built by TsExpressDecorators and mounted on Express application.
     * @returns {IControllerRoute[]}
     */
    getRoutes() {
        let routes = [];
        this.routes.forEach((config) => {
            routes = routes.concat(this.buildRoutes(config.route, config.provider));
        });
        return routes;
    }
    /**
     * @deprecated Use getRoutes instead of
     */
    getAll() {
        return this.getRoutes();
    }
    /**
     *
     * @param ctrl
     * @param endpointUrl
     */
    buildRoutes(endpointUrl, ctrl) {
        let routes = [];
        ctrl.children
            .map(ctrl => this.injector.getProvider(ctrl))
            .forEach((provider) => {
            routes = routes.concat(this.buildRoutes(`${endpointUrl}${provider.path}`, provider));
        });
        ctrl.endpoints.forEach((endpoint) => {
            const { pathsMethods, params, targetName, propertyKey } = endpoint;
            pathsMethods.forEach(({ path, method }) => {
                if (!!method) {
                    routes.push({
                        method,
                        name: `${targetName}.${String(propertyKey)}()`,
                        url: `${endpointUrl}${path || ""}`.replace(/\/\//gi, "/"),
                        className: targetName,
                        methodClassName: String(propertyKey),
                        parameters: params
                    });
                }
            });
        });
        return routes;
    }
};
RouteService = tslib_1.__decorate([
    di_1.Service(),
    tslib_1.__param(1, expressApplication_1.ExpressApplication),
    tslib_1.__metadata("design:paramtypes", [di_1.InjectorService, Function])
], RouteService);
exports.RouteService = RouteService;
//# sourceMappingURL=RouteService.js.map