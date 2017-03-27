/**
 * @module filters
 */ /** */

import {Type} from "../../core/interfaces/Type";
import {FilterRegistry} from "../registries/FilterRegistry";
/**
 *
 * @returns {(target:any)=>undefined}
 * @decorator
 */
export function Filter(): Function {

    return <T>(target: Type<T>) => {

        FilterRegistry.merge(target, {provide: target, useClass: target});

    };
}