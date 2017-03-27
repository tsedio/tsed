/**
 * @module filters
 */
/** */
import {Registry} from "../../core/class/Registry";
import {FilterProvider} from "../class/FilterProvider";
import {IProviderOptions} from "../../di/interfaces/ProviderOptions";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";

export const FilterRegistry = new Registry<FilterProvider, IProviderOptions<any>>(FilterProvider);

export abstract class ProxyFilterRegistry extends ProxyRegistry<FilterProvider, IProviderOptions<any>> {
    constructor() {
        super(FilterRegistry);
    }
}
