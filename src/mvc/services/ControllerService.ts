/**
 * @module common/mvc
 */
/** */
import * as Express from "express";
import {$log} from "ts-log-debug";
import {Type} from "../../core/interfaces";
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {Inject} from "../../di";
import {Service} from "../../di/decorators/service";
import {InjectorService} from "../../di/services/InjectorService";
import {ServerSettingsService} from "../../server/services/ServerSettingsService";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {ControllerProvider} from "../class/ControllerProvider";
import {ControllerRegistry, ProxyControllerRegistry} from "../registries/ControllerRegistry";
import {RouterController} from "./RouterController";

/**
 * ControllerService manage all controllers declared with `@ControllerProvider` decorators.
 */
@Service()
export class ControllerService extends ProxyControllerRegistry {

    /**
     *
     * @param expressApplication
     * @param injectorService
     * @param serverSettings
     */
    constructor(private injectorService: InjectorService,
                @Inject(ExpressApplication) private expressApplication: ExpressApplication,
                private serverSettings: ServerSettingsService) {
        super();
    }

    /**
     *
     * @param components
     */
    public $onRoutesInit(components: { file: string, endpoint: string, classes: any[] }[]) {

        $log.info("Build controllers");

        this.mapComponents(components);
        this.buildControllers();
    }

    /**
     *
     * @param components
     */
    public mapComponents(components) {
        components.forEach(component => {
            Object.keys(component.classes)
                .map(clazzName => component.classes[clazzName])
                .filter(clazz => ControllerRegistry.has(clazz))
                .map(clazz =>
                    ControllerRegistry.get(clazz).pushRouterPath(component.endpoint)
                );
        });
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): ControllerProvider =>
        ControllerRegistry.get(target);

    /**
     *
     * @param target
     * @param provider
     */
    static set(target: Type<any>, provider: ControllerProvider) {
        ControllerRegistry.set(target, provider);
        return this;
    }

    /**
     *
     * @param target
     */
    static has = (target: Type<any>) =>
        ControllerRegistry.has(target);

    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     */
    public invoke<T>(target: any, locals: Map<Type<any>, any> = new Map<Type<any>, any>(), designParamTypes?: any[]): T {

        if (!locals.has(RouterController)) {
            locals.set(RouterController, new RouterController(Express.Router()));
        }

        return this.injectorService.invoke<T>(target.provide || target, locals, designParamTypes);
    }

    /**
     * Build all controllers and mount routes to the ExpressApplication.
     */
    public buildControllers() {

        const defaultRoutersOptions = this.serverSettings.routers;

        ControllerRegistry.forEach((provider: ControllerProvider) => {

            if (!provider.hasParent()) {
                new ControllerBuilder(provider, defaultRoutersOptions).build();

                provider.routerPaths.forEach(path => {
                    this.expressApplication.use(provider.getEndpointUrl(path), provider.router);
                });

            }
        });

        return this;
    }

}