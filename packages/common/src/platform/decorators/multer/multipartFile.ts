import {DecoratorParameters, Metadata, Store, StoreMerge, StoreSet, useDecorators, useMethodDecorators} from "@tsed/core";
import {Consumes, Returns} from "@tsed/schema";
import {PlatformMulterFile} from "../../../config/interfaces/PlatformMulterSettings";
import {Req, Use, UseParamType} from "../../../mvc/decorators";
import {ParamTypes} from "../../../mvc/models/ParamTypes";
import {MulterInputOptions, PlatformMulterMiddleware} from "../../middlewares/PlatformMulterMiddleware";

function mapOptions(name: string, maxCount: number | undefined): MulterInputOptions {
  return {
    fields: [
      {
        name,
        maxCount
      }
    ]
  };
}

/**
 * Define a parameter as Multipart file.
 *
 * ```typescript
 * import {Controller, Post} from "@tsed/common";
 * import {MulterOptions, MultipartFile} from "@tsed/common";
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
 * @input
 */
export function MultipartFile(name: string, maxCount?: number): ParameterDecorator {
  return (...args: DecoratorParameters): void => {
    const [target, propertyKey, index] = args;
    const multiple = Metadata.getParamTypes(target, propertyKey)[index as number] === Array;

    name = (typeof name === "object" ? undefined : name)!;

    const expression = [name, !multiple && "0"].filter(Boolean).join(".");

    const decorators = useDecorators(
      useMethodDecorators(
        Returns(400).Description(
          `<File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field>  [fieldName] Example: File too long file1`
        ),
        Consumes("multipart/form-data"),
        StoreMerge(PlatformMulterMiddleware, mapOptions(name, maxCount))
      ),
      Req({expression, useValidation: true}),
      UseParamType(ParamTypes.FILES)
    );

    decorators(...args);
  };
}

export type MultipartFile = PlatformMulterFile;
