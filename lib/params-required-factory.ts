
import {checkParamsRequired} from "./check-params-required";
import {MiddlewareFactory} from "./middleware-factory";
import {BadRequest} from "httpexceptions/lib/badrequest";

export function ParamsRequiredFactory(paramsRequired:any[], requestAttributes:string): Function {

    return <T>(
        targetClass: any,
        methodClassName: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> => {

        MiddlewareFactory(targetClass, methodClassName, {
            handlers: [{
                method: 'required',
                callback: function(request: any, response: any, next: Function): void {

                    var result = checkParamsRequired(paramsRequired, request[requestAttributes]);

                    if (result.length) {
                        next(new BadRequest('Parameters required ' + result.join(', ') + '.'));
                    }else{
                        next();
                    }

                }
            }]
        });

        return descriptor;
    }
}