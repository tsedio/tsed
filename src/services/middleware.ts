
import {Service} from "../decorators/service";
import InjectorService from "./injector";
import {IMiddleware} from "../interfaces/Middleware";

@Service()
export default class MiddlewareService {

    private static middlewares: Map<any, any> = new Map<any, any>();

    constructor(private injectorService: InjectorService) {

        MiddlewareService.middlewares.forEach((middleware, target) => {
            MiddlewareService.middlewares.set(target, injectorService.invoke(target));
        });

    }

    /**
     * Set a middleware in the registry.
     * @param target
     */
    static set(target: any) {
        this.middlewares.set(target, target);
        return this;
    }

    /**
     * Get a middleware in the registry.
     * @param target
     * @returns {T}
     */
    static get<T extends IMiddleware>(target: any): T {
        return this.middlewares.get(target);
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    get<T extends IMiddleware>(target: any): T {
        return MiddlewareService.get<T>(target);
    }
    /**
     * Get the use funtion middleware in the registry
     * @param target
     */
    use<T extends IMiddleware>(target: any): Function {
        return this.get<T>(target).use;
    }
}