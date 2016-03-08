
import * as _ from 'lodash';

export interface iInvokedFunction extends Function{
    $inject: (Function|string)[]
}

export interface iLocalScope{
    request:any,
    response:any,
    next:Function
}

export function invoke(targetClass: any, method: iInvokedFunction, localScope: iLocalScope){

    let $inject:(Function|string)[] = method.$inject || ['request', 'response', 'next'];

    let injected = _.map($inject,
        (item) => (
            typeof item == 'function'
                ? (<Function>item)(localScope.request)
                : localScope[<string>item]
        )
    );

    return method.apply(targetClass, injected);
}

export function attachInject(method: iInvokedFunction, index:number, service: string|Function): void{
    method.$inject = method.$inject || [];
    method.$inject[index] = service;
}