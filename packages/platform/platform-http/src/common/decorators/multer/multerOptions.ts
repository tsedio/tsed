import {MulterOptions as M} from "@tsed/platform-multer";

/**
 * Define multer option for all MultipartFile
 *
 * ```typescript
 * import {PlatformMulterFile, MultipartFile, MulterOptions} from "@tsed/platform-http";
 * import {Controller} from "@tsed/di";
 * import {Post} from "@tsed/schema";
 *
 * @Controller('/')
 * class MyCtrl {
 *   @Post('/file')
 *   private uploadFile(@MultipartFile("file1") file: PlatformMulterFile) {
 *
 *   }
 *
 *   @Post('/file')
 *   @MulterOptions({dest: "/other-dir"})
 *   private uploadFile(@MultipartFile("file1") file: PlatformMulterFile) {
 *
 *   }
 *
 *   @Post('/file2')
 *   @MulterOptions({dest: "/other-dir"})
 *   private uploadFile(@MultipartFile("file1") file: PlatformMulterFile, @MultipartFile("file2") file2: PlatformMulterFile) {
 *
 *   }
 *
 *   @Post('/files')
 *   private uploadFile(@MultipartFile("file1") files: PlatformMulterFile[]) {
 *
 *   }
 * }
 * ```
 *
 * See the tutorial on the [multer configuration](/docs/upload-files.md).
 *
 * @param {multer.Options} options
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}
 * @decorator
 * @multer
 * @deprecated use MulterOptions from @tsed/platform-multer
 */
export const MulterOptions: typeof M = M;
