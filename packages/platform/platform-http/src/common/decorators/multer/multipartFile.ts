import {DecoratorParameters, Metadata, StoreMerge, useDecorators, useMethodDecorators} from "@tsed/core";
import {ParamTypes, UseParam} from "@tsed/platform-params";
import {InFile} from "@tsed/schema";

import {PlatformMulterFile} from "../../config/interfaces/PlatformMulterSettings.js";
import {MulterInputOptions, PlatformMulterMiddleware} from "../../middlewares/PlatformMulterMiddleware.js";

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
 * import {Post} from "@tsed/schema";
 * import {Controller, MulterOptions, MultipartFile} from "@tsed/platform-http";
 * import {Controller} from "@tsed/di";
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
 * > See the tutorial on the [multer configuration](/docs/upload-files.md).
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
      InFile(name),
      useMethodDecorators(StoreMerge(PlatformMulterMiddleware, mapOptions(name, maxCount))),
      UseParam({
        paramType: ParamTypes.FILES,
        dataPath: "$ctx.request.files",
        expression,
        useValidation: true
      })
    );

    decorators(...args);
  };
}

export type MultipartFile = PlatformMulterFile;
