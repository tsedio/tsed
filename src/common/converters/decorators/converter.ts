/**
 * @module common/converters
 */
/** */

import {Metadata} from "@tsed/core";
import {CONVERTER} from "../constants/index";
import {registerConverter} from "../registries/ConverterRegistries";

/**
 * `@Converter(...targetTypes)` let you to define some converters for a certain type/Class.
 * It useful for a generic conversion.
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

    registerConverter({provide: target, type: "converter"});

    classes.forEach(clazz => Metadata.set(CONVERTER, target, clazz));
  };
}
