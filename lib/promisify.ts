import Promise = require("bluebird");
import {invoke, IInvokedFNResult, IInvokedFunction} from "./injector";

/**
 *
 * @param targetClass
 * @param originalMethod
 * @returns {function(Express.Request, Express.Response, Function): Promise<U>|Promise<U|U>}
 */

export function Promisify(targetClass: any, originalMethod: any): Function {

    return (request: any, response: any, next: Function): Promise<any> => {

        let fnInvResult: IInvokedFNResult;

        return new Promise<any>((resolve, reject) => {

            let method: IInvokedFunction = typeof originalMethod == 'string' ? targetClass[originalMethod] : originalMethod;

            fnInvResult = invoke(targetClass, method, {
                request:    request,
                response:   response,
                next:       next
            });

            if (fnInvResult.result && fnInvResult.result.then) {
                fnInvResult.result.then(resolve, reject);
            } else {
                resolve(fnInvResult.result);
            }

        })
            .then(function(data){

                response.setHeader("X-Managed-By", "Express-router-decorator");

                if (data) {

                    response.setHeader("Content-Type", "text/json");

                    switch (request.method) {
                        case "POST":

                            response.status(201);
                            response.location(request.path + "/" + data._id);
                            response.json(data);

                            break;

                        default:
                            response.status(200);
                            response.json(data);
                            break;
                    }
                }

                if(fnInvResult.impliciteNext){
                    next();
                }

                return data;

            }, function(err){
                next(err);
                return Promise.reject(err);
            });
    };
}