/**
 * @module common/mvc
 */
/** */
import * as Express from "express";
import {Type} from "../../core/interfaces/Type";
import {IRouterOptions} from "../interfaces";
import {ControllerRegistry} from "../registries/ControllerRegistry";
import {ControllerProvider} from "./ControllerProvider";

import {EndpointBuilder} from "./EndpointBuilder";

export class ControllerBuilder {

    constructor(private provider: ControllerProvider, private defaultRoutersOptions: IRouterOptions = {}) {
        // console.log("Create controller =>", controller.provide.name);
        this.provider.router = Express.Router(Object.assign({}, defaultRoutersOptions, this.provider.routerOptions));
    }

    /**
     *
     * @returns {any}
     */
    build(): this {
        const ctrl = this.provider;

        ctrl.endpoints.map(endpoint =>
            new EndpointBuilder(endpoint, this.provider.router).build()
        );

        ctrl.dependencies
            .forEach((child: Type<any>) => {
                const ctrlMeta = ControllerRegistry.get(child);
                const ctrlBuilder = new ControllerBuilder(ctrlMeta, this.defaultRoutersOptions).build();

                this.provider.router.use(ctrlMeta.path, ctrlBuilder.provider.router);
            });

        return this;
    }

}