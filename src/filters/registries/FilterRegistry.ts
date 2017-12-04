/**
 * @module common/filters
 */
/** */
import {Registry} from "../../core/class/Registry";
import {IProviderOptions} from "../../di/interfaces/IProviderOptions";
import {FilterProvider} from "../class/FilterProvider";
import {IFilterPreHandler} from "../interfaces/IFilterPreHandler";

export const FilterRegistry = new Registry<FilterProvider, IProviderOptions<any>>(FilterProvider);
export const FilterPreHandlers: Map<symbol, IFilterPreHandler> = new Map();
