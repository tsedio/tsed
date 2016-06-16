import Promise = require("bluebird");
import * as Express from "express";
import {invoke} from "./invoke";
import {IInvokedFunction} from "../interfaces/InvokedFunction";
import {IInvokedFNResult} from "../interfaces/InvokedFnResult";
/**
 *
 * @param targetClass
 * @param originalMethod
 * @returns {function(Express.Request, Express.Response, Function): Promise<U>|Promise<U|U>}
 */

export function Promisify(targetClass: any, originalMethod: any): Function {

    return (request: Express.Request, response: Express.Response, next: Express.NextFunction): Promise<any> => {

        let fnInvResult: IInvokedFNResult;

        response.setHeader("X-Managed-By", "Express-router-decorator");
        response.setHeader("Content-Type", "text/json");

        // preset status code
        if (request.method === "POST") {
            response.status(201);
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
            .then((data) => {
                if (data) {

                    // if (request.method === "POST") {
                        // NOT STANDARD
                    // response.location(request.path + "/" + data._id);
                    // }
                    response.json(data);
                }

                if (fnInvResult.impliciteNext) {
                    next();
                }

                return data;

            }, (err) => {
                next(err);
            });
    };
}