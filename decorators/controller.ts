
import * as Express from "express";
import {MiddlewaresRegistry} from "./../lib/middlewares-registry.ts";

export function Controller(endpointUrl: string, ...ctrls){

    return (targetClass: Function): void => {

        targetClass.prototype.getRouter = function(){

            var router = Express.Router();

            if (this.middlewares) {
                _.each<MiddlewaresRegistry>(this.middlewares, (middlewareRegistry: MiddlewaresRegistry) => {
                    middlewareRegistry.build(router, endpointUrl);
                });
            }

            if(ctrls){
                _.each(ctrls, function(ctrl: any){
                    if(ctrl.getRouter){
                        router.use(endpointUrl, ctrl.getRouter());
                    }
                });
            }

            return this._router;
        };

    }
}