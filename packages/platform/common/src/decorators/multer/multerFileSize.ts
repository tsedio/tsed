import {MulterOptions} from "./multerOptions";

/**
 * Define file size limit.
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
 *   @Post('/file2')
 *   @MulterFileSize(1024) // (Ko). Applied for all fields
 *   private uploadFile(@MultipartFile("file1") file: MulterFile, @MultipartFile("file2") file2: MulterFile) {
 *
 *   }
 * }
 * ```
 *
 * > See the tutorial on the [multer configuration](/tutorials/multer.md).
 * @param fileSize
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}
 * @decorator
 * @multer
 */
export function MulterFileSize(fileSize: number): MethodDecorator {
  return MulterOptions({limits: {fileSize}});
}
