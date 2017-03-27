import * as Express from "express";

import {EndpointBuilder} from "./EndpointBuilder";
import {ControllerProvider} from "./ControllerProvider";
import {Type} from "../../core/interfaces/Type";
import {ControllerRegistry} from "../registries/ControllerRegistry";

export class ControllerBuilder {

    constructor(private provider: ControllerProvider) {
        // console.log("Create controller =>", controller.provide.name);
        this.provider.router = Express.Router(this.provider.routerOptions);
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
                const ctrlBuilder = new ControllerBuilder(ctrlMeta).build();

                this.provider.router.use(ctrlMeta.path, ctrlBuilder.provider.router);
            });

        return this;
    }

}