import {Deprecated, ProxyRegistry, Type} from "@tsed/core";
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Service} from "../../di/decorators/service";
import {InjectorService} from "../../di/services/InjectorService";
import {IComponentScanned} from "../../server/interfaces";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {ControllerProvider} from "../class/ControllerProvider";
import {ExpressApplication} from "../decorators";
import {IControllerOptions} from "../interfaces";
import {ControllerRegistry} from "../registries/ControllerRegistry";

/**
 *
 */
@Service()
export class ControllerService extends ProxyRegistry<ControllerProvider, IControllerOptions> {
    private readonly _routes: { route: string, provider: any }[] = [];

    /**
     *
     * @param expressApplication
     * @param injectorService
     * @param serverSettings
     */
    constructor(private injectorService: InjectorService,
                @ExpressApplication private expressApplication: Express.Application,
                private serverSettings: ServerSettingsService) {
        super(ControllerRegistry as any);

        this.buildRouters();
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     * @deprecated
     */
    @Deprecated("removed feature")
    static get(target: Type<any>): ControllerProvider | undefined {
        return ControllerRegistry.get(target) as ControllerProvider;
    }

    /**
     *
     * @param target
     * @deprecated
     */
    @Deprecated("removed feature")
    static has(target: Type<any>) {
        return ControllerRegistry.has(target);
    }

    /**
     *
     * @param target
     * @param provider
     * @deprecated
     */
    @Deprecated("removed feature")
    static set(target: Type<any>, provider: ControllerProvider) {
        ControllerRegistry.set(target, provider);

        return this;
    }

    /**
     *
     * @param components
     */
    public $onRoutesInit(components: { file: string, endpoint: string, classes: any[] }[]) {

        $log.info("Map controllers");
        this.mapComponents(components);
    }

    /**
     * Build routers and con
     */
    private buildRouters() {
        const defaultRoutersOptions = this.serverSettings.routers;
        this.forEach((provider: ControllerProvider) => {
            if (!provider.router && !provider.hasParent()) {
                new ControllerBuilder(provider, defaultRoutersOptions).build();
            }
        });
    }

    /**
     *
     * @param components
     */
    private mapComponents(components: IComponentScanned[]) {
        components
            .forEach(component => {
                Object.keys(component.classes)
                    .map(clazzName => component.classes[clazzName])
                    .filter(clazz => component.endpoint && this.has(clazz))
                    .map(clazz =>
                        this.get(clazz)
                    )
                    .forEach((provider: ControllerProvider) => {
                        if (!provider.hasParent()) {
                            this.mountRouter(component.endpoint!, provider);
                        }
                    });
            });
    }

    /**
     *
     * @param {string} endpoint
     * @param {ControllerProvider} provider
     */
    private mountRouter = (endpoint: string, provider: ControllerProvider) => {
        const route = provider.getEndpointUrl(endpoint!);
        this._routes.push({provider, route});
        this.expressApplication.use(route, provider.router);
    };

    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     * @deprecated
     */
    @Deprecated("Removed feature. Use injectorService.invoke instead of.")
    public invoke<T>(target: any, locals: Map<Type<any> | any, any> = new Map<Type<any>, any>(), designParamTypes?: any[]): T {
        return this.injectorService.invoke<T>(target.provide || target, locals, designParamTypes);
    }

    get routes(): { route: string; provider: any }[] {
        return this._routes;
    }
}