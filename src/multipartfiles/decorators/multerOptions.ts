import {getDecoratorType, Store} from "@tsed/core";
import * as Multer from "multer";
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
 *   private uploadFile(@MultipartFile("file1", 2) file: MulterFile) {
 *
 *   }
 *
 *   @Post('/file')
 *   private uploadFile(@MultipartFile("file1", {dest: "/other-dir"}) file: MulterFile) {
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
 * @param {multer.Options} options
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}
 * @decorator
 * @multer
 */
export function MulterOptions(options: Multer.Options) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const type = getDecoratorType([target, propertyKey, descriptor], true);

    switch (type) {
      default:
        throw new Error("MulterOptions is only supported on method");
      case "method":
        Store.fromMethod(target, propertyKey).merge(MultipartFileMiddleware, {
          options
        });

        return descriptor;
    }
  };
}
