
import {checkParamsRequired} from "./check-params-required";
import {MiddlewareFactory} from "./middleware-factory";
import {BadRequest} from "httpexceptions";

export function ParamsRequiredFactory(type, paramsRequired){

    return function(targetClass, methodClassName, descriptor) {

        MiddlewareFactory(targetClass, methodClassName, {
            handlers: [{
                method: 'required',
                callback: function (request, response, next) {

                    var result = checkParamsRequired(request[type], paramsRequired);

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