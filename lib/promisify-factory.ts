import Promise = require('bluebird');
import {iPromise} from "../icrud";
import {invoke} from "./injector";

/**
 *
 * @param targetClass
 * @param originalMethod
 * @returns {function(Express.Request, Express.Response, Function): Promise<U>|Promise<U|U>}
 */

export function PromisifyFactory(targetClass: any, originalMethod: any){

    return (request:any, response:any, next:Function): Promise<any> => {

        return new Promise<any>((resolve, reject) => {

            let returnedValue: any = invoke(targetClass, originalMethod, {
                request:    request,
                response:   response,
                next:       next
            });

            if(returnedValue && returnedValue.then){
                returnedValue.then(resolve, reject);
            }else{
                resolve(returnedValue);
            }

        })
            .then(function(data){

                if(data){
                    response.setHeader('Content-Type', 'text/json');

                    switch(request.method){
                        case 'POST':

                            response.status(201);
                            response.location(request.path + '/' + data._id);
                            response.json(data);

                            break;

                        default:
                            response.status(200);
                            response.json(data);
                            break;
                    }
                }

                return data;

            }, function(err){
                next(err);
                return Promise.reject(err);
            });
    }
}