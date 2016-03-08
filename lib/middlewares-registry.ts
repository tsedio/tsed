import {iHandlerMiddleware} from "./models/handler-middleware";
import {iMiddlewares} from "./models/middlewares";

import * as _ from "lodash";

const METHODS = ['all', 'get', 'put', 'post', 'delete', 'head'];

export class MiddlewaresRegistry{
    protected handlers: iHandlerMiddleware[] = [];
    protected path: string = '';
    protected defaultMethod: string;

    constructor(){

    }

    /**
     * Add new middleware
     * @param middlewares
     */
    public push(middlewares: iMiddlewares){

        if(middlewares.path){
            this.path = middlewares.path;
        }

        _.each<iHandlerMiddleware>(middlewares.handlers, (handler: iHandlerMiddleware) => {

            if(METHODS.indexOf(handler.method) > -1){
                this.defaultMethod = handler.method;
                this.handlers.push(handler);
            }else{

                if(handler.method == 'auth' || handler.method == "required"){
                    this.handlers.unshift(handler);
                }else{
                    this.handlers.push(handler);
                }
            }

        });

    }

    /**
     * Build middlewares
     * @param router
     * @param endpointUrl
     */
    public build(router, endpointUrl){

        var route = endpointUrl + this.path;

        _.each<iHandlerMiddleware>(this.handlers, (handler: iHandlerMiddleware) => {

            switch(handler.method){
                case 'required':
                case 'auth':
                    router[this.defaultMethod](route, handler.callback);
                    break;

                case 'param':
                    router.param(this.path, handler.callback);
                    break;

                default:
                    router[handler.method](route, handler.callback);

                    break;
            }

        });

    }
}