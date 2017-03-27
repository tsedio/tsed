/**
 * @module converters
 */ /** */

import {Metadata} from "../../core/class/Metadata";
import {CONVERTER} from "../constants/index";
/**
 * `@Converter(...targetTypes)` let you to define some converters for a certain type/Class.
 * It usefull for a generic conversion.
 *
 * @param classes
 * @returns {(customConverter?:any)=>undefined}
 * @decorator
 */
export function Converter(...classes: any[]): Function {

    return customConverter => {

        classes.forEach(clazz =>
            Metadata.set(CONVERTER, customConverter, clazz)
        );

    };
}