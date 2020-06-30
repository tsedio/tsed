import {ParamTypes, Req, UseBefore, UseParamType, Use} from "@tsed/common";
import {applyDecorators, descriptorOf, getDecoratorType, Metadata, Store} from "@tsed/core";
import * as multer from "multer";
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
 * > See the tutorial on the [multer configuration](/tutorials/multer.md).
 *
 * @param name
 * @param maxCount
 * @returns Function
 * @decorator
 * @multer
 */
export function MultipartFile(name?: string | multer.Options, maxCount?: number): Function {
  return (target: any, propertyKey: string | symbol, index: number): void => {
    const type = getDecoratorType([target, propertyKey, index], true);

    switch (type) {
      default:
        throw new Error("MultipartFile is only supported on parameters");

      case "parameter":
        const store = Store.fromMethod(target, String(propertyKey));
        const multiple = Metadata.getParamTypes(target, propertyKey)[index] === Array;
        const options = typeof name === "object" ? name : undefined;
        const added = store.has("multipartAdded");

        name = (typeof name === "object" ? undefined : name)!;

        // create endpoint metadata
        store.merge("consumes", ["multipart/form-data"]).set("multipartAdded", true);
        store
          .merge("responses", {
            "400": {
              description: `<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName]
                            Example: File too long file1`
            }
          })
          .set("multipartAdded", true);

        if (!added) {
          // middleware is added
          Use(MultipartFileMiddleware)(target, propertyKey, descriptorOf(target, propertyKey));
        }

        if (name === undefined) {
          store.merge(MultipartFileMiddleware, {
            options,
            any: true
          });
        } else {
          store.merge(MultipartFileMiddleware, {
            fields: [
              {
                name,
                maxCount
              }
            ],
            options
          });
        }

        const expression = ["files", name, !multiple && "0"].filter(Boolean).join(".");

        applyDecorators(Req(expression), UseParamType(ParamTypes.FORM_DATA))(target, propertyKey, index);

        break;
    }
  };
}
