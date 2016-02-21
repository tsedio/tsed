
import * as Express from "express";
import {MiddlewaresRegistry} from "./../lib/middlewares-registry.ts";

export function Controller(endpointUrl:string, ...ctrls){

    return function (targetClass: Function){

        //add methods

        //targetClass.prototype._router = router;
        //targetClass.prototype.router = router;
        //targetClass.prototype.endpointUrl = endpointUrl;


        targetClass.prototype.getRouter = function(){

            var router = Express.Router();

            if (this.middlewares) {
                _.each<MiddlewaresRegistry>(this.middlewares, (middlewareRegistry:MiddlewaresRegistry) =>{
                    middlewareRegistry.build(router, endpointUrl);
                });
            }

            if(ctrls){
                _.each(ctrls, function(ctrl:any){
                    if(ctrl.getRouter){
                        router.use(endpointUrl, ctrl.getRouter());
                    }
                });
            }

            return this._router;
        };


    }
}