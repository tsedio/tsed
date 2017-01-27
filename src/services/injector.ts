
import Metadata from "../metadata/metadata";
import {SERVICE, SERVICE_INSTANCE, DESIGN_PARAM_TYPES} from "../constants/metadata-keys";
import {getClassName} from "../utils/class";
import {UNKNOW_SERVICE} from "../constants/errors-msgs";
import {$log} from "ts-log-debug";

export default class InjectorService {

    private static loaded: boolean = false;

    /**
     *
     * @param target
     * @param locals
     */
    static invoke<T>(target, locals: WeakMap<string|Function, any> = new WeakMap<string|Function, any>()): T {


        const services = this.getParams(target)
            .map((type: any) => {

                const serviceName = typeof type === "function" ? getClassName(type) : type;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(type)) {
                    return locals.get(type);
                }

                /* istanbul ignore next */
                if (!this.has(type)) {
                    throw Error(UNKNOW_SERVICE(serviceName));
                }

                return this.get(type);
            });

        return new target(...services);
    }

    /**
     *
     * @param target
     */
    static construct(target) {

        // TODO ... not necessary ?
        this.getParams(target)
            .forEach((type: any) => {

                /* istanbul ignore next */
                if (!this.has(type)) {
                    this.construct(type);
                }

            });

        const instance = this.invoke(target);

        this.set(
            target,
            instance
        );

        $log.debug("[TSED]", getClassName(target), "instantiated");

        return this;
    }


    /**
     *
     * @param target
     * @param instance
     * @returns {InjectorService}
     */
    static set(target, instance) {
        Metadata.set(SERVICE_INSTANCE, instance, target);
        return this;
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static get = (target) => Metadata.get(SERVICE_INSTANCE, target);

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static has = (target) => Metadata.has(SERVICE_INSTANCE, target);

    /**
     *
     */
    static load() {

        Metadata
            .getTargetsFromPropertyKey(SERVICE)
            .forEach((target) => {

                if (!this.has(target)) {
                    InjectorService.construct(target);
                }

            });


    }

    static getParams(target): any[]{
        return Metadata.get(DESIGN_PARAM_TYPES, target) || [];
    }
}