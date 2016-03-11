import {EndpointHandler} from "./endpoint-handler";
import WeakMap = require("weakmap");

const weakMap = new Map<string, Map>();

function getName(targetClass): string {
    return typeof targetClass === "function"
        ? targetClass.name
        : targetClass.constructor.name;
}

/**
 *
 * @param targetClass
 * @returns {Map<string, EndpointHandler>}
 */
export function create(targetClass: any): void {

    let name = getName(targetClass);

    if (!weakMap.has(name)) {
        weakMap.set(name, new Map<string, EndpointHandler>());
    }

}

/**
 *
 * @param targetClass
 * @returns {Map|V}
 */
export function get(targetClass: any): Map<string, EndpointHandler> {

    create(targetClass);

    return weakMap.get(getName(targetClass));
}

/**
 *
 * @param targetClass
 * @param methodClassName
 * @param args
 */
export function setHandler(targetClass: Function, methodClassName: symbol | string, args: any[]): void {

    let endpoints: Map<string, EndpointHandler> = get(targetClass);
    let endpointHandler: EndpointHandler;

    if(!endpoints.has(methodClassName)){

        endpointHandler = new EndpointHandler(targetClass, <string>methodClassName);
        endpoints.set(methodClassName, endpointHandler);

    } else {
        endpointHandler = endpoints.get(methodClassName);
    }

    endpointHandler.push(args);

}