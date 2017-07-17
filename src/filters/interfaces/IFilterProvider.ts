/**
 * @module common/filters
 */
/** */
import {IProvider} from "../../di/interfaces";
import {IFilter} from "./IFilter";

/**
 *
 */
export interface IFilterProvider<T extends IFilter> extends IProvider<T> {

}