import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {Type} from "../../core/interfaces";
import {Service} from "../../di/decorators/service";
import {ProviderScope} from "../../di/interfaces";
import {InjectorService} from "../../di/services/InjectorService";
import {IComponentScanned} from "../../server/interfaces";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {ControllerProvider} from "../class/ControllerProvider";
import {ExpressApplication} from "../decorators";
import {IControllerOptions} from "../interfaces";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {RouterController} from "./RouterController";

/**
 * ControllerService manage all controllers declared with `@ControllerProvider` decorators.
 */
@Service()
export class ControllerService extends ProxyRegistry<ControllerProvider, IControllerOptions> {
    /**
     *
     * @param expressApplication
     * @param injectorService
     * @param serverSettings
     */
    constructor(private injectorService: InjectorService,
                @ExpressApplication private expressApplication: Express.Application,
                private serverSettings: ServerSettingsService) {
        super(ControllerRegistry);
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get(target: Type<any>): ControllerProvider | undefined {
        return ControllerRegistry.get(target);
    }

    /**
     *
     * @param target
     */
    static has(target: Type<any>) {
        return ControllerRegistry.has(target);
    }

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
    public mapComponents(components: IComponentScanned[]) {
        components.forEach(component => {
            Object.keys(component.classes)
                .map(clazzName => component.classes[clazzName])
                .filter(clazz => component.endpoint && ControllerRegistry.has(clazz))
                .map(clazz =>
                    ControllerRegistry.get(clazz)!.pushRouterPath(component.endpoint!)
                );
        });
    }

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

            const target = provider.useClass;

            if (provider.scope === ProviderScope.SINGLETON && provider.instance === undefined) {
                provider.instance = this.invoke<any>(target);
            }
        });

        return this;
    }

}