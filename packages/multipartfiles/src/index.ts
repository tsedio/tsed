import * as multer from "multer";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    multer: multer.Options;
  }
}

export * from "./decorators/multipartFile";
export * from "./decorators/multerOptions";
export * from "./decorators/multerFileSize";
