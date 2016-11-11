
import Metadata from '../metadata/metadata';
import {PARAM_TYPES, SERVICE, SERVICE_INSTANCE} from '../constants/metadata-keys';
import {getClassName} from '../utils/class';
import {UNKNOW_SERVICE} from '../constants/errors-msgs';
import {$log} from "ts-log-debug";

export default class InjectorService {

    /**
     *
     * @param target
     * @param locals
     */
    static invoke(target, locals: {[key: string]: any} = {}): any {

        const services = (Metadata.get(PARAM_TYPES, target) || [])
            .map((type: any) => {

                const serviceName = typeof type === 'function' ? getClassName(type) : type;

                if(serviceName in locals) {
                    return locals[serviceName];
                }

                if (!this.has(type)) {
                    throw Error(UNKNOW_SERVICE(serviceName))
                }

                return this.get(type);
            });

        return new target(...services);
    }

    /**
     *
     * @param target
     */
    static construct(target){

        Metadata
            .get(PARAM_TYPES, target)
            .forEach((type: any) => {

                if (!this.has(type)) {
                    this.construct(type);
                }

            });

        const instance = this.invoke(target);

        this.set(
            target,
            instance
        );

        $log.debug('[TSED]', getClassName(target), 'instantiated');

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
    static load(){

        Metadata
            .getTargetsFromPropertyKey(SERVICE)
            .forEach((target) => {

                if(!this.has(target)){
                    InjectorService.construct(target);
                }

            });


    }
}