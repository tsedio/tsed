/**
 * @module filters
 */
/** */
import {IProvider} from "../../di/interfaces/Provider";
/**
 *
 */
export interface IFilter {
    transform?(expression: string, request: Express.Request, response: Express.Response): any;
}
/**
 *
 */
export interface IFilterProvider<T extends IFilter> extends IProvider<T> {

}