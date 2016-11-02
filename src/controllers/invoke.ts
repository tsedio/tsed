import {BadRequest} from "ts-httpexceptions";
import {IInvokableScope} from "../interfaces/InvokableScope";
import Metadata from '../metadata/metadata';
import {INJECT_SERV, INJECT_META, PARAMS_REQUIRED} from '../constants/metadata-keys';

/**
 * Invoke a method of a controller and inject service requested (Request, Response, Next, etc...).
 * Note : The result return by the invoked method can be a promise or a value.
 * @param instance
 * @param targetKey
 * @param localScope
 * @returns {any}
 */
export function invoke(instance: any, targetKey: string, localScope: IInvokableScope): any {

    let services = Metadata.get(INJECT_SERV, instance, targetKey);
    const metas = Metadata.get(INJECT_META, instance, targetKey);
    const paramsRequired = Metadata.get(PARAMS_REQUIRED, instance, targetKey);

    if(!services) {
        services = ["request", "response", "next"];
    }

    // eval all service, inject service
    services = services.map(item =>
        typeof item === "function"
            ? (<Function>item)(localScope.request)
            : localScope[<string>item]
    );

    if (paramsRequired) {
        paramsRequired.forEach((index: number) => {
            /* istanbul ignore else */
            if (services[index] === undefined) {
                const param: string = metas[index];
                throw new BadRequest(`Bad request, parameter request.${param} is required.`);
            }
        });
    }

    /* instanbul ignore next */
    // TODO SUPPORT OLD node version
    return Reflect.apply
        ? Reflect.apply(instance[targetKey], instance, services)
        : instance[targetKey].apply(instance, services);
}
