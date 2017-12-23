import * as multer from "multer";
import {Metadata} from "../../core/class/Metadata";
import {Store} from "../../core/class/Store";
import {Type} from "../../core/interfaces";
import {descriptorOf} from "../../core/utils";
import {ParamRegistry} from "../../filters/registries/ParamRegistry";
import {UseBefore} from "../../mvc/decorators/method/useBefore";
import {MultipartFileFilter} from "../filters/MultipartFileFilter";
import {MultipartFilesFilter} from "../filters/MultipartFilesFilter";
import {MultipartFileMiddleware} from "../middlewares/MultipartFileMiddleware";

/**
 *
 * @param options
 * @returns {(target:Type<T>, propertyKey:string, parameterIndex:number)=>void}
 * @decorator
 */
export function MultipartFile(options?: multer.Options): Function {
    return <T>(target: Type<T>, propertyKey: string, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            // create endpoint metadata
            Store
                .fromMethod(target, propertyKey)
                .set(MultipartFileMiddleware, options);

            UseBefore(MultipartFileMiddleware)(target, propertyKey, descriptorOf(target, propertyKey));

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