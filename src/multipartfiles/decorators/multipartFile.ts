/**
 * @module multiparfiles
 */ /** */

import {Metadata} from "../../core/class/Metadata";
import {Type} from "../../core/interfaces";
import {UseBefore} from "../../mvc/decorators/method/useBefore";
import {EndpointRegistry} from "../../mvc/registries/EndpointRegistry";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
import {MultipartFileFilter} from "../filters/MultipartFileFilter";
import {MultipartFilesFilter} from "../filters/MultipartFilesFilter";
import {MultipartFileMiddleware} from "../middlewares/MultipartFileMiddleware";

/**
 *
 * @param options
 * @returns {(target:Type<T>, propertyKey:string, parameterIndex:number)=>void}
 * @decorator
 */
export function MultipartFile(options?: any): Function {

    return <T>(target: Type<T>, propertyKey: string, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            // create endpoint metadata
            EndpointRegistry.setMetadata(MultipartFileMiddleware, options, target, propertyKey);

            UseBefore(MultipartFileMiddleware)(target, propertyKey, parameterIndex);

            // add filter
            const filter = Metadata.getParamTypes(target, propertyKey)[parameterIndex] === Array
                ? MultipartFilesFilter : MultipartFileFilter;

            ParamRegistry.useFilter(filter, {
                propertyKey,
                parameterIndex,
                target,
                useConverter: false
            });

        }

    };
}