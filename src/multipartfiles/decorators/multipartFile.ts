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
 * Define a parameter as Multipart file.
 *
 * ```typescript
 * import {Controller, Post} from "ts-express-decorators";
 * import {Multer} from "@types/multer";
 *
 * type MulterFile = Express.Multer.File;
 *
 * @Controller('/')
 * class MyCtrl {
 *   @Post('/file')
 *   private uploadFile(@MultipartFile() file: MulterFile) {
 *
 *   }
 *
 *   @Post('/file')
 *   private uploadFile(@MultipartFile({dest: "/other-dir"}) file: MulterFile) {
 *
 *   }
 *
 *   @Post('/files')
 *   private uploadFile(@MultipartFile() files: MulterFile[]) {
 *
 *   }
 * }
 * ```
 *
 * > See the tutorial on the [multer configuration](tutorials/upload-files-with-multer.md).
 *
 * @param options
 * @returns {(target:Type<T>, propertyKey:string, parameterIndex:number)=>void}
 * @decorator
 * @multer
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