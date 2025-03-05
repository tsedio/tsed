import {MulterOptions} from "./multerOptions.js";

/**
 * Define file size limit.
 *
 * ```typescript
 * import {Post} from "@tsed/schema";
 * import {MulterOptions, MultipartFile} from "@tsed/platform-http";
 * import {Controller} from "@tsed/di";
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
 * > See the tutorial on the [multer configuration](/docs/upload-files.md).
 * @param fileSize
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}
 * @decorator
 * @multer
 */
export function MulterFileSize(fileSize: number): MethodDecorator {
  return MulterOptions({limits: {fileSize}});
}
