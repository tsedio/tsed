
import {checkParamsRequired} from "./check-params-required";
import {MiddlewareFactory} from "./middleware-factory";
import {BadRequest} from "httpexceptions/lib/badrequest";

export function ParamsRequiredFactory(paramsRequired:any[], requestAttributes:string){

    return function(targetClass, methodClassName, descriptor) {

        MiddlewareFactory(targetClass, methodClassName, {
            handlers: [{
                method: 'required',
                callback: function (request, response, next) {

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