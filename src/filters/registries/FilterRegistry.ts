import {ProxyRegistry} from "../../core/class/ProxyRegistry";
/**
 * @module common/filters
 */
/** */
import {Registry} from "../../core/class/Registry";
import {IProviderOptions} from "../../di/interfaces/IProviderOptions";
import {FilterProvider} from "../class/FilterProvider";

export const FilterRegistry = new Registry<FilterProvider, IProviderOptions<any>>(FilterProvider);
