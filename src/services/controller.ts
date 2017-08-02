import {$log} from "ts-log-debug";
import {CYCLIC_REF, UNKNOW_CONTROLLER} from "../constants/errors-msgs";
import {CONTROLLER_DEPEDENCIES, CONTROLLER_SCOPE, CONTROLLER_URL} from "../constants/metadata-keys";
import Controller from "../controllers/controller";
import {Endpoint} from "../controllers/endpoint";
import {Inject} from "../decorators/inject";
import {Service} from "../decorators/service";
import {IControllerRoute} from "../interfaces/ControllerRoute";
import {getClassName} from "../utils/class";
import {ExpressApplication} from "./express-application";
import {RouterController} from "./index";
import InjectParams from "./inject-params";
import InjectorService from "./injector";
import Metadata from "./metadata";
import {ServerSettingsService} from "./server-settings";

/**
 * ControllerService manage all controllers declared with `@Controller` decorator.
 */
@Service()
export default class ControllerService {

    /**
     * Controllers registry.
     * @type {Array}
     */
    static controllers: Map<any, Controller> = new Map<any, Controller>();

    /**
     *
     * @param expressApplication
     */
    constructor(@Inject(ExpressApplication) private expressApplication: ExpressApplication,
                private serverSettings: ServerSettingsService) {

    }

    /**
     *
     * @param target
     * @returns {Controller}
     */
    static get(target: string | Function): Controller {
        return this.controllers.get(target);
    }

    /**
     * Add new controller.
     * @param target
     * @param endpoint
     * @param dependencies
     * @param controlerOptions
     * @returns {ControllerService}
     */
    static set(target: any, endpoint: string, dependencies: any[], controlerOptions: {[key: string]: boolean} = {}) {

        const ctrl = new Controller(
            target,
            endpoint,
            dependencies,
            controlerOptions
        );

        this.controllers.set(
            target,
            ctrl
        );

        return this;
    }

    /**
     * Load all controllers and mount routes to the ExpressApplication.
     * @param app
     */
    public load() {

        this.controllersFromMetadatas();

        ControllerService
            .controllers
            .forEach(ctrl => this.resolveDependencies(ctrl));

        ControllerService
            .controllers
            .forEach(ctrl => ctrl.mapEndpointsToRouters());

        this.mountControllers();

        return this;
    }

    /**
     * Map all controllers collected by @Controller annotation.
     */
    private controllersFromMetadatas() {

        const controllers = Metadata.getTargetsFromPropertyKey(CONTROLLER_URL);

        controllers
            .forEach((target: any) => {

                ControllerService.set(
                    target,
                    Metadata.get(CONTROLLER_URL, target),
                    Metadata.get(CONTROLLER_DEPEDENCIES, target),
                    {scope: Metadata.get(CONTROLLER_SCOPE, target), ...this.serverSettings.routers}
                );


            });

        return this;
    }

    /**
     * Resolve all dependencies for each controllers
     * @param currentCtrl
     * @returns {Controller}
     */
    private resolveDependencies(currentCtrl: Controller): Controller {

        currentCtrl.dependencies = currentCtrl
            .dependencies
            .map((dep: string | Function) => {

                const ctrl = this.get(<string | Function>dep);

                if (ctrl === undefined) {
                    throw new Error(UNKNOW_CONTROLLER(
                        typeof dep === "string" ? dep : getClassName(dep)
                    ));
                }

                ctrl.parent = currentCtrl;

                // PREVENT CYCLIC REFERENCES
                /* istanbul ignore next */
                if (ctrl.parent === currentCtrl && currentCtrl.parent === ctrl) {
                    throw new Error(CYCLIC_REF(
                        ctrl.getName(),
                        currentCtrl.getName()
                    ));
                }

                return ctrl;
            });


        return currentCtrl;
    }

    /**
     * Bind all root router Controller to express Application instance.
     */
    private mountControllers() {

        ControllerService
            .controllers
            .forEach(finalCtrl => {

                if (!finalCtrl.parent) {

                    finalCtrl
                        .getMountEndpoints()
                        .forEach(endpoint => {
                            this.expressApplication.use(finalCtrl.getEndpointUrl(endpoint), finalCtrl.router);
                        });
                }

            });

        return this;
    }

    /**
     *
     * @param target
     * @returns {Controller}
     */
    public get = (target: string | Function): Controller => ControllerService.get(target);


    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @returns {T}
     */
    public invoke<T>(target: any, locals: Map<string | Function, any> = new Map<string | Function, any>()): T {
        return ControllerService.invoke<T>(target, locals);
    }

    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @returns {T}
     */
    static invoke<T>(target: any, locals: Map<string | Function, any> = new Map<string | Function, any>()): T {

        target = target.targetClass || target;

        const controller: Controller = this.get(target);

        if (controller.createInstancePerRequest || controller.instance === undefined) {
            locals.set(RouterController, new RouterController(controller.router));

            controller.instance = InjectorService.invoke<T>(target, locals);
        }

        return controller.instance;
    }

    /**
     *
     * @returns {IControllerRoute[]}
     */
    public getRoutes(): IControllerRoute[] {

        let routes: IControllerRoute[] = [];

        const buildRoutes = (ctrl: Controller, endpointUrl: string) => {

            ctrl.dependencies.forEach((ctrl: Controller) => buildRoutes(ctrl, `${endpointUrl}${ctrl.endpointUrl}`));

            ctrl.endpoints.forEach((endpoint: Endpoint) => {

                if (endpoint.hasMethod()) {

                    const className = getClassName(ctrl.targetClass),
                        methodClassName = endpoint.methodClassName,
                        parameters = InjectParams.getParams(ctrl.targetClass, endpoint.methodClassName),
                        returnType = Metadata.getReturnType(ctrl.targetClass, endpoint.methodClassName);

                    routes.push({
                        method: endpoint.getMethod(),
                        name: `${className}.${methodClassName}()`,
                        url: `${endpointUrl}${endpoint.getRoute() || ""}`,
                        className,
                        methodClassName,
                        parameters,
                        returnType
                    });

                }
            });

        };

        ControllerService
            .controllers
            .forEach((finalCtrl: Controller) => {

                if (!finalCtrl.parent) {
                    finalCtrl
                        .getMountEndpoints()
                        .map(endpoint => finalCtrl.getEndpointUrl(endpoint))
                        .forEach(endpoint => buildRoutes(finalCtrl, endpoint));
                }


            });


        routes = routes.sort((routeA: IControllerRoute, routeB: IControllerRoute) => {

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
        });

        return routes;
    }

    /**
     * Print all route mounted in express via Annotation.
     */
    public printRoutes(logger: { info: (s) => void } = $log): void {

        const mapColor = {
            GET: (<any>"GET").green,
            POST: (<any>"POST").yellow,
            PUT: (<any>"PUT").blue,
            DELETE: (<any>"DELETE").red,
            PATCH: (<any>"PATCH").magenta,
            ALL: (<any>"ALL").cyan
        };

        const routes = this
            .getRoutes()
            .map(route => {

                const method = route.method.toUpperCase();

                route.method = <any>{length: method.length, toString: () => mapColor[method] || method};

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
}