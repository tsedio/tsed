
export interface IInvokedFunction extends Function {
    $inject?: (Function|string)[];
}

export interface ILocalScope {
    request: any;
    response: any;
    next: Function;
}

export interface IInvokedFNResult {
    result: Promise<any> | any | void,
    impliciteNext: boolean
}

/**
 * Invoke a method of a controller and inject service requested (Request, Response, Next, etc...).
 * Note : The result return by the invoked method can be a promise or a value.
 * @param targetClass
 * @param method
 * @param localScope
 * @returns {any}
 */
export function invoke(targetClass: any, method: IInvokedFunction, localScope: ILocalScope): IInvokedFNResult {
    let $inject: (Function|string)[];
    let impliciteNext: boolean = false;

    if (method.$inject) {
        $inject = method.$inject;
        impliciteNext = $inject.indexOf('next') == -1;
    } else {
        impliciteNext = method.length < 3;
        $inject = ["request", "response", "next"];
    }

    let injected = $inject.map((item) => (
        typeof item === "function"
            ? (<Function>item)(localScope.request)
            : localScope[<string>item]
    ));

    return {
        result: method.apply(targetClass, injected),
        impliciteNext: impliciteNext
    };
}

/**
 * Create metadata to set a list of service. This service will be injected when the method is invoked with the function invoke.
 * @param method
 * @param index
 * @param service
 */
export function attachInject(method: IInvokedFunction, index: number, service: string|Function): void {
    method.$inject = method.$inject || [];
    method.$inject[index] = service;
}