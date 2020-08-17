import {ParamTypes, Req, Use, UseParamType} from "@tsed/common";
import {
  DecoratorParameters,
  decoratorTypeOf,
  DecoratorTypes,
  Metadata,
  Store,
  StoreMerge,
  StoreSet,
  UnsupportedDecoratorType,
  useDecorators,
  useMethodDecorators
} from "@tsed/core";
import {Consumes, Returns} from "@tsed/schema";
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
  const options = typeof name === "object" ? name : undefined;

  return (...args: DecoratorParameters): void => {
    switch (decoratorTypeOf(args)) {
      default:
        throw new UnsupportedDecoratorType(MultipartFile, args);

      case DecoratorTypes.PARAM:
        const [target, propertyKey, index] = args;
        const store = Store.fromMethod(target, String(propertyKey));
        const multiple = Metadata.getParamTypes(target, propertyKey)[index as number] === Array;
        const added = store.has("multipartAdded");

        name = (typeof name === "object" ? undefined : name)!;

        const expression = ["files", name, !multiple && "0"].filter(Boolean).join(".");

        const decorators = useDecorators(
          useMethodDecorators(
            Returns(400).Description(
              `<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1`
            ),
            Consumes("multipart/form-data"),
            StoreSet("multipartAdded", true),
            !added && Use(MultipartFileMiddleware),
            StoreMerge(
              MultipartFileMiddleware,
              name === undefined
                ? {
                    options,
                    any: true
                  }
                : {
                    fields: [
                      {
                        name,
                        maxCount
                      }
                    ],
                    options
                  }
            )
          ),
          Req(expression),
          UseParamType(ParamTypes.FORM_DATA)
        );

        decorators(...args);

        break;
    }
  };
}
