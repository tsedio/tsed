/**
 * @module multiparfiles
 */ /** */

import {Type} from "../../core/interfaces/Type";
import {MultipartFileMiddleware} from "../middlewares/MultipartFileMiddleware";
import {UseBefore} from "../../mvc/decorators/method/useBefore";
import {Metadata} from "../../core/class/Metadata";
import {MultipartFileFilter, MultipartFilesFilter} from "../filters/MultipartFileFilter";
import {EndpointRegistry} from "../../mvc/registries/EndpointRegistry";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";

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