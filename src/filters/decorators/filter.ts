/**
 * @module common/filters
 */ /** */

import {Type} from "../../core/interfaces";
import {FilterRegistry} from "../registries/FilterRegistry";
/**
 * Filter decorator declare a class as new Filter component.
 *
 * See [filters](docs/filters.md) section for more information.
 * @returns {(target:any)=>undefined}
 * @decorator
 */
export function Filter(): Function {

    return <T>(target: Type<T>) => {

        FilterRegistry.merge(target, {provide: target, useClass: target});

    };
}