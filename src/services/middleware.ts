
import {Service} from "../decorators/service";
import InjectorService from "./injector";
import {IMiddleware, IMiddlewareSettings} from "../interfaces/Middleware";
import {waiter} from "../utils/waiter";



@Service()
export default class MiddlewareService {

    private static middlewares: Map<any, IMiddlewareSettings<any>> = new Map<any, IMiddlewareSettings<any>>();

    constructor(private injectorService: InjectorService) {

        MiddlewareService.middlewares.forEach((settings, target) => {
            settings.instance = injectorService.invoke(target);

            MiddlewareService.middlewares.set(target, settings);
        });

    }

    /**
     * Set a middleware in the registry.
     * @param target
     * @param type
     */
    static set(target: any, type: string) {
        this.middlewares.set(target, {type});
        return this;
    }

    /**
     * Get a middleware in the registry.
     * @param target
     * @returns {T}
     */
    static get<T extends IMiddleware>(target: any): IMiddlewareSettings<T> {
        return this.middlewares.get(target);
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static has(target: any): boolean {
        return this.middlewares.has(target);
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    get<T extends IMiddleware>(target: any): IMiddlewareSettings<T> {
        return MiddlewareService.get<T>(target);
    }

    /**
     * Get the use funtion middleware in the registry
     * @param target
     */
    use<T extends IMiddleware>(target: any): Function {
        return this.get<T>(target).instance.use.bind(target);
    }

    /**
     *
     * @param target
     */
    bindMiddleware(target: any): Function {

        let fnMiddleware, type;

        if (MiddlewareService.has(target)) {// Middleware
            fnMiddleware = this.use(target);
            type = this.get(target).type;
        } else {
            fnMiddleware = target;
        }

        switch (fnMiddleware.length) {
            case 4:
                return function(err, request, response, next) {
                    waiter(fnMiddleware, err, request, response, next)
                        .catch(e => next(e));
                };

            case 3:
                if (type === 'error'){
                    return function(error, request, response, next) {
                        waiter(fnMiddleware, error, request, response)
                            .then(r => next(r))
                            .catch(e => next(e));
                    };
                }

                return function(request, response, next) {
                    waiter(fnMiddleware, request, response, next)
                        .catch(e => next(e));
                };

            default:
                return function(request, response, next) {
                    waiter(fnMiddleware, request, response)
                        .then(r => next(r))
                        .catch(e => next(e));
                };
        }

    }
}