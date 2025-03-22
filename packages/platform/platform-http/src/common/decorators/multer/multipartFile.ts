import type {MultipartFile as MType} from "@tsed/platform-multer";
import {MultipartFile as M} from "@tsed/platform-multer";

/**
 * Define a parameter as Multipart file.
 *
 * ```typescript
 * import {Post} from "@tsed/schema";
 * import {Controller, MulterOptions, MultipartFile} from "@tsed/platform-multer";
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
 * @deprecated use MultipartFile from @tsed/platform-multer
 */
export const MultipartFile: typeof M = M;
export type MultipartFile = MType;
