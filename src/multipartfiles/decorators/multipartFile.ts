import {ParamRegistry, ParamTypes, UseBefore} from "@tsed/common";
import {descriptorOf, getDecoratorType, Metadata, Store} from "@tsed/core";
import * as multer from "multer";
import {MultipartFileFilter} from "../components/MultipartFileFilter";
import {MultipartFilesFilter} from "../components/MultipartFilesFilter";
import {MultipartFileMiddleware} from "../middlewares/MultipartFileMiddleware";

/**
 * Define a parameter as Multipart file.
 *
 * ```typescript
 * import {Controller, Post} from "@tsed/common";
 * import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
 * import {Multer} from "@types/multer";
 *
 * type MulterFile = Express.Multer.File;
 *
 * @Controller('/')
 * class MyCtrl {
 *   @Post('/file')
 *   private uploadFile(@MultipartFile("file1") file: MulterFile) {
 *
 *   }
 *
 *   @Post('/file')
 *   @MulterOptions({dest: "/other-dir"})
 *   private uploadFile(@MultipartFile("file1") file: MulterFile) {
 *
 *   }
 *
 *   @Post('/file2')
 *   @MulterOptions({dest: "/other-dir"})
 *   private uploadFile(@MultipartFile("file1") file: MulterFile, @MultipartFile("file2") file2: MulterFile) {
 *
 *   }
 *
 *   @Post('/files')
 *   private uploadFile(@MultipartFile("file1") files: MulterFile[]) {
 *
 *   }
 * }
 * ```
 *
 * > See the tutorial on the [multer configuration](tutorials/upload-files-with-multer.md).
 *
 * @param name
 * @param maxCount
 * @returns Function
 * @decorator
 * @multer
 */
export function MultipartFile(name?: string | multer.Options, maxCount?: number): Function {
  return (target: any, propertyKey: string, parameterIndex: number): void => {
    const type = getDecoratorType([target, propertyKey, parameterIndex], true);

    switch (type) {
      default:
        throw new Error("MultipartFile is only supported on parameters");

      case "parameter":
        const store = Store.fromMethod(target, propertyKey);
        const multiple = Metadata.getParamTypes(target, propertyKey)[parameterIndex] === Array;
        const options = typeof name === "object" ? name : undefined;
        const added = store.has("multipartAdded");

        name = (typeof name === "object" ? undefined : name)!;

        // create endpoint metadata
        store.merge("consumes", ["multipart/form-data"]).set("multipartAdded", true);

        if (!added) {
          // middleware is added
          UseBefore(MultipartFileMiddleware)(target, propertyKey, descriptorOf(target, propertyKey));
        }

        if (name === undefined) {
          store.merge(MultipartFileMiddleware, {
            options,
            any: true
          });

          ParamRegistry.useFilter(multiple ? MultipartFilesFilter : MultipartFileFilter, {
            propertyKey,
            parameterIndex,
            target,
            useConverter: false,
            paramType: ParamTypes.FORM_DATA
          });
        } else {
          const expression = multiple ? (name as string) : name + ".0";

          store.merge(MultipartFileMiddleware, {
            fields: [
              {
                name,
                maxCount
              }
            ],
            options
          });

          ParamRegistry.useFilter(MultipartFilesFilter, {
            expression,
            propertyKey,
            parameterIndex,
            target,
            useConverter: false,
            paramType: ParamTypes.FORM_DATA
          });
        }

        break;
    }
  };
}
