/**
 * @module common/converters
 */
/** */

import {Metadata} from "@tsed/core";
import {registerProvider} from "../../di/registries/ProviderRegistry";
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

    return (target: any) => {

        /* istanbul ignore next */
        if (classes.length === 0) {
            throw new Error("Converter decorator need at least one type like String, Date, Class, etc...");
        }

        registerProvider({provide: target, type: "converter"});

        classes.forEach(clazz =>
            Metadata.set(CONVERTER, target, clazz)
        );
    };
}