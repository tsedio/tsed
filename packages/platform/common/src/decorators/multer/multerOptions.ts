import {StoreMerge} from "@tsed/core";
import {PlatformMulterSettings} from "../../config/interfaces/PlatformMulterSettings";
import {PlatformMulterMiddleware} from "../../middlewares/PlatformMulterMiddleware";

/**
 * Define multer option for all MultipartFile
 *
 * ```typescript
 * import {Controller, Post, PlatformMulterFile, MultipartFile, MulterOptions} from "@tsed/common";
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
 * See the tutorial on the [multer configuration](/tutorials/multer.md).
 *
 * @param {multer.Options} options
 * @returns {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}
 * @decorator
 * @multer
 */
export function MulterOptions(options: PlatformMulterSettings): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    StoreMerge(PlatformMulterMiddleware, {options})(target, propertyKey, descriptor);

    return descriptor;
  };
}
