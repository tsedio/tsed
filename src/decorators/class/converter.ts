
import Metadata from "../../services/metadata";
import {CONVERTER} from "../../constants/metadata-keys";
/**
 * `@Converter(...targetTypes)` let you to define some converters for a certain type/Class. It usefull for a generic conversion.
 *
 * @param classes
 * @returns {(customConverter?:any)=>undefined}
 * @constructor
 */
export function Converter(...classes: any[]): Function {

    return customConverter => {

        classes.forEach(clazz =>
            Metadata.set(CONVERTER, customConverter, clazz)
        );

    };
}