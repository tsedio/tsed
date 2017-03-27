/**
 * @module di
 */
/** */
import {Type} from "../../core";
/**
 *
 */
export interface IProviderOptions<T> {
    /**
     * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
     */
    provide: any;

    /**
     * Class to instantiate for the `token`.
     */
    useClass?: Type<T>;

    /**
     *
     */
    instance?: T;
}