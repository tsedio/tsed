import {ProxyRegistry} from "../../core/class/ProxyRegistry";
/**
 * @module filters
 */
/** */
import {Registry} from "../../core/class/Registry";
import {Provider} from "../class/Provider";
import {IProviderOptions} from "../interfaces/IProviderOptions";

export const ProviderRegistry = new Registry<Provider<any>, IProviderOptions<any>>(Provider);

export abstract class ProxyProviderRegistry extends ProxyRegistry<Provider<any>, IProviderOptions<any>> {
    constructor() {
        super(ProviderRegistry);
    }
}