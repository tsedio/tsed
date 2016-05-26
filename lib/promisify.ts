import Promise = require("bluebird");
import * as Express from "express";
import {invoke, IInvokedFNResult, IInvokedFunction} from "./injector";

/**
 *
 * @param targetClass
 * @param originalMethod
 * @returns {function(Express.Request, Express.Response, Function): Promise<U>|Promise<U|U>}
 */

export function Promisify(targetClass: any, originalMethod: any): Function {

    return (request: Express.Request, response: Express.Response, next: Function): Promise<any> => {

        let fnInvResult: IInvokedFNResult;

        response.setHeader("X-Managed-By", "Express-router-decorator");
        response.setHeader("Content-Type", "text/json");

        // preset status code
        switch (request.method) {
            case "POST":
                response.status(201);
                break;

            default:
                //response.status(200);
                break;
        }

        return new Promise<any>((resolve, reject) => {

            let method: IInvokedFunction = typeof originalMethod === "string" ? targetClass[originalMethod] : originalMethod;

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

                if (data) {

                    if (request.method === "POST") {
                        // NOT STANDARD
                        
                        //response.location(request.path + "/" + data._id);
                    }
                    
                    response.json(data);
                }

                if (fnInvResult.impliciteNext) {
                    next();
                }

                return data;

            }, function(err){
                next(err);
                return Promise.reject(err);
            });
    };
}