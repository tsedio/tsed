import {IProvider, registerProvider} from "@tsed/common";
import {Type} from "@tsed/core";

/**
 *
 * @param {Type<any> | IProvider<any>} provider
 * @param instance
 */
export function registerModel(provider: any | IProvider<any>, instance?: any): void {

    if (!provider.provide) {
        provider = {
            provide: provider
        };
    }

    provider = Object.assign({useClass: provider.provide, instance}, provider, {type: "factory"});
    registerProvider(provider);
}