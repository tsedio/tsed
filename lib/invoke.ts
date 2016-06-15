import {BadRequest} from "httpexceptions/lib/badrequest";

/**
 * Invoke a method of a controller and inject service requested (Request, Response, Next, etc...).
 * Note : The result return by the invoked method can be a promise or a value.
 * @param targetClass
 * @param method
 * @param localScope
 * @returns {any}
 */
export function invoke(targetClass: any, method: IInvokedFunction, localScope: IExpressParameters): IInvokedFNResult {
    let $inject: (Function|string)[];
    let impliciteNext: boolean = false;

    if (method.$inject) {
        $inject = method.$inject;
        impliciteNext = $inject.indexOf("next") === -1;
    } else {
        impliciteNext = method.length < 3;
        $inject = ["request", "response", "next"];
    }

    let injected = $inject.map((item) => (
        typeof item === "function"
            ? (<Function>item)(localScope.request)
            : localScope[<string>item]
    ));

    if (method.$required) {
        method.$required.forEach((index: number) => {
            /* istanbul ignore else */
            if (injected[index] === undefined) {
                let param: string = method.$metadata[index];
                throw new BadRequest(`Bad request, parameter request.${param} is required.`);
            }
        });
    }

    return {
        result: method.apply(targetClass, injected),
        impliciteNext: impliciteNext
    };
}
