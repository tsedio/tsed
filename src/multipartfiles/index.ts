// tslint:disable: no-unused-variable
import * as multer from "multer";

declare interface IServerSettings {
  multer?: multer.Options;
}
// tslint:enable: no-unused-variable

export * from "./decorators/multipartFile";
