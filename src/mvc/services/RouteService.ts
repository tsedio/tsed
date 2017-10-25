import {$log} from "ts-log-debug";
import {colorize} from "ts-log-debug/lib/layouts/utils/colorizeUtils";
import {nameOf} from "../../core/utils";
/**
 * @module common/mvc
 */
/** */
import {Service} from "../../di/decorators/service";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {ControllerProvider} from "../class/ControllerProvider";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {IControllerRoute} from "../interfaces";
import {ControllerService} from "./ControllerService";

/**
 * `RouteService` is used to provide all routes collected by annotation `@ControllerProvider`.
 */
@Service()
export class RouteService {

    constructor(private controllerService: ControllerService) {

    }

    public $afterRoutesInit() {
        $log.info("Routes mounted :");
        this.printRoutes($log);
    }

    /**
     * Get all routes builded by TsExpressDecorators and mounted on Express application.
     * @returns {IControllerRoute[]}
     */
    public getRoutes(): IControllerRoute[] {

        let routes: IControllerRoute[] = [];

        this.controllerService.forEach((provider: ControllerProvider) => {
            if (!provider.hasParent()) {

                provider.routerPaths.forEach(path => {
                    this.buildRoutes(routes, provider, provider.getEndpointUrl(path));
                });


            }
        });

        return routes;
    }

    /**
     * Sort controllers infos.
     * @param routeA
     * @param routeB
     * @returns {number}
     */
    private sort = (routeA: IControllerRoute, routeB: IControllerRoute) => {

        /* istanbul ignore next */
        if (routeA.url > routeB.url) {
            return 1;
        }

        /* istanbul ignore next */
        if (routeA.url < routeB.url) {
            return -1;
        }
        /* istanbul ignore next */
        return 0;
    };
    /**
     *
     * @param routes
     * @param ctrl
     * @param endpointUrl
     */
    private buildRoutes = (routes: any[], ctrl: ControllerProvider, endpointUrl: string) => {

        // console.log("Build routes =>", ctrl.className, endpointUrl);

        ctrl.dependencies
            .map(ctrl => this.controllerService.get(ctrl))
            .forEach((provider: ControllerProvider) =>
                this.buildRoutes(routes, provider, `${endpointUrl}${provider.path}`)
            );

        ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {

            if (endpoint.hasHttpMethod()) {

                const className = nameOf(ctrl.provide),
                    methodClassName = endpoint.methodClassName,
                    parameters = ParamRegistry.getParams(ctrl.provide, endpoint.methodClassName);

                routes.push({
                    method: endpoint.httpMethod,
                    name: `${className}.${methodClassName}()`,
                    url: `${endpointUrl}${endpoint.path || ""}`,
                    className,
                    methodClassName,
                    parameters
                });

            }
        });
    };

    /**
     * Print all route mounted in express via Annotation.
     */
    public printRoutes(logger: { info: (s: any) => void } = $log): void {

        const mapColor: { [key: string]: string } = {
            GET: "green",
            POST: "yellow",
            PUT: "blue",
            DELETE: "red",
            PATCH: "magenta",
            ALL: "cyan"
        };

        const routes = this
            .getRoutes()
            .map(route => {

                const method = route.method.toUpperCase();

                route.method = <any>{
                    length: method.length, toString: () => {
                        return colorize(method, mapColor[method]);
                    }
                };

                return route;
            });

        let str = $log.drawTable(routes, {
            padding: 1,
            header: {
                method: "Method",
                url: "Endpoint",
                name: "Class method"
            }
        });

        logger.info("\n" + str.trim());

    }

    /**
     * Return all Routes stored in ControllerProvider manager.
     * @returns {IControllerRoute[]}
     */
    getAll(): IControllerRoute[] {
        return this.getRoutes();
    }
}
