
import * as _ from "lodash";

export interface IInvokedFunction extends Function {
    $inject: (Function|string)[];
}

export interface ILocalScope {
    request: any;
    response: any;
    next: Function;
}

/**
 *
 * @param targetClass
 * @param method
 * @param localScope
 * @returns {any}
 */
export function invoke(targetClass: any, method: IInvokedFunction, localScope: ILocalScope): any {

    let $inject: (Function|string)[] = method.$inject || ["request", "response", "next"];

    let injected = _.map($inject,
        (item) => (
            typeof item === "function"
                ? (<Function>item)(localScope.request)
                : localScope[<string>item]
        )
    );

    return method.apply(targetClass, injected);
}

/**
 *
 * @param method
 * @param index
 * @param service
 */
export function attachInject(method: IInvokedFunction, index: number, service: string|Function): void {
    method.$inject = method.$inject || [];
    method.$inject[index] = service;
}