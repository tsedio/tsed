import * as Express from "express";
import {EndpointHandler} from "./endpoint-handler";
import * as Endpoints from "./endpoints";

export function Controller(endpointUrl: string, ...ctrls: any[]): Function {

    return (targetClass: Function): void => {

        targetClass.prototype.register = function(app: any): any {

            let router = Express.Router();

            Endpoints
                .get(targetClass)
                .forEach(function(endpointHandler: EndpointHandler){

                    let args = endpointHandler.toArray();

                    if (endpointHandler.hasMethod() && router[endpointHandler.getMethod()]){
                        args.shift();

                        if (args.length == 1){
                            router[endpointHandler.getMethod()]("/", args[0]);
                        } else {
                            router[endpointHandler.getMethod()](...args);
                        }

                    } else {
                        router.use(...endpointHandler.toArray());
                    }

                });

            /* istanbul ignore else */
            if (ctrls) {
                ctrls
                    .forEach(function(ctrl: any){
                        let instance = new ctrl();

                        instance.register(router);

                    });
            }

            app.use(endpointUrl, router);

            return router;
        };

    };
}