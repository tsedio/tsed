
import Metadata from '../metadata/metadata';
import {PARAM_TYPES, SERVICE, SERVICE_INSTANCE} from '../constants/metadata-keys';
import {getClassName} from '../utils/class';
import {UNKNOW_SERVICE} from '../constants/errors-msgs';
import {$log} from "ts-log-debug";

export default class Service {

    /**
     *
     * @param target
     * @param locals
     */
    static invoke(target, locals: {[key: string]: any} = {}): any {

        const services = Metadata
            .get(PARAM_TYPES, target)
            .map((type: any) => {

                const serviceName = typeof type === 'function' ? getClassName(type) : type;

                if(serviceName in locals) {
                    return locals[serviceName];
                }

                if (!this.hasService(type)) {
                    throw Error(UNKNOW_SERVICE(serviceName))
                }

                return this.getService(type);
            });

        console.log(services);
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

                if (!this.hasService(type)) {
                    this.construct(type);
                }

            });

        const instance = this.invoke(target);

        this.setService(
            target,
            instance
        );

        $log.debug('[TSED]', getClassName(target), this.getService(target), 'instancied');

        return this;
    }


    /**
     *
     * @param target
     * @param instance
     * @returns {Service}
     */
    static setService(target, instance) {
        Metadata.set(SERVICE_INSTANCE, instance, target);
        return this;
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static getService = (target) => Metadata.get(SERVICE_INSTANCE, target);

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static hasService = (target) => Metadata.has(SERVICE_INSTANCE, target);

    /**
     *
     */
    static load(){

        Metadata
            .getTargetsFromPropertyKey(SERVICE)
            .forEach((target) => {

                if(!this.hasService(target)){
                    Service.construct(target);
                }

            });


    }
}